// Renders every entry in src/viz/handComparisons.js to one SVG
// (src/viz/generated/hand-<id>.svg): the posed 3D hand (from handPoses.json,
// written by pose.mjs) beside its measuring tool, both at real size and the
// same px-per-mm as the volume figures.
//
// The hand is vector-traced, not drawn by hand:
//   1. Software-rasterize the posed mesh at RZ x resolution with a depth
//      buffer and per-pixel interpolated normals.
//   2. Build binary masks: silhouette, light/shadow tone bands (Lambert, same
//      light as the volume figures), contour lines (where a nearer surface
//      overlaps a farther one, or two fingers meet), and the highlighted part.
//   3. Trace each mask with potrace (smooth Bezier outlines) and stack them.
// Every figure uses the same hand frame, so the hand sits in exactly the same
// place at the same size in all four; only the pose and highlight change.
//
// The measuring tools are drawn as 3D solids with exact volumes: a dry
// measuring cup is a cylinder whose depth is solved for its volume; the
// tablespoon's bowl is a spherical cap solved the same way; the 3 oz of meat is
// the cooked cut from the volume figures (volumeComparisons.js).
//
// Needs potrace (`brew install potrace`). Writes handReport.json too, and
// exits non-zero if a tool's volume misses its target.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { spiceTokens as t } from '../../src/theme.js';
import { HAND_COMPARISONS } from '../../src/viz/handComparisons.js';
import { VOLUME_COMPARISONS } from '../../src/viz/volumeComparisons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const GEN = path.resolve(here, '../../src/viz/generated');
const posed = JSON.parse(fs.readFileSync(path.join(GEN, 'handPoses.json'), 'utf8'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'handviz-'));

// ---------------- projection ----------------
// Two orthographic views at the same px-per-mm. The hand is seen face-on (it
// lies palm-up and the camera looks almost straight down), the convention of
// printed hand-portion guides: palm toward you, fingers up. The tools get a
// 3/4 view (50 deg) so you can see what's in them; at a common scale, sizes
// still compare directly.
const HAND_TILT = (85 * Math.PI) / 180;
const HCOS = Math.cos(HAND_TILT), HSIN = Math.sin(HAND_TILT);
const HCAM = [0, -HCOS, HSIN];
const hproj = ([x, y, z]) => [x * SC, (-z * HCOS - y * HSIN) * SC];
const hdepth = (p) => dot(p, HCAM);
const CAM_TILT = (50 * Math.PI) / 180;
const SC = 2.2; // px per mm, shared with the volume figures
const COS = Math.cos(CAM_TILT), SIN = Math.sin(CAM_TILT);
const CAM = [0, -COS, SIN];
const HLIGHT = norm([-0.45, 0.55, 0.7]); // hand: the same upper-left light in its face-on view (+y is up)
const proj = ([x, y, z]) => [x * SC, (-z * COS - y * SIN) * SC];
const depth = (p) => dot(p, CAM);
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function norm(v) { const l = Math.hypot(...v); return v.map((c) => c / l); }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

// ---------------- color / svg helpers ----------------
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, f) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * f));
const f = (v) => +v.toFixed(1);
const pathOf = (arr, close = true) => `M${arr.map(([x, y]) => `${f(x)},${f(y)}`).join('L')}${close ? 'Z' : ''}`;
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cr(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const polyArea = (P) => Math.abs(P.reduce((s, [x1, y1], i) => { const [x2, y2] = P[(i + 1) % P.length]; return s + x1 * y2 - x2 * y1; }, 0)) / 2;
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let x = a; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}

const C = {
  // Skin: the warm browns of the neutralA scale.
  skin: t.neutralA[600],
  skinLight: t.neutralA[500],
  skinShadow: t.neutralA[800],
  skinDeep: t.neutralA[1000],
  line: t.neutralA[1200],
  nail: mix(t.neutralA[500], t.orange[25], 0.55), // pale, slightly pink-warm
  nailEdge: t.neutralA[800],
  ghost: t.orange[10], // washes out the parts that aren't the measure
  accent: t.orange[700], // theme.palette.primary.main
  steel: t.neutralB[200],
  steelLight: t.white,
  steelDark: t.neutralB[400],
  steelEdge: t.neutralB[700],
  approx: t.neutralB[400],
};
const FOOD = {
  starch: { fill: t.orange[100], speck: t.white, edge: t.orange[300] },
  veg: { fill: t.secondaryGreen, speck: mix(t.secondaryGreen, t.white, 0.35), edge: mix(t.secondaryGreen, t.neutralA[1200], 0.4) },
  fat: { fill: mix(t.orange[400], t.neutralA[800], 0.35), speck: mix(t.orange[400], t.white, 0.3), edge: t.neutralA[800] },
};

// ---------------- hand mesh ----------------
const tris = posed.tris;
const parts = posed.groups.map((g) => (g.startsWith('thumb-') && g !== 'thumb-metacarpal' ? 'thumb' : g.endsWith('-metacarpal') || g === 'wrist' ? 'palm' : g.split('-')[0]));
const vertPart = posed.group.map((g) => parts[g]);
const NV = posed.group.length;
// Rest-pose surface regions from pose.py: > 0 inside the palm / a nail.
const PALM = posed.palm, NAIL = posed.nail, THUMB = posed.thumb;
const vertsOf = (id) => { const a = posed.poses[id]; return Array.from({ length: NV }, (_, i) => [a[3 * i], a[3 * i + 1], a[3 * i + 2]]); };

