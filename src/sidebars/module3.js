import ArticleTextIcon from '../components/ArticleTextIcon';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

// Module 3's sidebar item list, as seen from Module3Chapter1.jsx (its active row).
// Shared with pages/ModuleReflection.jsx so the reflection page's sidebar
// can't drift from the chapter page's.
export const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod3ch1',
    icon: ArticleTextIcon,
    label: 'Chapter 1',
    title: 'Creating a meal plan and aligning with grocery list',
    active: true,
    sections: [
      { label: 'Two Ways to Plan Your Meals', id: 'two-ways-to-plan-your-meals' },
      { label: 'Tips for Meal Planning', id: 'tips-for-meal-planning' },
      { label: 'Tips for Making a Grocery List', id: 'tips-for-making-a-grocery-list' },
      { label: 'Tips for Meal Preparation', id: 'tips-for-meal-preparation' },
      { label: 'Key Messages', id: 'key-messages' },
    ],
  },
  {
    chapterId: 'mod3ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Efficiency Strategies',
    to: '/module-3-chapter-2',
    sections: [
      { label: 'Why This Matters', id: 'why-this-matters' },
      { label: 'Prepping in Advance & Batch Cooking', id: 'prepping-in-advance-batch-cooking' },
      { label: 'Tips for Successful Meal Prep', id: 'tips-for-successful-meal-prep' },
      { label: 'Shelf Life and Food Storage', id: 'shelf-life-and-food-storage' },
      { label: 'Cook Once, Eat Twice', id: 'cook-once-eat-twice' },
      { label: 'Key Takeaway', id: 'key-takeaway' },
    ],
  },
  {
    chapterId: 'mod3ch3',
    icon: ArticleTextIcon,
    label: 'Chapter 3',
    title: 'Avoiding Food Waste',
    to: '/module-3-chapter-3',
    sections: [
      { label: 'Why does food get wasted?', id: 'why-does-food-get-wasted' },
      { label: 'How to store food properly', id: 'how-to-store-food-properly' },
      { label: 'What date labels mean', id: 'what-date-labels-mean' },
      { label: 'Good foods to buy in bulk', id: 'good-foods-to-buy-in-bulk' },
      { label: 'Bad foods to buy in bulk', id: 'bad-foods-to-buy-in-bulk' },
      { label: 'Simple habits to reduce waste', id: 'simple-habits-to-reduce-waste' },
    ],
  },
  {
    chapterId: 'mod3ch4',
    icon: ArticleTextIcon,
    label: 'Chapter 4',
    title: 'Tools and mobile apps for meal planning and tracking',
    to: '/module-3-chapter-4',
    sections: [
      { label: 'Tools to help you meal plan', id: 'tools-to-help-you-meal-plan' },
      { label: 'Common features of tracking apps', id: 'common-features-of-tracking-apps' },
      { label: 'Benefits of nutrition tracking apps', id: 'benefits-of-nutrition-tracking-apps' },
      { label: 'Things to consider', id: 'things-to-consider' },
    ],
  },
  { chapterId: 'mod3ch5', icon: ArticleTextIcon, label: 'Chapter 5', title: 'Meal Planning Organizer' },
  { chapterId: 'mod3-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 3 Reflection', to: '/module-3-reflection' },
];
