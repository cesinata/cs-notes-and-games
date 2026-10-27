// hub.js
// The world map you see first, and the page for each district.
// The map is drawn in pixels on a canvas (just a picture). On top of it sit
// real buttons for each district, so it works with keyboard, touch and screen
// readers. Below the map, a signpost lists every district in words.

import { el, clear, focusHeading, starRow } from './engine/ui.js';
import { drawSprite, makeSprite, spriteSize, PALETTE } from './engine/sprites.js';
import { zoneStatus, finaleStatus, zoneStars } from './engine/progress.js';
import { getLevelResult, isStorageAvailable, resetProgress } from './engine/storage.js';

const MAP_W = 320;
const MAP_H = 200;

const STATUS_WORDS = {
  open: 'Open',
  building: 'Being built',
  locked: 'Locked'
};

// ---------------- Hub page ----------------

export function renderHub(app, world, onRefresh, notes = [], feedCard = null, regions = []) {
  clear(app);
  const heading = el('h1', { class: 'hub-title' }, world.title);

  const statuses = world.zones.map((zone, i) => zoneStatus(world, i));
  const finale = finaleStatus(world);

  const page = el('main', { class: 'page hub-page' },
    regionNav(world, regions),
    el('header', { class: 'hub-header' },
      heading,
      el('p', { class: 'lead' }, world.tagline)
    ),
    storageNotice(),
    buildMap(world, statuses, finale),
    el('div', { class: 'hub-cards' }, feedCard, journalCard(world, notes)),
    el('section', { class: 'signpost', 'aria-labelledby': 'signpost-heading' },
      el('h2', { id: 'signpost-heading' }, world.listHeading),
      el('ol', { class: 'district-list' },
        world.zones.map((zone, i) => districtCard(zone, statuses[i], world, i)),
        finaleCard(world.finale, finale)
      )
    ),
    resetArea(onRefresh)
  );
  app.append(page);
  focusHeading(heading);
}

// Links for going home and switching between subjects (regions), each with its own map and progress.
function regionNav(world, regions) {
  return el('nav', { class: 'region-nav', 'aria-label': 'Subjects' },
    el('ul', {},
      el('li', {}, el('a', { href: '#/', class: 'region-home' }, 'All subjects')),
      regions.map((r) => {
        const current = r.id === world.region.id;
        return el('li', {}, el('a', { href: `#/${r.id}/`, class: current ? 'is-current' : '', 'aria-current': current ? 'page' : null },
          makeSprite(r.sprite, 2),
          el('span', {}, el('span', { class: 'region-name' }, r.name), el('span', { class: 'region-subject' }, r.subject))));
      })));
}

function journalCard(world, notes) {
  const count = notes.filter((n) => n.unlocked).length;
  const line = world.journal.hubText.replace('{count}', count).replace('{total}', notes.length);
  return el('a', { class: 'journal-card', href: `${world.base}journal` },
    makeSprite('journal', 3),
    el('span', { class: 'district-text' },
      el('span', { class: 'district-name' }, world.journal.title),
      el('span', { class: 'district-topic' }, line)));
}

function storageNotice() {
  if (isStorageAvailable()) return null;
  return el('p', { class: 'notice' },
    'Progress won\'t be saved on this device, because this browser is blocking storage. You can still play everything.');
}

function lockedReason(world, index) {
  const before = world.zones[index - 1];
  return `Finish the core levels in ${before.name} to open this.`;
}

function districtCard(zone, status, world, index) {
  const { earned, max } = zoneStars(zone);
  const statusLine = status === 'locked' ? lockedReason(world, index)
    : status === 'building' ? 'Unlocked. Its levels are still being built.'
      : `${earned} of ${max} stars`;
  const icon = status === 'locked' ? makeSprite('lock', 3) : makeSprite(zone.map.sprite, 2, { r: zone.map.roof });
  const card = el('a', {
    class: `district-card is-${status}`,
    href: `${world.base}zone/${zone.id}`
  },
  el('span', { class: 'district-icon' }, icon),
  el('span', { class: 'district-text' },
    el('span', { class: 'district-name' }, `${zone.id}. ${zone.name}`),
    el('span', { class: 'district-topic' }, zone.topic),
    el('span', { class: 'district-status' }, `${STATUS_WORDS[status]}. ${statusLine}`)
  ));
  return el('li', {}, card);
}

