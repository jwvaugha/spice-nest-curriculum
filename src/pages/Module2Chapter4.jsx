import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import BulletedList from '../components/BulletedList';
import SequenceTimeline from '../components/SequenceTimeline';
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';

// Built from Figma node 3214:14890 ("Mod-2-Ch-4 — Alternative Approaches to
// Managing Diabetes"). "Change Your Meal Order" uses SequenceTimeline (built
// 2026-09-21) instead of a flat bulleted list -- Figma's own content was
// restructured that way earlier this session (verified directly against
// the live node before writing this page, not assumed). No hardcoded
// typography anywhere; Section/SequenceTimeline/BulletedList own all
// spacing and type, matching every other page in this app.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod2ch1',
    icon: DescriptionRoundedIcon,
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
    icon: DescriptionRoundedIcon,
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
    icon: DescriptionRoundedIcon,
    label: 'Chapter 3',
    title: 'Alternative approaches to managing diabetes',
    active: true,
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
    icon: DescriptionRoundedIcon,
    label: 'Chapter 4',
    title: "Medication and diet: what's the relationship?",
    to: '/module-2-chapter-5',
    sections: [
      { label: 'Diabetes Medicines', id: 'diabetes-medicines' },
      { label: 'Timing Your Medication with Meals', id: 'timing-your-medication-with-meals' },
      { label: 'Important Reminders', id: 'important-reminders' },
      { label: 'References', id: 'references' },
    ],
  },
  { chapterId: 'mod2-video', icon: VideocamRoundedIcon, label: 'Video', title: 'South Asian expert dietitian video clip on diabetes' },
  { chapterId: 'mod2-infographic', icon: DescriptionRoundedIcon, label: 'Text / Infographic', title: 'Diabetes factsheet' },
  { chapterId: 'mod2-text', icon: DescriptionRoundedIcon, label: 'Text', title: 'South Asian diabetes myths and facts' },
  { chapterId: 'mod2-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game lvl 2' },
  { chapterId: 'mod2-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 2 Reflection' },
];

