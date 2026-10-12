// Writes a trimmed COPY of a volume-figure SVG (<name>-visible.svg next to the
// input) with every rice grain that can't be seen in the final image removed.
// The input file is never modified. Works on hand-edited / re-exported SVGs
// (e.g. an Illustrator round-trip) because it decides visibility from rendered
// pixels, not from the generator's geometry:
//
//   1. Grains = each small closed <path> immediately followed by a <line>
//      (the grain body + its highlight streak), bbox under 40px.
//   2. In headless Chromium, draw ONLY the grains, each a unique solid color,
//      fill only (no outline), crisp edges, at 4x zoom, then count each color's
//      surviving pixels. Drawing without outlines makes every occluder a
//      little smaller than in the real image, so grains just behind the front
//      layer peek through and are kept -- a deliberate safety margin.
//   3. Keep grains with >= 1 pixel; drop the rest (body + highlight).
//   4. Verify: render the original and the copy at 3x and count differing
//      pixels -- should be 0 or a handful of anti-aliasing specks.
//
// Usage: node scripts/volume-viz/cull-visible.mjs <file.svg> [...more]
// Needs Playwright's cached chrome-headless-shell (any version).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const shellDir = fs.readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort().at(-1);
if (!shellDir) throw new Error('no chrome-headless-shell in the Playwright cache');
const CHROME = path.join(cache, shellDir, 'chrome-headless-shell-mac-arm64', 'chrome-headless-shell');

const PAGE_JS = String.raw`
const ZOOM = 4, VERIFY_ZOOM = 3;
const src = document.getElementById('src').textContent;
const doc = new DOMParser().parseFromString(src, 'image/svg+xml');
const svg = doc.documentElement;
const vb = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
const W = vb[2], H = vb[3];

// Measure bboxes in a live copy.
const host = document.getElementById('host');
host.innerHTML = src.replace(/^<\?xml[^>]*>/, '');
const live = host.querySelector('svg');
const liveEls = [...live.querySelectorAll('*')];
const docEls = [...svg.querySelectorAll('*')];
const grains = [];
for (let i = 0; i < liveEls.length - 1; i++) {
  const el = liveEls[i], next = liveEls[i + 1];
  if (el.tagName !== 'path' || next.tagName !== 'line') continue;
  const b = el.getBBox();
  if (b.width > 40 || b.height > 40) continue;
  grains.push({ body: docEls[i], hl: docEls[i + 1] });
}

function render(svgText, zoom) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = Math.round(W * zoom); c.height = Math.round(H * zoom);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve(ctx.getImageData(0, 0, c.width, c.height).data);
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
  });
}
const ser = (node) => new XMLSerializer().serializeToString(node);

(async () => {
  // ID render: grains only, unique colors, fill only, crisp.
  const idSvg = svg.cloneNode(false);
  idSvg.setAttribute('shape-rendering', 'crispEdges');
  idSvg.setAttribute('width', W); idSvg.setAttribute('height', H);
  grains.forEach((g, i) => {
    const p = g.body.cloneNode(false);
    const id = i + 1;
    const hex = '#' + id.toString(16).padStart(6, '0');
    p.removeAttribute('class');
    p.setAttribute('style', 'fill:' + hex + ';stroke:none;opacity:1;fill-opacity:1');
    idSvg.appendChild(p);
  });
  const px = await render(ser(idSvg), ZOOM);
  const counts = new Uint32Array(grains.length + 1);
  for (let k = 0; k < px.length; k += 4) {
    if (px[k + 3] !== 255) continue;
    const id = (px[k] << 16) | (px[k + 1] << 8) | px[k + 2];
    if (id >= 1 && id <= grains.length) counts[id]++;
  }
  let dropped = 0;
  grains.forEach((g, i) => { if (counts[i + 1] === 0) { g.body.remove(); g.hl.remove(); dropped++; } });
  const out = ser(svg);

  // Verify against the original.
  const fix = (t) => { const d = new DOMParser().parseFromString(t, 'image/svg+xml').documentElement; d.setAttribute('width', W); d.setAttribute('height', H); return ser(d); };
  const [a, b] = await Promise.all([render(fix(src), VERIFY_ZOOM), render(fix(out), VERIFY_ZOOM)]);
  let diff = 0, maxDelta = 0;
  for (let k = 0; k < a.length; k += 4) {
    const dlt = Math.max(Math.abs(a[k] - b[k]), Math.abs(a[k + 1] - b[k + 1]), Math.abs(a[k + 2] - b[k + 2]));
    if (dlt > 8) diff++;
    maxDelta = Math.max(maxDelta, dlt);
  }
  const visible = [...counts.slice(1)].map((c) => c / (ZOOM * ZOOM)); // in 1x px^2
  const exposure = [1, 4, 10, 25].map((t) => [t, visible.filter((v) => v > 0 && v < t).length]);
  document.getElementById('out').textContent = JSON.stringify({ exposure, grains: grains.length, kept: grains.length - dropped, dropped, diffPixels: diff, totalPixels: a.length / 4, maxDelta, svg: out });
})();
`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cull-'));
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const html = `<!doctype html><meta charset="utf-8"><body><div id="host"></div><script type="text/plain" id="src">${src.replace(/<\/script/gi, '<\\/script')}</script><pre id="out"></pre><script>${PAGE_JS}</script></body>`;
  const page = path.join(tmp, 'page.html');
  fs.writeFileSync(page, html);
  const dom = execFileSync(CHROME, ['--headless', '--disable-gpu', '--virtual-time-budget=60000', '--dump-dom', `file://${page}`], { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
  if (!m || !m[1]) throw new Error(`no result for ${file}`);
  const txt = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  const r = JSON.parse(txt);
  const outFile = file.replace(/\.svg$/, '-visible.svg');
  fs.writeFileSync(outFile, `<?xml version="1.0" encoding="UTF-8"?>\n${r.svg}\n`);
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`  visible-area histogram (1x px^2): ${r.exposure.map(([t, n]) => `<${t}: ${n}`).join(', ')}`);
  console.log(`${path.basename(file)}: ${r.grains} grains -> kept ${r.kept}, dropped ${r.dropped}; ${kb(src.length)} -> ${kb(fs.statSync(outFile).size)}; pixel check: ${r.diffPixels} of ${r.totalPixels} differ (max channel delta ${r.maxDelta})`);
}
