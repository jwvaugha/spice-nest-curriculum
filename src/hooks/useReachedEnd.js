import { useEffect, useRef, useState } from 'react';
import { markChapterViewed, recordChapterVisit } from './useViewedChapters';

const DEFAULT_DWELL_MS = 1500;
// Fraction of the chapter's total scroll height the reader has to have
// brought into view (viewport bottom edge / content height). Per direct user
// direction "read" means getting most of the way through -- ~85% -- not
// literally the last pixel, so skipping the References list at the very end
// doesn't block a chapter from counting as read.
const DEFAULT_READ_FRACTION = 0.85;

// Also records the chapter as the most recently VISITED one the moment the
// page mounts (independent of reading progress) -- every chapter page
// already runs this hook, so this is the one shared place that sees every
// chapter open without touching each page.
//
// Drives both the ChapterFooter button's outlined -> filled state change and
// the chapter's "completed" status -- per direct user direction, neither
// should fire just because the reader clicked a link into the chapter or
// clicked "continue" early. Both now require actually scrolling through
// most of the content (DEFAULT_READ_FRACTION) AND lingering there for `dwellMs` before the dwell
// timer commits `reachedEnd = true` (which also fires `markChapterViewed`).
// Scrolling back above the threshold before the timer fires cancels it -- a
// quick flick down and back doesn't count as "read."
//
// `paneRef` is the SAME ref `useSettledWidth` already attaches to the
// scrollable content pane (both hooks just read/observe `paneRef.current`,
// no conflict in sharing one ref between them).
//
// A chapter shorter than the pane (nothing to scroll) is already
// "past the threshold" on the very first check -- the dwell timer still has to
// run its full course before it counts, so a short chapter can't be
// instantly marked complete on load either.
export function useReachedEnd(paneRef, chapterId, { dwellMs = DEFAULT_DWELL_MS, readFraction = DEFAULT_READ_FRACTION } = {}) {
  const [reachedEnd, setReachedEnd] = useState(false);
  const dwellTimer = useRef(null);

  useEffect(() => {
    recordChapterVisit(chapterId);
  }, [chapterId]);

  useEffect(() => {
    const el = paneRef.current;
    if (!el || reachedEnd) return undefined;

    const checkPosition = () => {
      const atBottom = (el.scrollTop + el.clientHeight) / el.scrollHeight >= readFraction;
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
  }, [paneRef, chapterId, dwellMs, readFraction, reachedEnd]);

  return reachedEnd;
}
