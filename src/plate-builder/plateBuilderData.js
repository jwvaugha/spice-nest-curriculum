// Plate Builder game data.
//
// Level 2 SOURCE (FOODS, CHALLENGES): copied verbatim from the Figma Make prototype "Nutrition Plate
// Mini-Game V2" (figma.com/make/RxAdO1VFgufrjITCEZVjEN), files
// src/app/data/foods.ts and src/app/data/healthConditions.ts, pulled
// 2026-11-02. Only the shape changed (TS -> JS, emoji dropped: the Figma
// design uses Game/Food Art placeholder tiles, never emoji).
//
// NOT YET RDN-REVIEWED. Level 2's food values, target ranges and hints are
// the Make prototype's own; Level 1's foods come from USDA (see below).
// All of it still needs review by a registered
// dietitian before this game ships. Don't "fix" a number here by hand;
// change it only from a reviewed source.
//
// LEVELS: Level 1 ("Foundational Nutrition", three meal scenarios) is copied
// verbatim from the team's scenario document, supplied by the user
// 2026-11-09. Level 2 is the Make's three condition challenges, unchanged.
// The two levels score differently: Level 1 scores carbs/protein/fat as a
// share of calories (5 targets), while Level 2 scores grams (7 targets).
// So each level carries its own NUTRIENTS list.

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

