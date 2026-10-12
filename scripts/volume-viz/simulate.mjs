// Rigid-body pour simulation (Rapier) for the 'pour' comparisons in
// src/viz/volumeComparisons.js. Writes src/viz/generated/volumeSim.json, which
// render.mjs turns into SVGs. Build-time only -- Rapier never ships to the app.
// All units are real millimetres.
//
// For each comparison:
//   1. DRY: pour real-size dry pieces into the real-size jug. The piece COUNT
//      is calibrated (re-pouring) until the levelled pile = before.amount cups;
//      if whole-piece steps are too coarse to land within FILL_TOL (pasta: one
//      penne is ~3% of a cup), the piece size is then nudged the last little
//      way -- the final dimensions are reported, and stay within a few % of real.
//   2. COOKED: the same pieces (same count, same pour sequence), each swollen by
//      a uniform scale, calibrated until the pile = after.amount cups.
//   The per-piece volume swell cooked/dry comes out of the physics and is
//   reported; it should land near the cup ratio (same count, similar packing).
//
// Fill level = total solid volume / (bulk packing fraction x jug floor area),
// packing fraction Monte-Carlo-sampled from the middle of the pile -- i.e. the
// height the pile would have levelled off with a knife ("spoon and level").

import RAPIER from '@dimforge/rapier3d-compat';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { VOLUME_COMPARISONS, JUGS, cupHeight } from '../../src/viz/volumeComparisons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../../src/viz/generated/volumeSim.json');
const FILL_TOL = 0.01;
const MAX_ITERS = 6;
const GUESS_PACKING = { grain: 0.6, tube: 0.45 };
// Rapier contacts are soft springs (contact_natural_frequency, default 30 Hz):
// a grain sinks into its neighbours in proportion to the weight above it. In a
// pile 20+ grains deep that hit 19% of dry-rice and 42% of cooked-rice volume
// overlapping, inflating the computed fill (cooked rice "filled 3 cups" while
// really reaching ~2.1). Extra solver iterations didn't help (12.3% -> 12.0%);
// 300 Hz brought it to 0.1%. 1000 Hz is too stiff -- grains get launched out of
// the jug. MAX_OVERLAP fails the run if overlap ever creeps back.
export const SOLVER_ITERS = Number(process.env.SIM_ITERS ?? 4);
export const CONTACT_HZ = Number(process.env.SIM_CONTACT_HZ ?? 300);
const MAX_OVERLAP = 0.02;

// Piece geometry from real { length, diameter } (mm).
const PIECES = {
  grain: {
    shape: ({ length, diameter }) => ({ r: diameter / 2, hh: (length - diameter) / 2 }),
    volume: ({ r, hh }) => Math.PI * r * r * 2 * hh + (4 / 3) * Math.PI * r ** 3,
    collider: ({ r, hh }) => RAPIER.ColliderDesc.capsule(hh, r),
  },
  tube: {
    shape: ({ length, diameter }) => ({ r: diameter / 2, hh: length / 2 }),
    volume: ({ r, hh }) => Math.PI * r * r * 2 * hh,
    collider: ({ r, hh }) => RAPIER.ColliderDesc.cylinder(hh, r),
  },
};
const scaleDims = (d, k) => ({ length: d.length * k, diameter: d.diameter * k });

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function randomQuat(rand) {
  // Shoemake's uniform random rotation.
  const u1 = rand(), u2 = rand() * 2 * Math.PI, u3 = rand() * 2 * Math.PI;
  const a = Math.sqrt(1 - u1), b = Math.sqrt(u1);
  return { x: a * Math.sin(u2), y: a * Math.cos(u2), z: b * Math.sin(u3), w: b * Math.cos(u3) };
}
// Rotate local +Y (Rapier's capsule/cylinder axis) by quaternion q.
function axisOf([x, y, z, w]) {
  return [2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x)];
}

