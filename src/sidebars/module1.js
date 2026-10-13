import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

// Module 1's sidebar item list, as seen from Module1Chapter1.jsx (its active row).
// Shared with pages/ModuleReflection.jsx so the reflection page's sidebar
// can't drift from the chapter page's.
export const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod1ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Why Diet Matters',
    active: true,
    sections: [
      { label: 'Why Diet Matters in the Short Term', id: 'why-diet-matters-in-the-short-term' },
      { label: 'Why Diet Matters in the Long Term', id: 'why-diet-matters-in-the-long-term' },
    ],
  },
  {
    chapterId: 'mod1ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Food Groups',
    to: '/module-1-chapter-2',
    sections: [{ label: 'Food Groups', id: 'food-groups' }],
  },
  {
    chapterId: 'mod1ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'The Nutrition Facts Label',
    to: '/module-1-chapter-4',
    sections: [{ label: 'Explore the Label', id: 'explore-the-label' }],
  },
  {
    chapterId: 'mod1ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Common Food Myths vs. Facts',
    to: '/module-1-chapter-5',
    sections: [{ label: 'Common Food Myths vs. Facts', id: 'common-food-myths-vs-facts' }],
  },
  { chapterId: 'mod1-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game' },
  { chapterId: 'mod1-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 1 Reflection', to: '/module-1-reflection' },
];
