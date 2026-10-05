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
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';

// Built from Figma node 3709:22128 ("Mod-5-Ch-4 — Adapting Recipes for
// Cuisine, Condition, and Taste", NEST Prototype page), itself built
// 2026-10-01 from the Word doc (no Deliverable reference frame exists for
// this chapter). Three flowing Sections (paragraph + BulletedList, no
// numbered items), each closing with one representative standalone photo --
// no repo images folder exists yet for this chapter, so all 4 photo slots
// (hero + 3 section photos) are "Photo needed" placeholders, matching the
// Figma source exactly rather than fabricating any. The source doc's own
// repeated "Tips:" sub-label before each bullet list was dropped as
// boilerplate scaffolding (same word verbatim 3x, not unique content) --
// only the real bullet content survived, matching the standing
// don't-replicate-boilerplate convention.
function PlaceholderPhoto({ note }) {
  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '16/10',
        borderRadius: 1.5,
        border: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'text.secondary',
        fontSize: 12,
        px: 1.5,
      }}
    >
      {note}
    </Box>
  );
}

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
  {
    chapterId: 'mod5ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Adapting recipes for cuisine, condition, and taste',
    active: true,
    sections: [
      { label: 'Match Your Culture and Traditions', id: 'match-your-culture-and-traditions' },
      { label: 'Cook for Specific Health Needs', id: 'cook-for-specific-health-needs' },
      { label: 'Adjust for Personal Taste', id: 'adjust-for-personal-taste' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  { chapterId: 'mod5-interactive1', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Changing the recipe...' },
  { chapterId: 'mod5-interactive2', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Spices and Herbs Explorer' },
  { chapterId: 'mod5-interactive3', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game Level 3' },
  { chapterId: 'mod5-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 5 Reflection' },
];

export default function Module5Chapter4() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod5ch4');
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
                eyebrow="Chapter 4"
                title="Adapting Recipes for Cuisine, Condition, and Taste"
                intro="Recipes don't always fit every person or family. You may need to change a recipe based on your family's culture, health needs, available ingredients, or just what you like to eat. Small tweaks can make your meals healthier, tastier, and more familiar."
                placeholderNote="Photo needed — hero.jpg"
              />

              <Section id="match-your-culture-and-traditions" title="Match Your Culture and Traditions" sx={{ pt: 0 }}>
                <Typography>
                  Food is a huge part of family tradition. You don't have to give up your favorite cultural foods to
                  eat healthy. Instead, try adjusting a recipe while keeping the flavors and cooking styles you
                  already know and enjoy.
                </Typography>
                <BulletedList
                  items={[
                    'Choose vegetables, grains, proteins, and spices that your family often eats. If a recipe uses an ingredient you do not have or like, replace it with one you enjoy.',
                    'Keep using cooking methods your family likes, such as baking, steaming, or stir-frying. For example, you can add more vegetables to your usual stir-fry instead of making a completely new meal.',
                  ]}
                />
                <PlaceholderPhoto note="Photo needed — a family cooking a cultural dish together" />
              </Section>

              <SectionDivider />

              <Section id="cook-for-specific-health-needs" title="Cook for Specific Health Needs">
                <Typography>
                  Sometimes, you may need to change a recipe to help manage a health condition. If you are cooking
                  for someone with special health needs, follow their doctor's or dietitian's advice. For example, if
                  someone has prediabetes or type 2 diabetes, small changes can help make meals more balanced.
                </Typography>
                <BulletedList
                  items={[
                    'Add non-starchy vegetables such as broccoli, spinach, peppers, mushrooms, or cabbage. These add healthy fiber, bright color, and make the meal more filling.',
                    'Choose whole grains more often. Try brown rice, whole-grain pasta, oats, or other whole grains. Start small by mixing brown rice with white rice or whole-grain pasta with regular pasta.',
                    'Use less sugar in sauces, drinks, and desserts. Try fruit or spices to add natural sweetness and flavor.',
                  ]}
                />
                <PlaceholderPhoto note="Photo needed — a plate with non-starchy vegetables and whole grains" />
              </Section>

              <SectionDivider />

              <Section id="adjust-for-personal-taste" title="Adjust for Personal Taste">
                <Typography>
                  Everyone has different food preferences. Some people love spicy food, while others prefer sweet or
                  mild flavors. Use the tips from Chapter 2 (Enhancing Flavor Through Spices and Herbs) to make
                  recipes work for everyone.
                </Typography>
                <BulletedList
                  items={[
                    'Use herbs and spices to add flavor instead of adding extra salt or sugar.',
                    'Add lemon or lime juice for a fresh flavor.',
                    'Make one small change at a time. This can help you find the right flavor without changing the whole recipe.',
                  ]}
                />
                <PlaceholderPhoto note="Photo needed — fresh herbs, spices, and citrus" />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    "Small changes can make recipes healthier while keeping your family's favorite foods, flavors, and traditions.",
                    'Choose ingredients that support your health needs, such as more vegetables and whole grains.',
                    'Use less sugar and add herbs, spices, lemon, or lime to enhance flavor.',
                    "Adjust recipes to fit your family's tastes and preferences, and try one small change at a time.",
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  Afaya, R. A., Seib, C., McGuire, A., &amp; Petsky, H. (2026). Effectiveness of Culturally Tailored
                  Interventions on Self-Management in Type 2 Diabetes Mellitus: A Systematic Review and
                  Meta-Analysis. Worldviews on evidence-based nursing, 23(4), e70141.
                  https://doi.org/10.1111/wvn.70141
                </Reference>
                <Reference>
                  American Diabetes Association Professional Practice Committee for Diabetes. (2026). 5. Facilitating
                  positive health behaviors and well-being to improve health outcomes: Standards of Care in
                  Diabetes—2026. Diabetes Care, 49(Supplement_1), S89–S131. https://doi.org/10.2337/dc26-S005
                </Reference>
                <Reference>
                  U.S. Department of Agriculture, &amp; U.S. Department of Health and Human Services. (2020). Dietary
                  guidelines for Americans, 2020–2025 (9th ed.).
                  https://www.dietaryguidelines.gov/sites/default/files/2021-03/Dietary_Guidelines_for_Americans-2020-2025.pdf
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-6-chapter-2" chapterId="mod5ch4" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
