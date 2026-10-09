import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import BulletedList from '../components/BulletedList';
import DataTable from '../components/DataTable';
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

// Built from Figma node 3728:22456 ("Mod-3-Ch-4 — Tools and Mobile Apps for
// Meal Planning and Tracking", NEST Prototype page) and the source Word doc
// (`CTS M3C4 - meal planning tools and apps.docx`). The Figma source's own
// "Tools to help you meal plan" section used a bespoke "Weekly Meal Planner
// Table (Placeholder)" frame instead of the real ComparisonTable component --
// its own on-canvas description explains why: ComparisonTable only supports
// 2 content columns (+ optional row label), and this weekly notebook example
// needs 6 (Day, Breakfast, Lunch, Dinner, Groceries, Notes). Rather than
// porting that placeholder as-is, built a real, genuinely reusable
// `DataTable` component (see that file) and used it here with the actual
// table data from the source doc -- a blank fill-in-the-blank notebook
// example with only the Breakfast column filled in, matching the doc
// exactly (the blank cells are intentional content, not missing data).
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod3ch1',
    icon: ArticleTextIcon,
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
    active: true,
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

const PLANNER_COLUMNS = ['Day', 'Breakfast', 'Lunch', 'Dinner', 'Groceries', 'Notes'];
const PLANNER_ROWS = [
  ['Monday', 'Oatmeal', '', '', '', ''],
  ['Tuesday', 'Scrambled eggs', '', '', '', ''],
  ['Wednesday', 'Yogurt parfait', '', '', '', ''],
  ['Thursday', 'Sweet potato toast', '', '', '', ''],
  ['Friday', 'Scrambled eggs', '', '', '', ''],
  ['Saturday', 'Oatmeal', '', '', '', ''],
  ['Sunday', 'Yogurt parfait', '', '', '', ''],
];

