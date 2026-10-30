// match.js
// "match" activity: pair things up (term ↔ meaning, need ↔ tool). The player taps one thing on the
// left, then its partner on the right. Matched pairs get a tick and move into a list.

import { el, shuffle, focusHeading, announce } from '../ui.js';
import { t } from '../i18n.js';
import { continueButton, wobble } from '../choices.js';

export function renderMatch({ activity, area, ctx, done }) {
  const pairs = activity.pairs;
  let selected = null; // the left button the player picked
  let matched = 0;
  const heading = el('h2', {}, activity.prompt);
  const status = el('p', { class: 'small match-status', 'aria-live': 'polite' }, t('match.pickLeft'));
  const doneList = el('ul', { class: 'match-done', 'aria-label': t('match.doneAria') });
  const after = el('div', { class: 'stage-after' });
  const leftList = el('ul', { class: 'match-col', 'aria-label': t('match.leftAria') });
  const rightList = el('ul', { class: 'match-col', 'aria-label': t('match.rightAria') });

  function pick(button) {
    if (selected) selected.setAttribute('aria-pressed', 'false');
    selected = button;
    button.setAttribute('aria-pressed', 'true');
    status.textContent = t('match.pickRight', { left: pairs[button.dataset.index].left });
  }

  pairs.forEach((pair, i) => {
    const button = el('button', { class: 'choice match-btn', type: 'button', 'aria-pressed': 'false', 'data-index': i }, pair.left);
    button.addEventListener('click', () => pick(button));
    leftList.append(el('li', {}, button));
  });

  shuffle(pairs.map((pair, i) => ({ pair, i }))).forEach(({ pair, i }) => {
    const button = el('button', { class: 'choice match-btn', type: 'button' }, pair.right);
    button.addEventListener('click', () => {
      if (!selected) { status.textContent = t('match.pickLeft'); return; }
      const leftIndex = Number(selected.dataset.index);
      if (leftIndex === i) {
        const left = pairs[leftIndex].left;
        selected.disabled = true;
        selected.setAttribute('aria-pressed', 'false');
        selected.prepend(el('span', { class: 'choice-mark', 'aria-hidden': 'true' }, '✓ '));
        button.disabled = true;
        button.prepend(el('span', { class: 'choice-mark', 'aria-hidden': 'true' }, '✓ '));
        doneList.append(el('li', {}, `${left} ↔ ${pair.right}`));
        selected = null;
        matched += 1;
        if (matched === pairs.length) {
          status.textContent = '';
          ctx.step([]);
          ctx.correct(activity.explain);
          after.append(continueButton(t('level.continue'), done));
        } else {
          status.textContent = t('match.pickLeft');
          ctx.step(activity.hints);
          ctx.correct(t('match.matched', { left, right: pair.right }));
        }
      } else {
        ctx.mistake();
        wobble(button, ctx.reducedMotion);
        announce(t('match.notAPair'));
        selected.setAttribute('aria-pressed', 'false');
        selected = null;
        status.textContent = t('match.pickLeft');
      }
    });
    rightList.append(el('li', {}, button));
  });

  area.append(heading, status, el('div', { class: 'match-grid' }, leftList, rightList), doneList);
  ctx.placeFeedback(area);
  area.append(after);
  ctx.step(activity.hints);
  focusHeading(heading);
}
