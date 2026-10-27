// content.js
// Loads the text files in content/ and checks they have everything the game
// needs. If a file is broken, it throws a ContentError that names the file and
// lists each problem in plain English, so you know exactly what to fix.

import { getLang, setStrings, setGlossary } from './i18n.js';

export class ContentError extends Error {
  constructor(file, problems) {
    super(`Problem in content/${file}`);
    this.file = file;
    this.problems = problems;
  }
}

// A piece of text can be a plain string, or an object like
// { "text": "...", "verify": true, "verifyNote": "..." } when it needs checking.
export function textOf(item) {
  if (typeof item === 'string') return item;
  if (item && typeof item.text === 'string') return item.text;
  return '';
}

// Reads one file. With optional: true, a missing file returns null instead of an error
// (used for translations that don't exist yet).
async function readOne(file, { optional = false } = {}) {
  // The single-file preview build puts the content on the page directly.
  const bundled = globalThis.PACKET_VALLEY_CONTENT;
  if (bundled && bundled[file]) return JSON.parse(JSON.stringify(bundled[file]));

  let response;
  try {
    response = await fetch(`content/${file}`, { cache: 'no-cache' });
  } catch (error) {
    if (optional) return null;
    throw new ContentError(file, [
      "Couldn't load the file. If you opened index.html directly, start a local server instead (see README)."
    ]);
  }
  if (!response.ok) {
    if (optional) return null;
    throw new ContentError(file, [`Couldn't load the file (the server said ${response.status}).`]);
  }
  const raw = await response.text();
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new ContentError(file, [`This isn't valid JSON: ${error.message}. Look for a missing comma or quote near that spot.`]);
  }
}

// Puts a translation on top of the English file.
//  - Objects are merged key by key, so a translation only needs the keys it changes.
//  - Lists whose items have an "id" are merged by id (a translated level only needs its "id" and the text).
//  - A list of objects without ids (like answer options) is merged by position when the translation has the
//    same number of items, so flags like "correct" and "verify" stay from the English file.
//  - Any other list (plain text lines) is replaced whole, so copy the full list.
//  - Anything the translation leaves out stays in English.
function overlay(base, over) {
  const isObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
  if (Array.isArray(base) && Array.isArray(over)) {
    const hasIds = base.some((item) => isObject(item) && item.id !== undefined);
    if (!hasIds) {
      const sameShape = over.length === base.length && base.every(isObject) && over.every(isObject);
      return sameShape ? base.map((item, i) => overlay(item, over[i])) : over;
    }
    return base.map((item) => {
      const match = isObject(item) ? over.find((o) => isObject(o) && o.id === item.id) : undefined;
      return match === undefined ? item : overlay(item, match);
    });
  }
  if (isObject(base) && isObject(over)) {
    const merged = { ...base };
    Object.keys(over).forEach((key) => { merged[key] = key in base ? overlay(base[key], over[key]) : over[key]; });
    return merged;
  }
  return over === undefined || over === null ? base : over;
}

// Reads a content file in the player's language: the English file, with
// content/<language>/<same path> laid on top if it exists.
async function readJson(file) {
  const base = await readOne(file);
  const lang = getLang();
  if (lang === 'en') return base;
  const translated = await readOne(`${lang}/${file}`, { optional: true });
  return translated ? overlay(base, translated) : base;
}

// Button and label text (ui.json) and the list of terms kept in English (glossary.json).
export async function loadUiText() {
  const ui = await readJson('ui.json');
  setStrings(ui);
  const glossary = await readOne('glossary.json');
  if (!Array.isArray(glossary.terms) || !glossary.terms.length) {
    throw new ContentError('glossary.json', ['"terms" should be a list of words and phrases that stay in English.']);
  }
  setGlossary(glossary.terms);
}

// ---- small checking helpers ----

function needText(problems, value, where) {
  if (typeof textOf(value) !== 'string' || textOf(value).trim() === '') {
    problems.push(`${where} is missing or empty.`);
  }
}

