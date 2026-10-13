import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import Paragraph from '../components/Paragraph';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
import TipExample from '../components/TipExample';
import HandComparison from '../components/HandComparison';
import VolumeComparison from '../components/VolumeComparison';
import Reference from '../components/Reference';
import ReferenceList from '../components/ReferenceList';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { asset } from '../assetPath';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import { SIDEBAR_ITEM_DEFS } from '../sidebars/module5';

// Built from Figma node 3759:23626 ("Mod-5-Ch-1 — Measuring and Portion Size
// Techniques", NEST Prototype page), itself built 2026-10-12 from the Word
// doc (CTS M5C1). Photos (hero, dry cups, wet cup) synced 2026-10-12 from the
// Figma frame's image fills, matched to the repo drop-folder originals by
// hash/dimensions. Two deliberate departures from that frame:
// - "Cooked vs. Uncooked Volume": Figma shows a static 4-row Comparison
//   Table; here each conversion is a click-to-reveal before/after figure
//   (VolumeComparison, generated SVGs -- see src/viz/volumeComparisons.js),
//   each in its own card with a Reset button; the doc's conversion sentence
//   is always shown, with its cooked amounts shimmering until revealed.
// - Hand-approach items: each gets a composite figure (HandComparison): the
//   hand beside its measuring tool, to scale, same hand frame in all four.
//   The art is the user's hand-tuned Illustrator files (see HandComparison).
// The doc's "≒" sign in the hand titles is kept verbatim (flagged to the user
// as unusual vs. "≈"); its emoji were dropped from the titles.

const HANDS = [
  {
    title: 'Fist ≒ 1 Cup',
    body: 'A closed fist is a good guide for a portion of starchy carbohydrate foods (like taro, potato, kumara, rice, pasta and bread) or legumes (such as chickpeas, lentils and beans).',
    id: 'fist',
  },
  {
    title: 'Palm ≒ 3 oz',
    body: 'The palm of your hand is a useful measure for a portion of red meat or poultry. The thickness of the meat should roughly match the thickness of your palm.',
    id: 'palm',
  },
  {
    title: 'Cupped Hand ≒ 1/2 Cup',
    body: 'A single cupped hand is used for a portion of non-starchy vegetables, such as carrots, broccoli, beetroot, cauliflower, or eggplant.',
    id: 'cupped',
  },
  {
    title: 'Thumb ≒ 1 Tablespoon (Tbsp)',
    body: 'Your thumb represents roughly one tablespoon, which is used for fats like oils, nuts, seeds, nut butters, and cheese.',
    id: 'thumb',
  },
];

