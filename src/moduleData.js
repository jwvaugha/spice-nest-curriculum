import { asset } from './assetPath';
// Single source of truth for "what chapters/resources exist in each module"
// so the Dashboard's progress bars and expandable chapter lists are computed
// from real data instead of hand-typed numbers. Sourced from each module's
// real Figma sidebar (NEST Prototype page, swept this session), not guessed.
//
// `chapters` lists every real content UNIT a learner reads — numbered
// "Chapter N" pages, unlike the trailing resource rows (Interactive games,
// Reflection prompts, Printable handouts, Text/Infographic extras) which are
// supplementary and deliberately excluded from `chapters` — matching the
// original Module 2 progress list's own exclusion of those rows, just
// applied consistently to every module now that more than one module has
// real content. `to: null` means the page doesn't exist yet — it's listed
// (disabled) in a module's chapter list, but per direct user direction
// (2026-10-05) it does NOT count toward progress or completion: progress
// bars, "N/M Chapters Complete", checkmarks, Home's Completed group and
// sequential unlocking all count built chapters only (isModuleComplete).
//
// Module 2 and 6 originally also had standalone "Video" rows counted here
// too (both content units a learner needed to get through, same as a
// chapter). Those videos were canceled (2026-09-28) -- removed entirely,
// not just left at `to: null`, since there's no content to reference at
// all anymore, not even as a disabled placeholder. Module 2 now has 4
// chapters (was 5), Module 6 still has 3 (the 2 video rows never counted
// toward its own chapter numbering, just toward its total unit count).
export const MODULES = [
  {
    number: 1,
    title: 'Foundational Knowledge',
    thumbSrc: asset('/images/dashboard/module-1.jpg'),
    chapters: [
      { chapterId: 'mod1ch1', label: 'Chapter 1', title: 'Why Diet Matters', to: '/module-1-chapter-1' },
      { chapterId: 'mod1ch2', label: 'Chapter 2', title: 'Food Groups', to: '/module-1-chapter-2' },
      { chapterId: 'mod1ch4', label: 'Chapter 3', title: 'The Nutrition Facts Label', to: '/module-1-chapter-4' },
      { chapterId: 'mod1ch5', label: 'Chapter 4', title: 'Common Food Myths vs. Facts', to: '/module-1-chapter-5' },
    ],
  },
  {
    number: 2,
    title: 'Tailored Guidance for Diet-Related Conditions: Diabetes',
    thumbSrc: asset('/images/dashboard/module-2.jpg'),
    chapters: [
      { chapterId: 'mod2ch1', label: 'Chapter 1', title: 'Basics of Diabetes', to: '/module-2-chapter-1' },
      { chapterId: 'mod2ch2', label: 'Chapter 2', title: 'Managing Diabetes Through Diet', to: '/module-2-chapter-2' },
      { chapterId: 'mod2ch4', label: 'Chapter 3', title: 'Alternative Approaches to Managing Diabetes', to: '/module-2-chapter-4' },
      { chapterId: 'mod2ch5', label: 'Chapter 4', title: "Medication and Diet: What's The Relationship?", to: '/module-2-chapter-5' },
    ],
  },
  {
    number: 3,
    title: 'Meal Planning',
    thumbSrc: asset('/images/dashboard/module-3.jpg'),
    chapters: [
      { chapterId: 'mod3ch1', label: 'Chapter 1', title: 'Creating a Meal Plan & Grocery List', to: '/module-3-chapter-1' },
      { chapterId: 'mod3ch2', label: 'Chapter 2', title: 'Cook Once, Eat Twice', to: '/module-3-chapter-2' },
      { chapterId: 'mod3ch3', label: 'Chapter 3', title: 'Avoiding Food Waste', to: '/module-3-chapter-3' },
      { chapterId: 'mod3ch4', label: 'Chapter 4', title: 'Tools and Mobile Apps for Meal Planning and Tracking', to: '/module-3-chapter-4' },
      { chapterId: 'mod3ch5', label: 'Chapter 5', title: 'Meal Planning Organizer', to: null },
    ],
  },
  {
    number: 4,
    title: 'Grocery Skills',
    thumbSrc: asset('/images/dashboard/module-4.jpg'),
    chapters: [
      { chapterId: 'mod4ch1', label: 'Chapter 1', title: 'Navigating the Grocery Store', to: null },
      { chapterId: 'mod4ch2', label: 'Chapter 2', title: 'Seasonal and Ethnic Markets', to: '/module-4-chapter-2' },
      { chapterId: 'mod4ch3', label: 'Chapter 3', title: 'Grocery Shopping With Limited Resources', to: '/module-4-chapter-3' },
      { chapterId: 'mod4ch4', label: 'Chapter 4', title: 'Budgeting', to: '/module-4-chapter-4' },
    ],
  },
  {
    number: 5,
    title: 'Cooking and Substitutions',
    thumbSrc: asset('/images/dashboard/module-5.jpg'),
    chapters: [
      { chapterId: 'mod5ch1', label: 'Chapter 1', title: 'Measuring and Portion Size Techniques', to: null },
      { chapterId: 'mod5ch2', label: 'Chapter 2', title: 'Enhancing Flavor Through Spices and Herbs', to: '/module-5-chapter-2' },
      { chapterId: 'mod5ch3', label: 'Chapter 3', title: 'Substitutions and Experimentation', to: '/module-5-chapter-3' },
      { chapterId: 'mod5ch4', label: 'Chapter 4', title: 'Adapting Recipes for Cuisine, Condition, and Taste', to: '/module-5-chapter-4' },
    ],
  },
  {
    number: 6,
    title: 'Communication & Quality of Life Balance',
    thumbSrc: asset('/images/dashboard/module-6.jpg'),
    chapters: [
      { chapterId: 'mod6ch2', label: 'Chapter 2', title: 'Motivational Interviewing Strategies', to: '/module-6-chapter-2' },
      { chapterId: 'mod6ch4', label: 'Chapter 3', title: 'Self Care as a Caregiver', to: '/module-6-chapter-4' },
      { chapterId: 'mod6ch5', label: 'Chapter 4', title: 'Managing Multiple Caregiving Relationships', to: '/module-6-chapter-5' },
    ],
  },
];

