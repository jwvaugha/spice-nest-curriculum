import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TouchAppRoundedIcon from '@mui/icons-material/TouchAppRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { PHOTO_MAX_WIDTH } from '../layoutConstants';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';
import { VOLUME_COMPARISONS } from '../viz/volumeComparisons';

// Before/after volume-change figure for Module 5 Chapter 1's "Cooked vs.
// Uncooked Volume" section (rice, pasta, meat, greens). The SVGs are NOT
// hand-drawn: scripts/volume-viz/ generates them from volumeComparisons.js
// (rigid-body physics pour for rice/pasta, exact-volume procedural 3D for
// meat/greens) -- regenerate with `npm run viz:volume`, never edit the .svg
// files by hand. They're inlined (?raw) rather than <img>-referenced so their
// text picks up the page's loaded Roboto webfont.
//
// Every SVG is drawn at one shared px-per-mm (real kitchen sizes: a 4-cup
// glass jug, a 2-cup jug, a 17 cm plate) and displays at its natural width,
// shrinking only if the column is narrower -- so a pair is always to scale,
// and across pairs the 2-cup jug really reads smaller than the 4-cup.
//
// `reveal`: the pair sits in its own card with a Reset button. The "after"
// figure starts hidden behind a click-to-reveal card (the reader guesses
// first, then checks). The after SVG is always rendered -- just invisible --
// so the reveal card occupies exactly its footprint and nothing shifts.
//
// `caption` is always visible. Wrap the parts that give the answer away in
// square brackets -- "yields about [3 cups] of cooked rice ([1:3] ratio)" --
// in reveal mode they sit under a frosted-glass chip (see Answer) until
// revealed, then show bold.
const SVGS = import.meta.glob('../viz/generated/volume-*.svg', { query: '?raw', import: 'default', eager: true });
const svgFor = (id, which) => SVGS[`../viz/generated/volume-${id}-${which}.svg`];

const SVG_FILL_SX = { flex: 1, minWidth: 0, '& svg': { display: 'block', maxWidth: '100%', height: 'auto', mx: 'auto' } };
// One shared, slow curve for every reveal/reset change in a card (figure,
// reveal card, Reset button, answer chips) so they all move together.
const DURATION = 800;
const EASE = 'cubic-bezier(0.45, 0, 0.25, 1)';
const ease = (...props) => props.map((p) => `${p} ${DURATION}ms ${EASE}`).join(', ');
const NO_MOTION = { '@media (prefers-reduced-motion: reduce)': { transition: 'none' } };

// Fade an element in/out while keeping it mounted, so it never pops. Hidden
// ends as `visibility: hidden` (unfocusable, unclickable) only after the
// fade finishes; showing flips visibility at once so it can take focus.
const fadeSx = (on, ...extraProps) => ({
  opacity: on ? 1 : 0,
  visibility: on ? 'visible' : 'hidden',
  transition: on ? ease('opacity', ...extraProps) : `${ease('opacity', ...extraProps)}, visibility 0s linear ${DURATION}ms`,
  ...NO_MOTION,
});

// "a [b] c" -> ['a ', {answer: 'b'}, ' c']
function parseCaption(caption) {
  return caption.split(/(\[[^\]]+\])/).filter(Boolean).map((part) =>
    part.startsWith('[') ? { answer: part.slice(1, -1) } : part,
  );
}

// Hidden answers sit under a small inline chip: a tinted frosted-glass pane
// (backdrop-filter blur over the real bold text) with a thin border. The
// pane is absolutely positioned (it overhangs the word instead of padding
// it) inside a constant 2px side margin, so the line never reflows; reveal
// fades the pane and un-blurs the text (instant for reduced-motion
// users). The answer is hidden from screen readers until revealed.
function Answer({ text, hidden }) {
  return (
    <>
      <Box
        component="span"
        sx={{
          position: 'relative',
          display: 'inline-block',
          borderRadius: 1,
          // Constant (not state-dependent) room for the chip to clear its
          // neighbours: easing it away on reveal re-wrapped the centered
          // caption mid-reveal, which looked worse than 2px of extra space.
          mx: '2px',
        }}
      >
        <Box
          component="strong"
          aria-hidden={hidden || undefined}
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            userSelect: hidden ? 'none' : 'auto',
            // backdrop-filter only samples inside the pane, so glyph edges
            // near its border stay half-legible -- blur the text itself too.
            filter: hidden ? 'blur(4px)' : 'none',
            transition: ease('filter'),
            ...NO_MOTION,
          }}
        >
          {text}
        </Box>
        <Box
          component="span"
          aria-hidden
          sx={(theme) => ({
            position: 'absolute',
            // Overhang the word rather than padding it (padding would linger
            // as extra space around the revealed answer).
            inset: '-1px -3px',
            borderRadius: 'inherit',
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.45),
            bgcolor: alpha(theme.palette.primary.main, 0.14),
            backdropFilter: 'blur(5px) saturate(140%)',
            WebkitBackdropFilter: 'blur(5px) saturate(140%)',
            // No backdrop-filter support: make the pane opaque instead.
            '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': {
              bgcolor: alpha(theme.palette.primary.main, 0.9),
            },
            opacity: hidden ? 1 : 0,
            pointerEvents: 'none',
            transition: ease('opacity'),
            ...NO_MOTION,
          })}
        />
      </Box>
      {hidden && (
        <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          (hidden until revealed)
        </Box>
      )}
    </>
  );
}

