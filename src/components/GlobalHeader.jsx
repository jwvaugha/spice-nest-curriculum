import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { Link, useLocation } from 'react-router-dom';
import LogoMark from './LogoMark';
import { useSequentialMode } from '../hooks/useSequentialMode';
import { useViewedChapters } from '../hooks/useViewedChapters';

// Spans the full browser viewport width — this component is rendered
// outside any max-width container in App.jsx, matching the request that the
// global nav bar span the entire screen regardless of the content column
// width below it.
export default function GlobalHeader() {
  const location = useLocation();
  // "/" is now the Home splash page, a distinct page from the Modules
  // list -- it used to redirect straight to "/dashboard", which is why this
  // previously matched both paths.
  const isDashboard = location.pathname === '/dashboard';

  // Below `md` (900px), the logo lockup + centered Dashboard/Resources
  // buttons + right-side FAQS button/avatar/name no longer have real
  // breathing room between them -- collapse the center nav into a hamburger
  // menu instead of letting the row visually crowd or overflow. `md` was
  // picked as the point where this row's own fixed-width elements (two
  // wordmarks, two buttons, FAQS, an avatar+name) start running out of
  // space between the two ends, not an arbitrary device-size guess.
  const theme = useTheme();
  const collapseNav = useMediaQuery(theme.breakpoints.down('md'));
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { sequentialMode, toggleSequentialMode } = useSequentialMode();
  const { resetViewed } = useViewedChapters();

  return (
    <AppBar position="sticky" elevation={0} sx={{ top: 0 }}>
      <Toolbar sx={{ gap: 3, py: 1 }}>
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexShrink: 0,
            display: 'block',
            borderRadius: 1.5,
            px: 1,
            py: 0.5,
            mx: -1,
            my: -0.5,
            transition: 'background-color 0.15s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
          }}
        >
        {/* Mirrors Figma's real "Global Header" > "Logo-Lockup" (node
            3182:14740) exactly, swept directly off the component rather than
            approximated: a dark-orange (#6e3105, SPICE-Edu-Orange/1100)
            rounded badge holding the icon + "SPICE-Healthcare" side by side,
            then a real 24px gap, then "Education Hub" standing alone as its
            own wordmark -- NOT a square translucent icon box next to two
            stacked lines of text, which was a from-memory guess that didn't
            match the real component at all. Figma's own "Brand Wordmark
            Group" actually duplicates the icon+SPICE-Healthcare pairing a
            second time next to "Education Hub" too, but that duplicate
            instance is set invisible in the source -- confirmed directly via
            the Plugin API, not assumed -- so only "Education Hub" itself is
            real content there. */}
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', bgcolor: '#6e3105', borderRadius: '4px', px: 1, py: 1 }}
          >
            <LogoMark size={17} />
            <Typography
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.1px',
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              SPICE-Healthcare
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: 'Vollkorn, Georgia, serif',
              fontWeight: 400,
              fontSize: 20,
              letterSpacing: '-0.06em',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Education Hub
          </Typography>
        </Stack>
        </Box>

        {collapseNav ? (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              aria-label="Open navigation menu"
              sx={{ color: '#fff' }}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              <MenuItem component={Link} to="/dashboard" selected={isDashboard} onClick={() => setMenuAnchor(null)}>
                <ListItemIcon>
                  <HomeRoundedIcon fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => setMenuAnchor(null)}>
                <ListItemIcon>
                  <MenuBookRoundedIcon fontSize="small" />
                </ListItemIcon>
                Resources
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Stack direction="row" spacing={4} sx={{ flex: 1, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/dashboard"
              startIcon={<HomeRoundedIcon fontSize="small" />}
              sx={{
                color: isDashboard ? '#fff' : 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                borderBottom: '2px solid',
                borderColor: isDashboard ? '#fff' : 'transparent',
                borderRadius: 1,
                pb: 0.75,
                transition: 'background-color 0.15s ease, color 0.15s ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' },
              }}
            >
              Dashboard
            </Button>
            <Button
              startIcon={<MenuBookRoundedIcon fontSize="small" />}
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 600,
                borderRadius: 1,
                transition: 'background-color 0.15s ease, color 0.15s ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' },
              }}
            >
              Resources
            </Button>
          </Stack>
        )}

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.7)',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', borderColor: '#fff' },
            }}
          >
            FAQS
          </Button>
          <ButtonBase
            onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRadius: 5,
              px: 1,
              py: 0.5,
              mx: -1,
              my: -0.5,
              transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#f0b27a', color: 'inherit' }}>
              <Typography sx={{ fontSize: 12, color: '#8e420b', fontWeight: 700 }}>J</Typography>
            </Avatar>
            <Typography sx={{ fontWeight: 600, fontSize: 14, textTransform: 'uppercase' }}>Jane Doe</Typography>
          </ButtonBase>
          {/* A settings toggle, not a navigation menu, so a Switch inside a
              MenuItem (rather than the checkbox-icon-swap pattern used for
              the hamburger's own nav links) reads more honestly as "this is
              a mode you're turning on/off", not a page you're going to.
              `event.stopPropagation` isn't needed here since clicking
              anywhere in the MenuItem (including the Switch) already
              toggles via the MenuItem's own onClick -- letting the Switch
              ALSO fire its own onChange would double-toggle, so the Switch
              is deliberately read-only (`onChange` no-op) and purely
              reflects `sequentialMode`, with the MenuItem as the single
              source of the actual toggle action. */}
          <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={() => setUserMenuAnchor(null)}>
            <MenuItem onClick={toggleSequentialMode}>
              <ListItemIcon>
                <LockRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Sequential Module Unlocking"
                secondary="Require finishing a module before the next unlocks"
                slotProps={{ secondary: { sx: { whiteSpace: 'normal', maxWidth: 220 } } }}
              />
              <Switch edge="end" checked={sequentialMode} onChange={() => {}} sx={{ ml: 1 }} />
            </MenuItem>
            <Divider />
            {/* Testing affordance, not a real end-user feature -- lets
                whoever's reviewing the app flip between "fresh learner" and
                "partway through the curriculum" without clearing
                localStorage via devtools. Clears every chapter's "viewed"
                flag (see useViewedChapters.js's resetViewedChapters), which
                is also what every "unviewed" dot, the Home splash's "Get
                Started" vs "Dive Back In" card, and Sequential Module
                Unlocking's own lock state all key off of -- a real, full
                reset of "what's been accomplished", not just a UI-only
                visual toggle. A one-off action (not a persistent setting
                like the Switch above it), so it closes the menu immediately
                on click instead of staying open. */}
            <MenuItem
              onClick={() => {
                resetViewed();
                setUserMenuAnchor(null);
              }}
            >
              <ListItemIcon>
                <RestartAltRoundedIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Reset Progress"
                secondary="Testing only — clears every chapter's viewed state"
                slotProps={{ secondary: { sx: { whiteSpace: 'normal', maxWidth: 220 } } }}
              />
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
