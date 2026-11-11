// choices.js
// A row of answer buttons. Wrong picks get a cross and are switched off;
// the right pick gets a tick and locks the rest. Marks are shown as symbols
// and words, never colour alone.

import { el, shuffle } from './ui.js';
import { t } from './i18n.js';

// options: [{ text, correct }]. onCorrect(option) and onWrong(option, button).
export function choiceList({ options, onCorrect, onWrong, label, reducedMotion }) {
  const list = el('ul', { class: 'choices', 'aria-label': label || t('choices.answerOptions') });
  const buttons = [];

  shuffle(options).forEach((option) => {
    const mark = el('span', { class: 'choice-mark', 'aria-hidden': 'true' });
    const status = el('span', { class: 'visually-hidden' });
    const button = el('button', { class: 'choice', type: 'button' }, mark, el('span', {}, option.text), status);
    button.addEventListener('click', () => {
      if (option.correct) {
        button.classList.add('is-correct');
        mark.textContent = '✓';
        status.textContent = t('choices.correct');
        buttons.forEach((b) => { b.disabled = true; });
        onCorrect(option, button);
      } else {
        button.classList.add('is-wrong');
        mark.textContent = '✗';
        status.textContent = t('choices.notThis');
        button.disabled = true;
        wobble(button, reducedMotion);
        onWrong(option, button);
      }
    });
    buttons.push(button);
    list.append(el('li', {}, button));
  });

  return list;
}

// A little shake to show "not that one". Skipped if the player prefers less motion.
export function wobble(node, reducedMotion) {
  if (reducedMotion) return;
  node.classList.remove('wobble');
  void node.offsetWidth; // restarts the animation
  node.classList.add('wobble');
}

// A "Continue" style button that runs next() once and grabs keyboard focus.
export function continueButton(label, next) {
  let used = false;
  const button = el('button', {
    class: 'btn btn-continue',
    type: 'button',
    onclick: () => { if (!used) { used = true; next(); } }
  }, label);
  window.setTimeout(() => button.focus(), 0);
  return button;
}
