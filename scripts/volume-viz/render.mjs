// Renders every comparison in src/viz/volumeComparisons.js to a pair of static
// SVGs (before/after), from:
//   - 'pour'    -> the baked rigid-body result in src/viz/generated/volumeSim.json
//   - 'compact' -> procedural leaf placement (seeded)
//   - 'shrink'  -> a procedural extruded slab
// Every piece is a real 3D solid, orthographically projected from a camera
// tilted CAM_TILT degrees above horizontal and painted back-to-front, so
// overlap/occlusion is genuine, not drawn in. Both halves of a pair share one
// jug (or plate) and one scale, so they compare to scale side by side.
//
// Writes src/viz/generated/*.svg (inlined by VolumeComparison.jsx), a copy for
// Figma under Chapter Content/Images/Module 5/..., and volumeReport.json --
// the measured ratios, which this script asserts against the specs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spiceTokens as t } from '../../src/theme.js';
import { VOLUME_COMPARISONS, JUGS, cupHeight } from '../../src/viz/volumeComparisons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const GEN = path.resolve(here, '../../src/viz/generated');
const FIGMA_DIR = path.resolve(here, '../../../Chapter Content/Images/Module 5/Chapter 1 - Measuring and Portion Size Techniques');
const sim = JSON.parse(fs.readFileSync(path.join(GEN, 'volumeSim.json'), 'utf8'));

// ---------------- projection ----------------
const CAM_TILT = (24 * Math.PI) / 180;
const SC = 2.2; // px per mm -- the same for every figure, so real sizes compare across pairs too
const COS = Math.cos(CAM_TILT), SIN = Math.sin(CAM_TILT);
const CAM = [0, -COS, SIN]; // unit vector toward the camera
const LIGHT = norm([-0.45, -0.55, 0.7]);
const proj = ([x, y, z]) => [x * SC, (-z * COS - y * SIN) * SC];
const depth = (p) => dot(p, CAM);
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function norm(v) { const l = Math.hypot(...v); return v.map((c) => c / l); }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
function rotate(q, v) {
  const [x, y, z, w] = q;
  const u = [x, y, z];
  const uv = cross(u, v), uuv = cross(u, uv);
  return add(add(v, uv, 2 * w), uuv, 2);
}
function basisFrom(axis) {
  const a = norm(axis);
  const ref = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = norm(cross(a, ref));
  return [a, u, cross(a, u)];
}

// ---------------- color ----------------
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, f) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * f));

const C = {
  glassBack: t.neutralA[25],
  glassEdge: t.neutralB[400],
  tick: t.neutralB[400],
  tickText: t.neutralB[700],
  active: t.orange[700], // theme.palette.primary.main
  label: t.neutralA[1200],
  sublabel: t.neutralB[700],
  shadow: t.neutralA[1200],
};
const PIECE_COLORS = {
  grain: { before: { fill: t.orange[100], edge: t.neutralA[600] }, after: { fill: t.white, edge: t.neutralB[400] } },
  tube: { before: { fill: t.orange[400], edge: t.orange[900] }, after: { fill: t.orange[200], edge: t.orange[600] } },
  leaf: { before: { fill: t.secondaryGreen, edge: mix(t.secondaryGreen, t.neutralA[1200], 0.45) }, after: { fill: mix(t.secondaryGreen, t.neutralA[1200], 0.3), edge: mix(t.secondaryGreen, t.neutralA[1200], 0.65) } },
  // Raw meat colors are the user's own picks from a hand edit (2026-10-12):
  // the theme has no red, and orange[900] read as orange rather than raw meat.
  // topEdge keeps the edge color the user left in place (#954b15, which the
  // old orange[900] top used to produce via mix()).
  slab: {
    before: { top: '#c67559', side: '#b56f59', sideEdge: t.orange[1100], topEdge: '#954b15', fat: t.orange[100] },
    after: { top: t.neutralA[1000], side: t.neutralA[1200], sideEdge: t.neutralA[1200], fat: t.neutralA[500] },
  },
};

// ---------------- svg helpers ----------------
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