// ---- Level 1 food list ---------------------------------------------------
// Foods as they'd actually be served (cooked, toasted, sliced, poured), not
// raw ingredients, and no mixed dishes (no "ham sandwich"); single prepared
// foods like oatmeal, hummus or dal are fine. South Asian staples were
// added at the user's request (2026-11-09). Each level has its own list.
//
// SOURCE: USDA FoodData Central, one entry per food (`fdcId`; the trailing
// comment names the dataset and USDA's description):
// - SR Legacy (April 2018) for single foods (cooked, raw, packaged).
// - FNDDS survey foods (October 2024) for prepared South Asian foods SR
//   Legacy lacks (roti, paratha, idli, dosa, upma, dal, curries, chai,
//   samosa, pakora). These are USDA's standard recipes, e.g. dal = cooked
//   lentils with 4% ghee and salt; chai = black tea, milk, sugar, spices.
// - One branded label (paneer), because the FNDDS paneer is implausible;
//   see scripts/plate-builder/level1_spec.py.
// Values are USDA's per-100 g figures scaled to `grams`, rounded to 0.1 g
// (calories and sodium to 1). Serving gram weights are USDA's own portion
// weights, except "3 oz" (85 g), half-cup splits of a USDA cup weight, the
// counted multiples (2 eggs, 2 rotis, 2 idli, 4 pakoras, 2 tbsp...), and
// ghee's 1 tsp (from USDA's butter-oil tablespoon). Home-cooked plain foods
// use USDA's "without salt" entries, so their sodium is what the food
// itself has; FNDDS recipes include their own salt.
export const LEVEL_1_FOODS = [
  { id: 'scrambled-eggs', name: 'Scrambled Eggs', category: 'protein', servingSize: '2 large eggs', grams: 122, fdcId: 172187, nutrition: { calories: 182, protein: 12.2, carbs: 2, fat: 13.4, fiber: 0, sodium: 177, sugar: 1.7 } }, // SR Legacy: Egg, whole, cooked, scrambled
  { id: 'hard-boiled-egg', name: 'Hard-Boiled Egg', category: 'protein', servingSize: '1 large egg', grams: 50, fdcId: 173424, nutrition: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sodium: 62, sugar: 0.6 } }, // SR Legacy: Egg, whole, cooked, hard-boiled
  { id: 'roast-chicken', name: 'Roasted Chicken Breast', category: 'protein', servingSize: '3 oz', grams: 85, fdcId: 171477, nutrition: { calories: 140, protein: 26.4, carbs: 0, fat: 3, fiber: 0, sodium: 63, sugar: 0 } }, // SR Legacy: Chicken, broilers or fryers, breast, meat only, cooked, roasted
  { id: 'baked-salmon', name: 'Baked Salmon', category: 'protein', servingSize: '3 oz', grams: 85, fdcId: 175168, nutrition: { calories: 175, protein: 18.8, carbs: 0, fat: 10.5, fiber: 0, sodium: 52, sugar: 0 } }, // SR Legacy: Fish, salmon, Atlantic, farmed, cooked, dry heat
  { id: 'canned-tuna', name: 'Tuna (canned in water)', category: 'protein', servingSize: '3 oz, drained', grams: 85, fdcId: 173709, nutrition: { calories: 73, protein: 16.5, carbs: 0, fat: 0.8, fiber: 0, sodium: 210, sugar: 0 } }, // SR Legacy: Fish, tuna, light, canned in water, drained solids (Includes foods for USDA's Food Distribution Program)
  { id: 'beef-patty', name: 'Lean Beef Patty', category: 'protein', servingSize: '3 oz (90% lean)', grams: 85, fdcId: 174031, nutrition: { calories: 184, protein: 22.2, carbs: 0, fat: 10, fiber: 0, sodium: 58, sugar: 0 } }, // SR Legacy: Beef, ground, 90% lean meat / 10% fat, patty, cooked, broiled
  { id: 'bacon', name: 'Bacon', category: 'protein', servingSize: '2 slices', grams: 16.2, fdcId: 167914, nutrition: { calories: 89, protein: 5.8, carbs: 0.2, fat: 7, fiber: 0, sodium: 355, sugar: 0 } }, // SR Legacy: Pork, cured, bacon, cooked, baked
  { id: 'deli-turkey', name: 'Sliced Deli Turkey', category: 'protein', servingSize: '3 slices', grams: 48, fdcId: 172941, nutrition: { calories: 51, protein: 7.1, carbs: 1.1, fat: 1.8, fiber: 0, sodium: 431, sugar: 0.4 } }, // SR Legacy: Turkey breast, sliced, prepackaged
  { id: 'black-beans', name: 'Black Beans', category: 'protein', servingSize: '1/2 cup cooked', grams: 86, fdcId: 173735, nutrition: { calories: 114, protein: 7.6, carbs: 20.4, fat: 0.5, fiber: 7.5, sodium: 1, sugar: 0.3 } }, // SR Legacy: Beans, black, mature seeds, cooked, boiled, without salt
  { id: 'lentils', name: 'Lentils', category: 'protein', servingSize: '1/2 cup cooked', grams: 99, fdcId: 172421, nutrition: { calories: 115, protein: 8.9, carbs: 19.9, fat: 0.4, fiber: 7.8, sodium: 2, sugar: 1.8 } }, // SR Legacy: Lentils, mature seeds, cooked, boiled, without salt
  { id: 'tofu', name: 'Firm Tofu', category: 'protein', servingSize: '1/2 cup', grams: 126, fdcId: 172448, nutrition: { calories: 98, protein: 11.4, carbs: 3.6, fat: 5.3, fiber: 1.1, sodium: 15, sugar: 0.8 } }, // SR Legacy: Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)
  { id: 'hummus', name: 'Hummus', category: 'protein', servingSize: '2 tbsp', grams: 30, fdcId: 174289, nutrition: { calories: 71, protein: 2.3, carbs: 4.5, fat: 5.3, fiber: 1.6, sodium: 128, sugar: 0.2 } }, // SR Legacy: Hummus, commercial
  { id: 'dal', name: 'Dal', category: 'protein', servingSize: '1/2 cup', grams: 120, fdcId: 2707427, nutrition: { calories: 174, protein: 10.3, carbs: 23, fat: 5.2, fiber: 9, sodium: 371, sugar: 2.1 } }, // FNDDS: Dal
  { id: 'chickpeas', name: 'Chickpeas (chana)', category: 'protein', servingSize: '1/2 cup cooked', grams: 82, fdcId: 173757, nutrition: { calories: 134, protein: 7.3, carbs: 22.5, fat: 2.1, fiber: 6.2, sodium: 6, sugar: 3.9 } }, // SR Legacy: Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt
  { id: 'paneer', name: 'Paneer', category: 'protein', servingSize: '3 oz', grams: 85, fdcId: 2053888, nutrition: { calories: 243, protein: 18.2, carbs: 3, fat: 15.2, fiber: 0, sodium: 91, sugar: 3 } }, // FDC Branded: DEEP, INDIAN GOURMET PANEER (Deep Foods Inc.)
  { id: 'chicken-curry', name: 'Chicken Curry', category: 'protein', servingSize: '1 cup', grams: 240, fdcId: 2706437, nutrition: { calories: 257, protein: 15.6, carbs: 15.7, fat: 15.6, fiber: 3.4, sodium: 902, sugar: 6.1 } }, // FNDDS: Chicken curry
  { id: 'oatmeal', name: 'Oatmeal', category: 'grain', servingSize: '1 cup cooked', grams: 234, fdcId: 173905, nutrition: { calories: 166, protein: 5.9, carbs: 28.1, fat: 3.6, fiber: 4, sodium: 9, sugar: 0.6 } }, // SR Legacy: Cereals, oats, regular and quick, unenriched, cooked with water (includes boiling and microwaving), without salt
  { id: 'wheat-toast', name: 'Whole-Wheat Toast', category: 'grain', servingSize: '1 slice', grams: 25, fdcId: 172689, nutrition: { calories: 76, protein: 4.1, carbs: 12.8, fat: 1, fiber: 1.9, sodium: 141, sugar: 1.4 } }, // SR Legacy: Bread, whole-wheat, commercially prepared, toasted
  { id: 'white-toast', name: 'White Toast', category: 'grain', servingSize: '1 slice', grams: 27, fdcId: 174925, nutrition: { calories: 78, protein: 2.4, carbs: 14.7, fat: 1.1, fiber: 0.8, sodium: 145, sugar: 1.7 } }, // SR Legacy: Bread, white, commercially prepared, toasted
  { id: 'bagel', name: 'Plain Bagel', category: 'grain', servingSize: '1 medium', grams: 105, fdcId: 174899, nutrition: { calories: 277, protein: 11.1, carbs: 55, fat: 1.4, fiber: 1.7, sodium: 443, sugar: 8.9 } }, // SR Legacy: Bagels, plain, enriched, with calcium propionate (includes onion, poppy, sesame)
  { id: 'brown-rice', name: 'Brown Rice', category: 'grain', servingSize: '1 cup cooked', grams: 202, fdcId: 169704, nutrition: { calories: 248, protein: 5.5, carbs: 51.7, fat: 2, fiber: 3.2, sodium: 8, sugar: 0.5 } }, // SR Legacy: Rice, brown, long-grain, cooked (Includes foods for USDA's Food Distribution Program)
  { id: 'white-rice', name: 'White Rice', category: 'grain', servingSize: '1 cup cooked', grams: 158, fdcId: 168878, nutrition: { calories: 205, protein: 4.3, carbs: 44.5, fat: 0.4, fiber: 0.6, sodium: 2, sugar: 0.1 } }, // SR Legacy: Rice, white, long-grain, regular, enriched, cooked
  { id: 'spaghetti', name: 'Spaghetti', category: 'grain', servingSize: '1 cup cooked', grams: 124, fdcId: 169737, nutrition: { calories: 196, protein: 7.2, carbs: 38.3, fat: 1.2, fiber: 2.2, sodium: 1, sugar: 0.7 } }, // SR Legacy: Pasta, cooked, enriched, without added salt
  { id: 'quinoa', name: 'Quinoa', category: 'grain', servingSize: '1 cup cooked', grams: 185, fdcId: 168917, nutrition: { calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, fiber: 5.2, sodium: 13, sugar: 1.6 } }, // SR Legacy: Quinoa, cooked
  { id: 'corn-tortillas', name: 'Corn Tortillas', category: 'grain', servingSize: '2 tortillas', grams: 48, fdcId: 175036, nutrition: { calories: 105, protein: 2.7, carbs: 21.4, fat: 1.4, fiber: 3, sodium: 22, sugar: 0.4 } }, // SR Legacy: Tortillas, ready-to-bake or -fry, corn
  { id: 'roti', name: 'Roti (chapati)', category: 'grain', servingSize: '2 medium', grams: 80, fdcId: 2707713, nutrition: { calories: 239, protein: 6.3, carbs: 36.9, fat: 7.4, fiber: 7.8, sodium: 238, sugar: 2.3 } }, // FNDDS: Bread, chappatti or roti
  { id: 'naan', name: 'Naan', category: 'grain', servingSize: '1 piece', grams: 90, fdcId: 171845, nutrition: { calories: 262, protein: 8.7, carbs: 45.4, fat: 5.1, fiber: 2, sodium: 418, sugar: 3.2 } }, // SR Legacy: Bread, naan, plain, commercially prepared, refrigerated
  { id: 'paratha', name: 'Paratha', category: 'grain', servingSize: '1 paratha', grams: 70, fdcId: 2707715, nutrition: { calories: 228, protein: 4.5, carbs: 31.7, fat: 9.2, fiber: 6.7, sodium: 316, sugar: 2.9 } }, // FNDDS: Bread, paratha
  { id: 'idli', name: 'Idli', category: 'grain', servingSize: '2 idli', grams: 76, fdcId: 2708346, nutrition: { calories: 97, protein: 4.8, carbs: 19, fat: 0.3, fiber: 4.4, sodium: 192, sugar: 1.4 } }, // FNDDS: Idli
  { id: 'dosa', name: 'Plain Dosa', category: 'grain', servingSize: '1 medium', grams: 80, fdcId: 2708347, nutrition: { calories: 168, protein: 4.6, carbs: 29.6, fat: 3.2, fiber: 1.4, sodium: 247, sugar: 0.2 } }, // FNDDS: Dosa, plain
  { id: 'upma', name: 'Upma', category: 'grain', servingSize: '1 cup', grams: 170, fdcId: 2709128, nutrition: { calories: 148, protein: 3.4, carbs: 23.5, fat: 4.5, fiber: 2.2, sodium: 167, sugar: 2.7 } }, // FNDDS: Upma
  { id: 'baked-potato', name: 'Baked Potato', category: 'vegetable', servingSize: '1 medium, with skin', grams: 173, fdcId: 170093, nutrition: { calories: 161, protein: 4.3, carbs: 36.6, fat: 0.2, fiber: 3.8, sodium: 17, sugar: 2 } }, // SR Legacy: Potatoes, baked, flesh and skin, without salt
  { id: 'mashed-potatoes', name: 'Mashed Potatoes', category: 'vegetable', servingSize: '1/2 cup', grams: 105, fdcId: 168555, nutrition: { calories: 119, protein: 2, carbs: 17.7, fat: 4.4, fiber: 1.6, sodium: 333, sugar: 1.5 } }, // SR Legacy: Potatoes, mashed, home-prepared, whole milk and butter added
  { id: 'sweet-potato', name: 'Baked Sweet Potato', category: 'vegetable', servingSize: '1 medium', grams: 114, fdcId: 168483, nutrition: { calories: 103, protein: 2.3, carbs: 23.6, fat: 0.2, fiber: 3.8, sodium: 41, sugar: 7.4 } }, // SR Legacy: Sweet potato, cooked, baked in skin, flesh, without salt
  { id: 'french-fries', name: 'French Fries', category: 'vegetable', servingSize: '1 medium order', grams: 117, fdcId: 170698, nutrition: { calories: 365, protein: 4, carbs: 48.5, fat: 17.2, fiber: 4.4, sodium: 246, sugar: 0.4 } }, // SR Legacy: Fast foods, potato, french fried in vegetable oil
  { id: 'broccoli', name: 'Steamed Broccoli', category: 'vegetable', servingSize: '1 cup', grams: 156, fdcId: 169967, nutrition: { calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.1, sodium: 64, sugar: 2.2 } }, // SR Legacy: Broccoli, cooked, boiled, drained, without salt
  { id: 'green-beans', name: 'Green Beans', category: 'vegetable', servingSize: '1 cup cooked', grams: 125, fdcId: 169141, nutrition: { calories: 44, protein: 2.4, carbs: 9.8, fat: 0.4, fiber: 4, sodium: 1, sugar: 4.5 } }, // SR Legacy: Beans, snap, green, cooked, boiled, drained, without salt
  { id: 'corn-cob', name: 'Corn on the Cob', category: 'vegetable', servingSize: '1 medium ear', grams: 103, fdcId: 169999, nutrition: { calories: 99, protein: 3.5, carbs: 21.6, fat: 1.5, fiber: 2.5, sodium: 1, sugar: 4.7 } }, // SR Legacy: Corn, sweet, yellow, cooked, boiled, drained, without salt
  { id: 'baby-carrots', name: 'Baby Carrots', category: 'vegetable', servingSize: 'about 8', grams: 85, fdcId: 168568, nutrition: { calories: 30, protein: 0.5, carbs: 7, fat: 0.1, fiber: 2.5, sodium: 66, sugar: 4 } }, // SR Legacy: Carrots, baby, raw
  { id: 'lettuce', name: 'Leafy Green Salad', category: 'vegetable', servingSize: '2 cups', grams: 72, fdcId: 169249, nutrition: { calories: 11, protein: 1, carbs: 2.1, fat: 0.1, fiber: 0.9, sodium: 20, sugar: 0.6 } }, // SR Legacy: Lettuce, green leaf, raw
  { id: 'cherry-tomatoes', name: 'Cherry Tomatoes', category: 'vegetable', servingSize: '1/2 cup', grams: 74.5, fdcId: 170457, nutrition: { calories: 13, protein: 0.7, carbs: 2.9, fat: 0.1, fiber: 0.9, sodium: 4, sugar: 2 } }, // SR Legacy: Tomatoes, red, ripe, raw, year round average
  { id: 'bell-pepper', name: 'Red Bell Pepper Strips', category: 'vegetable', servingSize: '1 cup', grams: 92, fdcId: 170108, nutrition: { calories: 24, protein: 0.9, carbs: 5.5, fat: 0.3, fiber: 1.9, sodium: 4, sugar: 3.9 } }, // SR Legacy: Peppers, sweet, red, raw
  { id: 'vegetable-curry', name: 'Vegetable Curry', category: 'vegetable', servingSize: '1 cup', grams: 240, fdcId: 2710067, nutrition: { calories: 206, protein: 3.8, carbs: 21.1, fat: 12.6, fiber: 4.3, sodium: 931, sugar: 7.6 } }, // FNDDS: Vegetable curry
  { id: 'okra', name: 'Okra (bhindi)', category: 'vegetable', servingSize: '1/2 cup cooked', grams: 80, fdcId: 169261, nutrition: { calories: 18, protein: 1.5, carbs: 3.6, fat: 0.2, fiber: 2, sodium: 5, sugar: 1.9 } }, // SR Legacy: Okra, cooked, boiled, drained, without salt
  { id: 'green-peas', name: 'Green Peas', category: 'vegetable', servingSize: '1/2 cup cooked', grams: 80, fdcId: 170420, nutrition: { calories: 67, protein: 4.3, carbs: 12.5, fat: 0.2, fiber: 4.4, sodium: 2, sugar: 4.7 } }, // SR Legacy: Peas, green, cooked, boiled, drained, without salt
  { id: 'cooked-spinach', name: 'Cooked Spinach', category: 'vegetable', servingSize: '1/2 cup', grams: 90, fdcId: 168463, nutrition: { calories: 21, protein: 2.7, carbs: 3.4, fat: 0.2, fiber: 2.2, sodium: 63, sugar: 0.4 } }, // SR Legacy: Spinach, cooked, boiled, drained, without salt
  { id: 'banana', name: 'Banana', category: 'fruit', servingSize: '1 medium', grams: 118, fdcId: 173944, nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sodium: 1, sugar: 14.4 } }, // SR Legacy: Bananas, raw
  { id: 'apple', name: 'Apple', category: 'fruit', servingSize: '1 medium', grams: 182, fdcId: 171688, nutrition: { calories: 95, protein: 0.5, carbs: 25.1, fat: 0.3, fiber: 4.4, sodium: 2, sugar: 18.9 } }, // SR Legacy: Apples, raw, with skin (Includes foods for USDA's Food Distribution Program)
  { id: 'orange', name: 'Orange', category: 'fruit', servingSize: '1 medium', grams: 140, fdcId: 169917, nutrition: { calories: 69, protein: 1.3, carbs: 17.6, fat: 0.2, fiber: 3.1, sodium: 1, sugar: 11.9 } }, // SR Legacy: Oranges, raw, navels (Includes foods for USDA's Food Distribution Program)
  { id: 'blueberries', name: 'Blueberries', category: 'fruit', servingSize: '1 cup', grams: 148, fdcId: 171711, nutrition: { calories: 84, protein: 1.1, carbs: 21.4, fat: 0.5, fiber: 3.6, sodium: 1, sugar: 14.7 } }, // SR Legacy: Blueberries, raw
  { id: 'strawberries', name: 'Strawberries', category: 'fruit', servingSize: '1 cup', grams: 144, fdcId: 167762, nutrition: { calories: 46, protein: 1, carbs: 11.1, fat: 0.4, fiber: 2.9, sodium: 1, sugar: 7 } }, // SR Legacy: Strawberries, raw
  { id: 'grapes', name: 'Grapes', category: 'fruit', servingSize: '1 cup', grams: 151, fdcId: 174683, nutrition: { calories: 104, protein: 1.1, carbs: 27.3, fat: 0.2, fiber: 1.4, sodium: 3, sugar: 23.4 } }, // SR Legacy: Grapes, red or green (European type, such as Thompson seedless), raw
  { id: 'orange-juice', name: 'Orange Juice', category: 'fruit', servingSize: '1 cup (8 fl oz)', grams: 249, fdcId: 169100, nutrition: { calories: 122, protein: 1.7, carbs: 28.7, fat: 0.3, fiber: 0.7, sodium: 5, sugar: 20.7 } }, // SR Legacy: Orange juice, chilled, includes from concentrate
  { id: 'mango', name: 'Mango', category: 'fruit', servingSize: '1 cup pieces', grams: 165, fdcId: 169910, nutrition: { calories: 99, protein: 1.4, carbs: 24.7, fat: 0.6, fiber: 2.6, sodium: 2, sugar: 22.5 } }, // SR Legacy: Mangos, raw
  { id: 'greek-yogurt', name: 'Plain Greek Yogurt', category: 'dairy', servingSize: '1 container (6 oz)', grams: 170, fdcId: 170894, nutrition: { calories: 100, protein: 17.3, carbs: 6.1, fat: 0.7, fiber: 0, sodium: 61, sugar: 5.5 } }, // SR Legacy: Yogurt, Greek, plain, nonfat (Includes foods for USDA's Food Distribution Program)
  { id: 'fruit-yogurt', name: 'Fruit Yogurt', category: 'dairy', servingSize: '1 container (6 oz)', grams: 170, fdcId: 170889, nutrition: { calories: 168, protein: 6.8, carbs: 31.7, fat: 2, fiber: 0, sodium: 90, sugar: 31.7 } }, // SR Legacy: Yogurt, fruit, low fat,9 g protein/8 oz
  { id: 'milk', name: 'Low-Fat Milk (1%)', category: 'dairy', servingSize: '1 cup (8 fl oz)', grams: 244, fdcId: 170872, nutrition: { calories: 102, protein: 8.2, carbs: 12.2, fat: 2.4, fiber: 0, sodium: 107, sugar: 12.7 } }, // SR Legacy: Milk, lowfat, fluid, 1% milkfat, with added vitamin A and vitamin D
  { id: 'cheddar', name: 'Cheddar Cheese', category: 'dairy', servingSize: '1 oz', grams: 28.35, fdcId: 173414, nutrition: { calories: 114, protein: 6.5, carbs: 1, fat: 9.4, fiber: 0, sodium: 185, sugar: 0.1 } }, // SR Legacy: Cheese, cheddar (Includes foods for USDA's Food Distribution Program)
  { id: 'string-cheese', name: 'String Cheese', category: 'dairy', servingSize: '1 stick (1 oz)', grams: 28.35, fdcId: 170847, nutrition: { calories: 72, protein: 6.9, carbs: 0.8, fat: 4.5, fiber: 0, sodium: 175, sugar: 0.3 } }, // SR Legacy: Cheese, mozzarella, part skim milk
  { id: 'cottage-cheese', name: 'Cottage Cheese', category: 'dairy', servingSize: '1/2 cup', grams: 113, fdcId: 173417, nutrition: { calories: 81, protein: 14, carbs: 3.1, fat: 1.2, fiber: 0, sodium: 459, sugar: 3.1 } }, // SR Legacy: Cheese, cottage, lowfat, 1% milkfat
  { id: 'dahi', name: 'Plain Yogurt (dahi)', category: 'dairy', servingSize: '1/2 cup', grams: 122.5, fdcId: 171284, nutrition: { calories: 75, protein: 4.3, carbs: 5.7, fat: 4, fiber: 0, sodium: 56, sugar: 5.7 } }, // SR Legacy: Yogurt, plain, whole milk
  { id: 'butter', name: 'Butter', category: 'topping', servingSize: '1 pat', grams: 5, fdcId: 173410, nutrition: { calories: 36, protein: 0, carbs: 0, fat: 4.1, fiber: 0, sodium: 32, sugar: 0 } }, // SR Legacy: Butter, salted
  { id: 'ghee', name: 'Ghee', category: 'topping', servingSize: '1 tsp', grams: 4.3, fdcId: 171314, nutrition: { calories: 39, protein: 0, carbs: 0, fat: 4.3, fiber: 0, sodium: 0, sugar: 0 } }, // SR Legacy: Butter, Clarified butter (ghee)
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'topping', servingSize: '2 tbsp', grams: 32, fdcId: 174266, nutrition: { calories: 191, protein: 7.1, carbs: 7.1, fat: 16.4, fiber: 1.6, sodium: 136, sugar: 3.4 } }, // SR Legacy: Peanut butter, smooth style, with salt (Includes foods for USDA's Food Distribution Program)
  { id: 'cream-cheese', name: 'Cream Cheese', category: 'topping', servingSize: '1 tbsp', grams: 14.5, fdcId: 173418, nutrition: { calories: 51, protein: 0.9, carbs: 0.8, fat: 5, fiber: 0, sodium: 46, sugar: 0.5 } }, // SR Legacy: Cheese, cream
  { id: 'avocado', name: 'Avocado', category: 'topping', servingSize: '1/4 avocado', grams: 50, fdcId: 171705, nutrition: { calories: 80, protein: 1, carbs: 4.3, fat: 7.3, fiber: 3.4, sodium: 4, sugar: 0.3 } }, // SR Legacy: Avocados, raw, all commercial varieties
  { id: 'almonds', name: 'Almonds', category: 'topping', servingSize: '1 oz (23 nuts)', grams: 28.35, fdcId: 170567, nutrition: { calories: 164, protein: 6, carbs: 6.1, fat: 14.2, fiber: 3.5, sodium: 0, sugar: 1.2 } }, // SR Legacy: Nuts, almonds
  { id: 'ranch', name: 'Ranch Dressing', category: 'topping', servingSize: '2 tbsp', grams: 30, fdcId: 173592, nutrition: { calories: 129, protein: 0.4, carbs: 1.8, fat: 13.4, fiber: 0, sodium: 270, sugar: 1.4 } }, // SR Legacy: Salad dressing, ranch dressing, regular
  { id: 'italian-dressing', name: 'Italian Dressing', category: 'topping', servingSize: '2 tbsp', grams: 29.4, fdcId: 171019, nutrition: { calories: 71, protein: 0.1, carbs: 3.6, fat: 6.2, fiber: 0, sodium: 292, sugar: 3.2 } }, // SR Legacy: Salad dressing, italian dressing, commercial, regular
  { id: 'salsa', name: 'Salsa', category: 'topping', servingSize: '2 tbsp', grams: 36, fdcId: 174524, nutrition: { calories: 10, protein: 0.5, carbs: 2.4, fat: 0.1, fiber: 0.7, sodium: 256, sugar: 1.4 } }, // SR Legacy: Sauce, salsa, ready-to-serve
  { id: 'jam', name: 'Jam', category: 'topping', servingSize: '1 tbsp', grams: 20, fdcId: 169641, nutrition: { calories: 56, protein: 0.1, carbs: 13.8, fat: 0, fiber: 0.2, sodium: 6, sugar: 9.7 } }, // SR Legacy: Jams and preserves
  { id: 'potato-chips', name: 'Potato Chips', category: 'treat', servingSize: '1 oz bag', grams: 28.35, fdcId: 169677, nutrition: { calories: 151, protein: 1.8, carbs: 15.3, fat: 9.6, fiber: 0.9, sodium: 149, sugar: 0.1 } }, // SR Legacy: Snacks, potato chips, plain, salted
  { id: 'cookies', name: 'Chocolate Chip Cookies', category: 'treat', servingSize: '2 cookies', grams: 24.4, fdcId: 172716, nutrition: { calories: 120, protein: 1.2, carbs: 15.9, fat: 6, fiber: 0.5, sodium: 76, sugar: 8 } }, // SR Legacy: Cookies, chocolate chip, commercially prepared, regular, higher fat, enriched
  { id: 'granola-bar', name: 'Granola Bar', category: 'treat', servingSize: '1 bar', grams: 28, fdcId: 167542, nutrition: { calories: 132, protein: 2.8, carbs: 18, fat: 5.5, fiber: 1.5, sodium: 82, sugar: 8 } }, // SR Legacy: Snacks, granola bars, hard, plain
  { id: 'cola', name: 'Cola', category: 'treat', servingSize: '1 can (12 fl oz)', grams: 370, fdcId: 174852, nutrition: { calories: 155, protein: 0, carbs: 38.3, fat: 0.9, fiber: 0, sodium: 11, sugar: 36.8 } }, // SR Legacy: Beverages, carbonated, cola, regular
  { id: 'chai', name: 'Chai', category: 'treat', servingSize: '1 cup, milk & sugar', grams: 240, fdcId: 2710506, nutrition: { calories: 122, protein: 3.8, carbs: 21.5, fat: 2.5, fiber: 0.2, sodium: 48, sugar: 20.9 } }, // FNDDS: Tea, hot, with milk
  { id: 'samosa', name: 'Samosa', category: 'treat', servingSize: '1 samosa', grams: 100, fdcId: 2708730, nutrition: { calories: 310, protein: 5.1, carbs: 33.2, fat: 17.5, fiber: 1.8, sodium: 388, sugar: 1.3 } }, // FNDDS: Samosa
  { id: 'pakora', name: 'Pakora', category: 'treat', servingSize: '4 pakoras', grams: 48, fdcId: 2710066, nutrition: { calories: 60, protein: 2.4, carbs: 7.8, fat: 2.3, fiber: 1.5, sodium: 182, sugar: 1.4 } }, // FNDDS: Pakora
];

