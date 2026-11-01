// level-flow.js
// The template every level follows: Everyday moment → Story lessons → Play → Debrief
// (with stars and Read more). It draws the HUD (map button, title, stars, hint button) and
// counts mistakes and hints. Each level file only has to provide the "Play" part.
//
// A level's play() function gets a "ctx" (context) object with these tools:
//   ctx.area             the element to draw the puzzle into
//   ctx.text             the level's "play" section from the content file
//   ctx.step(hints)      start a new step; hints = [gentle hint, clearer hint]
//   ctx.mistake(note)    count a mistake and show a hint (or the note given)
//   ctx.correct(note)    show a "that's right" message
//   ctx.placeFeedback(x) move the message box inside element x
//   ctx.challenge(on)    start (or stop) optional bonus questions: mistakes and hints in them never cost stars
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
import { waveElement } from './wave.js';

const PHASES = ['moment', 'lessons', 'play', 'debrief']; // the order of the phase trail

// A small table from the content file: { "head": ["A", "B"], "rows": [["1", "2"]] }.
function tableElement(table) {
  return el('div', { class: 'mini-table-wrap' },
    el('table', { class: 'mini-table' },
      el('thead', {}, el('tr', {}, table.head.map((h) => el('th', { scope: 'col' }, h)))),
      el('tbody', {}, table.rows.map((row) => el('tr', {}, row.map((cell) => el('td', {}, cell)))))));
}

// One link in a References or Read more list. It opens in a new tab, and says so for screen readers.
function referenceItem(link) {
  return el('li', {},
    el('a', { href: link.url, target: '_blank', rel: 'noopener' },
      textOf(link.title), el('span', { class: 'visually-hidden' }, ` ${t('level.newTab')}`)),
    link.source ? el('span', { class: 'source' }, textOf(link.source)) : null
  );
}

