import { useEffect } from 'react';

// Scrolls to the section named by the URL's #hash on mount -- what makes a
// cross-chapter sidebar section link actually work. Clicking "Diet and
// Diabetes" while reading a DIFFERENT chapter navigates to
// `/module-2-chapter-2#diet-and-diabetes` (see ChapterMenuItem.jsx); this is
// what lands the reader on that exact section once the destination page
// mounts, instead of just the top of the page. React Router's <Link> does a
// client-side route change, not a real page load, so the browser's native
// "scroll to #hash on navigate" behavior doesn't fire here -- this hook is
// the manual equivalent.
//
// Each chapter page is its own route element, so navigating from one to
// another fully unmounts the old component and mounts a fresh instance of
// the new one -- a mount-only effect is enough, no need to watch for
// location changes within one already-mounted page.
export function useScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return undefined;
    const raf = requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, []);
}
