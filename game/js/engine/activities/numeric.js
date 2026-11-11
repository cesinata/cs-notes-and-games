// numeric.js
// "numeric" activity: type a number. Right answers can be "close enough": set "tolerance" (plus or
// minus a fixed amount) or "tolerancePercent". The answer box also understands sums like 2^10 - 24,
// and an on-screen calculator is shown unless the activity sets "calculator": false.

import { el, focusHeading } from '../ui.js';
import { t } from '../i18n.js';
import { continueButton } from '../choices.js';
import { evaluate } from '../calc-eval.js';
import { calculatorPanel } from './calculator.js';

export function isCloseEnough(value, activity) {
  const allowed = Math.max(activity.tolerance || 0, Math.abs(activity.answer) * (activity.tolerancePercent || 0) / 100);
  return Math.abs(value - activity.answer) <= allowed + 1e-9;
}

export function renderNumeric({ activity, area, ctx, done }) {
  const heading = el('h2', {}, activity.prompt);
  const inputId = `numeric-${activity.id}`;
  const input = el('input', { id: inputId, class: 'numeric-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false' });
  const note = el('p', { class: 'small numeric-note', 'aria-live': 'polite' });
  const checkButton = el('button', { class: 'btn', type: 'submit' }, t('numeric.check'));
  const after = el('div', { class: 'stage-after' });
  const form = el('form', { class: 'numeric-form', novalidate: true },
    el('label', { for: inputId }, t('numeric.label')),
    el('div', { class: 'numeric-row' }, input, activity.unit ? el('span', { class: 'numeric-unit' }, activity.unit) : null, checkButton),
    note);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let value;
    try { value = evaluate(input.value); } catch (error) { note.textContent = t('numeric.notNumber'); return; }
    note.textContent = '';
    if (isCloseEnough(value, activity)) {
      input.readOnly = true;
      checkButton.disabled = true;
      ctx.step([]);
      ctx.correct(activity.explain);
      after.append(continueButton(t('level.continue'), done));
    } else {
      ctx.mistake();
      input.select();
    }
  });

  area.append(heading, form);
  if (activity.calculator !== false) area.append(calculatorPanel({ onUse: (text) => { input.value = text; input.focus(); } }));
  ctx.placeFeedback(area);
  area.append(after);
  ctx.step(activity.hints);
  focusHeading(heading);
}
