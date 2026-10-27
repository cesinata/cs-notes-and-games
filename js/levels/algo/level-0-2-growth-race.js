// level-0-2-growth-race.js
// Algo Archipelago 0.2 Growth Race. The player:
//   1. ranks growth rates from gentlest to steepest,
//   2. races 100n against n² in Step Sim (Predict mode, bar view),
//   3. judges true/false claims about O, Ω and Θ,
//   4. counts comparisons for "find the biggest crate" in Step Sim (Count mode),
//   5. generalises: n crates take n − 1 comparisons, so Θ(n).
// All words are in content/algo/zone-0.json (level "0.2", "play").

import { el, clear, focusHeading, shuffle } from '../../engine/ui.js';
import { choiceList, continueButton, wobble } from '../../engine/choices.js';
import { t } from '../../engine/i18n.js';
import { runStepSim } from '../../engine/step-sim.js';

function fill(text, values) {
  return Object.entries(values).reduce((t, [k, v]) => t.split(`{${k}}`).join(v), text);
}
const fmt = (n) => n.toLocaleString('en-AU');
const COST = { '100n': (n) => 100 * n, n2: (n) => n * n };

function raceScript(P) {
  const [a, b] = P.raceBoats;
  const steps = [{ state: { bars: [{ label: a.name, value: 0 }, { label: b.name, value: 0 }] }, say: P.raceStart }];
  P.raceMarks.forEach((n, i) => {
    const va = COST[a.f](n);
    const vb = COST[b.f](n);
    const winner = va === vb ? P.raceTie : (va < vb ? a.name : b.name);
    const vals = { n: fmt(n), a: fmt(va), b: fmt(vb) };
    const last = i === P.raceMarks.length - 1;
    steps.push({
      state: { bars: [{ label: a.name, value: va }, { label: b.name, value: vb }] },
      say: fill(P.raceSay, vals) + (last ? ` ${P.raceDone}` : ''),
      predict: {
        prompt: fill(P.raceAsk, vals),
        options: [a.name, b.name, P.raceTie].map((t) => ({ text: t, correct: t === winner })),
        hints: P.raceHints.map((h) => fill(h, vals))
      }
    });
  });
  return { view: 'bars', steps };
}

function countScript(P) {
  const crates = P.countCrates;
  const W = P.words;
  let best = 0;
  const pic = (compare) => {
    const pointers = { [best]: W.biggest };
    if (compare !== undefined && compare !== best) pointers[compare] = W.comparing;
    return {
      items: crates.map((v, i) => ({ value: v, mark: i === best ? 'best' : (i === compare ? 'compare' : null) })),
      pointers,
      label: 'Crates, left to right'
    };
  };
  const steps = [{ state: pic(), say: P.countStart }];
  for (let i = 1; i < crates.length; i += 1) {
    const bigger = crates[i] > crates[best];
    const say = `${fill(P.countSay, { v: crates[i], m: crates[best] })} ${bigger ? fill(P.countNew, { v: crates[i] }) : fill(P.countKeep, { m: crates[best] })}`;
    if (bigger) best = i;
    steps.push({ state: pic(i), say, count: { [W.comparisons]: 1 } });
  }
  steps.push({ state: pic(), say: fill(P.countEnd, { m: crates[best] }) });
  const answer = String(crates.length - 1);
  return {
    view: 'array',
    steps,
    countQuestion: {
      prompt: P.countPrompt,
      options: P.countOptions.map((t) => ({ text: t, correct: t === answer })),
      hints: P.countHints,
      counter: W.comparisons
    }
  };
}

