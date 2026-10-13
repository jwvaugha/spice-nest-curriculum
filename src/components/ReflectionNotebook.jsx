import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// The writing space on a module reflection page (Figma "Frame 692": a B/I/U
// toggle group above a sheet of lined notebook paper). It's a real editor:
// a contentEditable sheet with bold/italic/underline from the toolbar or the
// usual keyboard shortcuts (Cmd/Ctrl+B/I/U), and autosave to this browser's
// localStorage under `nest-reflection-<storageId>`.
//
// Formatting uses document.execCommand. It's deprecated but still supported
// by every current browser, and it's the only built-in way to toggle inline
// formatting on a selection without pulling in an editor library for three
// buttons. Saved HTML is sanitized on load and on paste (paste comes in as
// plain text), so only <b>/<i>/<u> and line structure ever persist.
//
// "Clear" (right end of the toolbar) erases the entry after a confirmation
// dialog. It can't be undone, so the dialog says so and focus starts on
// Cancel.
//
// Figma values: 34px ruled lines (#f1e8da, unbound in Figma), 50/33px sheet
// padding, a 3-layer drop shadow, placeholder "Type anywhere to start" at
// 12px (#b7ab9f, a variable not in theme.js).
const LINE = 34;
const LINE_COLOR = '#f1e8da';
const PLACEHOLDER_COLOR = '#b7ab9f';
const SAVE_DELAY = 600;
const MIN_LINES = 14;

const FORMATS = [
  { cmd: 'bold', label: 'Bold', shortcut: 'B', Icon: FormatBoldRoundedIcon },
  { cmd: 'italic', label: 'Italic', shortcut: 'I', Icon: FormatItalicRoundedIcon },
  { cmd: 'underline', label: 'Underline', shortcut: 'U', Icon: FormatUnderlinedRoundedIcon },
];

const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'DIV', 'P']);

// Keep only formatting/line tags, with no attributes; unwrap anything else.
function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const clean = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        return;
      }
      clean(child);
      if (ALLOWED_TAGS.has(child.tagName)) [...child.attributes].forEach((a) => child.removeAttribute(a.name));
      else child.replaceWith(...child.childNodes);
    });
  };
  const root = doc.body.firstChild;
  clean(root);
  return root.innerHTML;
}

const storageKey = (id) => `nest-reflection-${id}`;

