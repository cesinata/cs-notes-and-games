// choice.js
// "choice" activity: pick one answer. Wrong picks get a cross and a hint; the right one shows why.

import { el, focusHeading } from '../ui.js';
import { t } from '../i18n.js';
import { choiceList, continueButton } from '../choices.js';

export function renderChoice({ activity, area, ctx, done }) {
  const heading = el('h2', {}, activity.prompt);
  const after = el('div', { class: 'stage-after' });
  area.append(heading, choiceList({
    options: activity.options,
    reducedMotion: ctx.reducedMotion,
    onCorrect: () => { ctx.step([]); ctx.correct(activity.explain); after.append(continueButton(t('level.continue'), done)); },
    onWrong: () => ctx.mistake()
  }));
  ctx.placeFeedback(area);
  area.append(after);
  ctx.step(activity.hints);
  focusHeading(heading);
}
