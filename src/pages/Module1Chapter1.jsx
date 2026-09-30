import Box from '@mui/material/Box';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
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
import { asset } from '../assetPath';


// Built from Figma node 3392:17695 ("Mod-1-Ch-1 — Why Diet Matters"), NEST
// Prototype page. No per-item photos exist anywhere in the real Figma
// source (confirmed directly via use_figma -- zero Image instances in Body
// Content), matching CLAUDE.md's note that most of this chapter's imagery
// is Figma's own shared generic-filler hash rather than real content -- so
// the body content carries none, rather than inventing photos or leaving
// "Photo needed" placeholders for slots that don't exist in the source at
// all. The hero photo (added 2026-09-24) is the one exception -- Figma
// never had a hero Image slot for this chapter either, but a real photo
// showed up in the local `Chapter Content/Images/Module 1/Chapter 1/`
// drop-folder, same pattern as Module1Chapter5's hero (sourced locally,
// independent of Figma's own image slots). Third page in Module 1 (after
// Module1Chapter2.jsx and
// Module1Chapter5.jsx), reusing Module1Chapter2.jsx's SIDEBAR_ITEM_DEFS as
// the base with Chapter 1 now active/expanded and Chapters 2 and 5 demoted
// to cross-linked previews.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod1ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Why Diet Matters',
    active: true,
    sections: [
      { label: 'Why Diet Matters in the Short Term', id: 'why-diet-matters-in-the-short-term' },
      { label: 'Why Diet Matters in the Long Term', id: 'why-diet-matters-in-the-long-term' },
    ],
  },
  {
    chapterId: 'mod1ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Food Groups',
    to: '/module-1-chapter-2',
    sections: [{ label: 'Food Groups', id: 'food-groups' }],
  },
  { chapterId: 'mod1ch4', icon: ArticleTextIcon, label: 'Chapter 3', title: 'The Nutrition Facts Label' },
  {
    chapterId: 'mod1ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Common Food Myths vs. Facts',
    to: '/module-1-chapter-5',
    sections: [{ label: 'Common Food Myths vs. Facts', id: 'common-food-myths-vs-facts' }],
  },
  { chapterId: 'mod1-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game' },
  { chapterId: 'mod1-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 1 Reflection' },
];

const SHORT_TERM = [
  {
    title: 'Diet Supports Daily Function',
    body: 'Adequate, nutrient-dense meals support energy, strength, and the ability to carry out daily activities. This is especially important for older adults managing chronic conditions. Even when a chronic condition already exists, improving diet and nutrition can slow disease progression and may help manage aging-associated conditions. In some cases, medications may also be necessary alongside nutrition and lifestyle changes. Poor diet quality can lead to fatigue, weakness, and reduced mobility. Food is fuel—when the body does not receive enough essential nutrients, symptoms such as tiredness and weakness may occur.',
  },
  {
    title: 'Stabilizing Blood Sugar and Blood Pressure',
    body: 'Meals directly influence blood glucose and blood pressure levels. Diets high in highly processed foods, added sugars, and excess sodium can worsen short-term control of diabetes and hypertension. The timing and portion of different nutrients in meals can help regulate and maintain stable blood sugar and blood pressure levels.',
  },
  {
    title: 'Digestive Health and Regularity',
    body: 'Fiber-rich foods such as vegetables, fruits, legumes, and whole grains support digestion and help prevent constipation, which is a common issue in older adults. Fiber is a type of carbohydrate that the body cannot easily digest or absorb. Because of this, it helps slow digestion and stabilize blood glucose levels.',
  },
  {
    title: 'Medication Effectiveness',
    body: 'Adequate nutrition can support medication absorption and tolerance, helping medications work as intended.',
  },
  {
    title: 'Brain Health and Mood',
    body: 'Diets high in sugary drinks, processed foods, and saturated fats have been linked to inflammation and poorer brain function. Healthier eating patterns, in contrast, support memory, focus, and emotional well-being.',
  },
];

