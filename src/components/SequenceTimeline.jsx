import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const MARKER_SIZE = 36;
const MARKER_COL_WIDTH = 40;

// Mirrors the real Figma "Sequence Timeline" + "Sequence Step" components
// (Nest V2, Lists section, built 2026-09-21): a numbered circular marker
// connected by a line, paired with a title/description, for genuinely
// sequential "do X, then Y, then Z" content -- a recommended order, a short
// process, a before/after chain. NOT for a flat set of independent items
// (that's NumberedList) or two non-paired lists (that's TwoColumnList).
//
// `eyebrow` is optional -- omit it when the Section title already says what
// the sequence is (redundant otherwise), matching the two real Figma
// applications that turned it off (Motivational Interviewing's "Four
// Processes", the grocery-ordering steps).
export default function SequenceTimeline({ eyebrow, steps }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper', p: 2.5 }}>
      <Stack spacing={2}>
        {eyebrow && <Typography variant="overline" color="text.secondary">{eyebrow}</Typography>}
        <Stack spacing={0}>
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              // alignItems: 'stretch' (not 'flex-start') is the fix here: the
              // marker column now stretches to match the text column's real
              // height (title + a possibly-multi-line description), instead
              // of the connector line being a fixed MARKER_SIZE px regardless
              // of how tall the row actually is. That fixed height was the
              // bug -- any step whose description wrapped past one line left
              // the line stopping well short of (or running past) the next
              // marker, reading as badly misaligned.
              <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'stretch' }}>
                {/* alignItems as an sx key, not a direct prop -- this MUI v9
                    app dropped Stack's direct alignItems/justifyContent
                    props (they silently no-op instead of erroring), and this
                    was the actual remaining bug: without real centering, the
                    circle and connector line sat flush-left in their column
                    instead of sharing a center, so the line ran down the
                    wrong side of the circle no matter how correct the
                    vertical flex:1 sizing above was. */}
                <Stack spacing={0.5} sx={{ alignItems: 'center', width: MARKER_COL_WIDTH, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: MARKER_SIZE,
                      height: MARKER_SIZE,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontFamily: '"Noto Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Box>
                  {/* flex: 1 (not a fixed height) grows to fill exactly the
                      remaining space in the now-stretched marker column, so
                      its bottom edge always lands at this row's own bottom
                      edge -- which, since the row Stack has zero spacing and
                      the gap between steps lives entirely in the text
                      column's own `pb`, is exactly the top edge of the next
                      marker. minHeight guards the pathological case of a
                      one-line step whose text column is barely taller than
                      the marker itself. */}
                  {!isLast && <Box sx={{ width: 2, flex: 1, minHeight: 12, bgcolor: 'divider' }} />}
                </Stack>
                <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 3 }}>
                  <Typography variant="h6">{step.title}</Typography>
                  <Typography variant="body1">{step.description}</Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
