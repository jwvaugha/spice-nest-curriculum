import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import { Link } from 'react-router-dom';
import { useViewedChapters } from '../hooks/useViewedChapters';

// Mirrors Figma's "Module Progress Row" component, generalized to every
// module (originally only Module 2 had a working expand/collapse chapter
// list here; every module gets it now). Progress is computed live from
// `chapters` (see moduleData.js) crossed with real "viewed" state, not typed
// in by hand -- this is what makes the completion bar/count/checkmark
// accurate as pages get built and chapters get visited, instead of a static
// number someone has to remember to update.
//
// Click model (reworked twice per direct user feedback): the WHOLE module --
// thumbnail, title, progress, all the surrounding whitespace -- navigates
// straight to the module's first built chapter, since "accessing the
// module" should never be contingent on hitting a specific 96px image. Only
// the narrow right-hand zone (the complete checkmark + chevron) toggles the
// chapter list open/closed instead of navigating. Those two zones are still
// two separate click targets under the hood (an `<a>` can't nest inside a
// `<button>`, so it's two sibling `ButtonBase`s, not one), but they are
// NOT separately hoverable -- the hover highlight lives on the shared outer
// container so the whole row lights up as one piece no matter which zone
// the pointer is over, rather than reading as two independent buttons side
// by side.
export const CHAPTER_LIST_INDENT = 13; // 104px: aligns each chapter row's
// icon with the module title text's own left edge (the thumbnail now sits
// flush left with no row padding of its own + the 96px thumbnail + the
// row's 16px gap = 112px; ListItemButton below still contributes its own
// 8px px, so List itself only needs 104px).
export default function ModuleProgressRow({ moduleNumber, title, thumbSrc, chapters, expanded, onToggle }) {
  const { isViewed } = useViewedChapters();
  const chaptersTotal = chapters.length;
  const chaptersComplete = chapters.filter((c) => isViewed(c.chapterId)).length;
  const pct = chaptersTotal ? Math.round((chaptersComplete / chaptersTotal) * 100) : 0;
  const complete = chaptersTotal > 0 && chaptersComplete === chaptersTotal;
  const firstBuilt = chapters.find((c) => c.to);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={0}
        sx={{
          alignItems: 'stretch',
          borderRadius: 2,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <ButtonBase
          {...(firstBuilt ? { component: Link, to: firstBuilt.to } : { component: 'div' })}
          focusRipple={Boolean(firstBuilt)}
          disableRipple={!firstBuilt}
          sx={{
            flex: 1,
            minWidth: 0,
            justifyContent: 'flex-start',
            textAlign: 'left',
            gap: 2,
            py: 1.75,
            pl: 0,
            pr: 2,
            cursor: firstBuilt ? 'pointer' : 'default',
          }}
        >
          {/* No left padding here (unlike the row's other edges) so the
              thumbnail's own left edge lands flush with the "Modules"
              heading above it and the container's true left edge, per
              direct user direction — everything else in the row keeps its
              padding, only the image is pulled out to the edge. */}
          <Box component="img" src={thumbSrc} alt="" sx={{ width: 96, height: 96, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0, display: 'block' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Module {moduleNumber}
            </Typography>
            <Typography variant="h3" sx={{ color: 'text.primary', mb: 1.25 }}>
              {title}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{ width: 155, height: 4, borderRadius: 2, bgcolor: 'divider', mb: 0.75 }}
            />
            <Typography variant="caption" color="text.secondary">
              {String(chaptersComplete).padStart(2, '0')}/{chaptersTotal} Chapters Complete
            </Typography>
          </Box>
        </ButtonBase>

        <ButtonBase
          onClick={onToggle}
          focusRipple
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            px: 2.5,
            cursor: 'pointer',
          }}
        >
          {complete && <CheckCircleRoundedIcon sx={{ color: '#4c9d5f', mr: 1 }} />}
          <ExpandMoreRoundedIcon
            sx={{
              color: 'text.disabled',
              transform: expanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </ButtonBase>
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List disablePadding sx={{ pl: CHAPTER_LIST_INDENT, pb: 2.5 }}>
          {chapters.map((ch) => {
            const ChapterIcon = ch.type === 'video' ? VideocamRoundedIcon : DescriptionRoundedIcon;
            return (
            <ListItemButton
              key={ch.chapterId}
              component={ch.to ? Link : 'div'}
              to={ch.to || undefined}
              sx={{ py: 1.25, px: 1, borderRadius: 1, opacity: ch.to ? 1 : 0.6 }}
            >
              {/* #a69889 = Global/iconInformational, the real bound fill on
                  Figma's Chapter Icon glyph (same value ChapterMenuItem uses)
                  — was wrongly primary.dark, an unverified guess. */}
              <ListItemIcon sx={{ minWidth: 40, color: '#a69889', position: 'relative' }}>
                <ChapterIcon fontSize="small" />
                {ch.to && !isViewed(ch.chapterId) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: 14,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: '1.5px solid',
                      borderColor: 'background.paper',
                    }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" color="text.secondary" display="block">
                    {ch.label}
                  </Typography>
                }
                secondary={
                  <Typography variant="subtitle2" color="text.primary">
                    {ch.title}
                  </Typography>
                }
              />
            </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
}
