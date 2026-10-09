import { useState, Children } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { REFERENCE_LIST_GAP } from '../layoutConstants';

const PREVIEW_COUNT = 3;
// How tall the fade mask over the last preview card is -- deliberately
// short of the card's own full height (the point is "partially cut off",
// not "fully hidden"). 3-stop gradient (not a plain 2-stop linear fade)
// per direct user feedback that the first version's fade read as too
// subtle: holding the full `action.selected` color for the bottom third of
// the mask (instead of only reaching full opacity exactly at the very last
// pixel) makes the cutoff read as an intentional, visible cue rather than a
// barely-there tint shift.
const FADE_HEIGHT = 64;

// Owns the ENTIRE References block now, not just the card stack -- per
// direct user direction (2026-10-05), the "References" title and the whole
// stack of `<Reference>` cards both sit inside one `action.selected`-tinted
// card (the color individual Reference cards used to be, before that same
// request also flipped them to the lighter `background.default` -- see
// Reference.jsx's own comment). This is why `title` is a prop here now
// instead of being passed to the surrounding `Section` -- Section's own
// title rendering has no card wrapper to put it in, so the page now calls
// `<Section><ReferenceList title="References">...` instead of
// `<Section title="References"><ReferenceList>...`.
//
// Collapse/expand behavior otherwise unchanged: 3 or fewer citations has no
// chrome at all (no count, no icon, no gradient) beyond the card itself;
// more than 3 adds the "N sources" count + rotating expand icon (same
// rotate-180deg-on-expand pattern as ChapterMenuItem/ModuleProgressRow's
// own chevrons) in a header row alongside the title, and the 3rd preview
// card gets the bottom gradient mask while collapsed.
export default function ReferenceList({ title, children }) {
  const items = Children.toArray(children);
  const total = items.length;
  const collapsible = total > PREVIEW_COUNT;
  const [expanded, setExpanded] = useState(false);

  const preview = collapsible ? items.slice(0, PREVIEW_COUNT) : items;
  const rest = collapsible ? items.slice(PREVIEW_COUNT) : [];

  return (
    <Box sx={{ bgcolor: 'action.selected', borderRadius: 2, p: 3 }}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h2">{title}</Typography>
        {collapsible && (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {total} sources
            </Typography>
            <ButtonBase
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={expanded ? 'Show fewer references' : 'Show all references'}
              sx={{ p: 0.5, borderRadius: '50%' }}
            >
              <ExpandMoreRoundedIcon
                fontSize="small"
                sx={{ color: 'text.secondary', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
              />
            </ButtonBase>
          </Stack>
        )}
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <Stack spacing={REFERENCE_LIST_GAP}>
          {preview}
          {collapsible && (
            // No extra top padding/margin here -- the OUTER Stack's own
            // `spacing` already applies a margin-top to this whole Collapse
            // (it's a non-first child of that Stack), giving a normal
            // REFERENCE_LIST_GAP gap before the 4th card. Adding a second
            // top gap here on top of that (an earlier version did, via its
            // own `pt`) silently doubled the gap at exactly this one seam
            // -- a real, user-reported "spacing looks inconsistent" bug,
            // not a one-off visual quirk.
            <Collapse in={expanded}>
              <Stack spacing={REFERENCE_LIST_GAP}>{rest}</Stack>
            </Collapse>
          )}
        </Stack>
        {collapsible && !expanded && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: FADE_HEIGHT,
              background: (theme) =>
                `linear-gradient(to bottom, transparent, ${theme.palette.action.selected} 65%, ${theme.palette.action.selected})`,
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
