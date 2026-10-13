import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from '../components/Sidebar';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import ReflectionPrompt from '../components/ReflectionPrompt';
import ReflectionNotebook from '../components/ReflectionNotebook';
import { useViewedChapters, markChapterViewed } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import { MODULES } from '../moduleData';
import { REFLECTIONS, reflectionId } from '../reflectionData';
import { SIDEBAR_ITEM_DEFS as M1_SIDEBAR } from '../sidebars/module1';
import { SIDEBAR_ITEM_DEFS as M2_SIDEBAR } from '../sidebars/module2';
import { SIDEBAR_ITEM_DEFS as M3_SIDEBAR } from '../sidebars/module3';
import { SIDEBAR_ITEM_DEFS as M4_SIDEBAR } from '../sidebars/module4';
import { SIDEBAR_ITEM_DEFS as M5_SIDEBAR } from '../sidebars/module5';
import { SIDEBAR_ITEM_DEFS as M6_SIDEBAR } from '../sidebars/module6';

// One page per module (`/module-N-reflection`), built from the notebook-style
// Figma frames Mod-1-Reflection ... Mod-6-Reflection ("Reflections" section,
// Claude Code Experiments page): a "Module N Reflection" heading, the prompt
// card (ReflectionPrompt), and a working notebook (ReflectionNotebook).
//
// The sidebar reuses each module's first chapter page's own item list, so it
// can't drift from the chapter pages: that page's active row gets its link
// back from moduleData, and the reflection row becomes the active one.
//
// The reflection counts as visited (its sidebar dot clears everywhere) once
// the learner has written something, and the footer fills in at the same
// moment. It isn't part of module progress, which counts built chapters only.
const SIDEBARS = {
  1: { title: 'Foundations of Nutrition', items: M1_SIDEBAR },
  2: { title: 'Diabetes Care', items: M2_SIDEBAR },
  3: { title: 'Meal Planning', items: M3_SIDEBAR },
  4: { title: 'Grocery Skills', items: M4_SIDEBAR },
  5: { title: 'Cooking and Substitutions', items: M5_SIDEBAR },
  6: { title: 'Communication & Quality of Life Balance', items: M6_SIDEBAR },
};

const chapterRoute = (chapterId) =>
  MODULES.flatMap((m) => m.chapters).find((c) => c.chapterId === chapterId)?.to ?? undefined;

export default function ModuleReflection({ moduleNumber }) {
  const id = reflectionId(moduleNumber);
  const { prompt, next } = REFLECTIONS[moduleNumber];
  const sidebar = SIDEBARS[moduleNumber];
  const { isViewed } = useViewedChapters();
  const [paneRef, settledWidth] = useSettledWidth();
  const [hasContent, setHasContent] = useState(false);

  const handleHasContent = useCallback(() => {
    setHasContent(true);
    markChapterViewed(id);
  }, [id]);

  const sidebarItems = sidebar.items.map((item) => {
    const active = item.chapterId === id;
    return {
      ...item,
      active,
      to: active ? undefined : item.to ?? chapterRoute(item.chapterId),
      unviewed: !active && !isViewed(item.chapterId),
    };
  });

  const promptId = `${id}-prompt`;

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={moduleNumber} moduleTitle={sidebar.title} items={sidebarItems} />

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box ref={paneRef} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Box
              sx={{
                width: settledWidth ? Math.min(settledWidth, HERO_WIDTH) : '100%',
                maxWidth: HERO_WIDTH,
                mx: 'auto',
                px: getContentPaddingX(settledWidth),
                py: 6,
                transition: RESIZE_TRANSITION,
              }}
            >
              <Typography variant="h6" component="h1" sx={{ color: 'text.secondary', mb: 3 }}>
                Module {moduleNumber} Reflection
              </Typography>
              <ReflectionPrompt prompt={prompt} promptId={promptId} />
              <Box sx={{ mt: 4 }}>
                <ReflectionNotebook storageId={id} labelledBy={promptId} onHasContent={handleHasContent} />
              </Box>
            </Box>
          </Box>

          <ChapterFooter to={next.to} chapterId={id} label={next.label} reachedEnd={hasContent} />
        </Box>
      </Box>
    </>
  );
}
