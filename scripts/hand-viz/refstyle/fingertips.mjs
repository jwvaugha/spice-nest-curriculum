// Cupped hand: cut the four curled fingertips out of the traced hand as real,
// separate vector shapes (boolean intersection with paper.js), so they form
// their own layer above the vegetables -- no clipping masks, so each tip is
// plain editable paths in Illustrator.
import paper from 'paper';

paper.setup(new paper.Size(10, 10));

// Each tip: the finger's outline at the top and sides, closed underneath just
// below the fingertip's own contour line under the nail (figure px, y down).
// Traced off the hand at 7x zoom; each runs ~1 px outside the thin contour line
// so the line stays whole.
export const FINGERTIPS = {
  pinky: 'M-116,-62 C-116,-84 -111,-93 -103,-93 C-94,-93 -88,-89 -86,-82 L-85,-60 C-85,-45 -89,-37 -94,-33 C-99,-30 -106,-30 -110,-32 C-114,-36 -116,-46 -116.5,-56 Z',
  ring: 'M-86,-104 C-86,-118 -77,-128 -68,-128 C-60,-128 -55,-121 -53,-112 L-50,-92 L-51,-72 C-54,-62 -61,-58 -68,-58 C-76,-58 -81,-63 -83,-72 L-86,-96 Z',
  middle: 'M-42,-108 C-42,-136 -35,-150 -24,-150 C-12,-150 -4,-138 -3,-124 L-3,-100 C-5,-89 -13,-81 -22,-81 C-32,-81 -37,-87 -40,-96 Z',
  index: 'M3,-104 C3,-128 9,-144 20,-144 C31,-144 39,-136 41,-128 L40,-104 C39,-89 31,-78 22,-78 C12,-78 6,-87 4,-96 Z',
};

// "translate(a b) scale(s) translate(c,d) scale(e,f)" (potrace's output) -> matrix
function matrixOf(t) {
  const m = new paper.Matrix();
  for (const [, op, args] of t.matchAll(/(translate|scale)\(([^)]*)\)/g)) {
    const [x, y = op === 'scale' ? x : 0] = args.split(/[\s,]+/).map(Number);
    if (op === 'translate') m.translate(x, y); else m.scale(x, y);
  }
  return m;
}
const round = (d) => d.replace(/-?\d*\.\d+/g, (n) => String(+(+n).toFixed(2)));
const attr = (tag, k) => tag.match(new RegExp(` ${k}="([^"]*)"`))?.[1];

// hand: the recoloured traced hand (a run of <path transform=... d=... fill=...>)
export function fingertipLayer(hand) {
  const layers = [...hand.matchAll(/<path [^>]*\/>/g)].map(([tag]) => {
    const p = new paper.CompoundPath(attr(tag, 'd'));
    p.transform(matrixOf(attr(tag, 'transform')));
    return { p, fill: attr(tag, 'fill'), stroke: attr(tag, 'stroke'), width: +(attr(tag, 'stroke-width') ?? 0) * 0.25 };
  });
  // the traced layers: the silhouette (skin, stroked with the ink), tone bands,
  // nails (small, stroked), and the ink lines (filled with the ink colour)
  const base = layers.find((l) => l.fill !== 'none' && l.stroke && Math.abs(l.p.area) >= 4000);
  const ink = base.stroke;
  const tones = layers.filter((l) => l !== base && l.fill !== 'none' && l.fill !== ink && !l.stroke);
  const nails = layers.filter((l) => l.fill !== 'none' && l.stroke && Math.abs(l.p.area) < 4000);
  const piece = (l, tip) => {
    const x = l.p.intersect(tip);
    return x.isEmpty() || Math.abs(x.area) < 0.5 ? null : round(x.pathData);
  };
  // Each tip is a self-contained oval: whole skin shape, its tone bands and nail
  // cut to it, and one closed outline. The traced ink lines aren't carried over,
  // so no stray line fragments end at the oval's edge.
  const groups = Object.entries(FINGERTIPS).map(([name, d0]) => {
    // grown ~1.5 px all round so the oval covers the hand's own outline under it
    const tip = new paper.Path(d0);
    const { width: w, height: h } = tip.bounds;
    tip.scale((w + 3) / w, (h + 3) / h);
    const d = round(tip.pathData);
    const shade = tones.map((l) => [piece(l, tip), l.fill]).filter(([x]) => x);
    const nail = nails.map((l) => [piece(l, tip), l]).filter(([x]) => x);
    return `<g id="fingertip-${name}">`
      + `<path id="fingertip-${name}-skin" d="${d}" fill="${base.fill}"/>`
      + `<g id="fingertip-${name}-shading">${shade.map(([x, f]) => `<path d="${x}" fill="${f}"/>`).join('')}</g>`
      + `<g id="fingertip-${name}-nail">${nail.map(([x, l]) => `<path d="${x}" fill="${l.fill}" stroke="${l.stroke}" stroke-width="${l.width}" stroke-linejoin="round"/>`).join('')}</g>`
      + `<path id="fingertip-${name}-outline" d="${d}" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>`
      + '</g>';
  });
  return `<g id="fingertips">${groups.join('')}</g>`;
}
