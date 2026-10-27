// i18n.js
// Language support (English and Bahasa Indonesia).
//  - getLang() / setLang(): which language the player chose. It's remembered on
//    this device, and falls back to the browser's language the first time.
//  - t('hub.reset') looks up a button or label in content/ui.json (or
//    content/id/ui.json). Use {name} in the text for values: t('x', { name: 'Ana' }).
//  - tp('level.mistakes', 2) picks the "one" or "other" form of a word, e.g. "1 mistake" / "2 mistakes".
//  - termNodes(text) wraps technical terms from content/glossary.json (like
//    "network" or "dynamic programming") in <span translate="no">, so a browser
//    translator leaves them in English. The reader sees them in both languages.

export const LANGUAGES = [
  { code: 'en', label: 'English', locale: 'en-AU' },
  { code: 'id', label: 'Bahasa Indonesia', locale: 'id-ID' }
];

const LANG_KEY = 'pocketAtlas.lang';

let lang = 'en';
let strings = {};
let termPattern = null;

function isSupported(code) {
  return LANGUAGES.some((l) => l.code === code);
}

// Called once at start. Uses the saved choice, else the browser's language.
export function detectLang() {
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (error) { saved = null; }
  if (isSupported(saved)) lang = saved;
  else {
    const preferred = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
    const match = preferred.map((l) => String(l).slice(0, 2).toLowerCase()).find(isSupported);
    lang = match || 'en';
  }
  document.documentElement.lang = lang === 'id' ? 'id' : 'en-AU';
  return lang;
}

export function getLang() {
  return lang;
}

export function getLocale() {
  return LANGUAGES.find((l) => l.code === lang).locale;
}

// Switches language, remembers it, and tells main.js to redraw.
export function setLang(code) {
  if (!isSupported(code) || code === lang) return;
  lang = code;
  try { localStorage.setItem(LANG_KEY, code); } catch (error) { /* storage blocked: fine, it just won't be remembered */ }
  document.documentElement.lang = lang === 'id' ? 'id' : 'en-AU';
  window.dispatchEvent(new CustomEvent('languagechange'));
}

export function setStrings(ui) {
  strings = ui;
}

function lookup(key) {
  return key.split('.').reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), strings);
}

function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (whole, name) => (name in vars ? String(vars[name]) : whole));
}

export function t(key, vars = {}) {
  const found = lookup(key);
  if (typeof found !== 'string') return key; // a visible sign that the key is missing
  return fill(found, vars);
}

// For words with a singular and plural form: { "one": "{n} mistake", "other": "{n} mistakes" }.
export function tp(key, n, vars = {}) {
  const found = lookup(key);
  if (!found || typeof found !== 'object') return key;
  return fill(n === 1 ? found.one : found.other, { n, ...vars });
}

// ---------- Technical terms that stay in English ----------

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function setGlossary(terms) {
  const sorted = [...terms].sort((a, b) => b.length - a.length).map((term) => escapeRegex(term).replace(/\s+/g, '\\s+'));
  // (start or a non-letter) + term + optional plural "s"/"es", and not followed by a letter.
  termPattern = sorted.length
    ? new RegExp(`(^|[^\\p{L}\\p{N}_-])(${sorted.join('|')})((?:es|s)?)(?![\\p{L}\\p{N}_-])`, 'giu')
    : null;
}

// Turns a piece of text into page nodes, with glossary terms marked translate="no".
export function termNodes(text) {
  if (!termPattern || !text) return [document.createTextNode(text)];
  const nodes = [];
  let last = 0;
  termPattern.lastIndex = 0;
  let match = termPattern.exec(text);
  while (match) {
    const start = match.index + match[1].length;
    if (start > last) nodes.push(document.createTextNode(text.slice(last, start)));
    const span = document.createElement('span');
    span.className = 'term';
    span.setAttribute('translate', 'no');
    span.setAttribute('lang', 'en');
    span.textContent = match[2] + match[3];
    nodes.push(span);
    last = start + match[2].length + match[3].length;
    match = termPattern.exec(text);
  }
  if (last < text.length) nodes.push(document.createTextNode(text.slice(last)));
  return nodes.length ? nodes : [document.createTextNode(text)];
}
