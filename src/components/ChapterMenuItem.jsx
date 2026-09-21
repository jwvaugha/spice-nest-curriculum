import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Link } from 'react-router-dom';

// Mirrors the Figma "Chapter Menu Item" variant set (Selected x Expand).
//
// This is deliberately built as ONE component with a single outer container
// that owns every whole-item visual (background tint, hover, the left accent
// bar, the outer border) — the header row and the expanded section list are
// just two internal regions inside it, not two separately-styled elements
// bolted together. That distinction matters: Figma's own "Selected=True"
// background is a 4%-opacity accent-color fill applied to the *entire*
// component (confirmed directly on the node — same fill, full height,
// header + section rows together), and the active indicator bar is a single
// 4px-wide rect spanning that same full height. Styling the header button
// and the collapsed list as two independent pieces (an earlier version of
// this component did exactly that) inevitably drifts out of sync — hence
// building it this way instead of patching the split version further.
const TEXT_INDENT = 7; // 56px: header's own 16px padding + the 40px icon column
const ACTIVE_TINT = 'rgba(222, 122, 45, 0.04)'; // SPICE-Edu-Orange/700 @ 4% opacity, exact Figma value

export default function ChapterMenuItem({
  icon: Icon,
  label,
  title,
  to,
  active = false,
  sections,
  open,
  onToggle,
  chapterId,
  unviewed = false,
}) {
  // Only a NON-EMPTY sections list is worth a chevron — a chapter with no
  // internal subsections has nothing to preview/expand into, so it should
  // read as a plain link (or plain inert row), not offer an affordance that
  // opens onto an empty list. `Array.isArray(sections)` alone let an
  // explicitly-empty `sections: []` (or a chapter with truly nothing to
  // show) render a chevron that expanded to nothing.
  const hasToggle = Array.isArray(sections) && sections.length > 0;

  // A row can both navigate AND have a togglable preview section list (now
  // that a module can have more than one real built chapter cross-linking
  // each other — previously `to` and `sections` never coexisted, since only
  // one chapter per module was ever real). When `to` is set, the row itself
  // navigates; when there's no `to` (chapter isn't built yet) but it does
  // have a preview list, the whole row toggles instead.
  //
  // Completion is no longer marked here on click -- per direct user
  // direction, clicking a link into a chapter (from here, or from the
  // Dashboard) must not by itself count as "read." The only thing that
  // marks a chapter viewed now is useReachedEnd, driven by actually
  // scrolling to the bottom of THAT chapter's own content and lingering
  // there — see useReachedEnd.js.
  const handleRowClick = () => {
    if (!to && hasToggle) onToggle && onToggle();
  };

  const handleChevronClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle && onToggle();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: active ? ACTIVE_TINT : 'transparent',
        // Temporary, self-resolving dimming for chapters/resources that
        // haven't been built yet (interactive games, reflections, and the
        // remaining unbuilt article-style chapters) -- same 0.6 opacity
        // ModuleProgressRow already uses for the identical "unavailable"
        // case on the Dashboard, so a row reads consistently disabled
        // whether you're looking at it from the sidebar or the dashboard.
        // `active` is included in the gate, not just `to`: a page's own
        // sidebar entry (the chapter currently on screen) never sets `to`
        // by convention -- it doesn't need a link to itself -- so gating on
        // `to` alone dimmed the very chapter you were reading the moment you
        // navigated to it, which read as its text going muted right after
        // being clicked. `active` rows are always a real, built chapter,
        // just self-referential, so they're exempt from the dim.
        opacity: to || active ? 1 : 0.6,
        '&:hover': { bgcolor: active ? ACTIVE_TINT : 'action.hover' },
      }}
    >
      {active && (
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: 'primary.light', zIndex: 1 }} />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <ButtonBase
          component={to ? Link : 'div'}
          to={to || undefined}
          onClick={handleRowClick}
          focusRipple
          sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', py: 1.5, pl: 2, pr: hasToggle ? 0 : 2, textAlign: 'left' }}
        >
          {/* #a69889 = Global/iconInformational, the real bound fill on the
              Chapter Icon glyph (verified directly on the Figma node) — not
              primary.dark, which was an unverified guess. */}
          <ListItemIcon sx={{ minWidth: 40, color: '#a69889', position: 'relative' }}>
            {Icon ? <Icon fontSize="small" /> : null}
            {unviewed && (
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
                {label}
              </Typography>
            }
            secondary={
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: active ? 500 : 400 }}>
                {title}
              </Typography>
            }
          />
        </ButtonBase>
        {hasToggle && (
          // A sibling of the navigable row, not nested inside it — clicking
          // this toggles the preview section list without also navigating
          // (can't nest a click target inside the Link/ButtonBase above).
          <ButtonBase
            onClick={handleChevronClick}
            sx={{ p: 1, mr: 1.5, borderRadius: '50%', flexShrink: 0 }}
          >
            <ExpandMoreRoundedIcon
              fontSize="small"
              sx={{
                color: 'text.disabled',
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </ButtonBase>
        )}
      </Box>

      {hasToggle && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ pl: TEXT_INDENT, pr: 2, pb: 1.5 }}>
            {sections.map((s) => {
              // A plain string is a preview-only label — no real id is known
              // for it (the chapter hasn't had its ids propagated here, or
              // genuinely isn't built), so there's nothing to link to.
              // An {label, id} object means this section really exists
              // somewhere real — on THIS page if `active`, or on that OTHER
              // chapter's own page otherwise, in which case it's a genuine
              // cross-chapter deep link, not just a same-page scroll: the
              // section was previously only clickable while its OWN chapter
              // happened to be the active one, which was the actual bug —
              // now it navigates to `${to}#${id}` and useScrollToHash on the
              // destination page (mounted fresh, since each chapter is its
              // own route) scrolls to the right spot once there.
              const isLink = typeof s === 'object' && s.id;
              const text = isLink ? s.label : s;
              if (!isLink) {
                return (
                  <Typography key={text} variant="body2" color="text.secondary" sx={{ py: 0.75 }}>
                    {text}
                  </Typography>
                );
              }
              const rowSx = {
                display: 'block',
                width: '100%',
                textAlign: 'left',
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              };
              return (
                <ButtonBase
                  key={s.id}
                  {...(active
                    ? { onClick: () => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
                    : { component: Link, to: `${to}#${s.id}` })}
                  sx={rowSx}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ py: 0.75, px: 0.5 }}>
                    {text}
                  </Typography>
                </ButtonBase>
              );
            })}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