function vertexNormals(V) {
  const N = V.map(() => [0, 0, 0]);
  for (let k = 0; k < tris.length; k += 3) {
    const [a, b, c] = [tris[k], tris[k + 1], tris[k + 2]];
    const n = cross(sub(V[b], V[a]), sub(V[c], V[a])); // area-weighted
    for (const i of [a, b, c]) for (let j = 0; j < 3; j++) N[i][j] += n[j];
  }
  // Orient outward (the glTF winding is consistent; check its sign once).
  const cen = V.reduce((s, v) => [s[0] + v[0] / NV, s[1] + v[1] / NV, s[2] + v[2] / NV], [0, 0, 0]);
  const sign = V.reduce((s, v, i) => s + dot(N[i], sub(v, cen)), 0) > 0 ? 1 : -1;
  return N.map((n) => norm(n.map((c) => c * sign)));
}

// Common hand frame (figure px) across all poses, so the hand never moves.
const ALL_V = HAND_COMPARISONS.map((c) => vertsOf(c.id));
const tableZ = Math.min(...ALL_V.flat().map((v) => v[2]));
const stubY = Math.min(...ALL_V.flat().map((v) => v[1])); // where the model's forearm stub is cut off
const FADE_FROM_Y = stubY + 22, FADE_TO_Y = stubY + 4; // world y: the forearm fades out over this span
const handPx = ALL_V.flat().filter((v) => v[1] > FADE_TO_Y).map(hproj);
const HB = [Math.min(...handPx.map((p) => p[0])) - 10, Math.min(...handPx.map((p) => p[1])) - 8, Math.max(...handPx.map((p) => p[0])) + 10, Math.max(...handPx.map((p) => p[1])) + 2];

// ---------------- raster ----------------
const RZ = 4; // raster px per figure px
const RW = Math.ceil((HB[2] - HB[0]) * RZ), RH = Math.ceil((HB[3] - HB[1]) * RZ);
function rasterize(V, N) {
  const zb = new Float32Array(RW * RH).fill(-Infinity);
  const nb = new Float32Array(RW * RH * 3);
  const yb = new Float32Array(RW * RH);
  const pb = new Int8Array(RW * RH).fill(-1);
  const pa = new Float32Array(RW * RH), na = new Float32Array(RW * RH), ta = new Float32Array(RW * RH); // palm / nail / thumb scores
  const partIdx = [...new Set(parts)];
  const vp = vertPart.map((p) => partIdx.indexOf(p));
  const S = V.map((v) => { const [x, y] = hproj(v); return [(x - HB[0]) * RZ, (y - HB[1]) * RZ, hdepth(v)]; });
  for (let k = 0; k < tris.length; k += 3) {
    const ia = tris[k], ib = tris[k + 1], ic = tris[k + 2];
    const [a, b, c] = [S[ia], S[ib], S[ic]];
    const area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (Math.abs(area) < 1e-9) continue;
    const x0 = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]))), x1 = Math.min(RW - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
    const y0 = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]))), y1 = Math.min(RH - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((b[0] - px) * (c[1] - py) - (b[1] - py) * (c[0] - px)) / area;
      const w1 = ((c[0] - px) * (a[1] - py) - (c[1] - py) * (a[0] - px)) / area;
      const w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const d = w0 * a[2] + w1 * b[2] + w2 * c[2];
      const i = y * RW + x;
      if (d <= zb[i]) continue;
      zb[i] = d;
      for (let j = 0; j < 3; j++) nb[3 * i + j] = w0 * N[ia][j] + w1 * N[ib][j] + w2 * N[ic][j];
      yb[i] = w0 * V[ia][1] + w1 * V[ib][1] + w2 * V[ic][1];
      pa[i] = w0 * PALM[ia] + w1 * PALM[ib] + w2 * PALM[ic];
      na[i] = w0 * NAIL[ia] + w1 * NAIL[ib] + w2 * NAIL[ic];
      ta[i] = w0 * THUMB[ia] + w1 * THUMB[ib] + w2 * THUMB[ic];
      pb[i] = w0 >= w1 && w0 >= w2 ? vp[ia] : w1 >= w2 ? vp[ib] : vp[ic];
    }
  }
  return { zb, nb, yb, pb, pa, na, ta, partIdx };
}

// In-place box blur (two passes ~ a soft Gaussian), radius r raster px.
function boxBlur(a, r) {
  const b = new Float32Array(a.length);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < RH; y++) { let acc = 0; for (let x = -r; x < RW + r; x++) { if (x + r < RW && x + r >= 0) acc += a[y * RW + x + r]; if (x - r - 1 >= 0 && x - r - 1 < RW) acc -= a[y * RW + x - r - 1]; if (x >= 0 && x < RW) b[y * RW + x] = acc / (2 * r + 1); } }
    for (let x = 0; x < RW; x++) { let acc = 0; for (let y = -r; y < RH + r; y++) { if (y + r < RH && y + r >= 0) acc += b[(y + r) * RW + x]; if (y - r - 1 >= 0 && y - r - 1 < RH) acc -= b[(y - r - 1) * RW + x]; if (y >= 0 && y < RH) a[y * RW + x] = acc / (2 * r + 1); } }
  }
}

