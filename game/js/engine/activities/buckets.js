// buckets.js
// "buckets" activity: sort items into 2 to 4 groups. One item at a time is shown, and the player taps
// the group it belongs to. Correct items drop into their group's list, so the sorting builds up on screen.

import { el, shuffle, focusHeading } from '../ui.js';
import { t } from '../i18n.js';
import { continueButton, wobble } from '../choices.js';

export function renderBuckets({ activity, area, ctx, done }) {
  const queue = shuffle(activity.items);
  let at = 0;
  const heading = el('h2', {}, activity.prompt);
  const ask = el('p', { class: 'bucket-ask', 'aria-live': 'polite' });
  const buttons = el('div', { class: 'bucket-buttons', role: 'group', 'aria-label': t('buckets.chooseAria') });
  const lists = {};
  const board = el('div', { class: 'bucket-board' }, activity.buckets.map((name) => {
    lists[name] = el('ul', {});
    return el('section', { class: 'bucket' }, el('h3', {}, name), lists[name]);
  }));
  const after = el('div', { class: 'stage-after' });

  activity.buckets.forEach((name) => {
    const button = el('button', { class: 'btn btn-quiet bucket-btn', type: 'button' }, name);
    button.addEventListener('click', () => {
      const item = queue[at];
      if (item.bucket === name) {
        lists[name].append(el('li', {}, `✓ ${item.text}`));
        at += 1;
        if (at === queue.length) {
          buttons.remove();
          clearAsk();
          ctx.step([]);
          ctx.correct(activity.explain);
          after.append(continueButton(t('level.continue'), done));
        } else {
          ctx.step(activity.hints);
          ctx.correct(t('buckets.placed', { item: item.text, bucket: name }));
          showItem();
        }
      } else {
        ctx.mistake();
        wobble(button, ctx.reducedMotion);
      }
    });
    buttons.append(button);
  });

  function showItem() { ask.textContent = t('buckets.ask', { item: queue[at].text, n: at + 1, total: queue.length }); }
  function clearAsk() { ask.textContent = ''; }

  area.append(heading, ask, buttons, board);
  ctx.placeFeedback(area);
  area.append(after);
  showItem();
  ctx.step(activity.hints);
  focusHeading(heading);
}
