import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { PLATE_ART, PORTION_ART } from './art';
import { foodById } from './plateBuilderData';

// Game/Plate Base + Game/Plate Portion. The plate is ~25 cm seen from above;
// each serving is its own top-down portion, sized by food group relative
// to the plate (ratios read off the Figma D0/D3 instances: salmon ≈ 0.44 of
// the plate's width, broccoli ≈ 0.36, quinoa/rice ≈ 0.30, avocado ≈ 0.25).
// Portions are 80×64 ellipses, so height = 0.8 × width.
const PORTION_WIDTH = { protein: 0.44, vegetable: 0.36, grain: 0.3, dairy: 0.3, fruit: 0.28, snack: 0.28, fat: 0.25 };

// Where servings land, in the order they're added (fractions of the plate,
// centre points inside the well). The first five reproduce the Figma D0
// arrangement; past the last slot they wrap around with a small offset.
const SLOTS = [
  [0.66, 0.36, -6], [0.3, 0.42, 4], [0.62, 0.66, 8], [0.31, 0.68, -3], [0.47, 0.24, 10],
  [0.8, 0.54, -8], [0.48, 0.48, 3], [0.2, 0.56, 6], [0.5, 0.8, -5], [0.78, 0.76, 9],
  [0.27, 0.26, -10], [0.74, 0.2, 5],
];

// The rim SVG is 332px for a 300px plate (shadow bleed): inset -4% / -5.33% / -6.67% / -5.33%.
// The well is a 244px circle centred in the 300px plate.
export default function PlateView({ size, plate, onPortionClick, emptyHint }) {
  const servings = [];
  Object.entries(plate).forEach(([id, qty]) => {
    for (let i = 0; i < qty; i += 1) servings.push({ food: foodById(id), n: i });
  });

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <Box
        component="img"
        src={PLATE_ART.rim}
        alt=""
        sx={{ position: 'absolute', left: '-5.33%', top: '-4%', width: '110.67%', height: '110.67%', display: 'block' }}
      />
      <Box
        component="img"
        src={PLATE_ART.well}
        alt=""
        sx={{ position: 'absolute', left: `${(28 / 300) * 100}%`, top: `${(28 / 300) * 100}%`, width: `${(244 / 300) * 100}%`, height: `${(244 / 300) * 100}%`, display: 'block' }}
      />

      {servings.length === 0 && emptyHint && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ position: 'absolute', inset: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
        >
          {emptyHint}
        </Typography>
      )}

      {servings.map(({ food, n }, i) => {
        const [cx, cy, rot] = SLOTS[i % SLOTS.length];
        const lap = Math.floor(i / SLOTS.length);
        const w = size * PORTION_WIDTH[food.category];
        const h = w * 0.8;
        const left = (cx + lap * 0.04) * size - w / 2;
        const top = (cy + lap * 0.04) * size - h / 2;
        const art = <Box component="img" src={PORTION_ART[food.category]} alt="" sx={{ width: '100%', height: '100%', display: 'block' }} />;
        const sx = { position: 'absolute', left, top, width: w, height: h, transform: `rotate(${rot}deg)`, borderRadius: '50%' };
        return onPortionClick ? (
          <ButtonBase
            key={`${food.id}-${n}`}
            onClick={(e) => onPortionClick(food.id, e.currentTarget)}
            aria-label={`${food.name} on your plate. Change servings or remove`}
            sx={{ ...sx, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}
          >
            {art}
          </ButtonBase>
        ) : (
          <Box key={`${food.id}-${n}`} sx={sx} aria-hidden>
            {art}
          </Box>
        );
      })}
    </Box>
  );
}
