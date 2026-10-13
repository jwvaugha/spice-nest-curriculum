import ArticleTextIcon from '../components/ArticleTextIcon';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';

// Module 6's sidebar item list, as seen from Module6Chapter2.jsx (its active row).
// Shared with pages/ModuleReflection.jsx so the reflection page's sidebar
// can't drift from the chapter page's.
export const SIDEBAR_ITEM_DEFS = [
  {
    chapterId: 'mod6ch2',
    icon: ArticleTextIcon,
    label: 'Chapter 2',
    title: 'Motivational interviewing strategies',
    active: true,
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
    to: '/module-6-chapter-5',
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
  { chapterId: 'mod6-reflection', icon: NoteAltRoundedIcon, label: 'Reflection', title: 'Module 6 Reflection', to: '/module-6-reflection' },
];
