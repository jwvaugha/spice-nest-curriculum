import Box from '@mui/material/Box';
import SectionDivider from '../components/SectionDivider';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';

// Built from Figma node 3457:29392 ("Mod-1-Ch-2 — Food Groups"). One flat
// numbered list (no distinct titled sub-sections) — per the established
// convention, the on-page Section Title stays hidden (redundant with the
// hero title), but the sidebar's expanded preview still gets one row
// naming it ("Food Groups") for navigation purposes. Content spacing comes
// entirely from `Section`/`NumberedList` owning their own real Figma gap
// values — no page-level Stack/mb spacing.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod1ch1',
    icon: DescriptionRoundedIcon,
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
    icon: DescriptionRoundedIcon,
    label: 'Chapter 2',
    title: 'Food Groups',
    active: true,
    sections: [{ label: 'Food Groups', id: 'food-groups' }],
  },
  { chapterId: 'mod1ch4', icon: DescriptionRoundedIcon, label: 'Chapter 3', title: 'The Nutrition Facts Label' },
  {
    chapterId: 'mod1ch5',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 4',
    title: 'Common Food Myths vs. Facts',
    to: '/module-1-chapter-5',
    sections: [{ label: 'Common Food Myths vs. Facts', id: 'common-food-myths-vs-facts' }],
  },
  { chapterId: 'mod1-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game' },
  { chapterId: 'mod1-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 1 Reflection' },
];

const FOOD_GROUPS = [
  {
    title: 'Protein Foods',
    imageSrc: '/images/module-1-chapter-2/item-protein-foods.jpg',
    imageAlt: 'Raw chicken breast, eggs, and a bowl of lentils',
    body: 'Animal and plant-based protein foods include meat, poultry, eggs, seafood, beans, peas, lentils, legumes, nuts, seeds, and soy.',
    tip: '3 oz cooked meat, poultry, or seafood, 1 egg, half cup beans, peas, or lentils, 1 oz nuts or seeds, 2 tablespoon nut or seed butter, 3 oz soy.',
  },
  {
    title: 'Dairy',
    imageSrc: '/images/module-1-chapter-2/item-dairy.jpg',
    imageAlt: 'Stacked blocks of cheese',
    body: 'Dairy includes whole, reduced-fat, low-fat, or nonfat dairy products, including fluid, dry, or evaporated milk, yogurt, cheese. Lactose-free or reduced options and fortified dairy alternatives are also included.',
    tip: '1 cup milk, ¾ cup yogurt, 1 oz cheese.',
  },
  {
    title: 'Vegetables',
    imageSrc: '/images/module-1-chapter-2/item-vegetables.jpg',
    imageAlt: 'Assorted fresh vegetables, including sweet potato and peppers',
    body: 'Vegetables include all types such as dark green, red/orange, starchy, beans, peas, lentils, legumes, and other vegetables which may be fresh, frozen, or canned, cooked or raw.',
    tip: '1 cup raw or cooked; 2 cups leafy greens.',
  },
  {
    title: 'Fruits',
    imageSrc: '/images/module-1-chapter-2/item-fruits.jpg',
    imageAlt: 'Fresh fruit stand with watermelon and assorted fruits',
    body: 'Fruits include all types such as fresh, frozen, canned, juiced, dried.',
    tip: '1 cup raw, half cup dried.',
  },
  {
    title: 'Whole Grains',
    imageSrc: '/images/module-1-chapter-2/item-whole-grains.jpg',
    imageAlt: 'Loaves of whole grain bread with wheat stalks',
    body: 'Whole grain includes whole grain foods and products made with whole grains such as breads and cereals.',
    tip: 'Half cup cooked oats, brown rice, barley, quinoa or buckwheat. 1 slice bread, 1 tortilla.',
  },
  {
    title: 'Healthy Fats',
    imageSrc: '/images/module-1-chapter-2/item-healthy-fats.jpg',
    imageAlt: 'Bottle of olive oil',
    body: 'Healthy fats are naturally present in many whole foods, small amounts may also be used in cooking or added to meals.',
    tip: '1 teaspoon olive oil or butter.',
  },
];

export default function Module1Chapter2() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  // The scrollable pane itself resizes instantly (plain CSS flex); only the
  // reading column's own width waits for the resize to settle, so body text
  // isn't rewrapping on every intermediate pixel of a window drag.
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod1ch2');
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
                eyebrow="Chapter 2"
                title="Food Groups"
                intro="Food groups help organize foods by the main nutrients they provide. This section is a quick general guide to what each food group includes."
                imageSrc="/images/module-1-chapter-2/hero.jpg"
                imageAlt="Assorted colorful fruits and vegetables"
              />

              <Section id="food-groups" sx={{ pt: 0 }}>
                <NumberedList>
                  {FOOD_GROUPS.map((group, i) => (
                    <NumberedListItem
                      key={group.title}
                      number={i + 1}
                      title={group.title}
                      imageSrc={group.imageSrc}
                      imageAlt={group.imageAlt}
                      tip={group.tip}
                    >
                      {group.body}
                    </NumberedListItem>
                  ))}
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  U.S. Department of Agriculture &amp; U.S. Department of Health and Human Services. (2026). Daily
                  serving sizes by calorie level (Dietary Guidelines for Americans, 2025-2030).
                  https://cdn.realfood.gov/Daily%20Serving%20Sizes.pdf
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-1-chapter-5" chapterId="mod1ch2" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
