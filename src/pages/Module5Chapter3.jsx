import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import BulletedList from '../components/BulletedList';
import Paragraph from '../components/Paragraph';
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


// Built from Figma node 3431:19489 ("Mod-5-Ch-3 — Substitutions and
// Experimentation"), NEST Prototype page. Two real ComparisonTable uses
// (Cooking Methods, Food Swap) -- both row-paired, no row label, matching
// this session's own audit of these exact tables against their source Word
// doc. Only one Image exists anywhere in this chapter's real Figma content
// (in "Try Plant-Based Swaps") -- originally left as a placeholder (no real
// imageHash, no local drop-folder), both since resolved 2026-09-24: Figma
// got a real photo for that slot, and a matching local hero + item photo
// (Cooking-solo-hero.jpeg, plant-based-cauliflower.jpeg) landed in
// `Chapter Content/Images/Module 5/Chapter 3/` around the same time --
// sourced locally per the standing local-over-Figma-reexport preference.
const SIDEBAR_ITEM_DEFS = [
  { chapterId: 'mod5ch1', icon: ArticleTextIcon, label: 'Chapter 1', title: 'Measuring and portion size techniques' },
  {
    chapterId: 'mod5ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Enhancing flavor through spices and herbs',
    to: '/module-5-chapter-2',
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
    active: true,
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

export default function Module5Chapter3() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod5ch3');
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
                eyebrow="Chapter 3"
                title="Substitutions and Experimentation"
                intro="Trying new foods or cooking methods can help you use what you already have, save money, and enjoy new flavors."
                imageSrc={asset('/images/module-5-chapter-3/hero.jpg')}
                imageAlt="Cooking a meal solo in the kitchen"
              />

              <Section id="why-try-new-things" title="Why Try New Things?" sx={{ pt: 0 }}>
                <Typography>Trying new foods or cooking methods can help you:</Typography>
                <BulletedList
                  items={[
                    'Use foods you already have',
                    'Save money',
                    'Reduce food waste',
                    'Meet your health and nutritional needs',
                    'Enjoy new foods and flavors',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="experimenting-with-cooking-methods" title="Experimenting with Cooking Methods">
                <Typography>
                  Trying different cooking methods can change the flavor and texture of foods. Examples include:
                </Typography>
                <ComparisonTable
                  columnAHeader="Cooking Method"
                  columnBHeader="Examples"
                  rows={[
                    { a: 'Roast, bake, or broil', b: 'Chicken, sweet potatoes' },
                    { a: 'Saute, pan-fry, or stir-fry (using a small amount of oil)', b: 'Bell peppers, mushrooms' },
                    { a: 'Grill', b: 'Fish, zucchini' },
                    { a: 'Steam', b: 'Broccoli, carrots' },
                  ]}
                />
                <Paragraph label="Healthy Tip">
                  These cooking methods can be good alternatives to deep-frying and may support heart health.
                </Paragraph>
              </Section>

              <SectionDivider />

              <Section id="try-a-food-swap" title="Try a Food Swap">
                <Typography>
                  Sometimes you can use one food instead of another in a recipe. You may try a food swap if:
                </Typography>
                <BulletedList
                  items={[
                    'You have run out of an ingredient',
                    'You want a healthier choice',
                    'You have a food allergy, sensitivity or intolerance',
                    'You follow a special eating plan',
                    'You want to save money',
                    'You want to try something new',
                    'You are cooking for multiple people with different dietary requirements or preferences',
                  ]}
                />
                <Typography variant="h6">Examples of Food Swaps</Typography>
                <ComparisonTable
                  columnAHeader="Instead of…"
                  columnBHeader="Try…"
                  rows={[
                    { a: 'White rice', b: 'Brown rice' },
                    { a: 'Sour cream', b: 'Plain Greek Yogurt' },
                    { a: 'Butter', b: 'Olive oil (for cooking)' },
                    { a: 'Ground beef', b: 'Beans or lentils (in soups, chili, or tacos)' },
                    { a: 'Sugary drinks', b: 'Water with fruit slices or sparkling water' },
                    { a: 'White bread', b: 'Whole wheat bread' },
                    { a: 'Salt', b: 'Herbs, spices, lime juice, vinegar, etc.' },
                    { a: 'Heavy cream', b: 'Low-fat milk or evaporated milk (in some recipes)' },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="tips-for-making-smart-substitutions" title="Tips for Making Smart Substitutions">
                <Typography>Keep these tips in mind:</Typography>
                <BulletedList
                  items={[
                    'Choose foods with a similar flavor or texture',
                    'Think about how the ingredient works in the recipe',
                    'Start with one substitution at a time',
                    'Taste your food and adjust if needed',
                    'Write down substitutions that work well',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="try-plant-based-swaps" title="Try Plant-Based Swaps">
                <Typography>Plant-based foods can be another healthy option. Examples:</Typography>
                <BulletedList
                  items={[
                    'Use beans or lentils instead of meat in soups or stews.',
                    'Try tofu instead of chicken in a stir-fry.',
                    'Use plain soy yogurt instead of sour cream.',
                  ]}
                />
                <Typography>Choose foods that fit your taste, culture, and health needs.</Typography>
                <Box
                  component="img"
                  src={asset('/images/module-5-chapter-3/item-plant-based-swaps.jpg')}
                  alt="Cauliflower and other plant-based ingredients"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="it-is-okay-to-experiment" title="It Is Okay to Experiment">
                <Typography>Cooking is a skill that gets better with practice. Start small by trying:</Typography>
                <BulletedList
                  items={[
                    'One new fruit or vegetable.',
                    'A different whole grain.',
                    'A new bean added to a soup or salad.',
                    'A different cooking oil.',
                    'A healthy ingredient swap in a favorite recipe.',
                  ]}
                />
                <Typography>If you like it, add it to your meal plan.</Typography>
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Ingredient substitutions can help you cook with what you have',
                    'Healthy swaps can save money and add variety',
                    'Small changes can make your meals healthier',
                    'It can be fun to try new foods and recipes',
                    'Find what works best for you and your family',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  Shirai, S. S., Seneviratne, O., Gordon, M. E., Chen, C. H., &amp; McGuinness, D. L. (2021).
                  Identifying Ingredient Substitutions Using a Knowledge Graph of Food. Frontiers in artificial
                  intelligence, 3, 621766. https://doi-org.proxy2.library.illinois.edu/10.3389/frai.2020.621766
                </Reference>
                <Reference>
                  Kim, H., Venkataramanan, R., &amp; Sheth, A. (2024). A Survey on Food Ingredient Substitutions.
                  arXiv. https://doi.org/10.48550/arXiv.2501.01958
                </Reference>
                <Reference>
                  Alice Henneman (2020) University of Nebraska-Lincoln Extension. Basic Ingredient Substitutions.
                  https://food.unl.edu/article/ingredient-substitutions/
                </Reference>
                <Reference>
                  Julie Garden-Robinson (Reviewed 2023). Ingredient Substitution. NDSU Extension.
                  https://www.ndsu.edu/agriculture/sites/default/files/2023-01/fn198.pdf
                </Reference>
                <Reference>
                  Philippi Rosane, B., Okoren, L., Andersen, B. V., Byrne, D. V., &amp; Bügel, S. G. (2026). What Is
                  the Role of Plant-Based Alternatives to Animal Foods in the Great Food Transformation: A Narrative
                  Review. The Journal of nutrition, 156(2), 101275.
                  https://doi-org.proxy2.library.illinois.edu/10.1016/j.tjnut.2025.101275
                </Reference>
                <Reference>
                  New Mexico State University Extension. (2016). In a Pinch: Ingredient Substitution.
                  https://pubs.nmsu.edu/_e/E131.pdf
                </Reference>
                <Reference>
                  Lee, S., Choi, Y., Jeong, H. S., Lee, J., &amp; Sung, J. (2017). Effect of different cooking methods
                  on the content of vitamins and true retention in selected vegetables. Food science and
                  biotechnology, 27(2), 333–342. https://doi-org.proxy2.library.illinois.edu/10.1007/s10068-017-0281-1
                </Reference>
                <Reference>
                  USDA. Methods for Healthy Cooking (2024). Food and Nutrition Administration.
                  https://www.fna.usda.gov/tn/methods-healthy-cooking
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-6-chapter-2" chapterId="mod5ch3" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
