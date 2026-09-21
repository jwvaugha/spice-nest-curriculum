import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Link } from 'react-router-dom';

// Figma's Content Nav Footer sits as a SIBLING of the (fixed-height,
// internally-scrolling) Content Panel — always visible below it, not
// something you only reach by scrolling all the way to the end of a long
// chapter. The page shells (Module2Chapter2.jsx etc.) reproduce that by
// putting this as a flex-shrink-0 row after the scrollable body, inside the
// same fixed-height column as the body — never inside the scrollable area
// itself.
//
// The button is right-aligned against the FULL content-panel width (the
// bar's own padding), not nested inside a second maxWidth:872 wrapper that
// would pin it to the reading column's right edge — a real bug fixed here:
// on a wide viewport the button used to stop well short of the panel's true
// right edge, reading as misaligned against everything else in the shell
// (Sidebar/GlobalHeader both span their full available width).
//
// `label` defaults to Figma's "Continue to Next Chapter", but a page can
// override it — used for a module's last built chapter ("Continue to Next
// Module") and for the very last chapter of the whole course ("Back to
// Dashboard"), so the label always says where the button actually goes
// instead of a generic string covering every destination.
//
// `reachedEnd` (from useReachedEnd, driven by the page's own scroll pane)
// switches the button from outlined to filled once the reader has actually
// scrolled to the bottom and lingered there — per direct user direction,
// clicking through early is still allowed (the button stays fully clickable
// either way, "still active" in the outlined state, not disabled), it just
// doesn't visually read as "done" yet. Completion itself (markChapterViewed)
// is fired by useReachedEnd directly, not by clicking this button — see
// useReachedEnd.js for why that's no longer a click-triggered thing.
export default function ChapterFooter({ to, chapterId, label = 'Continue to Next Chapter', reachedEnd = false }) {
  return (
    <Box sx={{ flexShrink: 0, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', px: 4, py: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        component={Link}
        to={to}
        variant={reachedEnd ? 'contained' : 'outlined'}
        color="primary"
        disableElevation
        endIcon={<ChevronRightRoundedIcon />}
        sx={{
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontSize: 13,
          fontWeight: 600,
          px: 3,
          py: 1,
          transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
        }}
      >
        {label}
      </Button>
    </Box>
  );
}