// Level 1 tray chips. `topping` and `treat` reuse the Fats and Snacks
// placeholder art (art.js).
export const LEVEL_1_CATEGORIES = [
  { id: 'protein', label: 'Protein' },
  { id: 'grain', label: 'Grains' },
  { id: 'vegetable', label: 'Vegetables' },
  { id: 'fruit', label: 'Fruit' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'topping', label: 'Toppings & spreads' },
  { id: 'treat', label: 'Treats & drinks' },
];

// ---- Level 1: Foundational Nutrition -----------------------------------
// Verbatim from the scenario document (2026-11-09). `character`, `goal`,
// `tip` and `takeaway` are the doc's Character / Goal / Helpful Tip /
// Educational Takeaway. Targets: calories against the plate's displayed
// calorie total; carbsPct/proteinPct/fatPct as a % of the macro-derived
// calories (4/4/9 kcal per g), per the doc's gameplay notes; sodium is
// "less than" (strict). Sugar and fiber are deliberately not scored.
// `art` is a placeholder tile choice for the intro card, not from the doc.
export const LEVEL_1_CHALLENGES = [
  {
    id: 'office-lunch',
    name: 'Office Worker Lunch Rush',
    character: '30-year-old office worker',
    goal: 'Build a balanced lunch that provides enough energy for the afternoon while keeping calories and sodium within the targets.',
    tip: 'Combining carbohydrate-rich foods with protein and healthy fats can help create a satisfying meal. Whole grains, vegetables, and fruits can all contribute carbohydrates, along with other important nutrients.',
    takeaway: 'A balanced meal can include all three major macronutrients. Carbohydrates provide energy, protein supports tissue maintenance and repair, and fats support essential bodily functions.',
    targets: {
      calories: { min: 450, max: 700 },
      carbsPct: { min: 45, max: 55 },
      proteinPct: { min: 15, max: 25 },
      fatPct: { min: 20, max: 35 },
      sodium: { lessThan: 800 },
    },
    art: 'grain',
  },
  {
    id: 'energizing-breakfast',
    name: 'Energizing Breakfast',
    character: '25-year-old college student preparing for a busy morning',
    goal: 'Build a nutritious breakfast that provides energy and a balance of carbohydrates, protein, and fats.',
    tip: 'Breakfast foods such as oatmeal, whole-grain toast, eggs, yogurt, nuts, and fruit provide different combinations of macronutrients. Choosing a variety of foods can help create a more balanced meal.',
    takeaway: 'A nutritious breakfast does not have to consist of any particular type of food. Different combinations of ingredients can provide energy and important nutrients to support daily activities.',
    targets: {
      calories: { min: 400, max: 600 },
      carbsPct: { min: 45, max: 60 },
      proteinPct: { min: 15, max: 25 },
      fatPct: { min: 20, max: 35 },
      sodium: { lessThan: 700 },
    },
    art: 'fruit',
  },
  {
    id: 'balanced-dinner',
    name: 'Balanced Dinner After a Busy Day',
    character: '40-year-old adult preparing dinner after work',
    goal: 'Build a satisfying evening meal that includes a balanced distribution of macronutrients while keeping sodium within the target.',
    tip: 'Foods such as rice, potatoes, lentils, beans, vegetables, fish, and lean meats can be combined in many ways to create a balanced dinner. Carbohydrates are not limited to grains—fruits, vegetables, beans, and dairy products can also contribute carbohydrates.',
    takeaway: 'Balanced meals can be created using many different foods and cuisines. The overall combination of nutrients matters more than following one specific meal or recipe.',
    targets: {
      calories: { min: 550, max: 750 },
      carbsPct: { min: 45, max: 55 },
      proteinPct: { min: 20, max: 30 },
      fatPct: { min: 20, max: 35 },
      sodium: { lessThan: 900 },
    },
    art: 'protein',
  },
];

