import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
import BulletedList from '../components/BulletedList';
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';

const CODE_SX = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.9em', bgcolor: 'action.hover', px: 0.75, py: 0.15, borderRadius: 1 };

// Every built chapter gets a real expand/collapse section list (not just the
// currently-active one) — matching the Figma sidebar, where Chapters 1, 4,
// and 5 are independently openable too. Resource rows (Video/Text/etc.) have
// no page and no sections, so they get neither a chevron nor `to`. Content
// spacing comes entirely from `Section`/`NumberedList`/`BulletedList` owning
// their own real Figma gap values — no page-level Stack/mb spacing.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod2ch1',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 1',
    title: 'Basics of Diabetes',
    to: '/module-2-chapter-1',
    sections: [
      { label: 'What is Diabetes?', id: 'what-is-diabetes' },
      { label: 'What is insulin?', id: 'what-is-insulin' },
      { label: 'Main types of diabetes', id: 'main-types-of-diabetes' },
      { label: 'Common symptoms of diabetes', id: 'common-symptoms-of-diabetes' },
      { label: 'Risk Factors', id: 'risk-factors' },
      { label: 'Prevention', id: 'prevention' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod2ch2',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 2',
    title: 'Managing diabetes through diet',
    active: true,
    // {label, id} objects (not plain strings) so ChapterMenuItem renders
    // these as real clickable scroll-to-section links — the only sidebar
    // entries where that's honest, since this is the chapter actually
    // rendered on this page.
    sections: [
      { label: 'Diet and Diabetes', id: 'diet-and-diabetes' },
      { label: 'Examples of Food to Eat Less Often', id: 'examples-of-food-to-eat-less-often' },
      { label: 'Foods to Focus On', id: 'foods-to-focus-on' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod2ch4',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 3',
    title: 'Alternative approaches to managing diabetes',
    to: '/module-2-chapter-4',
    sections: [
      { label: 'Change Your Meal Order', id: 'change-your-meal-order' },
      { label: 'Stay Hydrated', id: 'stay-hydrated' },
      { label: 'Move Your Body After Meals', id: 'move-your-body-after-meals' },
      { label: 'Keep a Good Sleep Schedule', id: 'keep-a-good-sleep-schedule' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod2ch5',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 4',
    title: "Medication and diet: what's the relationship?",
    to: '/module-2-chapter-5',
    sections: [
      { label: 'Diabetes Medicines', id: 'diabetes-medicines' },
      { label: 'Timing Your Medication with Meals', id: 'timing-your-medication-with-meals' },
      { label: 'Important Reminders', id: 'important-reminders' },
      { label: 'References', id: 'references' },
    ],
  },
  { chapterId: 'mod2-video', icon: VideocamRoundedIcon, label: 'Video', title: 'South Asian expert dietitian video clip on diabetes' },
  { chapterId: 'mod2-infographic', icon: DescriptionRoundedIcon, label: 'Text / Infographic', title: 'Diabetes factsheet' },
  { chapterId: 'mod2-text', icon: DescriptionRoundedIcon, label: 'Text', title: 'South Asian diabetes myths and facts' },
  { chapterId: 'mod2-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game lvl 2' },
  { chapterId: 'mod2-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 2 Reflection' },
];

export default function Module2Chapter2() {
  const { isViewed } = useViewedChapters();
  // The scrollable pane itself resizes instantly (plain CSS flex); only the
  // reading column's own width waits for the resize to settle, so body text
  // isn't rewrapping on every intermediate pixel of a window drag.
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod2ch2');
  useScrollToHash();
  // Every non-active row keeps its unviewed dot until actually clicked; rows
  // with no real page (chapterId never gets marked viewed) simply never
  // clear it — matching the Figma source, where every row defaults to
  // unviewed and only real chapter links can clear it.
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));

  return (
    <>
      <DashboardBackLink />
      {/* Coursera/LinkedIn-Learning-style app shell: this row is pinned to
          exactly fill the viewport height left over below the two sticky
          bars above it. Sidebar stretches to that full height (flush left,
          own scroll) instead of floating as a card; the content column is
          itself a flex column with its own scrollable body PLUS a
          ChapterFooter that stays permanently visible at the bottom of the
          column, never scrolled away — that's what makes "next chapter"
          feel like a persistent footer instead of a once-you-reach-the-end
          link. */}
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={2} moduleTitle="Diabetes Care" items={sidebarItems} />

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
                title="Managing diabetes through diet"
                imageSrc="/images/module-2-chapter-2/hero.jpg"
                imageAlt="Glucose monitor, stethoscope, and fresh vegetables on a counter"
              />

              <Section id="diet-and-diabetes" title="Diet and Diabetes" sx={{ pt: 0 }}>
                <Typography>Food plays an important role in managing diabetes.</Typography>
                <Typography>
                  No single food causes diabetes. However, some foods make blood sugar harder to control. The body
                  produces a hormone called insulin, which helps make sure there is never too much blood sugar in the
                  bloodstream. In diabetes, insulin is not able to properly control the amount of sugar in the
                  bloodstream. You do not need to completely avoid any foods, but some foods should be eaten less often.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="examples-of-food-to-eat-less-often" title="Examples of Food to Eat Less Often">
                <NumberedList>
                  <NumberedListItem number={1} title="Refined Carbohydrates" imageSrc="/images/module-2-chapter-2/item-refined-carbohydrates.jpg" imageAlt="White bread">
                    These foods have less fiber and are digested quickly, which can cause fast blood sugar spikes.
                    Examples: white bread, white rice, white pasta, breakfast cereals, chips, crackers, pretzels, pizza.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Foods High in Saturated Fat" imageSrc="/images/module-2-chapter-2/item-saturated-fat.jpg" imageAlt="Butter">
                    Saturated fat can make it harder for the body to use insulin, and increases the risk of heart
                    disease, which is a concern for people with diabetes. Examples: fatty cuts of red meat, chicken with
                    skin, butter and full-fat cheese, coconut oil and palm kernel oil, cakes, cookies, and pastries.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Sugary Drinks" imageSrc="/images/module-2-chapter-2/item-sugary-drinks.jpg" imageAlt="Soda">
                    Sugary drinks raise blood sugar very fast and make it harder to keep blood sugar levels stable.
                    Examples: soda, fruit punch, sweetened juices, sweetened yogurt drinks, sports drinks.
                  </NumberedListItem>
                  <NumberedListItem number={4} title="Fried Foods" imageSrc="/images/module-2-chapter-2/item-fried-foods.jpg" imageAlt="Fried food">
                    Fried foods are high in unhealthy fats and extra calories, which can make blood sugar and weight
                    management harder. Examples: French fries, fried chicken, fried snacks.
                  </NumberedListItem>
                  <NumberedListItem number={5} title="Highly Processed Foods" imageSrc="/images/module-2-chapter-2/item-processed-foods.jpg" imageAlt="Frozen meals">
                    Processed foods are often high in sugar, salt, and unhealthy fats, but low in fiber. Examples:
                    packaged snacks, fast foods, frozen meals, processed meats (sausage, bacon).
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="foods-to-focus-on" title="Foods to Focus On">
                <Typography color="text.secondary">
                  These foods provide important nutrients and can help keep blood sugar more stable throughout the day.
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Vegetables" placeholderNote={<>Photo needed — <Box component="code" sx={CODE_SX}>item-vegetables.jpg</Box></>}>
                    Keep an eye out for non-starchy vegetables like broccoli, carrots, and peppers.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Fruits" placeholderNote={<>Photo needed — <Box component="code" sx={CODE_SX}>item-fruits.jpg</Box></>}>
                    Whole fruits provide fiber, vitamins, and natural sweetness with less impact on blood sugar than
                    juice or sugary snacks.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Whole Grains" placeholderNote={<>Photo needed — <Box component="code" sx={CODE_SX}>item-whole-grains.jpg</Box></>}>
                    Whole grains like brown rice, quinoa, and oats digest more slowly than refined grains, helping keep
                    blood sugar steadier.
                  </NumberedListItem>
                  <NumberedListItem number={4} title="Lean Protein" imageSrc="/images/module-2-chapter-2/item-lean-protein.jpg" imageAlt="Lean protein (chicken)">
                    Chicken, fish, eggs, etc.
                  </NumberedListItem>
                  <NumberedListItem number={5} title="Healthy Fats" imageSrc="/images/module-2-chapter-2/item-healthy-fats.jpg" imageAlt="Nuts">
                    Nuts, seeds, avocados.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Diabetes risk is shaped by many factors.',
                    'Healthy eating is not about cutting out all foods.',
                    'Small changes, like making sure your plate is balanced with a combination of different food groups, can help manage blood sugar and support long-term health.',
                    'Eating patterns like the Mediterranean diet, which include vegetables, fruits, whole grains, beans, nuts, fish, and healthy oils, can support blood sugar control and heart health.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>American Diabetes Association. Food and Blood Glucose. https://diabetes.org/food-nutrition/food-blood-sugar</Reference>
                <Reference>American Heart Association (2025). The Facts on Fats Infographic. https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/fats/the-facts-on-fats</Reference>
                <Reference>Reynolds A, Mitri J. Dietary Advice For Individuals with Diabetes. (Updated 2024 Apr 28). Endotext [Internet]. https://www.ncbi.nlm.nih.gov/books/NBK279012/</Reference>
                <Reference>Szczerba E, Barbaresko J, Schiemann T, Stahl-Pehe A, Schwingshackl L, Schlesinger S. Diet in the management of type 2 diabetes: umbrella review. BMJ Medicine. 2023;2:e000664.</Reference>
                <Reference>Ahmad S, Demler OV, Sun Q, et al. Association of the Mediterranean Diet With Onset of Diabetes in the Women's Health Study. JAMA Network Open. 2020;3(11):e2025466.</Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-2-chapter-4" chapterId="mod2ch2" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
