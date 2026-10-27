// sprites.js
// All the little pixel pictures, drawn in code so the game needs no image files.
// Each sprite is a grid of letters. Each letter is a colour from PALETTE,
// and "." means see-through. To tweak a picture, edit its letters.

export const PALETTE = {
  k: '#263024', // outline ink
  w: '#9C6B3F', // wood
  W: '#6E4627', // dark wood
  r: '#B5523B', // roof (can be swapped per building)
  R: '#8A3B2B', // roof shadow
  y: '#F2B84B', // honey
  Y: '#FBE3A0', // lit window
  g: '#5E9A4B', // leaf
  G: '#3E7039', // dark leaf
  p: '#EFE6CF', // plaster wall
  P: '#CDBF9C', // faded (empty star)
  s: '#E8B48A', // skin
  c: '#2F7F86', // courier cap
  n: '#3B4A6B', // coat
  o: '#C08A4A', // satchel
  x: '#A3ABA6', // stone
  X: '#6C7472', // dark stone
  d: '#D9B77E'  // dirt path
};

const SPRITES = {
  courier: [
    '...kkkk...',
    '..kcccck..',
    '.kcccccck.',
    '..kssssk..',
    '..kskssk..',
    '..kssssk..',
    '...kkkk...',
    '..knnnnk..',
    '.knnnnnnk.',
    '.ksnnnnok.',
    '..knnnnok.',
    '..knkknk..',
    '..knk.knk.',
    '..kk...kk.'
  ],
  house: [
    '.......kk.......',
    '......krrk......',
    '.....krrrrk.....',
    '....krrrrrrk....',
    '...krrrrrrrrk...',
    '..krrrrrrrrrrk..',
    '.kRRRRRRRRRRRRk.',
    '..kppppppppppk..',
    '..kpkkkppkkkpk..',
    '..kpkYkppkYkpk..',
    '..kpkkkppkkkpk..',
    '..kppppkkppppk..',
    '..kpppkwwkpppk..',
    '..kpppkwykpppk..',
    '..kpppkwwkpppk..',
    '..kkkkkkkkkkkk..'
  ],
  hut: [
    '...........k....',
    '..........kyk...',
    '...........k....',
    '..kkkkkkkkkkkk..',
    '.kwwwwwwwwwwwwk.',
    'kWWWWWWWWWWWWWWk',
    '.kxxxxxxxxxxxxk.',
    '.kxXxxxxxxxxXxk.',
    '.kxkkkxxxxkkkxk.',
    '.kxkYkxxxxkwkxk.',
    '.kxkkkxxxxkwkxk.',
    '.kxxxxxxxxkwkxk.',
    'kkkkkkkkkkkkkkkk'
  ],
  castle: [
    'kkk.kkk..kkk.kkk',
    'kxk.kxk..kxk.kxk',
    'kxkkkxkkkkxkkkxk',
    'kxxxxxxxxxxxxxxk',
    'kxXxxxxxxxxxxXxk',
    'kxxkkkxxxxkkkxxk',
    'kxxkYkxxxxkYkxxk',
    'kxxkkkxxxxkkkxxk',
    'kxxxxxxkkxxxxxxk',
    'kxxxxxkwwkxxxxxk',
    'kxxxxxkwwkxxxxxk',
    'kxxxxxkwykxxxxxk',
    'kkkkkkkkkkkkkkkk'
  ],
  tower: [
    '....kkkk....',
    '...kyyyyk...',
    '..kyyyyyyk..',
    '.kkkkkkkkkk.',
    '..kppppppk..',
    '..kpkkkkpk..',
    '..kpkYYkpk..',
    '..kpkkkkpk..',
    '..kppppppk..',
    '..kppkkppk..',
    '..kpkwwkpk..',
    '..kpkwwkpk..',
    '.kkkkkkkkkk.'
  ],
  tree: [
    '...kkkk...',
    '..kggggk..',
    '.kggGgggk.',
    'kggggggGgk',
    'kgGggggggk',
    'kggggGgggk',
    '.kgggggGk.',
    '..kggggk..',
    '...kwwk...',
    '...kwwk...',
    '..kkwwkk..'
  ],
  lock: [
    '..kkkk..',
    '.kk..kk.',
    '.k....k.',
    'kkkkkkkk',
    'kyyyyyyk',
    'kyykkyyk',
    'kyykkyyk',
    'kyyyyyyk',
    'kkkkkkkk'
  ],
  star: [
    '....k....',
    '...kyk...',
    'kkkyyykkk',
    'kyyyyyyyk',
    '.kyyyyyk.',
    '..kyyyk..',
    '.kyykyyk.',
    '.kyk.kyk.',
    '.kk...kk.'
  ],
  parcel: [
    'kkkkkkkkkk',
    'kwwwkkwwwk',
    'kwwwkkwwwk',
    'kkkkkkkkkk',
    'kwwwkkwwwk',
    'kwwwkkwwwk',
    'kwwwkkwwwk',
    'kkkkkkkkkk'
  ],
  lighthouse: [
    '....kkkk....',
    '...kyYYyk...',
    '...kkkkkk...',
    '....kppk....',
    '...krrrrk...',
    '...kppppk...',
    '...kppppk...',
    '..krrrrrrk..',
    '..kpppkppk..',
    '..kpppkppk..',
    '..krrrrrrk..',
    '.kppppppppk.',
    '.kpppkwkppk.',
    'kkkkkkkkkkkk'
  ],
  journal: [
    'kkkkkkkkkkkk',
    'kwwwwwwwwwwk',
    'kwkkkkkkkkwk',
    'kwkYYYYYYkwk',
    'kwkkkkkkkkwk',
    'kwwwwwwwwwwk',
    'kwwwwyywwwwk',
    'kwwwwyywwwwk',
    'kwwwwwwwwwwk',
    'kppppppppppk',
    'kkkkkkkkkkkk'
  ],
  boat: [
    '.....k......',
    '.....kp.....',
    '.....kpp....',
    '.....kppp...',
    '.....k......',
    'kkkkkkkkkkkk',
    '.kwwwwwwwwk.',
    '..kkkkkkkk..'
  ]
};

