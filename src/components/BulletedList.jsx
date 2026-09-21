import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const DOT_SIZE = 5;
const DOT_GAP = 12;

// A previous version of this component computed the dot's vertical offset
// by hand from theoretical font metrics (line-height * font-size math) and
// positioned it as a flex sibling of the text. That approach is inherently
// approximate -- it assumes a specific font's real ascent/descent/cap-height
// ratios, which the browser's actual rendering (font substitution,
// hinting, OS text rendering) doesn't have to match -- and it kept reading
// as slightly misaligned in practice even after being tuned once already.
//
// This instead uses the dot as an INLINE element (a `span` living inside the
// paragraph's own text flow, not a flex sibling) with `verticalAlign:
// 'middle'`, which is the browser's own native mechanism for centering an
// inline-block against the surrounding text's line box -- correct by
// construction, not by our own arithmetic, and immune to whatever
// LINE_HEIGHT_SCALE or font actually ends up rendering. The hanging indent
// for wrapped lines (so line 2+ starts under the text, not under the dot)
// comes from the classic `padding-left` + negative `text-indent` pairing:
// text-indent only affects the first line, pulling the dot+first-line-start
// back to the left edge, while padding-left governs every other line.
function BulletedListItem({ children }) {
  return (
    <Typography
      variant="body1"
      component="div"
      sx={{
        letterSpacing: '0.15px',
        pl: `${DOT_SIZE + DOT_GAP}px`,
        textIndent: `-${DOT_SIZE + DOT_GAP}px`,
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: '50%',
          bgcolor: 'text.primary',
          verticalAlign: 'middle',
          mr: `${DOT_GAP}px`,
        }}
      />
      {children}
    </Typography>
  );
}

// Mirrors Figma's "Bulleted List" component — the real bullet-point
// component (distinct from the numbered `List`/`NumberedListItem`), first
// needed for Mod-3-Ch-2. Never approximate a real bulleted list with a raw
// HTML `<ul>` going forward now that this exists.
export default function BulletedList({ items }) {
  return (
    <Stack spacing={1.5}>
      {items.map((item, i) => (
        <BulletedListItem key={i}>{item}</BulletedListItem>
      ))}
    </Stack>
  );
}
