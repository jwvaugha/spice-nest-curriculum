import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
import BulletedList from '../components/BulletedList';
import TipExample from '../components/TipExample';
import ComparisonTable from '../components/ComparisonTable';
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';
import { asset } from '../assetPath';

// Built from Figma node 3430:19106 ("Mod-5-Ch-2 — Enhancing Flavor Through
// Spices and Herbs"). First page in Module 5, so the Sidebar's Chapter List
// Slot is built from scratch from the real Figma sidebar (all titles
// verified against the live node, not guessed). "Tips for Using Herbs and
// Spices in Cooking" uses the real row-labeled ComparisonTable (Amount /
// When to Add / Cooking Tip) -- this exact table is where that component's
// design was validated earlier this session. The medication-interaction
// note under "What are the Health Benefits?" is a standalone TipExample
// (not attached to a specific list item -- Figma has it as its own
// Content Slot child after the NumberedList, not nested in item 3).
const SIDEBAR_ITEM_DEFS = [
  { chapterId: 'mod5ch1', icon: ArticleTextIcon, label: 'Chapter 1', title: 'Measuring and portion size techniques' },
  {
    chapterId: 'mod5ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Enhancing flavor through spices and herbs',
    active: true,
    sections: [
      { label: 'Herbs vs. Spices: What’s the Difference?', id: 'herbs-vs-spices' },
      { label: 'What are the Health Benefits?', id: 'health-benefits' },
      { label: 'Tips for Using Herbs and Spices in Cooking', id: 'tips-for-using-herbs-and-spices' },
      { label: 'Example of Tasty Pairings', id: 'example-of-tasty-pairings' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod5ch3',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Substitutions and experimentation',
    to: '/module-5-chapter-3',
    sections: [
      { label: 'Why Try New Things?', id: 'why-try-new-things' },
      { label: 'Experimenting with Cooking Methods', id: 'experimenting-with-cooking-methods' },
      { label: 'Try a Food Swap', id: 'try-a-food-swap' },
      { label: 'Tips for Making Smart Substitutions', id: 'tips-for-making-smart-substitutions' },
      { label: 'Try Plant-Based Swaps', id: 'try-plant-based-swaps' },
      { label: 'It Is Okay to Experiment', id: 'it-is-okay-to-experiment' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  { chapterId: 'mod5ch4', icon: ArticleTextIcon, label: 'Chapter 4', title: 'Adapting recipes for cuisine, condition, and taste' },
  { chapterId: 'mod5-interactive1', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Changing the recipe...' },
  { chapterId: 'mod5-interactive2', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Spices and Herbs Explorer' },
  { chapterId: 'mod5-interactive3', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game Level 3' },
  { chapterId: 'mod5-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 5 Reflection' },
];

export default function Module5Chapter2() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod5ch2');
  useScrollToHash();

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={5} moduleTitle="Cooking and Substitutions" items={sidebarItems} />

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
                title="Enhancing Flavor Through Spices and Herbs"
                imageSrc={asset('/images/module-5-chapter-2/hero.jpg')}
                imageAlt="Assorted fresh herbs and ground spices"
              />

              <Section id="herbs-vs-spices" title="Herbs vs. Spices: What’s the Difference?" sx={{ pt: 0 }}>
                <NumberedList>
                  <NumberedListItem number={1} title="Herbs" imageSrc={asset('/images/module-5-chapter-2/item-herbs.jpg')} imageAlt="Fresh green herbs">
                    Herbs are the green leaves of a plant. You can use them fresh or dried. Examples: basil, parsley,
                    rosemary, thyme, mint, and cilantro.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Spices" imageSrc={asset('/images/module-5-chapter-2/item-spices.jpg')} imageAlt="Assorted ground spices">
                    Spices come from other parts of the plant, like the bark, roots, seeds, or berries. They are
                    almost always dried. Drying them makes their flavor stronger and helps them last longer. Examples:
                    cinnamon (bark), ginger (root), black pepper (berries), and cumin (seeds).
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Seasonings" imageSrc={asset('/images/module-5-chapter-2/item-seasonings.jpg')} imageAlt="Blended seasoning mixes">
                    A blend of spices and herbs. You can use a seasoning blend to easily add many flavors to your food
                    at once. Examples: Italian seasoning (basil, oregano, and thyme), taco seasoning (chili powder,
                    cumin, and garlic), and curry powder (turmeric, coriander, and cumin).
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="health-benefits" title="What are the Health Benefits?">
                <Typography>
                  Using spices and herbs is a simple way to make your meals healthier and protect your body from
                  sickness:
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Lower Your Salt Intake">
                    Herbs and spices can add flavor without adding extra salt. Eating less salt can help support
                    healthy blood pressure, but ask your doctor or dietitian for specific guidance about your salt
                    intake. Note: Some commercial seasoning mixes contain high amounts of salt. Be sure to check the
                    nutrition label and watch the salt content if you are trying to reduce your sodium intake!
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Eat Less Sugar">
                    Certain spices, like cinnamon and nutmeg, taste naturally sweet. Adding them to foods like oatmeal
                    or yogurt helps you eat less added sugar while still enjoying a sweet treat.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Support Your Health">
                    Many herbs and spices contain antioxidants. Antioxidants help protect your body’s cells and
                    support overall health.
                  </NumberedListItem>
                </NumberedList>
                <TipExample label="Note">
                  While spices and herbs are great for your body, they can sometimes change how your medicines work.
                  You should always talk to your doctor or pharmacist to make sure your favorite spices are safe to
                  eat with your daily pills. Sometimes, you might just need to eat your spiced meal a few hours
                  before or after taking your medicine.
                </TipExample>
              </Section>

              <SectionDivider />

              <Section id="tips-for-using-herbs-and-spices" title="Tips for Using Herbs and Spices in Cooking">
                <ComparisonTable
                  columnAHeader="Dried Herbs & Spices"
                  columnBHeader="Fresh Herbs"
                  showRowLabel
                  rows={[
                    { label: 'Amount (3-to-1 Rule)', a: '1 teaspoon. Dried herbs have a much stronger flavor than fresh ones.', b: '1 Tablespoon' },
                    { label: 'When to Add', a: 'Early in cooking', b: 'At the very end of cooking' },
                    { label: 'Cooking Tip', a: 'Heating in a little bit of oil to bring out their best flavor', b: 'Do not cook too long, or they will lose their bright colors and fresh taste' },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="example-of-tasty-pairings" title="Example of Tasty Pairings">
                <BulletedList
                  items={[
                    'Tomato dishes: Basil, oregano, and garlic.',
                    'Beans: Cumin, chili powder, and coriander.',
                    'Chicken and Fish: Rosemary, thyme, dill, and lemon juice.',
                    'Roasted Veggies: Mix your vegetables with a little olive oil, black pepper, and your favorite herb or salt-free seasoning before baking.',
                    'Plain yogurt: Cinnamon, cardamom, and dates.',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-5-chapter-2/item-tasty-pairings.jpg')}
                  alt="Caprese salad with basil, tomato, and fresh herbs"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Herbs are the green leaves of plants. Spices come from the roots, seeds, bark, or berries of plants.',
                    'Herbs and spices add great flavor without needing extra salt or sugar.',
                    'Always add dried spices early in the cooking process and add fresh herbs at the very end of cooking.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  American Heart Association. (n.d.). Common herbs and spices and how to use them deliciously.
                  https://www.heart.org/en/healthy-living/healthy-eating/cooking-skills/preparing/common-herbs-and-spices-how-to-use-them-deliciously
                </Reference>
                <Reference>
                  American Heart Association. (2024, July 17). Shake it or skip it? Here’s expert advice on salt.
                  https://www.heart.org/en/news/2024/07/17/shake-it-or-skip-it-heres-expert-advice-on-salt
                </Reference>
                <Reference>
                  Forks Over Knives. (n.d.). Fresh-to-dried herb conversion guide (plus garlic and onion powder).
                  https://www.forksoverknives.com/how-tos/fresh-to-dried-herb-conversion-guide-plus-garlic-onion-powder/
                </Reference>
                <Reference>
                  Jiang T. A. (2019). Health Benefits of Culinary Herbs and Spices. Journal of AOAC International,
                  102(2), 395–411. https://doi.org/10.5740/jaoacint.18-0418
                </Reference>
                <Reference>
                  National CACFP Association. (2025, June 4). Cooking with herbs and spices.
                  https://www.cacfp.org/2025/06/04/cooking-with-herbs-and-spices/
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-5-chapter-3" chapterId="mod5ch2" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
