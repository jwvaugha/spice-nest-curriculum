import Box from '@mui/material/Box';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import MythFactCard from '../components/MythFactCard';
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

const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod1ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Why Diet Matters',
    to: '/module-1-chapter-1',
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
  {
    chapterId: 'mod1ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'The Nutrition Facts Label',
    to: '/module-1-chapter-4',
    sections: [{ label: 'Explore the Label', id: 'explore-the-label' }],
  },
  {
    chapterId: 'mod1ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Common Food Myths vs. Facts',
    active: true,
    sections: [{ label: 'Common Food Myths vs. Facts', id: 'common-food-myths-vs-facts' }],
  },
  { chapterId: 'mod1-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game' },
  { chapterId: 'mod1-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 1 Reflection' },
];

const MYTHS = [
  {
    myth: 'Carbohydrates make you gain weight.',
    fact: "Carbs don't cause weight gain, but excess calories do.",
    detail:
      'Carbohydrates are an important part of our diet and give us energy. Healthy carbs come from whole grains, fruits, and vegetables. Refined sugars and processed carbs should be limited (Harvard T.H. Chan, 2026). Eating too many carbs from sugary foods and drinks can cause weight gain and health problems, like diabetes and heart disease (Harvard T.H. Chan, 2026). To gain weight, you would need to eat more calories than you use. This can happen from eating too much, from not moving enough, or from both. Carbohydrates do not cause fat gain by themselves.',
    imageSrc: asset('/images/module-1-chapter-5/myth-1-carbs.jpg'),
    imageAlt: 'Fresh baked bread',
  },
  {
    myth: 'You should avoid sugar at all costs.',
    fact: "You don't need to cut all sugar, but it's good to limit added sugars.",
    detail:
      'Lowering sugary beverages and snacks is good for your health, but to stay healthy, you do not need to cut out all sugar from your diet. Fruits and dairy are good for us even though they have sugar. Fruits and dairy are natural sources of sugar that also have many benefits. If you cut out fruit and dairy, you miss out on these benefits. According to the World Health Organization (WHO), we should reduce added sugars to avoid weight gain and cavities, but sugars in fruits are fine (WHO, 2015). So, stick with natural sugars and try to limit added sugars for better health.',
    imageSrc: asset('/images/module-1-chapter-5/myth-2-sugar.jpg'),
    imageAlt: 'Fresh apples growing on a tree',
  },
  {
    myth: 'Skipping meals can help you lose weight.',
    fact: 'Skipping meals backfires; regular eating helps control weight.',
    detail:
      'Skipping meals is not a good idea. It can make you eat too much later and can slow down your metabolism. Eating regular, balanced meals helps keep your energy up and your blood sugar steady. Studies show that if you skip breakfast, you might eat more at dinner (Zeballos, 2020). Skipping meals can also lead to health problems like heart diseases and diabetes (American Health Association, 2013). It is better to eat regular meals to stay healthy.',
    imageSrc: asset('/images/module-1-chapter-5/myth-3-skipping-meals.jpg'),
    imageAlt: 'Bowl of cereal with a banana',
  },
  {
    myth: 'Eating fat will make you gain weight.',
    fact: "Fat doesn't necessarily cause weight gain. Healthy fats support important body functions.",
    detail:
      'Eating fats does not automatically make you gain weight. Healthy fats, like those found in avocados, nuts, and olive oil, are good for your health and can help you feel full. Unhealthy fats, like those in red meat, and baked goods, should be eaten less. Eating healthy fats instead of unhealthy fats can help keep your heart healthy (American Heart Association, 2026). So, it is important to focus on eating good fats.',
    imageSrc: asset('/images/module-1-chapter-5/myth-4-fat.jpg'),
    imageAlt: 'Avocado oil and fresh avocados',
  },
  {
    myth: "To lose weight, you can't eat your favorite foods.",
    fact: 'You can eat your favorite foods, but it helps to be mindful of portions.',
    detail:
      'To lose weight, you need to eat fewer calories than your body uses. You can still eat your favorite foods, but in smaller amounts. For example, if you need 2,500 calories a day to stay at the same weight, you will need to eat less than that to lose weight. You do not have to give up your favorite snacks, just eat less of them (Mayo Clinic, 2024). Eating your favorite foods in moderation can help you lose weight without feeling like you are missing out.',
    imageSrc: asset('/images/module-1-chapter-5/myth-5-favorite-foods.jpg'),
    imageAlt: 'Bowl of assorted chocolates',
  },
];

export default function Module1Chapter5() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  // The scrollable pane itself resizes instantly (plain CSS flex); only the
  // reading column's own width waits for the resize to settle, so body text
  // isn't rewrapping on every intermediate pixel of a window drag.
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod1ch5');
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
                eyebrow="Chapter 4"
                title="Common Food Myths vs. Facts"
                intro="Nutrition myths can be misleading and vary across cultures. This section highlights common misconceptions and clarifies them with simple, evidence-based facts, including ones often seen in South Asian communities."
                imageSrc={asset('/images/module-1-chapter-5/hero.jpg')}
                imageAlt="An assortment of fresh, healthy foods"
              />

              <Section id="common-food-myths-vs-facts" sx={{ pt: 0 }}>
                {MYTHS.map((m, i) => (
                  <MythFactCard key={i} {...m} />
                ))}
              </Section>

              <SectionDivider />

              <Section sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>Datz, T. (2013, July 25). Skipping breakfast may increase coronary heart disease risk. Harvard Gazette.</Reference>
                  <Reference>Fats in Foods. (2026). heart.org.</Reference>
                  <Reference>Harvard T.H. Chan School of Public Health. (n.d.). The Nutrition Source: Carbohydrates. https://www.hsph.harvard.edu/nutritionsource/carbohydrates/</Reference>
                  <Reference>Mayo Clinic. (2021, December 7). 6 proven strategies for weight-loss success.</Reference>
                  <Reference>St-Onge, M.-P., Ard, J., Baskin, M. L., et al. (2017). Meal Timing and Frequency: Implications for Cardiovascular Disease Prevention. Circulation, 135(9).</Reference>
                  <Reference>World Health Organization. (2015). Guideline: Sugars intake for adults and children. https://www.ncbi.nlm.nih.gov/books/NBK285538/</Reference>
                  <Reference>Zeballos, E., &amp; Todd, J. E. (2020). The effects of skipping a meal on daily energy intake and diet quality. Public Health Nutrition, 23(18), 1–10.</Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-2-chapter-1" chapterId="mod1ch5" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
