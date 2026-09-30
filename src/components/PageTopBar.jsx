import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { Link } from 'react-router-dom';
import NestNavSwitcher from './NestNavSwitcher';
import { DASHBOARD_GREETING_HEIGHT } from '../layoutConstants';

// Persistent bar shown on every page that uses this shell (currently Home,
// Dashboard, Calendar) -- the NEST nav switcher on the left (see
// NestNavSwitcher.jsx -- what used to be a plain "NEST" wordmark placeholder
// is now the dropdown trigger for the nav that used to live in a permanent
// side drawer) and "Next Live Session" on the right, which per direct user
// direction needs to stay visible across pages rather than being specific to
// just the Modules list. Replaces the old Dashboard-only "Hi, Jane! Welcome
// back!" greeting bar, which lived only in Dashboard.jsx and didn't persist
// anywhere else.
export default function PageTopBar() {
  return (
    <Box sx={{ height: DASHBOARD_GREETING_HEIGHT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5 }}>
      <NestNavSwitcher />
      {/* A real, hoverable, clickable Chip now (was plain static text) --
          shrunk down since it's a secondary affordance, not a headline.
          Routes to the calendar page, which doesn't exist yet as a real
          feature (see Calendar.jsx) -- linking it now rather than leaving it
          static text with nowhere to go. */}
      <Chip
        component={Link}
        to="/calendar"
        clickable
        size="small"
        icon={<CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />}
        label="Next Live Session: 09/15/25"
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: 'text.primary',
          bgcolor: 'action.hover',
          '& .MuiChip-icon': { color: 'primary.dark' },
          '&:hover': { bgcolor: 'action.selected' },
        }}
      />
    </Box>
  );
}
