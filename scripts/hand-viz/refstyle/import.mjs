// Imports the user's hand-tuned Illustrator copies of the hand figures into the
// app. These files are now the source of truth for the page's hand figures
// (build.mjs only produced the starting point). Re-run after any further edit:
//   npm run viz:hands:import   ->  src/viz/hand/hand-<id>.svg
//
// Cleanup: Illustrator exports reuse the same class names (.st0...) and ids
// (mask, clippath, linear-gradient) in every file, and inline <style> is
// page-global, so four figures inlined on one page would restyle each other.
// Every id and class is prefixed per figure. Helvetica -> Roboto (the page font),
// and each figure gets role="img", an aria-label and <title> from its alt text.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HAND_COMPARISONS } from '../../../src/viz/handComparisons.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, '../../../../Chapter Content/Images/Module 5/Chapter 1 - Measuring and Portion Size Techniques');
const OUT = path.resolve(here, '../../../src/viz/hand');
// which Chapter Content file holds the approved version of each figure
const FILES = { fist: 'hand-fist.svg', palm: 'hand-palm.svg', cupped: 'hand-cupped-v3.svg', thumb: 'hand-thumb.svg' };
// Vertical crop: each figure's visible top/bottom (viewBox units, measured by an
// alpha scan of the render), so its content sits centred with an equal margin
// instead of every figure keeping the tall shared frame. Re-measure if the art
// in a file moves up or down.
const VISIBLE_Y = { fist: [-102, 169], palm: [76, 488.5], cupped: [168.5, 503.5], thumb: [211.5, 503.5] };
const MARGIN = 12;
// The ≈ sits at the midpoint of the empty gap between the hand (with its dashed
// callout) and the tool, and vertically halfway between their centres. Measured
// from the render with the ≈ removed (scan of visible ink -- faint drop shadows
// and near-white bits ignored -- split at the widest empty
// column run); re-measure if a hand or tool moves. [x, y] of the glyph's ink centre.
const APPROX = { fist: [186.9, 19.0], palm: [487.8, 308.5], cupped: [427.0, 335.2], thumb: [422.0, 346.6] };
// Roboto 400 30px '≈' ink centre relative to its text-anchor="middle" baseline anchor
const GLYPH = { dx: -0.1, dy: -9.5 };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

fs.mkdirSync(OUT, { recursive: true });
for (const { id, alt } of HAND_COMPARISONS) {
  let s = fs.readFileSync(path.join(SRC, FILES[id]), 'utf8');
  const pre = `hand-${id}-`;
  const ids = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const fix = (x) => (x.startsWith(pre) ? x : pre + x);
  s = s
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/\sid="([^"]+)"/g, (m, x) => ` id="${fix(x)}"`)
    .replace(/url\(#([^)]+)\)/g, (m, x) => (ids.has(x) ? `url(#${fix(x)})` : m))
    .replace(/((?:xlink:)?href)="#([^"]+)"/g, (m, a, x) => (ids.has(x) ? `${a}="#${fix(x)}"` : m))
    .replace(/\sclass="([^"]+)"/g, (m, c) => ` class="${c.split(/\s+/).map((k) => pre + k).join(' ')}"`)
    .replace(/<style>([\s\S]*?)<\/style>/g, (m, css) => `<style>${css.replace(/\.(st\d+)/g, `.${pre}$1`).replace(/font-family:\s*[^;]+;/g, 'font-family: Roboto, sans-serif;')}</style>`);
  // the ≈: one consistent element, centred in the gap (Illustrator left-anchors it)
  const [ax, ay] = APPROX[id];
  const approx = `<text x="${+(ax - GLYPH.dx).toFixed(1)}" y="${+(ay - GLYPH.dy).toFixed(1)}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="30" font-weight="400" fill="#a69889">≈</text>`;
  const n = (s.match(/<text\b[^>]*>(?:<tspan[^>]*>)?≈(?:<\/tspan>)?<\/text>/g) || []).length;
  if (n !== 1) throw new Error(`${FILES[id]}: expected one ≈ text, found ${n}`);
  s = s.replace(/<text\b[^>]*>(?:<tspan[^>]*>)?≈(?:<\/tspan>)?<\/text>/, approx);
  // root element: accessible name, natural size from the viewBox
  s = s.replace(/<svg\b([^>]*)>/, (m, a) => {
    const vb = a.match(/viewBox="([^"]+)"/)[1].split(/[\s,]+/).map(Number);
    const [y0, y1] = VISIBLE_Y[id];
    vb[1] = +(y0 - MARGIN).toFixed(1); vb[3] = +(y1 - y0 + 2 * MARGIN).toFixed(1);
    a = a.replace(/viewBox="[^"]+"/, `viewBox="${vb.join(' ')}"`).replace(/\s(?:role|aria-label|width|height|version)="[^"]*"/g, '');
    return `<svg${a} role="img" aria-label="${esc(alt)}" width="${Math.round(vb[2])}" height="${Math.round(vb[3])}">\n<title>${esc(alt)}</title>`;
  });
  fs.writeFileSync(path.join(OUT, `hand-${id}.svg`), s.trim() + '\n');
  console.log(`imported ${FILES[id]} -> src/viz/hand/hand-${id}.svg`);
}
