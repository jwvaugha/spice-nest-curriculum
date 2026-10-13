import Box from '@mui/material/Box';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

// Hand-approach figure for Module 5 Chapter 1: a hand beside the measuring
// tool it estimates, both real size and to scale. The figures are the user's
// hand-tuned Illustrator files (Chapter Content/Images/Module 5/Chapter 1 -
// .../hand-*.svg), imported with `npm run viz:hands:import`, which namespaces
// their ids/classes so the four inline SVGs don't restyle each other. Edit the
// Chapter Content files, not src/viz/hand/. Starting art: scripts/hand-viz/refstyle/.
// Inlined (?raw) so the ≈ uses the page's Roboto webfont.
const SVGS = import.meta.glob('../viz/hand/hand-*.svg', { query: '?raw', import: 'default', eager: true });

export default function HandComparison({ id }) {
  const [ref, visible] = useRevealOnScroll();
  const svg = SVGS[`../viz/hand/hand-${id}.svg`];
  if (!svg) throw new Error(`HandComparison: unknown id "${id}"`);
  return (
    <Box
      ref={ref}
      sx={{ width: '100%', '& svg': { display: 'block', width: '100%', height: 'auto' }, ...revealSx(visible) }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
