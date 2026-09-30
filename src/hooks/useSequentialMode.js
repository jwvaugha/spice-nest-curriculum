import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nest-sequential-mode';
const EVENT_NAME = 'nest-sequential-mode-changed';

function readSequentialMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

// Same shared-state pattern as useViewedChapters -- a plain localStorage
// boolean plus a custom event, so the toggle in GlobalHeader's user menu and
// the modules list reading it (Dashboard) stay in sync without prop drilling
// or a React Context. Off by default: sequential unlocking is an opt-in mode
// a returning/admin-minded user turns on, not the default experience for a
// fresh learner.
export function setSequentialMode(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
  } catch (e) {
    /* localStorage unavailable — fail silently */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useSequentialMode() {
  const [sequentialMode, setState] = useState(readSequentialMode);

  useEffect(() => {
    const onChange = () => setState(readSequentialMode());
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const toggleSequentialMode = useCallback(() => setSequentialMode(!readSequentialMode()), []);

  return { sequentialMode, toggleSequentialMode };
}
