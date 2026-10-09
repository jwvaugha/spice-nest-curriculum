import { useCallback, useEffect, useState } from 'react';
import { MODULES } from '../moduleData';

const STORAGE_KEY = 'nest-viewed-chapters';
// The single most recently OPENED chapter (not necessarily read) -- drives
// Home's "Dive Back In" card, which per direct user direction should resume
// wherever the learner last was (e.g. after popping back to the main menu
// for a second), not the earliest unread gap in the whole curriculum.
const LAST_VISITED_KEY = 'nest-last-visited-chapter';

function readLastVisited() {
  try {
    return localStorage.getItem(LAST_VISITED_KEY);
  } catch (e) {
    return null;
  }
}

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

// Records `chapterId` as the most recently opened chapter. Called once per
// chapter-page mount (see useReachedEnd.js, which every chapter page already
// runs). Only dispatches when the value actually changes.
export function recordChapterVisit(chapterId) {
  if (!chapterId || readLastVisited() === chapterId) return;
  try {
    localStorage.setItem(LAST_VISITED_KEY, chapterId);
  } catch (e) {
    /* localStorage unavailable — fail silently */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// Wipes every "viewed" flag back to a fresh-learner state -- added as a
// testing affordance (GlobalHeader's "Jane Doe" menu) so it's easy to flip
// between "initial state" and "in-progress" without manually clearing
// localStorage via devtools. Dispatches the same event `markChapterViewed`
// does, so every consumer (Home's "Get Started"/"Dive Back In" card,
// Dashboard's module rows, every chapter Sidebar's unviewed dots) re-renders
// immediately, not just on next reload.
export function resetViewedChapters() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // A real "fresh learner" reset clears where they last were, too.
    localStorage.removeItem(LAST_VISITED_KEY);
  } catch (e) {
    /* localStorage unavailable — fail silently */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// Admin/testing affordance (GlobalHeader's user menu, "Jump to Module"):
// puts the session at the START of `moduleNumber` -- every prior chapter
// progress is wiped (including last-visited), then every built chapter in
// modules 1..moduleNumber-1 is marked read. Writes the same storage every
// consumer already reads, so all follow-on UI (Home's card and module
// groups, progress bars, sidebar dots, sequential locks) updates for free.
export function setProgressToModule(moduleNumber) {
  const viewed = {};
  for (const mod of MODULES) {
    if (mod.number >= moduleNumber) continue;
    for (const c of mod.chapters) if (c.to) viewed[c.chapterId] = true;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    localStorage.removeItem(LAST_VISITED_KEY);
  } catch (e) {
    /* localStorage unavailable — fail silently */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// Which "Jump to Module" preset the current progress exactly matches (or
// null): every built chapter before module N read, none from N onward.
export function getProgressPreset(isViewed) {
  for (const mod of MODULES) {
    const n = mod.number;
    const matches = MODULES.every((m) =>
      m.chapters.filter((c) => c.to).every((c) => isViewed(c.chapterId) === m.number < n),
    );
    if (matches) return n;
  }
  return null;
}

export function useViewedChapters() {
  const [viewed, setViewed] = useState(readViewed);
  const [lastVisited, setLastVisited] = useState(readLastVisited);

  useEffect(() => {
    const onChange = () => {
      setViewed(readViewed());
      setLastVisited(readLastVisited());
    };
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const isViewed = useCallback((chapterId) => !!viewed[chapterId], [viewed]);

  return { isViewed, lastVisited, markViewed: markChapterViewed, resetViewed: resetViewedChapters };
}
