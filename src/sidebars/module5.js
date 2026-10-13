import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

// Module 5's sidebar item list, as seen from Module5Chapter1.jsx (its active row).
// Shared with pages/ModuleReflection.jsx so the reflection page's sidebar
// can't drift from the chapter page's.
export const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod5ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Measuring and portion size techniques',
    active: true,
    sections: [
      { label: 'What are Portion Sizes?', id: 'what-are-portion-sizes' },
      { label: 'Measuring Tools: Dry vs. Wet Measuring Cups', id: 'measuring-tools' },
      { label: 'Physical Changes in Ingredients: Cooked vs. Uncooked Volume', id: 'cooked-vs-uncooked-volume' },
      { label: 'Your Portable Measuring Tool: The Hand-Approach', id: 'hand-approach' },
    ],
  },
  {
    chapterId: 'mod5ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Enhancing flavor through spices and herbs',
    to: '/module-5-chapter-2',
    sections: [
      'Herbs vs. Spices: What’s the Difference?',
      'What are the Health Benefits?',
      'Tips for Using Herbs and Spices in Cooking',
      'Example of Tasty Pairings',
      'Key Messages',
    ],
  },
  {
    chapterId: 'mod5ch3',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Substitutions and experimentation',
    to: '/module-5-chapter-3',
    sections: [
      'Why Try New Things?',
      'Experimenting with Cooking Methods',
      'Try a Food Swap',
      'Tips for Making Smart Substitutions',
      'Try Plant-Based Swaps',
      'It Is Okay to Experiment',
      'Key Messages',
    ],
  },
  {
    chapterId: 'mod5ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Adapting recipes for cuisine, condition, and taste',
    to: '/module-5-chapter-4',
    sections: ['Match Your Culture and Traditions', 'Cook for Specific Health Needs', 'Adjust for Personal Taste', 'Key Messages'],
  },
  { chapterId: 'mod5-interactive1', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Changing the recipe...' },
  { chapterId: 'mod5-interactive2', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Spices and Herbs Explorer' },
  { chapterId: 'mod5-interactive3', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game Level 3' },
  { chapterId: 'mod5-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 5 Reflection', to: '/module-5-reflection' },
];