// ---------------- pieces ----------------
// Capsule: orthographic projection of a sphere is a circle of the same
// radius, so the capsule's silhouette is exactly the stadium around its two
// projected end-centers.
function drawGrain({ p, q }, r, hh, col, shade) {
  const ax = rotate(q, [0, 1, 0]);
  const A = proj(add(p, ax, -hh)), B = proj(add(p, ax, hh));
  let dx = B[0] - A[0], dy = B[1] - A[1];
  const L = Math.hypot(dx, dy) || 1e-6;
  dx /= L; dy /= L;
  const nx = -dy, ny = dx, rp = r * SC;
  // Two semicircles (around B, then around A) joined by the straight sides.
  const ang = Math.atan2(ny, nx);
  const cap = (c, a0) => Array.from({ length: 9 }, (_, i) => { const a = a0 - (Math.PI * i) / 8; return [c[0] + rp * Math.cos(a), c[1] + rp * Math.sin(a)]; });
  // `poly` (sampled) is only for occlusion culling; the drawn path uses two
  // true SVG arcs (sweep 0 = the cap bulges outward, away from the other end).
  const poly = [...cap(B, ang), ...cap(A, ang + Math.PI)];
  const P = (x, y) => `${f(x)},${f(y)}`;
  const d = `M${P(B[0] + nx * rp, B[1] + ny * rp)}A${f(rp)} ${f(rp)} 0 0 0 ${P(B[0] - nx * rp, B[1] - ny * rp)}L${P(A[0] - nx * rp, A[1] - ny * rp)}A${f(rp)} ${f(rp)} 0 0 0 ${P(A[0] + nx * rp, A[1] + ny * rp)}Z`;
  // Specular streak offset toward the light (screen-space upper-left).
  const side = nx * -0.5 + ny * -0.85 > 0 ? 1 : -1;
  const o = rp * 0.38 * side;
  const fill = mix(col.fill, C.shadow, shade);
  return { poly, svg: `<path d="${d}" fill="${fill}" stroke="${col.edge}" stroke-width="${f(Math.min(0.6, rp * 0.18))}"/><line x1="${f(A[0] + nx * o)}" y1="${f(A[1] + ny * o)}" x2="${f(B[0] + nx * o)}" y2="${f(B[1] + ny * o)}" stroke="#fff" stroke-opacity="${f(0.55 - shade)}" stroke-width="${f(rp * 0.45)}" stroke-linecap="round"/>` };
}

// Tube: silhouette = hull of the two projected end circles; the end facing the
// camera is drawn open (penne/ziti are hollow), plus the lit ridges.
function drawTube({ p, q }, r, hh, col, shade) {
  const ax = rotate(q, [0, 1, 0]);
  const [, u, v] = basisFrom(ax);
  const ring = (c, rad, n = 28) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return add(add(c, u, rad * Math.cos(a)), v, rad * Math.sin(a)); });
  const e1 = add(p, ax, -hh), e2 = add(p, ax, hh);
  const sil = hull([...ring(e1, r), ...ring(e2, r)].map(proj));
  const fill = mix(col.fill, C.shadow, shade);
  let out = `<path d="${pathOf(sil)}" fill="${fill}" stroke="${col.edge}" stroke-width="0.7"/>`;
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    const nrm = add(u.map((c) => c * Math.cos(a)), v, Math.sin(a));
    if (dot(nrm, CAM) < 0.15) continue;
    const s1 = proj(add(add(e1, nrm, r), ax, hh * 0.08)), s2 = proj(add(add(e2, nrm, r), ax, -hh * 0.08));
    const lit = Math.max(0, dot(nrm, LIGHT));
    out += `<line x1="${f(s1[0])}" y1="${f(s1[1])}" x2="${f(s2[0])}" y2="${f(s2[1])}" stroke="${lit > 0.45 ? '#fff' : col.edge}" stroke-opacity="${lit > 0.45 ? 0.45 : 0.3}" stroke-width="0.8"/>`;
  }
  const front = dot(ax, CAM) > 0 ? e2 : e1;
  const facing = Math.abs(dot(ax, CAM));
  if (facing > 0.12) {
    out += `<path d="${pathOf(ring(front, r).map(proj))}" fill="${mix(col.fill, '#ffffff', 0.15)}" stroke="${col.edge}" stroke-width="0.6"/>`;
    out += `<path d="${pathOf(ring(front, r * 0.62).map(proj))}" fill="${mix(col.edge, C.shadow, 0.35)}"/>`;
  }
  return { poly: sil, svg: out };
}