// The empty star is the full star with faded colours.
SPRITES.starEmpty = SPRITES.star;
const DEFAULT_OVERRIDES = { starEmpty: { y: PALETTE.P } };

export function spriteSize(name) {
  const rows = SPRITES[name];
  return { width: rows[0].length, height: rows.length };
}

// Draws a sprite onto a canvas. overrides swaps colours, e.g. { r: '#3D6B95' }
// gives a house a blue roof.
export function drawSprite(ctx, name, x, y, scale = 1, overrides = {}) {
  const rows = SPRITES[name];
  if (!rows) return;
  const colours = { ...PALETTE, ...(DEFAULT_OVERRIDES[name] || {}), ...overrides };
  if (overrides.r && !overrides.R) colours.R = shade(overrides.r, -0.25);
  rows.forEach((row, rowIndex) => {
    for (let col = 0; col < row.length; col += 1) {
      const colour = colours[row[col]];
      if (!colour) continue;
      ctx.fillStyle = colour;
      ctx.fillRect(x + col * scale, y + rowIndex * scale, scale, scale);
    }
  });
}

// Returns a small canvas showing one sprite, for use inside the page.
// It's decorative, so screen readers skip it.
export function makeSprite(name, scale = 3, overrides = {}) {
  const { width, height } = spriteSize(name);
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.className = `sprite sprite-${name}`;
  canvas.setAttribute('aria-hidden', 'true');
  drawSprite(canvas.getContext('2d'), name, 0, 0, scale, overrides);
  return canvas;
}

// Makes a hex colour lighter (amount > 0) or darker (amount < 0).
export function shade(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  const adjusted = channels.map((c) => {
    const target = amount < 0 ? 0 : 255;
    return Math.round(c + (target - c) * Math.abs(amount));
  });
  return `#${adjusted.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

// Warn in the console if a sprite row is the wrong width (easy mistake when editing).
Object.entries(SPRITES).forEach(([name, rows]) => {
  const width = rows[0].length;
  rows.forEach((row, i) => {
    if (row.length !== width) console.warn(`Sprite "${name}" row ${i} is ${row.length} wide, expected ${width}.`);
  });
});