// Level 1's 5 targets. `unit: '%'` values are shares of calories; `grams`
// names the gram total shown beside the percentage.
export const LEVEL_1_NUTRIENTS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'carbsPct', label: 'Carbohydrates', unit: '%', grams: 'carbs' },
  { key: 'proteinPct', label: 'Protein', unit: '%', grams: 'protein' },
  { key: 'fatPct', label: 'Fat', unit: '%', grams: 'fat' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
];

// The doc's "General Disclaimer (Display Before Gameplay)", verbatim.
export const GAME_DISCLAIMER =
  'The nutritional goals in this game are designed for educational purposes and do not represent personalized dietary recommendations. Individual calorie and nutrient needs vary depending on factors such as age, activity level, and overall health. A meal that does not meet these specific game targets can still be part of a healthy diet. Consult a healthcare professional or registered dietitian for personalized nutrition guidance.';

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

// Play order: Level 1, then Level 2. Each level has its own foods: ids
// can repeat across levels with different values, so always look a food
// up in its level's list. `name` for Level 1 is the doc's level
// title; Level 2's "Health Conditions" is our label for the Make's set.
export const LEVELS = [
  { id: 'level-1', number: 1, name: 'Foundational Nutrition', challenges: LEVEL_1_CHALLENGES, nutrients: LEVEL_1_NUTRIENTS, foods: LEVEL_1_FOODS, categories: LEVEL_1_CATEGORIES },
  { id: 'level-2', number: 2, name: 'Health Conditions', challenges: CHALLENGES, nutrients: NUTRIENTS, foods: FOODS, categories: CATEGORIES },
];

