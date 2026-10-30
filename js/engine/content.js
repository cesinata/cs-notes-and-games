// content.js
// Loads the text files in content/ and checks they have everything the game
// needs. If a file is broken, it throws a ContentError that names the file and
// lists each problem in plain English, so you know exactly what to fix.

import { getLang, setStrings, setGlossary } from './i18n.js';
import { textOf, needText, needList, validateWorld, validateZone } from './content-rules.js';

export class ContentError extends Error {
  constructor(file, problems) {
    super(`Problem in content/${file}`);
    this.file = file;
    this.problems = problems;
  }
}

export { textOf } from './content-rules.js';

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
  const problems = validateWorld(world);
  if (problems.length) throw new ContentError(file, problems);
  return world;
}

// The sample unit: a hidden test page (#/sample) that uses every activity type.
export async function loadSample() {
  const file = 'sample-unit.json';
  const zone = await readJson(file);
  const problems = validateZone(zone, {});
  if (problems.length) throw new ContentError(file, problems);
  const level = zone.levels[0];
  level.noSave = true; // a test page never records stars
  return level;
}

// ---- zone-N.json ----
export async function loadZone(file, levelModules) {
  const zone = await readJson(file);
  const problems = validateZone(zone, levelModules);
  if (problems.length) throw new ContentError(file, problems);
  return zone;
}
