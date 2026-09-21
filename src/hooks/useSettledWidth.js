import { useEffect, useRef, useState } from 'react';

// Measures a container's width via ResizeObserver, but only commits a new
// value ~200ms after the resize has actually stopped firing — a true
// debounce, not a CSS transition. While the browser window is being
// actively dragged, content that reads from this stays at its last settled
// width (the surrounding pane still resizes instantly via plain CSS flex —
// only the reading column's own width holds still), so paragraphs don't
// rewrap on every intermediate pixel. The debounce and the animation are
// two separate concerns: this hook only decides WHEN the new width commits;
// consumers pair the returned `width` with `transition: RESIZE_TRANSITION`
// (see layoutConstants.js) on the styled width so that once-per-settle
// commit animates smoothly into place instead of snapping. Returns
// [ref, width] — attach `ref` to the element whose available width should
// drive the measurement (the scrollable content pane, not the text column
// itself).
export function useSettledWidth(delay = 200) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Seed synchronously so content isn't zero-width on first paint —
    // only resize events afterward go through the debounce.
    setWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setWidth(next), delay);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer.current);
    };
  }, [delay]);

  return [ref, width];
}
