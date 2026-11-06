// Plate Builder game data.
//
// SOURCE: copied verbatim from the Figma Make prototype "Nutrition Plate
// Mini-Game V2" (figma.com/make/RxAdO1VFgufrjITCEZVjEN), files
// src/app/data/foods.ts and src/app/data/healthConditions.ts, pulled
// 2026-11-02. Only the shape changed (TS -> JS, emoji dropped: the Figma
// design uses Game/Food Art placeholder tiles, never emoji).
//
// NOT YET RDN-REVIEWED. Every food value, target range and hint below is
// the Make prototype's own and still needs review by a registered
// dietitian before this game ships. Don't "fix" a number here by hand;
// change it only from a reviewed source.

export const FOODS = [
  { id: 'salmon', name: 'Grilled Salmon', category: 'protein', servingSize: '3.5 oz', nutrition: { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sodium: 59, sugar: 0 } },
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'protein', servingSize: '3.5 oz', nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, sugar: 0 } },
  { id: 'quinoa', name: 'Quinoa', category: 'grain', servingSize: '1/2 cup cooked', nutrition: { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, sodium: 7, sugar: 0.9 } },
  { id: 'brown-rice', name: 'Brown Rice', category: 'grain', servingSize: '1/2 cup cooked', nutrition: { calories: 112, protein: 2.3, carbs: 22, fat: 0.9, fiber: 1.8, sodium: 5, sugar: 0.4 } },
  { id: 'broccoli', name: 'Broccoli', category: 'vegetable', servingSize: '1 cup', nutrition: { calories: 25, protein: 3, carbs: 5, fat: 0.4, fiber: 2.3, sodium: 33, sugar: 1.2 } },
  { id: 'spinach', name: 'Fresh Spinach', category: 'vegetable', servingSize: '1 cup', nutrition: { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sodium: 24, sugar: 0.1 } },
  { id: 'avocado', name: 'Avocado', category: 'fat', servingSize: '1/2 medium', nutrition: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sodium: 7, sugar: 0.7 } },
  { id: 'almonds', name: 'Almonds', category: 'fat', servingSize: '1 oz (23 nuts)', nutrition: { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sodium: 1, sugar: 1.2 } },
  { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'dairy', servingSize: '6 oz', nutrition: { calories: 100, protein: 17, carbs: 6, fat: 0.7, fiber: 0, sodium: 56, sugar: 6 } },
  { id: 'berries', name: 'Mixed Berries', category: 'fruit', servingSize: '1/2 cup', nutrition: { calories: 42, protein: 0.5, carbs: 11, fat: 0.2, fiber: 3.3, sodium: 1, sugar: 7 } },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'vegetable', servingSize: '1 medium', nutrition: { calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.9, sodium: 6, sugar: 7 } },
  { id: 'olive-oil', name: 'Olive Oil', category: 'fat', servingSize: '1 tbsp', nutrition: { calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, sodium: 0, sugar: 0 } },
  { id: 'turkey-breast', name: 'Turkey Breast', category: 'protein', servingSize: '3.5 oz', nutrition: { calories: 135, protein: 25, carbs: 0, fat: 3, fiber: 0, sodium: 65, sugar: 0 } },
  { id: 'tofu', name: 'Tofu', category: 'protein', servingSize: '3.5 oz', nutrition: { calories: 94, protein: 10, carbs: 2.3, fat: 6, fiber: 0.4, sodium: 7, sugar: 0.6 } },
  { id: 'black-beans', name: 'Black Beans', category: 'protein', servingSize: '1/2 cup', nutrition: { calories: 114, protein: 7.6, carbs: 20, fat: 0.5, fiber: 7.5, sodium: 1, sugar: 0.3 } },
  { id: 'bacon', name: 'Bacon', category: 'protein', servingSize: '3 strips', nutrition: { calories: 161, protein: 12, carbs: 0.6, fat: 12, fiber: 0, sodium: 718, sugar: 0 } },
  { id: 'processed-deli-meat', name: 'Deli Ham', category: 'protein', servingSize: '3 oz', nutrition: { calories: 145, protein: 21, carbs: 1.5, fat: 5.5, fiber: 0, sodium: 1275, sugar: 1.3 } },
  { id: 'oats', name: 'Steel Cut Oats', category: 'grain', servingSize: '1/2 cup cooked', nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, sodium: 0, sugar: 1 } },
  { id: 'whole-wheat-bread', name: 'Whole Wheat Bread', category: 'grain', servingSize: '1 slice', nutrition: { calories: 80, protein: 4, carbs: 14, fat: 1.1, fiber: 2, sodium: 170, sugar: 1.4 } },
  { id: 'white-rice', name: 'White Rice', category: 'grain', servingSize: '1/2 cup cooked', nutrition: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: 1, sugar: 0.1 } },
  { id: 'white-bread', name: 'White Bread', category: 'grain', servingSize: '1 slice', nutrition: { calories: 75, protein: 2.3, carbs: 14, fat: 1, fiber: 0.8, sodium: 170, sugar: 1.4 } },
  { id: 'pasta', name: 'White Pasta', category: 'grain', servingSize: '1/2 cup cooked', nutrition: { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sodium: 1, sugar: 0.8 } },
  { id: 'kale', name: 'Kale', category: 'vegetable', servingSize: '1 cup', nutrition: { calories: 7, protein: 0.6, carbs: 1.4, fat: 0.1, fiber: 0.6, sodium: 11, sugar: 0.2 } },
  { id: 'bell-peppers', name: 'Bell Peppers', category: 'vegetable', servingSize: '1 cup', nutrition: { calories: 31, protein: 1, carbs: 7, fat: 0.3, fiber: 2.5, sodium: 4, sugar: 4.2 } },
  { id: 'carrots', name: 'Carrots', category: 'vegetable', servingSize: '1/2 cup', nutrition: { calories: 25, protein: 0.5, carbs: 6, fat: 0.1, fiber: 1.7, sodium: 42, sugar: 2.9 } },
  { id: 'french-fries', name: 'French Fries', category: 'vegetable', servingSize: '1 medium serving', nutrition: { calories: 365, protein: 4, carbs: 63, fat: 17, fiber: 4, sodium: 246, sugar: 0.3 } },
  { id: 'apple', name: 'Apple', category: 'fruit', servingSize: '1 medium', nutrition: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sodium: 1, sugar: 10.4 } },
  { id: 'banana', name: 'Banana', category: 'fruit', servingSize: '1 medium', nutrition: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sodium: 1, sugar: 12.2 } },
  { id: 'orange', name: 'Orange', category: 'fruit', servingSize: '1 medium', nutrition: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sodium: 0, sugar: 9.4 } },
  { id: 'fruit-juice', name: 'Orange Juice', category: 'fruit', servingSize: '8 fl oz', nutrition: { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sodium: 2, sugar: 20.8 } },
  { id: 'walnuts', name: 'Walnuts', category: 'fat', servingSize: '1 oz', nutrition: { calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sodium: 1, sugar: 0.7 } },
  { id: 'fish-oil', name: 'Fish Oil', category: 'fat', servingSize: '1 tbsp', nutrition: { calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, sodium: 0, sugar: 0 } },
  { id: 'butter', name: 'Butter', category: 'fat', servingSize: '1 tbsp', nutrition: { calories: 102, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0, sodium: 91, sugar: 0 } },
  { id: 'margarine', name: 'Margarine', category: 'fat', servingSize: '1 tbsp', nutrition: { calories: 101, protein: 0.2, carbs: 0.1, fat: 11.4, fiber: 0, sodium: 133, sugar: 0.1 } },
  { id: 'vegetable-oil', name: 'Vegetable Oil', category: 'fat', servingSize: '1 tbsp', nutrition: { calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, sodium: 0, sugar: 0 } },
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'dairy', servingSize: '1/2 cup', nutrition: { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, sodium: 364, sugar: 2.7 } },
  { id: 'milk', name: 'Low-fat Milk', category: 'dairy', servingSize: '8 fl oz', nutrition: { calories: 102, protein: 8.2, carbs: 12, fat: 2.4, fiber: 0, sodium: 107, sugar: 12.2 } },
  { id: 'ice-cream', name: 'Ice Cream', category: 'dairy', servingSize: '1/2 cup', nutrition: { calories: 137, protein: 2.3, carbs: 16, fat: 7, fiber: 0.5, sodium: 53, sugar: 14 } },
  { id: 'processed-cheese', name: 'American Cheese', category: 'dairy', servingSize: '1 slice', nutrition: { calories: 104, protein: 5.4, carbs: 2.2, fat: 8.9, fiber: 0, sodium: 377, sugar: 2 } },
  { id: 'potato-chips', name: 'Potato Chips', category: 'snack', servingSize: '1 oz', nutrition: { calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1.4, sodium: 149, sugar: 0.1 } },
  { id: 'cookies', name: 'Chocolate Chip Cookies', category: 'snack', servingSize: '1 medium cookie', nutrition: { calories: 78, protein: 1, carbs: 10, fat: 4, fiber: 0.4, sodium: 58, sugar: 5.8 } },
  { id: 'soda', name: 'Cola Soda', category: 'snack', servingSize: '12 fl oz', nutrition: { calories: 139, protein: 0, carbs: 39, fat: 0, fiber: 0, sodium: 9, sugar: 39 } },
  { id: 'candy', name: 'Gummy Bears', category: 'snack', servingSize: '10 pieces', nutrition: { calories: 87, protein: 0, carbs: 22, fat: 0, fiber: 0, sodium: 10, sugar: 17 } },
];

