import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { Link } from 'react-router-dom';

function Row({ icon: Icon, label, to, trailing: Trailing }) {
  return (
    <ListItemButton component={to ? Link : 'div'} to={to} sx={{ py: 1.5, px: 2.5 }}>
      <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText slotProps={{ primary: { sx: { fontWeight: 500 } } }}>{label}</ListItemText>
      {Trailing && <Trailing fontSize="small" sx={{ color: 'text.disabled' }} />}
    </ListItemButton>
  );
}

// Same Coursera-style left-rail treatment as Sidebar.jsx (chapter nav) —
// flush left, fills the full height of its row, own internal scroll — kept
// visually consistent since both are "the app's left nav panel", just for
// different contexts (Dashboard's app-level nav vs. a chapter's own list).
export default function DashboardDrawer({ width = 320 }) {
  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '2px 0 6px rgba(64, 49, 38, 0.05)',
      }}
    >
      <Box sx={{ bgcolor: 'action.selected', px: 2.5, py: 2.25, position: 'sticky', top: 0, zIndex: 1 }}>
        <Typography variant="h6" sx={{ fontFamily: 'Vollkorn, Georgia, serif', fontWeight: 700 }}>
          NEST
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nutrition Education and Skills Training
        </Typography>
      </Box>
      <List disablePadding>
        <Row icon={AppsRoundedIcon} label="Modules" to="/dashboard" />
        <Row icon={CalendarTodayRoundedIcon} label="Session Calendar" />
      </List>
      <Divider />
      <List disablePadding>
        <Row icon={MenuBookRoundedIcon} label="Resources" trailing={ChevronRightRoundedIcon} />
      </List>
      <Divider />
      <List disablePadding>
        <Row icon={DescriptionRoundedIcon} label="My Notebook" />
      </List>
      <Divider />
      <List disablePadding>
        <Row icon={BarChartRoundedIcon} label="My Health Data" trailing={OpenInNewRoundedIcon} />
      </List>
    </Box>
  );
}
