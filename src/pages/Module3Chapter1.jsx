import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
import BulletedList from '../components/BulletedList';
import Reference from '../components/Reference';
import ReferenceList from '../components/ReferenceList';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import { asset } from '../assetPath';

// Built from Figma node 3427:18043 ("Mod-3-Ch-1 — Creating a Meal Plan &
// Grocery List"). Sidebar's Chapter List Slot mirrors Module3Chapter2.jsx's
// (same module) with Chapter 1 now active/expanded and Chapter 2 collapsed
// with a `to` link instead. "Two Ways to Plan Your Meals" is a genuine
// Benefits/Cons pros-and-cons comparison for each of its 2 approaches --
// rendered with NumberedListItem's `extra` escape hatch (H6 + BulletedList
// pairs), matching how the Figma source itself builds it out of existing
// List Item + H6 Subtitle + Bulleted List components. The Figma page carries
// its own Design Note flagging this as a candidate for a dedicated Pros/Cons
// component if the pattern recurs -- reproduced verbatim below.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod3ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Creating a meal plan and aligning with grocery list',
    active: true,
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
    icon: ArticleTextIcon,
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
    icon: ArticleTextIcon,
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
  {
    chapterId: 'mod3ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Tools and mobile apps for meal planning and tracking',
    to: '/module-3-chapter-4',
    sections: [
      { label: 'Tools to help you meal plan', id: 'tools-to-help-you-meal-plan' },
      { label: 'Common features of tracking apps', id: 'common-features-of-tracking-apps' },
      { label: 'Benefits of nutrition tracking apps', id: 'benefits-of-nutrition-tracking-apps' },
      { label: 'Things to consider', id: 'things-to-consider' },
    ],
  },
  { chapterId: 'mod3ch5', icon: ArticleTextIcon, label: 'Chapter 5', title: 'Meal Planning Organizer' },
  { chapterId: 'mod3-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 3 Reflection' },
];

