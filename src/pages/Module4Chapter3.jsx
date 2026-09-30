import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SectionDivider from '../components/SectionDivider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import ArticleTextIcon from '../components/ArticleTextIcon';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import Sidebar from '../components/Sidebar';
import ChapterHero from '../components/ChapterHero';
import Section from '../components/Section';
import BulletedList from '../components/BulletedList';
import SequenceTimeline from '../components/SequenceTimeline';
import TipExample from '../components/TipExample';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import { asset } from '../assetPath';

// Built from Figma node 3287:33831 ("Mod-4-Ch-3 — Grocery Shopping With
// Limited Resources"). First page in Module 4, so the Sidebar's Chapter
// List Slot is built from scratch (real titles harvested directly from the
// Figma sidebar instance for the whole module, not guessed).
//
// "Federal and State Assistance Programs" repeats a "program name (h6) ->
// description -> external-link button(s) -> photo" unit 5 times; Figma's
// buttons carry a label but no real URL data (they're visual chips in the
// design file, not functional links), so they're rendered here as
// non-interactive outlined Chips rather than fabricating an href. The
// trailing NOTE is a genuine Tip-Example "aside" use (matches the
// established convention: real per-item content, not boilerplate).
//
// "Ordering Groceries Online" is the real SequenceTimeline this chapter
// already has in Figma (built earlier this session) -- Show Eyebrow is off
// there, so no eyebrow prop here either.
const SIDEBAR_ITEM_DEFS = [
  { chapterId: 'mod4ch1', icon: ArticleTextIcon, label: 'Chapter 1', title: 'Navigating the Grocery Store' },
  {
    chapterId: 'mod4ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Seasonal and Ethnic Markets',
    to: '/module-4-chapter-2',
    sections: [
      { label: 'What are seasonal markets?', id: 'what-are-seasonal-markets' },
      { label: 'Seasonal produce examples', id: 'seasonal-produce-examples' },
      { label: 'What Are Ethnic Markets?', id: 'what-are-ethnic-markets' },
      { label: 'Why Shop at Seasonal Markets?', id: 'why-shop-at-seasonal-markets' },
      { label: 'Why Shop at Ethnic Markets?', id: 'why-shop-at-ethnic-markets' },
      { label: 'Some Tips for Shopping at Seasonal and Ethnic Markets', id: 'tips-for-shopping' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod4ch3',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Grocery Shopping With Limited Resources',
    active: true,
    sections: [
      { label: 'Federal and State Assistance Programs', id: 'federal-and-state-assistance-programs' },
      { label: 'Community-Based Assistance Networks', id: 'community-based-assistance-networks' },
      { label: 'Shopping When You Are Short on Time', id: 'shopping-when-you-are-short-on-time' },
      { label: 'Ordering Groceries Online', id: 'ordering-groceries-online' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod4ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Budgeting',
    to: '/module-4-chapter-4',
    sections: [
      { label: 'Understand Unit Pricing', id: 'understand-unit-pricing' },
      { label: 'Choose Store Brands Over Name Brands', id: 'choose-store-brands-over-name-brands' },
      { label: 'Be Smart About Buying in Bulk', id: 'be-smart-about-buying-in-bulk' },
      { label: 'Maximize Your Freezer to Prevent Waste', id: 'maximize-your-freezer-to-prevent-waste' },
      { label: 'Buy Organic When It Matters', id: 'buy-organic-when-it-matters' },
      { label: 'Key Takeaways', id: 'key-takeaways' },
    ],
  },
  { chapterId: 'mod4-printable', icon: AttachmentRoundedIcon, label: 'Printable Resource', title: 'Shelf Life and Storage' },
  { chapterId: 'mod4-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Frozen Food Comparison Game' },
  { chapterId: 'mod4-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 4 Reflection' },
];

function ProgramLinks({ labels }) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
      {labels.map((label) => (
        <Chip key={label} label={label} variant="outlined" color="primary" size="small" />
      ))}
    </Stack>
  );
}

function ProgramUnit({ title, children, links, imageSrc, imageAlt }) {
  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Typography>{children}</Typography>
      <ProgramLinks labels={links} />
      {imageSrc && (
        <Box
          component="img"
          src={imageSrc}
          alt={imageAlt}
          sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
        />
      )}
    </>
  );
}

export default function Module4Chapter3() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod4ch3');
  useScrollToHash();

  return (
    <>
      <DashboardBackLink />
      <Box sx={{ display: 'flex', height: `calc(100vh - ${HEADER_HEIGHT + BACKLINK_HEIGHT}px)` }}>
        <Sidebar moduleNumber={4} moduleTitle="Grocery Skills" items={sidebarItems} />

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
                title="Grocery Shopping With Limited Resources"
                imageSrc={asset('/images/module-4-chapter-3/hero.jpg')}
                imageAlt="Older adult carrying groceries"
              />

              <Section id="federal-and-state-assistance-programs" title="Federal and State Assistance Programs" sx={{ pt: 0 }}>
                <ProgramUnit
                  title="SNAP (Supplemental Nutrition Assistance Program)"
                  links={['SNAP', 'IDHS']}
                  imageSrc={asset('/images/module-4-chapter-3/item-snap.jpg')}
                  imageAlt="SNAP program welcome materials"
                >
                  The largest food assistance program in the U.S. It helps people and families with low incomes pay
                  for groceries. In Illinois, SNAP is managed by the Illinois Department of Human Services (IDHS).
                  Benefits are provided through the Link electronic benefits card.
                </ProgramUnit>
                <ProgramUnit
                  title="Double Up Food Bucks (known as Link Match in Illinois)"
                  links={['Double Up Food Bucks', 'Link Match']}
                  imageSrc={asset('/images/module-4-chapter-3/item-link-match.jpg')}
                  imageAlt="Illinois Link Match farmers market sign"
                >
                  Helps SNAP users buy more fresh produce. At participating farmers markets and grocery stores, your
                  SNAP spending may be matched, giving you more money to spend on fresh fruits and vegetables.
                </ProgramUnit>
                <ProgramUnit
                  title="WIC (Women, Infants, and Children)"
                  links={['WIC']}
                  imageSrc={asset('/images/module-4-chapter-3/item-wic.jpg')}
                  imageAlt="WIC program materials"
                >
                  Provides healthy foods and nutrition support for pregnant women, new mothers, infants, and young
                  children.
                </ProgramUnit>
                <ProgramUnit
                  title="Commodity Supplemental Food Program (CSFP)"
                  links={['CSFP']}
                  imageSrc={asset('/images/module-4-chapter-3/item-csfp.jpg')}
                  imageAlt="CSFP senior food box program materials"
                >
                  Also called the "senior food box program." Provides free monthly boxes of healthy foods to adults
                  age 60 and older who have low incomes.
                </ProgramUnit>
                <ProgramUnit title="Senior Farmers Market Nutrition Program (SFMNP)" links={['SFMNP']}>
                  Provides vouchers to older adults with low incomes. The vouchers can be used to buy fresh fruits,
                  vegetables, honey, and herbs from approved farmers markets and farm stands.
                </ProgramUnit>
                <TipExample label="Note">
                  Each program has its own eligibility rules. Check the program website to see if you qualify and how
                  to apply.
                </TipExample>
              </Section>

              <SectionDivider />

              <Section id="community-based-assistance-networks" title="Community-Based Assistance Networks">
                <Typography variant="h6">Regional Food Banks</Typography>
                <Typography>
                  Such as the Eastern Illinois Foodbank. Regional food banks provide food to local food pantries and
                  other community programs. You can use the map on their website to find a place near you to get food
                  support.
                </Typography>
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-3/item-food-banks.jpg')}
                  alt="Regional food bank"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
                <Typography variant="h6">Local Food Pantries</Typography>
                <Typography>
                  Food pantries provide free food to people and families who need help. Many offer foods such as
                  canned goods, other shelf-stable foods, and fresh fruits and vegetables. You can find local food
                  pantries through community websites, such as the Champaign-Urbana Public Health District's Food
                  Resources page.
                </Typography>
                <ProgramLinks labels={['C-U Public Health District Food Resources']} />
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-3/item-food-pantries.jpg')}
                  alt="Local food pantry shelves"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="shopping-when-you-are-short-on-time" title="Shopping When You Are Short on Time">
                <Typography color="text.secondary">
                  When you care for someone, finding time to shop for groceries can sometimes be difficult. Here are a
                  few easy ways to save time when buying groceries:
                </Typography>
                <Typography variant="h6">Plan Ahead</Typography>
                <Typography>Plan your meals for the week before you go shopping.</Typography>
                <Typography variant="h6">Make a List</Typography>
                <Typography>Make a grocery list before you go to the store to help you stay focused and avoid extra trips.</Typography>
                <Typography variant="h6">Shop Off-Peak</Typography>
                <Typography>Shop when the store is less crowded so you can finish faster.</Typography>
                <Typography variant="h6">Choose Easy Foods</Typography>
                <Typography>Choose easy-to-prepare foods, such as frozen vegetables, canned beans, or pre-cut fruits and vegetables.</Typography>
                <Typography variant="h6">Go Online</Typography>
                <Typography>Use online shopping or grocery pickup when available.</Typography>
              </Section>

              <SectionDivider />

              <Section id="ordering-groceries-online" title="Ordering Groceries Online">
                <Typography>Ordering groceries online might seem new, but it is easy once you try it. Here are the basic steps:</Typography>
                <SequenceTimeline
                  steps={[
                    { title: 'Create an Account', description: "Go to a grocery store's website or download their app on your phone. Sign up with your email address." },
                    { title: 'Fill Your Cart', description: 'Type the foods you need into the search bar and click "add to cart."' },
                    { title: 'Choose Pickup or Delivery', description: 'Select "pickup" if you want to drive to the store. Select "delivery" if you want the groceries brought to your home.' },
                    { title: 'Pick a Time', description: 'Choose a pickup or delivery time that fits your schedule.' },
                    { title: 'Pay and Check Out', description: 'Enter your payment information.' },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages" sx={{ pb: 0 }}>
                <BulletedList
                  items={[
                    'Food assistance programs could help when money for groceries is limited.',
                    'You do not have to struggle alone.',
                    'Government programs can provide money or food to help you pay for groceries.',
                    'Local food banks and pantries offer free fresh and canned foods to people and families who need help.',
                    'Use online maps or websites to find programs available in your area and see if you qualify.',
                    'Planning your meals, buying easy-to-prepare foods, and shopping online can save you time when you are busy caring for someone.',
                  ]}
                />
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-4-chapter-4" chapterId="mod4ch3" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