// Every challenge in play order, each tagged with its level. The lab page
// indexes into this flat list.
export const ALL_CHALLENGES = LEVELS.flatMap((level) =>
  level.challenges.map((challenge, i) => ({ ...challenge, level, levelIndex: i })),
);

// FDA Daily Values used by Game/Plate Nutrition Label (from the Figma
// annotation "The plate's Nutrition Facts"). Total sugars has no DV.
export const DAILY_VALUES = { fat: 78, sodium: 2300, carbs: 275, fiber: 28, protein: 50 };

// Score messages, verbatim from the Make's AppraisalModal.getScoreMessage.
// Level 2 only: the first one says "for this condition". Level 1 shows the
// scenario's Educational Takeaway instead.
export function scoreMessage(metCount, total = NUTRIENTS.length) {
  const score = Math.round((metCount / total) * 100);
  if (score >= 90) return "Excellent! You've created a perfect plate for this condition.";
  if (score >= 70) return 'Great job! Your plate meets most of the nutritional requirements.';
  if (score >= 50) return "Good effort! You're on the right track, but there's room for improvement.";
  return 'Keep practicing! Review the targets and try adjusting your food choices.';
}

// ---- Pure helpers -------------------------------------------------------

const EMPTY = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, sugar: 0 };

export function foodById(id, foods) {
  return foods.find((f) => f.id === id);
}

