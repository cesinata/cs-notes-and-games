// ui.js
// Small helpers used everywhere: making page elements, showing stars,
// reading text aloud for screen readers, shuffling, and the error screen.

import { makeSprite } from './sprites.js';

// Make an element in one line, e.g.
//   el('button', { class: 'btn', onclick: go }, 'Play')
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  applyProps(node, props);
  appendChildren(node, children);
  return node;
}

// Same idea, for SVG drawings.
export function svgEl(tag, props = {}, ...children) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  applyProps(node, props);
  appendChildren(node, children);
  return node;
}

function applyProps(node, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;
    if (key === 'class') node.setAttribute('class', value);
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, String(value));
  });
}

function appendChildren(node, children) {
  children.flat().forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

// Text that screen readers announce, without moving focus.
export function announce(message) {
  const region = document.getElementById('announcer');
  if (!region) return;
  region.textContent = '';
  window.setTimeout(() => { region.textContent = message; }, 50);
}

// Moves keyboard focus to a heading so screen readers read the new screen.
export function focusHeading(heading) {
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: false });
}

export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Stars as little pixel icons, plus words for screen readers.
export function starRow(earned, max = 3, size = 2) {
  const row = el('span', { class: 'star-row' });
  for (let i = 0; i < max; i += 1) {
    row.append(makeSprite(i < earned ? 'star' : 'starEmpty', size));
  }
  row.append(el('span', { class: 'visually-hidden' }, `${earned} of ${max} stars`));
  return row;
}

export function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A gentle full-screen error, e.g. when a content file is broken.
export function showError(app, error) {
  clear(app);
  const problems = error.problems || [error.message || String(error)];
  const title = error.file
    ? `Something's wrong in content/${error.file}`
    : 'Something went wrong';
  const heading = el('h1', {}, title);
  app.append(el('main', { class: 'page error-page' },
    el('section', { class: 'board' },
      heading,
      el('p', {}, 'The game stopped so it wouldn\'t show broken text. Fix these, save the file, and reload:'),
      el('ul', { class: 'problem-list' }, problems.map((p) => el('li', {}, p)))
    )
  ));
  focusHeading(heading);
  console.error(error);
}