export default function Module3Chapter1() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod3ch1');
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
                eyebrow="Chapter 1"
                title="Creating a Meal Plan & Grocery List"
                intro="Learning how to efficiently plan meals and grocery shopping can save you time and money. It also cuts down on food waste and helps you stay healthy."
                imageSrc={asset('/images/module-3-chapter-1/hero.jpg')}
                imageAlt="Weekly meal plan and grocery list on a kitchen counter"
              />

              <Section id="two-ways-to-plan-your-meals" title="Two Ways to Plan Your Meals" sx={{ pt: 0 }}>
                <NumberedList>
                  <NumberedListItem
                    number={1}
                    title="Plan Meals Before You Shop"
                    imageSrc={asset('/images/module-3-chapter-1/item-plan-meals-before-you-shop.jpg')}
                    imageAlt="Handwritten grocery list"
                    extra={
                      <>
                        <Typography variant="h6">Benefits</Typography>
                        <BulletedList
                          items={[
                            'It helps you stay organized',
                            'It reduces impulse purchases and saves you money',
                            'Makes it easier to follow recipes',
                            'It is great for people on strict diets',
                          ]}
                        />
                        <Typography variant="h6">Cons</Typography>
                        <BulletedList
                          items={[
                            'Not very flexible. If you find a great surprise sale at the store, it might not fit your meal plan',
                            'If items aren’t available when you shop, you’ll need to consider substitutes or alternatives',
                            'You’ll need to plan ahead to make sure ingredients for dishes stay good for use later in the week',
                          ]}
                        />
                      </>
                    }
                  >
                    Decide what you want to eat for the week first. Then make a grocery list and buy only what you
                    need.
                  </NumberedListItem>
                  <NumberedListItem
                    number={2}
                    title="Shop Essentials First, Plan Later"
                    imageSrc={asset('/images/module-3-chapter-1/item-shop-essentials-first.jpg')}
                    imageAlt="Seasonal produce on sale at a grocery store"
                    extra={
                      <>
                        <Typography variant="h6">Benefits</Typography>
                        <BulletedList
                          items={[
                            'It lets you take advantage of store sales and fresh, seasonal food.',
                            'You can purchase items that fulfill different food groups or macronutrient groups. For example, you can plan to purchase 3-5 vegetables of different colors (like carrots, spinach, tomatoes, eggplant, and yellow squash), 2-4 fruits (like bananas, oranges, apples, and strawberries), 2-3 protein sources (like tofu, chicken, and fish), 2-3 grains (like whole wheat bread, quinoa, and rice), and 2-3 dairy products (like yogurt, cheese, and milk). Then you can prepare meals each day that use 1-2 items from each food group.',
                          ]}
                        />
                        <Typography variant="h6">Cons</Typography>
                        <BulletedList
                          items={[
                            'You have to be more creative in the kitchen. It can be hard if you do not know how to turn assorted items into a full meal.',
                            'You might end up buying more than you need—for example, if you end up with leftovers from a couple of meals, then some of your items may go unused.',
                          ]}
                        />
                      </>
                    }
                  >
                    You go to the store to stock up on sales, fresh produce, and basic pantry items. When you get
                    home, you plan your weekly menu using what you just bought.
                  </NumberedListItem>
                </NumberedList>
                <Typography>There is no single "right" way. Choose the method that works best for you and your family.</Typography>
              </Section>

              <SectionDivider />

              <Section id="tips-for-meal-planning" title="Tips for Meal Planning">
                <Typography>No matter which way you pick, these four steps will help you plan your meals much better:</Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Check Your Schedule">
                    Look at your calendar before planning a single meal. Do you have a late practice on Tuesday? Is
                    there a party on Thursday? For busy nights, plan quick 15-minute meals or plan to eat leftovers.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Ask Your Family">
                    Talk to your family about what they like to eat. Also, think about exactly how many people you
                    need to feed each night.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Check What You Have">
                    People often skip this step! Look inside your fridge, freezer, and pantry. Find foods that might
                    go bad soon and use them for your meals early in the week.
                  </NumberedListItem>
                  <NumberedListItem number={4} title="Use Ingredients Twice">
                    Smart planning means using the same food in different meals. If you buy a big bag of spinach, use
                    half for a stir-fry on Monday and the rest for a salad on Wednesday. This stops food from going
                    bad in the back of the fridge.
                  </NumberedListItem>
                  <NumberedListItem number={5} title="Consider Freezing Extra Items">
                    Let's say you bought too many carrots—you could peel, chop, and freeze a portion to use later.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="tips-for-making-a-grocery-list" title="Tips for Making a Grocery List">
                <Typography>Taking a neat list to the store stops you from buying things you do not need and helps you remember everything.</Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Keep a Running List">
                    Do not wait until the last minute to figure out what you need. Write down items on your phone or
                    a fridge notepad as soon as you notice them getting low.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Group Your List">
                    Organize your list by supermarket sections (produce, meat, dairy, frozen foods). This helps you
                    walk through the store easily without running back and forth.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Write Exact Amounts">
                    Do not just write "chicken" or "apples." Write "2 lbs of chicken" or "5 apples." This stops you
                    from buying too little or way too much.
                  </NumberedListItem>
                  <NumberedListItem number={4} title="Bring Your List to Store">
                    Always bring your list to the store and stick to it when possible.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="tips-for-meal-preparation" title="Tips for Meal Preparation">
                <Typography>
                  Now that you have purchased everything you need for your weekly meals, you'll need to decide how
                  often you'll cook, how to store meals, and how to manage leftovers.
                </Typography>
                <Typography>
                  Consider how much time you have each day. For example, you could pick two days of the week to cook
                  full meals for the subsequent few days. Another option is to prepare all ingredients (chop
                  vegetables, clean and slice fruits, cook grains, season and store proteins) and then combine into
                  meals prior to eating.
                </Typography>
                <Typography>
                  Some of the meals you have prepared might freeze well and could be stored for future meals.
                </Typography>
                <Box
                  component="img"
                  src={asset('/images/module-3-chapter-1/item-meal-preparation.jpg')}
                  alt="Prepped ingredients in containers, ready to combine into meals"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Meal planning can save time and money',
                    'You can plan meals before shopping or plan meals after shopping',
                    'A grocery list helps you stay organized and avoid unnecessary purchases',
                    'Using foods you already have can help reduce waste',
                    'Preparing meals or ingredients in advance can help save time on busy days',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>
                    Gordon, B. (2019, July 18). 3 strategies for successful meal planning. Academy of Nutrition and
                    Dietetics. https://www.eatright.org/food/planning/smart-shopping/3-strategies-for-successful-meal-planning
                  </Reference>
                  <Reference>
                    Harvard T.H. Chan School of Public Health. (n.d.). Meal prep guide. The Nutrition Source.
                    https://nutritionsource.hsph.harvard.edu/meal-prep/
                  </Reference>
                  <Reference>
                    University of Illinois Extension. (n.d.). Make a plan. Eat. Move. Save.
                    https://eat-move-save.extension.illinois.edu/save/make-plan
                  </Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-3-chapter-2" chapterId="mod3ch1" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
