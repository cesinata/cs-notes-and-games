// feed.js
// Daily Feed: a swipe-through stack of bite-size cards from finished levels.
// Card types (written in content/*/zone-*.json under "feed"):
//   quiz     pick an answer, then see why
//   why      same, but asks for the reason behind a fact
//   predict  think of your answer, flip the card, then say if you got it
// Field Notes are mixed in as breathers. All screen text is in world.json "feed".

import { el, clear, focusHeading, announce, prefersReducedMotion, shuffle, setText } from './engine/ui.js';
import { t } from './engine/i18n.js';
import { textOf } from './engine/content.js';
import { makeSprite } from './engine/sprites.js';
import { buildSession, recordAnswer, finishSession, feedSummary } from './engine/feed-schedule.js';

export function renderFeed(app, world, zoneContents) {
  const F = world.feed;
  clear(app);
  const heading = el('h1', {}, F.title);
  const stage = el('div', { class: 'feed-stage' });
  app.append(el('main', { class: 'page feed-page' },
    el('div', { class: 'zone-top' }, el('a', { class: 'btn btn-quiet', href: world.base }, F.backToMap)),
    heading,
    el('p', { class: 'lead' }, F.intro),
    stage));
  focusHeading(heading);
  showStart();

  // ---------- Start screen ----------
  function showStart() {
    clear(stage);
    const summary = feedSummary(zoneContents);
    if (!summary.hasCards) {
      stage.append(el('div', { class: 'feed-card' },
        makeSprite('journal', 4),
        el('p', {}, F.empty),
        el('a', { class: 'btn', href: `${world.base}zone/0` }, F.emptyButton)));
      return;
    }
    if (summary.ready === 0) {
      stage.append(el('div', { class: 'feed-card' },
        el('h2', {}, F.hubCaughtUp),
        el('p', {}, F.caughtUp),
        summary.streakDays ? el('p', { class: 'feed-streak' }, F.streak.replace('{days}', summary.streakDays)) : null));
      return;
    }
    stage.append(el('div', { class: 'feed-card' },
      el('h2', {}, F.hubReady.replace('{count}', summary.ready)),
      summary.streakDays ? el('p', { class: 'feed-streak' }, F.streak.replace('{days}', summary.streakDays)) : null,
      el('button', { class: 'btn', type: 'button', onclick: startSession }, F.start)));
  }

  // ---------- A session ----------
  function startSession() {
    const queue = buildSession(zoneContents);
    let index = 0;
    let right = 0;
    let answered = 0;
    const requeued = new Set();
    const reduced = prefersReducedMotion();

    const counter = el('p', { class: 'feed-counter small' });
    const bar = el('div', { class: 'feed-bar', 'aria-hidden': 'true' });
    const cardSlot = el('div', { class: 'feed-slot' });
    clear(stage);
    stage.append(counter, bar, cardSlot);

    function drawProgress() {
      setText(counter, t('feed.card', { i: index + 1, n: queue.length }));
      clear(bar);
      queue.forEach((_, i) => bar.append(el('span', { class: i < index ? 'is-done' : i === index ? 'is-now' : '' })));
    }

    function next() {
      index += 1;
      if (index >= queue.length) showDone();
      else showCard();
    }

    // The card may come back once more later in this session.
    function comeBackLater(card) {
      if (requeued.has(card.id)) return;
      requeued.add(card.id);
      queue.splice(Math.min(queue.length, index + 4), 0, { ...card, retry: true });
    }

    function showCard() {
      drawProgress();
      const card = queue[index];
      const label = F.labels[card.type] || '';
      const after = el('div', { class: 'feed-after' });
      let done = false;

      function finishCard(correct, note) {
        done = true;
        if (card.type !== 'note') {
          answered += 1;
          if (correct) right += 1;
          recordAnswer(card.id, correct, Boolean(card.retry));
          if (!correct) comeBackLater(card);
        }
        after.append(
          note || null,
          el('button', { class: 'btn btn-continue', type: 'button', onclick: next }, F.next),
          el('p', { class: 'small feed-tip' }, F.swipeTip));
        const button = after.querySelector('button');
        if (button) button.focus();
      }

      let body;
      let title;
      if (card.type === 'note') {
        title = el('h2', {}, textOf(card.note.title));
        body = [
          el('p', {}, textOf(card.note.text)),
          card.note.source ? el('p', { class: 'field-note-source' }, t('fieldNotes.source'),
            el('a', { href: card.note.source.url, target: '_blank', rel: 'noopener' }, textOf(card.note.source.title))) : null
        ];
        window.setTimeout(() => finishCard(true), 0);
      } else if (card.type === 'predict') {
        title = el('h2', {}, textOf(card.prompt));
        const flip = el('button', { class: 'btn', type: 'button' }, F.flip);
        const reveal = el('div', { class: 'feed-reveal' });
        flip.addEventListener('click', () => {
          flip.remove();
          const got = el('button', { class: 'btn', type: 'button' }, F.gotIt);
          const notYet = el('button', { class: 'btn btn-quiet', type: 'button' }, F.notYet);
          const rate = el('div', { class: 'actions' }, got, notYet);
          got.addEventListener('click', () => { rate.remove(); finishCard(true); });
          notYet.addEventListener('click', () => {
            rate.remove();
            finishCard(false, el('p', { class: 'small' }, F.comesBack));
          });
          reveal.append(
            el('p', { class: 'feed-answer' }, textOf(card.answer)),
            el('p', { class: 'feed-check' }, F.selfCheck),
            rate);
          focusHeading(reveal.querySelector('.feed-answer'));
        });
        body = [card.setup ? el('p', {}, textOf(card.setup)) : null, flip, reveal];
      } else {
        title = el('h2', {}, textOf(card.prompt));
        const list = el('ul', { class: 'choices' });
        const buttons = [];
        shuffle(card.options).forEach((option) => {
          const mark = el('span', { class: 'choice-mark', 'aria-hidden': 'true' });
          const status = el('span', { class: 'visually-hidden' });
          const button = el('button', { class: 'choice', type: 'button' }, mark, el('span', {}, option.text), status);
          button.addEventListener('click', () => {
            buttons.forEach((b) => { b.disabled = true; });
            buttons.forEach((b) => {
              if (b.dataset.correct === 'yes') {
                b.classList.add('is-correct');
                b.querySelector('.choice-mark').textContent = '✓';
                b.querySelector('.visually-hidden').textContent = t('feed.correctAnswer');
              }
            });
            if (!option.correct) {
              button.classList.add('is-wrong');
              mark.textContent = '✗';
              status.textContent = t('feed.yourPick');
            }
            const verdict = option.correct ? t('feed.right') : t('feed.wrong');
            announce(`${option.correct ? t('feed.rightSr') : t('feed.wrongSr')}. ${textOf(card.explain)}`);
            finishCard(option.correct, el('div', { class: `feedback ${option.correct ? 'feedback-correct' : 'feedback-mistake'}` },
              el('strong', { class: 'feedback-label' }, verdict), ' ', textOf(card.explain),
              option.correct ? null : el('span', { class: 'feed-comeback' }, ` ${F.comesBack}`)));
          });
          if (option.correct) button.dataset.correct = 'yes';
          buttons.push(button);
          list.append(el('li', {}, button));
        });
        body = [list];
      }

      const cardNode = el('article', { class: `feed-card feed-${card.type}${reduced ? '' : ' feed-enter'}` },
        el('p', { class: 'feed-label' }, el('span', { class: 'tag' }, label), el('span', { class: 'small' }, card.levelTitle)),
        title,
        body,
        after);

      // Swipe left to go to the next card, once this one is answered.
      let startX = null;
      let startY = null;
      cardNode.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
      cardNode.addEventListener('touchend', (e) => {
        if (startX === null || !done) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        startX = null;
        if (dx < -70 && Math.abs(dy) < 50) next();
      });

      clear(cardSlot);
      cardSlot.append(cardNode);
      focusHeading(title);
    }

    function showDone() {
      const streak = finishSession();
      clear(stage);
      const title = el('h2', {}, F.doneTitle);
      stage.append(el('div', { class: 'feed-card feed-done' },
        el('div', { class: 'feed-done-art' }, makeSprite('star', 5)),
        title,
        el('p', {}, (right === answered ? F.doneTextPerfect : F.doneText).replace('{right}', right).replace('{total}', answered)),
        el('p', { class: 'feed-streak' }, streak.days === 1 ? F.streakFirst : F.streakMore.replace('{days}', streak.days)),
        el('a', { class: 'btn', href: world.base }, F.backToMap)));
      focusHeading(title);
    }

    showCard();
  }
}

// The small card on the hub.
export function feedHubCard(world, zoneContents) {
  const F = world.feed;
  const s = feedSummary(zoneContents);
  let line = F.hubEmpty;
  if (s.hasCards) line = s.ready > 0 ? F.hubReady.replace('{count}', s.ready) : (s.doneToday ? F.hubDone : F.hubCaughtUp);
  return el('a', { class: 'journal-card', href: `${world.base}feed` },
    makeSprite('parcel', 4),
    el('span', { class: 'district-text' },
      el('span', { class: 'district-name' }, F.title),
      el('span', { class: 'district-topic' }, line),
      s.streakDays ? el('span', { class: 'district-status' }, F.streak.replace('{days}', s.streakDays)) : null));
}
