import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { TEXT_MAX_WIDTH } from '../layoutConstants';

// A bare MUI <Divider /> between two Sections spans its actual parent -- the
// HERO_WIDTH canvas -- which reads wider than the Section's own internal
// content column (Section caps itself at TEXT_MAX_WIDTH and centers, so
// every heading/paragraph/list above and below the divider is narrower than
// it). This wraps the divider in that same maxWidth/centered box so it lines
// up with the actual text column instead of the wider hero. `width: '100%'`
// alongside `maxWidth` is what makes it correctly go edge-to-edge on a
// narrow viewport (once the canvas itself shrinks below TEXT_MAX_WIDTH,
// there's no "hero width" to overshoot in the first place) rather than a
// fixed 600px divider stranded inside a now-narrower column.
export default function SectionDivider() {
  return (
    <Box sx={{ maxWidth: TEXT_MAX_WIDTH, width: '100%', mx: 'auto' }}>
      <Divider />
    </Box>
  );
}
