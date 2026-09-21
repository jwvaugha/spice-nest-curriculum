import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Mirrors Figma's "Design Note (annotation)" pattern — NOT a real Figma
// component (it's hand-styled fresh each time in the source file), so
// these colors were swept directly off a live instance rather than a
// reusable component definition. Distinct from ComparisonTable: a Design
// Note flags content that's fully and correctly built with EXISTING
// components, but whose natural shape would be better served by a
// not-yet-built one — it sits ALONGSIDE real, complete content, never in
// place of missing content. Uses a generic sans-serif stack rather than
// importing Figma's actual Inter — this is a developer-facing annotation,
// not reading content, so a whole extra web font for two short labels
// isn't worth it.
export default function DesignNote({ children }) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: '#bd5116',
        borderRadius: 1,
        bgcolor: '#fff8ee',
        p: 2,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Typography sx={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 11, color: '#924511', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
        Design Note (Claude annotation)
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', fontSize: 12, color: '#664a1a', lineHeight: 1.5 }}>{children}</Typography>
    </Box>
  );
}
