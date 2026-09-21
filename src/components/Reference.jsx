import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import { LINE_HEIGHT_SCALE } from '../theme';

const URL_RE = /(https?:\/\/[^\s]+)/g;

// Splits a citation string into plain text + real, clickable <Link> nodes
// for any http(s) URL found inside it. Trailing sentence punctuation
// (a period closing the citation, a comma, a closing paren) is kept OUT of
// the link and rendered as plain text after it, so "...medications." isn't
// swallowed into the href.
function renderWithLinks(text) {
  const nodes = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = URL_RE.exec(text)) !== null) {
    let url = match[0];
    const trailing = url.match(/[.,;:)\]]+$/);
    let trail = '';
    if (trailing) {
      trail = trailing[0];
      url = url.slice(0, -trail.length);
    }
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <MuiLink
        key={key++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        underline="always"
        sx={{ color: 'primary.dark', fontWeight: 500, wordBreak: 'break-word' }}
      >
        {url}
      </MuiLink>,
    );
    if (trail) nodes.push(trail);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

// Mirrors Figma's "Reference" component (id 3182:14767): a single card —
// SPICE-Edu-Neutral-A/25 fill, 16px corner radius, 16px padding, Roboto
// Regular 16px/150%/+0.15px tracking in Global/textPrimary — holding one
// citation. Figma's own version is static text; this adds the one thing a
// static design can't: any http(s) URL inside the citation renders as a
// real, visually distinct, clickable link instead of plain unstyled text.
// Line-height is Figma's 150% scaled by the same LINE_HEIGHT_SCALE every
// other paragraph element uses (this is a plain Box, not a Typography
// variant, so it doesn't inherit body1's theme value automatically).
//
// Standard element for every References section going forward — replaces
// the old plain `<ul><li>` bullet-point rendering used before this existed.
export default function Reference({ children }) {
  return (
    <Box
      sx={{
        bgcolor: 'action.selected',
        borderRadius: 2,
        p: 2,
        fontSize: '0.75rem', // 12px, down from Figma's literal 16px per user direction — citation text reads fine smaller than body copy
        lineHeight: 1.5 * LINE_HEIGHT_SCALE,
        letterSpacing: '0.15px',
        color: 'text.primary',
      }}
    >
      {renderWithLinks(children)}
    </Box>
  );
}
