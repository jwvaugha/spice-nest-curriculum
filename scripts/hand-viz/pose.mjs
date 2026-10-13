// Poses the rigged hand for every entry in src/viz/handComparisons.js by
// running Blender headless (pose.py), writing src/viz/generated/handPoses.json.
// Blender: $BLENDER, else /Applications/Blender.app. Then run render.mjs.
//
// Editable poses: scripts/hand-viz/poses/<id>.blend. If one exists, its pose
// is used instead of the angles in handComparisons.js (delete it to go back).
//   node scripts/hand-viz/pose.mjs --write-blend          create missing .blend files from the angles
//   node scripts/hand-viz/pose.mjs --write-blend --force  overwrite them (discards hand edits)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HAND_COMPARISONS } from '../../src/viz/handComparisons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const BLENDER = process.env.BLENDER ?? '/Applications/Blender.app/Contents/MacOS/Blender';
if (!fs.existsSync(BLENDER)) throw new Error(`Blender not found at ${BLENDER} (set $BLENDER)`);
const POSES_DIR = path.join(here, 'poses');
const writeBlend = process.argv.includes('--write-blend');
if (writeBlend) fs.mkdirSync(POSES_DIR, { recursive: true });
const cfgFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'hand-')), 'cfg.json');
fs.writeFileSync(cfgFile, JSON.stringify({
  model: path.join(here, 'assets/right.glb'),
  out: path.resolve(here, '../../src/viz/generated/handPoses.json'),
  subdiv: 1,
  // Palm outline: wrist crease 12 mm in from the wrist joint; distal edge 0.3 of
  // the way along each proximal phalanx (the palmar digital crease).
  palm: { wristCrease: 0.012, fingerBase: 0.3 },
  thumbNailSide: Number(process.env.THUMB_NAIL_SIDE ?? 1),
  poses: Object.fromEntries(HAND_COMPARISONS.map((c) => [c.id, c.pose])),
  blendFiles: Object.fromEntries(HAND_COMPARISONS.map((c) => [c.id, path.join(POSES_DIR, `${c.id}.blend`)])),
  writeBlend,
  force: process.argv.includes('--force'),
}));
const log = execFileSync(BLENDER, ['-b', '--factory-startup', '--python', path.join(here, 'pose.py'), '--', cfgFile], { encoding: 'utf8' });
const line = log.split('\n').find((l) => l.startsWith('wrote'));
if (!line) { console.error(log); process.exit(1); }
console.log(line);
const b = JSON.parse(log.split('\n').find((l) => l.startsWith('blend ')).slice(6));
if (b.written.length) console.log(`wrote ${b.written.map((n) => `poses/${n}.blend`).join(', ')}`);
if (b.used.length) console.log(`used hand-edited ${b.used.map((n) => `poses/${n}.blend`).join(', ')} (instead of their angles)`);
