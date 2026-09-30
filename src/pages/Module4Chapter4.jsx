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
import TwoColumnList from '../components/TwoColumnList';
import Paragraph from '../components/Paragraph';
import ChapterFooter from '../components/ChapterFooter';
import DashboardBackLink from '../components/DashboardBackLink';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { useReachedEnd } from '../hooks/useReachedEnd';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { HEADER_HEIGHT, BACKLINK_HEIGHT, HERO_WIDTH, RESIZE_TRANSITION, getContentPaddingX } from '../layoutConstants';
import { asset } from '../assetPath';

// Built from Figma node 3263:16422 ("Mod-4-Ch-4 — Budgeting"). One of three
// Module 4 pages built together — the Module 4 SIDEBAR_ITEM_DEFS base below
// was verified once against the real Figma sidebar and reused identically
// across all three, rather than re-derived per page. "Be Smart About Buying
// in Bulk" / "Buy Organic When It Matters" use the real TwoColumnList
// component (confirmed via Figma this chapter's own source already has
// real Two-Column List instances here, not the old ComparisonTable
// placeholder — these are non-row-paired independent lists, audited
// against the source Word doc earlier this session). "Maximize Your Freezer"
// uses four Paragraph label+body pairs (Section Label pattern, same as
// Cook Once Eat Twice's "Day 1"/"Day 2").
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
    active: true,
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

export default function Module4Chapter4() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod4ch4');
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
                eyebrow="Chapter 4"
                title="Budgeting"
                imageSrc={asset('/images/module-4-chapter-4/hero.jpg')}
                imageAlt="Grocery receipt showing itemized prices"
              />

              <Section id="understand-unit-pricing" title="Understand Unit Pricing" sx={{ pt: 0 }}>
                <Typography>
                  Checking the price per unit can help you find the cheapest item. Big signs might make you think a
                  sale or a bigger box is always the cheapest choice. To find the real best deal, look at the unit
                  price.
                </Typography>
                <BulletedList
                  items={[
                    'You can find this small number on the shelf tag.',
                    'It shows the cost per ounce or gram.',
                    'Comparing the unit price helps you see which size or brand saves you the most money.',
                    'Sometimes, buying two medium boxes is actually cheaper than buying one large "family size" box.',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-4/item-unit-pricing.jpg')}
                  alt="Unit price label on a bottle of lime juice"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="choose-store-brands-over-name-brands" title="Choose Store Brands Over Name Brands">
                <Typography>
                  Name-brand foods usually cost more because those companies spend a lot on advertising.
                </Typography>
                <BulletedList
                  items={[
                    'Store brands often taste just as good but cost less.',
                    'For simple foods like oats, beans, frozen veggies, and milk, the ingredients and nutrition are mostly exactly the same.',
                    'Give them a try! If you like them, you will save a lot of money over time.',
                  ]}
                />
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-4/item-store-brands.jpg')}
                  alt="Store-brand cereal box"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="be-smart-about-buying-in-bulk" title="Be Smart About Buying in Bulk">
                <Typography>
                  Buying a lot at once only saves money if you actually eat the food. If it goes bad and gets thrown
                  away, you are just wasting money.
                </Typography>
                <TwoColumnList
                  columns={[
                    {
                      header: 'What to buy in bulk',
                      items: [
                        'Dry goods: brown rice, quinoa, dried lentils, pasta, and oats.',
                        'Everyday items: cooking oils and paper goods.',
                        'Nuts & seeds: store them in a sealed container in the fridge or freezer to extend freshness.',
                      ],
                    },
                    {
                      header: 'What to avoid in bulk',
                      items: [
                        'Fresh produce: fruits and veggies that go bad quickly.',
                        'Dairy products: milk, soft cheeses, and yogurts that expire quickly.',
                        "Unfamiliar items: foods that you aren't sure you like yet.",
                      ],
                    },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="maximize-your-freezer-to-prevent-waste" title="Maximize Your Freezer to Prevent Waste">
                <Typography>
                  Using your freezer helps you stock up during sales and stops food from going to waste.
                </Typography>
                <Paragraph label="Meats and seafood">
                  Buy large family packs on sale, split them into smaller meal sizes, and freeze them right away.
                </Paragraph>
                <Paragraph label="Breads and whole grains">
                  Loaves of bread and bagels freeze very well. You can toast them straight from the freezer without
                  ruining the texture.
                </Paragraph>
                <Paragraph label="Fresh produce">
                  Peel and freeze old bananas for smoothies. You can also freeze leftover onions or spinach for soups
                  later.
                </Paragraph>
                <Paragraph label="Commercial frozen foods">
                  Buying frozen fruits and veggies at the store is often cheaper than buying them fresh, and because
                  they are frozen when perfectly ripe, they are still very healthy.
                </Paragraph>
                <Box
                  component="img"
                  src={asset('/images/module-4-chapter-4/item-freezer.jpg')}
                  alt="Organized freezer with labeled containers"
                  sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
                />
              </Section>

              <SectionDivider />

              <Section id="buy-organic-when-it-matters" title="Buy Organic When It Matters">
                <Typography>
                  Organic foods usually cost more. If you want to avoid pesticides but are on a tight budget, here is
                  a simple guide:
                </Typography>
                <TwoColumnList
                  columns={[
                    {
                      header: 'When to Buy Organic',
                      items: [
                        'Thin-skinned produce: fruits and vegetables that you eat whole. The skin holds onto chemicals.',
                        'Examples: strawberries, apples, grapes, spinach, and tomatoes.',
                      ],
                    },
                    {
                      header: 'When to Buy Conventional',
                      items: [
                        'Thick-skinned produce: the thick skin protects the inside, so regular versions are perfectly safe.',
                        'Examples: avocados, onions, pineapples, bananas, and kiwis.',
                      ],
                    },
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="key-takeaways" title="Key Takeaways" sx={{ pb: 0 }}>
                <Typography>
                  Smart shopping is all about building simple habits. These tips will help you stretch your money and
                  keep your kitchen full of healthy food. Finally, always bring a shopping list so you don&apos;t buy
                  things you don&apos;t need!
                </Typography>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-5-chapter-2" chapterId="mod4ch4" label="Continue to Next Module" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
