import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BulletedList from './BulletedList';

// Mirrors the real Figma "Two-Column List" component (Nest V2, Layout &
// Structure section, built 2026-09-21): two independently-headed
// BulletedLists side by side, for content that reads as two related-but-
// not-paired lists (e.g. "what to buy in bulk" / "what to avoid") -- the
// item counts may coincidentally match, but item 1 in column A has no
// relationship to item 1 in column B. If items genuinely pair up one-to-one,
// use ComparisonTable instead. Wraps to a single stacked column on narrow
// viewports via flexWrap, same as the Figma source.
//
// Per-column min-width was originally 260px, tuned only against this
// component's own top-level Section usage (580px available). That's too
// wide once this is used inside a NumberedListItem's `extra` slot (Mod-3-Ch-2
// "Thawing Safety") -- badge + badge-gap there eat ~52px, leaving only
// ~528px, and 2 * 260px + the 24px row gap (544px) doesn't fit, so it
// silently wrapped to a second row instead of sitting side by side. 200px
// leaves real headroom in every context this component is actually used in
// (top-level and nested) while still wrapping on a genuinely narrow
// viewport, rather than being tuned to exactly one call site's width.
//
// `description` is an optional per-column lead-in line (body2, muted --
// matches NumberedListItem's own description styling), for a column whose
// header needs a short one-line gloss before its steps (e.g. "Cold Water
// Thawing" vs. "Microwave Thawing" -- one method has a caveat worth calling
// out, the other doesn't, so this is deliberately per-column, not a shared
// prop above both columns).
export default function TwoColumnList({ columns }) {
  return (
    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
      {columns.map((col, i) => (
        <Box key={i} sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Stack spacing={1.5}>
            <Typography variant="h6">{col.header}</Typography>
            {col.description && (
              <Typography variant="body2" color="text.secondary">
                {col.description}
              </Typography>
            )}
            <BulletedList items={col.items} />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
