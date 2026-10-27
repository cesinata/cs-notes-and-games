// level-0-1-layer-cake.js
// Level 0.1 Layer Cake. The player:
//   1. builds the OSI cake (7 slices) from the bottom up,
//   2. builds the TCP/IP cake (4) and answers two questions about it,
//   3. builds the hybrid cake (5),
//   4. compares the three cakes side by side,
//   5. serves 5 customer orders: pick the slice that does a job, then its
//      "topper" (the data unit name: message, segment, packet, frame, bits).
// All the words come from content/net/zone-0.json (level "0.1", section "play").

import { el, svgEl, clear, focusHeading, announce, shuffle } from '../../engine/ui.js';
import { choiceList, continueButton, wobble } from '../../engine/choices.js';
import { makeSprite } from '../../engine/sprites.js';

// Cap colours for the customers, so each villager looks a little different.
const CUSTOMER_CAPS = ['#B5523B', '#7D5A9E', '#2F7F86', '#C9802F', '#3E7039'];

export const layerCake = {
  id: '0.1',

  // Checks the "play" section of the content file. Returns a list of problems.
  validatePlay(play) {
    const problems = [];
    const layers = play.layers || {};
    if (!play.layers) problems.push('"layers" is missing.');
    if (!Array.isArray(play.cakes) || play.cakes.length === 0) {
      problems.push('"cakes" should be a list of cakes.');
    } else {
      play.cakes.forEach((cake, i) => {
        (cake.layers || []).concat(cake.extras || []).forEach((id) => {
          if (!layers[id]) problems.push(`cakes[${i}] uses "${id}", which isn't in "layers".`);
        });
        if (!cake.title || !cake.intro || !cake.done) problems.push(`cakes[${i}] needs a title, intro and done text.`);
        (cake.questions || []).forEach((q, j) => {
          const correct = (q.options || []).filter((o) => o.correct).length;
          if (correct !== 1) problems.push(`cakes[${i}].questions[${j}] should have exactly one option with "correct": true.`);
        });
      });
    }
    if (!play.cakes || !play.cakes.find((c) => c.id === 'hybrid')) problems.push('there should be a cake with "id": "hybrid".');
    const orders = play.orders || {};
    if (!Array.isArray(orders.list) || orders.list.length === 0) problems.push('"orders.list" is missing.');
    else {
      orders.list.forEach((order, i) => {
        if (!layers[order.layer]) problems.push(`orders.list[${i}] has an unknown layer "${order.layer}".`);
        if (!orders.units || !orders.units[order.unit]) problems.push(`orders.list[${i}] has an unknown unit "${order.unit}".`);
      });
    }
    if (!play.compare || !play.compare.spans) problems.push('"compare.spans" is missing.');
    return problems;
  },

  // The Learn card picture: two machines, peers joined by protocols.
  learnDiagram() {
    const rows = [
      { y: 34, label: 'Layer 3' },
      { y: 84, label: 'Layer 2' },
      { y: 134, label: 'Layer 1' }
    ];
    const svg = svgEl('svg', {
      class: 'diagram', viewBox: '0 0 360 230', role: 'img',
      'aria-label': 'Two machines, each with three stacked layers. Matching layers are joined by dashed lines labelled protocol. Arrows show each layer serving the one above. A wire joins the bottom layers.'
    });
    svg.append(
      svgEl('text', { x: 80, y: 20, class: 'dia-title', 'text-anchor': 'middle' }, 'Machine A'),
      svgEl('text', { x: 280, y: 20, class: 'dia-title', 'text-anchor': 'middle' }, 'Machine B')
    );
    rows.forEach((row) => {
      svg.append(
        svgEl('rect', { x: 20, y: row.y, width: 120, height: 34, rx: 3, class: 'dia-box' }),
        svgEl('rect', { x: 220, y: row.y, width: 120, height: 34, rx: 3, class: 'dia-box' }),
        svgEl('text', { x: 80, y: row.y + 22, 'text-anchor': 'middle', class: 'dia-label' }, row.label),
        svgEl('text', { x: 280, y: row.y + 22, 'text-anchor': 'middle', class: 'dia-label' }, row.label),
        svgEl('line', { x1: 140, y1: row.y + 17, x2: 220, y2: row.y + 17, class: 'dia-dash' }),
        svgEl('text', { x: 180, y: row.y + 12, 'text-anchor': 'middle', class: 'dia-small' }, 'protocol')
      );
    });
    // "service" arrows between the left stack's layers.
    [[134, 118], [84, 68]].forEach(([from, to]) => {
      svg.append(svgEl('path', { d: `M 152 ${from} L 152 ${to + 2} M 147 ${to + 8} L 152 ${to + 2} L 157 ${to + 8}`, class: 'dia-arrow' }));
    });
    svg.append(
      svgEl('text', { x: 6, y: 128, class: 'dia-small', transform: 'rotate(-90 6 128)', 'text-anchor': 'middle' }, 'service'),
      svgEl('path', { d: 'M 14 128 L 14 82 M 10 88 L 14 82 L 18 88', class: 'dia-arrow' }),
      svgEl('path', { d: 'M 80 168 L 80 200 L 280 200 L 280 168', class: 'dia-wire' }),
      svgEl('text', { x: 180, y: 220, 'text-anchor': 'middle', class: 'dia-small' }, 'the actual wire')
    );
    return svg;
  },

  play(ctx) {
    const P = ctx.text;
    const area = ctx.area;
    const nameOf = (id) => P.layers[id].name;
    const hybrid = P.cakes.find((c) => c.id === 'hybrid');

    // Build the list of stages, then run them one after another.
    const stages = [];
    P.cakes.forEach((cake) => {
      stages.push((next) => buildCake(cake, next));
      (cake.questions || []).forEach((q) => stages.push((next) => askQuestion(q, next)));
    });
    stages.push((next) => showCompare(next));
    const orders = shuffle(P.orders.list);
    orders.forEach((order, i) => stages.push((next) => serveOrder(order, i, orders.length, next)));

    let stageIndex = 0;
    function runNext() {
      if (stageIndex >= stages.length) { ctx.finish(); return; }
      const stage = stages[stageIndex];
      stageIndex += 1;
      ctx.clearFeedback();
      clear(area);
      stage(runNext);
    }
    runNext();

    // ---- Stage: build a cake from the bottom up ----
    function buildCake(cake, next) {
      let placed = 0;
      const heading = el('h2', {}, cake.title);
      const stand = el('ol', { class: 'cake-stand' });
      const tray = el('div', { class: 'tray', role: 'group', 'aria-label': 'Slices to place' });
      const after = el('div', { class: 'stage-after' });

      function drawStand() {
        clear(stand);
        stand.setAttribute('aria-label', `${cake.title}: ${placed} of ${cake.layers.length} slices placed, listed from the bottom`);
        cake.layers.forEach((id, i) => {
          if (i < placed) {
            stand.append(el('li', { class: `slice slice-${id}` }, nameOf(id)));
          } else if (i === placed) {
            stand.append(el('li', { class: 'slice slice-empty is-next' }, 'Next slice goes here'));
          } else {
            stand.append(el('li', { class: 'slice slice-empty' }, el('span', { class: 'visually-hidden' }, 'Empty spot')));
          }
        });
      }

      shuffle(cake.layers.concat(cake.extras || [])).forEach((id) => {
        const button = el('button', { class: `slice-btn slice-${id}`, type: 'button' }, nameOf(id));
        button.addEventListener('click', () => {
          if (id === cake.layers[placed]) {
            button.remove();
            placed += 1;
            drawStand();
            if (placed === cake.layers.length) {
              tray.querySelectorAll('button').forEach((b) => { b.disabled = true; });
              ctx.step([]);
              ctx.correct(cake.done);
              after.append(continueButton('Continue', next));
            } else {
              ctx.step(P.layers[cake.layers[placed]].hints);
              ctx.correct(`${nameOf(id)} is on.`);
              announce(`${nameOf(id)} placed. ${placed} of ${cake.layers.length}.`);
            }
          } else {
            const isExtra = (cake.extras || []).includes(id);
            ctx.mistake(isExtra ? cake.extraHint : undefined);
            wobble(button, ctx.reducedMotion);
          }
        });
        tray.append(button);
      });

      drawStand();
      area.append(
        heading,
        el('p', {}, cake.intro),
        el('div', { class: 'cake-builder' },
          el('div', { class: 'stand-wrap' }, stand, el('div', { class: 'cake-plate', 'aria-hidden': 'true' })),
          el('div', { class: 'tray-wrap' }, el('p', { class: 'small' }, 'Tray'), tray)
        )
      );
      ctx.placeFeedback(area);
      area.append(after);
      ctx.step(P.layers[cake.layers[0]].hints);
      focusHeading(heading);
    }

    // ---- Stage: a multiple-choice question ----
    function askQuestion(q, next) {
      const heading = el('h2', {}, q.prompt);
      const after = el('div', { class: 'stage-after' });
      area.append(
        el('p', { class: 'small' }, 'Quick question'),
        heading,
        choiceList({
          options: q.options,
          reducedMotion: ctx.reducedMotion,
          onCorrect: () => { ctx.correct(q.explain); after.append(continueButton('Continue', next)); },
          onWrong: () => ctx.mistake()
        })
      );
      ctx.placeFeedback(area);
      area.append(after);
      ctx.step(q.hints);
      focusHeading(heading);
    }

    // ---- Stage: the three cakes side by side ----
    function showCompare(next) {
      const C = P.compare;
      const heading = el('h2', {}, C.title);
      const columns = ['osi', 'tcpip', 'hybrid'].map((cakeId) => {
        const spans = C.spans[cakeId];
        const column = el('div', { class: 'compare-cake', role: 'list' });
        Object.entries(spans).forEach(([layerId, [start, end]]) => {
          const rowStart = 8 - end;
          const rowEnd = 8 - start + 1;
          column.append(el('div', {
            class: `slice slice-${layerId}`,
            role: 'listitem',
            style: `grid-row:${rowStart} / ${rowEnd}`
          }, nameOf(layerId)));
        });
        return el('div', { class: 'compare-col' }, el('h3', {}, C.labels[cakeId]), column);
      });
      area.append(heading, el('p', {}, C.text), el('div', { class: 'compare' }, columns));
      ctx.step([]);
      ctx.placeFeedback(area);
      area.append(el('div', { class: 'stage-after' }, continueButton(C.button, next)));
      focusHeading(heading);
    }

    // ---- Stage: one customer order ----
    function serveOrder(order, index, total, next) {
      const O = P.orders;
      const heading = el('h2', {}, O.title);
      const after = el('div', { class: 'stage-after' });
      const unitArea = el('div', { class: 'unit-area' });

      const slices = el('ol', { class: 'mini-cake', 'aria-label': 'Hybrid cake slices, listed from the bottom' });
      const sliceButtons = [];
      hybrid.layers.forEach((id) => {
        const button = el('button', { class: `slice-btn slice-${id}`, type: 'button' }, nameOf(id));
        button.addEventListener('click', () => {
          if (id === order.layer) {
            button.classList.add('is-chosen');
            button.prepend(el('span', { class: 'choice-mark', 'aria-hidden': 'true' }, '✓'));
            sliceButtons.forEach((b) => { b.disabled = true; });
            ctx.correct(`${nameOf(id)} it is.`);
            askUnit();
          } else {
            button.disabled = true;
            button.classList.add('is-wrong');
            button.prepend(el('span', { class: 'choice-mark', 'aria-hidden': 'true' }, '✗'));
            wobble(button, ctx.reducedMotion);
            ctx.mistake();
          }
        });
        sliceButtons.push(button);
        slices.append(el('li', {}, button));
      });

      function askUnit() {
        const prompt = el('h3', {}, O.unitPrompt);
        const unitOptions = Object.entries(O.units).map(([id, name]) => ({ text: name, correct: id === order.unit }));
        unitArea.append(prompt, choiceList({
          options: unitOptions,
          label: 'Toppers',
          reducedMotion: ctx.reducedMotion,
          onCorrect: () => {
            ctx.step([]);
            ctx.correct(O.served.replace('{layer}', nameOf(order.layer)).replace('{unit}', O.units[order.unit]));
            const last = index === total - 1;
            after.append(continueButton(last ? O.finishButton : O.next, next));
          },
          onWrong: () => ctx.mistake()
        }));
        ctx.step(order.unitHints);
        focusHeading(prompt);
      }

      const customer = el('div', { class: 'customer' },
        el('span', { class: 'customer-art' }, makeSprite('courier', 4, { c: CUSTOMER_CAPS[index % CUSTOMER_CAPS.length] })),
        el('blockquote', { class: 'speech' },
          el('p', { class: 'speech-name' }, order.customer),
          el('p', {}, order.request))
      );

      area.append(
        el('p', { class: 'small' }, `Order ${index + 1} of ${total}`),
        heading,
        index === 0 ? el('p', {}, O.intro) : null,
        customer,
        el('div', { class: 'order-grid' },
          el('div', {}, el('h3', {}, O.layerPrompt), slices),
          unitArea
        )
      );
      ctx.placeFeedback(area);
      area.append(after);
      ctx.step(order.hints);
      focusHeading(heading);
    }
  }
};
