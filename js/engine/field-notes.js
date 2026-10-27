// field-notes.js
// Field Notes are short "where you see this today" cards. Each level has a few
// in its content file ("fieldNotes"). A level's notes unlock once the player
// finishes that level with at least 1 star.

import { el } from './ui.js';
import { textOf } from './content.js';
import { getLevelResult } from './storage.js';

// One note as a card. If locked, only the title shows, to spark curiosity.
export function fieldNoteCard(note, { locked = false, lockedText = '', isNew = false } = {}) {
  if (locked) {
    return el('article', { class: 'field-note is-locked' },
      el('h3', { class: 'field-note-title' }, textOf(note.title)),
      el('p', { class: 'field-note-locked' }, lockedText));
  }
  return el('article', { class: 'field-note' },
    isNew ? el('span', { class: 'tag' }, 'New') : null,
    el('h3', { class: 'field-note-title' }, textOf(note.title)),
    el('p', {}, textOf(note.text)),
    note.source ? el('p', { class: 'field-note-source' },
      'Source: ', el('a', { href: note.source.url, target: '_blank', rel: 'noopener' }, textOf(note.source.title))) : null);
}

// Every note from the loaded zone files, with whether it's unlocked yet.
export function allFieldNotes(zoneContents) {
  const notes = [];
  zoneContents.forEach((zone) => {
    zone.levels.forEach((level) => {
      (level.fieldNotes || []).forEach((note) => {
        const result = getLevelResult(level.id);
        notes.push({ note, level, unlocked: Boolean(result && result.stars >= 1) });
      });
    });
  });
  return notes;
}