function components(m) {
  const lab = new Int32Array(m.length), sizes = [0];
  for (let s0 = 0; s0 < m.length; s0++) {
    if (!m[s0] || lab[s0]) continue;
    const id = sizes.length; let n = 0; const st = [s0]; lab[s0] = id;
    while (st.length) { const i = st.pop(); n++; const x = i % RW, y = (i / RW) | 0; for (const j of [x > 0 ? i - 1 : -1, x < RW - 1 ? i + 1 : -1, y > 0 ? i - RW : -1, y < RH - 1 ? i + RW : -1]) if (j >= 0 && m[j] && !lab[j]) { lab[j] = id; st.push(j); } }
    sizes.push(n);
  }
  return { lab, sizes };
}
function dropSmall(m, minPx) {
  const { lab, sizes } = components(m);
  for (let i = 0; i < m.length; i++) if (m[i] && sizes[lab[i]] < minPx) m[i] = 0;
}
function keepLargest(m) {
  const lab = new Int32Array(m.length); let best = 0, bestN = 0, id = 0;
  for (let s0 = 0; s0 < m.length; s0++) {
    if (!m[s0] || lab[s0]) continue;
    id++; let n = 0; const st = [s0]; lab[s0] = id;
    while (st.length) { const i = st.pop(); n++; const x = i % RW, y = (i / RW) | 0; for (const j of [x > 0 ? i - 1 : -1, x < RW - 1 ? i + 1 : -1, y > 0 ? i - RW : -1, y < RH - 1 ? i + RW : -1]) if (j >= 0 && m[j] && !lab[j]) { lab[j] = id; st.push(j); } }
    if (n > bestN) { bestN = n; best = id; }
  }
  for (let i = 0; i < m.length; i++) m[i] = lab[i] === best ? 1 : 0;
}

// ---------------- potrace ----------------
function trace(mask, name) {
  const rowBytes = Math.ceil(RW / 8);
  const body = Buffer.alloc(rowBytes * RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) if (mask[y * RW + x]) body[y * rowBytes + (x >> 3)] |= 0x80 >> (x & 7);
  const pbm = path.join(TMP, `${name}.pbm`);
  fs.writeFileSync(pbm, Buffer.concat([Buffer.from(`P4\n${RW} ${RH}\n`), body]));
  const svg = execFileSync('potrace', [pbm, '-b', 'svg', '--flat', '-t', '6', '-a', '1.1', '-O', '0.4', '-u', '1', '-o', '-'], { encoding: 'utf8' });
  const tr = svg.match(/<g transform="([^"]+)"/)?.[1];
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join(' ');
  if (!d) return null;
  // potrace's own transform maps its units back to raster px; then raster px -> figure px.
  return { d, transform: `translate(${f(HB[0])} ${f(HB[1])}) scale(${1 / RZ}) ${tr}` };
}
// Traced paths live in raster units (scaled by 1/RZ), so stroke widths given
// in figure px are scaled back up here.
const tracedPath = (tp, attrs) => (tp ? `<path transform="${tp.transform}" d="${tp.d}" ${attrs.replace(/stroke-width="([\d.]+)"/, (_, w) => `stroke-width="${f(w * RZ)}"`)}/>` : '');

