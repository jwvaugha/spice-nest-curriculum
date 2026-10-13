import ArticleTextIcon from '../components/ArticleTextIcon';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

// Module 2's sidebar item list, as seen from Module2Chapter1.jsx (its active row).
// Shared with pages/ModuleReflection.jsx so the reflection page's sidebar
// can't drift from the chapter page's.
export const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod2ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Basics of Diabetes',
    active: true,
    sections: [
      { label: 'What is Diabetes?', id: 'what-is-diabetes' },
      { label: 'What is insulin?', id: 'what-is-insulin' },
      { label: 'Main types of diabetes', id: 'main-types-of-diabetes' },
      { label: 'Common symptoms of diabetes', id: 'common-symptoms-of-diabetes' },
      { label: 'Risk Factors', id: 'risk-factors' },
      { label: 'Prevention', id: 'prevention' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod2ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Managing diabetes through diet',
    to: '/module-2-chapter-2',
    sections: [
      { label: 'Diet and Diabetes', id: 'diet-and-diabetes' },
      { label: 'Examples of Food to Eat Less Often', id: 'examples-of-food-to-eat-less-often' },
      { label: 'Foods to Focus On', id: 'foods-to-focus-on' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod2ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Alternative approaches to managing diabetes',
    to: '/module-2-chapter-4',
    sections: [
      { label: 'Change Your Meal Order', id: 'change-your-meal-order' },
      { label: 'Stay Hydrated', id: 'stay-hydrated' },
      { label: 'Move Your Body After Meals', id: 'move-your-body-after-meals' },
      { label: 'Keep a Good Sleep Schedule', id: 'keep-a-good-sleep-schedule' },
      { label: 'Key Messages', id: 'key-messages' },
      { label: 'References', id: 'references' },
    ],
  },
  {
    chapterId: 'mod2ch5',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: "Medication and diet: what's the relationship?",
    to: '/module-2-chapter-5',
    sections: [
      { label: 'Diabetes Medicines', id: 'diabetes-medicines' },
      { label: 'Timing Your Medication with Meals', id: 'timing-your-medication-with-meals' },
      { label: 'Important Reminders', id: 'important-reminders' },
      { label: 'References', id: 'references' },
    ],
  },
  { chapterId: 'mod2-infographic', icon: ArticleTextIcon, label: 'Text / Infographic', title: 'Diabetes factsheet' },
  { chapterId: 'mod2-text', icon: ArticleTextIcon, label: 'Text', title: 'South Asian diabetes myths and facts' },
  { chapterId: 'mod2-interactive', icon: ExtensionRoundedIcon, label: 'Interactive', title: 'Plate Builder Game lvl 2' },
  { chapterId: 'mod2-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 2 Reflection', to: '/module-2-reflection' },
];
