import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

const LABEL_WIDTH = 160;

// Mirrors the real Figma "Comparison Table" / "Comparison Table Row"
// components (Nest V2, Utilities section, built 2026-09-21) -- replaces the
// old dashed-orange "Comparison Table (Placeholder)" stand-in now that a
// real 2-column table exists on both sides. A header row (tinted with the
// divider color at 15% opacity, matching the real Figma header band) above
// N rows, auto-growing to any row count.
//
// `showRowLabel` turns on the shared per-row label column (e.g. Amount /
// When to Add / Cooking Tip -- Herbs & Spices) -- each row then needs its
// own `label`. Leave it off for a plain paired list (e.g. Cooking Method /
// Examples) where rows carry no shared attribute name.
export default function ComparisonTable({ columnAHeader, columnBHeader, showRowLabel = false, rows }) {
  return (
    // overflowX: 'auto' is a narrow-viewport safety net -- the label column
    // plus two flex:1 data columns can only shrink so far before real
    // content (e.g. a full sentence per cell) gets uncomfortably cramped;
    // this lets the table scroll horizontally within its own box instead of
    // squeezing the page or wrapping every word, without changing anything
    // about how it looks at a normal content-column width.
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', overflowX: 'auto' }}>
      <Stack direction="row" sx={{ bgcolor: (theme) => alpha(theme.palette.divider, 0.15), minWidth: 480 }}>
        {showRowLabel && <Box sx={{ width: LABEL_WIDTH, flexShrink: 0, px: 2, py: 1.5 }} />}
        <Box sx={{ flex: 1, minWidth: 0, px: 2, py: 1.5 }}>
          <Typography variant="h6">{columnAHeader}</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, px: 2, py: 1.5 }}>
          <Typography variant="h6">{columnBHeader}</Typography>
        </Box>
      </Stack>
      {rows.map((row, i) => (
        <Stack
          key={i}
          direction="row"
          sx={{ minWidth: 480, ...(i < rows.length - 1 ? { borderBottom: '1px solid', borderColor: 'divider' } : null) }}
        >
          {showRowLabel && (
            <Box sx={{ width: LABEL_WIDTH, flexShrink: 0, px: 2, py: 1.5 }}>
              <Typography variant="h6">{row.label}</Typography>
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0, px: 2, py: 1.5 }}>
            <Typography variant="body1">{row.a}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, px: 2, py: 1.5 }}>
            <Typography variant="body1">{row.b}</Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  );
}
