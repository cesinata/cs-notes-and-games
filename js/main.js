// main.js
// Starts the game. It loads the list of regions (one per subject), then shows
// the right screen based on the web address:
//   #/                 the main page (about the project, and all subjects)
//   #/net/             Packet Valley's map      #/algo/            Algo Archipelago's map
//   #/net/zone/0       a district's levels      #/algo/zone/0      an island's levels
//   #/net/level/0.1    a level                  #/algo/level/0.1   a level
//   #/net/journal      the Field Journal        #/algo/journal
//   #/net/feed         the Feed                 #/algo/feed
// Older links that had no region (#/zone/0, #/level/0.1, #/feed, #/journal)
// still work: they are sent to the same page under #/net/.
// Using the address means the browser's Back button works as expected.

import { initStorage, setRegion, getLastPlace, setLastPlace } from './engine/storage.js';
import { loadWorld, loadZone, loadRegions, loadLanding, loadUiText } from './engine/content.js';
import { detectLang } from './engine/i18n.js';
import { zoneStatus, zoneStars } from './engine/progress.js';
import { runLevel } from './engine/level-flow.js';
import { showError } from './engine/ui.js';
import { allFieldNotes } from './engine/field-notes.js';
import { renderHub, renderZone } from './hub.js';
import { renderLanding } from './landing.js';
import { renderJournal } from './journal.js';
import { renderFeed, feedHubCard } from './feed.js';
import { LEVELS } from './levels/net/index.js';
import { ALGO_LEVELS } from './levels/algo/index.js';

const LEVEL_SETS = { net: LEVELS, algo: ALGO_LEVELS };
const app = document.getElementById('app');
let regions = null;
const worlds = new Map();
const zoneCache = new Map();

async function getWorld(region) {
  if (!worlds.has(region.id)) {
    const world = await loadWorld(region.world);
    world.base = `#/${region.id}/`;
    world.region = region;
    worlds.set(region.id, world);
  }
  return worlds.get(region.id);
}

async function getZoneContent(region, world, zoneIndex) {
  const info = world.zones[zoneIndex];
  if (!info || !info.file) return null;
  const file = region.dir + info.file;
  if (!zoneCache.has(file)) zoneCache.set(file, await loadZone(file, LEVEL_SETS[region.id]));
  return zoneCache.get(file);
}

async function builtZoneContents(region, world) {
  const contents = [];
  for (let i = 0; i < world.zones.length; i += 1) {
    if (world.zones[i].file) contents.push(await getZoneContent(region, world, i));
  }
  return contents;
}

const LEGACY_FIRST_PARTS = ['zone', 'level', 'feed', 'journal'];

// For each subject: stars earned so far and how many levels are built (for the landing page).
async function regionSummaries() {
  const summaries = [];
  for (const region of regions) {
    setRegion(region.id);
    const world = await getWorld(region);
    const builtIds = Object.keys(LEVEL_SETS[region.id]);
    let earned = 0;
    let max = 0;
    world.zones.forEach((zone) => {
      const builtHere = { ...zone, levels: zone.levels.filter((l) => builtIds.includes(l.id)) };
      const stars = zoneStars(builtHere);
      earned += stars.earned;
      max += stars.max;
    });
    summaries.push({ region, earned, max, builtCount: builtIds.length });
  }
  return summaries;
}

// The level the player opened last, for the "Continue where you left off" button.
async function resumeInfo() {
  const last = getLastPlace();
  const region = last && regions.find((r) => r.id === last.region);
  if (!region) return null;
  const world = await getWorld(region);
  for (const zone of world.zones) {
    const level = zone.levels.find((l) => l.id === last.level);
    if (level && LEVEL_SETS[region.id][level.id]) return { region, level, href: `#/${region.id}/level/${level.id}` };
  }
  return null;
}

function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

async function route() {
  try {
    if (!regions) regions = await loadRegions();
    const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean);

    if (!parts.length) {
      renderLanding(app, await loadLanding(), await regionSummaries(), await resumeInfo());
      window.scrollTo(0, 0);
      return;
    }
    // Old links had no region name. They all belonged to Packet Valley.
    if (LEGACY_FIRST_PARTS.includes(parts[0])) { go(`#/net/${parts.join('/')}`); return; }
    const region = regions.find((r) => r.id === parts[0]);
    if (!region) { go('#/'); return; }
    parts.shift();
    setRegion(region.id);
    const world = await getWorld(region);
    const levels = LEVEL_SETS[region.id];
    const base = world.base;
    const page = parts.join('/');
    const zoneMatch = page.match(/^zone\/(\d+)$/);
    const levelMatch = page.match(/^level\/(\d+)\.(\d+)$/);

    if (page === 'feed') {
      renderFeed(app, world, await builtZoneContents(region, world));
    } else if (page === 'journal') {
      renderJournal(app, world, allFieldNotes(await builtZoneContents(region, world)));
    } else if (zoneMatch) {
      const zoneIndex = Number(zoneMatch[1]);
      if (!world.zones[zoneIndex]) { go(base); return; }
      const content = zoneStatus(world, zoneIndex) === 'open' ? await getZoneContent(region, world, zoneIndex) : null;
      renderZone(app, world, zoneIndex, content, Object.keys(levels));
    } else if (levelMatch) {
      const zoneIndex = Number(levelMatch[1]);
      const levelId = `${levelMatch[1]}.${levelMatch[2]}`;
      const zoneInfo = world.zones[zoneIndex];
      if (!zoneInfo || zoneStatus(world, zoneIndex) !== 'open' || !levels[levelId]) {
        go(zoneInfo ? `${base}zone/${zoneIndex}` : base);
        return;
      }
      const content = await getZoneContent(region, world, zoneIndex);
      const level = content.levels.find((l) => l.id === levelId);
      if (!level) { go(`${base}zone/${zoneIndex}`); return; }
      const order = zoneInfo.levels.map((l) => l.id);
      const nextId = order.slice(order.indexOf(levelId) + 1).find((id) => levels[id]);
      const nextLevel = nextId ? zoneInfo.levels.find((l) => l.id === nextId) : null;
      setLastPlace(region.id, levelId);
      runLevel({
        app, world, zoneInfo, level,
        module: levels[levelId],
        nextLevel,
        onExit: () => go(`${base}zone/${zoneIndex}`),
        onNext: () => go(`${base}level/${nextId}`),
        onReplay: () => route()
      });
    } else {
      const contents = await builtZoneContents(region, world);
      renderHub(app, world, () => route(), allFieldNotes(contents), feedHubCard(world, contents), regions);
    }
    window.scrollTo(0, 0);
  } catch (error) {
    showError(app, error);
  }
}

initStorage();
detectLang();

// Everything loaded from content/ depends on the language, so a language change starts fresh.
async function changeLanguage() {
  worlds.clear();
  zoneCache.clear();
  regions = null;
  try {
    await loadUiText();
    await route();
  } catch (error) {
    showError(app, error);
  }
}

async function start() {
  try {
    await loadUiText();
  } catch (error) {
    showError(app, error);
    return;
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('languagechange', changeLanguage);
  route();
}

start();