// The Make prototype shuffles 3 of these 4 conditions per game. The Figma
// design (Approach D refined, D0 intro) fixes the three challenges and their
// order: Type 2 Diabetes, Heart Health, Weight Management. The Make's 4th
// condition ("Athletic Performance") isn't used.
export const CHALLENGES = [
  {
    id: 'diabetes',
    name: 'Type 2 Diabetes',
    description: 'Create a balanced plate that helps manage blood sugar levels with controlled carbs and plenty of fiber.',
    targets: {
      calories: { min: 400, max: 600 },
      protein: { min: 20, max: 35 },
      carbs: { min: 30, max: 45 },
      fat: { min: 15, max: 25 },
      fiber: { min: 10 },
      sodium: { max: 800 },
      sugar: { max: 15 },
    },
    tips: [
      'Focus on complex carbs like quinoa and sweet potato',
      'Include lean protein to help stabilize blood sugar',
      'Add plenty of fiber-rich vegetables',
      'Limit simple sugars',
    ],
    art: 'protein',
  },
  {
    id: 'heart-health',
    name: 'Heart Health',
    description: 'Build a heart-healthy plate with omega-3 rich foods, limited sodium, and healthy fats.',
    targets: {
      calories: { min: 450, max: 650 },
      protein: { min: 25, max: 40 },
      carbs: { min: 35, max: 55 },
      fat: { min: 20, max: 30 },
      fiber: { min: 12 },
      sodium: { max: 600 },
      sugar: { max: 20 },
    },
    tips: [
      'Choose omega-3 rich fish like salmon',
      'Include healthy fats from avocado and nuts',
      'Keep sodium low',
      'Add plenty of vegetables and whole grains',
    ],
    art: 'vegetable',
  },
  {
    id: 'weight-loss',
    name: 'Weight Management',
    description: 'Create a satisfying, lower-calorie plate with high protein and fiber to help with weight management.',
    targets: {
      calories: { min: 300, max: 500 },
      protein: { min: 25, max: 40 },
      carbs: { min: 20, max: 40 },
      fat: { min: 10, max: 20 },
      fiber: { min: 15 },
      sodium: { max: 700 },
      sugar: { max: 12 },
    },
    tips: [
      'Prioritize lean protein to stay full',
      'Fill half your plate with low-calorie vegetables',
      'Choose complex carbs in smaller portions',
      'Include some healthy fats for satisfaction',
    ],
    art: 'grain',
  },
];