export function pour({ piece, count, seed, dims, jug, iters = SOLVER_ITERS, contactHz = CONTACT_HZ }) {
  const started = Date.now();
  const P = PIECES[piece];
  const g = P.shape(dims);
  const R = jug.radius;
  const world = new RAPIER.World({ x: 0, y: 0, z: -1000 });
  world.timestep = 1 / 240;
  world.integrationParameters.numSolverIterations = iters;
  world.integrationParameters.contact_natural_frequency = contactHz;

  // Jug: floor + 96 wall staves, built tall so nothing spills during the pour.
  const wallH = jug.heightCups * cupHeight(jug) * 3;
  world.createCollider(RAPIER.ColliderDesc.cuboid(R * 2, R * 2, 5).setTranslation(0, 0, -5).setFriction(0.6));
  const STAVES = 96;
  for (let i = 0; i < STAVES; i++) {
    const a = (i / STAVES) * Math.PI * 2;
    const half = R * Math.tan(Math.PI / STAVES) * 1.15;
    const phi = a + Math.PI / 2;
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(half, 4, wallH / 2)
        .setTranslation(Math.cos(a) * (R + 4), Math.sin(a) * (R + 4), wallH / 2)
        .setRotation({ x: 0, y: 0, z: Math.sin(phi / 2), w: Math.cos(phi / 2) })
        .setFriction(0.4),
    );
  }

  // Pour in layers from just above the rising pile, on a jittered disc grid.
  const rand = rng(seed);
  const len = dims.length;
  const cell = len * 0.95;
  const spots = [];
  for (let x = -R; x <= R; x += cell) for (let y = -R; y <= R; y += cell) if (Math.hypot(x, y) < R - len / 2 - 0.5) spots.push([x, y]);
  const bodies = [];
  let topZ = 0;
  while (bodies.length < count) {
    for (const [sx, sy] of spots) {
      if (bodies.length >= count) break;
      const b = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(sx + (rand() - 0.5) * cell * 0.25, sy + (rand() - 0.5) * cell * 0.25, topZ + len * 0.9 + rand() * len * 0.4)
          .setRotation(randomQuat(rand))
          .setLinearDamping(0.3)
          .setAngularDamping(0.5),
      );
      world.createCollider(P.collider(g).setFriction(0.5).setRestitution(0.05).setDensity(1), b);
      bodies.push(b);
    }
    for (let i = 0; i < 70; i++) world.step();
    const zs = bodies.map((b) => b.translation().z).sort((a, b) => a - b);
    topZ = zs[Math.floor(zs.length * 0.98)];
  }
  for (let i = 0; i < 4000; i++) {
    world.step();
    if (i % 100 === 99 && bodies.every((b) => b.isSleeping() || Math.hypot(b.linvel().x, b.linvel().y, b.linvel().z) < 0.5)) break;
  }

  const pieces = bodies.map((b) => {
    const t = b.translation();
    const q = b.rotation();
    return { p: [t.x, t.y, t.z], q: [q.x, q.y, q.z, q.w] };
  });
  world.free();
  const escaped = pieces.filter(({ p }) => Math.hypot(p[0], p[1]) > R + 1 || p[2] < -1).length;
  if (escaped) throw new Error(`${escaped} pieces escaped the jug`);
  // NB: overlap is checked by the caller (calibration logs it; main fails on it).
  return { dims, ...g, count, pieces, ...measureFill({ piece, g, pieces, seed, R, len }), secs: Math.round((Date.now() - started) / 1000) };
}

