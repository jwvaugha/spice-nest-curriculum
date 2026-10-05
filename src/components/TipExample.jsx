import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Mirrors Figma's "Tip-Example" component (id 3072:13123, aka
// Example-Card-Header-V2): an example/tip card with a small overlapping
// "type" badge pill at its top-left edge -- originally the exact bright
// yellow Figma's own component uses, recolored to a subtle neutral per
// direct user feedback (see the card's own `bgcolor` comment below).
// Figma's own version is a State=Collapsed/Expanded variant set with a
// hidden detail panel; per established convention (see CLAUDE.md), every
// instance built so far ships collapsed with no detail content to reveal,
// so this only implements the flat header bar — no expand affordance,
// since there's nothing behind it to expand into.
export default function TipExample({ label = 'Tip', children, sx }) {
  return (
    // `mt` bumped from 1.5 (12px) to 3 (24px) -- the badge below sits at
    // `top: -12`, overhanging 12px above this box's own top edge, which
    // meant the OLD margin exactly canceled out that overhang: the badge's
    // top landed flush against whatever content preceded it, with zero
    // real visual gap. This leaves a real ~12px of breathing room above
    // the badge instead. `sx` is a generic escape hatch for a caller that
    // isn't nested inside something that already injects its own
    // margin-top on this element (a `Stack`'s own `spacing` prop does
    // exactly that to its direct children, and its sibling-combinator CSS
    // rule beats a plain per-instance `sx` class on specificity -- see
    // NumberedListItem.jsx's own comment on its `tip` rendering for a case
    // that hit this and used a wrapping Box instead, not this prop).
    <Box sx={{ position: 'relative', mt: 3, ...sx }}>
      {/* `action.hover` -- a subtle warm-neutral tint (rgba(184,135,91,0.08),
          itself a tint of Global/iconHover per theme.js) -- replaces the
          original Figma-matched bright yellow (#fef3c7) per direct user
          feedback. Reuses the SAME token this exact tool's own "Daily
          Value" callout (NutritionLabelExplorer.jsx) already sits on, and
          the same one every hover state across this app uses, rather than
          a newly-invented neutral -- so this card reads as "part of this
          app's own subtle-neutral callout language," not its own
          one-off color. */}
      <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, pt: 3, pb: 2, px: 2 }}>
        {/* Smaller and NOT tracked out -- per direct user feedback, this
            is body copy (a tip/caveat/condition note), not a display
            heading, so it shouldn't read as large or as widely spaced as
            one. Dropped from 16px/+0.0125em to 13px/normal tracking. */}
        <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontWeight: 700, fontSize: 13, color: 'text.primary' }}>
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
