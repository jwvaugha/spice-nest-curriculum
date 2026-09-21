import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nest-viewed-chapters';

function readViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// Shared "viewed" state across the whole app, backed by localStorage so it
// survives closing the browser (not just one session, unlike Figma's
// prototype Variables). Components re-render on change via a 'storage'-style
// custom event dispatched on write.
const EVENT_NAME = 'nest-viewed-changed';

export function markChapterViewed(chapterId) {
  if (!chapterId) return;
  const viewed = readViewed();
  if (viewed[chapterId]) return;
  viewed[chapterId] = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
  } catch (e) {
    /* localStorage unavailable — fail silently */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useViewedChapters() {
  const [viewed, setViewed] = useState(readViewed);

  useEffect(() => {
    const onChange = () => setViewed(readViewed());
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const isViewed = useCallback((chapterId) => !!viewed[chapterId], [viewed]);

  return { isViewed, markViewed: markChapterViewed };
}
