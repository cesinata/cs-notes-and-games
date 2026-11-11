// check-content.mjs
// Checks every content file without opening the game. Plain Node, no npm packages.
//
//   node tools/check-content.mjs            check everything, list the facts marked "verify"
//   node tools/check-content.mjs --quiet    only print problems (no verify list)
//
// It uses the same rules as the game (js/engine/content-rules.js), so a file that passes here
// also loads in the game. Errors stop the game from loading a file, so they make this script exit
// with a failure. Warnings are things worth a look but not broken.
//
// What it does not do: check that links really open (that's done in one batch near launch),
// or run the game.

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { textOf, validateWorld, validateZone } from '../js/engine/content-rules.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quiet = process.argv.includes('--quiet');
const errors = [];
const warnings = [];
const verifyItems = [];
let filesChecked = 0;

const rel = (file) => path.relative(root, file);

async function readJson(file) {
  const raw = await readFile(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    errors.push(`${rel(file)}: not valid JSON (${error.message}).`);
    return null;
  }
}

// Level files that run in the browser. They may need the page to load, so a failure here is only a note.
async function loadLevelModules(regionDir) {
  const index = path.join(root, 'js', 'levels', regionDir.replace(/\/$/, ''), 'index.js');
  if (!existsSync(index)) return {};
  try {
    const mod = await import(pathToFileURL(index).href);
    return Object.values(mod).find((value) => value && typeof value === 'object') || {};
  } catch (error) {
    warnings.push(`${rel(index)}: couldn't be loaded outside the browser, so hand-built levels' own "play" checks were skipped (${error.message.split('\n')[0]}).`);
    return {};
  }
}

// ---- walks that find things inside any content ----

function walk(node, visit, where = '') {
  if (Array.isArray(node)) { node.forEach((item, i) => walk(item, visit, `${where}[${i}]`)); return; }
  if (!node || typeof node !== 'object') return;
  visit(node, where);
  Object.entries(node).forEach(([key, value]) => walk(value, visit, where ? `${where}.${key}` : key));
}

function collectVerify(file, data) {
  walk(data, (node, where) => {
    if (node.verify === true) verifyItems.push({ file: rel(file), where, note: node.verifyNote || '(no note)', text: textOf(node.text || node.title || node.prompt || '').slice(0, 70) });
  });
}

// ---- checks on a zone file ----

function wordCount(lesson) {
  return (lesson.text || []).map((p) => textOf(p)).join(' ').split(/\s+/).filter(Boolean).length;
}

function lessonWarnings(file, zone) {
  (zone.levels || []).forEach((level) => {
    const taught = new Set();
    walk(level, (node, where) => {
      if (typeof node.taughtOn === 'string') taught.add(node.taughtOn);
      Object.keys(node).filter((k) => k.endsWith('TaughtOn')).forEach((k) => taught.add(node[k]));
    });
    (level.lessons || []).forEach((lesson) => {
      const words = wordCount(lesson);
      if (words > 110 || words < 40) warnings.push(`${rel(file)}: level ${level.id}, lesson "${lesson.id}" has ${words} words (aim for about 60 to 90).`);
      if (!taught.has(lesson.id)) warnings.push(`${rel(file)}: level ${level.id}, lesson "${lesson.id}" isn't named by any question's "taughtOn". Is it tested?`);
    });
    const cards = (level.feed || []).length;
    if (cards && cards < 4) warnings.push(`${rel(file)}: level ${level.id} has ${cards} feed cards (aim for 4).`);
  });
}

async function checkZone(file, levelModules) {
  const zone = await readJson(file);
  if (!zone) return;
  filesChecked += 1;
  validateZone(zone, levelModules).forEach((problem) => errors.push(`${rel(file)}: ${problem}`));
  lessonWarnings(file, zone);
  collectVerify(file, zone);
}

// ---- translations: same shape as English? ----
// A translation list of objects (like answer options) must have the same number of items as the
// English one, or the game can't tell which "correct" flag belongs to which text.

function shapeWarnings(base, over, file, where = '') {
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  if (Array.isArray(base) && Array.isArray(over)) {
    const hasIds = base.some((item) => isObj(item) && item.id !== undefined);
    if (hasIds) {
      over.forEach((item) => {
        const match = base.find((b) => isObj(b) && b.id === item.id);
        if (!match) warnings.push(`${file}: ${where} has an item with id "${item.id}" that isn't in the English file.`);
        else shapeWarnings(match, item, file, `${where}#${item.id}`);
      });
    } else if (base.some(isObj)) {
      if (base.length !== over.length) warnings.push(`${file}: ${where} has ${over.length} items but the English has ${base.length}. The whole list will be replaced, so flags like "correct" get lost.`);
      else base.forEach((b, i) => shapeWarnings(b, over[i], file, `${where}[${i}]`));
    }
  } else if (isObj(base) && isObj(over)) {
    Object.entries(over).forEach(([key, value]) => {
      if (!(key in base)) warnings.push(`${file}: ${where}.${key} isn't in the English file (a typo?).`);
      else shapeWarnings(base[key], value, file, `${where}.${key}`);
    });
  }
}

async function checkTranslations() {
  const idDir = path.join(root, 'content', 'id');
  if (!existsSync(idDir)) return;
  async function list(dir) {
    const out = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...await list(full));
      else if (entry.name.endsWith('.json')) out.push(full);
    }
    return out;
  }
  for (const file of await list(idDir)) {
    const english = path.join(root, 'content', path.relative(idDir, file));
    const translated = await readJson(file);
    filesChecked += 1;
    if (!existsSync(english)) { warnings.push(`${rel(file)}: there is no English file with this name.`); continue; }
    const base = await readJson(english);
    if (translated && base) shapeWarnings(base, translated, rel(file));
  }
}

// ---- run everything ----

const regionsFile = path.join(root, 'content', 'regions.json');
const regions = (await readJson(regionsFile))?.regions || [];
filesChecked += 1;

for (const region of regions) {
  const worldFile = path.join(root, 'content', region.world);
  const world = await readJson(worldFile);
  if (!world) continue;
  filesChecked += 1;
  validateWorld(world).forEach((problem) => errors.push(`${rel(worldFile)}: ${problem}`));
  collectVerify(worldFile, world);
  const modules = await loadLevelModules(region.dir);
  for (const zone of world.zones || []) {
    if (!zone.file) continue;
    const zoneFile = path.join(root, 'content', region.dir, zone.file);
    if (!existsSync(zoneFile)) errors.push(`${rel(worldFile)}: zone ${zone.id} points to ${zone.file}, which doesn't exist.`);
    else await checkZone(zoneFile, modules);
  }
}
collectVerify(regionsFile, await readJson(regionsFile));

const sample = path.join(root, 'content', 'sample-unit.json');
if (existsSync(sample)) await checkZone(sample, {});

await checkTranslations();

// ---- report ----

console.log(`Checked ${filesChecked} content files.`);
if (errors.length) {
  console.log(`\n${errors.length} problem(s) to fix:`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
}
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s) worth a look:`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}
if (!quiet && verifyItems.length) {
  console.log(`\n${verifyItems.length} item(s) marked "verify" (for the correctness reviewer):`);
  verifyItems.forEach((v) => console.log(`  ? ${v.file} · ${v.where}\n      ${v.text ? `"${v.text}" ` : ''}— ${v.note}`));
}
if (!errors.length) console.log('\nNo problems found.');
process.exit(errors.length ? 1 : 0);