export default function Module2Chapter4() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod2ch4');
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
                eyebrow="Chapter 3"
                title="Alternative Approaches to Managing Diabetes"
                imageSrc="/images/module-2-chapter-4/hero.jpg"
                imageAlt="Assorted healthy foods and daily habits that support blood sugar management"
              />

              <Section id="change-your-meal-order" title="Change Your Meal Order" sx={{ pt: 0 }}>
                <Typography>
                  Eating carbohydrates (like bread, rice, or fruit) all by themselves can cause blood sugar to rise
                  very fast. This is because certain types of carbohydrates (like white sugar or fruit juice) are
                  digested very quickly by the body, releasing a surge of glucose into the bloodstream right after
                  eating.
                </Typography>
                <SequenceTimeline
                  eyebrow="Try This Order Instead"
                  steps={[
                    { title: 'Veggies', description: 'Fiber slows down digestion, keeping blood sugar from spiking quickly.' },
                    { title: 'Protein', description: 'Helps keep the stomach full and slows how fast sugar enters the blood.' },
                    { title: 'Carbs (last)', description: 'Saved for the very end, once fiber and protein have already slowed things down.' },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="stay-hydrated" title="Stay Hydrated">
                <BulletedList
                  items={[
                    'Water makes up 55 to 65% of the human body.',
                    'When the body does not get enough water, it gets dehydrated. This means there is less liquid in the blood, which makes blood sugar more concentrated.',
                    'Keep a water bottle out where it is easy to see all day long.',
                    'If plain water is boring, add slices of cucumber or lemon to give it flavor. This is a great way to avoid sugary drinks.',
                  ]}
                />
                <Box
                  component="img"
                  src="/images/module-2-chapter-4/item-stay-hydrated.jpg"
                  alt="Glass water bottle with cucumber and lemon slices"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="move-your-body-after-meals" title="Move Your Body After Meals">
                <BulletedList
                  items={[
                    'Your muscles use sugar from your blood for energy. This helps keep blood sugar from rising too high after a meal.',
                    'You do not need a hard, sweaty workout.',
                    'Light movement for just 10 to 15 minutes right after eating makes a big difference.',
                    'You can take a short walk together with friends or do some simple chores around the house.',
                    'You can also do wall push-ups or lift small water bottles to build strength.',
                  ]}
                />
                <Box
                  component="img"
                  src="/images/module-2-chapter-4/item-move-your-body.jpg"
                  alt="Older adult taking a light walk outdoors"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="keep-a-good-sleep-schedule" title="Keep a Good Sleep Schedule">
                <BulletedList
                  items={[
                    'Not getting enough sleep does not just make you tired; it stresses the body.',
                    'When the body is stressed, it releases certain hormones that make blood sugar go up.',
                    'Create a calm and relaxing bedtime routine.',
                    'Try to keep a consistent sleep schedule by going to bed and waking up at the same time every day.',
                  ]}
                />
                <Box
                  component="img"
                  src="/images/module-2-chapter-4/item-sleep-schedule.jpg"
                  alt="Bedside clock and calm bedroom setting for a consistent sleep schedule"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Start your meal with fiber-rich vegetables and protein before eating carbohydrates.',
                    'Drink plenty of water.',
                    '10 to 15 minutes of light activity after eating.',
                    'Get good rest.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  American Diabetes Association. (2025). Hydration: The Unsung Hero in Diabetes Health. Diabetes Food
                  Hub. https://diabetesfoodhub.org/blog/hydration-unsung-hero-diabetes-health
                </Reference>
                <Reference>
                  Centers for Disease Control and Prevention. (2024, May 15). Get active.
                  https://www.cdc.gov/diabetes/living-with/physical-activity.html
                </Reference>
                <Reference>
                  Colberg, S. R., Sigal, R. J., Yardley, J. E., Riddell, M. C., Dunstan, D. W., Dempsey, P. C., Horton,
                  E. S., Castorino, K., &amp; Tate, D. F. (2016). Physical Activity/Exercise and Diabetes: A Position
                  Statement of the American Diabetes Association. Diabetes care, 39(11), 2065–2079.
                  https://doi.org/10.2337/dc16-1728
                </Reference>
                <Reference>
                  Darraj A. (2023). The Link Between Sleeping and Type 2 Diabetes: A Systematic Review. Cureus,
                  15(11), e48228. https://doi.org/10.7759/cureus.48228
                </Reference>
                <Reference>
                  Henson, J., Covenant, A., Hall, A. P., Herring, L., Rowlands, A. V., Yates, T., &amp; Davies, M. J.
                  (2024). Waking up to the importance of sleep in type 2 diabetes management: A narrative review.
                  Diabetes Care, 47(3), 331–343. https://doi.org/10.2337/dci23-0037
                </Reference>
                <Reference>
                  Kubota, S., Liu, Y., Iizuka, K., Kuwata, H., Seino, Y., &amp; Yabe, D. (2020). A Review of Recent
                  Findings on Meal Sequence: An Attractive Dietary Approach to Prevention and Management of Type 2
                  Diabetes. Nutrients, 12(9), 2502. https://doi.org/10.3390/nu12092502
                </Reference>
                <Reference>
                  Shukla, A. P., Iliescu, R. G., Thomas, C. E., &amp; Aronne, L. J. (2015). Food Order Has a
                  Significant Impact on Postprandial Glucose and Insulin Levels. Diabetes care, 38(7), e98–e99.
                  https://doi.org/10.2337/dc15-0429
                </Reference>
                <Reference>
                  Taylor, K., &amp; Tripathi, A. K. (2025, March 5). Adult dehydration. StatPearls.
                  https://www.ncbi.nlm.nih.gov/books/NBK555956/
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-2-chapter-5" chapterId="mod2ch4" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
