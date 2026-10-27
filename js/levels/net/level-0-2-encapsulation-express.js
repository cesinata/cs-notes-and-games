// level-0-2-encapsulation-express.js
// Level 0.2 Encapsulation Express. Courier Kit's letter goes:
//   down Kit's house (each floor adds its wrapper and the player names the bundle),
//   along the road as bits,
//   through the router hut (which only unwraps up to the network layer),
//   and up Juno's house (each floor peels off its own wrapper).
// The steps, answer options and hints all live in content/net/zone-0.json
// (level "0.2", "play.steps"). This file just draws the scene and runs the steps.

import { el, clear, focusHeading, announce } from '../../engine/ui.js';
import { choiceList, continueButton } from '../../engine/choices.js';
import { drawSprite, makeSprite } from '../../engine/sprites.js';
import { t } from '../../engine/i18n.js';

// The little scene at the top, in pixels (the canvas is scaled up to fit).
const SCENE_W = 360;
const SCENE_H = 64;
const SPOTS = { sender: 44, router: 160, receiver: 314 };
const BUILDINGS = { sender: 26, router: 180, receiver: 334 }; // centre of each building

const FLOORS = {
  house: ['application', 'transport', 'network', 'datalink', 'physical'],
  router: ['network', 'datalink', 'physical']
};

const ACTIONS = {
  'wrap:transport': (p) => { p.layers.push('transport'); return 'transport'; },
  'wrap:network': (p) => { p.layers.push('network'); return 'network'; },
  'wrap:linkHeader': (p) => { p.linkHeader = true; return 'link'; },
  'wrap:linkTrailer': (p) => { p.linkTrailer = true; return 'link'; },
  toBits: (p) => { p.bits = true; return null; },
  fromBits: (p) => { p.bits = false; return null; },
  routerUnwrap: (p) => { p.bits = false; p.linkHeader = false; p.linkTrailer = false; return null; },
  routerRewrap: (p) => { p.linkHeader = true; p.linkTrailer = true; return 'link'; },
  'unwrap:link': (p) => { p.linkHeader = false; p.linkTrailer = false; return null; },
  'unwrap:network': (p) => { p.layers = p.layers.filter((l) => l !== 'network'); return null; },
  'unwrap:transport': (p) => { p.layers = p.layers.filter((l) => l !== 'transport'); return null; }
};

// Draws the parcel as nested, labelled boxes (or as a stream of bits).
function renderParcel(parcel, words, newest) {
  if (parcel.bits) {
    const bits = '0110100101101100011001010111010001110100011001010111001';
    return el('div', { class: 'bits-ribbon' },
      el('p', { class: 'bits-label' }, words.bits),
      el('div', { class: 'bits-window', 'aria-hidden': 'true' },
        el('span', { class: 'bits-track' }, `${bits} ${bits}`)));
  }
  let node = el('div', { class: 'wrap wrap-message' },
    makeSprite('parcel', 2), el('span', {}, words.message));
  parcel.layers.forEach((layer) => {
    node = el('div', { class: `wrap wrap-${layer}${newest === layer ? ' is-new' : ''}` },
      el('span', { class: 'wrap-tag' }, words[layer]), node);
  });
  if (parcel.linkHeader || parcel.linkTrailer) {
    node = el('div', { class: `wrap wrap-link${newest === 'link' ? ' is-new' : ''}` },
      parcel.linkHeader ? el('span', { class: 'wrap-tag' }, words.linkHeader) : null,
      node,
      parcel.linkTrailer ? el('span', { class: 'wrap-tag wrap-tag-trailer' }, words.linkTrailer) : null);
  }
  return node;
}

function drawScene(canvas, courierX) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#8DBF6A';
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
  for (let i = 0; i < 60; i += 1) {
    ctx.fillStyle = i % 2 ? '#7FB35E' : '#9CCB78';
    ctx.fillRect((i * 37) % SCENE_W, (i * 23) % 50, 2, 1);
  }
  // The road.
  ctx.fillStyle = '#D9B77E';
  ctx.fillRect(0, 48, SCENE_W, 9);
  ctx.fillStyle = '#C4A06A';
  for (let x = 4; x < SCENE_W; x += 12) ctx.fillRect(x, 52, 5, 1);
  // Trees and buildings.
  [[64, 6], [82, 20], [110, 4], [226, 8], [250, 22], [276, 4], [130, 22]].forEach(([x, y]) => drawSprite(ctx, 'tree', x, y, 1));
  drawSprite(ctx, 'house', BUILDINGS.sender - 8, 32, 1, { r: '#B5523B' });
  drawSprite(ctx, 'hut', BUILDINGS.router - 8, 35, 1);
  drawSprite(ctx, 'house', BUILDINGS.receiver - 8, 32, 1, { r: '#3D6B95' });
  // The courier.
  drawSprite(ctx, 'courier', Math.round(courierX) - 5, 40, 1);
}