function needList(problems, value, where, minLength = 1) {
  if (!Array.isArray(value) || value.length < minLength) {
    problems.push(`${where} should be a list with at least ${minLength} item(s).`);
    return false;
  }
  return true;
}

// ---- world.json ----

export async function loadRegions() {
  const file = 'regions.json';
  const data = await readJson(file);
  const problems = [];
  if (needList(problems, data.regions, 'regions')) {
    const ids = new Set();
    data.regions.forEach((r, i) => {
      ['id', 'name', 'subject', 'description', 'sprite', 'world'].forEach((key) => needText(problems, r[key], `regions[${i}].${key}`));
      if (r.bigFact !== undefined) needText(problems, r.bigFact, `regions[${i}].bigFact`);
      if (typeof r.dir !== 'string') problems.push(`regions[${i}].dir should be a folder name like "algo/", or "" for none.`);
      if (ids.has(r.id)) problems.push(`regions[${i}].id "${r.id}" is used twice.`);
      ids.add(r.id);
    });
  }
  if (problems.length) throw new ContentError(file, problems);
  return data.regions;
}

// The landing page text (content/landing.json).
export async function loadLanding() {
  const file = 'landing.json';
  const data = await readJson(file);
  const problems = [];
  ['title', 'tagline', 'whoTitle', 'howTitle', 'howIntro', 'extrasTitle', 'subjectsTitle', 'subjectsIntro', 'enter', 'progress', 'note']
    .forEach((key) => needText(problems, data[key], key));
  needList(problems, data.intro, 'intro');
  needList(problems, data.who, 'who');
  ['how', 'extras'].forEach((key) => {
    if (needList(problems, data[key], key)) {
      data[key].forEach((item, i) => {
        needText(problems, item.name, `${key}[${i}].name`);
        needText(problems, item.text, `${key}[${i}].text`);
      });
    }
  });
  if (!data.progressLevels) problems.push('progressLevels (with "one" and "other") is missing.');
  else ['one', 'other'].forEach((key) => needText(problems, data.progressLevels[key], `progressLevels.${key}`));
  if (problems.length) throw new ContentError(file, problems);
  return data;
}

export async function loadWorld(file = 'world.json') {
  const world = await readJson(file);
  const problems = [];
  needText(problems, world.title, 'title');
  needText(problems, world.tagline, 'tagline');
  needText(problems, world.starRules, 'starRules');
  needText(problems, world.listHeading, 'listHeading');
  if (needList(problems, world.zones, 'zones')) {
    world.zones.forEach((zone, i) => {
      const where = `zones[${i}]`;
      if (zone.id !== i) problems.push(`${where} should have "id": ${i} (zones must be in order).`);
      needText(problems, zone.name, `${where}.name`);
      needText(problems, zone.topic, `${where}.topic`);
      if (!zone.map || typeof zone.map.x !== 'number' || typeof zone.map.y !== 'number') {
        problems.push(`${where}.map needs numbers for x and y.`);
      }
      if (needList(problems, zone.levels, `${where}.levels`)) {
        zone.levels.forEach((level, j) => {
          needText(problems, level.id, `${where}.levels[${j}].id`);
          needText(problems, level.title, `${where}.levels[${j}].title`);
        });
      }
    });
  }
  if (world.funFacts !== undefined) {
    if (!Array.isArray(world.funFacts) || world.funFacts.length < 3 || world.funFacts.length > 5) problems.push('funFacts should be a list of 3 to 5 facts.');
    else world.funFacts.forEach((fact, i) => needText(problems, fact.text, `funFacts[${i}].text`));
  }
  if (!world.finale || !world.finale.map) problems.push('finale (with a map position) is missing.');
  if (!world.feed) problems.push('feed (the Daily Feed text) is missing.');
  else {
    ['title', 'intro', 'hubReady', 'start', 'next', 'doneTitle', 'doneText', 'doneTextPerfect'].forEach((key) => needText(problems, world.feed[key], `feed.${key}`));
    if (!world.feed.labels) problems.push('feed.labels is missing.');
  }
  if (!world.journal) problems.push('journal (the Field Journal text) is missing.');
  else ['title', 'intro', 'lockedText', 'hubText'].forEach((key) => needText(problems, world.journal[key], `journal.${key}`));
  if (problems.length) throw new ContentError(file, problems);
  return world;
}

