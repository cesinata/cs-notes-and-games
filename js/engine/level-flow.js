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
import { t, tp } from './i18n.js';
import { textOf } from './content.js';
import { makeSprite } from './sprites.js';
import { starsFor } from './progress.js';
import { saveLevelResult, getLevelResult } from './storage.js';
import { fieldNoteCard } from './field-notes.js';

const PHASES = ['story', 'learn', 'play', 'debrief']; // the order of the phase trail

export function runLevel({ app, world, zoneInfo, level, module, nextLevel, onExit, onNext, onReplay }) {
  clear(app);
  const state = { mistakes: 0, hints: 0, stepHints: [], stepTries: 0, hintShown: 0, playing: false };

  // ---------- HUD ----------
  const backButton = el('button', { class: 'btn btn-quiet', type: 'button', onclick: onExit }, t('common.backToMap'));
  const hintButton = el('button', { class: 'btn btn-hint', type: 'button', disabled: true, onclick: useHint }, t('level.hint'));
  const meter = el('div', { class: 'hud-meter', 'aria-live': 'off' });
  const trail = el('ol', { class: 'phase-trail', 'aria-label': t('level.progressLabel') },
    PHASES.map((name) => el('li', { 'data-phase': name }, t(`level.phases.${name}`))));

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
    meter.append(el('span', { class: 'meter-label' }, t('level.onTrack')), starRow(stars, 3, 2));
  }

  function showFeedback(kind, label, message) {
    clear(feedback);
    feedback.className = `feedback feedback-${kind}`;
    feedback.append(el('strong', { class: 'feedback-label' }, label), ' ', message);
  }

  // A tick you can see, plus the word "Correct" for screen readers.
  function correctLabel() {
    return el('span', {}, el('span', { 'aria-hidden': 'true' }, '✓'), el('span', { class: 'visually-hidden' }, t('level.correctSr')));
  }

  function useHint() {
    if (!state.stepHints.length) return;
    const index = Math.min(Math.max(state.hintShown, state.stepTries), state.stepHints.length - 1);
    state.hintShown = index + 1;
    state.hints += 1;
    showFeedback('hint', t('level.hintLabel'), state.stepHints[index]);
    updateMeter();
  }

  // ---------- Story ----------
  function showStory() {
    setPhase('story');
    clear(stage);
    const heading = el('h2', {}, t('level.phases.story'));
    stage.append(el('section', { class: 'board story-board' },
      el('div', { class: 'story-art' }, makeSprite('courier', 6)),
      el('div', { class: 'story-text' },
        heading,
        el('p', { class: 'lead' }, textOf(level.story)),
        level.hook ? el('aside', { class: 'hook-box' },
          el('h3', {}, t('level.wonder')),
          el('p', {}, textOf(level.hook.question)),
          el('p', { class: 'small' }, t('level.wonderNote'))) : null,
        el('button', { class: 'btn', type: 'button', onclick: showLearn }, t('level.learnButton'))
      )
    ));
    focusHeading(heading);
  }

  // ---------- Learn ----------
  function showLearn() {
    setPhase('learn');
    clear(stage);
    const heading = el('h2', {}, t('level.phases.learn'));
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
        el('button', { class: 'btn btn-quiet', type: 'button', onclick: showStory }, t('level.backToStory')),
        el('button', { class: 'btn', type: 'button', onclick: showPlay }, t('level.startPlaying'))
      )
    ));
    focusHeading(heading);
  }

  // ---------- Play ----------
  function showPlay() {
    setPhase('play');
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
        showFeedback('mistake', t('level.notQuite'), note || fromHints || t('level.tryAnother'));
        updateMeter();
      },
      correct(note) {
        showFeedback('correct', correctLabel(), note || t('level.thatsRight'));
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
    setPhase('debrief');
    clear(stage);
    updateMeter();
    const stars = starsFor(state.mistakes, state.hints);
    const before = getLevelResult(level.id);
    const { best, improved } = saveLevelResult(level.id, { stars, mistakes: state.mistakes, hints: state.hints });
    announce(t('level.complete', { stars }));

    const heading = el('h2', {}, t('level.phases.debrief'));
    let bestLine = '';
    if (before && improved) bestLine = t('level.newBest');
    else if (before && !improved) bestLine = t('level.stillBest', { stars: best.stars });

    const buttons = [
      el('button', { class: 'btn btn-quiet', type: 'button', onclick: onReplay }, t('level.playAgain'))
    ];
    if (nextLevel) {
      buttons.push(el('button', { class: 'btn', type: 'button', onclick: onNext }, t('level.next', { id: nextLevel.id, title: nextLevel.title })));
    }
    buttons.push(el('button', { class: nextLevel ? 'btn btn-quiet' : 'btn', type: 'button', onclick: onExit }, t('level.backTo', { zone: zoneInfo.name })));

    stage.append(el('section', { class: 'board debrief-board' },
      heading,
      level.debrief.summary.map((p) => el('p', {}, textOf(p))),
      level.hook ? el('aside', { class: 'hook-box' },
        el('h3', {}, t('level.remember')),
        el('p', { class: 'hook-question' }, textOf(level.hook.question)),
        el('p', {}, textOf(level.hook.answer))) : null,
      el('aside', { class: 'mistake-box' },
        el('h3', {}, t('level.commonMistake', { title: textOf(level.debrief.mistake.title) })),
        el('p', {}, textOf(level.debrief.mistake.text))
      ),
      el('div', { class: 'result' },
        starRow(stars, 3, 4),
        el('p', { class: 'result-line' },
          t('level.result', { stars, mistakes: tp('level.mistakes', state.mistakes), hints: tp('level.hints', state.hints) })),
        bestLine ? el('p', { class: 'result-line' }, bestLine) : null,
        el('p', { class: 'small' }, textOf(world.starRules))
      ),
      level.fieldNotes ? el('section', { class: 'debrief-notes' },
        el('h3', {}, before ? t('level.fieldNotesRevisit') : t('level.fieldNotesNew')),
        el('p', { class: 'small' }, t('level.fieldNotesNote')),
        el('div', { class: 'field-note-grid' }, level.fieldNotes.map((note) => fieldNoteCard(note, { isNew: !before })))) : null,
      el('h3', {}, t('level.readMore')),
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
