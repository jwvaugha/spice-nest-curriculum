import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
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

// Built from Figma node 3239:15306 ("Mod-3-Ch-3 — Avoiding Food Waste").
// "How to store food properly" is a NumberedList of 5 independent food-safety
// rules (Follow Storage Instructions / Keep Sealed / Maintain Temps /
// Refrigerate Within 2 Hours / First In First Out) — deliberately NOT a
// SequenceTimeline, since these are parallel rules you follow simultaneously,
// not a temporal chain (matches this session's own audit distinguishing
// "genuine sequence" from "independent numbered items"). Every image is a
// real distinct photo in Figma (confirmed via unique imageHash per item, no
// repeats), sourced here from the local `Chapter Content/Images` drop-folder
// rather than re-exported from Figma. Same Module 3 sidebar base as
// Module3Chapter1.jsx/Module3Chapter2.jsx.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod3ch1',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 1',
    title: 'Creating a meal plan and aligning with grocery list',
    to: '/module-3-chapter-1',
    sections: [
      { label: 'Two Ways to Plan Your Meals', id: 'two-ways-to-plan-your-meals' },
      { label: 'Tips for Meal Planning', id: 'tips-for-meal-planning' },
      { label: 'Tips for Making a Grocery List', id: 'tips-for-making-a-grocery-list' },
      { label: 'Tips for Meal Preparation', id: 'tips-for-meal-preparation' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod3ch2',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 2',
    title: 'Efficiency Strategies',
    to: '/module-3-chapter-2',
    sections: [
      { label: 'Why This Matters', id: 'why-this-matters' },
      { label: 'Prepping in Advance & Batch Cooking', id: 'prepping-in-advance-batch-cooking' },
      { label: 'Tips for Successful Meal Prep', id: 'tips-for-successful-meal-prep' },
      { label: 'Shelf Life and Food Storage', id: 'shelf-life-and-food-storage' },
      { label: 'Cook Once, Eat Twice', id: 'cook-once-eat-twice' },
      { label: 'Key Takeaway', id: 'key-takeaway' },
    ],
  },
  {
    chapterId: 'mod3ch3',
    icon: DescriptionRoundedIcon,
    label: 'Chapter 3',
    title: 'Avoiding Food Waste',
    active: true,
    sections: [
      { label: 'Why does food get wasted?', id: 'why-does-food-get-wasted' },
      { label: 'How to store food properly', id: 'how-to-store-food-properly' },
      { label: 'What date labels mean', id: 'what-date-labels-mean' },
      { label: 'Good foods to buy in bulk', id: 'good-foods-to-buy-in-bulk' },
      { label: 'Bad foods to buy in bulk', id: 'bad-foods-to-buy-in-bulk' },
      { label: 'Simple habits to reduce waste', id: 'simple-habits-to-reduce-waste' },
    ],
  },
  { chapterId: 'mod3ch4', icon: DescriptionRoundedIcon, label: 'Chapter 4', title: 'Meal Planning Tools' },
  { chapterId: 'mod3ch5', icon: DescriptionRoundedIcon, label: 'Chapter 5', title: 'Meal Planning Organizer' },
  { chapterId: 'mod3-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 3 Reflection' },
];

