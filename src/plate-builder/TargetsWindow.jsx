import { useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import { spiceTokens } from '../theme';
import { STATUS_ICON } from './art';
import PlateNutritionLabel from './PlateNutritionLabel';
import { targetStatus, targetFill, formatAmount, formatTarget, proportionStatus, rowStatus } from './plateBuilderData';

const STATUS_COLOR = { met: spiceTokens.secondaryGreen, low: spiceTokens.orange[700], high: '#b23842' };
const STATUS_WORDS = { met: 'Goal met', low: 'Add more · aim for', high: 'Too much · aim for' };

// Game/Target Meter: one nutrient. Status is carried by icon and words as
// well as color.
function TargetMeter({ label, value, unit, target }) {
  const status = targetStatus(value, target, unit);
  const fill = targetFill(value, target);
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.1px', color: 'text.primary' }}>
        <Box sx={{ flex: 1 }}>{label}</Box>
        <Box>{formatAmount(value, unit)}</Box>
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

// Proportion row colors: categorical slots (dataviz reference palette:
// blue, yellow, violet), validated as an adjacent stack (worst CVD ΔE 31,
// normal-vision ΔE 37) and kept clear of the green/orange/red status
// colors. Amber is under 3:1 on white, so every segment is also named in
// the legend with its % (the relief rule), and in-bar text is dark on it.
const PART_COLOR = { carbsPct: '#2a78d6', proteinPct: '#eda100', fatPct: '#6250d6' };
const PART_INK = { carbsPct: '#fff', proteinPct: '#0b0b0b', fatPct: '#fff' };
const PART_WORDS = { met: 'on target', low: 'too low', high: 'too high' };
const PART_GRAMS = { carbsPct: 'carbs', proteinPct: 'protein', fatPct: 'fat' };

// Proportion (Level 1): the doc's three % targets as one row, so a plate
// with only one food doesn't throw three meters off. It looks unlike the
// meters on purpose (tinted card, thick stacked bar), because it measures a
// split, not an amount. Always rendered last.
function ProportionMeter({ totals, targets }) {
  const { parts, status, empty } = proportionStatus(totals, targets);
  const off = parts.filter((p) => p.status !== 'met').map((p) => p.label.toLowerCase());
  const offList = off.length > 1 ? `${off.slice(0, -1).join(', ')} and ${off[off.length - 1]}` : off[0];
  const summary = empty ? 'Add food to see the balance' : status === 'met' ? 'In balance' : `Adjust ${offList}`;
  return (
    <Box sx={{ mt: 0.5, p: 1.5, borderRadius: 1.5, bgcolor: spiceTokens.neutralA[25], border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
        <Box sx={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, flex: 1 }}>
          Proportion{' '}
          <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: '0.75rem' }}>share of calories</Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Off balance isn't "too much" of one thing, so it gets a neutral
              alert icon rather than the meters' up/down arrows. */}
          {status === 'met' ? (
            <Box component="img" src={STATUS_ICON.met} alt="" sx={{ width: 14, height: 14 }} />
          ) : (
            !empty && <ErrorOutlineIcon sx={{ fontSize: 15, color: spiceTokens.orange[700] }} />
          )}
          <Typography variant="caption" sx={{ fontWeight: 500 }}>{summary}</Typography>
        </Box>
      </Box>

      {/* The stacked bar: a 2px gap in the card color separates segments. */}
      <Box
        role="img"
        aria-label={empty ? 'No food yet' : parts.map((p) => `${p.label} ${Math.round(p.value)}%`).join(', ')}
        sx={{ display: 'flex', gap: '2px', height: 20, my: 1 }}
      >
        {empty ? (
          <Box sx={{ flex: 1, borderRadius: '4px', bgcolor: '#d9d2cd' }} />
        ) : (
          parts.map((p) => (
            <Tooltip key={p.key} title={`${p.label}: ${Math.round(p.value)}% of calories (${Math.round(totals[PART_GRAMS[p.key]])} g)`} arrow>
              <Box
                sx={{
                  width: `${p.value}%`,
                  minWidth: p.value > 0 ? 3 : 0,
                  display: p.value > 0 ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: PART_COLOR[p.key],
                  color: PART_INK[p.key],
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  borderRadius: '4px',
                  transition: 'width 300ms ease',
                }}
              >
                {p.value >= 12 ? `${Math.round(p.value)}%` : null}
              </Box>
            </Tooltip>
          ))
        )}
      </Box>

      {/* Legend: identity, value, target and status for each part. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))', columnGap: 1.5, rowGap: 0.75 }}>
        {parts.map((p) => (
          <Box key={p.key} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, minWidth: 0 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: PART_COLOR[p.key], mt: '4px', flexShrink: 0 }} />
            <Box>
              <Box sx={{ fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.5 }}>
                {p.label} {empty ? '–' : `${Math.round(p.value)}%`}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {!empty && <Box component="img" src={STATUS_ICON[p.status]} alt="" sx={{ width: 12, height: 12 }} />}
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  {!empty && `${PART_WORDS[p.status]} · `}aim {p.target.min}–{p.target.max}%
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
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
  const rows = nutrients.map((n) => ({ ...n, value: totals[n.key], target: challenge.targets[n.key], status: rowStatus(n, totals, challenge.targets) }));
  const metCount = rows.filter((r) => r.status === 'met').length;
  // Unmet meters sort to the top, so what still needs work shows first;
  // the Proportion row stays at the bottom.
  const meters = rows.filter((r) => r.kind !== 'proportion');
  const sorted = [...meters].sort((a, b) => (a.status === 'met') - (b.status === 'met'));
  const hasProportion = rows.length !== meters.length;

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
                <TargetMeter key={r.key} label={r.label} value={r.value} unit={r.unit} target={r.target} />
              ))}
              {hasProportion && <ProportionMeter totals={totals} targets={challenge.targets} />}
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
