import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import PageTopBar from '../components/PageTopBar';
import { HEADER_HEIGHT, DASHBOARD_CONTENT_PT, DASHBOARD_SHELL_BACKGROUND } from '../layoutConstants';

// Placeholder destination for PageTopBar's "Next Live Session" chip and
// NestNavSwitcher's "Session Calendar" row -- a real calendar view isn't
// part of this build yet, but both affordances need somewhere real to
// navigate to rather than a dead link. Same shell (PageTopBar + content
// column, same DASHBOARD_CONTENT_PT start) as Home/Dashboard so it doesn't
// feel like a foreign page once the real feature replaces this.
export default function Calendar() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - ${HEADER_HEIGHT}px)`, background: DASHBOARD_SHELL_BACKGROUND }}>
      <PageTopBar />
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 2, md: 3, xl: 6 } }}>
        <Container maxWidth="md" sx={{ pt: DASHBOARD_CONTENT_PT, pb: 6 }}>
          <Typography variant="h2" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 22, fontWeight: 700, mb: 2 }}>
            Session Calendar
          </Typography>
          <Typography color="text.secondary">Coming soon.</Typography>
        </Container>
      </Box>
    </Box>
  );
}
