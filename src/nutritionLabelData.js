// Backing data for the interactive nutrition-facts-label tool on Module 1,
// Chapter 3 (`NutritionLabelExplorer.jsx` / `NutritionLabelCard.jsx`).
//
// Originally adapted from a Figma Make prototype ("Sticky Nutrition Label")
// the user pointed Claude at directly; this pass (2026-09-30) interpolates
// updated copy from a real Figma frame (node 1355:12664, "Nutrient Info
// Stack") the user pointed at separately -- richer subtitles/details, and a
// real per-nutrient `dailyValueBasis` (e.g. "Based on 78 g of total fat for
// a 2,000-calorie diet") replacing the old one-size-fits-all "Based on a
// 2,000 calorie diet" line every nutrient repeated verbatim.
//
// Three genuine copy-paste errors were caught IN THE FIGMA SOURCE ITSELF
// while pulling this over, and deliberately NOT propagated here (per the
// standing "never fabricate/propagate incorrect medical content" rule):
//   - Calcium's and Vitamin D's own long "details" paragraphs both actually
//     contained Protein's paragraph verbatim in the source frame -- this
//     file keeps the previous (correct, calcium/vitamin-D-specific)
//     wording for those two instead.
//   - Vitamin D's "Osteoporosis / Bone Health" tip also contained Protein's
//     blood-glucose content, not real vitamin-D content -- dropped rather
//     than guessed at.
//   - Saturated Fat's and Potassium's own top-line quantity both displayed
//     the WRONG number in the source (Saturated Fat showed "12g" instead of
//     "5g"; Potassium showed "1mg" instead of "240mg") while their own
//     detail paragraphs correctly stated the right figures -- the correct
//     numbers are used here, matching each item's own paragraph.
export const NUTRITION_ITEMS = [
  {
    id: 'servings',
    name: 'Servings',
    amount: '8 per container',
    description: 'Package Contents',
    details:
      "The number of servings per container tells you how many portions are in the entire package. This package contains 8 servings total. Understanding serving counts helps you calculate total nutrients if you eat multiple servings or the entire package. It's important for portion control and budgeting your daily nutrient intake.",
  },
  {
    id: 'serving-size',
    name: 'Serving Size',
    amount: '2/3 cup (55g)',
    description: 'Standard Portion',
    details:
      'Serving size is a standardized reference based on typical consumption, not a recommendation of how much to eat. All nutrient amounts listed are based on this specific portion size of 2/3 cup or 55 grams. If you eat more or less than this amount, remember to adjust the calorie and nutrient totals accordingly.',
  },
  {
    id: 'calories',
    name: 'Calories',
    amount: '250',
    description: 'Energy from Food',
    details:
      "Calories provide energy for your body's basic functions and activities. This serving contains 250 calories, which represents about 12.5% of a 2,000-calorie daily diet. While 2,000 calories a day is used for general nutrition advice, your individual needs may vary based on your age, sex, weight, and activity level. Remember, the number of servings you consume determines the actual calories you eat; understanding this helps you manage your energy intake and maintain a healthy weight.",
  },
  {
    id: 'total-fat',
    name: 'Total Fat',
    amount: '12g',
    dailyValue: '15%',
    dailyValueBasis: 'Based on 78 g of total fat for a 2,000-calorie diet.',
    description: 'Dietary Fats',
    details:
      'Fat is found in foods from both plants and animals. Total fat includes saturated, unsaturated, and trans fats. Fats are necessary for energy, nutrient absorption, and cell structure. Each gram of fat provides 9 calories. This serving provides 12 grams of total fat, which is 15% of the Daily Value. Choose foods with healthy unsaturated fats while limiting saturated and trans fats.',
  },
  {
    id: 'saturated-fat',
    name: 'Saturated Fat',
    amount: '5g',
    dailyValue: '25%',
    dailyValueBasis: 'Based on 20 g of saturated fat for a 2,000-calorie diet.',
    description: 'Fats to Limit',
    details:
      'Saturated fats are found in animal products (like meat and dairy) and tropical plant oils. The Dietary Guidelines for Americans recommend limiting saturated fat to less than 10% of daily calories (about 20 g per day). This serving contains 5 g of saturated fat, which is 25% of the daily recommended limit.',
  },
  {
    id: 'trans-fat',
    name: 'Trans Fat',
    amount: '0g',
    description: 'Avoid Completely',
    details:
      'Trans fat is a type of unsaturated fat. While small amounts occur naturally in some animal foods, artificial trans fats (partially hydrogenated oils) are harmful and not essential. Diets high in trans fat increase LDL ("bad") cholesterol and lower HDL ("good") cholesterol, increasing the risk of heart disease.',
  },
  {
    id: 'cholesterol',
    name: 'Cholesterol',
    amount: '30mg',
    dailyValue: '10%',
    dailyValueBasis: 'Based on 300 mg for a 2,000-calorie diet.',
    description: 'Structural Support',
    details:
      'Cholesterol is a waxy substance your body needs to build cells and make hormones. Your body produces all the cholesterol it needs, so dietary cholesterol should be limited. This food contains 30mg of cholesterol, representing 10% of the recommended daily limit of 300mg.',
  },
  {
    id: 'sodium',
    name: 'Sodium',
    amount: '470mg',
    dailyValue: '20%',
    dailyValueBasis: 'Based on 2300 mg for a 2,000-calorie diet.',
    description: 'Essential Electrolyte',
    details:
      'Sodium is an essential electrolyte that helps regulate fluid balance and nervous system function. However, most people consume too much sodium, which can lead to high blood pressure. This serving contains 470 mg of sodium, which is 20% of the recommended daily limit.',
  },
  {
    id: 'total-carbs',
    name: 'Total Carbohydrate',
    amount: '31g',
    dailyValue: '11%',
    dailyValueBasis: 'Based on 275 g for a 2,000-calorie diet.',
    description: "The Body's Primary Fuel",
    details:
      "Total carbohydrates include dietary fiber, sugars, and starches. They are your body's main energy source, breaking down into glucose to power your brain and muscles. Each gram of carbohydrate provides 4 calories. This serving provides 31 g of carbohydrates, representing 11% of the daily recommended intake. Choose complex carbohydrates (rich in fiber) over simple sugars for sustained energy.",
  },
  {
    id: 'dietary-fiber',
    name: 'Dietary Fiber',
    amount: '0g',
    dailyValue: '0%',
    dailyValueBasis: 'Based on 28 g for a 2,000-calorie diet.',
    description: 'Digestive Health',
    details:
      'There are two types of dietary fiber: soluble and insoluble. Soluble dietary fiber lowers cholesterol levels and controls blood sugar levels, while insoluble fiber adds bulk to speed up digestion. Additionally, it acts as a prebiotic -- food for beneficial gut bacteria -- helping to maintain a healthy gut microbiome and regular bowel movements. This food contains 0 g of fiber, representing 0% of the daily recommended intake.',
  },
  {
    id: 'total-sugars',
    name: 'Total Sugars',
    amount: '5g',
    description: 'Limit Added Sugars',
    details:
      'Total sugars include both naturally occurring sugars (like those in fruits and milk) and added sugars. While natural sugars provide nutrients, it is crucial to limit added sugars. The American Heart Association recommends limiting added sugars to no more than 6 teaspoons (25 g) per day for women and 9 teaspoons (36 g) per day for men. This food contains 5 g of total sugars.',
  },
  {
    id: 'protein',
    name: 'Protein',
    amount: '5g',
    description: 'Building Blocks',
    details:
      'Protein provides the building blocks (amino acids) for muscles, bones, skin, blood, and other body tissues. This serving contains 5 g of protein. Adults need about 0.8 g of protein per kilogram of body weight per day.',
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    amount: '2mcg',
    dailyValue: '10%',
    dailyValueBasis: 'Based on 20 mcg for a 2,000-calorie diet.',
    description: 'Sunshine Vitamin',
    details:
      "Vitamin D helps your body absorb calcium and supports bone health and immune function. Often called the \"sunshine vitamin\" because your skin produces it when exposed to sunlight. This food provides 2mcg of Vitamin D, which is 10% of the daily recommended intake.",
  },
  {
    id: 'calcium',
    name: 'Calcium',
    amount: '260mg',
    dailyValue: '20%',
    dailyValueBasis: 'Based on 1300 mg for a 2,000-calorie diet.',
    description: 'Strong Bones',
    details:
      'Calcium is essential for building and maintaining strong bones and teeth. It also plays a role in muscle function, nerve transmission, and blood clotting. This serving provides 260mg of calcium, representing 20% of the daily recommended intake. Dairy products, leafy greens, and fortified foods are good sources.',
  },
  {
    id: 'iron',
    name: 'Iron',
    amount: '1mg',
    dailyValue: '6%',
    dailyValueBasis: 'Based on 18 mg for a 2,000-calorie diet.',
    description: 'Oxygen Transport',
    details:
      'Iron is essential for carrying oxygen in your blood and supporting energy metabolism. Iron deficiency can lead to fatigue and anemia. This food contains 1 mg of iron, providing 6% of the daily recommended intake. Vitamin C can help improve iron absorption from plant-based sources.',
  },
  {
    id: 'potassium',
    name: 'Potassium',
    amount: '240mg',
    dailyValue: '5%',
    dailyValueBasis: 'Based on 4700 mg for a 2,000-calorie diet.',
    description: 'Heart Health',
    details:
      'Potassium helps regulate blood pressure, supports proper muscle and nerve function, and may reduce the risk of stroke and kidney stones. This serving contains 240 mg of potassium, which is 5% of the recommended daily intake.',
  },
];