function handLayer(spec) {
  const V = vertsOf(spec.id);
  const { zb, nb, pa, na, ta } = rasterize(V, vertexNormals(V));
  const n = RW * RH;
  const nails = new Uint8Array(n), solid = new Uint8Array(n), light = new Uint8Array(n), shadow = new Uint8Array(n), deep = new Uint8Array(n), lines = new Uint8Array(n), hi = new Uint8Array(n);
  // Light per pixel, then blurred (within the hand) so the tone bands follow
  // the broad forms instead of breaking into small islands on busy poses.
  const litF = new Float32Array(n), wF = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    if (zb[i] === -Infinity) continue;
    solid[i] = 1; wF[i] = 1;
    litF[i] = dot(norm([nb[3 * i], nb[3 * i + 1], nb[3 * i + 2]]), HLIGHT);
  }
  boxBlur(litF, Math.round(1.5 * RZ)); boxBlur(wF, Math.round(1.5 * RZ));
  for (let i = 0; i < n; i++) {
    if (!solid[i]) continue;
    const lit = litF[i] / (wF[i] || 1);
    if (lit > 0.82) light[i] = 1;
    if (lit < 0.32) shadow[i] = 1;
    if (lit < 0.05) deep[i] = 1;
    if (na[i] > 0) nails[i] = 1;
    hi[i] = spec.highlight === 'all' ? 1
      : spec.highlight === 'palm' ? +(pa[i] > 0)
      : spec.highlight === 'thumb' ? +(ta[i] > 0) : 0;
  }
  // Ambient occlusion, screen space: a pixel sitting clearly deeper than the
  // surface around it (the hollow of a cupped palm, the creases where curled
  // fingers meet the palm) gets the shadow tone even if it faces the light.
  const AO_R = Math.round(7 * RZ);
  const zf = new Float32Array(n), wf = new Float32Array(n);
  for (let i = 0; i < n; i++) if (solid[i]) { zf[i] = zb[i]; wf[i] = 1; }
  boxBlur(zf, AO_R); boxBlur(wf, AO_R);
  for (let i = 0; i < n; i++) if (solid[i] && wf[i] > 0 && zf[i] / wf[i] - zb[i] > 3.5) shadow[i] = 1;
  // Contour lines: a pixel is a line pixel if something within LINE_R is
  // clearly nearer (an overlap; the line lands on the far side), or if the
  // surface folds sharply there (two curled fingers pressed side by side,
  // where their normals point apart) -- what separates the fingers of a fist.
  const LINE_R = Math.round(0.55 * RZ), JUMP = 2.5, CREASE = Number(process.env.CREASE ?? 0.2), R2 = LINE_R * LINE_R;
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
    const i = y * RW + x;
    if (!solid[i]) continue;
    search: for (let dy = -LINE_R; dy <= LINE_R; dy++) for (let dx = -LINE_R; dx <= LINE_R; dx++) {
      if (dx * dx + dy * dy > R2) continue;
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= RW || yy >= RH) continue;
      const j = yy * RW + xx;
      if (!solid[j]) continue;
      const ni = 3 * i, nj = 3 * j;
      const cosN = (nb[ni] * nb[nj] + nb[ni + 1] * nb[nj + 1] + nb[ni + 2] * nb[nj + 2]) / (Math.hypot(nb[ni], nb[ni + 1], nb[ni + 2]) * Math.hypot(nb[nj], nb[nj + 1], nb[nj + 2]) || 1);
      if (zb[j] - zb[i] > JUMP || (cosN < CREASE && zb[j] >= zb[i])) { lines[i] = 1; break search; }
    }
  }
  // Part boundaries come from per-vertex bone groups, so they're stair-stepped
  // at mesh resolution; blur and re-threshold the highlight to smooth them.
  // A part outline should be one shape: drop stray islands (e.g. a sliver of
  // the thumb's base peeking out beside the curled fingers).
  if (spec.highlight !== 'all') keepLargest(hi);
  // Tone and line shapes smaller than a few px read as stray overlapping bits.
  for (const m of [light, shadow, deep]) dropSmall(m, (4 * RZ) ** 2);
  dropSmall(lines, (2.5 * RZ) ** 2);
  const T = (m, k) => trace(m, `${spec.id}-${k}`);
  const sil = T(solid, 'solid');
  const ghost = spec.highlight === 'all' ? null : T(solid.map((s, i) => s && !hi[i]), 'ghost');
  const hiT = T(hi, 'hi');
  // Forearm fade (the model is cut off just past the wrist).
  const fy0 = hproj([0, FADE_FROM_Y, tableZ + 12])[1], fy1 = hproj([0, FADE_TO_Y, tableZ + 12])[1];
  const mid = `hand-${spec.id}`;
  const svg = `<defs><linearGradient id="${mid}-fg" gradientUnits="userSpaceOnUse" x1="0" y1="${f(fy0)}" x2="0" y2="${f(fy1)}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="${mid}-fade" maskUnits="userSpaceOnUse" x="${f(HB[0])}" y="${f(HB[1])}" width="${f(HB[2] - HB[0])}" height="${f(HB[3] - HB[1])}"><rect x="${f(HB[0])}" y="${f(HB[1])}" width="${f(HB[2] - HB[0])}" height="${f(HB[3] - HB[1])}" fill="url(#${mid}-fg)"/></mask></defs>
<g mask="url(#${mid}-fade)">
${tracedPath(sil, `fill="${C.skin}" stroke="${C.line}" stroke-width="1.4" stroke-linejoin="round"`)}
${tracedPath(T(light, 'light'), `fill="${C.skinLight}"`)}
${tracedPath(T(shadow, 'shadow'), `fill="${C.skinShadow}"`)}
${tracedPath(T(deep, 'deep'), `fill="${C.skinDeep}"`)}
${tracedPath(T(nails, 'nails'), `fill="${C.nail}" stroke="${C.nailEdge}" stroke-width="0.7" stroke-linejoin="round"`)}
${tracedPath(T(lines, 'lines'), `fill="${C.line}"`)}
${tracedPath(ghost, `fill="${C.ghost}" fill-opacity="0.6"`)}
${tracedPath(sil, `fill="none" stroke="${C.line}" stroke-width="1.4" stroke-linejoin="round"`)}
${tracedPath(hiT, `fill="none" stroke="${C.accent}" stroke-width="2.2" stroke-linejoin="round"`)}
</g>`;
  return { svg: svg + (spec.holds ? heldFood(spec, V, zb) : ''), V };
}

// A chopped-vegetable piece, screen-space at (X, Y), real radius r mm:
// a broccoli floret (a cluster of bumps) or a carrot round.
function vegPiece(X, Y, r, kind, rand) {
  const R = r * SC;
  if (kind === 'carrot') {
    return `<ellipse cx="${f(X)}" cy="${f(Y)}" rx="${f(R)}" ry="${f(R * 0.78)}" fill="${t.orange[600]}" stroke="${t.orange[900]}" stroke-width="0.8"/><ellipse cx="${f(X)}" cy="${f(Y)}" rx="${f(R * 0.42)}" ry="${f(R * 0.33)}" fill="${t.orange[400]}"/>`;
  }
  const veg = FOOD.veg, dark = mix(veg.fill, C.line, 0.25);
  let s = `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(R * 0.95)}" fill="${dark}" stroke="${veg.edge}" stroke-width="0.8"/>`;
  const rot = rand() * Math.PI * 2;
  for (let k = 0; k < 5; k++) {
    const a = rot + (k / 5) * Math.PI * 2, d = R * 0.42;
    s += `<circle cx="${f(X + d * Math.cos(a))}" cy="${f(Y + d * Math.sin(a) * 0.85)}" r="${f(R * 0.42)}" fill="${veg.fill}" stroke="${dark}" stroke-width="0.6"/>`;
  }
  return s + `<circle cx="${f(X - R * 0.15)}" cy="${f(Y - R * 0.2)}" r="${f(R * 0.4)}" fill="${veg.speck}"/>`;
}

