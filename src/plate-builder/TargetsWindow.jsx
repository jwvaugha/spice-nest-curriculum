import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { spiceTokens } from '../theme';
import { STATUS_ICON } from './art';
import PlateNutritionLabel from './PlateNutritionLabel';
import { targetStatus, targetFill, formatAmount, formatTarget } from './plateBuilderData';

const STATUS_COLOR = { met: spiceTokens.secondaryGreen, low: spiceTokens.orange[700], high: '#b23842' };
const STATUS_WORDS = { met: 'Goal met', low: 'Add more · aim for', high: 'Too much · aim for' };

// Game/Target Meter: one nutrient. Status is carried by icon and words as
// well as color.
// A percentage target (Level 1) also shows the grams behind it.
function TargetMeter({ label, value, unit, target, gramsValue }) {
  const status = targetStatus(value, target, unit);
  const fill = targetFill(value, target);
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.1px', color: 'text.primary' }}>
        <Box sx={{ flex: 1 }}>{label}</Box>
        <Box>
          {formatAmount(value, unit)}
          {gramsValue !== undefined && (
            <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}> · {formatAmount(gramsValue, 'g')}</Box>
          )}
        </Box>
      </Box>
      <Box sx={{ position: 'relative', height: 6, borderRadius: '3px', bgcolor: '#d9d2cd', overflow: 'hidden', my: '6px' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill}%`, borderRadius: '3px', bgcolor: STATUS_COLOR[status], transition: 'width 300ms ease, background-color 300ms ease' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box component="img" src={STATUS_ICON[status]} alt="" sx={{ width: 14, height: 14 }} />
        <Typography variant="caption" color="text.secondary">
          {STATUS_WORDS[status]} · {formatTarget(target, unit)}
        </Typography>
      </Box>
    </Box>
  );
}

// The D3/D4 targets window: a fixed-height card with an always-visible
// "x of N targets met" header and a ToggleButtonGroup that switches the
// scrolling body between target bars and the plate's Nutrition Facts label.
export default function TargetsWindow({ challenge, totals, servings, height = 300 }) {
  const [view, setView] = useState('bars');
  const nutrients = challenge.level.nutrients;
  const rows = nutrients.map((n) => ({ ...n, value: totals[n.key], target: challenge.targets[n.key], status: targetStatus(totals[n.key], challenge.targets[n.key], n.unit) }));
  const metCount = rows.filter((r) => r.status === 'met').length;
  // Unmet targets sort to the top, so what still needs work shows first.
  const sorted = [...rows].sort((a, b) => (a.status === 'met') - (b.status === 'met'));

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        height,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'common.white',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 2, pr: 1.25, py: 1, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 }} aria-live="polite">
            {metCount} of {nutrients.length} targets met
          </Typography>
          <Box sx={{ position: 'relative', width: 140, maxWidth: '100%', height: 6, mt: '6px', borderRadius: '3px', bgcolor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', inset: 0, right: 'auto', width: `${(metCount / nutrients.length) * 100}%`, bgcolor: 'primary.main', borderRadius: '3px', transition: 'width 300ms ease' }} />
          </Box>
        </Box>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={view}
          onChange={(_, v) => v && setView(v)}
          aria-label="Show targets as"
          sx={{ bgcolor: 'common.white', '& .MuiToggleButton-root': { p: 1, color: 'text.secondary', borderColor: 'divider' }, '& .Mui-selected': { bgcolor: '#fdf5e8 !important', color: `${spiceTokens.neutralA[800]} !important` } }}
        >
          <ToggleButton value="bars" aria-label="Target bars">
            <LeaderboardIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="label" aria-label="Nutrition Facts label">
            <ReceiptLongIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Box
          tabIndex={0}
          aria-label={view === 'bars' ? 'Targets' : 'Nutrition Facts for your plate'}
          sx={{
            height: '100%',
            overflowY: 'auto',
            pl: 2,
            pr: 1.5,
            pt: 1.5,
            pb: 4,
            scrollbarWidth: 'thin',
            scrollbarColor: `${spiceTokens.neutralB[200]} transparent`,
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
          }}
        >
          {view === 'bars' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {sorted.map((r) => (
                <TargetMeter key={r.key} label={r.label} value={r.value} unit={r.unit} target={r.target} gramsValue={r.grams ? totals[r.grams] : undefined} />
              ))}
            </Box>
          ) : (
            <PlateNutritionLabel totals={totals} servings={servings} challenge={challenge} />
          )}
        </Box>
        {/* Scroll fade: hints that the window has more below. */}
        <Box sx={{ position: 'absolute', left: 0, right: 12, bottom: 0, height: 36, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 100%)' }} />
      </Box>
    </Box>
  );
}
