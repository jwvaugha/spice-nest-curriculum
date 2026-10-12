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
import Paragraph from '../components/Paragraph';
import BulletedList from '../components/BulletedList';
import ComparisonTable from '../components/ComparisonTable';
import StoreLayoutDiagram from '../components/StoreLayoutDiagram';
import AnnotatedNutritionLabel from '../components/AnnotatedNutritionLabel';
import TipExample from '../components/TipExample';
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

// Built from Figma node 3749:22910 ("Mod-4-Ch-1 — Navigating the Grocery
// Store", NEST Prototype page), itself built 2026-10-12 from the PowerPoint
// source (M4C1-Grocery Store Guide). Copy is verbatim from the Figma frame.
// - The two custom Figma figures are real components here:
//   StoreLayoutDiagram (the redrawn store map) and AnnotatedNutritionLabel
//   (the 4-callout label, reusing NutritionLabelCard in its static mode).
// - "Grocery Store Tips" keeps the user's 3 H6 subsections from Figma.
// - The diabetes guidance is still under reviewer revision in the source
//   deck, so it stays a flagged placeholder, as in Figma.
// - Section 7's on-page title is "Review: How to Quickly Read Nutrition
//   Labels"; the Figma sidebar still says the older "How to Quickly Read
//   Nutrition Labels". The sidebar here uses the on-page title.
// - References re-sorted alphabetically by author/organization (or title,
//   when there's no author), per the React convention; Figma's order wasn't.
// Photos come from the Figma frame's own image fills (no repo drop-folder
// exists for this chapter), matched by SHA-1 against their imageHash.

// Same dashed-orange "flagged / provisional" language as Figma's
// placeholders and DesignNote, but for content deliberately withheld.
function ContentUnderReview({ children }) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: '#bd5116',
        borderRadius: 1,
        bgcolor: '#fff8ee',
        p: 2,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Typography sx={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 11, color: '#924511', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
        Placeholder — content under review
      </Typography>
      <Typography sx={{ fontFamily: 'inherit', fontSize: 12, color: '#664a1a', lineHeight: 1.5 }}>{children}</Typography>
    </Box>
  );
}

function Photo({ src, alt }) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 1.5, bgcolor: '#ece4d9' }}
    />
  );
}

const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod4ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Navigating the Grocery Store',
    active: true,
    sections: [
      { label: 'Typical Grocery Store Layout', id: 'typical-grocery-store-layout' },
      { label: 'Warehouse Supermarkets and Departments', id: 'warehouse-supermarkets-and-departments' },
      { label: 'Specialized Grocery Stores', id: 'specialized-grocery-stores' },
      { label: 'Shopping Online', id: 'shopping-online' },
      { label: 'Grocery Store Tips', id: 'grocery-store-tips' },
      { label: 'General Nutrition Tips', id: 'general-nutrition-tips' },
      { label: 'Review: How to Quickly Read Nutrition Labels', id: 'how-to-quickly-read-nutrition-labels' },
      { label: 'Nutrition Considerations for Common Health Conditions', id: 'nutrition-considerations' },
    ],
  },
  {
    chapterId: 'mod4ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Seasonal and Ethnic Markets',
    to: '/module-4-chapter-2',
    sections: [
      'What are seasonal markets?',
      'Seasonal produce examples',
      'What Are Ethnic Markets?',
      'Why Shop at Seasonal Markets?',
      'Why Shop at Ethnic Markets?',
      'Some Tips for Shopping at Seasonal and Ethnic Markets',
      'Key Messages',
    ],
  },
  {
    chapterId: 'mod4ch3',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Grocery Shopping With Limited Resources',
    to: '/module-4-chapter-3',
    sections: [
      'Federal and State Assistance Programs',
      'Community-Based Assistance Networks',
      'Shopping When You Are Short on Time',
      'Ordering Groceries Online',
      'Key Messages',
    ],
  },
  {
    chapterId: 'mod4ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Budgeting',
    to: '/module-4-chapter-4',
    sections: [
      'Understand Unit Pricing',
      'Choose Store Brands Over Name Brands',
      'Be Smart About Buying in Bulk',
      'Maximize Your Freezer to Prevent Waste',
      'Buy Organic When It Matters',
      'Key Takeaways',
    ],
  },
  { chapterId: 'mod4-printable', icon: AttachmentRoundedIcon, label: 'Printable Resource', title: 'Shelf Life and Storage' },
  { chapterId: 'mod4-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Frozen Food Comparison Game' },
  { chapterId: 'mod4-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 4 Reflection' },
];