export default function Module3Chapter3() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod3ch3');
  useScrollToHash();

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={3} moduleTitle="Meal Planning" items={sidebarItems} />

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
                title="Avoiding Food Waste"
                imageSrc="/images/module-3-chapter-3/hero.jpg"
                imageAlt="Reducing food waste at home"
              />

              <Section id="why-does-food-get-wasted" title="Why does food get wasted?" sx={{ pt: 0 }}>
                <Typography>
                  People mainly waste food once it has gone bad, expired, or been left unattended. Other common
                  reasons include buying too much, forgetting what they already have, or misunderstanding date
                  labels. To help reduce food waste, the FDA recommends planning meals, checking the refrigerator and
                  pantry before shopping, avoiding buying more food than can be used before it spoils, and freezing
                  items until they are ready to be consumed (FDA, 2019).
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="how-to-store-food-properly" title="How to store food properly">
                <NumberedList>
                  <NumberedListItem
                    number={1}
                    title="Follow Storage Instructions"
                    imageSrc="/images/module-3-chapter-3/item-follow-storage-instructions.jpg"
                    imageAlt="Following food storage instructions on packaging"
                  >
                    If an item says "Keep Frozen or Keep Refrigerated," follow those instructions to ensure the best
                    quality possible.
                  </NumberedListItem>
                  <NumberedListItem
                    number={2}
                    title="Keep Foods Properly Sealed"
                    imageSrc="/images/module-3-chapter-3/item-keep-foods-sealed.jpg"
                    imageAlt="Food stored in a sealed container"
                  >
                    If the item requires a closed environment, keep it closed in a container.
                  </NumberedListItem>
                  <NumberedListItem
                    number={3}
                    title="Maintain Safe Refrigerator and Freezer Temperatures"
                    imageSrc="/images/module-3-chapter-3/item-fridge-temp.jpg"
                    imageAlt="Checking refrigerator temperature"
                  >
                    According to the US EPA, you should keep your refrigerator at 40 degrees Fahrenheit or lower, and
                    your freezer at 0 degrees Fahrenheit or below, so food stays safe longer (EPA, 2021).
                  </NumberedListItem>
                  <NumberedListItem
                    number={4}
                    title="Refrigerate Leftovers Within 2 Hours"
                    imageSrc="/images/module-3-chapter-3/item-refrigerate-leftovers.jpg"
                    imageAlt="Refrigerating leftovers"
                  >
                    Say you go out with friends to get dinner at a restaurant. You should make sure to put any
                    leftovers in the fridge within 2 hours to decrease the chance of spoilage and foodborne illnesses
                    (FDA, 2019).
                  </NumberedListItem>
                  <NumberedListItem
                    number={5}
                    title='Use the "First In, First Out" Method'
                    imageSrc="/images/module-3-chapter-3/item-first-in-first-out.jpg"
                    imageAlt="Organizing pantry items using first in, first out"
                  >
                    The FDA also recommends using the "first in, first out" method, which means to eat your older
                    food before eating your newer food to ensure that no food goes to waste.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="what-date-labels-mean" title="What date labels mean">
                <Typography>
                  When you're out buying groceries, always be mindful of the date labels on packages. "Best if used
                  by/before" usually means the best quality, not safety-wise.
                </Typography>
                <Typography>
                  "Sell-by" is mainly for stores and helps them keep track of how long their product has been on
                  display. A "use-by" date refers to the last recommended date of that product at its peak before it
                  starts to deteriorate. It's not a safe date except when it's involved in products meant for infants
                  (FSIS, 2019).
                </Typography>
                <Box
                  component="img"
                  src="/images/module-3-chapter-3/item-date-labels.jpg"
                  alt="Checking the best-by date on a package"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
                <Typography>
                  Overall, the date label does not always mean food must be thrown away immediately — the FDA says
                  that consumers should look for signs of spoilage, such as fungus, or a change of color, texture, or
                  smell, before they just throw it away.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="good-foods-to-buy-in-bulk" title="Good foods to buy in bulk">
                <Typography>
                  Good foods to buy in bulk include eggs, meat, and chicken that you can freeze to preserve them for
                  later. Other examples include rice, pasta, oats, dried beans, canned foods, and frozen vegetables
                  because they last longer and are less likely to be wasted.
                </Typography>
                <Typography>
                  The EPA recommends buying items in bulk, which works best when you buy what you need and have it
                  properly stored (EPA, 2019).
                </Typography>
                <Box
                  component="img"
                  src="/images/module-3-chapter-3/item-good-bulk-foods.jpg"
                  alt="Canned foods that store well when bought in bulk"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="bad-foods-to-buy-in-bulk" title="Bad foods to buy in bulk">
                <Typography>
                  Foods like bagged salad, fruits, milk, and soft bread can be inefficient bulk purchases because
                  they spoil quickly if they aren't used fast enough.
                </Typography>
                <Typography>
                  The EPA mentions that buying in bulk only saves money if you can use the food before it spoils.
                </Typography>
                <Box
                  component="img"
                  src="/images/module-3-chapter-3/item-bad-bulk-foods.jpg"
                  alt="Fruit that has spoiled from being bought in bulk and not used in time"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="simple-habits-to-reduce-waste" title="Simple habits to reduce waste">
                <BulletedList
                  items={[
                    'Always be mindful of what food you have stored.',
                    'Try to consume items closest to expiring over other items to ensure that no food is going to waste.',
                    'Having a clean, organized fridge/freezer helps you stay on top of what you have stored and what you might need on your next grocery run.',
                    'Having items like chicken stored in a container will help it last longer.',
                    "If you notice an item that you haven't eaten that expires soon, store it in the freezer for later use.",
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  Center for Food Safety and Applied Nutrition. (2019). How to Cut Food Waste and Maintain Food
                  Safety. U.S. Food and Drug Administration.
                  https://www.fda.gov/food/consumers/how-cut-food-waste-and-maintain-food-safety
                </Reference>
                <Reference>
                  USDA. (2019, October 2). Food product dating | food safety and inspection service.
                  Www.fsis.usda.gov.
                  https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating
                </Reference>
                <Reference>
                  What Gets Measured Gets Managed: How EPA is Helping to Reduce Food Waste | US EPA. (2021, March 8).
                  US EPA. https://www.epa.gov/snep/what-gets-measured-gets-managed-how-epa-helping-reduce-food-waste
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-4-chapter-2" chapterId="mod3ch3" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