export default function Module5Chapter1() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod5ch1');
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
                eyebrow="Chapter 1"
                title="Measuring and Portion Size Techniques"
                intro="Before cooking, it is important to learn how to measure food correctly. Measuring helps with following recipes and can support healthy eating habits and balanced meals."
                imageSrc={asset('/images/module-5-chapter-1/hero.jpg')}
                imageAlt="A hand holding a small portion of macadamia nuts over a plate of nuts"
              />

              <Section id="what-are-portion-sizes" title="What are Portion Sizes?" sx={{ pt: 0 }}>
                <Typography>
                  Before measuring food, it is important to first clarify the difference between two commonly used
                  terms: “Portion Size” and “Serving Size.”
                </Typography>
                <Paragraph label="Serving Size">
                  A standardized, objective unit of measurement used on food packaging to quantify nutritional content
                  and help consumers compare different foods.
                </Paragraph>
                <Paragraph label="Portion Size">
                  The subjective amount of food you actually choose to put on your plate and consume in one sitting.
                </Paragraph>
              </Section>

              <SectionDivider />

              <Section id="measuring-tools" title="Measuring Tools: Dry vs. Wet Measuring Cups">
                <Typography>
                  In cooking, understanding the physical properties of ingredients and choosing the corresponding tools
                  is step one. Using the wrong type of measuring cup can lead to measurement errors.
                </Typography>
                <NumberedList>
                  <NumberedListItem
                    number={1}
                    title="Dry Measuring Cups"
                    imageFirst
                    imageSrc={asset('/images/module-5-chapter-1/item-dry-measuring-cups.jpg')}
                    imageAlt="A set of dry measuring cups from ¼ cup to 1 cup"
                    bullets={[
                      <>
                        <strong>Spoon and Level:</strong> Lightly spoon the ingredient into the cup until it is
                        slightly heaping, then use the straight edge of a knife or ruler to “level off” the excess.
                      </>,
                      <>
                        <strong>Do Not Pack:</strong> Unless a recipe specifically calls for it (e.g., packed brown
                        sugar), do not press or pack the ingredients down, as this will result in too much volume.
                      </>,
                    ]}
                  >
                    <strong>Best for:</strong> Solid ingredients like oats, flour, sugar, nuts, uncooked rice, and
                    chopped fruits.
                  </NumberedListItem>
                  <NumberedListItem
                    number={2}
                    title="Wet/Liquid Measuring Cups"
                    imageFirst
                    imageSrc={asset('/images/module-5-chapter-1/item-wet-measuring-cups.jpg')}
                    imageAlt="Water pouring from a glass liquid measuring cup with printed measurement lines"
                    bullets={[
                      <>
                        <strong>Eye-Level Reading:</strong> Place the measuring cup on a flat, level surface before
                        pouring the liquid.
                      </>,
                      <>
                        <strong>Check the Meniscus:</strong> Bend down so your eyes are exactly level with the liquid.
                        Read the measurement at the lowest point of the curved surface (the meniscus) for an accurate
                        reading.
                      </>,
                    ]}
                  >
                    <strong>Best for:</strong> Fluids like water, milk, juice, and cooking oils.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="cooked-vs-uncooked-volume" title="Physical Changes in Ingredients: Cooked vs. Uncooked Volume">
                <Typography>
                  Food changes significantly in weight and volume during the cooking process due to moisture loss or
                  absorption. Understanding how food changes during cooking helps you estimate exactly how much to buy at
                  the grocery store.
                </Typography>
                <TipExample label="Note">
                  When provided with recommendations from a dietitian or other clinician about how much to consume, it
                  is important to clarify with them whether they are referring to the dry (uncooked) food or cooked
                  food.
                </TipExample>
                <Paragraph label="Starches & Grains (Expansion)">
                  Rice, noodles, and oats absorb a significant amount of water when boiled.
                </Paragraph>
                <VolumeComparison
                  id="rice"
                  reveal
                  caption="1 cup of dry, uncooked rice yields about [3 cups] of cooked rice ([1:3] ratio)."
                />
                <VolumeComparison
                  id="pasta"
                  reveal
                  caption="1 cup of dry pasta yields roughly [2 cups] of cooked pasta ([1:2] ratio)."
                />
                <Paragraph label="Proteins / Meats (Shrinkage)">
                  Meat loses water and fat during cooking, reducing its weight by approximately 25%.
                </Paragraph>
                <VolumeComparison
                  id="meat"
                  reveal
                  caption="4 ounces (oz) of raw, lean meat yields about [3 ounces (oz)] of cooked meat."
                />
                <Paragraph label="Vegetables (Shrinkage)">
                  Leafy greens (like spinach) have high water content and shrink drastically when cooked.
                </Paragraph>
                <VolumeComparison
                  id="greens"
                  reveal
                  caption="1 cup of raw leafy greens is nutritionally equivalent to about [1/2 cup] of cooked vegetables."
                />
              </Section>

              <SectionDivider />

              <Section id="hand-approach" title="Your Portable Measuring Tool: The Hand-Approach">
                <Typography>
                  When you don't have measuring tools on hand, your hands serve as the most convenient instruments for
                  visual estimation.
                </Typography>
                <NumberedList>
                  {HANDS.map((h, i) => (
                    <NumberedListItem
                      key={h.title}
                      number={i + 1}
                      title={h.title}
                      extra={<HandComparison id={h.id} />}
                    >
                      {h.body}
                    </NumberedListItem>
                  ))}
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="references" sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>
                    America's Test Kitchen. (n.d.). Do you really have to use different measuring cups for liquid and
                    dry ingredients?
                    https://www.americastestkitchen.com/articles/5516-do-you-really-have-to-use-different-measuring-cups-for-liquid-and-dry-ingredients
                  </Reference>
                  <Reference>
                    Heart Foundation. (n.d.). Portion sizes.
                    https://www.heartfoundation.org.nz/wellbeing/healthy-eating/portion-sizes
                  </Reference>
                  <Reference>
                    MedlinePlus. (n.d.). Portion size. National Library of Medicine.
                    https://medlineplus.gov/ency/patientinstructions/000337.htm
                  </Reference>
                  <Reference>
                    National Institute of Diabetes and Digestive and Kidney Diseases. (n.d.). Food Portions: Choosing
                    Just Enough for You. U.S. Department of Health and Human Services.
                    https://www.niddk.nih.gov/health-information/weight-management/just-enough-food-portions#home
                  </Reference>
                  <Reference>
                    Precision Nutrition. (2019). Hand portion guide.
                    https://assets.precisionnutrition.com/2019/09/Hand-portion-guide-FF.pdf
                  </Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-5-chapter-2" chapterId="mod5ch1" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