const LONG_TERM = [
  {
    title: 'Healthy Aging',
    body: 'Long-term studies show that healthier eating patterns in midlife are associated with living into older age without major chronic disease. These patterns are also linked to better physical, mental, and cognitive health later in life.',
  },
  {
    title: 'Muscle and Bone Health',
    body: 'Adequate protein and micronutrient intake support muscle mass, bone health, and mobility, helping maintain strength and physical function as we age.',
  },
  {
    title: 'Frailty and Fall Risk',
    body: 'Poor diet quality can increase the risk of sarcopenia (loss of muscle mass), frailty, and falls. Maintaining adequate nutrition helps support strength, balance, and overall physical resilience.',
  },
  {
    title: 'Lifelong Function',
    body: 'Nutrition plays a key role in supporting function and independence throughout life, rather than only treating disease later in life. Healthy eating patterns help maintain quality of life as people age.',
  },
];

export default function Module1Chapter1() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  // The scrollable pane itself resizes instantly (plain CSS flex); only the
  // reading column's own width waits for the resize to settle, so body text
  // isn't rewrapping on every intermediate pixel of a window drag.
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod1ch1');
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
                eyebrow="Chapter 1"
                title="Why Diet Matters"
                imageSrc={asset('/images/module-1-chapter-1/hero.jpg')}
                imageAlt="Seniors cooking a meal together"
              />

              <Section id="why-diet-matters-in-the-short-term" title="Why Diet Matters in the Short Term" sx={{ pt: 0 }}>
                <NumberedList>
                  {SHORT_TERM.map((item, i) => (
                    <NumberedListItem key={item.title} number={i + 1} title={item.title}>
                      {item.body}
                    </NumberedListItem>
                  ))}
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="why-diet-matters-in-the-long-term" title="Why Diet Matters in the Long Term">
                <NumberedList>
                  {LONG_TERM.map((item, i) => (
                    <NumberedListItem key={item.title} number={i + 1} title={item.title}>
                      {item.body}
                    </NumberedListItem>
                  ))}
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  Roberts, S. B., Silver, R. E., Das, S. K., Fielding, R. A., Gilhooly, C. H., Jacques, P. F., Kelly, J. M.,
                  Mason, J. B., McKeown, N. M., Reardon, M. A., Rowan, S., Saltzman, E., Shukitt-Hale, B., Smith, C. E.,
                  Taylor, A. A., Wu, D., Zhang, F. F., Panetta, K., &amp; Booth, S. (2021). Healthy aging - Nutrition
                  matters: Start early and screen often. Advances in Nutrition, 12(4), 1438–1448.
                  https://doi.org/10.1093/advances/nmab032
                </Reference>
                <Reference>
                  World Health Organization. (2026). Healthy diets. https://www.who.int/news-room/fact-sheets/detail/healthy-diet
                </Reference>
                <Reference>
                  American Heart Association. (2024). Food for thought: How diet affects the brain over a lifetime.
                  https://www.heart.org/en/news/2024/09/27/food-for-thought-how-diet-affects-the-brain-over-a-lifetime
                </Reference>
                <Reference>
                  Vicki Contie. (2025). Midlife eating patterns tied to health decades later. National Institutes of
                  Health (NIH) Research Matters.
                  https://www.nih.gov/news-events/nih-research-matters/midlife-eating-patterns-tied-health-decades-later
                </Reference>
                <Reference>
                  Wickramasinghe, K., Mathers, J. C., Wopereis, S., Marsman, D. S., &amp; Griffiths, J. C. (2020). From
                  lifespan to healthspan: the role of nutrition in healthy ageing. Journal of Nutritional Science, 9,
                  e33. https://doi.org/10.1017/jns.2020.26
                </Reference>
                <Reference>
                  USDA (2026). Dietary Guidelines for Americans, 2025-2030. https://cdn.realfood.gov/DGA.pdf
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-1-chapter-2" chapterId="mod1ch1" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
