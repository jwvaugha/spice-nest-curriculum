import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { HERO_WIDTH, SECTION_PT, SECTION_PB, SECTION_TITLE_GAP, SECTION_CONTENT_INDENT } from '../layoutConstants';

// Distance from the scroll pane's own top edge before a sticky `aside`
// catches and holds -- a little breathing room rather than jamming it
// flush against the edge the instant it would otherwise scroll off.
// Exported so an `aside` that needs to cap its own height (e.g.
// NutritionLabelCard, see NutritionLabelExplorer.jsx) can compute against
// the SAME offset this component actually sticks at, rather than a
// separately-guessed number that could drift out of sync. An earlier
// version of this file also exported a composite `STICKY_CHROME_OFFSET`
// (this + assumed HEADER_HEIGHT/BACKLINK_HEIGHT constants) for that same
// purpose -- removed after it caused a real, user-reported bug: the
// assumption baked into those constants didn't always match the REAL
// rendered position of the scroll pane's own top edge, so a height-capped
// aside could still get clipped. The fix was to measure the scroll pane's
// actual position directly via the DOM at runtime instead of computing it
// from constants -- see NutritionLabelExplorer.jsx's own measurement
// effect for the current approach.
export const STICKY_TOP = 16;

// Shared layout for any chapter "interactive" that pairs a compact,
// always-on-screen CONTROL (a clickable label, a diagram, a selector --
// something small enough to stay put) with a longer scrolling EXPLANATION
// beside it, where clicking the control should feel like it's staying in
// place while the reader scrolls through the matching text. First built for
// Module 1 Ch 3's nutrition label (see NutritionLabelExplorer.jsx) but
// deliberately generic -- any future interactive wanting this same
// "sticky control, scrolling explanation" shape reuses this rather than
// re-deriving the layout per page.
//
// Wider than `Section`'s own TEXT_MAX_WIDTH reading column on purpose: a
// real side-by-side layout needs room for both panes at once, which 600px
// doesn't have. Reuses HERO_WIDTH (the SAME cap the chapter hero/every
// other Section already center against) rather than inventing a new width
// constant, so this reads as aligned with the rest of the page, not its own
// oddly-sized island. Mirrors `Section`'s own pt/pb/title-gap/content-indent
// numbers directly (not wrapped IN a `Section`, since `Section` hard-caps at
// TEXT_MAX_WIDTH) so a page switching between the two still reads as one
// consistent rhythm.
//
// `position: 'sticky'` needs no JS at all here -- it sticks against
// whichever scrollable ancestor it's actually inside (this app's chapter
// pages all have exactly one, the page's own `paneRef` scroll pane), and
// un-sticks automatically once the row's own bottom edge (driven by
// `children`'s height) scrolls past, no manual "end of sticky region"
// bookkeeping required. Only active at `md` and up -- below that, the aside
// stacks above the content instead (both centered), since there isn't
// enough width for a side-by-side layout to make sense at all, so
// stickiness would just be pinning something to a spot with nothing next to
// it.
export default function StickyAsideSection({ id, title, aside, asideWidth = 280, children, sx }) {
  return (
    <Box id={id} component="section" sx={{ pt: SECTION_PT, pb: SECTION_PB, ...sx }}>
      <Box sx={{ maxWidth: HERO_WIDTH, mx: 'auto' }}>
        <Stack spacing={SECTION_TITLE_GAP}>
          {title && <Typography variant="h2">{title}</Typography>}
          {/* `alignItems` as a direct prop is a known MUI v9 no-op on
              `Stack` (silently leaks onto the DOM as an invalid attribute
              instead of applying -- see CLAUDE.md's own MUI v9
              gotchas) -- MUST go through `sx` instead. Getting this wrong
              here isn't just a cosmetic miss: without a real
              `align-items: flex-start`, this row's default `stretch`
              forces the aside box to match its much taller sibling's full
              height, which means `position: sticky` has no room to
              actually detach from the flow -- confirmed live, the label
              scrolled in exact lockstep with the page instead of holding
              in place. */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ alignItems: 'flex-start', pl: SECTION_CONTENT_INDENT }}>
            <Box
              sx={{
                width: { xs: '100%', md: asideWidth },
                flexShrink: 0,
                position: { md: 'sticky' },
                top: { md: STICKY_TOP },
              }}
            >
              {aside}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>{children}</Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
