// step-sim.js
// Step Sim runs an algorithm one step at a time, drawn as pixel crates (arrays)
// or as labelled bars. A level makes a "script": a list of steps, each with a
// picture of the data and a sentence saying what happened. Three modes:
//   watch    Back / Next through the steps, reading each explanation
//   predict  before a step that has a "predict" question, the player chooses
//            what happens next. First wrong guess: a hint. Second: the answer.
//   count    the player predicts a total (e.g. comparisons) first, then the
//            sim runs and counts, and compares the guess with the real number.
//
// A script looks like:
//   { view: 'array' or 'bars',
//     steps: [ { state, say, predict?: { prompt, options, hints }, count?: { name: 1 } } ],
//     countQuestion?: { prompt, options, hints, counter } }
// Array state:  { items: [{ value, mark?, tag? }], pointers: { 0: 'front' }, empty?: 'text' }
// Bars state:   { bars: [{ label, value }] }
// "words" are the button labels from world.json ("sim").

import { el, clear, focusHeading, announce, setText } from './ui.js';
import { t, getLocale } from './i18n.js';
import { choiceList, continueButton } from './choices.js';

// ---------- Views ----------

function drawArray(state) {
  const row = el('ol', { class: 'crates', 'aria-label': state.label || t('sim.crates') });
  if (!state.items.length) {
    return el('div', { class: 'crates-wrap' }, el('p', { class: 'crates-empty' }, state.empty || t('sim.empty')));
  }
  state.items.forEach((item, i) => {
    const pointer = state.pointers && state.pointers[i];
    row.append(el('li', { class: `crate${item.mark ? ` is-${item.mark}` : ''}` },
      pointer ? el('span', { class: 'crate-pointer' }, `▼ ${pointer}`) : el('span', { class: 'crate-pointer', 'aria-hidden': 'true' }, ' '),
      el('span', { class: 'crate-box' }, String(item.value)),
      el('span', { class: 'crate-index' }, item.tag || String(i))));
  });
  return el('div', { class: `crates-wrap${state.vertical ? ' is-vertical' : ''}` }, row);
}

function drawBars(state) {
  const max = Math.max(1, ...state.bars.map((b) => b.value));
  return el('ul', { class: 'bars' }, state.bars.map((bar) => el('li', { class: 'bar-row' },
    el('span', { class: 'bar-label' }, bar.label),
    el('span', { class: 'bar-track' },
      el('span', { class: 'bar-fill', style: `width:${Math.max(1, (bar.value / max) * 100)}%` })),
    el('span', { class: 'bar-value' }, bar.value.toLocaleString(getLocale())))));
}

const VIEWS = { array: drawArray, bars: drawBars };

// Draws one picture on its own (used by Learn card diagrams).
export function drawSimState(view, state) {
  return VIEWS[view](state);
}

// ---------- The simulator ----------

