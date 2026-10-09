import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PageTopBar from '../components/PageTopBar';
import ModuleProgressRow from '../components/ModuleProgressRow';
import { MODULES, getLockedModules } from '../moduleData';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSequentialMode } from '../hooks/useSequentialMode';
import { HEADER_HEIGHT, DASHBOARD_CONTENT_PT, DASHBOARD_SHELL_BACKGROUND } from '../layoutConstants';

export default function Dashboard() {
  // Radio-style, one module open at a time -- matches the Web Prototype's
  // original accordion behavior (see CLAUDE.md), now generalized to every
  // module instead of just Module 2. Nothing expanded by default -- per
  // direct user direction, landing on this page shouldn't presuppose which
  // module the learner cares about (Module 2 defaulting open here was a
  // leftover from before this was generalized to every module).
  const [openModule, setOpenModule] = useState(null);
  const { isViewed } = useViewedChapters();
  const { sequentialMode } = useSequentialMode();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - ${HEADER_HEIGHT}px)`, background: DASHBOARD_SHELL_BACKGROUND }}>
      <PageTopBar />

      {/* Used to share this row with a permanently-visible DashboardDrawer;
          that nav now lives inside PageTopBar's own NestNavSwitcher dropdown
          instead (see NestNavSwitcher.jsx), so the content column runs the
          full row width on its own. `px` still grows at wider breakpoints so
          there's a real minimum gutter from the true viewport edge on very
          wide screens, not just whatever the Container's own auto-margin
          happens to leave. */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollBehavior: 'smooth', px: { xs: 2, md: 3, xl: 6 } }}>
        {/* maxWidth matches Home.jsx's own Container exactly, so the
            Modules list reads as the same content column width as the
            splash page, not its own wider one. */}
        <Container maxWidth="md" sx={{ pt: DASHBOARD_CONTENT_PT, pb: 6 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h2" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 22, fontWeight: 700, mb: 2.5 }}>
              Modules
            </Typography>

            <Stack spacing={1}>
            {(() => {
              // Lock state comes from the shared cascade in moduleData.js
              // (getLockedModules) -- the same rule Home's module stack
              // uses, so the two pages can never disagree about which
              // modules are locked.
              const locked = getLockedModules(isViewed, sequentialMode);
              return MODULES.map((mod) => (
                <ModuleProgressRow
                  key={mod.number}
                  moduleNumber={mod.number}
                  title={mod.title}
                  thumbSrc={mod.thumbSrc}
                  chapters={mod.chapters}
                  expanded={openModule === mod.number}
                  onToggle={() => setOpenModule((cur) => (cur === mod.number ? null : mod.number))}
                  locked={locked.has(mod.number)}
                />
              ));
            })()}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
