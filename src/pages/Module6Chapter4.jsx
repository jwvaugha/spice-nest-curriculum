import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import ArticleTextIcon from '../components/ArticleTextIcon';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import BulletedList from '../components/BulletedList';
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

const ITEM_IMAGE_SX = {
  width: '100%',
  aspectRatio: '16/10',
  objectFit: 'cover',
  borderRadius: 1.5,
};

// Built from Figma node 3435:20406 ("Mod-6-Ch-4 — Self Care as a
// Caregiver"). First page in Module 6, so the Sidebar's Chapter List Slot
// is built from scratch from the real Figma sidebar (not guessed) -- see
// the Printable/Interactive/Reflection resources (the two Video rows this
// once had were removed entirely 2026-09-28 -- those videos were canceled,
// so there's no content to reference, not even as a disabled placeholder).
// 2026-09-29: hero + all 3 body-section photos synced from
// `Chapter Content/Images/Module 6/Chapter 4 - Self Care as a Caregiver/`
// after re-verifying the live Figma prototype's own image nodes (each now
// has a real imageHash, not the earlier generic placeholder fill) --
// confirmed exact identity via SHA-1 against Figma's own raw asset bytes for
// the hero, and visual match for the other three. All three body photos sit
// at the END of their Section's flowing content (after the closing
// paragraph, not attached to a list item -- these sections use a flat
// BulletedList, not numbered items), matching the exact position already
// confirmed on the Figma node.
const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod6ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Motivational interviewing strategies',
    to: '/module-6-chapter-2',
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
    active: true,
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

