// Data for Module 5 Chapter 1's "Hand-Approach" figures: each hand estimate
// beside the measuring tool it stands in for, both at real size and drawn at
// the same px-per-mm as the volume figures (volumeComparisons.js).
//
// Pipeline: scripts/hand-viz/pose.mjs poses a rigged 3D hand in Blender
// (scripts/hand-viz/assets/right.glb, the MIT-licensed WebXR generic right
// hand, real size: 177 mm wrist-to-middle-fingertip) and exports the posed
// meshes; scripts/hand-viz/render.mjs traces them into SVGs. The SAME hand,
// in the SAME place and orientation (seen face-on, palm toward the viewer,
// fingers up -- the convention of printed hand-portion guides), is used for
// every figure, so only the pose and the highlighted part change.
//
// pose angles are degrees:
//   fingers.all / fingers.<name>: [knuckle, middle joint, end joint] flexion
//   spread: per finger [index, middle, ring, pinky], + closes toward the middle finger
//   thumb: abduct (in the palm plane, + toward the index finger), cmc (lift
//          off the palm plane), twist (about its own axis), mcp, ip (flexion)
// holds: optional food drawn in the hand (placed on the palm's real hollow)
// highlight: which part of the hand is the "measure"
//   'all' | 'palm' (wrist crease to the base of the fingers, thumb excluded) | 'thumb' (the two thumb bones)
// alt: the figure's accessible description (no text is drawn in the SVG itself;
//      the list item's title names both halves)
// tool: the precise equivalent, real size
//   cup   -- dry measuring cup, inner radius + depth solved for `volumeMl`, filled level
//   spoon -- round measuring spoon, bowl a spherical cap solved for `volumeMl`, filled level
//   meat  -- the same cooked 3 oz cut drawn in the volume figures

export const HAND_COMPARISONS = [
  {
    id: 'fist',
    pose: { fingers: { all: [100, 110, 65] }, spread: [4, 1, -3, -8], thumb: { abduct: 120, cmc: 40, mcp: -30, ip: -40 } },
    highlight: 'all',
    tool: { kind: 'cup', volumeMl: 236.6, radius: 41.5, food: 'starch' },
    alt: 'A closed fist beside a 1-cup measuring cup of rice',
  },
  {
    id: 'palm',
    pose: { fingers: { all: [3, 3, 2] }, spread: [6, 2, -2, -6], thumb: { abduct: 20, cmc: -25, mcp: 0, ip: 0 } },
    highlight: 'palm',
    tool: { kind: 'meat' },
    alt: 'An open palm, the palm outlined without the fingers, beside a 3 oz piece of cooked meat',
  },
  {
    id: 'cupped',
    pose: { fingers: { all: [50, 55, 35] }, spread: [9, 3, -3, -9], thumb: { abduct: 15, cmc: 15, mcp: 15, ip: 10 } },
    highlight: 'all',
    holds: 'veg', // a small heap of chopped vegetables sits in the hollow of the palm
    tool: { kind: 'cup', volumeMl: 118.3, radius: 35, food: 'veg' },
    alt: 'A cupped hand holding chopped broccoli and carrots, beside a ½-cup measuring cup of the same',
  },
  {
    id: 'thumb',
    pose: { fingers: { all: [100, 110, 65] }, spread: [4, 1, -3, -8], thumb: { abduct: 30, cmc: 0, mcp: 0, ip: 0 } },
    highlight: 'thumb',
    tool: { kind: 'spoon', volumeMl: 14.79, radius: 22, food: 'fat' },
    alt: 'A thumbs-up hand with the thumb outlined, beside a 1-tablespoon measuring spoon of nut butter',
  },
];
