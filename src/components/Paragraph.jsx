import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LABELED_PARAGRAPH_GAP } from '../layoutConstants';

// Mirrors Figma's "Paragraph/Body Normal" component, including its
// optional internal "Section Label" (Show Label toggle) — a genuine
// single-paragraph "label + body" chunk (e.g. "Day 1" / "Cook roasted
// chicken...") is ONE component instance with its OWN internal 12px gap
// between label and body, confirmed directly on the Figma node (the label
// text is a child of the SAME Paragraph/Body Normal instance as the body
// text, not a separate H6 Subtitle sibling). Getting this distinction
// right matters: a label+body pair uses this tighter 12px internal gap,
// while an actual section heading (H6 Subtitle) followed by its own
// paragraph are two separate Content Slot children and get the wider
// uniform 32px Section gap instead (see Section.jsx) — don't reach for
// this component for that case.
//
// With no `label`, this is just a plain paragraph — equivalent to using
// `<Typography>` directly, kept for the cases where the Figma source
// genuinely used a Paragraph/Body Normal instance with Show Label=false.
export default function Paragraph({ label, color, children }) {
  if (!label) {
    return <Typography color={color}>{children}</Typography>;
  }
  return (
    <Stack spacing={LABELED_PARAGRAPH_GAP}>
      <Typography variant="h6">{label}</Typography>
      <Typography color={color}>{children}</Typography>
    </Stack>
  );
}