function finaleCard(finale, status) {
  const icon = status === 'locked' ? makeSprite('lock', 3) : makeSprite('tower', 2);
  return el('li', {},
    el('div', { class: `district-card is-${status} is-finale` },
      el('span', { class: 'district-icon' }, icon),
      el('span', { class: 'district-text' },
        el('span', { class: 'district-name' }, finale.name),
        el('span', { class: 'district-topic' }, finale.topic),
        el('span', { class: 'district-status' },
          status === 'locked' ? 'Locked. Finish every core level in this region to open this.' : 'Being built.')
      )));
}

function resetArea(onRefresh) {
  const area = el('section', { class: 'reset-area' });
  function showAsk() {
    clear(area);
    area.append(el('button', { class: 'btn btn-quiet', type: 'button', onclick: showConfirm }, 'Reset progress'));
  }
  function showConfirm() {
    clear(area);
    const question = el('p', {}, 'Clear all your stars in this region and lock it again? This can\'t be undone.');
    const cancel = el('button', { class: 'btn btn-quiet', type: 'button', onclick: showAsk }, 'Keep my progress');
    const confirm = el('button', {
      class: 'btn btn-danger',
      type: 'button',
      onclick: () => { resetProgress(); onRefresh(); }
    }, 'Yes, reset everything');
    area.append(question, el('div', { class: 'actions' }, cancel, confirm));
    cancel.focus();
  }
  showAsk();
  return area;
}

// ---------------- The map ----------------

function buildMap(world, statuses, finale) {
  const canvas = el('canvas', { class: 'map-canvas', width: MAP_W, height: MAP_H, 'aria-hidden': 'true' });
  if (world.mapStyle === 'islands') drawIslands(canvas, world, statuses, finale);
  else drawValley(canvas, world, statuses, finale);

  const markers = world.zones.map((zone, i) => mapMarker(
    zone.map, `${zone.id}`, zone.name, statuses[i], `${world.base}zone/${zone.id}`
  ));
  markers.push(mapMarker(world.finale.map, '★', world.finale.name, finale, null));

  return el('figure', { class: 'map' },
    el('div', { class: 'map-frame' }, canvas, el('div', { class: 'map-markers' }, markers)),
    el('figcaption', { class: 'visually-hidden' }, `Map of ${world.title}. The same places are listed below.`)
  );
}

function mapMarker(pos, number, name, status, href) {
  const left = (pos.x / MAP_W) * 100;
  const top = (pos.y / MAP_H) * 100;
  const label = `${name}: ${STATUS_WORDS[status]}`;
  const tag = el('span', { class: 'marker-tag' },
    status === 'locked' ? makeSprite('lock', 2) : null,
    el('span', { class: 'marker-number' }, number),
    el('span', { class: 'marker-name' }, name)
  );
  const props = { class: `map-marker is-${status}`, style: `left:${left}%;top:${top}%`, 'aria-label': label };
  return href ? el('a', { ...props, href }, tag) : el('span', { ...props, role: 'img' }, tag);
}

