import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ModuleProgressRow from './ModuleProgressRow';
import { MODULES, isModuleComplete, getLockedModules, getResumeTarget } from '../moduleData';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSequentialMode } from '../hooks/useSequentialMode';

// The splash page's own module stack -- the same ModuleProgressRow rows as
// the Modules tab, regrouped per direct user direction into:
//   1. "This Module": the module the Dive Back In card resumes into
//      (getResumeTarget -- the most recently visited chapter's module).
//   -- divider --
//   2. "Up Next": every other incomplete module. In sequential mode these
//      are exactly the inaccessible (locked) ones; in all-modules mode
//      nothing is locked, so they're listed as normal live rows instead of
//      vanishing.
//   3. "Completed": every complete module, in curriculum order.
// Each group hides when empty (a fresh learner has no Completed; a learner
// who's finished everything has only Completed).
//
// Lock state uses the exact same cascade as the Modules tab
// (getLockedModules). In sequential mode the Up Next group -- its heading
// included -- sits inside one initially-invisible container whose hover
// state is an UNDERLAY (a padded tint behind the heading and rows) plus a
// small "Finish Module N to unlock these" label on the heading's own line.
// Per direct user direction it's never an overlay/scrim, so locked rows stay
// expandable to preview their chapter titles, same as on the Modules tab.
export default function HomeModuleStack() {
  const [openModule, setOpenModule] = useState(null);
  const { isViewed, lastVisited } = useViewedChapters();
  const { sequentialMode } = useSequentialMode();
  const locked = getLockedModules(isViewed, sequentialMode);

  const incomplete = MODULES.filter((m) => !isModuleComplete(m, isViewed));
  const completed = MODULES.filter((m) => isModuleComplete(m, isViewed));
  // "This Module" is whichever module the Dive Back In card resumes into
  // (same getResumeTarget call), as long as it's still incomplete; Up Next
  // is every OTHER incomplete module, curriculum order.
  const resume = getResumeTarget(isViewed, lastVisited, sequentialMode);
  const thisModule = incomplete.find((m) => m.number === resume?.module.number) || incomplete[0];
  const upNext = incomplete.filter((m) => m !== thisModule);
  // In sequential mode every Up Next module is locked (the cascade unlocks
  // through the first incomplete module only); in all-modules mode none are.
  const upNextLocked = upNext.length > 0 && upNext.every((m) => locked.has(m.number));

  const row = (mod) => (
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
  );

  const heading = (text) => (
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
      {text}
    </Typography>
  );

  return (
    <Stack spacing={4}>
      {thisModule && (
        <Box>
          {heading('This Module')}
          {row(thisModule)}
        </Box>
      )}

      {thisModule && upNext.length > 0 && <Divider />}

      {upNext.length > 0 &&
        (upNextLocked ? (
          // Plain outer Box absorbs the parent Stack's injected spacing
          // margin -- that rule resets `margin` on direct children, which
          // would silently wipe out the inner Box's negative `mx`.
          <Box>
            <Box
              sx={{
                borderRadius: 3,
                // Generous padding so the underlay reads as a container
                // around the heading + rows; the matching negative margin
                // keeps the heading and rows aligned with every other
                // section's left edge when the underlay is invisible.
                p: 2,
                m: -2,
                transition: 'background-color 0.15s ease',
                '&:hover': { bgcolor: 'action.hover' },
                '&:hover .lock-group-label': { opacity: 1 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
                  Up Next
                </Typography>
                <Box
                  className="lock-group-label"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.75, opacity: 0, transition: 'opacity 0.15s ease', color: 'text.secondary' }}
                >
                  <LockRoundedIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {`Finish Module ${thisModule.number} to unlock these`}
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={1}>{upNext.map(row)}</Stack>
            </Box>
          </Box>
        ) : (
          <Box>
            {heading('Up Next')}
            <Stack spacing={1}>{upNext.map(row)}</Stack>
          </Box>
        ))}

      {completed.length > 0 && (
        <Box>
          {heading('Completed')}
          <Stack spacing={1}>{completed.map(row)}</Stack>
        </Box>
      )}
    </Stack>
  );
}