function readEntry(id) {
  try {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeEntry(id, html) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify({ html, updatedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

function clearEntry(id) {
  try {
    localStorage.removeItem(storageKey(id));
    return true;
  } catch {
    return false;
  }
}

const isBlank = (el) => el.textContent.trim() === '';

export default function ReflectionNotebook({ storageId, labelledBy, onHasContent }) {
  const editorRef = useRef(null);
  const saveTimer = useRef(null);
  const cancelRef = useRef(null);
  const [active, setActive] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 'idle' (nothing typed this visit), 'saving', 'saved', 'cleared', or 'error'.
  const [status, setStatus] = useState('idle');
  const [empty, setEmpty] = useState(true);
  // Held in a ref so a parent passing a new function each render can't
  // re-run the load effect (which would overwrite what's being typed).
  const onHasContentRef = useRef(onHasContent);
  useEffect(() => {
    onHasContentRef.current = onHasContent;
  }, [onHasContent]);

  // Load the saved entry once. The editor's DOM is owned by the browser from
  // here on (React never re-renders its children), so typing never fights a
  // re-render.
  useEffect(() => {
    const el = editorRef.current;
    const entry = readEntry(storageId);
    el.innerHTML = entry?.html ? sanitize(entry.html) : '';
    const blank = isBlank(el);
    setEmpty(blank);
    if (!blank) onHasContentRef.current?.();
  }, [storageId]);

  const refreshActive = useCallback(() => {
    const el = editorRef.current;
    const sel = document.getSelection();
    if (!el || !sel || !sel.anchorNode || !el.contains(sel.anchorNode)) return;
    setActive(FORMATS.filter((f) => document.queryCommandState(f.cmd)).map((f) => f.cmd));
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refreshActive);
    return () => document.removeEventListener('selectionchange', refreshActive);
  }, [refreshActive]);

  const save = useCallback(() => {
    const el = editorRef.current;
    const html = isBlank(el) ? '' : sanitize(el.innerHTML);
    setStatus(writeEntry(storageId, html) ? 'saved' : 'error');
    if (html) onHasContentRef.current?.();
  }, [storageId]);

  // Flush a pending save when leaving the page.
  useEffect(
    () => () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        save();
      }
    },
    [save],
  );

  const handleInput = () => {
    const el = editorRef.current;
    // Browsers leave a stray <br> or empty <div> behind after deleting
    // everything; clear it so the placeholder comes back.
    if (isBlank(el) && !el.querySelector('b, i, u')) el.innerHTML = '';
    setEmpty(isBlank(el));
    setStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null;
      save();
    }, SAVE_DELAY);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  };

  const handleClear = () => {
    clearTimeout(saveTimer.current);
    saveTimer.current = null;
    const el = editorRef.current;
    el.innerHTML = '';
    setEmpty(true);
    setActive([]);
    setStatus(clearEntry(storageId) ? 'cleared' : 'error');
    setConfirmOpen(false);
    el.focus();
  };

  const applyFormat = (cmd) => {
    const el = editorRef.current;
    if (document.activeElement !== el) el.focus();
    document.execCommand(cmd);
    refreshActive();
    handleInput();
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2.5 }}>
        <ToggleButtonGroup size="small" value={active} aria-label="Text formatting">
          {FORMATS.map(({ cmd, label, shortcut, Icon }) => (
            <Tooltip key={cmd} title={`${label} (Ctrl/⌘+${shortcut})`}>
              <ToggleButton
                value={cmd}
                aria-label={label}
                // Keep the editor's selection: a mousedown on the button
                // would otherwise move focus away and collapse it.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat(cmd)}
                sx={{ px: 0.75, py: 0.25 }}
              >
                <Icon fontSize="small" />
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
        <Typography
          variant="caption"
          color="text.secondary"
          role="status"
          aria-live="polite"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          {status === 'saving' && 'Saving…'}
          {status === 'saved' && (
            <>
              <CheckRoundedIcon sx={{ fontSize: 16, color: 'secondary.dark' }} />
              Saved on this device
            </>
          )}
          {status === 'cleared' && 'Reflection cleared'}
          {status === 'error' && 'Couldn’t save. Your browser may be blocking storage.'}
        </Typography>
        <Button
          size="small"
          color="inherit"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={() => setConfirmOpen(true)}
          disabled={empty}
          sx={{ ml: 'auto !important', color: 'text.secondary' }}
        >
          Clear
        </Button>
      </Stack>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby={`${storageId}-clear-title`}
        aria-describedby={`${storageId}-clear-desc`}
        // Start on the safe choice once the dialog has opened.
        // Visually equal padding on every side (MUI's defaults are 24px
        // left/right but only 8px below the buttons). The top is 22px because
        // the title's line box adds ~8px of leading above its capitals; the
        // visible gap above the capitals then reads as balanced (by eye, per the user; a strict 24px measurement looked top-light).
        slotProps={{
          transition: { onEntered: () => cancelRef.current?.focus() },
          paper: { sx: { p: 3, pt: 2.75 } },
        }}
      >
        <DialogTitle
          id={`${storageId}-clear-title`}
          // DialogTitle defaults to the theme's h6 (uppercase, tracked);
          // a question reads better as a sentence-case serif heading.
          sx={(theme) => ({ ...theme.typography.h2, textTransform: 'none', p: 0, mb: 1.5 })}
        >
          Clear this reflection?
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <DialogContentText id={`${storageId}-clear-desc`}>
            This erases everything you’ve written here. You can’t undo this.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 0, mt: 3 }}>
          <Button ref={cancelRef} onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleClear} variant="contained" disableElevation startIcon={<DeleteOutlineRoundedIcon />}>
            Clear Reflection
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          bgcolor: 'background.default',
          boxShadow: '0 1px 8px rgba(0,0,0,0.12), 0 3px 4px rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.2)',
          px: { xs: 2.5, sm: '33px' },
          py: '50px',
          cursor: 'text',
        }}
        onClick={() => editorRef.current?.focus()}
      >
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-labelledby={labelledBy}
          spellCheck
          data-placeholder="Type anywhere to start"
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          onBlur={() => {
            if (saveTimer.current) {
              clearTimeout(saveTimer.current);
              saveTimer.current = null;
              save();
            }
          }}
          sx={{
            position: 'relative',
            minHeight: LINE * MIN_LINES,
            fontSize: '1rem',
            lineHeight: `${LINE}px`,
            color: 'text.primary',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            // Ruled lines sit on each line's baseline area and scroll with
            // the text, so typing always lands on a line.
            backgroundImage: `linear-gradient(to bottom, transparent ${LINE - 1}px, ${LINE_COLOR} ${LINE - 1}px)`,
            backgroundSize: `100% ${LINE}px`,
            backgroundAttachment: 'local',
            '& b, & strong': { fontWeight: 700 },
            '&::before': empty
              ? {
                  content: 'attr(data-placeholder)',
                  position: 'absolute',
                  fontSize: 12,
                  color: PLACEHOLDER_COLOR,
                  pointerEvents: 'none',
                }
              : undefined,
          }}
        />
      </Box>
    </Box>
  );
}