export const encapsulationExpress = {
  id: '0.2',

  validatePlay(play) {
    const problems = [];
    ['places', 'floors', 'wrappers'].forEach((key) => {
      if (!play[key]) problems.push(`"${key}" is missing.`);
    });
    if (!Array.isArray(play.steps) || play.steps.length === 0) {
      problems.push('"steps" should be a list.');
      return problems;
    }
    play.steps.forEach((step, i) => {
      if (step.type === 'travel') {
        if (!['router', 'receiver'].includes(step.to)) problems.push(`steps[${i}] "to" should be "router" or "receiver".`);
        if (!step.text || !step.button) problems.push(`steps[${i}] needs "text" and "button".`);
      } else {
        if (!play.places || !play.places[step.place]) problems.push(`steps[${i}] has an unknown place "${step.place}".`);
        if (!play.floors || !play.floors[step.floor]) problems.push(`steps[${i}] has an unknown floor "${step.floor}".`);
        if (!step.prompt) problems.push(`steps[${i}] needs a "prompt".`);
        const correct = (step.options || []).filter((o) => o.correct).length;
        if (correct !== 1) problems.push(`steps[${i}] should have exactly one option with "correct": true.`);
        if (!Array.isArray(step.hints) || step.hints.length === 0) problems.push(`steps[${i}] needs at least one hint.`);
      }
      if (step.action && !ACTIONS[step.action]) problems.push(`steps[${i}] has an unknown action "${step.action}".`);
    });
    return problems;
  },

  // The Learn card picture: a fully wrapped frame.
  learnDiagram(level) {
    const words = level.play.wrappers;
    const full = { layers: ['transport', 'network'], linkHeader: true, linkTrailer: true, bits: false };
    return el('div', { class: 'learn-parcel', role: 'img', 'aria-label': t('parcel.aria') },
      renderParcel(full, words, null));
  },

  play(ctx) {
    const P = ctx.text;
    const words = P.wrappers;
    const parcel = { layers: [], linkHeader: false, linkTrailer: false, bits: false };
    let courierX = SPOTS.sender;
    let stepIndex = 0;

    // ---- Build the screen once; each step updates parts of it ----
    const canvas = el('canvas', { class: 'scene-canvas', width: SCENE_W, height: SCENE_H, 'aria-hidden': 'true' });
    const sceneLabels = el('div', { class: 'scene-labels', 'aria-hidden': 'true' },
      ['sender', 'router', 'receiver'].map((place) => el('span', {
        class: 'scene-label', style: `left:${(BUILDINGS[place] / SCENE_W) * 100}%`
      }, P.places[place])));
    const floorsBox = el('div', { class: 'floors-box board-inset' });
    const parcelBox = el('div', { class: 'parcel-box', 'aria-live': 'off' });
    const questionBox = el('div', { class: 'question-box' });

    ctx.area.append(
      el('figure', { class: 'scene' }, el('div', { class: 'scene-frame' }, canvas, sceneLabels)),
      el('div', { class: 'express-grid' },
        floorsBox,
        el('div', { class: 'express-main' }, parcelBox, questionBox))
    );
    drawScene(canvas, courierX);

    function showFloors(place, floor) {
      clear(floorsBox);
      if (place === 'road') {
        floorsBox.append(el('h3', {}, P.places.road), makeSprite('courier', 4));
        return;
      }
      const list = place === 'router' ? FLOORS.router : FLOORS.house;
      floorsBox.append(
        el('h3', {}, P.places[place]),
        el('ol', { class: 'floors', 'aria-label': t('parcel.floorsAria', { place: P.places[place] }) },
          list.map((id) => {
            const here = id === floor;
            return el('li', { class: `floor${here ? ' is-here' : ''}`, 'aria-current': here ? 'location' : null },
              el('span', { class: 'floor-name' }, P.floors[id]),
              here ? el('span', { class: 'floor-here' }, el('span', { 'aria-hidden': 'true' }, '◀ '), P.youAreHere) : null);
          }))
      );
    }

    function showParcel(newest) {
      clear(parcelBox);
      parcelBox.append(renderParcel(parcel, words, ctx.reducedMotion ? null : newest));
    }

    function moveCourier(target, done) {
      const start = courierX;
      if (ctx.reducedMotion) {
        courierX = target;
        drawScene(canvas, courierX);
        done();
        return;
      }
      const duration = 1100;
      const began = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - began) / duration);
        const eased = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
        courierX = start + (target - start) * eased;
        drawScene(canvas, courierX);
        if (t < 1) requestAnimationFrame(frame);
        else done();
      }
      requestAnimationFrame(frame);
    }

    function runStep() {
      if (stepIndex >= P.steps.length) { ctx.finish(); return; }
      const step = P.steps[stepIndex];
      stepIndex += 1;
      clear(questionBox);
      if (step.type === 'travel') runTravel(step);
      else runChoice(step);
    }

    function runChoice(step) {
      const target = SPOTS[step.place];
      if (Math.abs(courierX - target) > 1) { courierX = target; drawScene(canvas, courierX); }
      showFloors(step.place, step.floor);
      if (stepIndex === 1) showParcel(null);

      const heading = el('h2', {}, step.prompt);
      const after = el('div', { class: 'stage-after' });
      const isLast = stepIndex === P.steps.length;
      questionBox.append(heading, choiceList({
        options: step.options,
        reducedMotion: ctx.reducedMotion,
        onCorrect: () => {
          let newest = null;
          if (step.action) newest = ACTIONS[step.action](parcel);
          showParcel(newest);
          ctx.step([]);
          ctx.correct(step.success);
          after.append(continueButton(isLast ? t('level.seeResult') : P.continue, runStep));
        },
        onWrong: () => ctx.mistake()
      }));
      ctx.placeFeedback(questionBox);
      questionBox.append(after);
      ctx.step(step.hints);
      focusHeading(heading);
    }

    function runTravel(step) {
      ctx.step([]);
      ctx.clearFeedback();
      const heading = el('h2', {}, step.text);
      const button = el('button', { class: 'btn btn-continue', type: 'button' }, step.button);
      button.addEventListener('click', () => {
        button.disabled = true;
        showFloors('road');
        parcel.bits = true;
        showParcel(null);
        announce(t('parcel.onRoad'));
        const destination = step.to === 'router' ? SPOTS.router : SPOTS.receiver;
        moveCourier(destination, () => {
          if (step.action) ACTIONS[step.action](parcel);
          showParcel(null);
          runStep();
        });
      });
      questionBox.append(heading, button);
      ctx.placeFeedback(questionBox);
      focusHeading(heading);
    }

    runStep();
  }
};
