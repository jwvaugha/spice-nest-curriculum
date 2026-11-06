import { useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { spiceTokens } from '../theme';
import { FOOD_ART } from './art';
import { FOODS, CATEGORIES, prettyServing } from './plateBuilderData';

const BORDER_LIGHT = '#e9dbc6'; // Global/borderLight

// Game/Food Art: a placeholder tile per food group (not emoji).
export function FoodArt({ category, size = 48 }) {
  return (
    <Box sx={{ width: size, height: size, borderRadius: '12px', bgcolor: spiceTokens.neutralA[25], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Box component="img" src={FOOD_ART[category]} alt="" sx={{ width: size * (28 / 48), height: size * (28 / 48) }} />
    </Box>
  );
}

// Game/Tray Tile. Tap to add a serving.
function TrayTile({ food, onPlate, onAdd }) {
  return (
    <ButtonBase
      onClick={() => onAdd(food.id)}
      aria-label={`Add ${food.name}, ${food.servingSize}${onPlate ? `. ${onPlate} on plate` : ''}`}
      sx={{
        width: 116,
        flexShrink: 0,
        flexDirection: 'column',
        gap: '6px',
        px: 1,
        py: 1.5,
        borderRadius: '12px',
        border: onPlate ? '2px solid' : '1px solid',
        borderColor: onPlate ? 'primary.main' : 'divider',
        bgcolor: onPlate ? spiceTokens.orange[10] : 'common.white',
        // Keep the tile the same size whether its border is 1 or 2px.
        m: onPlate ? 0 : '1px',
        transition: 'border-color 150ms ease',
        '&:hover': { borderColor: 'primary.main' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      <FoodArt category={food.category} size={56} />
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.1px', textAlign: 'center' }}>{food.name}</Typography>
      <Typography variant="caption" sx={{ color: onPlate ? spiceTokens.orange[900] : 'text.secondary', textAlign: 'center', lineHeight: 1.66 }}>
        {onPlate ? `On plate · ${onPlate}` : prettyServing(food.servingSize)}
      </Typography>
    </ButtonBase>
  );
}

const scrollRowSx = {
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${spiceTokens.neutralB[200]} transparent`,
};

// The bottom food tray: category filter chips plus a sideways-scrolling
// row of foods.
export default function FoodTray({ plate, onAdd }) {
  const [category, setCategory] = useState('all');
  const foods = category === 'all' ? FOODS : FOODS.filter((f) => f.category === category);
  const chips = [{ id: 'all', label: 'All' }, ...CATEGORIES];

  return (
    <Box sx={{ bgcolor: spiceTokens.neutralA[25], borderRadius: 2, px: 1.5, pt: 1.25, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25, minWidth: 0 }}>
      <Box role="group" aria-label="Filter foods by group" sx={{ ...scrollRowSx, gap: 1, pb: 0.25 }}>
        {chips.map((c) => {
          const selected = c.id === category;
          return (
            <Chip
              key={c.id}
              label={c.label}
              variant="outlined"
              size="small"
              clickable
              aria-pressed={selected}
              onClick={() => setCategory(c.id)}
              sx={{
                flexShrink: 0,
                bgcolor: 'common.white',
                borderColor: selected ? 'primary.main' : BORDER_LIGHT,
                color: selected ? 'primary.main' : 'text.primary',
                fontSize: '0.8125rem',
              }}
            />
          );
        })}
      </Box>
      <Box role="list" aria-label="Foods" sx={{ ...scrollRowSx, gap: 1.25, pb: 0.75 }}>
        {foods.map((f) => (
          <Box role="listitem" key={f.id} sx={{ display: 'flex' }}>
            <TrayTile food={f} onPlate={plate[f.id] || 0} onAdd={onAdd} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
