import Box from '@mui/material/Box';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link } from 'react-router-dom';
import { HEADER_HEIGHT } from '../layoutConstants';

// The divider strip under the global nav spans the full page width (like the
// AppBar above it) — only the clickable text inside it is inset to line up
// with the content column below. An earlier version put this inside the
// same `Container` as the page body, which capped the divider at the
// content column's width instead of running edge to edge.
//
// The inset itself is a fixed px value (matching MUI Toolbar's own default
// horizontal gutters -- 16px below `sm`, 24px at `sm` and up, the same
// padding GlobalHeader's Toolbar uses), NOT a `Container maxWidth="lg"` --
// Container centers itself and caps at ~1200px, so on any viewport wider
// than that its left edge drifts rightward away from the true screen edge
// as the window grows, while GlobalHeader's logo (inside an uncapped
// Toolbar) stays put. That mismatch read as the back link "moving" relative
// to everything else in the header on a wide window. A fixed px inset pins
// it to the real left edge at every width, matching GlobalHeader exactly.
//
// Sticky, stacked directly under GlobalHeader (also sticky) — `top` is
// GlobalHeader's own height so this bar rests flush beneath it instead of
// overlapping. Needs an explicit opaque bgcolor since it's no longer
// scrolling away with the page content behind it.
export default function DashboardBackLink() {
  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        position: 'sticky',
        top: HEADER_HEIGHT,
        zIndex: (theme) => theme.zIndex.appBar - 1,
        display: 'flex',
        alignItems: 'center',
        height: 48,
      }}
    >
      {/* Goes to Home ("/"), not the Modules list -- per direct user
          direction, leaving a chapter should return to the same "Up Next"/
          "Get Started" splash screen a learner would land on fresh, not the
          full Modules list (that's still reachable from there, or via the
          NestNavSwitcher dropdown, in one more click). */}
      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: 'primary.dark',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          width: 'fit-content',
          px: { xs: 2, sm: 3 },
        }}
      >
        <KeyboardBackspaceRoundedIcon fontSize="small" />
        NEST Home
      </Box>
    </Box>
  );
}