export default function Module4Chapter1() {
  const { isViewed } = useViewedChapters();
  const sidebarItems = SIDEBAR_ITEM_DEFS.map((item) => ({
    ...item,
    unviewed: !item.active && !isViewed(item.chapterId),
  }));
  const [paneRef, settledWidth] = useSettledWidth();
  const reachedEnd = useReachedEnd(paneRef, 'mod4ch1');
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
                eyebrow="Chapter 1"
                title="Navigating the Grocery Store"
                intro="Every grocery store is different, but there are often common denominators. Knowing how stores are usually laid out, what each department carries, and a few quick tips can make every trip easier."
                imageSrc={asset('/images/module-4-chapter-1/hero.jpg')}
                imageAlt="A shopper choosing vegetables in a grocery store produce aisle"
              />

              <Section id="typical-grocery-store-layout" title="Typical Grocery Store Layout" sx={{ pt: 0 }}>
                <ComparisonTable
                  columnAHeader="Product"
                  columnBHeader="Typical Location"
                  emphasizeColumnA
                  rows={[
                    { a: 'Fresh Produce (Fruits & Veggies)', b: 'Front of store, in bins or display shelves with misting systems.' },
                    { a: 'Bakery and Grains', b: 'Near the fresh produce section.' },
                    { a: 'Dairy', b: 'Back of store and on the perimeter, refrigerated.' },
                    { a: 'Meat', b: 'Near the dairy section in refrigerated display shelves or at a butcher counter.' },
                    { a: 'Packaged/Processed Foods', b: 'Aisles of the store, often the back or center.' },
                    { a: 'Frozen Foods', b: 'With the processed foods in refrigerators, often by dairy in the back.' },
                    { a: 'Personal Care/Hygiene (toothpaste)', b: 'By the pharmacy or away from foods.' },
                    { a: 'Pre-prepared Meals', b: 'Near the bakery, on hot or cold food counters.' },
                  ]}
                />
                <StoreLayoutDiagram />
              </Section>

              <SectionDivider />

              <Section id="warehouse-supermarkets-and-departments" title="Warehouse Supermarkets and Departments">
                <Photo
                  src={asset('/images/module-4-chapter-1/warehouse-supermarket.jpg')}
                  alt="Pallets of boxed produce stacked on tall shelves in a warehouse store"
                />
                <Typography>Warehouse supermarkets, such as Costco and Sam’s Club, are organized into departments:</Typography>
                <Paragraph label="Deli">
                  The section that sells ready-to-eat, prepared foods. Can be a self-service grab-and-go counter with a
                  hot or cold case, or a full-service counter. Typically includes a seating area.
                </Paragraph>
                <Paragraph label="Grocery">
                  Has most items, excluding refrigerated items. Sections may be canned fruits and vegetables, baking
                  items, snack items, kitchen and cooking utensils, and ethnic foods. Health and beauty care items may
                  also be included.
                </Paragraph>
                <Paragraph label="Produce">
                  This section is fully comprised of various fresh fruits and vegetables. This department is normally
                  found towards the front of the store.
                </Paragraph>
                <Paragraph label="Dairy">
                  The dairy department contains dairy items such as sour creams and dips, yogurt, and common staples
                  including milks and different cheeses.
                </Paragraph>
                <Paragraph label="Frozen Food">
                  The frozen food department consists of frozen foods and meals, vegetables, breakfast items, and ice
                  cream.
                </Paragraph>
                <Paragraph label="Meat">
                  The meat department of a warehouse supermarket contains fresh, pre-packaged, and custom cut poultry,
                  seafood, and meat.
                </Paragraph>
                <Paragraph label="Bakery">
                  Many of these kinds of stores have bakery sections where you can get bread, cakes, muffins, cookies,
                  and other bakery items.
                </Paragraph>
                <TipExample label="Helpful Tip">
                  Warehouse supermarkets such as Costco and Sam’s Club often contain large signs over food sections to
                  aid navigation.
                </TipExample>
                <TipExample label="Note">
                  Some stores such as Sam’s Club and Costco have free samples. Please ensure you look at the
                  nutritional information before purchasing or eating an advertised item.
                </TipExample>
              </Section>

              <SectionDivider />

              <Section id="specialized-grocery-stores" title="Specialized Grocery Stores">
                <Typography>
                  Specialized ethnic grocery stores typically have a similar layout to standard supermarkets, but
                  smaller. Most of these stores are small businesses owned by locals, so they are each unique in their
                  own ways. Google is the best tool to use to find local stores near you (or local news that contain
                  lists of these grocery stores).
                </Typography>
                <Typography>These specialized ethnic grocery stores may include:</Typography>
                <BulletedList
                  items={[
                    'Indian markets',
                    'Mexican markets',
                    'East Asian markets',
                    'Middle Eastern / Mediterranean markets',
                    'African markets',
                    'Native American / Alaska Native markets',
                  ]}
                />
                <Photo
                  src={asset('/images/module-4-chapter-1/specialized-grocery-store.jpg')}
                  alt="A shopkeeper handing a customer a bag of tomatoes in a small market"
                />
              </Section>

              <SectionDivider />

              <Section id="shopping-online" title="Shopping Online">
                <BulletedList
                  items={[
                    'Apps such as Instacart have the option to either deliver groceries to a residence or allow for car pickup in store (for example, Meijer).',
                    'Caregivers can order groceries for older adults online, even if they are across the country.',
                    'Having a grocery list beforehand is recommended so you won’t get distracted by the deals and special sales most websites use.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="grocery-store-tips" title="Grocery Store Tips">
                <Typography variant="h6">Finding What You Need</Typography>
                <BulletedList
                  items={[
                    'Many grocery stores have websites or apps you can download. They will often tell you if a food is in stock at a location and what aisle it is in (for example, Walmart and Costco).',
                    'Don’t be afraid to ask an employee where something is.',
                    'Marketing teams place related items close to each other, which can be helpful when trying to locate something (for example, yogurt could be near the granola).',
                  ]}
                />
                <Typography variant="h6">Saving Money</Typography>
                <BulletedList
                  items={[
                    'You can save money by accumulating store cash and paying attention to coupons.',
                    'Sale items are usually marked with a different color tag or a specific symbol.',
                    'When something is on sale, especially produce, make sure you don’t over-buy. Food may go bad faster than it can be eaten.',
                    'Most store brands are just as high quality as name brands, but are cheaper.',
                  ]}
                />
                <Typography variant="h6">Allergies and Food Labels</Typography>
                <BulletedList
                  items={[
                    'Some grocery stores have allergy-specific aisles, but they vary in location.',
                    'If something is free from common allergens or holds a certain certification, it will often be labeled on the box with a symbol. It is an easy way to check for allergens without reading the ingredients label.',
                    'Small businesses don’t always have clear or well-formatted nutrition labels on their food. Be cautious when following a diet plan.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="general-nutrition-tips" title="General Nutrition Tips">
                <BulletedList
                  items={[
                    'Processed food can increase cognitive decline and worsen health conditions. It is best to avoid highly processed foods, such as deli meats and chips, and instead choose nutrient-dense foods.',
                    'Too much sugar harms oral health, which is vital to disease prevention, digestion, and nutritional diversity. Make sure your care recipient doesn’t have too much, or that they brush their teeth afterward.',
                  ]}
                />
              </Section>

              <SectionDivider />

              <Section id="how-to-quickly-read-nutrition-labels" title="Review: How to Quickly Read Nutrition Labels">
                <BulletedList
                  items={[
                    'Calories per serving are large and bolded at the top, along with the serving size.',
                    'Ingredients are typically next to or below the nutrition facts. Ingredients are listed in order of amount by weight in the product.',
                    'Common allergens are listed as well.',
                  ]}
                />
                <AnnotatedNutritionLabel />
              </Section>

              <SectionDivider />

              <Section id="nutrition-considerations" title="Nutrition Considerations for Common Health Conditions">
                <Paragraph label="Colon Problems">Increase fiber, such as fresh produce and fruit intake.</Paragraph>
                <ContentUnderReview>
                  Diabetes. The source slide’s diabetes guidance (sugar substitutes vs. regular sugar, and eating foods
                  higher in carbohydrates) is flagged in the PowerPoint itself by a reviewer for revision, since diabetes
                  nutrition needs are individualized. Not reproduced here to avoid publishing guidance under review.
                  Replace with revised copy once approved.
                </ContentUnderReview>
                <Paragraph label="Dementia">
                  Provide foods that are easy to prepare, such as premade salads and microwaveable meals.
                </Paragraph>
                <Paragraph label="Hypertension (High Blood Pressure)">
                  Limit sodium, reduce saturated fat, reduce protein, and choose foods that are rich in potassium and
                  fiber.
                </Paragraph>
                <Paragraph label="Heart Disease">Limit sodium (salt), saturated fat, added sugars, and alcohol.</Paragraph>
                <TipExample label="Note">
                  Individual nutrition needs may vary. Caregivers should follow recommendations from the individual’s
                  healthcare provider or registered dietitian nutritionist.
                </TipExample>
              </Section>

              <SectionDivider />

              <Section id="references" sx={{ pb: 0 }}>
                <ReferenceList title="References">
                  <Reference>
                    Agricultural Marketing Resource Center. Module 6, Departments and Layout in a Rural Grocery Store.
                    https://www.agmrc.org/media/cms/Module_6_Departments_and_Layout_in__F54DC02135F85.pdf
                  </Reference>
                  <Reference>
                    Aoe. (2025, May 6). Understanding Food Packaging Symbols and Their Meanings. InNaturePack.
                    https://www.innaturepack.com/understanding-food-packaging-symbols-and-their-meanings/
                  </Reference>
                  <Reference>
                    Berman, J. (2023, August 20). High blood pressure and diet: MedlinePlus Medical Encyclopedia.
                    Medlineplus.Gov. https://medlineplus.gov/ency/article/007483.htm
                  </Reference>
                  <Reference>
                    Chan, A. K. Y., Tsang, Y. C., Jiang, C. M., Leung, K. C. M., Lo, E. C. M., &amp; Chu, C. H. (2023).
                    Diet, Nutrition, and Oral Health in Older Adults: A Review of the Literature. Dentistry Journal,
                    11(9), 222. https://doi.org/10.3390/dj11090222
                  </Reference>
                  <Reference>CONVENIENCE STORE definition | Cambridge English Dictionary.</Reference>
                  <Reference>
                    Ethnic Markets. (2024, September 7). West Suburban Living.
                    https://www.westsuburbanliving.net/archives/ethnic-markets/article_a5772806-6d6a-11ef-a196-37ff2d909ec8.html
                  </Reference>
                  <Reference>
                    Food Labels: Read It Before You Eat It! (2023). Aaaai.Org.
                    https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/food-labels
                  </Reference>
                  <Reference>
                    How to understand and use the nutrition facts label | FDA. (2024, May 3).
                    https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label
                  </Reference>
                  <Reference>
                    Meijer Delivery Near Me | Instacart. (2026). Instacart.Com.
                    https://www.instacart.com/store/meijer/storefront
                  </Reference>
                  <Reference>
                    National Heart, Lung, and Blood Institute. (2022, March 24). Choose heart-healthy foods.
                    Www.Nhlbi.Nih.Gov. https://www.nhlbi.nih.gov/health/heart-healthy-living/healthy-foods
                  </Reference>
                  <Reference>
                    NIH National Institute on Aging (NIA). (n.d.). Tips for caregivers: Helping people with Alzheimer’s
                    disease eat well.
                    https://www.nia.nih.gov/health/alzheimers-caregiving/tips-caregivers-helping-people-alzheimers-disease-eat-well
                  </Reference>
                  <Reference>
                    Sigurdsson, V., Saevarsson, H., &amp; Foxall, G. (2009). Brand placement and consumer choice: an
                    in-store experiment. Journal of Applied Behavior Analysis, 42(3), 741–745.
                    https://doi.org/10.1901/jaba.2009.42-741
                  </Reference>
                  <Reference>
                    Team, R. W. (2025, March 25). The 5 Best Foods for a Healthy Colon. Renown Health.
                    https://www.renown.org/blog/5-best-foods-for-a-healthy-colon
                  </Reference>
                </ReferenceList>
              </Section>
            </Box>
          </Box>

          <ChapterFooter to="/module-4-chapter-2" chapterId="mod4ch1" reachedEnd={reachedEnd} />
        </Box>
      </Box>
    </>
  );
}
