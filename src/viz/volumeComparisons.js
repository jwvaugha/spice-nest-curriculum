// Data for Module 5 Chapter 1's "Physical Changes in Ingredients: Cooked vs.
// Uncooked Volume" figures. Ratios are verbatim from the source doc
// (CTS M5C1 - Measuring and portion size techniques). Everything visual is
// derived from these objects by scripts/volume-viz/ -- add a 5th comparison
// by adding an entry here and re-running `npm run viz:volume`.
//
// ALL DIMENSIONS ARE REAL, IN MILLIMETRES, so the figures feel like the
// kitchen: real glass measuring jugs, real-size pieces. Every figure is drawn
// at the same px-per-mm, so the 2-cup jug really is smaller than the 4-cup.
//
// mechanism:
//   'pour'    -- free-flowing pieces (rice, pasta): rigid-body physics pours
//                real-size dry pieces into the jug; the piece COUNT is whatever
//                it takes to fill before.amount cups (levelled). Cooked = the
//                SAME pieces, re-poured, each swollen until the pile fills
//                after.amount cups. The per-piece swell is reported.
//   'compact' -- leafy greens: same leaves, same size; air gaps collapse.
//                Procedural (not physics) -- placement is plausible, the fill
//                levels are exact.
//   'shrink'  -- meat: one solid cut loses water/fat; an extruded slab whose
//                volume is exactly after/before of the raw one.

export const CUP_MM3 = 236588; // 1 US cup in mm^3

// Glass liquid measuring jugs (Pyrex-style), inner dimensions.
//   radius:  inner radius, mm
//   cups:    highest graduation
//   heightCups: wall height, in cups of fill (a little headroom above `cups`)
export const JUGS = {
  fourCup: { radius: 58, cups: 4, heightCups: 4.35 },
  twoCup: { radius: 43.5, cups: 2, heightCups: 2.3 },
};
export const cupHeight = (jug) => CUP_MM3 / (Math.PI * jug.radius ** 2);

export const VOLUME_COMPARISONS = [
  {
    id: 'rice',
    title: 'Rice',
    mechanism: 'pour',
    piece: 'grain', // capsule
    // Uncooked long-grain rice: ~7 mm long, ~2 mm wide.
    dry: { length: 7, diameter: 2 },
    seed: 11,
    jug: 'fourCup',
    before: { amount: 1, label: '1 cup', sublabel: 'dry rice' },
    after: { amount: 3, label: '3 cups', sublabel: 'cooked rice' },
  },
  {
    id: 'pasta',
    title: 'Pasta',
    mechanism: 'pour',
    piece: 'tube', // hollow-ended cylinder (penne/ziti)
    // Dry penne: ~40 mm long, ~9 mm across.
    dry: { length: 40, diameter: 9 },
    seed: 23,
    jug: 'fourCup',
    before: { amount: 1, label: '1 cup', sublabel: 'dry pasta' },
    after: { amount: 2, label: '2 cups', sublabel: 'cooked pasta' },
  },
  {
    id: 'meat',
    title: 'Meat',
    mechanism: 'shrink',
    piece: 'slab',
    // Raw lean meat ~1.05 g/cm^3 -> 4 oz (113 g) ~ 108 cm^3. Shape: a cut
    // ~11 x 7.5 cm footprint, its thickness solved to hit that volume. Shown
    // on a 17 cm side plate.
    rawGrams: 113.4,
    density: 1.05,
    footprint: { length: 110, width: 75 },
    plateDiameter: 170,
    seed: 5,
    before: { amount: 4, label: '4 oz', sublabel: 'raw lean meat' },
    after: { amount: 3, label: '3 oz', sublabel: 'cooked meat' },
  },
  {
    id: 'greens',
    title: 'Leafy greens',
    mechanism: 'compact',
    piece: 'leaf',
    // Baby spinach: ~50 mm leaf blades; 1 cup raw ~ 30 g ~ 28 leaves.
    leafLength: 50,
    count: 28,
    seed: 3,
    jug: 'twoCup',
    before: { amount: 1, label: '1 cup', sublabel: 'raw leafy greens' },
    after: { amount: 0.5, label: '½ cup', sublabel: 'cooked greens' },
  },
];
