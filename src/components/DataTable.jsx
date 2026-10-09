import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { alpha } from '@mui/material/styles';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

// A general N-column data grid -- for tabular content wider than
// ComparisonTable's fixed 2-data-column (+ optional row label) model, e.g.
// a weekly planner or any other multi-field worksheet. First needed for
// Mod-3-Ch-4's 6-column meal-planner table, which the Figma source itself
// flagged as a stand-in exactly because ComparisonTable couldn't fit it
// (see that component's own "PLACEHOLDER" description on the Figma node).
// Built on real MUI Table components, unlike ComparisonTable's hand-rolled
// Box/Stack grid (which exists specifically to match Figma's 2-column
// component pixel-for-pixel) -- a real <table> is the more appropriate
// semantic/accessible choice for a wider grid, and MUI's actual React Table
// family has no column-count restriction (unlike its Figma-side clone,
// which is hard-capped at 4 TableCell children per row -- see CLAUDE.md).
// Same fade-in-on-scroll treatment as ComparisonTable: every instance is
// inherently a substantial visual block, so it gets its own reveal rather
// than batching with its Section.
export default function DataTable({ columns, rows }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <TableContainer
      ref={ref}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, ...revealSx(visible) }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: (theme) => alpha(theme.palette.divider, 0.15) }}>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: 600 }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