// A tiny seeded random generator, so the map looks the same every visit.
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawValley(canvas, world, statuses, finale) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const rand = seededRandom(7);
  const ground = new Uint8Array(MAP_W * MAP_H); // 0 grass, 1 water, 2 path
  const at = (x, y) => ground[y * MAP_W + x];

  // Grass with little tufts.
  ctx.fillStyle = '#8DBF6A';
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  for (let i = 0; i < 700; i += 1) {
    ctx.fillStyle = rand() < 0.5 ? '#7FB35E' : '#9CCB78';
    ctx.fillRect(Math.floor(rand() * MAP_W), Math.floor(rand() * MAP_H), 2, 1);
  }

  // The sea in the bottom-right corner, and a river running into it.
  for (let y = 0; y < MAP_H; y += 1) {
    const seaEdge = 236 + (MAP_H - y) * 0.95 + Math.sin(y * 0.3) * 3;
    const riverX = 138 + y * 0.6 + Math.sin(y / 17) * 9;
    for (let x = 0; x < MAP_W; x += 1) {
      if (x > seaEdge || (Math.abs(x - riverX) < 4)) ground[y * MAP_W + x] = 1;
    }
  }
  for (let y = 0; y < MAP_H; y += 1) {
    for (let x = 0; x < MAP_W; x += 1) {
      if (at(x, y) !== 1) continue;
      const nearLand = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
        const nx = x + dx; const ny = y + dy;
        return nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H && at(nx, ny) !== 1;
      });
      ctx.fillStyle = nearLand ? '#E6CF94' : ((x * 7 + y * 13) % 23 === 0 ? '#9CC8DE' : '#6BA6C7');
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // The path linking the districts in order. Where it crosses water, a bridge.
  const stops = world.zones.map((z) => z.map).concat([world.finale.map]);
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i]; const b = stops[i + 1];
    const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    for (let s = 0; s <= steps; s += 1) {
      const px = Math.round(a.x + ((b.x - a.x) * s) / steps);
      const py = Math.round(a.y + ((b.y - a.y) * s) / steps) + 2;
      for (let dx = -2; dx <= 1; dx += 1) {
        for (let dy = -2; dy <= 1; dy += 1) {
          const x = px + dx; const y = py + dy;
          if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
          const water = at(x, y) === 1;
          ctx.fillStyle = water ? ((x + y) % 3 === 0 ? PALETTE.W : PALETTE.w) : PALETTE.d;
          ctx.fillRect(x, y, 1, 1);
          if (!water) ground[y * MAP_W + x] = 2;
        }
      }
    }
  }

  // Trees, kept away from water, paths and buildings.
  const trees = [];
  for (let i = 0; i < 90 && trees.length < 34; i += 1) {
    const x = Math.floor(rand() * (MAP_W - 12));
    const y = Math.floor(rand() * (MAP_H - 12)) + 6;
    const clearOfStuff = stops.every((s) => Math.hypot(s.x - x - 5, s.y - y - 6) > 22);
    let free = clearOfStuff;
    for (let dy = 0; free && dy < 12; dy += 2) {
      for (let dx = 0; free && dx < 10; dx += 2) {
        if (at(x + dx, y + dy) !== 0) free = false;
      }
    }
    if (free) trees.push({ x, y });
  }
  // A small wood around Wire Woods.
  const woods = world.zones[1].map;
  [[-26, -14], [16, -18], [-20, 6], [22, 2]].forEach(([dx, dy]) => trees.push({ x: woods.x + dx, y: woods.y + dy }));

  // A boat in the harbour.
  const harbour = world.zones[5].map;
  drawSprite(ctx, 'boat', harbour.x + 38, harbour.y + 14, 1);

  // Draw trees and buildings from back to front so nearer things overlap.
  const things = trees.map((t) => ({ y: t.y + 11, draw: () => drawSprite(ctx, 'tree', t.x, t.y, 1) }));
  stops.forEach((stop) => {
    const { width, height } = spriteSize(stop.sprite);
    things.push({ y: stop.y, draw: () => drawSprite(ctx, stop.sprite, stop.x - Math.floor(width / 2), stop.y - height, 1, { r: stop.roof }) });
  });
  things.sort((a, b) => a.y - b.y).forEach((t) => t.draw());

  // Gently fade districts that are still locked (the lock icon also says so).
  world.zones.forEach((zone, i) => {
    if (statuses[i] === 'locked') fadeAround(ctx, zone.map);
  });
  if (finale === 'locked') fadeAround(ctx, world.finale.map);
}

