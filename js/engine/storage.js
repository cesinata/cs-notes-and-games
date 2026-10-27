// storage.js
// Saves and loads the player's progress: best stars for each level, and the
// Feed's memory. Each region (subject) has its own progress, so Algo
// Archipelago level 0.1 never mixes with Packet Valley level 0.1.
// Progress lives in the browser's localStorage under one key. If the browser
// blocks storage (private mode, strict settings), we keep progress in memory
// instead, so the game still works. It just forgets when the page closes.

const STORAGE_KEY = 'packetValley.v1';

let progress = emptyProgress();
let storageWorks = false;
let region = 'net';

function emptyFeed() {
  return { cards: {}, streak: { lastDay: null, days: 0, best: 0 } };
}

function emptyProgress() {
  return { version: 2, levels: {}, feeds: {} };
}

// Version 1 saves had no regions: everything belonged to Packet Valley.
function upgrade(saved) {
  if (saved.version === 2) return { ...emptyProgress(), levels: saved.levels || {}, feeds: saved.feeds || {} };
  const upgraded = emptyProgress();
  Object.entries(saved.levels || {}).forEach(([id, result]) => { upgraded.levels[`net:${id}`] = result; });
  if (saved.feed && saved.feed.cards && saved.feed.streak) upgraded.feeds.net = saved.feed;
  return upgraded;
}

// Call once when the game starts. Returns true if progress can be saved.
export function initStorage() {
  try {
    const testKey = STORAGE_KEY + '.test';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    storageWorks = true;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') progress = upgrade(parsed);
    }
  } catch (error) {
    storageWorks = false;
    console.warn('Pocket Atlas: progress will not be saved on this device.', error);
  }
  return storageWorks;
}

// Which region's progress the next calls read and write.
export function setRegion(regionId) {
  region = regionId;
}

export function isStorageAvailable() {
  return storageWorks;
}

// Returns { stars, mistakes, hints } for a level, or null if never finished.
export function getLevelResult(levelId) {
  return progress.levels[`${region}:${levelId}`] || null;
}

// Records a finished level. Keeps the best stars ever earned.
export function saveLevelResult(levelId, result) {
  const key = `${region}:${levelId}`;
  const previous = progress.levels[key];
  const improved = !previous || result.stars > previous.stars;
  if (improved) {
    progress.levels[key] = { stars: result.stars, mistakes: result.mistakes, hints: result.hints };
    writeToStorage();
  }
  return { best: progress.levels[key], improved };
}

// Daily Feed memory for the current region.
export function getFeedData() {
  if (!progress.feeds[region]) progress.feeds[region] = emptyFeed();
  return progress.feeds[region];
}

export function saveFeedData() {
  writeToStorage();
}

// Clears the current region only.
export function resetProgress() {
  Object.keys(progress.levels).forEach((key) => {
    if (key.startsWith(`${region}:`)) delete progress.levels[key];
  });
  delete progress.feeds[region];
  writeToStorage();
}

function writeToStorage() {
  if (!storageWorks) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('Pocket Atlas: could not save progress.', error);
  }
}