function measureFill({ piece, g, pieces, seed, R, len }) {
  const { r, hh } = g;
  const segs = pieces.map(({ p, q }) => ({ c: p, ax: axisOf(q) }));
  // Spatial hash so each sample point only tests nearby pieces.
  const CS = len;
  const key = (x, y, z) => `${Math.floor(x / CS)},${Math.floor(y / CS)},${Math.floor(z / CS)}`;
  const grid = new Map();
  const ext = hh + r;
  for (const s of segs) {
    const lo = s.c.map((v) => Math.floor((v - ext) / CS)), hi = s.c.map((v) => Math.floor((v + ext) / CS));
    for (let i = lo[0]; i <= hi[0]; i++)
      for (let j = lo[1]; j <= hi[1]; j++)
        for (let k = lo[2]; k <= hi[2]; k++) {
          const kk = `${i},${j},${k}`;
          if (!grid.has(kk)) grid.set(kk, []);
          grid.get(kk).push(s);
        }
  }
  const inside = (pt, s) => {
    const d = [pt[0] - s.c[0], pt[1] - s.c[1], pt[2] - s.c[2]];
    const t = d[0] * s.ax[0] + d[1] * s.ax[1] + d[2] * s.ax[2];
    if (piece === 'tube' && Math.abs(t) > hh) return false;
    const tc = Math.max(-hh, Math.min(hh, t));
    const e = [d[0] - tc * s.ax[0], d[1] - tc * s.ax[1], d[2] - tc * s.ax[2]];
    return e[0] ** 2 + e[1] ** 2 + e[2] ** 2 < r * r;
  };
  const totalV = pieces.length * PIECES[piece].volume(g);
  const zs = pieces.map((x) => x.p[2]).sort((a, b) => a - b);
  let h = zs[Math.floor(zs.length * 0.95)];
  let phi = 0, overlap = 0;
  const rand = rng(seed + 999);
  for (let iter = 0; iter < 4; iter++) {
    const zlo = 0.15 * h, zhi = 0.75 * h;
    let hit = 0;
    const N = 20000;
    let shared = 0;
    for (let i = 0; i < N; i++) {
      const rr = R * Math.sqrt(rand()), a = rand() * Math.PI * 2;
      const pt = [rr * Math.cos(a), rr * Math.sin(a), zlo + rand() * (zhi - zlo)];
      const cand = grid.get(key(...pt));
      let k = 0;
      if (cand) for (const s of cand) if (inside(pt, s)) k++;
      if (k) hit++;
      if (k > 1) shared++;
    }
    overlap = hit ? shared / hit : 0;
    phi = hit / N;
    h = totalV / (phi * Math.PI * R * R);
  }
  return { fill: h, phi, overlap };
}

const log = (st, target) => console.log(`    [${st.secs}s] n=${st.count} L=${st.dims.length.toFixed(2)} D=${st.dims.diameter.toFixed(2)} fill=${st.fill.toFixed(2)}/${target.toFixed(2)}mm (${((st.fill / target - 1) * 100).toFixed(1)}%) phi=${st.phi.toFixed(3)} overlap=${(st.overlap * 100).toFixed(1)}%`);

