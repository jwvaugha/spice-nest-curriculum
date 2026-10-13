import ArticleTextIcon from '../components/ArticleTextIcon';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

// Module 4's sidebar item list, as seen from Module4Chapter1.jsx (its active row).
// Shared with pages/ModuleReflection.jsx so the reflection page's sidebar
// can't drift from the chapter page's.
export const SIDEBAR_ITEM_DEFS = [
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
  { chapterId: 'mod4-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 4 Reflection', to: '/module-4-reflection' },
];