// Energy per gram, from the Level 1 doc's gameplay notes.
export const KCAL_PER_GRAM = { carbs: 4, protein: 4, fat: 9 };

// `plate` is { [foodId]: servings }; `foods` is the level's food list. Besides the summed nutrients, returns
// carbsPct/proteinPct/fatPct: each macro's share of the macro-derived
// calories (not the displayed calorie total, which can differ slightly
// because of rounding, fiber and label conventions). 0 on an empty plate.
export function plateTotals(plate, foods) {
  const t = Object.entries(plate).reduce((acc, [id, qty]) => {
    const n = foodById(id, foods).nutrition;
    const out = { ...acc };
    for (const k of Object.keys(EMPTY)) out[k] += n[k] * qty;
    return out;
  }, { ...EMPTY });
  const macroKcal = t.carbs * KCAL_PER_GRAM.carbs + t.protein * KCAL_PER_GRAM.protein + t.fat * KCAL_PER_GRAM.fat;
  const pct = (k) => (macroKcal ? (t[k] * KCAL_PER_GRAM[k] * 100) / macroKcal : 0);
  return { ...t, carbsPct: pct('carbs'), proteinPct: pct('protein'), fatPct: pct('fat') };
}

export function servingCount(plate) {
  return Object.values(plate).reduce((a, b) => a + b, 0);
}

