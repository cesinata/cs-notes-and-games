// language-switch.js
// The "Language: English | Bahasa Indonesia" buttons shown on the main page and
// on each region's map. Choosing one saves it and redraws the page (main.js
// listens for the "languagechange" event that setLang sends).

import { el } from './engine/ui.js';
import { LANGUAGES, getLang, setLang, t } from './engine/i18n.js';

export function languageSwitch() {
  const current = getLang();
  return el('div', { class: 'language-switch', role: 'group', 'aria-label': t('common.language') },
    el('span', { class: 'language-label' }, `${t('common.language')}:`),
    LANGUAGES.map((l) => el('button', {
      class: `language-button${l.code === current ? ' is-current' : ''}`,
      type: 'button',
      lang: l.code,
      'aria-pressed': l.code === current ? 'true' : 'false',
      onclick: () => setLang(l.code)
    }, l.label)));
}
