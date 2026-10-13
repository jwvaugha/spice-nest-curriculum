// Reference-style hand figures (separate track from the Blender pipeline).
//
// Style source: the user's licensed Adobe Stock art in scripts/hand-viz/references v2/
// (gitignored, never commit it). AdobeStock_418107399 ("Portion size ... outline
// diagram") is vector; its fist and open palm are copied out of it and adapted:
// mirrored to a right hand (thumb on the right, like every other figure), scaled
// to real size and placed on the shared wrist. The thumbs-up is that fist with its
// thumb raised (pose from AdobeStock_663743938, a bitmap). The cupped hand keeps
// the Blender pose (its fingertip foreshortening reads as cupped; the references'
// cupped hand reads as a flat palm), recoloured into the reference palette.
//
// The tool, the ≈ and the frame come from the generated figures, so scale and
// layout match. Measures are marked with the reference's dashed callout, in our accent.
//   node scripts/hand-viz/refstyle/build.mjs  ->  src/viz/refstyle/hand-<id>.svg
//   --export          also copy them to Chapter Content/ for hand-tuning in Illustrator
//                     (skips files already there, so hand edits are never clobbered)
//   --export --force  overwrite those copies too (discards hand edits)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { THUMB_UP } from './thumb.mjs';
import { fingertipLayer } from './fingertips.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(here, '../../..');
const GEN = path.join(APP, 'src/viz/generated');
const OUT = path.join(APP, 'src/viz/refstyle');
const EXPORT = path.resolve(APP, '../Chapter Content/Images/Module 5/Chapter 1 - Measuring and Portion Size Techniques');
const doExport = process.argv.includes('--export'), force = process.argv.includes('--force');
const CACHE = path.join(here, 'cache');
const REF = path.join(here, '../references v2/AdobeStock_418107399.ai');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

import { P } from './palette.mjs';

// --- vector paths out of the reference -----------------------------------------
function refSvg() {
  const svg = path.join(CACHE, 'ref1.svg');
  if (!fs.existsSync(svg)) {
    const pdf = path.join(CACHE, 'ref1.pdf');
    execFileSync('gs', ['-q', '-dNOPAUSE', '-dBATCH', '-dSAFER', '-dEPSCrop', '-sDEVICE=pdfwrite', '-o', pdf, REF]);
    execFileSync('pdftocairo', ['-svg', pdf, svg]);
  }
  return fs.readFileSync(svg, 'utf8');
}
const pct = (s) => '#' + s.match(/[\d.]+/g).map((v) => Math.round(+v * 2.55).toString(16).padStart(2, '0')).join('');
function refPaths() {
  const src = refSvg();
  const body = src.slice(src.indexOf('</defs>'));
  const out = [];
  // top-level filled paths only (clip groups hold the food, not the hands)
  for (const m of body.matchAll(/<path fill-rule="nonzero" fill="(rgb\([^)]*\))" fill-opacity="1" d="([^"]*)"\/>/g)) {
    const nums = m[2].match(/-?[\d.]+/g).map(Number);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
    }
    out.push({ fill: pct(m[1]), d: m[2].replace(/\s+/g, ' ').trim(), cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, box: [x0, y0, x1, y1] });
  }
  return out;
}
export { P };
const RED = new Set(['#b13e20', '#bc2428']);
function pick(paths, [x0, y0, x1, y1], exclude) {
  return paths.filter((p) => p.cx > x0 && p.cx < x1 && p.cy > y0 && p.cy < y1 && !RED.has(p.fill)
    && !(exclude && p.cx > exclude[0] && p.cx < exclude[2] && p.cy > exclude[1] && p.cy < exclude[3]));
}

// Mirror (to a right hand) + similarity that sends ref point A -> a and B -> b.
function fit([A, B], [a, b]) {
  const m = ([x, y]) => [-x, y];
  const [Am, Bm] = [m(A), m(B)];
  const dz = [Bm[0] - Am[0], Bm[1] - Am[1]], dw = [b[0] - a[0], b[1] - a[1]];
  const den = dz[0] ** 2 + dz[1] ** 2;
  const k = [(dw[0] * dz[0] + dw[1] * dz[1]) / den, (dw[1] * dz[0] - dw[0] * dz[1]) / den]; // dw / dz
  const e = a[0] - (k[0] * Am[0] - k[1] * Am[1]), f = a[1] - (k[1] * Am[0] + k[0] * Am[1]);
  const r = (v) => +v.toFixed(5);
  return { matrix: `matrix(${r(-k[0])} ${r(-k[1])} ${r(-k[1])} ${r(k[0])} ${r(e)} ${r(f)})`, scale: Math.hypot(...k) };
}

