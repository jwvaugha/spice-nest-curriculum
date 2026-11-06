import Box from '@mui/material/Box';
import { spiceTokens } from '../theme';
import { DAILY_VALUES, targetStatus } from './plateBuilderData';

// Game/Plate Nutrition Label: the plate's running totals in FDA label
// layout (current Daily Values), plus a Target column marking each row
// met / low / high against the current challenge. Same font family as the
// app's other label (NutritionLabelCard) rather than the Figma's Inter.
const INK = '#000';
const STATUS_TEXT_COLOR = { met: spiceTokens.secondaryGreen, low: spiceTokens.orange[900], high: '#b23842' };

const Rule = ({ h }) => <Box sx={{ height: h, bgcolor: INK, width: '100%' }} />;

function Row({ label, amount, dv, status, bold = true, indent = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, py: '2px', pl: indent ? 1.5 : 0, fontSize: '0.75rem', lineHeight: 1.25 }}>
      <Box component="span" sx={{ fontWeight: bold ? 700 : 400 }}>{label}</Box>
      <Box component="span">{amount}</Box>
      <Box sx={{ flex: 1 }} />
      {dv !== undefined && <Box component="span" sx={{ fontWeight: 700 }}>{dv}%</Box>}
      <Box component="span" sx={{ width: 40, textAlign: 'right', fontWeight: 700, fontSize: '0.625rem', color: STATUS_TEXT_COLOR[status] }}>
        {status}
      </Box>
    </Box>
  );
}

export default function PlateNutritionLabel({ totals, servings, challenge }) {
  const t = challenge.targets;
  const st = (k) => targetStatus(totals[k], t[k]);
  const dv = (k) => Math.round((totals[k] / DAILY_VALUES[k]) * 100);
  const g = (k) => `${Math.round(totals[k])}g`;

  return (
    <Box sx={{ bgcolor: '#fff', border: `1.5px solid ${INK}`, px: 1, pt: 0.75, pb: 1, color: INK, fontFamily: '"Roboto", sans-serif' }}>
      <Box sx={{ fontSize: '1.625rem', fontWeight: 900, lineHeight: 1.25 }}>Nutrition Facts</Box>
      <Box sx={{ fontSize: '0.75rem', lineHeight: 1.25 }}>
        Your plate · {servings} {servings === 1 ? 'serving' : 'servings'}
      </Box>
      <Rule h={8} />
      <Box sx={{ fontSize: '0.625rem', fontWeight: 700, lineHeight: 1.25, pt: '2px' }}>Amount per plate</Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, fontWeight: 900, lineHeight: 1.25 }}>
        <Box component="span" sx={{ fontSize: '1.25rem' }}>Calories</Box>
        <Box component="span" sx={{ fontSize: '1.5rem' }}>{Math.round(totals.calories)}</Box>
        <Box sx={{ flex: 1 }} />
        <Box component="span" sx={{ width: 40, textAlign: 'right', fontWeight: 700, fontSize: '0.625rem', color: STATUS_TEXT_COLOR[st('calories')] }}>
          {st('calories')}
        </Box>
      </Box>
      <Rule h={4} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, pt: '2px', fontSize: '0.625rem', fontWeight: 700, lineHeight: 1.25 }}>
        <span>% Daily Value*</span>
        <Box component="span" sx={{ width: 40, textAlign: 'right' }}>Target</Box>
      </Box>
      <Rule h={1} />
      <Row label="Total Fat" amount={g('fat')} dv={dv('fat')} status={st('fat')} />
      <Rule h={1} />
      <Row label="Sodium" amount={`${Math.round(totals.sodium)}mg`} dv={dv('sodium')} status={st('sodium')} />
      <Rule h={1} />
      <Row label="Total Carbohydrate" amount={g('carbs')} dv={dv('carbs')} status={st('carbs')} />
      <Rule h={1} />
      <Row label="Dietary Fiber" amount={g('fiber')} dv={dv('fiber')} status={st('fiber')} bold={false} indent />
      <Rule h={1} />
      <Row label="Total Sugars" amount={g('sugar')} status={st('sugar')} bold={false} indent />
      <Rule h={1} />
      <Row label="Protein" amount={g('protein')} dv={dv('protein')} status={st('protein')} />
      <Rule h={8} />
      <Box sx={{ fontSize: '0.5625rem', lineHeight: 1.25, pt: 0.5 }}>
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </Box>
    </Box>
  );
}
