import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Mirrors Figma's "Tip-Example" component (id 3072:13123, aka
// Example-Card-Header-V2): a yellow example/tip card with a small
// overlapping "type" badge pill at its top-left edge. Figma's own version
// is a State=Collapsed/Expanded variant set with a hidden detail panel;
// per established convention (see CLAUDE.md), every instance built so far
// ships collapsed with no detail content to reveal, so this only
// implements the flat header bar — no expand affordance, since there's
// nothing behind it to expand into.
export default function TipExample({ label = 'Tip', children }) {
  return (
    <Box sx={{ position: 'relative', mt: 1.5 }}>
      <Box sx={{ bgcolor: '#fef3c7', borderRadius: 2, pt: 3, pb: 2, px: 2 }}>
        <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontWeight: 700, fontSize: 16, color: 'text.primary', letterSpacing: '0.0125em' }}>
          {children}
        </Typography>
      </Box>
      <Box sx={{ position: 'absolute', top: -12, left: 8, bgcolor: '#d97706', color: '#fff', borderRadius: 1, px: 1, py: 0.5 }}>
        <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
