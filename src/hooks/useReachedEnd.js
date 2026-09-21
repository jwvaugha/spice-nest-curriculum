import { useEffect, useRef, useState } from 'react';
import { markChapterViewed } from './useViewedChapters';

const DEFAULT_DWELL_MS = 1500;
const DEFAULT_THRESHOLD_PX = 24;

// Drives both the ChapterFooter button's outlined -> filled state change and
// the chapter's "completed" status -- per direct user direction, neither
// should fire just because the reader clicked a link into the chapter or
// clicked "continue" early. Both now require actually scrolling to the
// bottom of the content AND lingering there for `dwellMs` before the dwell
// timer commits `reachedEnd = true` (which also fires `markChapterViewed`).
// Scrolling away from the bottom before the timer fires cancels it -- a
// quick flick to the bottom and back doesn't count as "read."
//
// `paneRef` is the SAME ref `useSettledWidth` already attaches to the
// scrollable content pane (both hooks just read/observe `paneRef.current`,
// no conflict in sharing one ref between them).
//
// A chapter shorter than the pane (nothing to scroll) is already
// "at the bottom" on the very first check -- the dwell timer still has to
// run its full course before it counts, so a short chapter can't be
// instantly marked complete on load either.
export function useReachedEnd(paneRef, chapterId, { dwellMs = DEFAULT_DWELL_MS, thresholdPx = DEFAULT_THRESHOLD_PX } = {}) {
  const [reachedEnd, setReachedEnd] = useState(false);
  const dwellTimer = useRef(null);

  useEffect(() => {
    const el = paneRef.current;
    if (!el || reachedEnd) return undefined;

    const checkPosition = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= thresholdPx;
      if (atBottom) {
        if (!dwellTimer.current) {
          dwellTimer.current = setTimeout(() => {
            setReachedEnd(true);
            if (chapterId) markChapterViewed(chapterId);
          }, dwellMs);
        }
      } else if (dwellTimer.current) {
        clearTimeout(dwellTimer.current);
        dwellTimer.current = null;
      }
    };

    checkPosition();
    el.addEventListener('scroll', checkPosition, { passive: true });
    return () => {
      el.removeEventListener('scroll', checkPosition);
      clearTimeout(dwellTimer.current);
      dwellTimer.current = null;
    };
  }, [paneRef, chapterId, dwellMs, thresholdPx, reachedEnd]);

  return reachedEnd;
}