// Dry: real size, calibrate the count; nudge size only if whole pieces are too coarse.
function calibrateDry({ spec, jug, target }) {
  const P = PIECES[spec.piece];
  let count = Math.round((GUESS_PACKING[spec.piece] * Math.PI * jug.radius ** 2 * target) / P.volume(P.shape(spec.dry)));
  let dims = spec.dry;
  let st;
  for (let i = 0; i < MAX_ITERS; i++) {
    st = pour({ piece: spec.piece, count, seed: spec.seed, dims, jug });
    log(st, target);
    const err = st.fill / target - 1;
    if (Math.abs(err) < FILL_TOL) return st;
    const next = Math.round(count * (target / st.fill));
    if (next !== count && Math.abs(next - count) >= 1 && i < 3) count = next;
    else dims = scaleDims(dims, (target / st.fill) ** (1 / 3));
  }
  throw new Error(`${spec.id}: dry calibration failed`);
}
function calibrateCooked({ spec, jug, target, dry, k0 }) {
  let k = k0;
  for (let i = 0; i < MAX_ITERS; i++) {
    const st = pour({ piece: spec.piece, count: dry.count, seed: spec.seed, dims: scaleDims(dry.dims, k), jug });
    log(st, target);
    if (Math.abs(st.fill / target - 1) < FILL_TOL) return st;
    k *= (target / st.fill) ** (1 / 3);
  }
  throw new Error(`${spec.id}: cooked calibration failed`);
}
// Preferred cooked path: swell every piece by EXACTLY the cup ratio (so the
// per-piece volume swell is the stated ratio by construction) and re-pour
// with different random pour orders -- cooked food is a separate pour anyway --
// keeping the first whose levelled pile lands on the fill line. With few
// pieces (pasta: ~38) random packing alone moves the fill ~±10%, so this
// beats resizing, which just chases that noise.
function pourExactSwell({ spec, jug, target, dry, cupRatio }) {
  const dims = scaleDims(dry.dims, Math.cbrt(cupRatio));
  let best = null;
  // Re-ordering only helps where packing noise is large (few pieces). With
  // thousands of grains (rice) the fill barely varies between orders, so a
  // miss is a systematic bias and retrying would just repeat it.
  const tries = dry.count < 500 ? 40 : 2;
  for (let i = 1; i <= tries; i++) {
    const st = pour({ piece: spec.piece, count: dry.count, seed: spec.seed + i * 7919, dims, jug });
    const err = Math.abs(st.fill / target - 1);
    if (!best || err < best.err) best = { st, err };
    if (err < FILL_TOL) break;
  }
  log(best.st, target);
  return best.err < FILL_TOL ? best.st : null;
}

export const ready = RAPIER.init();
const isMain = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) await main();
async function main() {
await ready;
const only = process.argv[2];
const result = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
for (const spec of VOLUME_COMPARISONS.filter((s) => s.mechanism === 'pour' && (!only || s.id === only))) {
  const t0 = Date.now();
  const jug = JUGS[spec.jug];
  const hc = cupHeight(jug);
  console.log(`${spec.id} (${spec.jug}, 1 cup = ${hc.toFixed(1)} mm):\n  dry`);
  const before = calibrateDry({ spec, jug, target: hc * spec.before.amount });
  const cupRatio = spec.after.amount / spec.before.amount;
  console.log('  cooked');
  let after = pourExactSwell({ spec, jug, target: hc * spec.after.amount, dry: before, cupRatio });
  if (!after) {
    console.log('  no exact-swell pour hit the fill line -- calibrating swell size instead');
    after = calibrateCooked({ spec, jug, target: hc * spec.after.amount, dry: before, k0: Math.cbrt(cupRatio) });
  }
  const P = PIECES[spec.piece];
  const pieceVolumeRatio = P.volume(after) / P.volume(before);
  for (const [w, st] of [['dry', before], ['cooked', after]]) if (st.overlap > MAX_OVERLAP) throw new Error(`${spec.id} ${w}: ${(st.overlap * 100).toFixed(1)}% of solid volume is two pieces overlapping (max ${MAX_OVERLAP * 100}%) -- raise SIM_CONTACT_HZ`);
  console.log(`  -> ${before.count} pieces; dry ${before.dims.length.toFixed(1)}x${before.dims.diameter.toFixed(1)} mm, cooked ${after.dims.length.toFixed(1)}x${after.dims.diameter.toFixed(1)} mm; per-piece swell ${pieceVolumeRatio.toFixed(3)} (cup ratio ${cupRatio}) [${((Date.now() - t0) / 1000).toFixed(0)}s]`);
  const round = (st) => ({ ...st, pieces: st.pieces.map(({ p, q }) => ({ p: p.map((v) => +v.toFixed(2)), q: q.map((v) => +v.toFixed(4)) })) });
  result[spec.id] = { piece: spec.piece, cupRatio, pieceVolumeRatio, before: round(before), after: round(after) };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result));
}
console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
}
