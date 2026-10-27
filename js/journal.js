// journal.js
// The Field Journal: a collection of every Field Note in the game, grouped by
// level. Locked notes show only their title, so you can see what's waiting.

import { el, clear, focusHeading } from './engine/ui.js';
import { makeSprite } from './engine/sprites.js';
import { fieldNoteCard } from './engine/field-notes.js';

export function renderJournal(app, world, notes) {
  clear(app);
  const J = world.journal;
  const heading = el('h1', {}, J.title);
  const count = notes.filter((n) => n.unlocked).length;

  // Group notes by level, keeping the game's order.
  const groups = [];
  notes.forEach((entry) => {
    let group = groups.find((g) => g.level.id === entry.level.id);
    if (!group) { group = { level: entry.level, entries: [] }; groups.push(group); }
    group.entries.push(entry);
  });

  app.append(el('main', { class: 'page journal-page' },
    el('div', { class: 'zone-top' }, el('a', { class: 'btn btn-quiet', href: world.base }, 'Back to map')),
    el('header', { class: 'zone-header' },
      el('span', { class: 'zone-icon' }, makeSprite('journal', 5)),
      el('div', {},
        heading,
        el('p', { class: 'lead' }, J.intro),
        el('p', { class: 'zone-stars' }, J.hubText.replace('{count}', count).replace('{total}', notes.length)))),
    groups.map((group) => el('section', { class: 'journal-group' },
      el('h2', {}, `${group.level.id} ${group.level.title}`),
      el('div', { class: 'field-note-grid' }, group.entries.map((entry) => fieldNoteCard(entry.note, {
        locked: !entry.unlocked,
        lockedText: J.lockedText.replace('{level}', `${group.level.id} ${group.level.title}`)
      })))))
  ));
  focusHeading(heading);
}
