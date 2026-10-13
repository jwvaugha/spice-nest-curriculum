// Thumbs-up, built from the reference fist (in the reference's own coordinates,
// before the mirror to a right hand): the crossing thumb's own paths are dropped,
// the finger parts it covered are filled in, and a raised thumb is drawn in the
// reference's style (flat skin, a shade band, a highlight, pink nail, ink outline).
import { P } from './palette.mjs';

// [x0, y0, x1, y1] of the crossing thumb's own paths (nail, nail shine, nail
// line, highlight, top outline), matched by bounding box.
const DROP = [
  [256.0, 572.4, 336.1, 620.2], [274.2, 576.3, 319.8, 599.2], [255.5, 583.2, 327.3, 620.2],
  [223.9, 615.7, 277.0, 638.6], [115.3, 557.4, 353.8, 671.4],
];
const near = (a, b) => a.every((v, i) => Math.abs(v - b[i]) < 1);

export function THUMB_UP(paths, matrix, palm) {
  const keep = paths.filter((p) => !DROP.some((b) => near(p.box, b)));
  const ref = keep.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join('');
  const dropped = paths.length - keep.length;
  if (dropped !== DROP.length) throw new Error(`thumbs-up: dropped ${dropped} of ${DROP.length} thumb paths`);
  return `<g transform="${matrix}">${ref}</g>${ADD}${BASE}${lifted(palm)}${BASE_INK}`;
}

// ink weight matches the reference outline at this scale (~4.5 ref units x 0.435)
const ink = (d, w = 2) => `<path d="${d}" fill="none" stroke="${P.line}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const fill = (d, c) => `<path d="${d}" fill="${c}"/>`;
// The added parts, in figure coordinates (px, y down; right hand, thumb on the right).
// Index finger (x -4..36) and the middle finger's lower half were under the old thumb.
const INDEX = 'M-4,-50 C-4,-20 -3,0 -1,6 C2,13 10,16 17,16 C26,16 33,11 35,2 C37,-14 36,-34 36,-50 Z';
// (unused) const THUMB = 'M35,-36 C31,-62 33,-84 36,-100 C38,-114 36,-124 40,-134 C46,-150 62,-158 74,-151 C84,-145 87,-128 85,-110 C83,-94 81,-78 83,-58 C86,-36 90,-10 86,12 C82,30 72,40 60,46 C50,34 40,10 35,-36 Z';
const ADD = [
  // index finger, lower half: skin, shade on the right, darker tuck under the tip, nail
  fill(INDEX, P.skin),
  fill('M24,-50 C30,-30 30,-8 26,8 C30,6 34,0 35,-6 C37,-20 36,-36 36,-50 Z', P.shade),
  fill('M-2,2 C6,10 26,10 34,2 C32,12 24,16 17,16 C9,16 1,12 -2,2 Z', P.deep),
  fill('M4,8 C8,2 24,2 29,8 C25,13 9,13 4,8 Z', P.nail),
  fill('M3,-44 C3,-30 4,-18 6,-12 C9,-24 9,-36 8,-44 Z', P.hi),
  ink('M-4,-40 C-4,-16 -3,0 -1,6 C2,13 10,16 17,16 C26,16 33,11 35,2'),
  ink('M6,9 C12,6 22,6 28,9', 1.4),
  // middle finger: its sides continue down to the tip
  ink('M-4.5,-44 C-4,-24 -6,-6 -10,4'),
].join('');

// The thumb itself is lifted out of the reference open palm (same artist, same
// real-size scale), so its shape, shading and size match the palm figure: clip
// the palm figure to the thumb beyond a cut across its base, then rotate it
// upright and stand the cut on the fist beside the index finger.
// Coordinates are the palm figure's (thumb pointing right and up, ~30 degrees).
const CUT = [[62, -40], [106, 38]]; // across the thumb, perpendicular to it
const CLIP = `M${CUT[0]} L84,-58 L110,-76 L140,-94 L194,-84 L194,-30 L150,-6 L126,16 L${CUT[1]} Z`;
// scale < 1: the palm view shows the thumb's broad side, which reads too big
// standing up; shrunk about its base so it still sits on the fist.
const LIFT = { pivot: [90, -9], angle: -55, to: [67, -28], scale: 0.84 };
const lifted = (palm) => `<clipPath id="hand-thumb-lift"><path d="${CLIP}"/></clipPath>
<g transform="translate(${LIFT.to}) rotate(${LIFT.angle}) scale(${LIFT.scale}) translate(${LIFT.pivot.map((v) => -v)})"><g clip-path="url(#hand-thumb-lift)">${palm}</g></g>`;

// Where the raised thumb meets the fist: skin under its base (covering the old
// crossing thumb's edge) and its outer outline carried down into the fist's.
const BASE = fill('M38,-34 L84,-30 C84,-12 82,8 77,26 L70,4 C68,-4 64,-10 56,-14 L38,-14 Z', P.skin);
const BASE_INK = [
  ink('M83,-28 C84,-12 82,6 77,24'),
  // the index finger's side down to its tip, and the crease where the thumb meets the palm
  ink('M36,-52 C37,-32 37,-12 35,2'),
  ink('M39,-24 C43,-8 50,6 58,14', 1.6),
].join('');
