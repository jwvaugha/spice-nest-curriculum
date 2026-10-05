import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { keyframes } from '@mui/material/styles';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ArticleTextIcon from './ArticleTextIcon';
import { Link, useLocation } from 'react-router-dom';

// The three real, navigable destinations -- shared between the trigger
// (which needs to know "what page am I currently on" to show the matching
// icon+label as its own displayed value) and the Menu's own rows, so the
// two can never drift out of sync with each other the way two separately
// hand-typed literal strings could.
const NAV_ITEMS = [
  { icon: HomeRoundedIcon, label: 'NEST Home', to: '/' },
  { icon: AppsRoundedIcon, label: 'Modules', to: '/dashboard' },
  { icon: CalendarTodayRoundedIcon, label: 'Session Calendar', to: '/calendar' },
];

// Fixed content width for the trigger -- per direct user direction, it
// should stay ONE width regardless of which page's label is currently
// showing, not resize itself every time you navigate (a native <select>
// doesn't resize per-option either). Measured directly against the real
// rendered text (fontWeight 500, this component's own default body font,
// at 1rem) rather than guessed: "Session Calendar" is the longest of the
// 3 real labels at ~127px, so this is set generously above that to leave
// real breathing room rather than sizing to the exact pixel. Only the
// TEXT needs a fixed width here -- the icon and chevron are already fixed-
// size on their own, so constraining just this one element is enough to
// keep the whole trigger's overall width constant.
const LABEL_TEXT_WIDTH = 150;

// A brief fade+slide-up on the icon+label whenever the CURRENT page
// changes (not on open/close of the menu) -- per direct user direction,
// swapping instantly read as an abrupt jump cut once the trigger stopped
// resizing itself to fit new text. Re-keying the content below with
// `key={current.to}` on navigation makes React mount a fresh DOM node each
// time, which restarts this CSS animation automatically -- no manual
// visibility state/timers needed for what's otherwise a one-line effect.
const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
`;

function Row({ icon: Icon, label, to, trailing: Trailing, selected, onClick }) {
  const linkProps = to ? { component: Link, to } : {};
  return (
    <MenuItem selected={selected} onClick={onClick} sx={{ py: 1.25, px: 2, minWidth: 240 }} {...linkProps}>
      <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText slotProps={{ primary: { sx: { fontWeight: 500 } } }}>{label}</ListItemText>
      {Trailing && <Trailing fontSize="small" sx={{ color: 'text.disabled', ml: 2 }} />}
    </MenuItem>
  );
}

// Replaces PageTopBar's old plain "NEST" wordmark. Per direct user
// direction, this is a real page switcher, not a static brand label: its
// own displayed icon+text is always whichever NAV_ITEMS entry matches the
// CURRENT route (e.g. "NEST Home" while on "/", "Modules" while on
// "/dashboard") -- the same way a native <select>/combobox always displays
// its current value, not a fixed placeholder, regardless of which option is
// selected. This is also why the label is no longer set in the special
// Vollkorn brand-wordmark font: it's genuinely one of the same menu-item
// labels below (styled identically, just always showing whichever one is
// current), not a separate "NEST" logotype that happens to sit next to a
// menu.
//
// DashboardDrawer -- the floating "NEST Home / Modules / Session Calendar /
// Resources / My Notebook / My Health Data" card that used to sit
// permanently beside the content column on Home/Dashboard/Calendar -- moved
// into this dropdown (see git history / CLAUDE.md); the destinations and
// grouping are unchanged, only the always-visible List became an on-demand
// Menu whose trigger reflects the current page.
export default function NestNavSwitcher() {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  // Falls back to the first entry (NEST Home) rather than leaving the
  // trigger blank in the (currently never-hit, since this component only
  // renders on Home/Dashboard/Calendar) case of an unrecognized pathname --
  // matches the "assume the comfortable/default case rather than an
  // unhandled gap" pattern used elsewhere in this app (see Home.jsx).
  const current = NAV_ITEMS.find((item) => item.to === location.pathname) ?? NAV_ITEMS[0];

  return (
    <>
      <ButtonBase
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="true"
        aria-expanded={open}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          // A real, visible border (not just a hover-only affordance) so
          // this reads as an actual selector control at rest, the same way
          // a native <select>/combobox always shows its own outline instead
          // of only revealing an interactive boundary on hover.
          border: '1.5px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
        }}
      >
        {/* Current-page icon + label -- the exact same icon/label pair as
            the matching Menu row below it, styled identically to that row's
            own ListItemText (fontWeight 500, default body font), not the
            Vollkorn serif brand wordmark this used to be.
            `key={current.to}` remounts this Box every time the current
            page changes, restarting `fadeSlideIn` fresh each time (a plain
            CSS animation doesn't replay on its own when the content inside
            it just changes -- it needs a genuinely new element). Lives on
            a wrapping Box rather than the Typography/icon individually so
            both animate together as one unit, not staggered. */}
        <Box key={current.to} sx={{ display: 'flex', alignItems: 'center', gap: 1, animation: `${fadeSlideIn} 0.2s ease` }}>
          <current.icon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
          {/* Fixed width (not just this label's own natural width) -- per
              direct user direction, the trigger should stay one width
              regardless of which page's label is showing, not resize
              itself on every navigation the way a shrink-to-fit label
              would. See LABEL_TEXT_WIDTH's own comment for how this number
              was chosen. */}
          <Typography sx={{ fontWeight: 500, color: 'text.primary', width: LABEL_TEXT_WIDTH }}>{current.label}</Typography>
        </Box>
        {/* The paired-opposing-chevron "unfold" glyph -- the standard
            selector/combobox affordance (a `<select>`'s own arrows, a
            sortable table header, Notion/Linear-style switchers). Static --
            it doesn't need to animate to read as "this opens a menu", the
            icon itself already says that. */}
        <UnfoldMoreRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </ButtonBase>

      <Menu anchorEl={anchorEl} open={open} onClose={close} slotProps={{ paper: { sx: { mt: 0.5 } } }}>
        {NAV_ITEMS.map((item) => (
          <Row key={item.to} icon={item.icon} label={item.label} to={item.to} selected={item.to === location.pathname} onClick={close} />
        ))}
        <Divider />
        <Row icon={MenuBookRoundedIcon} label="Resources" trailing={ChevronRightRoundedIcon} onClick={close} />
        <Divider />
        <Row icon={ArticleTextIcon} label="My Notebook" onClick={close} />
        <Divider />
        <Row icon={BarChartRoundedIcon} label="My Health Data" trailing={OpenInNewRoundedIcon} onClick={close} />
      </Menu>
    </>
  );
}