// ---- zone-N.json ----
// levelModules lets each level check its own "play" section.

export async function loadZone(file, levelModules) {
  const zone = await readJson(file);
  const problems = [];
  if (needList(problems, zone.levels, 'levels')) {
    zone.levels.forEach((level, i) => {
      const where = `levels[${i}]${level.id ? ` (level ${level.id})` : ''}`;
      needText(problems, level.id, `${where}.id`);
      needText(problems, level.title, `${where}.title`);
      needText(problems, level.story, `${where}.story`);
      if (!level.learn) {
        problems.push(`${where}.learn is missing.`);
      } else {
        if (needList(problems, level.learn.bullets, `${where}.learn.bullets`, 3)) {
          level.learn.bullets.forEach((b, j) => needText(problems, b, `${where}.learn.bullets[${j}]`));
        }
      }
      if (level.hook) {
        needText(problems, level.hook.question, `${where}.hook.question`);
        needText(problems, level.hook.answer, `${where}.hook.answer`);
      }
      if (level.fieldNotes !== undefined && needList(problems, level.fieldNotes, `${where}.fieldNotes`)) {
        level.fieldNotes.forEach((note, j) => {
          needText(problems, note.title, `${where}.fieldNotes[${j}].title`);
          needText(problems, note.text, `${where}.fieldNotes[${j}].text`);
          if (note.source && (typeof note.source.url !== 'string' || !note.source.url.startsWith('https://'))) {
            problems.push(`${where}.fieldNotes[${j}].source.url should start with https://`);
          }
        });
      }
      if (level.feed !== undefined && needList(problems, level.feed, `${where}.feed`)) {
        const ids = new Set();
        level.feed.forEach((card, j) => {
          const at = `${where}.feed[${j}]`;
          if (!card.id) problems.push(`${at} needs an "id" (keep it the same forever, so saved progress still matches).`);
          else if (ids.has(card.id)) problems.push(`${at} uses the id "${card.id}" twice.`);
          ids.add(card.id);
          needText(problems, card.prompt, `${at}.prompt`);
          if (card.type === 'predict') needText(problems, card.answer, `${at}.answer`);
          else if (card.type === 'quiz' || card.type === 'why') {
            if ((card.options || []).filter((o) => o.correct).length !== 1) problems.push(`${at} should have exactly one option with "correct": true.`);
            needText(problems, card.explain, `${at}.explain`);
          } else problems.push(`${at}.type should be "quiz", "why" or "predict".`);
        });
      }
      if (!level.debrief) {
        problems.push(`${where}.debrief is missing.`);
      } else {
        needList(problems, level.debrief.summary, `${where}.debrief.summary`);
        if (!level.debrief.mistake) problems.push(`${where}.debrief.mistake is missing.`);
        else {
          needText(problems, level.debrief.mistake.title, `${where}.debrief.mistake.title`);
          needText(problems, level.debrief.mistake.text, `${where}.debrief.mistake.text`);
        }
      }
      if (needList(problems, level.readMore, `${where}.readMore`, 2)) {
        level.readMore.forEach((link, j) => {
          needText(problems, link.title, `${where}.readMore[${j}].title`);
          if (typeof link.url !== 'string' || !link.url.startsWith('https://')) {
            problems.push(`${where}.readMore[${j}].url should start with https://`);
          }
        });
      }
      if (!level.play) {
        problems.push(`${where}.play is missing.`);
      } else {
        const module = levelModules[level.id];
        if (module && typeof module.validatePlay === 'function') {
          module.validatePlay(level.play).forEach((p) => problems.push(`${where}.play: ${p}`));
        }
      }
    });
  }
  if (problems.length) throw new ContentError(file, problems);
  return zone;
}