// Tray filter chips, in the Figma order. `id` matches FOODS[].category.
export const CATEGORIES = [
  { id: 'protein', label: 'Protein' },
  { id: 'grain', label: 'Grains' },
  { id: 'vegetable', label: 'Vegetables' },
  { id: 'fruit', label: 'Fruit' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'fat', label: 'Fats' },
  { id: 'snack', label: 'Snacks' },
];

// The 7 targets, in the Figma target-window order (D3). `unit` is how the
// value prints in the meters and result chips.
export const NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: '' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
];

// FDA Daily Values used by Game/Plate Nutrition Label (from the Figma
// annotation "The plate's Nutrition Facts"). Total sugars has no DV.
export const DAILY_VALUES = { fat: 78, sodium: 2300, carbs: 275, fiber: 28, protein: 50 };

// Score messages, verbatim from the Make's AppraisalModal.getScoreMessage.
export function scoreMessage(metCount) {
  const score = Math.round((metCount / NUTRIENTS.length) * 100);
  if (score >= 90) return "Excellent! You've created a perfect plate for this condition.";
  if (score >= 70) return 'Great job! Your plate meets most of the nutritional requirements.';
  if (score >= 50) return "Good effort! You're on the right track, but there's room for improvement.";
  return 'Keep practicing! Review the targets and try adjusting your food choices.';
}

// ---- Pure helpers -------------------------------------------------------

const EMPTY = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 };

export function foodById(id) {
  return FOODS.find((f) => f.id === id);
}

// `plate` is { [foodId]: servings }.
export function plateTotals(plate) {
  return Object.entries(plate).reduce((acc, [id, qty]) => {
    const n = foodById(id).nutrition;
    const out = { ...acc };
    for (const k of Object.keys(EMPTY)) out[k] += n[k] * qty;
    return out;
  }, { ...EMPTY });
}

export function servingCount(plate) {
  return Object.values(plate).reduce((a, b) => a + b, 0);
}

// 'met' | 'low' | 'high'. Same rules as the Make's MacroIndicator: a range
// target is met inside [min, max]; fiber only has a min; sodium/sugar only
// a max.
export function targetStatus(value, { min, max }) {
  if (min !== undefined && value < min) return 'low';
  if (max !== undefined && value > max) return 'high';
  return 'met';
}

// Bar fill, 0-100: value against max (or against min when there's no max),
// as in the Make's MacroIndicator. Matches the Figma D3 levels (368 kcal
// against a 600 max ≈ 60%).
export function targetFill(value, { min, max }) {
  const ref = max ?? min;
  return Math.max(0, Math.min(100, (value / ref) * 100));
}

export function formatAmount(value, unit) {
  return unit ? `${Math.round(value)} ${unit}` : `${Math.round(value)}`;
}

// "400–600", "15–25 g", "10 g+", "800 mg or less" (Figma D3 wording).
export function formatTarget({ min, max }, unit) {
  const u = unit ? ` ${unit}` : '';
  if (min !== undefined && max !== undefined) return `${min}–${max}${u}`;
  if (min !== undefined) return `${min}${u}+`;
  return `${max}${u} or less`;
}

// Display-only: the Make writes "1/2 cup cooked"; the Figma tiles show "½".
export function prettyServing(s) {
  return s.replace(/\b1\/2\b/g, '½');
}
