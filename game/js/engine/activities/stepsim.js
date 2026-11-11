// stepsim.js
// "stepsim" activity: runs the Step Sim (watch, predict or count mode) on a script written in the
// content file. The sim has array, bars and graph views. See js/engine/step-sim.js for the script format.

import { el, focusHeading } from '../ui.js';
import { runStepSim } from '../step-sim.js';

export function renderStepSim({ activity, area, ctx, done }) {
  const heading = el('h2', {}, activity.prompt);
  area.append(heading);
  ctx.step([]);
  runStepSim({ ctx, container: area, script: activity.script, mode: activity.mode || 'watch', words: ctx.simWords, onDone: done });
  focusHeading(heading);
}
