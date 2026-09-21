import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DashboardDrawer from '../components/DashboardDrawer';
import ModuleProgressRow from '../components/ModuleProgressRow';
import { MODULES } from '../moduleData';
import { HEADER_HEIGHT } from '../layoutConstants';

export default function Dashboard() {
  // Radio-style, one module open at a time -- matches the Web Prototype's
  // original accordion behavior (see CLAUDE.md), now generalized to every
  // module instead of just Module 2. Module 2 starts open since it's the
  // one with the most built-out content so far.
  const [openModule, setOpenModule] = useState(2);

  return (
    <>
      {/* Same left-justified, full-height app-shell as the chapter pages
          (Module2Chapter2.jsx etc.) — DashboardDrawer is the app-level
          equivalent of a chapter's Sidebar, so it gets the same Coursera-
          style treatment for consistency: flush left, fills the row's full
          height, own internal scroll, instead of a floating card inset in a
          centered container. */}
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
        <DashboardDrawer />

        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', scrollBehavior: 'smooth' }}>
          <Container maxWidth="lg" sx={{ py: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h1" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 20 }}>
                Hi, <b>Jane</b>! Welcome back!
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CalendarTodayRoundedIcon fontSize="small" sx={{ color: 'primary.dark' }} />
                <Typography>
                  Next Live Session: <u>09/15/25</u>
                </Typography>
              </Stack>
            </Stack>
          </Container>

          <Container maxWidth="lg" sx={{ pb: 6 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h2" sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 22, fontWeight: 700, mb: 2.5 }}>
                Modules
              </Typography>

              <Stack spacing={1}>
              {MODULES.map((mod) => (
                <ModuleProgressRow
                  key={mod.number}
                  moduleNumber={mod.number}
                  title={mod.title}
                  thumbSrc={mod.thumbSrc}
                  chapters={mod.chapters}
                  expanded={openModule === mod.number}
                  onToggle={() => setOpenModule((cur) => (cur === mod.number ? null : mod.number))}
                />
              ))}
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
