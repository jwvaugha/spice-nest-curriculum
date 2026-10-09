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
import Paragraph from '../components/Paragraph';
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

// Built from Figma node 3253:18408 ("Mod-2-Ch-5 — Medication and Diet:
// What's The Relationship?"). "Diabetes Medicines"' 5 list items each pair a
// real medicine-class example with an "Examples" tag -- exactly the
// TipExample use case (a real "genuine medicine names" callout, not
// decorative filler). "Timing Your Medication with Meals" uses three
// labeled Paragraph pairs (Before Meals / With Your First Bite / During or
// After Meals), same pattern as Module3Chapter2's Day 1/Day 2.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod2ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Basics of Diabetes',
    to: '/module-2-chapter-1',
    sections: [
      { label: 'What is Diabetes?', id: 'what-is-diabetes' },
      { label: 'What is insulin?', id: 'what-is-insulin' },
      { label: 'Main types of diabetes', id: 'main-types-of-diabetes' },
      { label: 'Common symptoms of diabetes', id: 'common-symptoms-of-diabetes' },
      { label: 'Risk Factors', id: 'risk-factors' },
      { label: 'Prevention', id: 'prevention' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod2ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Managing diabetes through diet',
    to: '/module-2-chapter-2',
    sections: [
      { label: 'Diet and Diabetes', id: 'diet-and-diabetes' },
      { label: 'Examples of Food to Eat Less Often', id: 'examples-of-food-to-eat-less-often' },
      { label: 'Foods to Focus On', id: 'foods-to-focus-on' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod2ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Alternative approaches to managing diabetes',
    to: '/module-2-chapter-4',
    sections: [
      { label: 'Change Your Meal Order', id: 'change-your-meal-order' },
      { label: 'Stay Hydrated', id: 'stay-hydrated' },
      { label: 'Move Your Body After Meals', id: 'move-your-body-after-meals' },
      { label: 'Keep a Good Sleep Schedule', id: 'keep-a-good-sleep-schedule' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod2ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: "Medication and diet: what's the relationship?",
    active: true,
    sections: [
      { label: 'Diabetes Medicines', id: 'diabetes-medicines' },
      { label: 'Timing Your Medication with Meals', id: 'timing-your-medication-with-meals' },
      { label: 'Important Reminders', id: 'important-reminders' },
      { label: 'References', id: 'references' },
    ],
  },
  { chapterId: 'mod2-infographic', icon: ArticleTextIcon, label: 'Text / Infographic', title: 'Diabetes factsheet' },
  { chapterId: 'mod2-text', icon: ArticleTextIcon, label: 'Text', title: 'South Asian diabetes myths and facts' },
  { chapterId: 'mod2-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game lvl 2' },
  { chapterId: 'mod2-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 2 Reflection' },
];

const MEDICINES = [
  {
    title: 'Helping the body use insulin better',
    examples: 'Metformin, TZDs',
    imageSrc: asset('/images/module-2-chapter-5/item-insulin-better.jpg'),
    imageAlt: 'Metformin tablets',
  },
  {
    title: 'Helping the body make more insulin',
    examples: 'Sulfonylureas, DPP-4 inhibitors, GLP-1 medicines',
    imageSrc: asset('/images/module-2-chapter-5/item-more-insulin.jpg'),
    imageAlt: 'GLP-1 injectable medication',
  },
  {
    title: 'Helping remove extra sugar from the body',
    examples: 'SGLT2 inhibitors',
    imageSrc: asset('/images/module-2-chapter-5/item-remove-sugar.jpg'),
    imageAlt: 'SGLT2 inhibitor medication',
  },
  {
    title: 'Slowing down the digestion of carbs',
    examples: 'Alpha-glucosidase inhibitors',
    imageSrc: asset('/images/module-2-chapter-5/item-slow-digestion.jpg'),
    imageAlt: 'Alpha-glucosidase inhibitor (Acarbose) medication',
  },
  {
    title: "Replacing or supplementing the body's natural insulin production",
    examples: 'Injected insulin',
    imageSrc: asset('/images/module-2-chapter-5/item-injected-insulin.jpg'),
    imageAlt: 'Insulin injection pen',
  },
];

export default function Module2Chapter5() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod2ch5');
  useScrollToHash();

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={2} moduleTitle="Diabetes Care" items={sidebarItems} />

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
                title="Medication and Diet: What's The Relationship?"
                intro="To keep your blood sugar stable, your daily meals and your medications must work together as a team."
                imageSrc={asset('/images/module-2-chapter-5/hero.jpg')}
                imageAlt="Diabetes medications alongside healthy food"
              />

              <Section id="diabetes-medicines" title="Diabetes Medicines" sx={{ pt: 0 }}>
                <Typography>
                  Type 2 diabetes medicines help keep blood sugar in a healthy range. Different medicines work in
                  different ways:
                </Typography>
                <NumberedList>
                  {MEDICINES.map((med, i) => (
                    <NumberedListItem
                      key={med.title}
                      number={i + 1}
                      title={med.title}
                      imageSrc={med.imageSrc}
                      imageAlt={med.imageAlt}
                      tip={med.examples}
                      tipLabel="Examples"
                    />
                  ))}
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="timing-your-medication-with-meals" title="Timing Your Medication with Meals">
                <Typography>
                  Getting the timing right is the key to making sure your medication works well and doesn't cause
                  unwanted side effects. Here are a few approaches that people take to medication timing:
                </Typography>
                <Paragraph label="Before Meals">
                  Some diabetes medicines should be taken before eating. If you take these medicines but skip a meal,
                  your blood sugar may drop too low.
                </Paragraph>
                <Paragraph label="With Your First Bite">Some medicines work best when taken with food.</Paragraph>
                <Paragraph label="During or After Meals">Some medicines may be taken after eating.</Paragraph>
                <Typography>Always follow the instructions from your doctor, pharmacist, or medication label.</Typography>
              </Section>

              <SectionDivider />

              <Section id="important-reminders" title="Important Reminders">
                <BulletedList
                  items={[
                    'Medicine can help manage diabetes, but it does not replace healthy eating and active lifestyle habits.',
                    'Eating balanced meals and watching portion sizes can help keep blood sugar steady.',
                    'Do not stop taking diabetes medication on your own unless your healthcare provider tells you to do so.',
                    'If your blood sugar numbers improve, that is a sign that your medications are working — keep taking your medication as advised by your doctor.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>
                    American Diabetes Association. (n.d.). Oral &amp; Other Injectable Diabetes Medications for Type 2
                    Diabetes. https://diabetes.org/health-wellness/medication/oral-other-injectable-diabetes-medications
                  </Reference>
                  <Reference>
                    American Heart Association. (n.d.). Diabetes Medications.
                    https://www.heart.org/en/health-topics/diabetes/prevention--treatment-of-diabetes/diabetes-medications
                  </Reference>
                  <Reference>
                    Cleveland Clinic. (2022). Oral Diabetes Medications.
                    https://my.clevelandclinic.org/health/articles/12070-oral-diabetes-medications
                  </Reference>
                  <Reference>
                    Mayo Clinic. (2025). Diabetes treatment: Medications for type 2 diabetes.
                    https://www.mayoclinic.org/diseases-conditions/type-2-diabetes/in-depth/diabetes-treatment/art-20051004
                  </Reference>
                  <Reference>
                    U.S. Food and Drug Administration (FDA). (n.d.). Diabetes Medicines.
                    https://www.fda.gov/files/for%20consumers/published/Diabetes-Medicines.pdf
                  </Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-3-chapter-1" chapterId="mod2ch5" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
