// level-flow.js
// The template every level follows: Story → Learn → Play → Debrief (with stars
// and Read more). It draws the HUD (map button, title, stars, hint button) and
// counts mistakes and hints. Each level file only has to provide the "Play" part.
//
// A level's play() function gets a "ctx" (context) object with these tools:
//   ctx.area             the element to draw the puzzle into
//   ctx.text             the level's "play" section from the content file
//   ctx.step(hints)      start a new step; hints = [gentle hint, clearer hint]
//   ctx.mistake(note)    count a mistake and show a hint (or the note given)
//   ctx.correct(note)    show a "that's right" message
//   ctx.placeFeedback(x) move the message box inside element x
//   ctx.finish()         end the puzzle and go to the debrief
//   ctx.reducedMotion    true if the player asked for less animation
//   ctx.simWords         Step Sim button labels for this region (world.json "sim")

import { el, clear, focusHeading, announce, starRow, prefersReducedMotion } from './ui.js';
import { textOf } from './content.js';
import { makeSprite } from './sprites.js';
import { starsFor } from './progress.js';
import { saveLevelResult, getLevelResult } from './storage.js';
import { fieldNoteCard } from './field-notes.js';

const PHASES = ['Story', 'Learn', 'Play', 'Debrief'];

export function runLevel({ app, world, zoneInfo, level, module, nextLevel, onExit, onNext, onReplay }) {
  clear(app);
  const state = { mistakes: 0, hints: 0, stepHints: [], stepTries: 0, hintShown: 0, playing: false };

  // ---------- HUD ----------
  const backButton = el('button', { class: 'btn btn-quiet', type: 'button', onclick: onExit }, 'Back to map');
  const hintButton = el('button', { class: 'btn btn-hint', type: 'button', disabled: true, onclick: useHint }, 'Hint');
  const meter = el('div', { class: 'hud-meter', 'aria-live': 'off' });
  const trail = el('ol', { class: 'phase-trail', 'aria-label': 'Level progress' },
    PHASES.map((name) => el('li', { 'data-phase': name }, name)));

  const hud = el('header', { class: 'hud' },
    el('div', { class: 'hud-left' }, backButton),
    el('div', { class: 'hud-title' },
      el('p', { class: 'hud-zone' }, zoneInfo.name),
      el('h1', { class: 'hud-level' }, `${level.id} ${level.title}`)
    ),
    el('div', { class: 'hud-right' }, meter, hintButton)
  );
  const stage = el('main', { class: 'page level-page', id: 'level-main' });
  app.append(hud, el('div', { class: 'trail-wrap' }, trail), stage);

  // The message box for right answers, hints and mistakes.
  const feedback = el('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });

  function setPhase(name) {
    trail.querySelectorAll('li').forEach((li) => {
      const current = li.dataset.phase === name;
      li.classList.toggle('is-current', current);
      if (current) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
  }

  function updateMeter() {
    clear(meter);
    if (!state.playing) return;
    const stars = starsFor(state.mistakes, state.hints);
    meter.append(el('span', { class: 'meter-label' }, 'On track for'), starRow(stars, 3, 2));
  }

  function showFeedback(kind, label, message) {
    clear(feedback);
    feedback.className = `feedback feedback-${kind}`;
    feedback.append(el('strong', { class: 'feedback-label' }, label), ' ', message);
  }

  // A tick you can see, plus the word "Correct" for screen readers.
  function correctLabel() {
    return el('span', {}, el('span', { 'aria-hidden': 'true' }, '✓'), el('span', { class: 'visually-hidden' }, 'Correct:'));
  }

  function useHint() {
    if (!state.stepHints.length) return;
    const index = Math.min(Math.max(state.hintShown, state.stepTries), state.stepHints.length - 1);
    state.hintShown = index + 1;
    state.hints += 1;
    showFeedback('hint', 'Hint:', state.stepHints[index]);
    updateMeter();
  }

  // ---------- Story ----------
  function showStory() {
    setPhase('Story');
    clear(stage);
    const heading = el('h2', {}, 'Story');
    stage.append(el('section', { class: 'board story-board' },
      el('div', { class: 'story-art' }, makeSprite('courier', 6)),
      el('div', { class: 'story-text' },
        heading,
        el('p', { class: 'lead' }, textOf(level.story)),
        level.hook ? el('aside', { class: 'hook-box' },
          el('h3', {}, 'Something to wonder about'),
          el('p', {}, textOf(level.hook.question)),
          el('p', { class: 'small' }, 'You\'ll be able to answer this by the end of the level.')) : null,
        el('button', { class: 'btn', type: 'button', onclick: showLearn }, 'Learn the idea')
      )
    ));
    focusHeading(heading);
  }

  // ---------- Learn ----------
  function showLearn() {
    setPhase('Learn');
    clear(stage);
    const heading = el('h2', {}, 'Learn');
    const figure = module.learnDiagram
      ? el('figure', { class: 'learn-figure' },
        module.learnDiagram(level),
        el('figcaption', {}, textOf(level.learn.diagramCaption)))
      : null;
    stage.append(el('section', { class: 'board learn-board' },
      heading,
      el('div', { class: 'learn-grid' },
        el('ul', { class: 'learn-list' }, level.learn.bullets.map((b) => el('li', {}, textOf(b)))),
        figure
      ),
      el('div', { class: 'actions' },
        el('button', { class: 'btn btn-quiet', type: 'button', onclick: showStory }, 'Back to the story'),
        el('button', { class: 'btn', type: 'button', onclick: showPlay }, 'Start playing')
      )
    ));
    focusHeading(heading);
  }

  // ---------- Play ----------
  function showPlay() {
    setPhase('Play');
    clear(stage);
    Object.assign(state, { mistakes: 0, hints: 0, stepHints: [], stepTries: 0, hintShown: 0, playing: true });
    clear(feedback);
    feedback.className = 'feedback';
    updateMeter();

    const area = el('section', { class: 'play-area' });
    stage.append(area, feedback);

    const ctx = {
      area,
      text: level.play,
      simWords: world.sim || null,
      reducedMotion: prefersReducedMotion(),
      step(hints = []) {
        state.stepHints = hints.map(textOf);
        state.stepTries = 0;
        state.hintShown = 0;
        hintButton.disabled = state.stepHints.length === 0;
      },
      mistake(note) {
        state.mistakes += 1;
        state.stepTries += 1;
        const fromHints = state.stepHints[Math.min(state.stepTries - 1, state.stepHints.length - 1)];
        showFeedback('mistake', '✗ Not quite.', note || fromHints || 'Try another option.');
        updateMeter();
      },
      correct(note) {
        showFeedback('correct', correctLabel(), note || 'That\'s right.');
      },
      clearFeedback() {
        clear(feedback);
        feedback.className = 'feedback';
      },
      placeFeedback(parent) {
        parent.append(feedback);
      },
      finish() {
        state.playing = false;
        hintButton.disabled = true;
        showDebrief();
      }
    };
    hintButton.disabled = true;
    module.play(ctx);
  }

  // ---------- Debrief, stars, read more ----------
  function showDebrief() {
    setPhase('Debrief');
    clear(stage);
    updateMeter();
    const stars = starsFor(state.mistakes, state.hints);
    const before = getLevelResult(level.id);
    const { best, improved } = saveLevelResult(level.id, { stars, mistakes: state.mistakes, hints: state.hints });
    announce(`Level complete. You earned ${stars} of 3 stars.`);

    const heading = el('h2', {}, 'Debrief');
    const mistakeWord = state.mistakes === 1 ? 'mistake' : 'mistakes';
    const hintWord = state.hints === 1 ? 'hint' : 'hints';
    let bestLine = '';
    if (before && improved) bestLine = 'A new best for this level.';
    else if (before && !improved) bestLine = `Your best is still ${best.stars} of 3 stars.`;

    const buttons = [
      el('button', { class: 'btn btn-quiet', type: 'button', onclick: onReplay }, 'Play again')
    ];
    if (nextLevel) {
      buttons.push(el('button', { class: 'btn', type: 'button', onclick: onNext }, `Next: ${nextLevel.id} ${nextLevel.title}`));
    }
    buttons.push(el('button', { class: nextLevel ? 'btn btn-quiet' : 'btn', type: 'button', onclick: onExit }, `Back to ${zoneInfo.name}`));

    stage.append(el('section', { class: 'board debrief-board' },
      heading,
      level.debrief.summary.map((p) => el('p', {}, textOf(p))),
      level.hook ? el('aside', { class: 'hook-box' },
        el('h3', {}, 'Remember the question from the start?'),
        el('p', { class: 'hook-question' }, textOf(level.hook.question)),
        el('p', {}, textOf(level.hook.answer))) : null,
      el('aside', { class: 'mistake-box' },
        el('h3', {}, `Common mistake: ${textOf(level.debrief.mistake.title)}`),
        el('p', {}, textOf(level.debrief.mistake.text))
      ),
      el('div', { class: 'result' },
        starRow(stars, 3, 4),
        el('p', { class: 'result-line' },
          `You earned ${stars} of 3 stars, with ${state.mistakes} ${mistakeWord} and ${state.hints} ${hintWord}.`),
        bestLine ? el('p', { class: 'result-line' }, bestLine) : null,
        el('p', { class: 'small' }, textOf(world.starRules))
      ),
      level.fieldNotes ? el('section', { class: 'debrief-notes' },
        el('h3', {}, before ? 'Field Notes from this level' : 'New Field Notes unlocked'),
        el('p', { class: 'small' }, 'Where this idea shows up today. They\'re saved in your Field Journal on the map.'),
        el('div', { class: 'field-note-grid' }, level.fieldNotes.map((note) => fieldNoteCard(note, { isNew: !before })))) : null,
      el('h3', {}, 'Read more'),
      el('ul', { class: 'read-more' }, level.readMore.map((link) =>
        el('li', {},
          el('a', { href: link.url, target: '_blank', rel: 'noopener' }, textOf(link.title)),
          link.source ? el('span', { class: 'source' }, textOf(link.source)) : null
        ))),
      el('div', { class: 'actions' }, buttons)
    ));
    focusHeading(heading);
  }

  showStory();
}
