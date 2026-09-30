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
import Reference from '../components/Reference';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX, REFERENCE_LIST_GAP } from '../layoutConstants';
import { asset } from '../assetPath';

// Built from Figma node 3414:17465 ("Mod-2-Ch-1 — Basics of Diabetes"),
// NEST Prototype page. Second page in Module 2 (after Module2Chapter2.jsx),
// so the Sidebar list is that page's own SIDEBAR_ITEM_DEFS with Chapter 1
// now marked active/expanded and Chapter 2 demoted to a plain cross-linked
// preview — mirrors how Module1Chapter2.jsx/Module1Chapter5.jsx cross-link.
// Every image is a real photo pulled from the local
// `Chapter Content/Images/Module 2/Chapter 1 - Diabetes Basics/` drop
// folder (all 6 body-content Image slots plus the hero already had real,
// non-generic imageHash fills in Figma) -- no Figma export needed.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod2ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Basics of Diabetes',
    active: true,
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
    to: '/module-2-chapter-5',
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

export default function Module2Chapter1() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod2ch1');
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
                eyebrow="Chapter 1"
                title="Basics of Diabetes"
                imageSrc={asset('/images/module-2-chapter-1/hero.jpg')}
                imageAlt="Lancet device used for blood glucose testing"
              />

              <Section id="what-is-diabetes" title="What is Diabetes?" sx={{ pt: 0 }}>
                <Typography>
                  Diabetes is a condition where the body has trouble keeping the blood sugar (glucose) at a healthy
                  level. This happens when:
                </Typography>
                <BulletedList
                  items={['The body does not make enough insulin', 'The body cannot use insulin properly.']}
                />
                <Typography>
                  When this happens, sugar builds up in the blood. Over time, high blood sugar can harm the heart and
                  other parts of the body. Therefore, diabetes is a risk factor for other types of health conditions
                  like heart disease. Diabetes is common. A healthy lifestyle can help prevent diabetes and decrease
                  the risk of complications if you have diabetes.
                </Typography>
                <Box
                  component="img"
                  src={asset('/images/module-2-chapter-1/item-what-is-diabetes.jpg')}
                  alt="Blood sugar testing for diabetes"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="what-is-insulin" title="What is insulin?">
                <Typography>
                  Insulin is a hormone made by the pancreas. Think of it as a key. It helps sugar (glucose) move from
                  the blood into the body’s cells to be used for energy. With diabetes:
                </Typography>
                <BulletedList
                  items={[
                    'The body may not make enough insulin (type 1), or',
                    'The insulin may not work the right way (type 2)',
                  ]}
                />
                <Typography>When this happens, sugar builds up in the blood.</Typography>
                <Box
                  component="img"
                  src={asset('/images/module-2-chapter-1/item-what-is-insulin.jpg')}
                  alt="Insulin vial and syringe"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="main-types-of-diabetes" title="Main types of diabetes (Brief Overview)">
                <NumberedList>
                  <NumberedListItem
                    number={1}
                    title="Type 1 diabetes"
                    bullets={[
                      'An autoimmune condition where the body’s immune system attacks its own insulin-making cells.',
                      'It usually starts in childhood or young adulthood',
                      'It cannot be prevented.',
                      'If insulin is a key, in type 1, the key is missing to open the gate to move sugar out of the blood.',
                    ]}
                    imageSrc={asset('/images/module-2-chapter-1/item-type-1.jpg')}
                    imageAlt="Type 1 diabetes"
                  />
                  <NumberedListItem
                    number={2}
                    title="Type 2 diabetes"
                    bullets={[
                      'The most common type.',
                      'The body does not use insulin effectively.',
                      'Diet and lifestyle play a major role in its risk and management.',
                      'A family history of diabetes or a personal history of prediabetes or gestational diabetes can put one at risk for Type 2 diabetes',
                      'If insulin is a key, the lock is not working as well as it should. Sugar has a hard time moving out of the blood into the cells.',
                    ]}
                    imageSrc={asset('/images/module-2-chapter-1/item-type-2.jpg')}
                    imageAlt="Type 2 diabetes"
                  />
                  <NumberedListItem
                    number={3}
                    title="Gestational diabetes"
                    bullets={[
                      'This type typically develops between the 24th and 28th weeks of pregnancy, but could develop earlier.',
                      'It is caused by pregnancy hormones produced by the placenta that make the body resistant to insulin',
                      'It often resolves after birth, once the placenta is removed from the body',
                      'It increases the risk of type 2 diabetes later in life.',
                    ]}
                    imageSrc={asset('/images/module-2-chapter-1/item-gestational.jpg')}
                    imageAlt="Gestational diabetes"
                  />
                  <NumberedListItem
                    number={4}
                    title="Prediabetes"
                    bullets={[
                      'Blood sugar is higher than normal, but not high enough to be called diabetes.',
                      'Many people with prediabetes do not feel sick or notice any symptoms, so they may not know they have it.',
                      'Prediabetes is important because it increases the risk of developing type 2 diabetes in the future.',
                    ]}
                  />
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="common-symptoms-of-diabetes" title="Common symptoms of diabetes">
                <Typography>Common signs and symptoms of diabetes may include:</Typography>
                <BulletedList
                  items={[
                    'Urinating often',
                    'Feeling very thirsty',
                    'Feeling very hungry, even though you are eating',
                    'Extreme fatigue',
                    'Blurry vision',
                    'Cuts or sores that heal slowly',
                    'Unexplained weight loss',
                    'Tingling, pain, or numbness in the hands or feet',
                  ]}
                />
                <Typography>Early detection and treatment can help reduce the risk of complications.</Typography>
              </Section>

              <SectionDivider />

              <Section id="risk-factors" title="Risk Factors">
                <Typography>
                  Diabetes risk is influenced by a combination of lifestyle, health, and genetic factors. Some risk
                  factors can be changed, while others cannot. Risk factors that cannot be changed include:
                </Typography>
                <BulletedList items={['Family history of diabetes', 'Age', 'History of gestational diabetes']} />
                <Typography>
                  Understanding these risk factors can help individuals take steps toward prevention and early care.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="prevention" title="Prevention">
                <Typography>
                  Type 1 Diabetes cannot be prevented. However, type 2 diabetes can often be delayed or prevented
                  through healthy lifestyle choices. Ways to lower risk and manage diabetes include:
                </Typography>
                <BulletedList
                  items={[
                    'Being more physically active',
                    'Making healthy food choices',
                    'Maintaining a healthy weight',
                    'Learning about prediabetes and diabetes risk',
                    'Getting support from healthcare providers or lifestyle programs',
                    'Supplementing healthy lifestyle changes with medication when prescribed by a doctor. Some medications help reduce the amount of blood sugar produced by the body, decrease the amount of sugar absorbed from the food one has eaten, or supplement the body with additional insulin to help move sugar out of the blood and into cells.',
                  ]}
                />
                <Typography>Healthy eating and regular activity both help reduce risk.</Typography>
                <Box
                  component="img"
                  src={asset('/images/module-2-chapter-1/item-prevention.jpg')}
                  alt="Healthy lifestyle choices for diabetes prevention"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Diabetes is common, but it can be managed by a healthy lifestyle.',
                    'According to the CDC, about 40 million Americans have diabetes',
                    'Learning the basics can help people take early steps to stay healthy and prevent complications.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>Centers for Disease Control and Prevention. (2024). Diabetes Risk Factors. https://www.cdc.gov/diabetes/risk-factors/index.html</Reference>
                <Reference>Centers for Disease Control and Prevention. (2024). Prediabetes – Your Chance to Prevent Type 2 Diabetes. https://www.cdc.gov/diabetes/prevention-type-2/prediabetes-prevent-type-2.html</Reference>
                <Reference>Jin J. What Is Prediabetes? JAMA. 2023;330(24):2404. doi:10.1001/jama.2023.17846. https://jamanetwork-com.proxy2.library.illinois.edu/journals/jama/fullarticle/2812671</Reference>
                <Reference>
                  Forray, A. I., Coman, M. A., Simonescu-Colan, R., Mazga, A. I., Cherecheș, R. M., &amp; Borzan, C. M.
                  (2023). The Global Burden of Type 2 Diabetes Attributable to Dietary Risks: Insights from the Global
                  Burden of Disease Study 2019. Nutrients, 15(21), 4613. https://doi.org/10.3390/nu15214613
                </Reference>
                <Reference>American Diabetes Association. Food and Blood Glucose. https://diabetes.org/food-nutrition/food-blood-sugar</Reference>
                <Reference>American Heart Association. Diabetes Risk Factors. (2024) https://www.heart.org/en/health-topics/diabetes/understand-your-risk-for-diabetes</Reference>
                <Reference>American Diabetes Association. About Diabetes. Warning Signs and Symptoms. https://diabetes.org/about-diabetes/warning-signs-symptoms</Reference>
                <Reference>Symptoms &amp; Causes of Diabetes. https://www.niddk.nih.gov/health-information/diabetes/overview/symptoms-causes</Reference>
                <Reference>National Heart, Lung, and Blood Institute. (2022). What is diabetes? Fact sheet. https://www.nhlbi.nih.gov/resources/what-diabetes-fact-sheet</Reference>
                <Reference>U.S. Food and Drug Administration. (n.d.). Diabetes fact sheet. https://www.fda.gov/media/151821/download</Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-2-chapter-2" chapterId="mod2ch1" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
