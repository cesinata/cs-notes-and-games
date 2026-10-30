// progress.js
// The game's rules for stars and unlocking, kept in one place so they're easy
// to find and change.
//
// Stars:     3 = no mistakes and no hints, 2 = up to 2 mistakes, 1 = finished.
// Unlocking: Town Square is always open. A district marked "skipped" in world.json is shown as
//            "Coming later" and never blocks anything. Each later district opens once every
//            core level in the district before it has at least 1 star.
//            The Grand Delivery opens when all districts' core levels are done.

import { getLevelResult } from './storage.js';

export function starsFor(mistakes, hintsUsed) {
  if (mistakes === 0 && hintsUsed === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

function coreDone(zone) {
  return zone.levels
    .filter((level) => level.core)
    .every((level) => {
      const result = getLevelResult(level.id);
      return result && result.stars >= 1;
    });
}

// Returns 'open', 'building' (unlocked, but no levels made yet), 'locked' or 'later' (skipped for now).
export function zoneStatus(world, zoneIndex) {
  const zone = world.zones[zoneIndex];
  if (zone.skipped) return 'later';
  const unlocked = zoneIndex === 0 || zonesBeforeAreDone(world, zoneIndex);
  if (!unlocked) return 'locked';
  return zone.file ? 'open' : 'building';
}

function zonesBeforeAreDone(world, zoneIndex) {
  for (let i = 0; i < zoneIndex; i += 1) {
    const zone = world.zones[i];
    if (zone.skipped) continue;
    if (!zone.file || !coreDone(zone)) return false;
  }
  return true;
}

export function finaleStatus(world) {
  return zonesBeforeAreDone(world, world.zones.length) ? 'building' : 'locked';
}

// Stars earned in a zone, and the most possible.
export function zoneStars(zone) {
  let earned = 0;
  zone.levels.forEach((level) => {
    const result = getLevelResult(level.id);
    if (result) earned += result.stars;
  });
  return { earned, max: zone.levels.length * 3 };
}