// ---------------- food held in the hand ----------------
// Finds the palm's hollow from a top-down height map of the posed hand (a
// priority flood: where water would pool, with narrow finger gaps closed), and
// heaps chopped vegetables on it. Pieces hidden by the hand are dropped.
function heldFood(spec, V, zb) {
  const CELL = 1;
  const xs = V.map((v) => v[0]), ys = V.map((v) => v[1]);
  const x0 = Math.min(...xs) - 3, y0 = Math.min(...ys) - 3;
  const W = Math.ceil((Math.max(...xs) + 3 - x0) / CELL), H = Math.ceil((Math.max(...ys) + 3 - y0) / CELL);
  let h = new Float32Array(W * H).fill(tableZ);
  for (let k = 0; k < tris.length; k += 3) {
    const [A, B, Cc] = [V[tris[k]], V[tris[k + 1]], V[tris[k + 2]]].map((v) => [(v[0] - x0) / CELL, (v[1] - y0) / CELL, v[2]]);
    const ar = (B[0] - A[0]) * (Cc[1] - A[1]) - (B[1] - A[1]) * (Cc[0] - A[0]);
    if (Math.abs(ar) < 1e-9) continue;
    for (let y = Math.max(0, Math.floor(Math.min(A[1], B[1], Cc[1]))); y <= Math.min(H - 1, Math.ceil(Math.max(A[1], B[1], Cc[1]))); y++)
      for (let x = Math.max(0, Math.floor(Math.min(A[0], B[0], Cc[0]))); x <= Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], Cc[0]))); x++) {
        const px = x + 0.5, py = y + 0.5;
        const w0 = ((B[0] - px) * (Cc[1] - py) - (B[1] - py) * (Cc[0] - px)) / ar, w1 = ((Cc[0] - px) * (A[1] - py) - (Cc[1] - py) * (A[0] - px)) / ar, w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const z = w0 * A[2] + w1 * B[2] + w2 * Cc[2];
        if (z > h[y * W + x]) h[y * W + x] = z;
      }
  }
  // Close finger gaps (grey dilate then erode), radius 4 mm.
  const R = 4;
  const morph = (src, up) => { const o = new Float32Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let m = up ? -Infinity : Infinity; for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { if (dx * dx + dy * dy > R * R) continue; const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; m = up ? Math.max(m, src[yy * W + xx]) : Math.min(m, src[yy * W + xx]); } o[y * W + x] = m; } return o; };
  const hc = morph(morph(h, true), false);
  // Priority flood from the edges: lvl = the water level each cell would hold.
  const lvl = new Float32Array(W * H), done = new Uint8Array(W * H), heap = [];
  const push = (i, l) => { heap.push([l, i]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r = l + 1; let m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!x || !y || x === W - 1 || y === H - 1) { const i = y * W + x; lvl[i] = hc[i]; done[i] = 1; push(i, hc[i]); }
  while (heap.length) { const [l, i] = pop(); const x = i % W, y = (i / W) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const j = yy * W + xx; if (done[j]) continue; done[j] = 1; lvl[j] = Math.max(hc[j], l); push(j, lvl[j]); } }
  const basin = [];
  for (let i = 0; i < W * H; i++) if (lvl[i] - hc[i] > 0.5) basin.push([x0 + ((i % W) + 0.5) * CELL, y0 + (((i / W) | 0) + 0.5) * CELL]);
  if (basin.length < 50) throw new Error(`${spec.id}: no hollow found in the hand to hold food`);
  // Heap centred between the hollow and the middle of the palm, sized to the palm.
  const palmV = V.filter((v, i) => vertPart[i] === 'palm' && v[1] > FADE_FROM_Y + 6);
  const bx = basin.reduce((s, p) => s + p[0], 0) / basin.length, by = basin.reduce((s, p) => s + p[1], 0) / basin.length;
  const px = palmV.reduce((s, v) => s + v[0], 0) / palmV.length, py = palmV.reduce((s, v) => s + v[1], 0) / palmV.length;
  const cx = (bx + px) / 2, cy = (by + py) / 2, rx = 30, ry = 30;
  const hAt = (x, y) => { const gx = Math.floor((x - x0) / CELL), gy = Math.floor((y - y0) / CELL); return gx < 0 || gy < 0 || gx >= W || gy >= H ? tableZ : Math.max(h[gy * W + gx], lvl[gy * W + gx]); };
  // Chopped pieces at real size (broccoli florets ~2 cm, carrot rounds ~1.5 cm),
  // each resting on the hand surface plus a dome, so they mound up.
  const rand = rng(31);
  const pieces = [];
  const HEAP = 18; // mm of mound at the centre
  for (let k = 0; k < 46; k++) {
    const a = rand() * Math.PI * 2, rr = Math.sqrt(rand());
    const x = cx + rr * rx * Math.cos(a), y = cy + rr * ry * Math.sin(a);
    const kind = rand() < 0.7 ? 'floret' : 'carrot';
    const r = kind === 'floret' ? 8 + rand() * 3 : 7 + rand() * 1.5;
    pieces.push({ p: [x, y, hAt(x, y) + r * 0.6 + HEAP * (1 - rr * rr) * (0.6 + 0.4 * rand())], r, kind });
  }
  pieces.sort((a, b) => hdepth(a.p) - hdepth(b.p));
  let s = '';
  for (const pc of pieces) {
    const [X, Y] = hproj(pc.p);
    const ix = Math.floor((X - HB[0]) * RZ), iy = Math.floor((Y - HB[1]) * RZ);
    if (ix >= 0 && iy >= 0 && ix < RW && iy < RH && zb[iy * RW + ix] > hdepth(pc.p) + 2) continue; // behind the hand
    s += vegPiece(X, Y, pc.r, pc.kind, rand);
  }
  return s;
}

