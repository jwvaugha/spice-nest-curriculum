import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// A small, non-interactive "preview" of a module that's further down the
// curriculum than the one the learner is currently on -- deliberately NOT a
// smaller ModuleProgressRow. That component's whole point is real progress
// (a progress bar, a chapter count, an expandable chapter list, two
// separate click targets) -- none of which applies here: per direct user
// direction, this is "a preview of what's to come" and should carry no
// extraneous information, isn't clickable, and isn't expandable (the real
// chapter list for any module already lives on the Modules tab). Just a
// thumbnail + module number + title, dimmed.
//
// No tooltip on the individual card -- per direct user direction, that
// explanation belongs ONCE on the section that contains all of these
// (see Home.jsx's "Coming Up" wrapper), not repeated identically on every
// single card in it.
export default function ModulePreviewCard({ moduleNumber, title, thumbSrc }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        opacity: 0.55,
        cursor: 'default',
      }}
    >
      <Box
        component="img"
        src={thumbSrc}
        alt=""
        sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0, display: 'block' }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Module {moduleNumber}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
}