// Leaf: a cupped planar outline (pointed oval) posed in 3D, shaded by how
// squarely its face meets the light.
function leafPoints(len, curl) {
  const n = 30, outline = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = (len / 2) * Math.cos(a);
    const y = (len / 4) * Math.sin(a) * Math.abs(Math.sin(a)) ** 0.3 * (1 - 0.25 * Math.cos(a));
    outline.push([x, y, curl * len * (y / (len / 4)) ** 2]); // curl = cup depth as a fraction of leaf length
  }
  return outline;
}
function drawLeaf(leaf, col) {
  const world = leaf.pts.map((pt) => add(leaf.c, rotate(leaf.q, pt)));
  const nrm = rotate(leaf.q, [0, 0, 1]);
  const facing = dot(nrm, CAM) > 0 ? nrm : nrm.map((c) => -c);
  const lit = Math.max(0, dot(facing, LIGHT));
  const fill = mix(col.fill, lit > 0.5 ? '#ffffff' : C.shadow, lit > 0.5 ? (lit - 0.5) * 0.35 : (0.5 - lit) * 0.45);
  const P = world.map(proj);
  const rib = [add(leaf.c, rotate(leaf.q, [-leaf.len * 0.42, 0, 0])), add(leaf.c, rotate(leaf.q, [leaf.len * 0.45, 0, 0]))].map(proj);
  return { poly: P, svg: `<path d="${pathOf(P)}" fill="${fill}" stroke="${col.edge}" stroke-width="0.8" stroke-linejoin="round"/><line x1="${f(rib[0][0])}" y1="${f(rib[0][1])}" x2="${f(rib[1][0])}" y2="${f(rib[1][1])}" stroke="${col.edge}" stroke-opacity="0.55" stroke-width="0.8"/>` };
}

