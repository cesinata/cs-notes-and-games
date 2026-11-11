// level-0-1-keepers-toolkit.js
// Algo Archipelago 0.1 Lighthouse Keeper's Toolkit. The player:
//   1. matches 5 islanders' needs to a stack, queue, array or linked list,
//   2. runs a stack of crates in Step Sim (Predict mode): which crate pops off?
//   3. runs the ferry queue the same way: who boards next?
// All words are in content/algo/zone-0.json (level "0.1", "play").

import { el, clear, focusHeading } from '../../engine/ui.js';
import { choiceList, continueButton } from '../../engine/choices.js';
import { t } from '../../engine/i18n.js';
import { makeSprite } from '../../engine/sprites.js';
import { runStepSim, drawSimState } from '../../engine/step-sim.js';

const CAPS = ['#B5523B', '#7D5A9E', '#2F7F86', '#C9802F', '#3E7039'];

function fill(text, values) {
  return Object.entries(values).reduce((t, [k, v]) => t.split(`{${k}}`).join(v), text);
}

// Turns a list of push/pop (or enqueue/dequeue) operations into Step Sim steps.
export function buildScript(ops, W, kind) {
  const isStack = kind === 'stack';
  let items = [];
  const picture = (newIndex = -1) => {
    const pointers = {};
    if (items.length) {
      if (isStack) {
        pointers[items.length - 1] = W.top;
        if (items.length > 1) pointers[0] = W.bottom;
      } else {
        pointers[0] = items.length > 1 ? W.front : `${W.front} / ${W.back}`;
        if (items.length > 1) pointers[items.length - 1] = W.back;
      }
    }
    return {
      items: items.map((v, i) => ({ value: v, mark: i === newIndex ? 'new' : null })),
      pointers,
      vertical: isStack,
      empty: W.empty,
      label: isStack ? t('sim.stackLabel') : t('sim.queueLabel')
    };
  };
  const steps = [{ state: picture(), say: isStack ? W.start : W.startQueue }];
  ops.forEach(([op, value]) => {
    if (op === 'push' || op === 'enqueue') {
      items = items.concat([value]);
      steps.push({ state: picture(items.length - 1), say: fill(W[op], { v: value }) });
    } else {
      const options = items.map((v) => ({ text: String(v) }));
      const leaving = isStack ? items[items.length - 1] : items[0];
      options.forEach((o) => { if (o.text === String(leaving)) o.correct = true; });
      items = isStack ? items.slice(0, -1) : items.slice(1);
      steps.push({
        state: picture(),
        say: fill(W[op], { v: leaving }),
        predict: { prompt: isStack ? W.popAsk : W.dequeueAsk, options, hints: isStack ? W.popHints : W.dequeueHints }
      });
    }
  });
  return { view: 'array', steps };
}

export const keepersToolkit = {
  id: '0.1',

  validatePlay(play) {
    const problems = [];
    if (!Array.isArray(play.needs) || !play.needs.length) problems.push('"needs" should be a list.');
    else play.needs.forEach((n, i) => {
      if ((n.options || []).filter((o) => o.correct).length !== 1) problems.push(`needs[${i}] should have exactly one correct option.`);
    });
    ['stackOps', 'queueOps'].forEach((key) => {
      if (!Array.isArray(play[key])) problems.push(`"${key}" should be a list of operations.`);
      else play[key].forEach((op, i) => {
        if (!['push', 'pop', 'enqueue', 'dequeue'].includes(op[0])) problems.push(`${key}[${i}] has an unknown operation "${op[0]}".`);
      });
    });
    if (!play.words) problems.push('"words" is missing.');
    return problems;
  },

  // Lesson pictures, chosen by the lesson's "diagram" name.
  lessonDiagram(name, level) {
    if (name === 'arrayAndList') return arrayAndListDiagram();
    const W = level.play.words;
    return el('div', { class: 'learn-sims' },
      el('div', {}, el('p', { class: 'small' }, t('toolkit.stack')),
        drawSimState('array', { items: [{ value: 3 }, { value: 7 }, { value: 1 }], pointers: { 2: W.top, 0: W.bottom }, vertical: true, label: t('toolkit.stackAria') })),
      el('div', {}, el('p', { class: 'small' }, t('toolkit.queue')),
        drawSimState('array', { items: [{ value: 'Ana' }, { value: 'Ben' }, { value: 'Cy' }], pointers: { 0: W.front, 2: W.back }, label: t('toolkit.queueAria') })));
  },

  play(ctx) {
    const P = ctx.text;
    const area = ctx.area;
    const words = ctx.simWords;
    const stages = [];
    P.needs.forEach((need, i) => stages.push((next) => askNeed(need, i, next)));
    stages.push((next) => runSim(P.stackTitle, P.stackIntro, buildScript(P.stackOps, P.words, 'stack'), next));
    stages.push((next) => runSim(P.queueTitle, P.queueIntro, buildScript(P.queueOps, P.words, 'queue'), next));
    let at = 0;
    function runNext() {
      if (at >= stages.length) { ctx.finish(); return; }
      ctx.clearFeedback();
      clear(area);
      stages[at++](runNext);
    }
    runNext();

    function askNeed(need, i, next) {
      const heading = el('h2', {}, P.needsTitle);
      const after = el('div', { class: 'stage-after' });
      area.append(
        el('p', { class: 'small' }, t('level.islanderOf', { i: i + 1, n: P.needs.length })),
        heading,
        i === 0 ? el('p', {}, P.needsIntro) : null,
        el('div', { class: 'customer' },
          el('span', { class: 'customer-art' }, makeSprite('courier', 4, { c: CAPS[i % CAPS.length] })),
          el('blockquote', { class: 'speech' }, el('p', { class: 'speech-name' }, need.who), el('p', {}, need.need))),
        choiceList({
          options: need.options,
          label: t('toolkit.tools'),
          reducedMotion: ctx.reducedMotion,
          onCorrect: () => { ctx.step([]); ctx.correct(need.explain); after.append(continueButton(t('level.continue'), next)); },
          onWrong: () => ctx.mistake()
        }));
      ctx.placeFeedback(area);
      area.append(after);
      ctx.step(need.hints);
      focusHeading(heading);
    }

    function runSim(title, intro, script, next) {
      const heading = el('h2', {}, title);
      area.append(heading, el('p', {}, intro));
      ctx.step([]);
      runStepSim({ ctx, container: area, script, mode: 'predict', words, onDone: next });
      focusHeading(heading);
    }
  }
};

// Lesson picture: an array (numbered slots side by side) against a linked list (each item points to the next).
function arrayAndListDiagram() {
  const items = ['tide', 'moon', 'wind', 'salt'];
  return el('div', { role: 'group', 'aria-label': t('toolkit.arrayListAria') },
    el('p', { class: 'small' }, t('toolkit.array')),
    el('div', { class: 'ds-row' }, items.map((item, i) =>
      el('span', { class: 'ds-cell' }, el('span', { class: 'ds-index' }, String(i)), item))),
    el('p', { class: 'small' }, t('toolkit.linkedList')),
    el('div', { class: 'ds-row' }, items.map((item, i) => [
      el('span', { class: 'ds-cell' }, item),
      i < items.length - 1 ? el('span', { class: 'ds-arrow', 'aria-hidden': 'true' }, '→') : el('span', { class: 'ds-cell' }, t('toolkit.end'))
    ])));
}