export const growthRace = {
  id: '0.2',

  validatePlay(play) {
    const problems = [];
    if (!Array.isArray(play.rankItems) || play.rankItems.length < 3) problems.push('"rankItems" needs at least 3 items.');
    if (!Array.isArray(play.raceBoats) || play.raceBoats.length !== 2 || play.raceBoats.some((b) => !COST[b.f])) {
      problems.push('"raceBoats" needs 2 boats, each with "f" set to "100n" or "n2".');
    }
    (play.statements || []).forEach((s, i) => {
      if ((s.options || []).filter((o) => o.correct).length !== 1) problems.push(`statements[${i}] needs exactly one correct option.`);
    });
    if (!(play.countOptions || []).includes(String((play.countCrates || []).length - 1))) {
      problems.push('"countOptions" must include the right answer (number of crates minus 1).');
    }
    if ((play.followOptions || []).filter((o) => o.correct).length !== 1) problems.push('"followOptions" needs exactly one correct option.');
    return problems;
  },

  // Learn card: a small table of how fast each function grows.
  learnDiagram() {
    const rows = [[10, 100, '1,024'], [20, 400, '1,048,576'], [30, 900, '1,073,741,824']];
    return el('div', { class: 'growth-table-wrap' },
      el('table', { class: 'growth-table' },
        el('thead', {}, el('tr', {}, ['n', 'n²', '2ⁿ'].map((h) => el('th', { scope: 'col' }, h)))),
        el('tbody', {}, rows.map((r) => el('tr', {}, r.map((c) => el('td', {}, typeof c === 'number' ? fmt(c) : c)))))));
  },

  play(ctx) {
    const P = ctx.text;
    const area = ctx.area;
    const stages = [
      (next) => rank(next),
      (next) => sim(P.raceTitle, P.raceIntro, raceScript(P), 'predict', next),
      ...P.statements.map((s, i) => (next) => question(P.tfTitle, i === 0 ? P.tfIntro : null, s, `Claim ${i + 1} of ${P.statements.length}`, next)),
      (next) => sim(P.countTitle, P.countIntro, countScript(P), 'count', next),
      (next) => question(P.countTitle, null, { prompt: P.followPrompt, options: P.followOptions, hints: P.followHints, explain: P.followExplain }, null, next)
    ];
    let at = 0;
    function runNext() {
      if (at >= stages.length) { ctx.finish(); return; }
      ctx.clearFeedback();
      clear(area);
      stages[at++](runNext);
    }
    runNext();

    function rank(next) {
      let placed = 0;
      const heading = el('h2', {}, P.rankTitle);
      const lineUp = el('ol', { class: 'rank-line', 'aria-label': 'Boats lined up, gentlest first' });
      const tray = el('div', { class: 'tray', role: 'group', 'aria-label': 'Boats to line up' });
      const after = el('div', { class: 'stage-after' });
      const hintsFor = (i) => [P.rankItems[i].hint, `Next is ${P.rankItems[i].label}.`];
      shuffle(P.rankItems).forEach((item) => {
        const button = el('button', { class: 'slice-btn rank-btn', type: 'button' }, item.label);
        button.addEventListener('click', () => {
          if (item.label === P.rankItems[placed].label) {
            button.remove();
            lineUp.append(el('li', { class: 'rank-item' }, item.label));
            placed += 1;
            if (placed === P.rankItems.length) {
              ctx.step([]);
              ctx.correct(P.rankDone);
              after.append(continueButton(t('level.continue'), next));
            } else {
              ctx.step(hintsFor(placed));
              ctx.correct(`${item.label} is in place.`);
            }
          } else {
            ctx.mistake();
            wobble(button, ctx.reducedMotion);
          }
        });
        tray.append(button);
      });
      area.append(heading, el('p', {}, P.rankIntro), lineUp, el('p', { class: 'small' }, 'Boats waiting'), tray);
      ctx.placeFeedback(area);
      area.append(after);
      ctx.step(hintsFor(0));
      focusHeading(heading);
    }

    function sim(title, intro, script, mode, next) {
      const heading = el('h2', {}, title);
      area.append(heading, el('p', {}, intro));
      ctx.step([]);
      runStepSim({ ctx, container: area, script, mode, words: ctx.simWords, onDone: next });
      focusHeading(heading);
    }

    function question(title, intro, q, counter, next) {
      const heading = el('h2', {}, q.prompt);
      const after = el('div', { class: 'stage-after' });
      area.append(
        el('p', { class: 'small' }, counter ? `${title}: ${counter}` : title),
        intro ? el('p', {}, intro) : null,
        heading,
        choiceList({
          options: q.options,
          reducedMotion: ctx.reducedMotion,
          onCorrect: () => { ctx.step([]); ctx.correct(q.explain); after.append(continueButton(t('level.continue'), next)); },
          onWrong: () => ctx.mistake()
        }));
      ctx.placeFeedback(area);
      area.append(after);
      ctx.step(q.hints);
      focusHeading(heading);
    }
  }
};