// ---------------- tools ----------------
const ell = (c, R, z, a0 = 0, a1 = 2 * Math.PI, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return proj([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a), z]); });

function foodSurface(c, r, z, food, seed, id) {
  const col = FOOD[food];
  const rand = rng(seed);
  if (food === 'veg') {
    // One level layer of real-size chopped pieces at the brim (the same
    // pieces the cupped hand holds), kept inside the rim.
    const pcs = [];
    for (let k = 0; k < 2000 && pcs.length < 40; k++) {
      const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * (r - 7);
      const p = [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z - 1.5 + rand() * 1.5];
      if (pcs.every((q) => Math.hypot(q.p[0] - p[0], q.p[1] - p[1]) > 14)) pcs.push({ p, kind: rand() < 0.7 ? 'floret' : 'carrot', r: 0 });
    }
    for (const q of pcs) q.r = q.kind === 'floret' ? 8 + rand() * 2 : 7 + rand() * 1;
    pcs.sort((a, b) => depth(a.p) - depth(b.p));
    let s = `<path d="${pathOf(ell(c, r, z))}" fill="${mix(col.fill, C.line, 0.45)}"/>`;
    s += `<clipPath id="${id}-food"><path d="${pathOf([...ell(c, r, z, Math.PI, 2 * Math.PI), ...ell(c, r, z + 5, 0, Math.PI)])}"/></clipPath><g clip-path="url(#${id}-food)">`;
    for (const q of pcs) { const [X, Y] = proj(q.p); s += vegPiece(X, Y, q.r, q.kind, rand); }
    return `${s}</g>`;
  }
  let s = `<path d="${pathOf(ell(c, r, z))}" fill="${col.fill}" stroke="${col.edge}" stroke-width="0.8"/>`;
  // A little texture so it reads as food, not liquid: seeded flecks inside the rim.
  s += `<clipPath id="${id}-food"><path d="${pathOf(ell(c, r - 1, z))}"/></clipPath><g clip-path="url(#${id}-food)" fill="${col.speck}" fill-opacity="0.8">`;
  for (let k = 0; k < Math.round(r * 1.6); k++) {
    const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * r;
    const [x, y] = proj([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a), z]);
    s += food === 'veg'
      ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.4 * SC)}"/>`
      : `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(food === 'fat' ? 1.6 * SC : 2.6 * SC)}" ry="${f(food === 'fat' ? 0.6 * SC : 0.7 * SC)}" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})"/>`;
  }
  return `${s}</g>`;
}

// Flat measuring-cup / spoon handle, sticking out to the right at rim height.
function handle(c, r0, len, w, z) {
  const tip = [c[0] + r0 + len, c[1], z + len * 0.12];
  const q = (x, y, zz) => proj([x, y, zz]);
  const top = [q(c[0] + r0 - 2, c[1] - w / 2, z), q(tip[0], tip[1] - w / 2, tip[2]), ...ell([tip[0], tip[1]], w / 2, tip[2], -Math.PI / 2, Math.PI / 2, 12).slice(1, -1), q(tip[0], tip[1] + w / 2, tip[2]), q(c[0] + r0 - 2, c[1] + w / 2, z)];
  const edge = top.map(([x, y]) => [x, y + 1.6 * COS * SC]);
  return `<path d="${pathOf(hull([...top, ...edge]))}" fill="${C.steelDark}" stroke="${C.steelEdge}" stroke-width="0.8"/><path d="${pathOf(top)}" fill="${C.steel}" stroke="${C.steelEdge}" stroke-width="0.8"/>`;
}

function steelGrad(id, x0, x1) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x0)}" y1="0" x2="${f(x1)}" y2="0"><stop offset="0" stop-color="${C.steelDark}"/><stop offset="0.28" stop-color="${C.steelLight}"/><stop offset="0.55" stop-color="${C.steel}"/><stop offset="1" stop-color="${C.steelDark}"/></linearGradient>`;
}

function cupTool(spec, c) {
  const { radius: r, volumeMl } = spec.tool;
  const h = (volumeMl * 1000) / (Math.PI * r * r);
  const R = r + 1.2, base = tableZ;
  const id = `hand-${spec.id}`;
  const body = [...ell(c, R, base), ...ell(c, R, base + h)];
  const [lx] = proj([c[0] - R, 0, 0]), [rx] = proj([c[0] + R, 0, 0]);
  let s = `<defs>${steelGrad(`${id}-steel`, lx, rx)}</defs>`;
  s += `<path d="${pathOf(ell(c, R + 1.5, base))}" fill="${C.line}" fill-opacity="0.08"/>`; // contact shadow
  s += handle(c, R, 62, 17, base + h);
  s += `<path d="${pathOf(hull(body))}" fill="url(#${id}-steel)" stroke="${C.steelEdge}" stroke-width="1"/>`;
  s += `<path d="${pathOf(ell(c, R, base + h))}" fill="${C.steel}" stroke="${C.steelEdge}" stroke-width="1"/>`;
  s += foodSurface(c, r, base + h, spec.tool.food, 7, id);
  return { svg: s, volumeMl: (Math.PI * r * r * h) / 1000, dims: { innerDiameterMm: 2 * r, depthMm: +h.toFixed(1) } };
}