// ---------------- occlusion culling ----------------
// Input: drawn pieces in back-to-front order. Walks them front-to-back over a
// coarse coverage raster and drops any piece every one of whose cells is
// already covered by something nearer -- buried pieces add bytes, not pixels.
const CELL = 1.5;
function insidePoly(x, y, P) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i], [xj, yj] = P[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function cullHidden(drawn) {
  const covered = new Set();
  const keep = new Array(drawn.length).fill(false);
  for (let k = drawn.length - 1; k >= 0; k--) {
    const P = drawn[k].poly;
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    const cells = [];
    for (let gx = Math.floor(Math.min(...xs) / CELL); gx <= Math.ceil(Math.max(...xs) / CELL); gx++)
      for (let gy = Math.floor(Math.min(...ys) / CELL); gy <= Math.ceil(Math.max(...ys) / CELL); gy++)
        if (insidePoly((gx + 0.5) * CELL, (gy + 0.5) * CELL, P)) cells.push(`${gx},${gy}`);
    // Keep pieces exposing more than a sliver; a 1-2 cell fringe behind an outline isn't visible.
    if (cells.filter((c) => !covered.has(c)).length > 2) keep[k] = true;
    for (const c of cells) covered.add(c);
  }
  return drawn.filter((_, k) => keep[k]);
}


// ---------------- jug (graduated glass measuring jug, real inner size) ----------------
const ell = (R, z, a0, a1, n = 64) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return proj([R * Math.cos(a), R * Math.sin(a), z]); });
// Canvas keeps 24 mm of room on the right where a handle used to be: the user
// removed the handle by hand (it looked odd) without resizing the canvas, so
// the frame size is kept identical to their edited files.
const RIGHT_MARGIN = 24;
function jugGeom(jugSpec) {
  const R = jugSpec.radius, HC = cupHeight(jugSpec), H = jugSpec.heightCups * HC;
  return { R, HC, H, bbox: [(-R - 4) * SC, -(H * COS + R * SIN) * SC - 4, (R + RIGHT_MARGIN + 6) * SC, R * SIN * SC + 3] };
}
function jug(jugSpec, activeAmount, contents) {
  const { R, HC, H } = jugGeom(jugSpec);
  // Back half (far wall) painted first, then contents, then the front glass.
  const backWall = [...ell(R, 0, 0, Math.PI), ...ell(R, H, Math.PI, 0)];
  const frontWall = [...ell(R, 0, Math.PI, 2 * Math.PI), ...ell(R, H, 2 * Math.PI, Math.PI)];
  // Graduations on the left-front of the glass: unlabelled tick marks (long
  // at whole cups -- and halves on a 2-cup jug -- short between). No text on
  // the jug, per the user: the caption below each image carries the amount.
  const labelHalves = jugSpec.cups <= 2;
  let ticks = '';
  for (let v = 0.5; v <= jugSpec.cups + 1e-9; v += 0.5) {
    const isWhole = Math.abs(v - Math.round(v)) < 1e-9;
    const labelled = isWhole || labelHalves;
    const active = Math.abs(v - activeAmount) < 1e-9;
    const arc = ell(R, v * HC, Math.PI * 1.13, Math.PI * (labelled ? 1.27 : 1.21), 12);
    ticks += `<path d="${pathOf(arc, false)}" fill="none" stroke="${active ? C.active : C.tick}" stroke-width="${active ? 2.2 : 1.4}" stroke-linecap="round"/>`;
  }
  const hl = [proj([-R * 0.8, -R * 0.6, 4]), proj([-R * 0.8, -R * 0.6, H - 5])];
  return [
    `<path d="${pathOf(backWall)}" fill="${C.glassBack}" stroke="none"/>`,
    `<path d="${pathOf(ell(R, H, Math.PI, 0), false)}" fill="none" stroke="${C.glassEdge}" stroke-width="1.2" stroke-opacity="0.7"/>`,
    `<path d="${pathOf(ell(R, 0, 0, 2 * Math.PI))}" fill="${mix(C.glassBack, C.shadow, 0.06)}"/>`,
    contents,
    `<path d="${pathOf(frontWall)}" fill="#ffffff" fill-opacity="0.16" stroke="${C.glassEdge}" stroke-width="1.4" stroke-linejoin="round"/>`,
    `<line x1="${f(hl[0][0])}" y1="${f(hl[0][1])}" x2="${f(hl[1][0])}" y2="${f(hl[1][1])}" stroke="#fff" stroke-opacity="0.55" stroke-width="5" stroke-linecap="round"/>`,
    `<path d="${pathOf(ell(R, H, Math.PI, 2 * Math.PI), false)}" fill="none" stroke="${C.glassEdge}" stroke-width="1.6"/>`,
    // The levelled fill height of this state, around the front of the jug.
    `<path d="${pathOf(ell(R, activeAmount * HC, Math.PI, 2 * Math.PI), false)}" fill="none" stroke="${C.active}" stroke-width="1.6" stroke-dasharray="5 4" stroke-opacity="0.9"/>`,
    ticks,
  ].join('\n');
}

// ---------------- per-mechanism scenes ----------------
const shadeFor = (p, minD, maxD) => 0.28 * (1 - (depth(p) - minD) / (maxD - minD || 1));

function pourScene(spec, which) {
  const s = sim[spec.id][which];
  const jugSpec = JUGS[spec.jug];
  const col = PIECE_COLORS[spec.piece][which];
  const draw = spec.piece === 'grain' ? drawGrain : drawTube;
  const ds = s.pieces.map((x) => depth(x.p));
  const minD = Math.min(...ds), maxD = Math.max(...ds);
  const sorted = [...s.pieces].sort((a, b) => depth(a.p) - depth(b.p));
  const drawn = cullHidden(sorted.map((pc) => draw(pc, s.r, s.hh, col, shadeFor(pc.p, minD, maxD))));
  return {
    body: jug(jugSpec, spec[which].amount, drawn.map((d) => d.svg).join('')),
    bbox: jugGeom(jugSpec).bbox,
    measured: { count: s.pieces.length, pieceMm: `${s.dims.length.toFixed(1)} x ${s.dims.diameter.toFixed(1)}`, drawnVisible: drawn.length, fillCups: s.fill / cupHeight(jugSpec) },
  };
}

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let x = a; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}
const quatAxisAngle = (ax, ang) => { const a = norm(ax), s = Math.sin(ang / 2); return [a[0] * s, a[1] * s, a[2] * s, Math.cos(ang / 2)]; };
const quatMul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];