export function runLevel({ app, world, zoneInfo, level, module, nextLevel, onExit, onNext, onReplay }) {
  clear(app);
  const state = { mistakes: 0, hints: 0, stepHints: [], stepTries: 0, hintShown: 0, playing: false, challenge: false, cRight: 0, cTotal: 0, cMistaken: false };

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
    meter.append(el('span', { class: 'meter-label' }, state.challenge ? t('level.challengeTag') : t('level.onTrack')), state.challenge ? null : starRow(stars, 3, 2));
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
    if (!state.challenge) state.hints += 1;
    showFeedback('hint', t('level.hintLabel'), state.stepHints[index]);
    updateMeter();
  }

  // ---------- Everyday moment ----------
  function showMoment() {
    setPhase('moment');
    clear(stage);
    const heading = el('h2', {}, t('level.momentTitle'));
    const moment = level.everyday;
    stage.append(el('section', { class: 'board story-board' },
      el('div', { class: 'story-art' }, makeSprite('courier', 6)),
      el('div', { class: 'story-text' },
        heading,
        el('p', { class: 'lead' }, textOf(moment.scene)),
        el('aside', { class: 'hook-box' },
          el('h3', {}, t('level.wonder')),
          el('p', {}, textOf(moment.question)),
          el('p', { class: 'small' }, t('level.wonderNote'))),
        el('p', { class: 'kit-task' }, el('strong', {}, `${t('level.kitTask')}: `), textOf(level.story)),
        el('button', { class: 'btn', type: 'button', onclick: () => showLesson(0) }, t('level.startLessons'))
      )
    ));
    focusHeading(heading);
  }

  // ---------- Story lessons (one idea per page) ----------
  function showLesson(index) {
    setPhase('lessons');
    clear(stage);
    const lesson = level.lessons[index];
    const last = index === level.lessons.length - 1;
    const heading = el('h2', {}, lesson.title);
    // A page can have a picture (drawn by the level's file, chosen by name) and/or a small table (written in the content).
    const diagram = lesson.diagram && module.lessonDiagram ? module.lessonDiagram(lesson.diagram, level) : null;
    const figure = diagram || lesson.table || lesson.wave
      ? el('figure', { class: 'learn-figure' }, diagram, lesson.wave ? waveElement(lesson.wave) : null, lesson.table ? tableElement(lesson.table) : null,
        lesson.diagramCaption ? el('figcaption', {}, textOf(lesson.diagramCaption)) : null)
      : null;

    stage.append(el('section', { class: 'board learn-board lesson-page' },
      el('p', { class: 'small lesson-count' }, t('level.lessonOf', { i: index + 1, n: level.lessons.length })),
      heading,
      el('div', { class: 'learn-grid' },
        el('div', { class: 'lesson-text' }, lesson.text.map((p) => el('p', {}, textOf(p)))),
        figure
      ),
      lesson.terms ? el('section', { class: 'terms-box', 'aria-label': t('level.termsTitle') },
        el('h3', {}, t('level.termsTitle')),
        el('dl', {}, lesson.terms.map((item) => [el('dt', {}, item.term), el('dd', {}, textOf(item.meaning))]))) : null,
      lesson.predict ? el('details', { class: 'predict-box' },
        el('summary', {}, `${t('level.predictLabel')}: ${textOf(lesson.predict.prompt)}`),
        el('p', {}, textOf(lesson.predict.answer))) : null,
      lesson.deeper ? el('details', { class: 'go-deeper' },
        el('summary', {}, `${t('level.deeperLabel')}: ${textOf(lesson.deeper.title)}`),
        el('p', { class: 'small' }, t('level.deeperNote')),
        lesson.deeper.text.map((p) => el('p', {}, textOf(p)))) : null,
      el('section', { class: 'references' },
        el('h3', {}, t('level.referencesTitle')),
        el('ul', { class: 'read-more' }, lesson.references.map((ref) => referenceItem(ref)))),
      el('div', { class: 'actions' },
        el('button', { class: 'btn btn-quiet', type: 'button', onclick: () => (index === 0 ? showMoment() : showLesson(index - 1)) },
          index === 0 ? t('level.backToMoment') : t('level.lessonBack')),
        el('button', { class: 'btn', type: 'button', onclick: () => (last ? showPlay() : showLesson(index + 1)) },
          last ? t('level.startPlaying') : t('level.lessonNext'))
      )
    ));
    focusHeading(heading);
  }

  // ---------- Play ----------
  function showPlay() {
    setPhase('play');
    clear(stage);
    Object.assign(state, { mistakes: 0, hints: 0, stepHints: [], stepTries: 0, hintShown: 0, playing: true, challenge: false, cRight: 0, cTotal: 0, cMistaken: false });
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
        if (hints.length) state.cMistaken = false; // a new question starts (answering calls step([]) first)
        hintButton.disabled = state.stepHints.length === 0;
      },
      mistake(note) {
        if (state.challenge) state.cMistaken = true;
        else state.mistakes += 1;
        state.stepTries += 1;
        const fromHints = state.stepHints[Math.min(state.stepTries - 1, state.stepHints.length - 1)];
        showFeedback('mistake', t('level.notQuite'), note || fromHints || t('level.tryAnother'));
        updateMeter();
      },
      correct(note) {
        if (state.challenge) {
          state.cTotal += 1;
          if (!state.cMistaken) state.cRight += 1;
        }
        showFeedback('correct', correctLabel(), note || t('level.thatsRight'));
      },
      challenge(on) {
        state.challenge = on;
        updateMeter();
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
    const before = level.noSave ? null : getLevelResult(level.id);
    const cleared = state.cTotal > 0 && state.cRight === state.cTotal;
    const { best, improved } = level.noSave
      ? { best: { stars }, improved: false } // a test page records nothing
      : saveLevelResult(level.id, { stars, mistakes: state.mistakes, hints: state.hints, bonus: cleared });
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
      el('aside', { class: 'hook-box' },
        el('h3', {}, t('level.remember')),
        el('p', { class: 'hook-question' }, textOf(level.everyday.question)),
        el('p', {}, textOf(level.everyday.answer))),
      el('aside', { class: 'mistake-box' },
        el('h3', {}, t('level.commonMistake', { title: textOf(level.debrief.mistake.title) })),
        el('p', {}, textOf(level.debrief.mistake.text))
      ),
      el('div', { class: 'result' },
        starRow(stars, 3, 4),
        el('p', { class: 'result-line' },
          t('level.result', { stars, mistakes: tp('level.mistakes', state.mistakes), hints: tp('level.hints', state.hints) })),
        bestLine ? el('p', { class: 'result-line' }, bestLine) : null,
        state.cTotal > 0 ? el('p', { class: 'result-line challenge-line' },
          cleared ? `★ ${t('level.challengeCleared')} ` : '',
          t('level.challengeDone', { right: state.cRight, total: state.cTotal })) : null,
        el('p', { class: 'small' }, textOf(world.starRules))
      ),
      level.fieldNotes ? el('section', { class: 'debrief-notes' },
        el('h3', {}, before ? t('level.fieldNotesRevisit') : t('level.fieldNotesNew')),
        el('p', { class: 'small' }, t('level.fieldNotesNote')),
        el('div', { class: 'field-note-grid' }, level.fieldNotes.map((note) => fieldNoteCard(note, { isNew: !before })))) : null,
      el('h3', {}, t('level.readMore')),
      el('ul', { class: 'read-more' }, level.readMore.map((link) =>
        referenceItem(link))),
      el('div', { class: 'actions' }, buttons)
    ));
    focusHeading(heading);
  }

  showMoment();
}