// Spherical-cap bowl: rim radius a, depth h with V = pi h (3a^2 + h^2) / 6.
function spoonTool(spec, c) {
  const a = spec.tool.radius, V = spec.tool.volumeMl * 1000;
  let lo = 0, hi = a;
  for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if ((Math.PI * m * (3 * a * a + m * m)) / 6 < V) lo = m; else hi = m; }
  const h = (lo + hi) / 2;
  const Rs = (a * a + h * h) / (2 * h); // sphere radius
  const base = tableZ + 0.8;
  const zc = base + Rs; // sphere center (bowl bottom touches the table)
  const rimZ = base + h;
  const id = `hand-${spec.id}`;
  const cap = [];
  for (let i = 0; i <= 12; i++) for (let j = 0; j < 36; j++) {
    const z = base + (h * i) / 12, rr = Math.sqrt(Math.max(0, Rs * Rs - (z - zc) ** 2)), ang = (j / 36) * Math.PI * 2;
    cap.push(proj([c[0] + rr * Math.cos(ang), c[1] + rr * Math.sin(ang), z]));
  }
  const R = a + 0.8;
  const [lx] = proj([c[0] - R, 0, 0]), [rx] = proj([c[0] + R, 0, 0]);
  let s = `<defs>${steelGrad(`${id}-steel`, lx, rx)}</defs>`;
  s += `<ellipse cx="${f(proj([c[0], c[1], tableZ])[0])}" cy="${f(proj([c[0], c[1], tableZ])[1])}" rx="${f(a * 0.7 * SC)}" ry="${f(a * 0.7 * SIN * SC)}" fill="${C.line}" fill-opacity="0.08"/>`;
  s += handle(c, R, 70, 13, rimZ);
  s += `<path d="${pathOf(hull([...cap, ...ell(c, R, rimZ)]))}" fill="url(#${id}-steel)" stroke="${C.steelEdge}" stroke-width="1"/>`;
  s += `<path d="${pathOf(ell(c, R, rimZ))}" fill="${C.steel}" stroke="${C.steelEdge}" stroke-width="1"/>`;
  s += foodSurface(c, a, rimZ, spec.tool.food, 9, id);
  return { svg: s, volumeMl: (Math.PI * h * (3 * a * a + h * h)) / 6 / 1000, dims: { rimDiameterMm: 2 * a, depthMm: +h.toFixed(1) } };
}

// The cooked 3 oz cut from the volume figures (same outline, scale and colors
// as volume-meat-after.svg), here lying on the table.
function meatTool(spec, c) {
  const m = VOLUME_COMPARISONS.find((x) => x.id === 'meat');
  const a = m.footprint.length / 2, b = m.footprint.width / 2;
  const se = (v, e) => Math.sign(v) * Math.abs(v) ** e;
  const outline1 = Array.from({ length: 72 }, (_, i) => { const t2 = (i / 72) * Math.PI * 2; return [a * se(Math.cos(t2), 0.55) * (1 + 0.06 * Math.sin(2 * t2)), b * se(Math.sin(t2), 0.55)]; });
  const thickRaw = ((m.rawGrams / m.density) * 1000) / polyArea(outline1);
  const k = Math.cbrt(m.after.amount / m.before.amount);
  // Long side running away from the viewer, like the palm beside it.
  const outline = outline1.map(([x, y]) => [c[0] + y * k, c[1] + x * k]);
  const T = thickRaw * k, base = tableZ;
  const bottom = outline.map(([x, y]) => proj([x, y, base]));
  const top = outline.map(([x, y]) => proj([x, y, base + T]));
  const col = { top: t.neutralA[1000], side: t.neutralA[1200], fat: t.neutralA[500] };
  let s = `<path d="${pathOf(hull(bottom.map(([x, y]) => [x, y + 2])))}" fill="${C.line}" fill-opacity="0.1"/>`;
  s += `<path d="${pathOf(hull([...bottom, ...top]))}" fill="${col.side}" stroke="${col.side}" stroke-width="1" stroke-linejoin="round"/>`;
  s += `<path d="${pathOf(top)}" fill="${col.top}" stroke="${mix(col.top, C.line, 0.3)}" stroke-width="0.8"/>`;
  for (const [x0, y0, x1, y1] of [[-0.7, -0.35, -0.3, -0.5], [-0.2, 0.1, 0.25, -0.05], [0.35, 0.45, 0.7, 0.3], [-0.45, 0.4, -0.15, 0.55], [0.3, -0.45, 0.55, -0.6]]) {
    const ends = [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 0.08], [x1, y1]].map(([x, y]) => proj([c[0] + y * b * k, c[1] + x * a * k, base + T]));
    s += `<path d="${pathOf(ends, false)}" fill="none" stroke="${col.fat}" stroke-opacity="0.6" stroke-width="${f(2.2 * k)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const id = `hand-${spec.id}-sear`;
  s += `<clipPath id="${id}"><path d="${pathOf(top)}"/></clipPath><g clip-path="url(#${id})" stroke="${C.line}" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round">`;
  for (let i = -5; i <= 5; i++) {
    const p1 = proj([c[0] - 60, c[1] + i * 14 - 30, base + T]), p2 = proj([c[0] + 60, c[1] + i * 14 + 30, base + T]);
    s += `<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}"/>`;
  }
  s += '</g>';
  return { svg: s, volumeMl: (polyArea(outline1) * k * k * T) / 1000, dims: { footprintMm: `${(2 * b * k).toFixed(0)} x ${(2 * a * k).toFixed(0)}`, thicknessMm: +T.toFixed(1) } };
}
const TOOLS = { cup: cupTool, spoon: spoonTool, meat: meatTool };

