// levels/algo/index.js
// Built levels for Algo Archipelago (Algorithms and Complexity). Add new ones the
// same way as js/levels/net/index.js, with their text in content/algo/zone-N.json.

import { keepersToolkit } from './level-0-1-keepers-toolkit.js';
import { growthRace } from './level-0-2-growth-race.js';

export const ALGO_LEVELS = {
  '0.1': keepersToolkit,
  '0.2': growthRace
};
