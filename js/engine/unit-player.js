// unit-player.js
// Runs a level that is written as data: a list of "activities" in its content file (no level code).
// It plays the normal activities one after another, then offers the optional Challenge (activities
// marked "challenge": true), which never costs stars. It plugs into the same level template as
// hand-built levels (level-flow.js), so hints, stars and the debrief work the same.
//
// Activity types live in js/engine/activities/: choice, order, match, buckets, numeric, stepsim.

import { el, clear, focusHeading } from './ui.js';
import { t } from './i18n.js';
import { renderChoice } from './activities/choice.js';
import { renderOrder } from './activities/order.js';
import { renderMatch } from './activities/match.js';
import { renderBuckets } from './activities/buckets.js';
import { renderNumeric } from './activities/numeric.js';
import { renderStepSim } from './activities/stepsim.js';

const RENDERERS = {
  choice: renderChoice,
  order: renderOrder,
  match: renderMatch,
  buckets: renderBuckets,
  numeric: renderNumeric,
  stepsim: renderStepSim
};

export const unitModule = {
  // Data-driven levels show pictures through lesson "table"s, so there is nothing to draw here.
  lessonDiagram() {
    return null;
  },

  play(ctx) {
    const all = ctx.text.activities;
    const main = all.filter((a) => !a.challenge);
    const bonus = all.filter((a) => a.challenge);

    function run(list, done) {
      let at = 0;
      function next() {
        if (at >= list.length) { done(); return; }
        const activity = list[at];
        at += 1;
        ctx.clearFeedback();
        clear(ctx.area);
        const heading = el('p', { class: 'small activity-count' }, activity.challenge ? t('level.challengeTag') : t('unit.activityOf', { i: at, n: list.length }));
        ctx.area.append(heading);
        RENDERERS[activity.type]({ activity, area: ctx.area, ctx, done: next });
      }
      next();
    }

    function offerChallenge() {
      ctx.step([]);
      ctx.clearFeedback();
      clear(ctx.area);
      const heading = el('h2', {}, t('level.challengeTag'));
      ctx.area.append(
        heading,
        el('p', {}, t('unit.challengeOffer', { n: bonus.length })),
        el('p', { class: 'small' }, t('level.challengeNote')),
        el('div', { class: 'actions' },
          el('button', { class: 'btn btn-quiet', type: 'button', onclick: () => ctx.finish() }, t('level.challengeSkip')),
          el('button', { class: 'btn', type: 'button', onclick: () => { ctx.challenge(true); run(bonus, () => { ctx.challenge(false); ctx.finish(); }); } }, t('level.challengeTry'))));
      focusHeading(heading);
    }

    run(main, bonus.length ? offerChallenge : () => ctx.finish());
  }
};
