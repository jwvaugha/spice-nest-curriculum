import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
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
import { asset } from '../assetPath';


// Built from Figma node 3433:19955 ("Mod-6-Ch-2 — Motivational Interviewing
// Strategies"), NEST Prototype page. First page in Module 6, so the
// Sidebar's Chapter List Slot is built from scratch from the real Figma
// sidebar (not a CSV roadmap) -- every other Module 6 page built this
// session reuses this same SIDEBAR_ITEM_DEFS shape.
//
// "Core Skills: OARS" keeps Figma's own dialogue-comparison workaround
// (label + quoted line, via NumberedListItem's `extra` prop) rather than
// inventing a new component for it -- Figma's real Design Note on this
// exact section (pulled verbatim below) already flags it as a case for a
// future dedicated Dialogue/Script-comparison component, so this page
// mirrors that flag instead of solving it unilaterally.
//
// "The Four Processes of MI" uses the real SequenceTimeline component with
// no eyebrow (Figma's own instance has Show Eyebrow off here, since the
// Section title already says what the sequence is). No local image folder
// exists for Module 6, and Figma's real source has zero Image nodes in this
// chapter -- every section is a communication technique with no strong
// visual referent -- so no photos anywhere on this page, by design.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod6ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Motivational interviewing strategies',
    active: true,
    sections: [
      { label: 'What is Motivational Interviewing (MI)?', id: 'what-is-motivational-interviewing-mi' },
      { label: 'The Spirit of Motivational Interviewing', id: 'the-spirit-of-motivational-interviewing' },
      { label: 'Core Skills: OARS', id: 'core-skills-oars' },
      { label: 'The Four Processes of MI', id: 'the-four-processes-of-mi' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod6ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Self Care as a Caregiver',
    to: '/module-6-chapter-4',
    sections: [
      { label: 'Why Self-Care Matters', id: 'why-self-care-matters' },
      { label: 'Signs You May Need a Break', id: 'signs-you-may-need-a-break' },
      { label: 'Take Care of Your Body', id: 'take-care-of-your-body' },
      { label: 'Manage Stress', id: 'manage-stress' },
      { label: 'Stay Connected & Ask for Help', id: 'stay-connected-ask-for-help' },
      { label: 'Respite Care', id: 'respite-care' },
      { label: 'Make a Simple Self-Care Plan', id: 'make-a-simple-self-care-plan' },
      { label: 'Helpful Resources', id: 'helpful-resources' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod6ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Managing multiple caregiving relationships',
    to: '/module-6-chapter-5',
    sections: [
      { label: 'Figuring Out What Comes First', id: 'figuring-out-what-comes-first' },
      { label: 'Exploring Outside Help', id: 'exploring-outside-help' },
      { label: 'Tips for Balancing Different Dietary Needs', id: 'tips-for-balancing-different-dietary-needs' },
      { label: 'Tips for Family Teamwork', id: 'tips-for-family-teamwork' },
      { label: 'Set Limits and Avoid Burnout', id: 'set-limits-and-avoid-burnout' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  { chapterId: 'mod6-infographic', icon: AttachmentRoundedIcon, label: 'Text / Infographic', title: 'Caregiver pocket guide' },
  { chapterId: 'mod6-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'AI Generated Dynamic Roleplay' },
  { chapterId: 'mod6-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 6 Reflection' },
];

// A single "label -> quoted line" pair inside an OARS item's `extra` slot.
function DialogueLine({ label, quote }) {
  return (
    <Box>
      <Typography variant="h6" color="text.secondary">{label}</Typography>
      <Typography variant="body1">{quote}</Typography>
    </Box>
  );
}

export default function Module6Chapter2() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod6ch2');
  useScrollToHash();

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={6} moduleTitle="Communication & Quality of Life Balance" items={sidebarItems} />

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
                title="Motivational Interviewing Strategies"
                imageSrc={asset('/images/module-6-chapter-2/hero.jpg')}
                imageAlt="A supportive conversation between a caregiver and older adult"
              />

              <Section id="what-is-motivational-interviewing-mi" title="What is Motivational Interviewing (MI)?" sx={{ pt: 0 }}>
                <BulletedList
                  items={[
                    'Motivational Interviewing (MI) is a different way to talk. It is a communication style that helps people find and think about their own reasons to change a behavior or action plan.',
                    'Instead of arguing or giving lectures, you guide them. You help them talk about their feelings and figure out why changing is important to them.',
                    'When the idea to change comes from them, they are much more likely to stick with that change.',
                    'Understanding your older relative’s concerns and fears about making changes can also help you communicate with their clinicians or other healthcare professionals so you can work together to find strategies or changes that fit your relative’s preferences.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="the-spirit-of-motivational-interviewing" title="The Spirit of Motivational Interviewing">
                <Typography>
                  Motivational Interviewing is not just a list of tricks; it is a mindset. To use it well, you need to
                  keep four main ideas in your heart.
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Partnership">
                    MI is a collaborative process. You work side-by-side to solve problems together.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Evocation">
                    Instead of putting your ideas into their head, you pull their ideas out. For example, instead of
                    telling them what to buy at the grocery store, you ask them what healthy foods they might actually
                    enjoy cooking.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Acceptance">
                    You accept them for who they are. You respect their choices, even if you disagree with them. When
                    people feel accepted, they are less defensive and more open to change.
                  </NumberedListItem>
                  <NumberedListItem number={4} title="Compassion">
                    You actively promote and prioritize the welfare and well-being of the person you are caring for in
                    a selfless manner.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="core-skills-oars" title="Core Skills: OARS">
                <NumberedList>
                  <NumberedListItem
                    number="O"
                    title="Open-Ended Questions"
                    extra={
                      <Stack spacing={1.5}>
                        <DialogueLine label="Instead of:" quote={'"Did you take your pills?" or "Why won’t you eat your veggies?"'} />
                        <DialogueLine label="Try saying:" quote={'"How do you feel about the new diet the doctor gave you?" or "What makes it hard to remember your pills in the morning?"'} />
                      </Stack>
                    }
                  >
                    Ask questions that require more than a "yes" or "no" answer.
                  </NumberedListItem>
                  <NumberedListItem
                    number="A"
                    title="Affirmations"
                    extra={
                      <Stack spacing={1.5}>
                        <DialogueLine label="Instead of:" quote={'"It’s about time you ate a healthy meal."'} />
                        <DialogueLine
                          label="Try saying:"
                          quote={'"I know changing your diet is really hard. It takes a lot of courage to try this new food, and I am proud of you for trying it today."'}
                        />
                      </Stack>
                    }
                  >
                    Praise their efforts and point out their strengths. This builds their confidence.
                  </NumberedListItem>
                  <NumberedListItem
                    number="R"
                    title="Reflective Listening"
                    extra={
                      <Stack spacing={1.5}>
                        <DialogueLine
                          label="The person you are caring for:"
                          quote={'"I am sick of everyone telling me what to eat. I have eaten like this my whole life and I am fine!"'}
                        />
                        <DialogueLine
                          label="Caregiver:"
                          quote={'"It sounds like you feel frustrated by all these new rules. You really miss being able to choose your own food."'}
                        />
                      </Stack>
                    }
                  >
                    Act like a mirror. Repeat back what they said in your own words so they know you are truly
                    listening.
                  </NumberedListItem>
                  <NumberedListItem
                    number="S"
                    title="Summaries"
                    extra={
                      <DialogueLine
                        label="Try saying:"
                        quote={'"Let me make sure I understand. You are upset about giving up salty snacks, but you really want to keep your blood pressure down. You are willing to try some unsalted mixed nuts this week. Did I get that right?"'}
                      />
                    }
                  >
                    At the end of a chat, wrap up the main points. This makes sure you are both on the same page.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="the-four-processes-of-mi" title="The Four Processes of MI">
                <SequenceTimeline
                  steps={[
                    { title: 'Engaging (Relationship Building)', description: 'Before you can talk about making a change, you need to build a connection. Listen closely, be kind, and show them that you are on their side.' },
                    { title: 'Focusing (Finding Direction)', description: 'People often have many things they need to work on. Focusing is about identifying the areas that take priority for the person you are caring for.' },
                    { title: 'Evoking (Goal Orientation)', description: 'This is where you ask open-ended questions to find out why they want to make this change. What are their hopes? What are they worried about?' },
                    { title: 'Planning (Make a Plan)', description: 'Once they are ready to change, help them figure out how to do it. Make a simple, step-by-step plan that they feel confident they can follow.' },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Motivational Interviewing is about teamwork. Your goal is to help the person you are caring for find their own reasons to get healthy, rather than forcing them to change.',
                    'Always treat the person you are caring for as a partner. Show them respect, care, and complete acceptance, even when you disagree.',
                    'To have better conversations, remember to ask open-ended questions, praise their efforts, listen like a mirror, and summarize what they say.',
                    'Take it step-by-step. Good changes take time. Always build trust first. Then, pick one clear goal, figure out their "why," and create a simple plan together.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="references" title="References" contentGap={REFERENCE_LIST_GAP} sx={{ pb: 0 }}>
                <Reference>
                  Bahri A. A. (2025). Motivational Interviewing to Promote Healthy Lifestyle Behaviors: Evidence,
                  Implementation, and Digital Applications. Journal of multidisciplinary healthcare, 18, 6629–6642.
                  https://doi.org/10.2147/JMDH.S557957
                </Reference>
                <Reference>
                  Bischof, G., Bischof, A., &amp; Rumpf, H. J. (2021). Motivational Interviewing: An Evidence-Based
                  Approach for Use in Medical Practice. Deutsches Arzteblatt international, 118(7), 109–115.
                  https://doi.org/10.3238/arztebl.m2021.0014
                </Reference>
                <Reference>
                  Lundahl, B., Moleni, T., Burke, B. L., Butters, R., Tollefson, D., Butler, C., &amp; Rollnick, S.
                  (2013). Motivational interviewing in medical care settings: a systematic review and meta-analysis of
                  randomized controlled trials. Patient education and counseling, 93(2), 157–168.
                  https://doi.org/10.1016/j.pec.2013.07.012
                </Reference>
                <Reference>
                  Miller, W. R., &amp; Rollnick, S. (2009). Ten things that motivational interviewing is not.
                  Behavioural and cognitive psychotherapy, 37(2), 129–140. https://doi.org/10.1017/S1352465809005128
                </Reference>
                <Reference>
                  Pirlott, A. G., Kisbu-Sakarya, Y., Defrancesco, C. A., Elliot, D. L., &amp; Mackinnon, D. P. (2012).
                  Mechanisms of motivational interviewing in health promotion: a Bayesian mediation analysis. The
                  international journal of behavioral nutrition and physical activity, 9(1), 69.
                  https://doi.org/10.1186/1479-5868-9-69
                </Reference>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-6-chapter-4" chapterId="mod6ch2" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
