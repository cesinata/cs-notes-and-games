// order.js
// "order" activity: put items in the right order. "items" are written in the CORRECT order in the
// content file; the player sees them shuffled and taps them one by one, first to last. A wrong tap
// is a mistake. No dragging is needed, so keyboard and touch both work.

import { el, shuffle, focusHeading } from '../ui.js';
import { t } from '../i18n.js';
import { continueButton, wobble } from '../choices.js';

export function renderOrder({ activity, area, ctx, done }) {
  const items = activity.items.map(String);
  let placed = 0;
  const heading = el('h2', {}, activity.prompt);
  const line = el('ol', { class: 'rank-line', 'aria-label': t('order.lineAria') });
  const tray = el('div', { class: 'tray', role: 'group', 'aria-label': t('order.trayAria') });
  const after = el('div', { class: 'stage-after' });

  shuffle(items).forEach((item) => {
    const button = el('button', { class: 'slice-btn rank-btn', type: 'button' }, item);
    button.addEventListener('click', () => {
      if (item === items[placed]) {
        button.remove();
        line.append(el('li', { class: 'rank-item' }, item));
        placed += 1;
        if (placed === items.length) {
          ctx.step([]);
          ctx.correct(activity.explain);
          after.append(continueButton(t('level.continue'), done));
        } else {
          ctx.step(activity.hints);
          ctx.correct(t('order.placed', { item, n: placed }));
        }
      } else {
        ctx.mistake();
        wobble(button, ctx.reducedMotion);
      }
    });
    tray.append(button);
  });

  area.append(heading, line, el('p', { class: 'small' }, t('order.waiting')), tray);
  ctx.placeFeedback(area);
  area.append(after);
  ctx.step(activity.hints);
  focusHeading(heading);
}
