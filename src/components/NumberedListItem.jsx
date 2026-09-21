import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TipExample from './TipExample';
import BulletedList from './BulletedList';
import { TEXT_MAX_WIDTH, LIST_ITEM_PB, LIST_ITEM_CONTENT_PT, LIST_ITEM_CONTENT_GAP } from '../layoutConstants';

const BADGE_SIZE = 32;
const BADGE_GAP = 20; // List Item's own real itemSpacing (badge -> content)

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
  return (
    <Box sx={{ pb: LIST_ITEM_PB }}>
      <Box sx={{ maxWidth: TEXT_MAX_WIDTH, mx: 'auto' }}>
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
            {tip && <TipExample label={tipLabel}>{tip}</TipExample>}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