// Greens: the SAME leaves (identical outline/size) in both states.
//   raw    -- loose: random 3D tilt, spread through the full 1-cup height, centers kept apart (air gaps)
//   cooked -- wilted: lying nearly flat, flattened curl, stacked into the bottom half, overlapping
function greensLeaves(spec, which) {
  const jugSpec = JUGS[spec.jug];
  const R = jugSpec.radius, HC = cupHeight(jugSpec);
  const rand = rng(spec.seed + (which === 'after' ? 77 : 0));
  const len = spec.leafLength;
  const top = HC * spec[which].amount;
  const leaves = [];
  const n = spec.count;
  const minGap = which === 'before' ? len * 0.3 : 0;
  let guard = 0;
  while (leaves.length < n && guard++ < 500000) {
    const i = leaves.length;
    const curl = which === 'before' ? 0.08 + rand() * 0.08 : 0.02 + rand() * 0.02;
    const pts3 = leafPoints(len, curl);
    const tilt = which === 'before' ? (rand() - 0.5) * Math.PI * 0.8 : (rand() - 0.5) * 0.25;
    const q = quatMul(quatAxisAngle([0, 0, 1], rand() * Math.PI * 2), quatAxisAngle([1, 0.3 * (rand() - 0.5), 0], tilt));
    const zBand = which === 'before' ? [len * 0.08, top - len * 0.08] : [1 + (i / n) * (top - 3), 1 + ((i + 1) / n) * (top - 3)];
    const c = [(rand() - 0.5) * 2 * R, (rand() - 0.5) * 2 * R, zBand[0] + rand() * (zBand[1] - zBand[0])];
    const world = pts3.map((pt) => add(c, rotate(q, pt)));
    if (world.some(([x, y, z]) => Math.hypot(x, y) > R - 1 || z < 0.5 || z > top)) continue;
    if (minGap && leaves.some((l) => Math.hypot(l.c[0] - c[0], l.c[1] - c[1], l.c[2] - c[2]) < minGap)) continue;
    leaves.push({ c, q, pts: pts3, len, topZ: Math.max(...world.map((w) => w[2])) });
  }
  if (leaves.length < n) throw new Error(`greens: only placed ${leaves.length}/${n} leaves (${which})`);
  return leaves;
}
function greensScene(spec, which) {
  const jugSpec = JUGS[spec.jug];
  const leaves = greensLeaves(spec, which);
  const col = PIECE_COLORS.leaf[which];
  const contents = [...leaves].sort((a, b) => depth(a.c) - depth(b.c)).map((l) => drawLeaf(l, col).svg).join('');
  const topZ = Math.max(...leaves.map((l) => l.topZ));
  return { body: jug(jugSpec, spec[which].amount, contents), bbox: jugGeom(jugSpec).bbox, measured: { count: leaves.length, leafLengthMm: leaves[0].len, pileTopCups: topZ / cupHeight(jugSpec) } };
}

