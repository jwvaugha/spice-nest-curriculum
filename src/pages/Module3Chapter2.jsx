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
import TwoColumnList from '../components/TwoColumnList';
import BulletedList from '../components/BulletedList';
import ComparisonTable from '../components/ComparisonTable';
import SequenceTimeline from '../components/SequenceTimeline';
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';

// Built from Figma node 3429:18490 ("Mod-3-Ch-2 — Cook Once, Eat Twice").
// First page to use real Bulleted List (BulletedList.jsx) and a List nested
// inside a List Item ("Thawing Safety" containing its own "Cold Water
// Thawing"/"Microwave Thawing" sub-items via NumberedListItem's `extra`
// prop). Updated 2026-09-21 to match the Figma page's own subsequent
// edits: the old dashed-orange ComparisonTable placeholder is now the real
// row-based ComparisonTable (Shelf Life and Food Storage), the "Quick
// Example" Day 1/Day 2 pair is now a SequenceTimeline, and the design-note/
// placeholder-photo slots Figma resolved (real photos, or removed outright)
// are reflected the same way here. Every section's content is passed as
// FLAT children directly to `Section` — no page-level Stack/mb spacing —
// since Section owns the real, uniform 32px Content Slot gap between every
// piece of content itself (see Section.jsx / layoutConstants.js).
//
// First page in Module 3, so the Sidebar's Chapter List Slot is built from
// scratch (real titles harvested directly from the Figma sidebar instance,
// not the CSV roadmap, since Figma's own Chapter 2 nav label ("Efficiency
// Strategies") deliberately differs from its hero title — preserved as-is,
// not "corrected").
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
    active: true,
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
    to: '/module-3-chapter-3',
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

