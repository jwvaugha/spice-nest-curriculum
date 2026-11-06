import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../components/Sidebar';
import DashboardBackLink from '../components/DashboardBackLink';
import { SIDEBAR_ITEM_DEFS } from '../sidebars/module1';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import PlateBuilderIntro from '../plate-builder/PlateBuilderIntro';
import PlateBuilderGame from '../plate-builder/PlateBuilderGame';
import ResultsSheet from '../plate-builder/ResultsSheet';
import { CHALLENGES, plateTotals } from '../plate-builder/plateBuilderData';

// Plate Builder (Module 1 interactive), Figma "Approach D, refined"
// (node 3825:36759 on the Plate-Builder Game Workspace page).
//
// ISOLATED TEST PAGE, per the user (2026-11-02): reachable only by typing
// the route (#/lab/plate-builder). Nothing links here: Module 1's sidebar
// row has no `to`, moduleData.js is untouched, there's no ChapterFooter,
// and it never calls useReachedEnd, so playing it doesn't touch the
// progress model. Game state lives in this component only (no
// localStorage), so a reload starts fresh. To promote it to a real page:
// give the sidebar row a `to`, wire moduleData.js, and add the footer.
const SIDEBAR_ITEMS = SIDEBAR_ITEM_DEFS.map((item) => {
  const { active: _active, ...rest } = item;
  if (item.chapterId === 'mod1-interactive') return { ...rest, active: true };
  // module1.js is written from Chapter 1's point of view, so its row has no `to`.
  if (item.chapterId === 'mod1ch1') return { ...rest, to: '/module-1-chapter-1' };
  return rest;
});

export default function PlateBuilderLab() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEMS.map((item) => ({ ...item, unviewed: !item.active && !isViewed(item.chapterId) }));
  const [paneRef, settledWidth] = useSettledWidth();

  const [screen, setScreen] = useState('intro'); // 'intro' | 'game'
  const [index, setIndex] = useState(0);
  const [plate, setPlate] = useState({});
  const [completed, setCompleted] = useState(() => new Set());
  const [showResults, setShowResults] = useState(false);
  const totals = useMemo(() => plateTotals(plate), [plate]);

  // The game screen uses the design's tighter 24px side padding (D3: a
  // 592px pane holds a 544px stage), so the plate can sit beside the
  // targets window at a 900px window. The intro keeps the chapter padding.
  const padX = screen === 'game' ? 3 : getContentPaddingX(settledWidth);
  const contentWidth = settledWidth ? Math.min(settledWidth, HERO_WIDTH) - padX * 16 : undefined;

  const scrollTop = () => paneRef.current?.scrollTo({ top: 0 });
  const start = (i) => {
    // Replaying from the top (all three done) starts a fresh run.
    if (completed.size === CHALLENGES.length) setCompleted(new Set());
    setIndex(i);
    setPlate({});
    setShowResults(false);
    setScreen('game');
    scrollTop();
  };
  const submit = () => {
    setCompleted((s) => new Set(s).add(CHALLENGES[index].id));
    setShowResults(true);
  };
  const next = () => {
    setShowResults(false);
    if (index === CHALLENGES.length - 1) {
      setScreen('intro');
      scrollTop();
    } else {
      start(index + 1);
    }
  };

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={1} moduleTitle="Foundations of Nutrition" items={sidebarItems} />

        <Box sx={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <Box ref={paneRef} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Box
              sx={{
                width: settledWidth ? Math.min(settledWidth, HERO_WIDTH) : '100%',
                maxWidth: HERO_WIDTH,
                mx: 'auto',
                px: padX,
                // Room under the game so the results sheet never hides the tray's last row.
                pt: screen === 'game' ? 2.5 : 4,
                pb: screen === 'game' && showResults ? 40 : 4,
                transition: RESIZE_TRANSITION,
              }}
            >
              {screen === 'intro' ? (
                <PlateBuilderIntro completed={completed} onStart={start} stacked={contentWidth !== undefined && contentWidth < 560} />
              ) : (
                <PlateBuilderGame
                  key={index}
                  index={index}
                  completed={completed}
                  plate={plate}
                  setPlate={setPlate}
                  onSubmit={submit}
                  contentWidth={contentWidth}
                />
              )}
            </Box>
          </Box>

          {screen === 'game' && (
            <ResultsSheet
              open={showResults}
              challenge={CHALLENGES[index]}
              totals={totals}
              isLast={index === CHALLENGES.length - 1}
              onEdit={() => setShowResults(false)}
              onNext={next}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
