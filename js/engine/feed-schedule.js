// feed-schedule.js
// The rules behind Daily Feed, kept in one place.
//
// Which cards: only cards from levels you've finished (1+ star).
// Spaced repetition: each card sits in a "box" from 0 to 4.
//   Right answer → move up a box, and the card waits longer before coming back
//   (1, 2, 4, 7, then 14 days). Wrong answer → back to box 0, so you see it
//   again later in the same session and again tomorrow (even if the retry is right).
// A session: cards that are due come first, then new ones. Up to 8 practice
//   cards plus up to 2 Field Notes, so it ends after about 10 cards.
// Streak: counts days in a row with a finished session. Missing a day just
//   starts a new count. We never show a "you lost your streak" message.

import { getFeedData, saveFeedData, getLevelResult } from './storage.js';
import { shuffle } from './ui.js';

const WAIT_DAYS = [1, 2, 4, 7, 14];
const PRACTICE_PER_SESSION = 8;
const NOTES_PER_SESSION = 2;

// Today's date as a whole number of days, using the player's own time zone.
export function today() {
  const now = new Date();
  return Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
}

// Every feed card and Field Note from finished levels.
export function availableCards(zoneContents) {
  const practice = [];
  const notes = [];
  zoneContents.forEach((zone) => zone.levels.forEach((level) => {
    const result = getLevelResult(level.id);
    if (!result || result.stars < 1) return;
    (level.feed || []).forEach((card) => practice.push({ ...card, levelTitle: `${level.id} ${level.title}` }));
    (level.fieldNotes || []).forEach((note) => notes.push({ type: 'note', note, levelTitle: `${level.id} ${level.title}` }));
  }));
  return { practice, notes };
}

function isDue(card, day) {
  const memory = getFeedData().cards[card.id];
  return !memory || memory.due <= day;
}

// What the hub shows: how many cards are ready, and the streak.
export function feedSummary(zoneContents) {
  const { practice } = availableCards(zoneContents);
  const day = today();
  const ready = Math.min(PRACTICE_PER_SESSION, practice.filter((c) => isDue(c, day)).length);
  const streak = getFeedData().streak;
  const streakDays = streak.lastDay === day || streak.lastDay === day - 1 ? streak.days : 0;
  return { hasCards: practice.length > 0, ready, streakDays, doneToday: streak.lastDay === day };
}

// Builds today's list of cards.
export function buildSession(zoneContents) {
  const { practice, notes } = availableCards(zoneContents);
  const day = today();
  const memory = getFeedData().cards;
  const due = practice.filter((c) => memory[c.id] && memory[c.id].due <= day)
    .sort((a, b) => memory[a.id].box - memory[b.id].box);
  const fresh = shuffle(practice.filter((c) => !memory[c.id]));
  const chosen = due.concat(fresh).slice(0, PRACTICE_PER_SESSION);
  if (chosen.length === 0) return [];

  // Sprinkle in Field Notes as breathers, at about the 3rd and 7th spots.
  const session = shuffle(chosen);
  shuffle(notes).slice(0, NOTES_PER_SESSION).forEach((note, i) => {
    session.splice(Math.min(session.length, i === 0 ? 2 : 6), 0, note);
  });
  return session;
}

// Records one answer and updates when the card comes back.
// "retry" means it's the second try at a card missed earlier this session:
// getting it right then isn't proof you know it yet, so it still comes back tomorrow.
export function recordAnswer(cardId, correct, retry = false) {
  const data = getFeedData();
  if (retry) {
    data.cards[cardId] = { box: 0, due: today() + 1 };
    saveFeedData();
    return;
  }
  const old = data.cards[cardId] || { box: 0 };
  const box = correct ? Math.min(old.box + 1, WAIT_DAYS.length - 1) : 0;
  const wait = correct ? WAIT_DAYS[old.box] : 1;
  data.cards[cardId] = { box, due: today() + wait };
  saveFeedData();
}

// Call when a session ends. Returns the streak in days.
export function finishSession() {
  const data = getFeedData();
  const day = today();
  const s = data.streak;
  if (s.lastDay !== day) {
    s.days = s.lastDay === day - 1 ? s.days + 1 : 1;
    s.lastDay = day;
    s.best = Math.max(s.best || 0, s.days);
    saveFeedData();
  }
  return { days: s.days, best: s.best };
}