export default function Module6Chapter4() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod6ch4');
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
                eyebrow="Chapter 3"
                title="Self Care as a Caregiver"
                imageSrc={asset('/images/module-6-chapter-4/hero.jpg')}
                imageAlt="A woman standing by a window, hand resting on her heart"
              />

              <Section id="why-self-care-matters" title="Why Self-Care Matters" sx={{ pt: 0 }}>
                <Typography>
                  Caring for someone else takes time, energy, and patience. It is easy to put your own needs last.
                  However, taking care of yourself helps you stay healthy and better able to care for the person you
                  love. Self-care is not selfish. It is an important part of being a caregiver.
                </Typography>
                <Typography variant="h6">Be Kind to Yourself</Typography>
                <Typography>
                  Caregivers may feel guilty about resting, asking for help, or feeling frustrated. These feelings are
                  common. You do not have to be a perfect caregiver. Taking care of yourself does not mean you care
                  less.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="signs-you-may-need-a-break" title="Signs You May Need a Break">
                <Typography>Caregiving can become overwhelming. Pay attention to these signs:</Typography>
                <BulletedList
                  items={[
                    'Feeling tired most of the time',
                    'Feeling stressed or overwhelmed',
                    'Trouble sleeping',
                    'Losing interest in activities you enjoy',
                    'Feeling sad, frustrated, or lonely',
                    'Forgetting important tasks',
                    'Skipping meals or eating unhealthy foods',
                    'Becoming easily angry or impatient',
                    'Feeling anxious or hopeless',
                    'Having frequent headaches, pain, or other health concerns',
                    'Ignoring your own personal care or medical needs',
                  ]}
                />
                <Typography>If you notice these signs, it may be time to slow down and ask for help.</Typography>
              </Section>

              <SectionDivider />

              <Section id="take-care-of-your-body" title="Take Care of Your Body">
                <Typography>Your health matters too. Simple ways to care for yourself include:</Typography>
                <BulletedList
                  items={[
                    'Eat regular, balanced meals.',
                    'Drink enough water / stay hydrated.',
                    'Get enough sleep.',
                    'Move your body every day, even if it is only a short walk or stretching.',
                    'Keep up with your own medical appointments.',
                  ]}
                />
                <Typography>Remember: A healthy caregiver is better able to care for others.</Typography>
                <Box component="img" src={asset('/images/module-6-chapter-4/item-take-care-of-your-body.jpg')} alt="A man stretching outdoors before a run" sx={ITEM_IMAGE_SX} />
              </Section>

              <SectionDivider />

              <Section id="manage-stress" title="Manage Stress">
                <Typography>
                  Stress is a normal part of caregiving, but too much stress can affect your health. Try these simple
                  stress-relief ideas:
                </Typography>
                <BulletedList
                  items={[
                    'Take slow, deep breaths.',
                    'Spend a few quiet minutes alone.',
                    'Listen to music.',
                    'Read a book.',
                    'Pray or reflect if it brings you comfort.',
                    'Spend time outdoors.',
                  ]}
                />
                <Typography>
                  Even a few minutes each day can help. If stress, sadness, anxiety, or loss of interest continues or
                  affects your daily life, talk with a healthcare professional or mental health provider.
                </Typography>
                <Box component="img" src={asset('/images/module-6-chapter-4/item-manage-stress.jpg')} alt="A person relaxing on a couch, reading a book" sx={ITEM_IMAGE_SX} />
              </Section>

              <SectionDivider />

              <Section id="stay-connected-ask-for-help" title="Stay Connected & Ask for Help">
                <Typography>
                  You do not have to do everything alone. You deserve support as much as the person you are caring
                  for. Stay connected by:
                </Typography>
                <BulletedList
                  items={[
                    'Talking with family and friends.',
                    'Joining a caregiver support group.',
                    'Sharing your feelings with someone you trust.',
                    'Accepting help when it is offered.',
                    'Ask for specific help, such as preparing a meal, picking up groceries, or staying with your loved one for a few hours.',
                  ]}
                />
                <Typography>
                  Tip: Keep a short list of tasks that others can help with. Remember: Asking for help is a strength,
                  not a weakness.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="respite-care" title="Respite Care">
                <Typography>
                  Sometimes caregivers need time to rest. Respite care is temporary care provided by someone else so
                  the caregiver can take a break. Respite care may be provided by:
                </Typography>
                <BulletedList items={['Family members', 'Friends', 'Volunteers', 'Adult day programs', 'Professional caregivers']} />
                <Typography>Even a few hours of respite care can help reduce stress and prevent burnout.</Typography>
                <Box component="img" src={asset('/images/module-6-chapter-4/item-respite-care.jpg')} alt="A professional caregiver helping an older woman" sx={ITEM_IMAGE_SX} />
              </Section>

              <SectionDivider />

              <Section id="make-a-simple-self-care-plan" title="Make a Simple Self-Care Plan">
                <Typography>
                  Small habits can make a big difference. Choose one small step that feels realistic. This week, I
                  will:
                </Typography>
                <BulletedList
                  items={['Do: _____________________', 'When: ___________________', 'Who can support me: _____________________']}
                />
                <Typography>
                  Examples include taking a short walk, calling a friend, asking someone to prepare a meal, or
                  scheduling your own medical appointment.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="helpful-resources" title="Helpful Resources">
                <Typography>
                  If you need extra support or information about respite services near you, these organizations may
                  help:
                </Typography>
                <BulletedList
                  items={[
                    'Family Caregiver Alliance',
                    'Caregiver Action Network',
                    'Mental Health America',
                    'National Alliance for Caregiving',
                    'ARCH National Respite Network & Resource Center',
                    'Your local Area Agency on Aging',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Self-care helps you become a healthier caregiver.',
                    'Take care of your body, mind, and emotions.',
                    'Ask for help when you need it.',
                    'Taking breaks is part of good caregiving.',
                    'Stay connected with family, friends, and support groups.',
                    'Small self-care habits can make a big difference.',
                  ]}
                />
                <Typography>Reflection: What is one thing you can do this week to take better care of yourself?</Typography>
              </Section>

              <SectionDivider />

              <Section sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>ARCH National Respite Network and Resource Center. www.archrespite.org</Reference>
                  <Reference>
                    Cardoso, C., Lumini, M. J., &amp; Martins, T. (2025). Effects of physical exercise in reducing
                    caregivers burden: a systematic review. Frontiers in public health, 13, 1474913.
                    https://doi.org/10.3389/fpubh.2025.1474913
                  </Reference>
                  <Reference>Family Caregiver Alliance. Caring for Yourself. https://www.caregiver.org/caregiver-resources/caring-for-yourself/</Reference>
                  <Reference>Family Caregiver Alliance. Taking Care of YOU: Self-Care for Family Caregivers. https://www.caregiver.org/resource/taking-care-you-self-care-family-caregivers/</Reference>
                  <Reference>NIH National Institute on Aging (2023). Taking Care of Yourself: Tips for Caregivers. https://www.nia.nih.gov/health/caregiving/taking-care-yourself-tips-caregivers</Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-6-chapter-5" chapterId="mod6ch4" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