export default function VolumeComparison({ id, reveal = false, revealLabel = 'Tap to see it cooked', caption }) {
  // Fade-in-on-scroll Rule 2/3: a substantial standalone visual block, same
  // escalation as MythFactCard/ComparisonTable.
  const [ref, visible] = useRevealOnScroll();
  const [shown, setShown] = useState(!reveal);
  // Keep keyboard focus somewhere sensible: the reveal card fades out on
  // click (focus -> Reset), and Reset fades out on reset (focus -> reveal card).
  const revealBtnRef = useRef(null);
  const resetBtnRef = useRef(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (!interacted.current) return;
    (shown ? resetBtnRef : revealBtnRef).current?.focus();
  }, [shown]);
  const toggle = (next) => {
    interacted.current = true;
    setShown(next);
  };

  const spec = VOLUME_COMPARISONS.find((s) => s.id === id);
  if (!spec) throw new Error(`VolumeComparison: unknown id "${id}"`);

  const figure = (
    <Stack direction="row" spacing={{ xs: 1, sm: 3 }} sx={{ alignItems: 'flex-end' }}>
      <Box sx={SVG_FILL_SX} dangerouslySetInnerHTML={{ __html: svgFor(id, 'before') }} />
      <ArrowForwardRoundedIcon aria-hidden sx={{ color: 'text.disabled', alignSelf: 'center', flexShrink: 0 }} />
      <Box sx={{ ...SVG_FILL_SX, position: 'relative' }}>
        {/* Cooked figure: fades in while un-blurring and settling from 97%
            scale; the reveal card crossfades out over the same curve. */}
        <Box
          aria-hidden={!shown}
          sx={{
            ...fadeSx(shown, 'filter', 'transform'),
            filter: shown ? 'none' : 'blur(6px)',
            transform: shown ? 'none' : 'scale(0.97)',
          }}
          dangerouslySetInnerHTML={{ __html: svgFor(id, 'after') }}
        />
        {reveal && (
          <ButtonBase
            ref={revealBtnRef}
            onClick={() => toggle(true)}
            // MUI's ripple expands across the whole (large) card, which read as
            // too dramatic; a gentle tint on press, plus a visible keyboard
            // focus ring (the ripple also served as focus feedback), instead.
            disableRipple
            aria-label={`${revealLabel}: ${spec.title}`}
            aria-hidden={shown || undefined}
            tabIndex={shown ? -1 : 0}
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 1.5,
              border: '1px dashed',
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
              flexDirection: 'column',
              gap: 1,
              px: 2,
              color: 'primary.dark',
              pointerEvents: shown ? 'none' : 'auto',
              '&:hover': { bgcolor: 'action.selected' },
              '&:active': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12) },
              '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
              ...fadeSx(!shown),
              // keep the quick hover tint alongside the slow fade
              transition: `${fadeSx(!shown).transition}, background-color 150ms`,
            }}
          >
            <TouchAppRoundedIcon />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {revealLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              What does {spec.before.label} of {spec.before.sublabel} become?
            </Typography>
          </ButtonBase>
        )}
      </Box>
    </Stack>
  );

  const captionEl = caption && (
    <Typography variant="body2" color="text.secondary" aria-live="polite" sx={{ mt: 4, textAlign: 'center', textWrap: 'balance' }}>
      {parseCaption(caption).map((part, i) =>
        typeof part === 'string' ? part : <Answer key={i} text={part.answer} hidden={!shown} />,
      )}
    </Typography>
  );

  if (!reveal) {
    return (
      <Box ref={ref} sx={{ maxWidth: PHOTO_MAX_WIDTH, mx: 'auto', width: '100%', ...revealSx(visible) }}>
        {figure}
        {captionEl}
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      sx={{
        maxWidth: PHOTO_MAX_WIDTH,
        mx: 'auto',
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        px: { xs: 2, sm: 3 },
        pt: 1.5,
        pb: 3,
        ...revealSx(visible),
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5, minHeight: 36 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {spec.title}
        </Typography>
        <Button
          ref={resetBtnRef}
          size="small"
          startIcon={<ReplayRoundedIcon />}
          onClick={() => toggle(false)}
          aria-label={`Reset: ${spec.title}`}
          tabIndex={shown ? 0 : -1}
          sx={fadeSx(shown)}
        >
          Reset
        </Button>
      </Stack>
      {figure}
      {captionEl}
    </Box>
  );
}
