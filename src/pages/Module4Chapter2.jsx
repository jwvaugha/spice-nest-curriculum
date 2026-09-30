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
import TipExample from '../components/TipExample';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import { asset } from '../assetPath';

// Built from Figma node 3154:14345 ("Mod-4-Ch-2 — Seasonal and Ethnic
// Markets"). First page in Module 4, so the Sidebar's Chapter List Slot is
// built from scratch using Figma's own real sidebar content for this
// module (module title "Grocery Skills"), not the CSV roadmap.
//
// The "Seasonal produce examples" list items' own Figma content repeated an
// identical "Best to limit: fatty cuts of red meat..." sentence on every
// season (Spring/Summer/Fall/Winter) verbatim -- the same boilerplate
// phrase used for Module 2 Chapter 2's "Foods High in Saturated Fat" item,
// clearly copy-pasted filler unrelated to seasonal produce, not real
// content for this chapter. Dropped per the established "don't replicate
// boilerplate junk content" convention -- kept only the real "In season: …"
// portion of each season's description.
//
// The chapter's References section in Figma (3 citations, all about food
// waste / FDA-USDA food-dating / EPA) is also mismatched boilerplate
// copy-pasted from the Avoiding Food Waste chapter, not real citations for
// Seasonal and Ethnic Markets -- omitted rather than propagated. Flag for a
// follow-up pass once real references for this chapter are available.
const SIDEBAR_ITEM_DEFS = [
  { chapterId: 'mod4ch1', icon: ArticleTextIcon, label: 'Chapter 1', title: 'Navigating the Grocery Store' },
  {
    chapterId: 'mod4ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Seasonal and Ethnic Markets',
    active: true,
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
    to: '/module-4-chapter-3',
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

export default function Module4Chapter2() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod4ch2');
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
                eyebrow="Chapter 2"
                title="Seasonal and Ethnic Markets"
                imageSrc={asset('/images/module-4-chapter-2/hero.jpg')}
                imageAlt="Outdoor farmers market with fresh produce stalls"
              />

              <Section id="what-are-seasonal-markets" title="What are seasonal markets?" sx={{ pt: 0 }}>
                <Typography>
                  Seasonal markets are places that sell foods that are harvested at the time of year when they
                  naturally grow. Examples include:
                </Typography>
                <BulletedList items={['Farmers markets', 'Farm stands', 'Local produce markets']} />
              </Section>

              <SectionDivider />

              <Section id="seasonal-produce-examples" title="Seasonal produce examples">
                <Typography>
                  Seasonal produce depends on where you live. Growing conditions and weather can affect what is
                  available during each season. Here are a few examples
                </Typography>
                <NumberedList>
                  <NumberedListItem
                    number={1}
                    title="Spring"
                    imageSrc={asset('/images/module-4-chapter-2/item-spring.jpg')}
                    imageAlt="Fresh radishes"
                  >
                    In season: Leafy greens, radishes, strawberries.
                  </NumberedListItem>
                  <NumberedListItem
                    number={2}
                    title="Summer"
                    imageSrc={asset('/images/module-4-chapter-2/item-summer.jpg')}
                    imageAlt="Fresh peaches"
                  >
                    In season: Strawberries, tomatoes, corn, and peaches.
                  </NumberedListItem>
                  <NumberedListItem
                    number={3}
                    title="Fall"
                    imageSrc={asset('/images/module-4-chapter-2/item-fall.jpg')}
                    imageAlt="Fresh squash"
                  >
                    In season: Apples, carrots, sweet potatoes, squash.
                  </NumberedListItem>
                  <NumberedListItem
                    number={4}
                    title="Winter"
                    imageSrc={asset('/images/module-4-chapter-2/item-winter.jpg')}
                    imageAlt="Fresh citrus fruit"
                  >
                    In season: Citrus fruits, cabbage, winter squash.
                  </NumberedListItem>
                </NumberedList>
                <TipExample label="Helpful Tip">
                  The U.S. Department of Agriculture notes that seasonal produce varies by location and weather.
                  Check your local Farmer's markets or grocery store to see what is in season.
                </TipExample>
                <Typography>For more seasonal produce ideas, visit the USDA Seasonal Produce Guide</Typography>
              </Section>

              <SectionDivider />

              <Section id="what-are-ethnic-markets" title="What Are Ethnic Markets?">
                <Typography>
                  Ethnic markets are stores or markets that sell foods commonly used in different cultures and
                  traditions, including Asian supermarkets, Hispanic/Latino carnicerías (meat markets) or panaderías
                  (bakeries), and Middle Eastern or Mediterranean grocers.
                </Typography>
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-2/item-ethnic-markets.jpg')}
                  alt="Shelves of goods in an international grocery store"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
                <Typography>You may find familiar:</Typography>
                <BulletedList
                  items={[
                    'Fresh fruits and vegetables',
                    'Beans and grains',
                    'Spices and herbs',
                    'Specialty meats and seafood',
                    'Cultural foods and snacks that may not be available in regular grocery stores',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="why-shop-at-seasonal-markets" title="Why Shop at Seasonal Markets?">
                <Typography>Shopping at seasonal markets may help you:</Typography>
                <BulletedList
                  items={[
                    'Find fresh fruits and vegetables',
                    'Try a variety of foods throughout the year',
                    'Support local farmers and businesses',
                    'Find produce that may cost less when it is in season',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-2/item-why-seasonal.jpg')}
                  alt="Farmers market produce stand"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="why-shop-at-ethnic-markets" title="Why Shop at Ethnic Markets?">
                <Typography>Shopping at ethnic markets may help you:</Typography>
                <BulletedList
                  items={[
                    'Find foods that match your cultural preferences',
                    'Access ingredients used in traditional recipes',
                    'Discover new foods and flavors',
                    'Find affordable fruits, vegetables, grains, and spices',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-2/item-why-ethnic.jpg')}
                  alt="Shelves of goods in an Indonesian grocery store"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
                <Typography>
                  Research shows that ethnic markets can play an important role in helping communities access
                  healthy and culturally familiar foods.
                </Typography>
              </Section>

              <SectionDivider />

              <Section id="tips-for-shopping" title="Some Tips for Shopping at Seasonal and Ethnic Markets">
                <BulletedList
                  items={[
                    'Compare prices between stores and vendors.',
                    'Buy fruits and vegetables that are in season.',
                    'Try a new fruit, vegetable, grain, or spice.',
                    'Check produce for freshness.',
                    'Ask questions if you are unfamiliar with a food item.',
                    'Plan meals around foods that are available and affordable.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="key-messages" title="Key Messages" sx={{ pb: 0 }}>
                <BulletedList
                  items={[
                    'Seasonal markets often offer fresh fruits and vegetables that are in season.',
                    'Seasonal foods may cost less and taste better.',
                    'Ethnic markets offer foods used in different cultures and traditions.',
                    'Shopping at different types of markets can help families find nutritious foods that fit their culture, preferences, and budget.',
                  ]}
                />
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-4-chapter-3" chapterId="mod4ch2" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
