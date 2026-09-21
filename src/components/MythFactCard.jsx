import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PHOTO_MAX_WIDTH, TEXT_MAX_WIDTH } from '../layoutConstants';

// Mirrors Figma's "Paragraph/Headline" pair (Style=Accent for Myth,
// Style=Default for Fact) — text first, then a single large full-width
// photo below it (a vertical stack, not a side-by-side split). Each myth is
// its own standalone block (not a compact list row like NumberedListItem),
// so — unlike a list item's photo — its image is allowed to span wider
// than the text column at PHOTO_MAX_WIDTH.
//
// Labels use the shared `h6` theme style (Roboto SemiBold, +10% tracking,
// all-caps). The Figma source stores "Myth:"/"Fact:" sentence-case, but the
// node's `textCase` renders caps — h6's uppercase transform matches that.
// Statements use the shared `h2` theme style.
const LABEL_SX = { color: 'text.secondary', display: 'block' };

export default function MythFactCard({ myth, fact, detail, imageSrc, imageAlt }) {
  return (
    <Box>
      <Box sx={{ maxWidth: TEXT_MAX_WIDTH, mx: 'auto' }}>
        <Typography variant="h6" sx={LABEL_SX}>Myth:</Typography>
        <Typography variant="h2" sx={{ color: 'primary.dark', mb: 0.5 }}>
          {myth}
        </Typography>
        <Typography variant="h6" sx={{ ...LABEL_SX, mt: 1.5 }}>Fact:</Typography>
        <Typography variant="h2" sx={{ mb: 1.25 }}>
          {fact}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {detail}
        </Typography>
      </Box>
      <Box
        component="img"
        src={imageSrc}
        alt={imageAlt}
        sx={{ width: '100%', maxWidth: PHOTO_MAX_WIDTH, display: 'block', mx: 'auto', mt: 2.5, aspectRatio: '604/346', objectFit: 'cover', borderRadius: 2 }}
      />
    </Box>
  );
}
