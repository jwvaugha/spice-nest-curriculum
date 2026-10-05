import { useEffect, useRef, useState } from 'react';

// Shared scroll-triggered "fade + slide up" reveal, used two ways across
// this app: whole-block (Section, StickyAsideSection, ChapterHero -- the
// default, batching everything inside as one reveal) and per-item
// (NumberedListItem when it carries a photo, MythFactCard, ComparisonTable
// -- escalated because a reader actually pauses on these, see each
// component's own comment for why it opted in). Nesting the two is
// intentional and safe: a per-item element's OWN opacity still gates its
// OWN visibility regardless of what its ancestor Section's opacity already
// resolved to (CSS opacity composes down the tree, it doesn't get
// overridden by an ancestor that's already fully visible) -- so an
// image-bearing list item can reveal later than the section text around it
// with zero coordination code between the two levels.
//
// Fires once, ever (unobserves itself the instant it's seen) -- no
// re-trigger scrolling back up past something already revealed. Content
// already in the viewport on first mount goes through this exact same path
// (IntersectionObserver fires immediately for an element that's already
// intersecting when `observe()` is called), not a separate "already visible"
// special case.

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// This app's chapter pages scroll inside their OWN nested pane
// (`overflowY: auto`/`scroll`), not the browser window itself (the page
// shell is a fixed-height layout -- see layoutConstants.js/App.jsx) --
// IntersectionObserver's default root is the browser viewport, which would
// misfire here (an element scrolled out of the pane's own visible area can
// still geometrically overlap the viewport, since it's the pane's CONTENT
// that scrolled, not the pane's own box). Same DOM-walk trick already used
// in NutritionLabelExplorer's height measurement: find the real scrolling
// ancestor and pass it as `root` explicitly. Falls back to the viewport
// (root: null) if none is found, rather than erroring.
function findScrollAncestor(el) {
  let node = el ? el.parentElement : null;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

export function useRevealOnScroll({ threshold = 0.1, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { root: findScrollAncestor(el), threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}

export const REVEAL_DURATION_MS = 450;

// Shared sx fragment -- every reveal site spreads this into its own sx
// rather than re-typing the same three properties, so a future tweak to the
// animation (duration, distance, easing) happens once here. `delayMs` is
// only used by the per-item staggered cases (see NumberedListItem).
export function revealSx(visible, delayMs = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity ${REVEAL_DURATION_MS}ms ease-out ${delayMs}ms, transform ${REVEAL_DURATION_MS}ms ease-out ${delayMs}ms`,
  };
}
