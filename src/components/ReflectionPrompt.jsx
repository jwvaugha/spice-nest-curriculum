import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { asset } from '../assetPath';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

// The prompt card at the top of a module reflection page (Figma "Frame 521"
// in the notebook-style Mod-N-Reflection frames): a journaling photo beside
// a short lead-in and the prompt itself in large Vollkorn. Figma values:
// SPICE-Edu-Neutral-A/25 card (action.selected), 16px radius, 32/32/32/24
// padding, 40px gap, 333x234 photo, 14px Medium lead-in, 28px SemiBold
// prompt. The two halves wrap onto separate rows when the column is too
// narrow for both, instead of keying off a window breakpoint.
//
// `promptId` lets the notebook below label itself with the prompt text.
export default function ReflectionPrompt({
  prompt,
  promptId,
  lead = 'Take a moment to reflect on what you just learned.',
  imageSrc = asset('/images/reflection/journal.jpg'),
  imageAlt = 'A person writing in a notebook',
}) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 5,
        bgcolor: 'action.selected',
        borderRadius: 2,
        pt: 4,
        pr: 4,
        pb: 4,
        pl: 3,
        ...revealSx(visible),
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={imageAlt}
        sx={{ flex: '1 1 260px', maxWidth: 333, aspectRatio: '333 / 234', objectFit: 'cover', borderRadius: 2, display: 'block' }}
      />
      <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1.5 }}>
          {lead}
        </Typography>
        <Typography
          id={promptId}
          component="h2"
          sx={(theme) => ({
            fontFamily: theme.typography.h2.fontFamily,
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.32,
            letterSpacing: '-0.5px',
            color: 'text.primary',
          })}
        >
          {prompt}
        </Typography>
      </Box>
    </Box>
  );
}