export const HEALTH_CONDITIONS = [
  { value: 'default', label: 'Default' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'heart-disease', label: 'Heart Disease' },
  { value: 'chronic-kidney-disease', label: 'Chronic Kidney Disease' },
];

// Condition-specific guidance, shown as a TipExample callout under a
// nutrient's description whenever a non-default health condition is
// selected. Headings are the SPECIFIC topic labels from the Figma source
// (e.g. "Blood Pressure Control", not a generic "Diabetes Note") -- more
// informative than this file's original generic labels, and still gated by
// the SAME 3-condition selector (Diabetes / Heart Disease / Chronic Kidney
// Disease) rather than expanding the dropdown itself. A few tips present in
// the Figma source (e.g. Calcium's "Osteoporosis / Bone Health", every
// nutrient's own "Weight Management" tip) don't correspond to any of these
// 3 conditions and are intentionally left out rather than force-mapped to
// the wrong bucket or used as an excuse to grow the selector's scope.
const CONDITION_NOTES = {
  sodium: [
    {
      condition: 'diabetes',
      title: 'Blood Pressure Control',
      content:
        'People with diabetes have higher risk for hypertension. Limit sodium to 1,500-2,300mg per day to help manage blood pressure and reduce cardiovascular risk.',
    },
  ],
  'total-carbs': [
    {
      condition: 'diabetes',
      title: 'Blood Sugar Management',
      content:
        'Carbohydrates have the most significant impact on blood sugar levels. Consider counting carbs and spreading intake throughout the day. Since one "carb choice" is generally defined as 15 g of carbohydrates, this serving of 31g counts as approximately 2 carb choices for your meal planning.',
    },
  ],
  'dietary-fiber': [
    {
      condition: 'diabetes',
      title: 'Blood Sugar Control',
      content: 'Fiber helps slow the absorption of sugars and can improve blood glucose control. Aim for at least 25-30g of fiber per day from whole grains, vegetables, and legumes.',
    },
    {
      condition: 'heart-disease',
      title: 'Heart Disease / High Cholesterol',
      content:
        'Soluble fiber binds to cholesterol in your digestive system and removes it from your body before it can enter your bloodstream, helping to lower LDL ("bad") cholesterol.',
    },
  ],
  'total-sugars': [
    {
      condition: 'diabetes',
      title: 'Blood Sugar Management',
      content:
        'The body breaks down both natural and added sugars into glucose, so all sugars affect your blood sugar levels. However, added sugars cause sharper spikes in blood glucose compared to natural sugars found in fiber-rich foods.',
    },
    {
      condition: 'heart-disease',
      title: 'Heart Disease / High Cholesterol',
      content: 'Excess intake of added sugars can raise triglycerides (blood fats) and damage blood vessels, both of which are major risk factors for heart disease.',
    },
  ],
  protein: [
    {
      condition: 'diabetes',
      title: 'Blood Sugar Management',
      content:
        'Protein has a minimal effect on blood glucose levels. Pairing protein with carbohydrate-rich foods can help slow down sugar absorption and prevent sharp spikes in blood sugar.',
    },
    {
      condition: 'chronic-kidney-disease',
      title: 'Kidney Disease (CKD)',
      content:
        "Damaged kidneys may struggle to filter the waste products from protein digestion. If you have kidney disease, follow your doctor's specific protein limits to avoid adding stress to your kidneys.",
    },
  ],
  'vitamin-d': [
    {
      condition: 'chronic-kidney-disease',
      title: 'Kidney Disease (CKD)',
      content:
        'Healthy kidneys turn vitamin D into its active form to keep bones healthy. In kidney disease, this activation slows down, leading to weak bones. Adequate intake (or supplementation as prescribed) is vital to protect your skeletal system.',
    },
  ],
  calcium: [
    {
      condition: 'heart-disease',
      title: 'High Blood Pressure',
      content:
        'Calcium is a key mineral in the DASH diet (Dietary Approaches to Stop Hypertension). It helps blood vessels tighten and relax properly, which is essential for maintaining healthy blood pressure levels.',
    },
    {
      condition: 'chronic-kidney-disease',
      title: 'Kidney Disease (CKD)',
      content:
        "While calcium is needed for bones, damaged kidneys may not regulate blood calcium levels well. High calcium levels (especially when phosphorus is also high) can lead to calcification in blood vessels. Monitor your intake based on your lab results and doctor's advice.",
    },
  ],
  iron: [
    {
      condition: 'chronic-kidney-disease',
      title: 'Kidney Disease (CKD)',
      content:
        'Anemia is a common complication of CKD because damaged kidneys produce less of the hormone needed to make red blood cells. Adequate dietary iron is crucial to support red blood cell production, though your doctor may also prescribe specific supplements.',
    },
  ],
  potassium: [
    {
      condition: 'heart-disease',
      title: 'High Blood Pressure',
      content: 'Potassium works to counter the harmful effects of sodium. It helps relax blood vessel walls and excretes excess sodium through urine, directly lowering blood pressure.',
    },
    {
      condition: 'chronic-kidney-disease',
      title: 'Kidney Disease (CKD)',
      content: 'Damaged kidneys often cannot filter excess potassium from the blood. Since high levels can be dangerous for your heart, you may need to restrict your intake based on medical advice.',
    },
  ],
};

export function getConditionNotes(nutrientId, condition) {
  if (condition === 'default') return [];
  const notes = CONDITION_NOTES[nutrientId] || [];
  return notes.filter((note) => note.condition === condition);
}