export default function Module3Chapter2() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  // The scrollable pane itself resizes instantly (plain CSS flex); only the
  // reading column's own width waits for the resize to settle, so body text
  // isn't rewrapping on every intermediate pixel of a window drag.
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod3ch2');
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
                eyebrow="Chapter 2"
                title="Cook Once, Eat Twice: Strategies for Simplifying Cooking"
                intro='Meal preparation ("meal prep") can save time, lower stress, control chronic illness, and make healthy eating easier during the week.'
                imageSrc="/images/module-3-chapter-2/hero.jpg"
                imageAlt="Sheet pan meal prep with roasted vegetables and protein"
              />

              <Section id="why-this-matters" title="Why This Matters" sx={{ pt: 0 }}>
                <BulletedList
                  items={[
                    'Meal planning can help you ensure you’re including important nutrients in daily meals, purchasing the right groceries to prepare those meals, and can save time and cost',
                    'Meal preparation ("meal prep") can save time, lower stress, control chronic illness and make healthy eating easier during the week.',
                    'Preparing foods ahead of time can also help reduce food waste and make it easier to use what you already have at home.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="prepping-in-advance-batch-cooking" title="Prepping in Advance & Batch Cooking">
                <Typography variant="h6">What is prepping in advance?</Typography>
                <Typography>
                  Prepping in advance means getting ingredients, foods, or meals ready before you need them. This can
                  make cooking faster and easier later.
                </Typography>
                <BulletedList
                  items={[
                    'Wash and cut fruits and vegetables so they are ready to use.',
                    'Cook staple foods ahead of time such as rice, beans, pasta, or roasted vegetables.',
                    'Prepare proteins in advance such as chicken, fish, lentils, or ground turkey.',
                    'Chop common ingredients at one time such as onions, peppers, or garlic.',
                    'Store foods in clear containers so they are easy to find and use.',
                  ]}
                />
                <Typography variant="h6">What is batch cooking?</Typography>
                <Typography>
                  Batch cooking means making a larger amount of food at one time and using it for more than one meal.
                </Typography>
                <Typography variant="h6">Why batch cooking helps</Typography>
                <BulletedList
                  items={[
                    'It saves time: You cook once instead of cooking from scratch every day.',
                    'It lowers stress: Meals are easier when some of the work is already done.',
                    'It can save money: Using ingredients more than one time can reduce waste.',
                    'It supports healthier eating: Home-cooked meals are often easier to plan and portion.',
                  ]}
                />
                <Box
                  component="img"
                  src="/images/module-3-chapter-2/item-batch-cooking.jpg"
                  alt="Sheet pan of roasted potatoes and vegetables prepared in batch"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="tips-for-successful-meal-prep" title="Tips for Successful Meal Prep">
                <Typography color="text.secondary">These simple steps can make meal prep easier.</Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Make a Plan">
                    Choose a few meals for the next few days. Keep it simple at first.
                  </NumberedListItem>
                  <NumberedListItem
                    number={2}
                    title="Pick a Prep Style"
                    bullets={['Cook full meals ahead, OR', 'Cook ingredients ahead and mix them into different meals later']}
                  >
                    You can:
                  </NumberedListItem>
                  <NumberedListItem
                    number={3}
                    title="Choose Foods That Store Well"
                    bullets={['Beans and lentils', 'Cooked grains', 'Soups and stews', 'Roasted vegetables', 'Cooked chicken or turkey']}
                    imageSrc="/images/module-3-chapter-2/item-foods-that-store-well.jpg"
                    imageAlt="Beans being stored in a sealed container"
                  >
                    Some foods work especially well for meal prep. Examples include:
                  </NumberedListItem>
                  <NumberedListItem number={4} title="Think About Reuse">
                    Ask yourself, how else can I use this food later this week?
                  </NumberedListItem>
                  <NumberedListItem
                    number={5}
                    title="Label and Date Everything"
                    imageSrc="/images/module-3-chapter-2/item-label-and-date.jpg"
                    imageAlt="Container labeled with food name and date"
                  >
                    Write the name of the food and the date on the container. This helps you remember what to use
                    first.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="shelf-life-and-food-storage" title="Shelf Life and Food Storage">
                <Typography>Food safety is an important part of meal prep.</Typography>
                <NumberedList>
                  <NumberedListItem
                    number={1}
                    title="Refrigerator Safety"
                    bullets={[
                      'Put leftovers in the refrigerator soon after eating.',
                      'Use small, shallow containers so food cools faster.',
                      'Most leftovers should be used within 3 to 4 days or frozen for 3 to 4 months.',
                    ]}
                  />
                  <NumberedListItem
                    number={2}
                    title="Freezer Safety"
                    bullets={[
                      'Freeze foods you will not use right away.',
                      'Freezing helps food last longer.',
                      'Foods may stay safe in the freezer for a long time but can lose moisture and flavor over time.',
                    ]}
                  />
                  <NumberedListItem
                    number={3}
                    title="Reheating Safety"
                    bullets={['Reheat leftovers until they reach 165°F.', 'Only reheat the amount you plan to eat.']}
                  />
                  <NumberedListItem
                    number={4}
                    title="Thawing Safety"
                    bullets={['In the refrigerator', 'In the microwave', 'In cold water']}
                    extra={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Note: Refrigerator thawing takes the longest, but the leftovers stay safe the entire time.
                        </Typography>
                        <TwoColumnList
                          columns={[
                            {
                              header: 'Cold Water Thawing',
                              description: 'Faster than refrigerator thawing but requires more attention.',
                              items: [
                                'Keep food in a sealed, leak-proof bag',
                                'Place the bag in cold tap water',
                                'Change the water every 30 minutes to keep it cold',
                                'Cook the food right after thawing',
                                'Do not refreeze food unless it has been cooked first',
                              ],
                            },
                            {
                              header: 'Microwave Thawing',
                              items: ['Cook the food immediately after thawing', 'Cook before refreezing.'],
                            },
                          ]}
                        />
                      </>
                    }
                  >
                    Be sure to use a safe method. Some safe ways to thaw frozen foods include:
                  </NumberedListItem>
                </NumberedList>
                <ComparisonTable
                  columnAHeader="Storage Type"
                  columnBHeader="Examples"
                  rows={[
                    { a: 'Freezer friendly', b: 'Chopped onions, fresh meat, ginger paste, etc.' },
                    { a: 'Pantry (shelf-stable)', b: 'Uncooked rice, dry beans, dry legumes, unopened tomato paste, nuts, etc.' },
                    { a: 'Refrigerator-safe', b: 'Soups, stews, broths, etc.' },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="cook-once-eat-twice" title="Cook Once, Eat Twice">
                <Typography>
                  Cooking a little extra can save time and make it easier to prepare another meal later in the week.
                </Typography>
                <Typography variant="h6">How to Use This Strategy</Typography>
                <BulletedList
                  items={[
                    'Cook a little extra when making a meal.',
                    'Store the extra food safely.',
                    'Use it to make a different meal later in the week.',
                  ]}
                />
                <SequenceTimeline
                  eyebrow="Quick Example"
                  steps={[
                    { title: 'Cook', description: 'Cook roasted chicken, broccoli, and sweet potatoes.' },
                    { title: 'Repurpose', description: 'Use the extra chicken and sweet potatoes in wraps, quesadillas, or a grain bowl.' },
                  ]}
                />
                <Typography>
                  This approach helps turn leftovers into a new meal instead of eating the exact same plate again.
                </Typography>
                <Typography variant="h6">Foods to Use With Care</Typography>
                <Typography>Some foods do not hold up as well over time, especially in the freezer, such as:</Typography>
                <BulletedList items={['Lettuce', 'Cucumbers', 'Other high-water vegetables (like celery, tomatoes, zucchini, etc.)']} />
              </Section>

              <SectionDivider />

              <Section id="key-takeaway" title="Key Takeaway">
                <BulletedList
                  items={[
                    'Preparing foods ahead of time can make healthy eating easier.',
                    'Small steps like washing produce, cooking extra ingredients, and storing food safely can save time, reduce stress, and help caregivers put meals together more easily during the week.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  Klein, L., &amp; Parks, K. (2020). Home Meal Preparation: A Powerful Medical Intervention. American
                  journal of lifestyle medicine, 14(3), 282–285.
                  https://doi-org.proxy2.library.illinois.edu/10.1177/1559827620907344
                </Reference>
                <Reference>
                  Holmes, C., &amp; Misenhelter, C. (2024). Cooking for One or Two: Fact Sheet. K-State Research and
                  Extension. Kansas State University Extension.
                  https://bookstore.ksre.ksu.edu/item/cooking-for-one-or-two-fact-sheet_MF3659
                </Reference>
                <Reference>
                  USDA. Meal Prep and Cooking Tips. Nutrition.gov. U.S. Department of Agriculture.
                  https://www.nutrition.gov/topics/shopping-cooking-and-meal-planning/meal-prep-and-cooking-tips
                </Reference>
                <Reference>
                  USDA. Utah State University Extension. Cook Once, Eat Twice Sample Meal Plan.
                  https://extension.usu.edu/nutrition/files/Cook-Once-Eat-Twice.pdf
                </Reference>
                <Reference>
                  USDA. Utah State University Extension. Food Waste Prevention Part 4: Using Leftovers.
                  https://extension.usu.edu/nutrition/research/food-waste-part-4
                </Reference>
                <Reference>
                  Academy of Nutrition and Dietetics. (2024). Cook Once, Eat Safely throughout the Week.
                  https://www.eatright.org/food/home-food-safety/safe-cooking-and-prep/cook-once-eat-safely-throughout-the-week
                </Reference>
                <Reference>
                  USDA. Leftovers and Food Safety. Food Safety and Inspection Service. U.S. Department of Agriculture.
                  http://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety
                </Reference>
                <Reference>
                  USDA. The Big Thaw - Safe Defrosting Methods.
                  https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/big-thaw-safe-defrosting-methods
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-3-chapter-3" chapterId="mod3ch2" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