// ---------------- measurements of the hand ----------------
function handMeasures(spec, V) {
  const keep = V.filter((v) => v[1] > FADE_FROM_Y + 6);
  const ext = (vs, k) => +(Math.max(...vs.map((v) => v[k])) - Math.min(...vs.map((v) => v[k]))).toFixed(0);
  const m = { boxMm: `${ext(keep, 0)} x ${ext(keep, 1)} x ${ext(keep, 2)}` };
  if (spec.highlight === 'palm') {
    const pv = V.filter((v, i) => vertPart[i] === 'palm' && v[1] > FADE_FROM_Y + 6);
    m.palmMm = `${ext(pv, 0)} x ${ext(pv, 1)}`;
    // Thickness through the middle of the palm (back of hand to palm).
    const cx = pv.reduce((s, v) => s + v[0], 0) / pv.length, cy = pv.reduce((s, v) => s + v[1], 0) / pv.length;
    m.palmThicknessMm = ext(pv.filter((v) => Math.hypot(v[0] - cx, v[1] - cy) < 10), 2);
  }
  if (spec.highlight === 'thumb') {
    const tv = V.filter((_, i) => vertPart[i] === 'thumb');
    m.thumbLengthMm = +Math.max(...tv.map((a) => Math.max(...tv.map((b) => Math.hypot(...sub(a, b)))))).toFixed(0);
  }
  return m;
}

// ---------------- assemble ----------------
const TOOL_GAP = 36; // px between the hand frame and the tool slot
const toolBox = (svg) => {
  const pts = [...svg.replace(/<clipPath[\s\S]*?<\/clipPath>/g, '').matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [+m[1], +m[2]]);
  return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
};
// Every tool gets the same slot width (the widest tool), so figures line up.
const TOOL_W = Math.max(...HAND_COMPARISONS.map((s) => { const [a, , b] = toolBox(TOOLS[s.tool.kind](s, [0, 0]).svg); return b - a; })) + 8;
// Tools are centred on the height of the middle of the palm.
const PALM_CY = (() => { const v = ALL_V[0].filter((_, i) => PALM[i] > 0); return v.reduce((s, p) => s + hproj(p)[1], 0) / v.length; })();
function figure(spec) {
  const { svg: handSvg, V } = handLayer(spec);
  const tool = TOOLS[spec.tool.kind](spec, [0, 0]);
  const [x0, y0, x1, y1] = toolBox(tool.svg);
  const slotX0 = HB[2] + TOOL_GAP;
  const tx = slotX0 + (TOOL_W - (x1 - x0)) / 2 - x0, ty = PALM_CY - (y0 + y1) / 2;
  const W = slotX0 + TOOL_W - HB[0];
  // No text labels: the list item's own title ("Fist ≒ 1 Cup") names both
  // halves, and labels shrank to ~11px at the column's width.
  const height = HB[3] + 4 - HB[1];
  const aria = spec.alt;
  const text = (x, y, s, size, weight, fill) => `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="${size}"${weight ? ` font-weight="${weight}"` : ''} fill="${fill}">${s}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${aria}" viewBox="${f(HB[0])} ${f(HB[1])} ${f(W)} ${f(height)}" width="${Math.round(W)}" height="${Math.round(height)}">
<title>${aria}</title>
${handSvg}
<g transform="translate(${f(tx)} ${f(ty)})">${tool.svg}</g>
${text(HB[2] + TOOL_GAP / 2, PALM_CY + 10, '≈', 30, 400, C.approx)}
</svg>
`;
  return { svg, report: { hand: handMeasures(spec, V), tool: { volumeMl: +tool.volumeMl.toFixed(2), ...tool.dims } } };
}

const only = process.argv.slice(2).find((a) => !a.startsWith('--'));
const report = {};
const fails = [];
for (const spec of HAND_COMPARISONS) {
  if (only && spec.id !== only) continue;
  const { svg, report: r } = figure(spec);
  report[spec.id] = r;
  if (spec.tool.volumeMl && Math.abs(r.tool.volumeMl / spec.tool.volumeMl - 1) > 0.005) fails.push(`${spec.id}: tool volume ${r.tool.volumeMl} ml, wanted ${spec.tool.volumeMl}`);
  fs.writeFileSync(path.join(GEN, `hand-${spec.id}.svg`), svg);
}
fs.writeFileSync(path.join(GEN, 'handReport.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (fails.length) { console.error('FAILED:\n' + fails.join('\n')); process.exit(1); }