export default function Module3Chapter4() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod3ch4');
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
                eyebrow="Chapter 4"
                title="Tools and Mobile Apps for Meal Planning and Tracking"
                intro="As you learned in Module 3 Chapter 1, meal planning is the practice of deciding what you will eat ahead of time. It helps with saving time and money, while also allowing you to eat healthier. It can also help you estimate daily calories and track macronutrients like proteins, carbohydrates, fats, fiber, and figure out if you have consumed a variety of foods across different food groups. Planning meals can also improve food choices and save time in cooking (CDC, 2024)."
                imageSrc={asset('/images/module-3-chapter-4/hero.jpg')}
                imageAlt="Tracking meals and calories on a smartphone app"
              />

              <Section id="tools-to-help-you-meal-plan" title="Tools to help you meal plan" sx={{ pt: 0 }}>
                <Typography>
                  It can be helpful to plan meals and track the nutritional information of those meals at the same
                  time. That way, you can make any changes to the meal before you cook or purchase it. For example,
                  let's say you're planning to make pizza at home. When you plan, record, and track the ingredients
                  in advance, you might find that you'll need to use a different type of sauce to make sure you
                  don't consume too much sodium. A variety of tools can help you do this.
                </Typography>
                <Typography>
                  A piece of paper or notebook is a great place to start! You can even practice using the notebook
                  available in your NEST dashboard.
                </Typography>
                <Typography>Here's a visual example of what you could write in a notebook:</Typography>
                <DataTable columns={PLANNER_COLUMNS} rows={PLANNER_ROWS} />
                <Typography>
                  Mobile applications that use a phone, tablet, or computer could also help you with meal planning.
                  You can plan the meal and record the nutritional information in advance, or you could plan the
                  meal and track or edit the nutritional information after you eat it. For example, you might not
                  finish a full portion of your planned meal, and you could update that information on an app.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="common-features-of-tracking-apps" title="Common features of meal planning and nutrition tracking apps">
                <BulletedList
                  items={[
                    'Many nutrition apps allow users to track meals calories, macronutrients, and sometimes micronutrients',
                    'Users have a large database to search for food, drinks, snacks, and all types of supplements.',
                    'Many apps offer barcode scanning for packaged goods to make tracking daily intake easier.',
                    'Some apps have photo-based food logging, where users upload a picture of a meal, and receive an estimated calorie or nutrient breakdown.',
                    'Some apps allow users to save recipes, repeated meals, progress photos, their weight, body measurements, and water intake.',
                    'Having a food scale is ideal for tracking home-cooked meals in grams. You can also use other units such as cups, ounces, or servings. Examples would be 50 grams of meat, or 1 cup of egg whites, or 1 serving of yogurt.',
                    'These apps allow you to save any recipes you make in case you want to eat them another time.',
                    'Beginner-friendly apps often focus on simple calorie and macronutrient tracking, while more advanced ones may include micronutrients and coaching tools, and sometimes the use of AI via premium features.',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-3-chapter-4/item-scan-food.jpg')}
                  alt="Scanning a food barcode with a smartphone app"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="benefits-of-nutrition-tracking-apps" title="Benefits of nutrition tracking apps">
                <BulletedList
                  items={[
                    'An app can track your calories, macronutrients, and micronutrients (PMC, 2022).',
                    'It can track your water intake, snacks, and sometimes your step count.',
                    'It can also keep track of your body weight and measurements.',
                    'You can set goals on these apps, and the app will provide you with an estimated timeline to reach these goals.',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-3-chapter-4/item-calorie-tracker.jpg')}
                  alt="Reviewing calorie and nutrient totals in a tracking app"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="things-to-consider" title="Some things to consider when using a nutrition app to track calories and macronutrient intake">
                <BulletedList
                  items={[
                    'Uploading a photo can be great for logging a meal and information about how much you ate, but it might not be able to correctly guess the calories or macronutrients in the meal based on a photo unless you log that information. For example, an app may not be able to guess how much oil was used from a photograph of a pizza',
                    'Having a food scale can help you log more accurate information about how much you are consuming.',
                    'Measuring portions rather than guessing can be helpful to make sure you are getting the right nutrients and calories from your food.',
                    'Logging even a small bite can be important—small bites can add up',
                    "It's important to let your dietitian know if using an app or meal planning raises any personal triggers for you related to food and eating patterns.",
                    'The food database in apps may not include every food or drink item, so users may still need to enter foods manually',
                    'Barcode scanning is convenient, but it may not always work for homemade foods or less common products',
                    'Some advanced features, like barcode scanning, AI breakdown, and micronutrient tracking, are only available through paid subscriptions.',
                  ]}
                />
                <Typography>
                  Overall, nutrition tracking apps can be helpful because they offer a variety of features for
                  logging food intake, monitoring calories and nutrients, and supporting health goals, but the
                  usefulness of these features depends on the user's needs, skill level, and desire for convenience
                  versus precision. These apps can also be helpful for planning meals and understanding what you're
                  eating at the same time.
                </Typography>
              </Section>

              <SectionDivider />

              <Section sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>Cal AI. (2024). Calai.app. https://www.calai.app/</Reference>
                  <Reference>
                    Carpenter, C. A., Ugwoaba, U. A., Cardel, M. I., &amp; Ross, K. M. (2022). Using self-monitoring
                    technology for nutritional counseling and weight management. DIGITAL HEALTH, 8, 205520762211027.
                    https://doi.org/10.1177/20552076221102774
                  </Reference>
                  <Reference>
                    CDC. (2024). How to Have Healthier Meals and Snacks. Healthy Weight and Growth.
                    https://www.cdc.gov/healthy-weight-growth/healthy-eating/meals-snacks.html
                  </Reference>
                  <Reference>
                    Label Scanner | MacroFactor. (2019). Macrofactorapp.com.
                    https://help.macrofactorapp.com/en/articles/213-label-scanner
                  </Reference>
                  <Reference>
                    Mobile - Photo-Logging. (2025, July 7). Cronometer.
                    https://support.cronometer.com/hc/en-us/articles/39013533811092-Mobile-Photo-Logging
                  </Reference>
                  <Reference>MyFitnessPal. (2025). MyFitnessPal. Myfitnesspal.com. https://www.myfitnesspal.com/</Reference>
                  <Reference>
                    Payne, J. E., Turk, M. T., Kalarchian, M. A., &amp; Pellegrini, C. A. (2021). Adherence to
                    mobile‐app‐based dietary self-monitoring—Impact on weight loss in adults. Obesity Science &amp;
                    Practice, 8(3). https://doi.org/10.1002/osp4.566
                  </Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-4-chapter-2" chapterId="mod3ch4" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