// A module counts as "complete" for unlock purposes once every chapter that
// actually HAS a page (`c.to`) has been viewed -- not every chapter in the
// array. Several modules have one or more `to: null` entries (content not
// built yet), and requiring those too would mean the next module could
// never unlock until every last page in the curriculum exists, which isn't
// what "finish this module" should mean for a learner. A module with zero
// built chapters at all (shouldn't happen given the current curriculum,
// but defensively) counts as complete rather than permanently blocking
// everything after it. Shared by Dashboard (Modules tab) and Home's module
// stack so both pages always agree on what's complete and what's locked.
export function isModuleComplete(mod, isViewed) {
  const built = mod.chapters.filter((c) => c.to);
  if (built.length === 0) return true;
  return built.every((c) => isViewed(c.chapterId));
}

// Sequential-unlock cascade, in curriculum order: a module is locked only if
// sequential mode is on AND some module before it isn't complete yet.
// Returns a Set of locked module numbers.
export function getLockedModules(isViewed, sequentialMode) {
  const locked = new Set();
  let unlocked = true;
  for (const mod of MODULES) {
    if (sequentialMode && !unlocked) locked.add(mod.number);
    unlocked = unlocked && isModuleComplete(mod, isViewed);
  }
  return locked;
}

// Where Home's "Dive Back In" card should send the learner, as
// { module, chapter } -- shared with Home's module stack so its
// "This Module" section always matches the card. Per direct user direction
// it resumes from the most recently VISITED chapter, not the earliest gap:
//   1. Last-visited chapter, if it isn't read yet -> resume it.
//   2. Otherwise the next unread built chapter AFTER it in curriculum
//      order, wrapping around to earlier gaps once nothing later is left.
//   3. No visit history -> the first unread built chapter overall.
//   4. Everything read -> the very first built chapter.
// Chapters in a locked module (sequential mode) are never candidates, and a
// last-visited chapter inside one is ignored (possible if it was opened
// while sequential unlocking was off).
export function getResumeTarget(isViewed, lastVisited, sequentialMode) {
  const locked = getLockedModules(isViewed, sequentialMode);
  const built = MODULES.flatMap((module) =>
    module.chapters.filter((c) => c.to).map((chapter) => ({ module, chapter })),
  );
  const available = built.filter((e) => !locked.has(e.module.number));
  const lastIdx = available.findIndex((e) => e.chapter.chapterId === lastVisited);

  if (lastIdx !== -1 && !isViewed(lastVisited)) return available[lastIdx];

  const start = lastIdx === -1 ? 0 : lastIdx + 1;
  const ordered = [...available.slice(start), ...available.slice(0, start)];
  return ordered.find((e) => !isViewed(e.chapter.chapterId)) || built[0] || null;
}
