// calculator.js
// The on-screen calculator for numeric activities. You can tap its keys or just type in the box.
// It does + − × ÷, powers (^), mod, brackets, √ and log₂. "Use result" copies the answer into the
// answer box. The maths lives in js/engine/calc-eval.js.

import { el } from '../ui.js';
import { t } from '../i18n.js';
import { evaluate, formatResult } from '../calc-eval.js';

// [shown on the key, text it types, spoken name key]
const KEYS = [
  ['7', '7'], ['8', '8'], ['9', '9'], ['÷', '÷', 'divide'], ['√', '√(', 'sqrt'],
  ['4', '4'], ['5', '5'], ['6', '6'], ['×', '×', 'times'], ['log₂', 'log₂(', 'log2'],
  ['1', '1'], ['2', '2'], ['3', '3'], ['−', '−', 'minus'], ['^', '^', 'power'],
  ['0', '0'], ['.', '.'], ['(', '('], [')', ')'], ['mod', ' mod ', 'mod'],
  ['+', '+', 'plus']
];

// onUse(text) is called with the result when the player presses "Use result".
export function calculatorPanel({ onUse }) {
  const input = el('input', { class: 'calc-input', type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false', 'aria-label': t('calc.expression') });
  const result = el('p', { class: 'calc-result', 'aria-live': 'polite' });
  const useButton = el('button', { class: 'btn btn-quiet', type: 'button', hidden: true }, t('calc.use'));
  let last = null;

  function insert(text) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    const caret = start + text.length;
    input.focus();
    input.setSelectionRange(caret, caret);
  }

  function calculate() {
    try {
      last = evaluate(input.value);
      result.textContent = `= ${formatResult(last)}`;
      result.classList.remove('is-error');
      useButton.hidden = false;
    } catch (error) {
      last = null;
      result.textContent = `✗ ${error.message}`;
      result.classList.add('is-error');
      useButton.hidden = true;
    }
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); calculate(); }
  });
  useButton.addEventListener('click', () => { if (last !== null) onUse(formatResult(last)); });

  const keys = KEYS.map(([shown, typed, name]) => {
    const button = el('button', { class: 'calc-key', type: 'button', 'aria-label': name ? t(`calc.keys.${name}`) : shown }, shown);
    button.addEventListener('click', () => insert(typed));
    return button;
  });
  const equals = el('button', { class: 'calc-key calc-equals', type: 'button', 'aria-label': t('calc.keys.equals') }, '=');
  equals.addEventListener('click', calculate);
  const clearKey = el('button', { class: 'calc-key', type: 'button', 'aria-label': t('calc.keys.clear') }, 'C');
  clearKey.addEventListener('click', () => { input.value = ''; result.textContent = ''; useButton.hidden = true; input.focus(); });
  const back = el('button', { class: 'calc-key', type: 'button', 'aria-label': t('calc.keys.back') }, '⌫');
  back.addEventListener('click', () => { input.value = input.value.slice(0, -1); input.focus(); });

  return el('details', { class: 'calculator', open: true },
    el('summary', {}, t('calc.title')),
    input,
    el('div', { class: 'calc-keys' }, keys, back, clearKey, equals),
    result,
    useButton);
}
