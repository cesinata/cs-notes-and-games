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


// ---- lessons and "taughtOn" (teach before you test) ----
// Every question must point at the lesson page that taught it: "taughtOn": "page-id".
// In "play", a section can set taughtOn once for everything inside it.

function checkLessons(problems, level, where) {
  const ids = new Set();
  if (!needList(problems, level.lessons, `${where}.lessons`, 2)) return ids;
  if (level.lessons.length > 4) problems.push(`${where}.lessons has more than 4 pages. Keep it to 2 to 4.`);
  level.lessons.forEach((lesson, j) => {
    const at = `${where}.lessons[${j}]`;
    if (typeof lesson.id !== 'string' || !/^[a-z0-9-]+$/.test(lesson.id)) problems.push(`${at}.id should be a short code like "why-layers".`);
    else if (ids.has(lesson.id)) problems.push(`${at}.id "${lesson.id}" is used twice.`);
    else ids.add(lesson.id);
    needText(problems, lesson.title, `${at}.title`);
    if (needList(problems, lesson.text, `${at}.text`)) lesson.text.forEach((p, k) => needText(problems, p, `${at}.text[${k}]`));
    if (lesson.terms !== undefined && needList(problems, lesson.terms, `${at}.terms`)) {
      lesson.terms.forEach((item, k) => { needText(problems, item.term, `${at}.terms[${k}].term`); needText(problems, item.meaning, `${at}.terms[${k}].meaning`); });
    }
    if (lesson.table && (!Array.isArray(lesson.table.head) || !Array.isArray(lesson.table.rows) || lesson.table.rows.some((r) => !Array.isArray(r) || r.length !== lesson.table.head.length))) {
      problems.push(`${at}.table needs "head" (column names) and "rows" (each with the same number of cells).`);
    }
    if (lesson.predict) { needText(problems, lesson.predict.prompt, `${at}.predict.prompt`); needText(problems, lesson.predict.answer, `${at}.predict.answer`); }
    if (lesson.deeper) {
      needText(problems, lesson.deeper.title, `${at}.deeper.title`);
      if (needList(problems, lesson.deeper.text, `${at}.deeper.text`)) lesson.deeper.text.forEach((p, k) => needText(problems, p, `${at}.deeper.text[${k}]`));
    }
    if (needList(problems, lesson.references, `${at}.references`)) {
      lesson.references.forEach((ref, k) => {
        needText(problems, ref.title, `${at}.references[${k}].title`);
        if (typeof ref.url !== 'string' || !ref.url.startsWith('https://')) problems.push(`${at}.references[${k}].url should start with https://`);
      });
    }
  });
  return ids;
}

function joinReferences(level) {
  const seen = new Set();
  const joined = [];
  [...(level.lessons || []).flatMap((lesson) => lesson.references || []), ...(level.readMore || [])].forEach((ref) => {
    if (ref && ref.url && !seen.has(ref.url)) { seen.add(ref.url); joined.push(ref); }
  });
  return joined;
}

function checkTaughtOn(problems, value, lessonIds, where) {
  if (typeof value !== 'string') problems.push(`${where} needs "taughtOn": the id of the lesson page that teaches it.`);
  else if (!lessonIds.has(value)) problems.push(`${where}.taughtOn "${value}" isn't one of this level's lesson page ids.`);
}

// Walks the "play" section. Anything with hints, or with answer options, is a question and needs a lesson page.
function checkPlayTaughtOn(problems, node, lessonIds, where, inherited = null) {
  if (Array.isArray(node)) { node.forEach((item, i) => checkPlayTaughtOn(problems, item, lessonIds, `${where}[${i}]`, inherited)); return; }
  if (!node || typeof node !== 'object') return;
  const own = typeof node.taughtOn === 'string' ? node.taughtOn : inherited;
  if (node.taughtOn !== undefined) checkTaughtOn(problems, node.taughtOn, lessonIds, where);
  const isQuestion = Array.isArray(node.hints) || (Array.isArray(node.options) && node.options.some((o) => o && o.correct));
  if (isQuestion && !own) problems.push(`${where} is a question but has no "taughtOn" (set it here or on the section around it).`);
  // Stages made in code (like "rankTaughtOn") name their lesson page with a key ending in TaughtOn.
  Object.entries(node).forEach(([key, value]) => {
    if (key !== 'taughtOn' && key.endsWith('TaughtOn')) checkTaughtOn(problems, value, lessonIds, `${where}.${key}`);
    else if (key !== 'taughtOn') checkPlayTaughtOn(problems, value, lessonIds, `${where}.${key}`, own);
  });
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
      const lessonIds = checkLessons(problems, level, where);
      if (!level.everyday) problems.push(`${where}.everyday is missing (it needs "scene", "question" and "answer").`);
      else ['scene', 'question', 'answer'].forEach((key) => needText(problems, level.everyday[key], `${where}.everyday.${key}`));
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
          checkTaughtOn(problems, card.taughtOn, lessonIds, at);
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
      // "Read more" is every lesson page's references, joined and de-duplicated.
      level.readMore = joinReferences(level);
      if (level.readMore.length < 2) problems.push(`${where}: the lessons' references should give at least 2 different links.`);
      if (!level.play) {
        problems.push(`${where}.play is missing.`);
      } else {
        checkPlayTaughtOn(problems, level.play, lessonIds, `${where}.play`);
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