// Meat: a superellipse cut on a side plate. Raw footprint is the spec's real
// length x width; thickness is solved so the raw volume = rawGrams / density.
// Cooked = raw scaled by cbrt(after/before) in all three dimensions, so its
// volume is exactly that fraction.
function slabOutline(spec, k) {
  const a = spec.footprint.length / 2, b = spec.footprint.width / 2;
  const se = (v, e) => Math.sign(v) * Math.abs(v) ** e;
  return Array.from({ length: 72 }, (_, i) => { const t2 = (i / 72) * Math.PI * 2; return [a * k * se(Math.cos(t2), 0.55) * (1 + 0.06 * Math.sin(2 * t2)), b * k * se(Math.sin(t2), 0.55)]; });
}
const INNER_RING_FLATTEN = 0.872;
function meatGeom(spec) {
  const rawMm3 = (spec.rawGrams / spec.density) * 1000;
  const thick = rawMm3 / polyArea(slabOutline(spec, 1));
  const PR = spec.plateDiameter / 2;
  return { rawMm3, thick, PR, bbox: [(-PR - 4) * SC, -(PR * SIN + (thick + 3) * COS) * SC - 8, (PR + 4) * SC, PR * SIN * SC + 4] };
}
function meatScene(spec, which) {
  const { thick, PR, bbox } = meatGeom(spec);
  const k = which === 'before' ? 1 : Math.cbrt(spec.after.amount / spec.before.amount);
  const col = PIECE_COLORS.slab[which];
  const rot = ([x, y]) => { const a = -0.18; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
  const outline = slabOutline(spec, k).map(rot);
  const T = thick * k;
  const lift = 3; // plate well surface height
  const bottom = outline.map(([x, y]) => proj([x, y, lift]));
  const topP = outline.map(([x, y]) => proj([x, y, lift + T]));
  const ring = (rr, z) => Array.from({ length: 73 }, (_, i) => { const a = (i / 72) * Math.PI * 2; return proj([rr * Math.cos(a), rr * Math.sin(a), z]); });
  const a0 = spec.footprint.length / 2, b0 = spec.footprint.width / 2;
  let s = '';
  s += `<path d="${pathOf(ring(PR, 0))}" fill="${t.white}" stroke="${t.neutralB[200]}" stroke-width="1.4"/>`;
  // Inner well ring: flattened vertically to 0.872x of the plate's own
  // projected ellipse, keeping its top (back) edge fixed, so the rim band reads
  // wider at the front -- matches the user's hand edit of the plate, which
  // looked more natural than the strict orthographic ring.
  const well = ring(PR * 0.7, 0.5);
  const wellTop = Math.min(...well.map((q) => q[1]));
  s += `<path d="${pathOf(well.map(([x, y]) => [x, wellTop + (y - wellTop) * INNER_RING_FLATTEN]))}" fill="${t.orange[10]}" stroke="${t.neutralB[200]}" stroke-width="0.8" stroke-opacity="0.8"/>`;
  s += `<path d="${pathOf(hull([...bottom, ...topP]))}" fill="${col.side}" stroke="${col.sideEdge}" stroke-width="1" stroke-linejoin="round"/>`;
  s += `<path d="${pathOf(topP)}" fill="${col.top}" stroke="${col.topEdge ?? mix(col.top, C.shadow, 0.3)}" stroke-width="0.8"/>`;
  // Marbling: short streaks of fat across the top face.
  for (const [x0, y0, x1, y1] of [[-0.7, -0.35, -0.3, -0.5], [-0.2, 0.1, 0.25, -0.05], [0.35, 0.45, 0.7, 0.3], [-0.45, 0.4, -0.15, 0.55], [0.3, -0.45, 0.55, -0.6]]) {
    const ends = [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + 0.08], [x1, y1]].map(([x, y]) => rot([x * a0 * k, y * b0 * k])).map(([x, y]) => proj([x, y, lift + T]));
    s += `<path d="${pathOf(ends, false)}" fill="none" stroke="${col.fat}" stroke-opacity="0.6" stroke-width="${f(2.2 * k)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (which === 'after') {
    const id = `sear-${spec.id}`;
    s += `<clipPath id="${id}"><path d="${pathOf(topP)}"/></clipPath><g clip-path="url(#${id})" stroke="${t.neutralA[1200]}" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round">`;
    for (let i = -4; i <= 4; i++) {
      const p1 = proj([i * 14 - 30, -PR, lift + T]), p2 = proj([i * 14 + 30, PR, lift + T]);
      s += `<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}"/>`;
    }
    s += '</g>';
  }
  const volume = polyArea(slabOutline(spec, k)) * T;
  return { body: s, bbox, measured: { volumeCm3: +(volume / 1000).toFixed(1), thicknessMm: +T.toFixed(1), footprintMm: `${(spec.footprint.length * k).toFixed(0)} x ${(spec.footprint.width * k).toFixed(0)}` }, volume };
}