export function runStepSim({ ctx, container, script, mode = 'watch', words, onDone }) {
  const steps = script.steps;
  const draw = VIEWS[script.view];
  let index = 0;
  const totals = {};

  const picture = el('div', { class: 'sim-picture' });
  const caption = el('p', { class: 'sim-say', 'aria-live': 'polite' });
  const meta = el('p', { class: 'small sim-meta' });
  const controls = el('div', { class: 'sim-controls' });
  const panel = el('div', { class: 'sim-panel' });
  container.append(el('div', { class: 'sim' }, picture, caption, meta), panel);
  ctx.placeFeedback(container);
  container.append(controls);

  function addCounts(step) {
    Object.entries(step.count || {}).forEach(([name, n]) => { totals[name] = (totals[name] || 0) + n; });
  }

  function show(i) {
    index = i;
    const step = steps[i];
    clear(picture);
    picture.append(draw(step.state));
    setText(caption, step.say || '');
    const counterText = Object.entries(totals)
      .map(([name, value]) => words.counter.replace('{name}', name).replace('{value}', value)).join('. ');
    setText(meta, [words.stepOf.replace('{i}', i + 1).replace('{n}', steps.length), counterText].filter(Boolean).join('. '));
  }

  function finishButton() {
    clear(controls);
    controls.append(continueButton(words.finish, onDone));
  }

  // ---- watch ----
  function watchControls() {
    clear(controls);
    const back = el('button', { class: 'btn btn-quiet', type: 'button', disabled: index === 0 }, words.back);
    const next = el('button', { class: 'btn', type: 'button' }, index === steps.length - 1 ? words.finish : words.next);
    back.addEventListener('click', () => { show(index - 1); watchControls(); });
    next.addEventListener('click', () => {
      if (index === steps.length - 1) { onDone(); return; }
      show(index + 1);
      watchControls();
      next.focus();
    });
    controls.append(back, next);
  }

  // ---- predict ----
  function predictNext() {
    clear(panel);
    clear(controls);
    if (index === steps.length - 1) { finishButton(); return; }
    const upcoming = steps[index + 1];
    if (!upcoming.predict) {
      const next = el('button', { class: 'btn', type: 'button' }, words.next);
      next.addEventListener('click', () => { show(index + 1); predictNext(); });
      controls.append(next);
      window.setTimeout(() => next.focus(), 0);
      return;
    }
    const q = upcoming.predict;
    let wrong = 0;
    const heading = el('h3', {}, q.prompt);
    ctx.step(q.hints || []);
    panel.append(heading, choiceList({
      options: q.options,
      reducedMotion: ctx.reducedMotion,
      onCorrect: () => {
        ctx.correct(upcoming.say);
        show(index + 1);
        clear(panel);
        ctx.step([]);
        predictNext();
      },
      onWrong: () => {
        wrong += 1;
        if (wrong < 2) { ctx.mistake(); return; }
        // Second miss: count it, then show what really happens.
        ctx.mistake(`${words.revealed} ${upcoming.say}`);
        show(index + 1);
        clear(panel);
        ctx.step([]);
        predictNext();
      }
    }));
    focusHeading(heading);
  }

  // ---- count ----
  function countStart() {
    const q = script.countQuestion;
    const heading = el('h3', {}, q.prompt);
    ctx.step(q.hints || []);
    panel.append(heading, choiceList({
      options: q.options,
      reducedMotion: ctx.reducedMotion,
      onCorrect: (option) => startCounting(option.text, true),
      onWrong: (option) => { ctx.mistake(); startCounting(option.text, false); }
    }));
    focusHeading(heading);
  }

  function startCounting(guess, right) {
    clear(panel);
    ctx.step([]);
    panel.append(el('p', { class: 'sim-guess' }, t('sim.prediction', { guess })));
    function advance() {
      if (index === steps.length - 1) {
        const actual = totals[script.countQuestion.counter] || 0;
        const line = words.counted.replace('{guess}', guess).replace('{actual}', actual);
        if (right) ctx.correct(line);
        else ctx.mistake(line);
        announce(line);
        finishButton();
        return;
      }
      show(index + 1);
      addCounts(steps[index]);
      show(index);
      countControls();
    }
    function runAll() {
      while (index < steps.length - 1) { show(index + 1); addCounts(steps[index]); }
      show(index);
      advance();
    }
    function countControls() {
      clear(controls);
      if (index === steps.length - 1) { advance(); return; }
      const next = el('button', { class: 'btn', type: 'button', onclick: advance }, words.next);
      const all = el('button', { class: 'btn btn-quiet', type: 'button', onclick: runAll }, words.runToEnd);
      controls.append(next, all);
      window.setTimeout(() => next.focus(), 0);
    }
    countControls();
  }

  show(0);
  if (mode === 'watch') watchControls();
  else if (mode === 'predict') predictNext();
  else if (mode === 'count') countStart();
}
