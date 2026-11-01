// wave.js
// Draws the wave that carries a few bits, for lessons and questions about modulation.
//   waveElement({ bits: '1011', kind: 'ask' })
// kind is 'ask' (the wave's height changes), 'fsk' (its pitch changes) or 'psk' (its timing flips).
// The bits are written under the wave and separated by dashed lines, so the picture never
// relies on colour alone.

import { el, svgEl } from './ui.js';
import { t } from './i18n.js';

const WIDTH = 320;
const HEIGHT = 110;
const MID = 46;
const AMP = 30;

// One bit's piece of wave: returns SVG path points.
function bitPoints(bit, kind, x0, width) {
  const points = [];
  const samples = 48;
  for (let i = 0; i <= samples; i += 1) {
    const f = i / samples;
    let y;
    if (kind === 'ask') y = bit === '1' ? Math.sin(2 * Math.PI * 3 * f) * AMP : 0;
    else if (kind === 'fsk') y = Math.sin(2 * Math.PI * (bit === '1' ? 5 : 2) * f) * AMP;
    else y = Math.sin(2 * Math.PI * 3 * f + (bit === '1' ? 0 : Math.PI)) * AMP;
    points.push(`${(x0 + f * width).toFixed(1)},${(MID - y).toFixed(1)}`);
  }
  return points.join(' ');
}

export function waveElement({ bits, kind }) {
  const width = WIDTH / bits.length;
  const svg = svgEl('svg', {
    class: 'wave', viewBox: `0 0 ${WIDTH} ${HEIGHT}`, role: 'img',
    'aria-label': t('wave.aria', { kind: t(`wave.kinds.${kind}`), bits: bits.split('').join(' ') })
  });
  svg.append(svgEl('line', { x1: 0, y1: MID, x2: WIDTH, y2: MID, class: 'wave-axis' }));
  bits.split('').forEach((bit, i) => {
    const x0 = i * width;
    svg.append(svgEl('polyline', { points: bitPoints(bit, kind, x0, width), class: 'wave-line' }));
    if (i > 0) svg.append(svgEl('line', { x1: x0, y1: 6, x2: x0, y2: HEIGHT - 28, class: 'wave-sep' }));
    svg.append(svgEl('text', { x: x0 + width / 2, y: HEIGHT - 10, 'text-anchor': 'middle', class: 'wave-bit' }, bit));
  });
  return el('div', { class: 'wave-wrap' }, svg);
}
