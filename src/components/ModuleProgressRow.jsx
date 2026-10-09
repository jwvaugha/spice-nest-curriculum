import { useState } from 'react';
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
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArticleTextIcon from './ArticleTextIcon';
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
// Click model (reworked several times per direct user feedback): the LEFT
// half of the module -- thumbnail, title, progress -- navigates straight to
// the module's first built chapter. The RIGHT half (roughly from the card's
// horizontal middle to its right edge, not just a narrow zone hugging the
// checkmark/chevron) toggles the chapter list open/closed instead. Those two
// zones are still two separate click targets under the hood (an `<a>` can't
// nest inside a `<button>`, so it's two sibling `ButtonBase`s, not one), but
// neither the hover highlight NOR the click/press feedback reveals where
// that 50/50 boundary actually falls: hover lives on the shared outer
// container (so the whole row lights up as one piece), and the toggle
// button's own native ripple is disabled in favor of a brief whole-card
// flash driven by React state (`pressed`) -- a ripple confined to just the
// right-half ButtonBase's own box would visibly stop dead at the boundary,
// which is exactly the "hitbox implied by the animation" this avoids.
const PRESS_FLASH_MS = 180;
export const CHAPTER_LIST_INDENT = 15; // 120px: aligns each chapter row's
// icon with the module title text's own left edge: the row's own 16px left
// padding (px: 2) + the 96px thumbnail + the row's 16px gap = 128px;
// ListItemButton below still contributes its own 8px px, so List itself
// only needs 120px (15 spacing units).
// `locked` (sequential-unlock mode, see GlobalHeader's user menu and
// Dashboard.jsx's own per-module completion cascade): the module is
// disabled but still EXPANDABLE -- per direct user direction, a locked
// module still lets a learner see what's coming (chapter titles), just not
// navigate into any of them or into the module itself. This is why `locked`
// only ever affects the NAVIGATE button and the chapter list's own links
// below, never the toggle button, which stays fully functional regardless.
export default function ModuleProgressRow({ moduleNumber, title, thumbSrc, chapters, expanded, onToggle, locked = false }) {
  const { isViewed } = useViewedChapters();
  // Counts only BUILT chapters (`to` set), per direct user direction -- the
  // same basis isModuleComplete (moduleData.js) uses for Home's "Completed"
  // group and the sequential-unlock cascade, so a module whose only unread
  // chapters don't have pages yet reads "04/4" + checkmark, matching where
  // it's grouped and what it unlocks. Unbuilt chapters still appear
  // (disabled) in the expanded chapter list below.
  const builtChapters = chapters.filter((c) => c.to);
  const chaptersTotal = builtChapters.length;
  const chaptersComplete = builtChapters.filter((c) => isViewed(c.chapterId)).length;
  const pct = chaptersTotal ? Math.round((chaptersComplete / chaptersTotal) * 100) : 0;
  const complete = chaptersTotal > 0 && chaptersComplete === chaptersTotal;
  const firstBuilt = !locked && chapters.find((c) => c.to);

  // Drives the whole-card press flash (see the click-model comment above):
  // set true on toggle click, cleared again after PRESS_FLASH_MS regardless
  // of the toggle button's own (much narrower) physical bounds.
  const [pressed, setPressed] = useState(false);
  const handleToggleClick = () => {
    setPressed(true);
    onToggle();
    setTimeout(() => setPressed(false), PRESS_FLASH_MS);
  };

  return (
    <Box>
      <Stack
        direction="row"
        spacing={0}
        sx={{
          alignItems: 'stretch',
          borderRadius: 2,
          transition: `background-color ${PRESS_FLASH_MS}ms ease`,
          bgcolor: pressed ? 'action.selected' : 'transparent',
          '&:hover': { bgcolor: pressed ? 'action.selected' : 'action.hover' },
        }}
      >
        {/* Ripple disabled unconditionally (was only disabled when there was
            no `firstBuilt` link before) -- clicking this navigates away
            immediately, so a lingering click/bg animation on just this
            zone's own box is both unnecessary and, per direct user
            direction, undesirable here (same reasoning as disabling the
            toggle button's ripple below). The hover feedback for this zone
            is the title underline instead (see the title wrapper below),
            not a background fill. */}
        <ButtonBase
          {...(firstBuilt ? { component: Link, to: firstBuilt.to } : { component: 'div' })}
          disabled={locked}
          disableRipple
          sx={(theme) => ({
            flex: 1,
            minWidth: 0,
            justifyContent: 'flex-start',
            textAlign: 'left',
            gap: 2,
            py: 1.75,
            px: 2,
            cursor: firstBuilt ? 'pointer' : 'default',
            opacity: locked ? 0.55 : 1,
            // Scoped to THIS button's own hover, not the whole card -- only
            // mousing over the module-proper (navigate) zone reveals the
            // underline, not the toggle zone to its right. Suppressed
            // entirely when locked -- the underline is a "this navigates"
            // affordance, and a locked module's navigate zone doesn't.
            '&:hover .module-title': locked ? undefined : { textDecorationColor: theme.palette.divider },
          })}
        >
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Box
              component="img"
              src={thumbSrc}
              alt=""
              sx={{ width: 96, height: 96, borderRadius: 1.5, objectFit: 'cover', display: 'block' }}
            />
            {/* Locked overlay -- a standard "disabled lesson" treatment
                (Coursera/Duolingo-style: a dark scrim + a centered lock
                glyph directly on the thumbnail), not new copy to write or
                translate. Sits only on the thumbnail, not the whole row, so
                the module title/progress text underneath keeps its own
                normal (if dimmed via the button's own opacity) contrast. */}
            {locked && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(0,0,0,0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LockRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Module {moduleNumber}
            </Typography>
            {/* A real `text-decoration-line: underline` (not a custom
                absolutely-positioned bar) -- the bar approach broke on
                multi-line titles (one bar spanning the widest line's width,
                sitting under only the last line) and sat below the full
                descender height of letters like "g"/"y" instead of at the
                baseline. Native underline wraps per-line automatically and
                is drawn at the baseline by definition, crossing through
                descenders the way real underlined text always has -- both
                complaints solved by using the real CSS feature instead of
                approximating it. The color (not the presence of the line)
                is what animates on hover -- transparent by default, fading
                to `divider` -- since toggling text-decoration-line itself
                doesn't transition smoothly across browsers. */}
            <Typography
              variant="h3"
              className="module-title"
              sx={{
                color: 'text.primary',
                // No bottom margin when locked: the progress block below is
                // hidden, so number+title are the whole text column and
                // center vertically against the thumbnail on their own.
                mb: locked ? 0 : 1.25,
                textDecorationLine: 'underline',
                textDecorationColor: 'transparent',
                textDecorationThickness: '1px',
                textUnderlineOffset: '3px',
                transition: 'text-decoration-color 0.25s ease',
              }}
            >
              {title}
            </Typography>
            {/* Hidden entirely when locked, per direct user direction -- an
                always-empty bar plus "Locked" text was redundant next to the
                thumbnail's own lock glyph. ButtonBase is already a centered
                inline-flex row, so the remaining number+title center
                vertically within the card with no extra layout code. */}
            {!locked && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{ width: 155, height: 4, borderRadius: 2, bgcolor: 'divider', mb: 0.75 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {`${String(chaptersComplete).padStart(2, '0')}/${chaptersTotal} Chapters Complete`}
                </Typography>
              </>
            )}
          </Box>
        </ButtonBase>

        {/* Hitbox spans roughly the right HALF of the card (flex: 1, same
            share as the navigate button to its left), not just a narrow
            zone hugging the checkmark/chevron -- its own content still
            hugs the right edge (justifyContent: flex-end) so nothing looks
            different visually, only the clickable area is wider. Ripple is
            disabled here on purpose: a native ripple is clipped to this
            button's own box, which would visibly reveal the 50/50 boundary
            the moment someone clicks near it -- the outer Stack's `pressed`
            flash (whole-card) is the replacement feedback. */}
        <ButtonBase
          onClick={handleToggleClick}
          disableRipple
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
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
            // Locked modules show every chapter's real title (per direct
            // user direction -- "see at least the titles of units to
            // come"), but never as a real link, even for a chapter that IS
            // actually built -- same opacity treatment as a not-yet-built
            // chapter (`ch.to: null`), since both read as "not available
            // right now" to a learner regardless of the underlying reason.
            const navigable = ch.to && !locked;
            return (
            <ListItemButton
              key={ch.chapterId}
              component={navigable ? Link : 'div'}
              to={navigable ? ch.to : undefined}
              disabled={!navigable}
              sx={{ py: 0.75, px: 1, borderRadius: 1, opacity: navigable ? 1 : 0.6 }}
            >
              {/* #a69889 = Global/iconInformational, the real bound fill on
                  Figma's Chapter Icon glyph (same value ChapterMenuItem uses)
                  — was wrongly primary.dark, an unverified guess. The
                  content-type icon here is never swapped out or covered up
                  by the completion state -- per direct user direction, the
                  media-type icon always stays put; "done" is communicated by
                  a small checkmark inline next to the "Chapter N" eyebrow
                  text instead (see ListItemText below), not by displacing
                  this icon. */}
              <ListItemIcon sx={{ minWidth: 40, position: 'relative' }}>
                <ArticleTextIcon fontSize="small" sx={{ color: '#a69889' }} />
                {navigable && !isViewed(ch.chapterId) && (
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
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {ch.label}
                    </Typography>
                    {navigable && isViewed(ch.chapterId) && (
                      <CheckCircleRoundedIcon sx={{ fontSize: 12, color: '#4c9d5f' }} />
                    )}
                  </Stack>
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
