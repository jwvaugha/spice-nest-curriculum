import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { spiceTokens } from '../theme';
import { FOOD_ART } from './art';
import PlateNutritionLabel from './PlateNutritionLabel';
import { plateTotals, prettyServing } from './plateBuilderData';

const BORDER_LIGHT = '#e9dbc6'; // Global/borderLight

// Game/Food Art: a placeholder tile per food group (not emoji).
export function FoodArt({ category, size = 48 }) {
  return (
    <Box sx={{ width: size, height: size, borderRadius: '12px', bgcolor: spiceTokens.neutralA[25], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Box component="img" src={FOOD_ART[category]} alt="" sx={{ width: size * (28 / 48), height: size * (28 / 48) }} />
    </Box>
  );
}

// Two-line clamp that also reserves both lines, so every tile is the same
// height whatever its name or serving length (em-based, so it scales with
// the browser font size). The full text stays in `title`.
const clampSx = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: `calc(${lines} * 1lh)`,
  textAlign: 'center',
});

const STEP_BTN_SX = { width: 28, height: 28, border: '1px solid', borderColor: spiceTokens.orange[200], bgcolor: 'common.white', '&:hover': { bgcolor: spiceTokens.orange[10] } };

// Game/Tray Tile. Tapping the body adds a serving. Once the food is on the
// plate, the tile's footer turns into a − count + stepper in place (the
// footer slot is the same height either way, so tiles never change size).
// The info button opens the food's Nutrition Facts: a mouse hover previews
// it, a click (or tap, or Enter) opens it as a dismissable popover.
function TrayTile({ food, onPlate, onAdd, onChange, onInfo, onInfoHover, onInfoLeave }) {
  const bodyRef = useRef(null);
  const serving = prettyServing(food.servingSize);
  return (
    <Box
      sx={{
        position: 'relative',
        width: 124,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: onPlate ? '2px solid' : '1px solid',
        borderColor: onPlate ? 'primary.main' : 'divider',
        bgcolor: onPlate ? spiceTokens.orange[10] : 'common.white',
        // Keep the tile the same size whether its border is 1 or 2px.
        m: onPlate ? 0 : '1px',
        overflow: 'hidden',
        transition: 'border-color 150ms ease',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <ButtonBase
        ref={bodyRef}
        onClick={() => onAdd(food.id)}
        aria-label={`Add ${food.name}, ${food.servingSize}${onPlate ? `. ${onPlate} on plate` : ''}`}
        sx={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '6px',
          px: 1,
          pt: 1.5,
          pb: 1,
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2, borderRadius: '10px' },
        }}
      >
        <FoodArt category={food.category} size={56} />
        <Typography title={food.name} sx={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57, letterSpacing: '0.1px', ...clampSx(2) }}>
          {food.name}
        </Typography>
        <Typography variant="caption" title={serving} sx={{ color: 'text.secondary', lineHeight: 1.5, ...clampSx(2) }}>
          {serving}
        </Typography>
        {!onPlate && (
          <Box aria-hidden sx={{ height: 32, display: 'flex', alignItems: 'center', gap: 0.25, color: 'primary.main', fontSize: '0.8125rem', fontWeight: 500 }}>
            <AddIcon sx={{ fontSize: 16 }} /> Add
          </Box>
        )}
      </ButtonBase>
      {onPlate > 0 && (
        <Box role="group" aria-label={`${food.name} servings`} sx={{ height: 32, mb: '6px', px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton
            size="small"
            aria-label={onPlate === 1 ? `Take ${food.name} off the plate` : `One less ${food.name}`}
            onClick={() => {
              // The stepper disappears at 0, so hand focus back to the tile.
              if (onPlate === 1) bodyRef.current?.focus();
              onChange(food.id, -1);
            }}
            sx={STEP_BTN_SX}
          >
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography aria-live="polite" sx={{ fontSize: '0.875rem', fontWeight: 500, color: spiceTokens.orange[900] }}>
            {onPlate}<Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}> on plate</Box>
          </Typography>
          <IconButton size="small" aria-label={`One more ${food.name}`} onClick={() => onChange(food.id, 1)} sx={STEP_BTN_SX}>
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
      <IconButton
        size="small"
        aria-label={`Nutrition facts for ${food.name}`}
        aria-haspopup="dialog"
        onClick={(e) => onInfo(food, e.currentTarget)}
        // Mouse only: a touch "hover" would flash the preview before the tap.
        onPointerEnter={(e) => e.pointerType === 'mouse' && onInfoHover(food, e.currentTarget)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && onInfoLeave()}
        sx={{ position: 'absolute', top: 4, right: 4, p: '4px', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

const PART_LABEL = [['carbsPct', 'Carbs'], ['proteinPct', 'Protein'], ['fatPct', 'Fat']];

// The info card: one serving's Nutrition Facts (same label as the plate's,
// minus the Target column), its calorie split, and where the numbers came
// from. Level 1 foods carry a USDA FoodData Central id; Level 2's values
// are the Make prototype's and have none.
function FoodInfoCard({ food, foods }) {
  const totals = plateTotals({ [food.id]: 1 }, foods);
  const hasMacros = totals.carbsPct + totals.proteinPct + totals.fatPct > 0;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Box>
        <Typography component="h2" sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 }}>{food.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          One serving: {prettyServing(food.servingSize)}{food.grams ? ` (${food.grams} g)` : ''}
        </Typography>
      </Box>
      <PlateNutritionLabel totals={totals} subtitle="1 serving" amountLabel="Amount per serving" />
      {hasMacros && (
        <Typography variant="caption" component="p" sx={{ lineHeight: 1.5 }}>
          <Box component="span" sx={{ fontWeight: 500 }}>Share of calories:</Box>{' '}
          {PART_LABEL.map(([k, l]) => `${l} ${Math.round(totals[k])}%`).join(' · ')}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary" component="p" sx={{ lineHeight: 1.5 }}>
        {food.fdcId ? (
          <>
            Source:{' '}
            <Link href={`https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`} target="_blank" rel="noopener noreferrer">
              USDA FoodData Central #{food.fdcId}
            </Link>
          </>
        ) : (
          'Source: the Figma Make prototype (not yet reviewed).'
        )}
      </Typography>
    </Box>
  );
}

const scrollRowSx = {
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${spiceTokens.neutralB[200]} transparent`,
};

// The bottom food tray: category filter chips plus a sideways-scrolling
// row of foods. `foods` and `categories` are the current level's.
export default function FoodTray({ plate, onAdd, onChange, foods: allFoods, categories }) {
  const [category, setCategory] = useState('all');
  const [info, setInfo] = useState(null); // clicked: { food, anchor }
  const [peek, setPeek] = useState(null); // hovered: { food, anchor }
  // A short close delay lets the pointer cross from the button into the
  // preview (to reach the USDA link) without it vanishing.
  const closeTimer = useRef(null);
  const cancelClose = () => clearTimeout(closeTimer.current);
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setPeek(null), 150);
  };
  useEffect(() => cancelClose, []);
  const foods = category === 'all' ? allFoods : allFoods.filter((f) => f.category === category);
  const chips = [{ id: 'all', label: 'All' }, ...categories];

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
            <TrayTile food={f} onPlate={plate[f.id] || 0} onAdd={onAdd} onChange={onChange} onInfo={(food, anchor) => {
                cancelClose();
                setPeek(null);
                setInfo({ food, anchor });
              }}
              onInfoHover={(food, anchor) => {
                cancelClose();
                if (!info) setPeek({ food, anchor });
              }}
              onInfoLeave={closeSoon}
            />
          </Box>
        ))}
      </Box>
      <Popover
        open={Boolean(info)}
        anchorEl={info?.anchor}
        onClose={() => setInfo(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{ paper: { role: 'dialog', 'aria-label': info ? `Nutrition facts for ${info.food.name}` : undefined, sx: { p: 2, width: 280, maxWidth: 'calc(100vw - 32px)', borderRadius: 2 } } }}
      >
        {info && <FoodInfoCard food={info.food} foods={allFoods} />}
      </Popover>
      {/* Hover preview: a Popper (no backdrop, no focus trap) with the same
          card, so it can open and close under the mouse without flicker. */}
      <Popper
        open={Boolean(peek) && !info}
        anchorEl={peek?.anchor}
        placement="top"
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }, { name: 'preventOverflow', options: { padding: 16 } }]}
        sx={{ zIndex: (t) => t.zIndex.tooltip }}
      >
        <Paper
          elevation={8}
          onMouseEnter={cancelClose}
          onMouseLeave={closeSoon}
          sx={{ p: 2, width: 280, maxWidth: 'calc(100vw - 32px)', borderRadius: 2 }}
        >
          {peek && <FoodInfoCard food={peek.food} foods={allFoods} />}
        </Paper>
      </Popper>
    </Box>
  );
}
