import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { Link, useLocation } from 'react-router-dom';
import LogoMark from './LogoMark';

// Spans the full browser viewport width — this component is rendered
// outside any max-width container in App.jsx, matching the request that the
// global nav bar span the entire screen regardless of the content column
// width below it.
export default function GlobalHeader() {
  const location = useLocation();
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

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
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center' }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoMark size={16} />
          </Box>
          <Box sx={{ lineHeight: 1.15 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.04em' }}>
              SPICE-Healthcare
            </Typography>
            <Typography sx={{ fontFamily: 'Vollkorn, Georgia, serif', fontSize: 17 }}>Education Hub</Typography>
          </Box>
        </Stack>
        </Box>

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
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              borderRadius: 5,
              px: 1,
              py: 0.5,
              mx: -1,
              my: -0.5,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: '#f0b27a', color: 'inherit' }}>
              <Typography sx={{ fontSize: 12, color: '#8e420b', fontWeight: 700 }}>J</Typography>
            </Avatar>
            <Typography sx={{ fontWeight: 600, fontSize: 14, textTransform: 'uppercase' }}>Jane Doe</Typography>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
