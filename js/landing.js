// landing.js
// The main page (#/). It says what the project is, who it's for and how a level
// works, then lists every subject (region) as a card with your progress and a
// button to enter. All the words are in content/landing.json and
// content/regions.json, so you can edit them without touching code.

import { el, clear, focusHeading } from './engine/ui.js';
import { makeSprite } from './engine/sprites.js';
import { isStorageAvailable } from './engine/storage.js';
import { t } from './engine/i18n.js';
import { languageSwitch } from './language-switch.js';

// summaries: [{ region, earned, max, builtCount }], worked out by main.js.
export function renderLanding(app, text, summaries) {
  clear(app);
  const heading = el('h1', { class: 'hub-title' }, text.title);

  app.append(el('main', { class: 'page landing-page' },
    el('header', { class: 'hub-header' },
      heading,
      el('p', { class: 'lead' }, text.tagline)
    ),
    languageSwitch(),
    isStorageAvailable() ? null : el('p', { class: 'notice' }, t('common.storageNotice')),
    el('section', { class: 'board landing-intro' },
      text.intro.map((p) => el('p', {}, p))
    ),
    el('section', { class: 'landing-subjects', 'aria-labelledby': 'subjects-heading' },
      el('h2', { id: 'subjects-heading' }, text.subjectsTitle),
      el('p', {}, text.subjectsIntro),
      el('ul', { class: 'subject-list' }, summaries.map((s) => subjectCard(s, text)))
    ),
    el('section', { class: 'board landing-how', 'aria-labelledby': 'how-heading' },
      el('h2', { id: 'how-heading' }, text.howTitle),
      el('p', {}, text.howIntro),
      el('ol', { class: 'how-steps' }, text.how.map((step) =>
        el('li', {}, el('strong', {}, step.name), el('span', {}, step.text)))),
      el('h3', {}, text.extrasTitle),
      el('ul', { class: 'how-extras' }, text.extras.map((item) =>
        el('li', {}, el('strong', {}, item.name), el('span', {}, item.text))))
    ),
    el('section', { class: 'board landing-who', 'aria-labelledby': 'who-heading' },
      el('h2', { id: 'who-heading' }, text.whoTitle),
      el('ul', {}, text.who.map((line) => el('li', {}, line)))
    ),
    el('p', { class: 'small landing-note' }, text.note)
  ));
  focusHeading(heading);
}

function subjectCard({ region, earned, max, builtCount }, text) {
  const levelsWord = builtCount === 1
    ? text.progressLevels.one
    : text.progressLevels.other.replace('{n}', builtCount);
  const progress = text.progress
    .replace('{earned}', earned)
    .replace('{max}', max)
    .replace('{levels}', levelsWord);
  const nameId = `subject-${region.id}`;
  return el('li', { class: 'subject-card' },
    el('span', { class: 'subject-icon' }, makeSprite(region.sprite, 5)),
    el('div', { class: 'subject-text' },
      el('h3', { id: nameId, class: 'subject-name' }, region.name),
      el('p', { class: 'subject-topic' }, region.subject),
      el('p', {}, region.description),
      el('p', { class: 'subject-progress' }, progress),
      el('a', { class: 'btn', href: `#/${region.id}/`, 'aria-describedby': nameId },
        text.enter.replace('{name}', region.name))
    )
  );
}
