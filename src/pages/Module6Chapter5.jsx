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
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
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

// Built from Figma node 3436:20958 ("Mod-6-Ch-5 — Managing Multiple
// Caregiving Relationships"), NEST Prototype page.
// 2026-09-29: hero + 3 body photos synced from
// `Chapter Content/Images/Module 6/Chapter 5 - Managing Multiple Caregiving
// Relationships/` after re-checking the live Figma node's actual image
// slots (walked via the Plugin API, not screenshot-guessed) -- confirmed
// exact identity via SHA-1 against Figma's own raw asset bytes. Two of the
// four sit in a DIFFERENT position than a typical list-item photo: "Exploring
// Outside Help"'s photo is attached to its 3rd NumberedListItem ("Local
// Agencies", which the source hash confirms is literally the Peace Meal
// Senior Nutrition Program photo), but "Tips for Balancing Different Dietary
// Needs" and "Tips for Family Teamwork" each got their photo appended at the
// END of the whole Section instead -- after the NumberedList, not attached
// to any specific item -- matching exactly where the user placed them on the
// live Figma node, not the more common per-list-item pattern.
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
    active: true,
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

export default function Module6Chapter5() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod6ch5');
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
                eyebrow="Chapter 4"
                title="Managing Multiple Caregiving Relationships"
                imageSrc={asset('/images/module-6-chapter-5/hero.jpg')}
                imageAlt="A multi-generational family gathered around a table together"
              />

              <Section id="figuring-out-what-comes-first" title="Figuring Out What Comes First" sx={{ pt: 0 }}>
                <Typography>
                  Learn to tell the difference between someone who needs help right away and someone who wants
                  companionship, social connectedness, or emotional support.
                </Typography>
                <Typography>
                  Understanding what the person you are caring for actually needs can help you figure out which tasks
                  to complete first. When supporting nutrition, this could mean figuring out whether your relative is
                  asking for help with eating because they are having trouble managing their utensils, or if they
                  want someone to talk to while they eat their meal.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="exploring-outside-help" title="Exploring Outside Help">
                <Typography>
                  You do not have to do everything by yourself. Older adults may rely on you for many things, like
                  keeping them company, getting dressed, driving, and cleaning. But other people can help with these
                  tasks, too.
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Professional Services">
                    You can hire an in-home caregiver, choose a senior living community, or use an adult day care
                    program. Meal services or subscriptions could help too—for example, a meal delivery kit or
                    grocery delivery service could help reduce time spent shopping and preparing ingredients to make
                    meals. Just be sure to check the ingredients and nutrition facts for any meal delivery kits and
                    substitute as needed.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Volunteer Help">
                    Look for local volunteer programs. For example, the Senior Companions Program (part of AmeriCorps
                    Seniors) has trained volunteers who are age 55 or older. They visit older adults who are
                    homebound or feel lonely.
                  </NumberedListItem>
                  <NumberedListItem
                    number={3}
                    title="Local Agencies"
                    imageSrc={asset('/images/module-6-chapter-5/item-local-agencies.jpg')}
                    imageAlt="The Peace Meal Senior Nutrition Program serving a meal"
                  >
                    Your local Area Agency on Aging can help you find free or low-cost community programs. For
                    instance, the Peace Meal Senior Nutrition Program (part of Meals on Wheels) provides congregate
                    and home delivered meals in Central Illinois. Additionally, some adult day care centers offer
                    activities, community support, and even meals for older adults.
                  </NumberedListItem>
                </NumberedList>
                <Typography>
                  Some of these services cost money, but if they fit your budget, they can lower your stress and give
                  you more time for yourself.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="tips-for-balancing-different-dietary-needs" title="Tips for Balancing Different Dietary Needs">
                <Typography>
                  Cooking for family members with different ages and needs can be stressful. An older adult may need
                  soft, low-sodium foods. Meanwhile, kids may be picky eaters or need meals with more energy for
                  growing. Cooking different meals for everyone can take a lot of time and effort.
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Start with One Main Meal">
                    Cook a single base meal for everyone, like baked chicken with rice. Then adjust each plate to fit
                    each person’s needs. For example, change the textures or add different sauces, seasonings, or
                    vegetables for each family member.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Make Extra and Freeze It">
                    When you have extra time, cook larger batches of meals that meet specific dietary needs. For
                    example, you can make a smooth soup for an older adult. Freeze single servings so you have a
                    quick meal ready on busy days.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Keep Healthy Snacks Ready">
                    For example, fresh fruit for children or single-serving yogurt for older adults can help when
                    dinner is not ready yet. Some snacks might be suitable for any age—for example, smoothies with
                    fruits and leafy greens might be a great mid-day snack for kids and for older adults.
                  </NumberedListItem>
                </NumberedList>
                <Box
                  component="img"
                  src={asset('/images/module-6-chapter-5/item-tips-for-balancing-different-dietary-needs.jpg')}
                  alt="A multi-generational family preparing a meal together outdoors"
                  sx={ITEM_IMAGE_SX}
                />
              </Section>

              <SectionDivider />

              <Section id="tips-for-family-teamwork" title="Tips for Family Teamwork">
                <Typography>
                  Do not wait until there is a big problem before talking. Regular family meetings keep everyone up
                  to date on family members’ health.
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title="Listen to Each Other">
                    Asking questions and listening carefully can help resolve disagreements. Focus on solving the
                    problem together instead of deciding who is right.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Share the Work">
                    Sometimes caregiving is difficult when there is little nearby support or when other caregivers
                    are busy. Finding ways to split the work can help. For instance, your siblings might be able to
                    help with finding recipes that an older relative would enjoy.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Start Small">
                    Even little favors make a huge difference. For example, your sister can call your mom every other
                    day, or your husband can bring dinner to your father-in-law once a week after work. Cooking
                    together with older children can give you some support with preparing meals, and could also help
                    children or other relatives learn about healthy eating. These small steps can make each day a
                    little easier.
                  </NumberedListItem>
                </NumberedList>
                <Box
                  component="img"
                  src={asset('/images/module-6-chapter-5/item-tips-for-family-teamwork.jpg')}
                  alt="A multi-generational family talking together in a living room"
                  sx={ITEM_IMAGE_SX}
                />
              </Section>

              <SectionDivider />

              <Section id="set-limits-and-avoid-burnout" title="Set Limits and Avoid Burnout">
                <Typography>
                  Trying to do it all by yourself leads to caregiver burnout. When your mind and body are completely
                  worn out, your own health suffers. This makes it much harder to help anyone else.
                </Typography>
                <NumberedList>
                  <NumberedListItem number={1} title='Learn to Say "No"'>
                    Know your limits before you get totally exhausted. Taking care of yourself is just as important
                    as taking care of others. Your doctor’s office or local aging resources may have information on
                    respite care options so you can get a break.
                  </NumberedListItem>
                  <NumberedListItem number={2} title="Make Requests Clear">
                    Ask for exactly what you need. Instead of saying, "You need to help more with Dad," try saying,
                    "Can you take Dad to the doctor on Wednesday afternoon?" Sometimes this might mean asking a
                    neighbor, college student, or friend to sit with your relative so you can get things done. Asking
                    your relative’s doctor or dietitian for specific, personalized guidance can help ensure that you
                    know exactly how to take care of your older relative.
                  </NumberedListItem>
                  <NumberedListItem number={3} title="Set Limits Early">
                    Set healthy boundaries as soon as possible. As the person you care for gets older, they may need
                    more care. If you start feeling overwhelmed, you could consider asking for back-up early on.
                  </NumberedListItem>
                </NumberedList>
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages">
                <BulletedList
                  items={[
                    'Focus on the most urgent care needs first',
                    'Use community resources and outside help when needed',
                    'Use flexible meal planning to meet different dietary needs without cooking separate meals',
                    'Share the caregiving and meal-related duties with your family',
                    'Be clear and specific when asking for help',
                    'Set healthy limits to stop yourself from burning out',
                    'Taking care of yourself is an important part of being able to continue caregiving',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>
                    Administration for Community Living. (n.d.). Meal Planning Tips for Caregivers.
                    https://acl.gov/sites/default/files/nutrition/Meal-Planning-Tips-for-Caregivers_508.pdf
                  </Reference>
                  <Reference>
                    Meyer, K., Rath, L., Avent, E., Benton, D., Nash, P., &amp; Wilber, K. (2023). How do family
                    caregivers of older adults cope with relationship strain? Aging &amp; Mental Health, 27(10),
                    1990–1999. https://doi.org/10.1080/13607863.2023.2247353
                  </Reference>
                  <Reference>
                    National Alliance on Mental Illness. (n.d.). Caring for the caregiver: What the data tells us about
                    mental health and family caregiving.
                    https://www.nami.org/blog/caring-for-the-caregiver-what-the-data-tells-us-about-mental-health-and-family-caregiving/
                  </Reference>
                  <Reference>
                    Riffin, C., Van Ness, P. H., Iannone, L., &amp; Fried, T. (2018). Patient and caregiver perspectives
                    on managing multiple health conditions. Journal of the American Geriatrics Society, 66(10),
                    1992–1997. https://doi.org/10.1111/jgs.15501
                  </Reference>
                  <Reference>
                    Russell, A. M., Bonham, M., Lovett, R., Pack, A., Wolf, M. S., &amp; O'Conor, R. (2024).
                    Characterizing caregiver roles and conflict in health management support to older people with
                    multiple chronic conditions. Journal of Applied Gerontology, 43(4), 386–395.
                    https://doi.org/10.1177/07334648231211456
                  </Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/dashboard" chapterId="mod6ch5" label="Back to Dashboard" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