// --- figure frame from the generated SVG ----------------------------------------
function frame(id) {
  const src = fs.readFileSync(path.join(GEN, `hand-${id}.svg`), 'utf8');
  const open = `<g mask="url(#hand-${id}-fade)">`;
  const a = src.indexOf(open) + open.length;
  const b = src.indexOf('</g>', src.lastIndexOf('stroke="#de7a2d"', src.indexOf('<g transform="translate(')));
  return { head: src.slice(0, a), hand: src.slice(a, b), tail: src.slice(b) };
}
// Tool and food in the reference's ink: dark outlines, a touch heavier.
const inkTool = (s) => s
  .replace(/stroke="#6a5d50" stroke-width="[\d.]+"/g, `stroke="${P.line}" stroke-width="1.6"`)
  .replace(/stroke="#f7c194" stroke-width="[\d.]+"/g, `stroke="${P.line}" stroke-width="1.2"`);

const dashed = (d, extra = '') => `<path d="${d}" fill="none" stroke="${P.accent}" stroke-width="2.6" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const rr = (x0, y0, x1, y1, r) => `M${x0 + r},${y0} H${x1 - r} A${r},${r} 0 0 1 ${x1},${y0 + r} V${y1 - r} A${r},${r} 0 0 1 ${x1 - r},${y1} H${x0 + r} A${r},${r} 0 0 1 ${x0},${y1 - r} V${y0 + r} A${r},${r} 0 0 1 ${x0 + r},${y0} Z`;

const refGroup = (paths, matrix) => `<g transform="${matrix}">${paths.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join('')}</g>`;

// Shared wrist: centre x -22, cut off (faded) at y 132..171, as in the traced figures.
const WRIST = [-22, 178];

function palmRef(paths) {
  const ps = pick(paths, [975, 1170, 1650, 2100], [850, 1250, 1160, 1520]);
  // wrist centre -> shared wrist; middle fingertip -> the traced palm's (182 mm hand)
  const { matrix } = fit([[1473, 2045], [1320, 1179]], [WRIST, [-45, -287]]);
  return { ps, matrix };
}

const FIGS = {
  fist(paths) {
    const ps = pick(paths, [60, 450, 575, 1115]);
    // ref anchors: wrist centre at the cut, top of the middle knuckles -> 85 mm wide fist
    const { matrix } = fit([[341, 1075], [317, 489]], [WRIST, [-22, -78]]);
    return refGroup(ps, matrix);
  },
  palm(paths) {
    const { ps, matrix } = palmRef(paths);
    return refGroup(ps, matrix);
  },
  thumb(paths) {
    const ps = pick(paths, [60, 450, 575, 1115]);
    const { matrix } = fit([[341, 1075], [317, 489]], [WRIST, [-22, -78]]);
    const palm = palmRef(paths);
    return THUMB_UP(ps, matrix, refGroup(palm.ps, palm.matrix));
  },
  cupped(_, hand) {
    // the Blender pose, recoloured to the reference palette with its heavier ink line
    return hand
      .replaceAll('fill="#b9875b"', `fill="${P.skin}"`).replaceAll('fill="#c39b70"', `fill="${P.hi}"`)
      .replaceAll('fill="#976844"', `fill="${P.shade}"`).replaceAll('fill="#684831"', `fill="${P.deep}"`)
      .replaceAll('fill="#e3ceb6" stroke="#976844"', `fill="${P.nail}" stroke="${P.line}"`)
      .replaceAll('fill="#403126"', `fill="${P.line}"`)
      .replace(/<path [^>]*fill="none" stroke="#de7a2d"[^>]*\/>/, '')
      .replaceAll('stroke="#403126" stroke-width="5.6"', `stroke="${P.line}" stroke-width="7.6"`);
  },
};

// Callouts, in figure coordinates (px, y down).
const CALLOUT = {
  fist: dashed(rr(-138, -92, 102, 132, 34)),
  cupped: dashed(rr(-130, -164, 124, 120, 36)),
  palm: dashed(rr(-122, -108, 44, 96, 18)),
  thumb: dashed(rr(29, -121, 93, -17, 24)),
};

// The reference palm spreads its thumb and fingers wider than the Blender palm,
// so the shared hand area grows (same for every figure, keeping them consistent)
// and the tool and ≈ move right by the same amount.
const FRAME = { x0: -222, y0: -334, dx: 92 };
function reframe(svg) {
  return svg
    .replace(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)" width="[\d.]+" height="[\d.]+"/, (m, x, y, w, h) => {
      const x1 = +x + +w + FRAME.dx, y1 = +y + +h;
      const W = +(x1 - FRAME.x0).toFixed(1), H = +(y1 - FRAME.y0).toFixed(1);
      return `viewBox="${FRAME.x0} ${FRAME.y0} ${W} ${H}" width="${Math.round(W)}" height="${Math.round(H)}"`;
    })
    // the fade mask covers the whole (wider, taller) hand area
    .replace(/(<mask [^>]*?) x="[-\d.]+" y="[-\d.]+" width="[\d.]+"/, `$1 x="${FRAME.x0}" y="${FRAME.y0}" width="${-FRAME.x0 + 230}"`)
    .replace(/(<mask [^>]*>)<rect x="[-\d.]+" y="[-\d.]+" width="[\d.]+" height="([\d.]+)"/, (m, a, h) => `${a}<rect x="${FRAME.x0}" y="${FRAME.y0}" width="${-FRAME.x0 + 230}" height="${+h + 41}"`)
    .replace(/(<mask [^>]*?) height="([\d.]+)"/, (m, a, h) => `${a} height="${+h + 41}"`)
    .replace(/<g transform="translate\(([-\d.]+) ([-\d.]+)\)">/, (m, x, y) => `<g transform="translate(${+(+x + FRAME.dx).toFixed(1)} ${y})">`)
    .replace(/<text x="([-\d.]+)"/, (m, x) => `<text x="${+(+x + FRAME.dx).toFixed(1)}"`);
}

// Cupped hand: the curled fingertips are nearer the viewer than the heap, so
// they're cut out of the hand as their own shapes (fingertips.mjs) and drawn
// over the vegetables; the heap is nudged up a little so its far edge tucks
// under them. Named groups (hand / vegetables / fingertips) for Illustrator.
const HEAP_SHIFT = -9;
function tuckUnderFingertips(svg, hand) {
  const a = svg.indexOf('</g>', svg.indexOf('<g mask=')) + 4;
  const b = svg.indexOf('<g transform="translate(', a);
  const heap = svg.slice(a, b);
  // (a matrix, not translate(): reframe() moves the tool by its translate())
  return `${svg.slice(0, a).replace('<g mask=', '<g id="hand" mask=')}<g id="vegetables" transform="matrix(1 0 0 1 0 ${HEAP_SHIFT})">${heap}</g>${fingertipLayer(hand)}${svg.slice(b)}`;
}

const paths = refPaths();
for (const id of ['fist', 'palm', 'cupped', 'thumb']) {
  const { head, hand, tail } = frame(id);
  const art = FIGS[id](paths, hand);
  // the callout sits on top, outside the fade mask, so the dashes stay crisp at the wrist
  const hEnd = tail.indexOf('</g>') + 4;
  let out = `${head}\n${art}\n${tail.slice(0, hEnd)}${inkTool(tail.slice(hEnd))}`.replace('</svg>', `${CALLOUT[id]}\n</svg>`);
  if (id === 'cupped') out = tuckUnderFingertips(out, art);
  out = reframe(out);
  fs.writeFileSync(path.join(OUT, `hand-${id}.svg`), out);
  console.log(`wrote src/viz/refstyle/hand-${id}.svg`);
  if (doExport) {
    const dest = path.join(EXPORT, `hand-${id}.svg`);
    if (fs.existsSync(dest) && !force) console.log(`  kept existing Chapter Content/.../hand-${id}.svg (pass --force to overwrite)`);
    else { fs.writeFileSync(dest, out); console.log(`  exported Chapter Content/.../hand-${id}.svg`); }
  }
}
