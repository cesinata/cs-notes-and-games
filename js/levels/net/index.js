// levels/net/index.js
// The list of built levels for Packet Valley (Internet Technologies). To add a new level:
//   1. make its file in this folder,
//   2. import it below and add it to LEVELS,
//   3. add its text to the matching content/net/zone-N.json file.

import { layerCake } from './level-0-1-layer-cake.js';
import { encapsulationExpress } from './level-0-2-encapsulation-express.js';

export const LEVELS = {
  '0.1': layerCake,
  '0.2': encapsulationExpress
};
