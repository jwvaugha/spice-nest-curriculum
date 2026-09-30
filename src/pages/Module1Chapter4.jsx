import Box from '@mui/material/Box';
import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import NutritionLabelExplorer from '../components/NutritionLabelExplorer';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';

// chapterId 'mod1ch4' (labeled "Chapter 3" -- same internal-id-vs-display-
// number split already established for mod2ch4/"Chapter 3" etc., see
// CLAUDE.md), route /module-1-chapter-4, matching every other page's
// "route number = chapterId number" convention rather than the display
// label. Fourth page in Module 1, cloned from Module1Chapter2.jsx's shell.
//
// The whole body is one interactive tool (NutritionLabelExplorer, see that
// component's own doc comment) rather than prose -- no References section,
// since nothing here is quoting an external source the way the other
// Module 1 chapters do.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod1ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Why Diet Matters',
    to: '/module-1-chapter-1',
    sections: [
      { label: 'Why Diet Matters in the Short Term', id: 'why-diet-matters-in-the-short-term' },
      { label: 'Why Diet Matters in the Long Term', id: 'why-diet-matters-in-the-long-term' },
    ],
  },
  {
    chapterId: 'mod1ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Food Groups',
    to: '/module-1-chapter-2',
    sections: [{ label: 'Food Groups', id: 'food-groups' }],
  },
  {
    chapterId: 'mod1ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'The Nutrition Facts Label',
    active: true,
    sections: [{ label: 'Explore the Label', id: 'explore-the-label' }],
  },
  {
    chapterId: 'mod1ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Common Food Myths vs. Facts',
    to: '/module-1-chapter-5',
    sections: [{ label: 'Common Food Myths vs. Facts', id: 'common-food-myths-vs-facts' }],
  },
  { chapterId: 'mod1-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game' },
  { chapterId: 'mod1-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 1 Reflection' },
];

export default function Module1Chapter4() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  // The scrollable pane itself resizes instantly (plain CSS flex); only the
  // reading column's own width waits for the resize to settle, so body text
  // isn't rewrapping on every intermediate pixel of a window drag.
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod1ch4');
  useScrollToHash();

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={1} moduleTitle="Foundations of Nutrition" items={sidebarItems} />

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box ref={paneRef} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
            <Box
              sx={{
                width: settledWidth ? Math.min(settledWidth, HERO_WIDTH) : '100%',
                maxWidth: HERO_WIDTH,
                mx: 'auto',
                px: getContentPaddingX(settledWidth),
                py: 4,
                transition: RESIZE_TRANSITION,
              }}
            >
              <ChapterHero
                eyebrow="Chapter 3"
                title="The Nutrition Facts Label"
                intro="Every packaged food carries a Nutrition Facts label — a quick, standardized snapshot of what's actually inside. Learning to read it well is one of the simplest ways to make informed choices at the grocery store. Here, we'll break down what each part of the label means and why it matters."
                placeholderNote="Photo needed — hero.jpg"
              />

              {/* Not wrapped in `Section` -- this interactive needs the
                  wider `StickyAsideSection` layout (label stays sticky
                  beside the scrolling description list) instead of
                  `Section`'s own narrower, single-column reading width. See
                  StickyAsideSection.jsx's own doc comment. `sx={{pt:0}}`
                  matches every other first-content-block's own override
                  (see Section.jsx) -- ChapterHero already contributes its
                  own trailing margin, so the normal top padding would
                  double up here otherwise. */}
              <NutritionLabelExplorer id="explore-the-label" title="Explore the Label" sx={{ pt: 0 }} />
            </Box>
          </Box>

          <ChapterFooter to="/module-1-chapter-5" chapterId="mod1ch4" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
