import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// mb here is the ONLY source of the gap between the hero and whatever comes
// next (every page's first Section overrides its own pt to 0 for exactly
// this reason -- see Section.jsx) -- bumped from 32px to 48px per direct
// user feedback that the hero-to-first-section-title gap read as too tight,
// now matching SECTION_PT/PB's own 48px rhythm so the space after the hero
// reads the same as the space between any two sections.
export default function ChapterHero({ eyebrow, title, intro, imageSrc, imageAlt, placeholderNote }) {
  return (
    <Box sx={{ mb: 6 }}>
      {/* h6 for the correct Roboto SemiBold + wide-tracking + all-caps type
          style (uppercase is baked into the theme's h6 variant), but
          overridden to text.secondary rather than h6's own (much stronger)
          bound color — this eyebrow needs to read as subtle/muted, not as
          a heading in its own right. */}
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        {eyebrow}
      </Typography>
      <Typography variant="h1" sx={{ mt: 1, mb: intro ? 2 : 2.5 }}>
        {title}
      </Typography>
      {intro && (
        <Typography sx={{ fontSize: 18, color: 'text.secondary', maxWidth: 640, mb: 2.5 }}>{intro}</Typography>
      )}
      {imageSrc ? (
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt}
          sx={{ width: '100%', aspectRatio: '604 / 346', objectFit: 'cover', borderRadius: 2, bgcolor: '#ece4d9' }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '604 / 346',
            borderRadius: 2,
            bgcolor: '#ece4d9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: 14,
            px: 3,
          }}
        >
          {placeholderNote}
        </Box>
      )}
    </Box>
  );
}