// Algo Archipelago: islands in the sea, joined by a dotted ferry route.
function drawIslands(canvas, world, statuses, finale) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const rand = seededRandom(11);
  ctx.fillStyle = '#5E9CC2';
  ctx.fillRect(0, 0, MAP_W, MAP_H);
  for (let i = 0; i < 260; i += 1) {
    ctx.fillStyle = rand() < 0.5 ? '#79B2D3' : '#4F8DB3';
    ctx.fillRect(Math.floor(rand() * MAP_W), Math.floor(rand() * MAP_H), 3, 1);
  }
  const stops = world.zones.map((z) => z.map).concat([world.finale.map]);
  // Ferry route: little dashes between islands, in order.
  ctx.fillStyle = '#E8F1F6';
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i]; const b = stops[i + 1];
    const steps = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    for (let s = 0; s <= steps; s += 1) {
      if (s % 6 > 2) continue;
      ctx.fillRect(Math.round(a.x + ((b.x - a.x) * s) / steps), Math.round(a.y + ((b.y - a.y) * s) / steps) - 4, 1, 1);
    }
  }
  // Each island: a wobbly sand ring with grass inside.
  stops.forEach((stop, n) => {
    const cx = stop.x; const cy = stop.y - 6;
    for (let y = -18; y <= 18; y += 1) {
      for (let x = -24; x <= 24; x += 1) {
        const angle = Math.atan2(y, x);
        const r = 17 + Math.sin(angle * 3 + n) * 3 + Math.cos(angle * 5 + n * 2) * 2;
        const d = Math.hypot(x, y * 1.3);
        if (d > r) continue;
        ctx.fillStyle = d > r - 4 ? '#E9D49A' : ((x * 3 + y * 7 + n) % 11 === 0 ? '#7FB35E' : '#8DBF6A');
        ctx.fillRect(cx + x, cy + y, 1, 1);
      }
    }
  });
  // Palm-ish trees and buildings.
  stops.forEach((stop, n) => {
    if (n % 2 === 0) drawSprite(ctx, 'tree', stop.x + 10, stop.y - 20, 1, { g: '#4E9A3F', G: '#2F6F33' });
  });
  stops.forEach((stop) => {
    const { width, height } = spriteSize(stop.sprite);
    drawSprite(ctx, stop.sprite, stop.x - Math.floor(width / 2), stop.y - height, 1, { r: stop.roof });
  });
  drawSprite(ctx, 'boat', 8, 178, 1);
  world.zones.forEach((zone, i) => { if (statuses[i] === 'locked') fadeAround(ctx, zone.map); });
  if (finale === 'locked') fadeAround(ctx, world.finale.map);
}

function fadeAround(ctx, pos) {
  ctx.fillStyle = 'rgba(232, 240, 220, 0.45)';
  ctx.fillRect(pos.x - 9, pos.y - 17, 18, 18);
}

// ---------------- District page ----------------

export function renderZone(app, world, zoneIndex, zoneContent, builtIds) {
  clear(app);
  const zone = world.zones[zoneIndex];
  const status = zoneStatus(world, zoneIndex);
  const heading = el('h1', {}, zone.name);

  const back = el('a', { class: 'btn btn-quiet', href: world.base }, 'Back to map');
  let body;

  if (status === 'locked') {
    body = el('p', { class: 'notice' }, `Locked. ${lockedReason(world, zoneIndex)}`);
  } else if (status === 'building' || !zoneContent) {
    body = el('p', { class: 'notice' }, 'This district is unlocked, but its levels are still being built. Check back after the next milestone.');
  } else {
    body = el('ol', { class: 'level-list' }, zone.levels.map((level) => levelCard(level, builtIds, world.base)));
  }

  const { earned, max } = zoneStars(zone);
  app.append(el('main', { class: 'page zone-page' },
    el('div', { class: 'zone-top' }, back),
    el('header', { class: 'zone-header' },
      el('span', { class: 'zone-icon' }, makeSprite(zone.map.sprite, 4, { r: zone.map.roof })),
      el('div', {},
        heading,
        el('p', { class: 'lead' }, zone.topic),
        status === 'open' ? el('p', { class: 'zone-stars' }, `${earned} of ${max} stars earned here`) : null
      )
    ),
    body
  ));
  focusHeading(heading);
}

function levelCard(level, builtIds, base) {
  const built = builtIds.includes(level.id);
  const result = getLevelResult(level.id);
  const stars = result ? result.stars : 0;
  const coreTag = level.core ? el('span', { class: 'tag' }, 'Core') : el('span', { class: 'tag tag-quiet' }, 'Optional');
  const action = built
    ? el('a', { class: 'btn', href: `${base}level/${level.id}` }, result ? 'Play again' : 'Play')
    : el('span', { class: 'coming-soon' }, 'Coming soon');
  return el('li', { class: `level-card${built ? '' : ' is-unbuilt'}` },
    el('div', { class: 'level-card-text' },
      el('h2', { class: 'level-name' }, `${level.id} ${level.title}`),
      el('p', { class: 'level-meta' }, coreTag, built ? starRow(stars, 3, 2) : null)
    ),
    action
  );
}
