import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  TEXT_MAX_WIDTH,
  SECTION_PT,
  SECTION_PB,
  SECTION_TITLE_GAP,
  SECTION_CONTENT_INDENT,
  SECTION_CONTENT_GAP,
} from '../layoutConstants';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

// Mirrors Figma's "Section (Slot)" component exactly — the whole point of a
// Figma "slot" component is that it OWNS its internal gap/padding so every
// instance stays in sync automatically; this is the React equivalent. A
// page never hand-picks its own spacing between a heading and the
// paragraph under it, or between two paragraphs, or a paragraph and a
// list — it just drops content in as children, and this component spaces
// them at Figma's real, uniform 32px Content Slot gap. Changing that
// number happens ONCE, here, and propagates to every section on every page
// — never by editing page-level `mb`/`spacing` values again.
//
// `title` is optional — a chapter whose body is one flat list with no
// distinct titled sub-sections (e.g. Mod-1-Ch-2's Food Groups) omits it,
// matching the established "Section Title visible=false" convention; the
// sidebar's own section-nav entry still names it independently.
// `sx` is an escape hatch for the one legitimate per-instance override this
// component needs: the first section in a chapter's body typically wants
// `pt: 0` since ChapterHero already contributes its own trailing margin.
// `contentGap` is a second, narrower escape hatch: a References section
// holds nothing but a dense run of short Reference cards, which reads better
// at a tighter rhythm than the general 32px between-any-content-child gap
// (see REFERENCE_LIST_GAP) -- everything else keeps the default.
export default function Section({ id, title, children, sx, contentGap = SECTION_CONTENT_GAP }) {
  // Whole-section reveal (fade-in-on-scroll Rule 1): everything inside one
  // Section -- heading, paragraphs, short lists, Reference/TipExample/
  // DesignNote callouts -- fades in together as a single block the moment
  // any part of it scrolls into view, rather than each piece animating on
  // its own. The ref/opacity lives on this INNER box, not the outer
  // `id`-bearing one, so a sidebar deep-link's `scrollIntoView` against the
  // outer section element is unaffected by the inner fade state.
  const [ref, visible] = useRevealOnScroll();
  return (
    <Box id={id} component="section" sx={{ pt: SECTION_PT, pb: SECTION_PB, ...sx }}>
      <Box ref={ref} sx={{ maxWidth: TEXT_MAX_WIDTH, mx: 'auto', ...revealSx(visible) }}>
        <Stack spacing={SECTION_TITLE_GAP}>
          {title && <Typography variant="h2">{title}</Typography>}
          <Box sx={{ pl: SECTION_CONTENT_INDENT }}>
            <Stack spacing={contentGap}>{children}</Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