// ---------------- assemble ----------------
function frame(spec, which, scene) {
  const st = spec[which];
  const [x0, y0, x1, y1] = scene.bbox;
  const vx = Math.min(x0, -180), vw = Math.max(x1, 180) - vx; // room for the caption
  const ly = y1 + 24;
  const height = ly + 22 - y0;
  const aria = `${st.label} ${st.sublabel}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${aria}" viewBox="${f(vx)} ${f(y0)} ${f(vw)} ${f(height)}" width="${Math.round(vw)}" height="${Math.round(height)}">
<title>${aria}</title>
${scene.body}
<text x="0" y="${f(ly)}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="16" font-weight="600" fill="${C.label}">${st.label}</text>
<text x="0" y="${f(ly + 18)}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="13" fill="${C.sublabel}">${st.sublabel}</text>
</svg>
`;
}

const SCENES = { pour: pourScene, compact: greensScene, shrink: meatScene };
const only = process.argv.slice(2).find((a) => !a.startsWith('--'));
const report = {};
const fails = [];
fs.mkdirSync(GEN, { recursive: true });
// The Figma copies under Chapter Content/ get hand-edited (Illustrator), so
// they're only written on request: `render.mjs [id] --export-figma`.
const EXPORT_FIGMA = process.argv.includes('--export-figma');
if (EXPORT_FIGMA) fs.mkdirSync(FIGMA_DIR, { recursive: true });
for (const spec of VOLUME_COMPARISONS) {
  if (only && spec.id !== only) continue;
  const b = SCENES[spec.mechanism](spec, 'before');
  const a = SCENES[spec.mechanism](spec, 'after');
  const ratio = spec.after.amount / spec.before.amount;
  const r = { stated: `${spec.before.label} → ${spec.after.label}`, statedRatio: ratio, before: b.measured, after: a.measured };
  const near = (x, y, tol) => Math.abs(x / y - 1) <= tol;
  if (spec.mechanism === 'pour') {
    r.pieceVolumeRatio = +sim[spec.id].pieceVolumeRatio.toFixed(3);
    r.fillRatio = +(a.measured.fillCups / b.measured.fillCups).toFixed(3);
    if (b.measured.count !== a.measured.count) fails.push(`${spec.id}: piece count changed`);
    if (!near(b.measured.fillCups, spec.before.amount, 0.015) || !near(a.measured.fillCups, spec.after.amount, 0.015)) fails.push(`${spec.id}: fill level off`);
    if (!near(r.pieceVolumeRatio, ratio, 0.05)) fails.push(`${spec.id}: per-piece swell ${r.pieceVolumeRatio} not ~${ratio}`);
  } else if (spec.mechanism === 'shrink') {
    r.volumeRatio = +(a.volume / b.volume).toFixed(4);
    if (!near(r.volumeRatio, ratio, 0.001)) fails.push(`${spec.id}: slab volume ratio ${r.volumeRatio}`);
  } else if (spec.mechanism === 'compact') {
    if (b.measured.count !== a.measured.count) fails.push(`${spec.id}: leaf count changed`);
    if (b.measured.pileTopCups > spec.before.amount + 1e-9 || a.measured.pileTopCups > spec.after.amount + 1e-9) fails.push(`${spec.id}: leaves above fill line`);
  }
  report[spec.id] = r;
  for (const [which, sc] of [['before', b], ['after', a]]) {
    const svg = frame(spec, which, sc);
    fs.writeFileSync(path.join(GEN, `volume-${spec.id}-${which}.svg`), svg);
    if (EXPORT_FIGMA) fs.writeFileSync(path.join(FIGMA_DIR, `volume-${spec.id}-${which}.svg`), svg);
  }
}
fs.writeFileSync(path.join(GEN, 'volumeReport.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (fails.length) { console.error('FAILED:\n' + fails.join('\n')); process.exit(1); }