// 'met' | 'low' | 'high'. Same rules as the Make's MacroIndicator: a range
// target is met inside [min, max]; fiber only has a min; sodium/sugar only
// a max. Level 1's sodium is `lessThan` (strict: exactly 800 mg misses).
// A percentage is judged on its rounded value, the number the player sees,
// so "45%" never reads as "too low".
export function targetStatus(value, { min, max, lessThan }, unit) {
  const v = unit === '%' ? Math.round(value) : value;
  if (min !== undefined && v < min) return 'low';
  if (max !== undefined && v > max) return 'high';
  if (lessThan !== undefined && v >= lessThan) return 'high';
  return 'met';
}

// Bar fill, 0-100: value against max (or against min when there's no max),
// as in the Make's MacroIndicator. Matches the Figma D3 levels (368 kcal
// against a 600 max ≈ 60%).
export function targetFill(value, { min, max, lessThan }) {
  const ref = max ?? lessThan ?? min;
  return Math.max(0, Math.min(100, (value / ref) * 100));
}

export function formatAmount(value, unit) {
  if (unit === '%') return `${Math.round(value)}%`;
  return unit ? `${Math.round(value)} ${unit}` : `${Math.round(value)}`;
}

// "400–600", "15–25 g", "10 g+", "800 mg or less" (Figma D3 wording);
// Level 1 adds "45–55% of calories" and "less than 800 mg" (doc wording).
export function formatTarget({ min, max, lessThan }, unit) {
  if (lessThan !== undefined) return `less than ${lessThan} ${unit}`;
  if (unit === '%') return `${min}–${max}% of calories`;
  const u = unit ? ` ${unit}` : '';
  if (min !== undefined && max !== undefined) return `${min}–${max}${u}`;
  if (min !== undefined) return `${min}${u}+`;
  return `${max}${u} or less`;
}

// Display-only: the data writes "1/2 cup cooked"; the Figma tiles show "½".
export function prettyServing(s) {
  return s.replace(/\b1\/2\b/g, '½').replace(/\b1\/4\b/g, '¼');
}
