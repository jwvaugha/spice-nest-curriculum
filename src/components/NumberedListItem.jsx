import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TipExample from './TipExample';
import BulletedList from './BulletedList';
import { TEXT_MAX_WIDTH, LIST_ITEM_PB, LIST_ITEM_CONTENT_PT, LIST_ITEM_CONTENT_GAP } from '../layoutConstants';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

const BADGE_SIZE = 32;
const BADGE_GAP = 20; // List Item's own real itemSpacing (badge -> content)

// Fade-in-on-scroll Rule 2: a list item only gets its OWN individual reveal
// (escalating out of its parent Section's whole-block batch) when it
// carries a photo -- that's the single "is this a substantial visual
// block worth pausing on" signal, not an item-count threshold. A plain-text
// item (no imageSrc/placeholderNote) renders with no ref/opacity of its own
// at all and just inherits whatever its ancestor Section's fade already
// resolved to -- nesting an unconditional per-item opacity under an
// already-fully-visible Section ancestor would be harmless (CSS opacity
// composes down the tree), but skipping it entirely for text-only items is
// simpler and avoids firing an observer per item for content that was
// never meant to animate individually.
//
// Delay is a light stagger (70ms per position, capped at 5 items' worth)
// so a run of several photo items that happen to enter the viewport
// together cascades in rather than popping in all at once -- capped so a
// very long list's later items don't feel like they're waiting on a queue.
const STAGGER_STEP_MS = 70;
const STAGGER_MAX_STEPS = 5;

// A list item's photo is exactly as wide as its own description
// paragraph — a sibling inside the SAME flex:1 text column, not a
// separately-centered block spanning the whole row (badge included). This
// is deliberately narrower than MythFactCard's image, which is a
// standalone (non-list) block and is allowed to span wider than its own
// text — the width hierarchy signals "this photo belongs to this specific
// list row's text" vs. "this photo stands on its own."
//
// The number badge and the title/description text sit in a normal row,
// both contained INSIDE the same TEXT_MAX_WIDTH box as the section heading
// above them — the whole row (badge + text together) is never wider than
// "the content column," badge indent included. An earlier version instead
// hung the badge outside that box via a negative offset (relying on
// leftover canvas gutter space to its left); that gutter shrinks along with
// the viewport and eventually hits zero, so the badge got clipped by the
// scroll pane's overflowX:hidden on a narrow window — a real bug, not a
// style preference. The badge still reads as "less indented than the
// content" simply because it comes first in the row, before the text.
//
// Title/description/bullets/extra/image/tip stack with a uniform 24px
// rhythm (Figma's real "Item Content Slot" gap + its own 8px top padding),
// via one Stack rather than per-element margins. `bullets` (string array)
// renders a real BulletedList after the description; `extra` is an escape
// hatch for arbitrary nested content (so far: a nested List of its own sub
// List Items — e.g. Mod-3-Ch-2's "Thawing Safety" item containing its own
// "Cold Water Thawing"/"Microwave Thawing" sub-items — deliberately generic
// rather than a `nestedItems` prop, since this is a one-off shape, not
// something worth hardcoding a dedicated API for). `tip` renders a
// TipExample callout (Figma's "Serving Size Examples" pattern) after that.
//
// The outer Box's own `pb: LIST_ITEM_PB` mirrors Figma's real "List Item"
// component, which bakes 24px of its own trailing space into the item
// itself — a SEPARATE value from NumberedList's 40px gap between items
// (the two compose to the real ~64px total, not one number counted twice;
// see layoutConstants.js). This is exactly what "component owns its own
// slot spacing" means: this file is the only place either number lives.
export default function NumberedListItem({ number, title, children, bullets, extra, imageSrc, imageAlt, placeholderNote, tip, tipLabel = 'Serving Size Examples' }) {
  const hasImage = Boolean(imageSrc || placeholderNote);
  // Always called (rules of hooks) -- the hook itself no-ops harmlessly if
  // `ref` never gets attached to a DOM node (the plain-text, no-escalation
  // branch below).
  const [ref, visible] = useRevealOnScroll();
  const revealProps = hasImage
    ? { ref, sx: { maxWidth: TEXT_MAX_WIDTH, mx: 'auto', ...revealSx(visible, Math.min(number - 1, STAGGER_MAX_STEPS) * STAGGER_STEP_MS) } }
    : { sx: { maxWidth: TEXT_MAX_WIDTH, mx: 'auto' } };
  return (
    <Box sx={{ pb: LIST_ITEM_PB }}>
      <Box {...revealProps}>
        <Stack direction="row" spacing={`${BADGE_GAP}px`} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: BADGE_SIZE,
              height: BADGE_SIZE,
              borderRadius: '50%',
              bgcolor: 'action.selected',
              color: 'primary.dark',
              fontFamily: '"Noto Sans", sans-serif',
              fontWeight: 600,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {number}
          </Box>
          <Stack spacing={LIST_ITEM_CONTENT_GAP} sx={{ flex: 1, minWidth: 0, pt: LIST_ITEM_CONTENT_PT }}>
            <Typography variant="h6">{title}</Typography>
            {children && (
              <Typography variant="body2" color="text.secondary">
                {children}
              </Typography>
            )}
            {bullets && <BulletedList items={bullets} />}
            {extra}
            {imageSrc ? (
              <Box
                component="img"
                src={imageSrc}
                alt={imageAlt}
                sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
              />
            ) : placeholderNote ? (
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '16/10',
                  borderRadius: 1.5,
                  border: '1px dashed',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: 12,
                  px: 1.5,
                }}
              >
                {placeholderNote}
              </Box>
            ) : null}
            {/* A tip directly after a full-width photo wants noticeably
                more clearance than TipExample's own default (which is
                tuned for following a line of text) -- per direct user
                feedback, a large photo reads as its own visual block, and
                the badge immediately below it at the default spacing felt
                cramped against it.
                Passing extra spacing via TipExample's own `sx` prop does
                NOT work here, confirmed live: this `Stack`'s `spacing`
                prop applies margin-top to its direct children via a
                `:not(style) ~ :not(style)` sibling-combinator rule, whose
                specificity beats a plain per-instance `sx`-generated
                class, so TipExample's own override was silently discarded
                (computed margin-top stayed 24px regardless of what was
                passed). Wrapping the tip in an extra Box instead sidesteps
                the fight entirely: the Box (not TipExample) is now this
                Stack's direct child and absorbs its 24px as before,
                while TipExample becomes a GRANDCHILD -- no longer a target
                of that rule at all -- so its own default 24px margin
                applies cleanly on top, composing to a real 48px total.
                Only wrapped when there's a preceding image/placeholder; a
                tip following text/bullets stays a direct child and keeps
                the normal 24px default. */}
            {tip &&
              (imageSrc || placeholderNote ? (
                <Box>
                  <TipExample label={tipLabel}>{tip}</TipExample>
                </Box>
              ) : (
                <TipExample label={tipLabel}>{tip}</TipExample>
              ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
