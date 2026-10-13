// One reflection page per module (`/module-N-reflection`), rendered by
// pages/ModuleReflection.jsx. Prompt wording comes verbatim from the Figma
// "Reflections" section (Claude Code Experiments page, frames
// Mod-1-Reflection ... Mod-6-Reflection, built 2026-10-13). Those prompts were
// pulled from the curriculum skeleton and reworded to match what each built
// module actually covers. Module 5's prompts are not from the skeleton (it
// had none); the user kept the suggested pair. Module 2 was shortened by the
// user to two questions.
//
// `next` is where the reflection's footer goes: the next module's first
// chapter, or the Dashboard after Module 6.
export const REFLECTIONS = {
  1: {
    prompt:
      'What are meals my relative loves? What does healthy eating look like in my culture, and what can be maintained?',
    next: { to: '/module-2-chapter-1', label: 'Continue to Next Module' },
  },
  2: {
    prompt:
      'What concerns or challenges do I have about managing my relative’s diet? What does healing through food look like in my culture?',
    next: { to: '/module-3-chapter-1', label: 'Continue to Next Module' },
  },
  3: {
    prompt:
      'What makes meal planning easier for me, and what gets in the way? What is the best day and time of the week for me to plan meals?',
    next: { to: '/module-4-chapter-1', label: 'Continue to Next Module' },
  },
  4: {
    prompt: 'What do I like to buy fresh, and why? What could I buy frozen or canned instead to save money or time?',
    next: { to: '/module-5-chapter-1', label: 'Continue to Next Module' },
  },
  5: {
    prompt:
      'Which family recipe would I like to adapt, and what is one small change I could try? Which spices or herbs could I use to add flavor in place of extra salt or sugar?',
    next: { to: '/module-6-chapter-2', label: 'Continue to Next Module' },
  },
  6: {
    prompt: 'What matters most today: nutrition or joy? How am I taking care of myself?',
    next: { to: '/dashboard', label: 'Back to Dashboard' },
  },
};

export const reflectionPath = (moduleNumber) => `/module-${moduleNumber}-reflection`;
export const reflectionId = (moduleNumber) => `mod${moduleNumber}-reflection`;
