import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { spiceTokens } from '../theme';
import PlateView from './PlateView';
import TargetsWindow from './TargetsWindow';
import FoodTray from './FoodTray';
import { CHALLENGES, foodById, plateTotals, servingCount, prettyServing } from './plateBuilderData';

// "Challenge 1 of 3" progress pips: the current one is a 24px bar.
function ProgressPips({ index, completed }) {
  return (
    <Box sx={{ display: 'flex', gap: '6px' }} aria-hidden>
      {CHALLENGES.map((c, i) => (
        <Box
          key={c.id}
          sx={{
            height: 8,
            width: i === index ? 24 : 8,
            borderRadius: '4px',
            bgcolor: i === index ? 'primary.main' : completed.has(c.id) ? spiceTokens.secondaryGreen : 'divider',
          }}
        />
      ))}
    </Box>
  );
}

// D3/D4: one challenge. `contentWidth` is the reading column's measured
// width; the plate shrinks from 260 to 196px below ~720px (the 900px-window
// design) and the stage stacks on very narrow panes.
export default function PlateBuilderGame({ index, completed, plate, setPlate, onSubmit, contentWidth }) {
  const challenge = CHALLENGES[index];
  const totals = useMemo(() => plateTotals(plate), [plate]);
  const servings = servingCount(plate);
  const [hintsAnchor, setHintsAnchor] = useState(null);
  const [portion, setPortion] = useState(null); // { id, anchor }

  const add = (id) => setPlate((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const change = (id, delta) =>
    setPlate((p) => {
      const qty = (p[id] || 0) + delta;
      const next = { ...p };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const stacked = contentWidth && contentWidth < 520;
  const plateSize = contentWidth >= 720 ? 260 : 196;
  const portionFood = portion && foodById(portion.id);
  const portionQty = portion ? plate[portion.id] || 0 : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
      {/* Challenge strip */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography variant="h6" component="p" sx={{ color: spiceTokens.orange[900] }}>
              Challenge {index + 1} of {CHALLENGES.length}
            </Typography>
            <ProgressPips index={index} completed={completed} />
          </Box>
          <Typography variant="h2" component="h1">{challenge.name} plate</Typography>
        </Box>
        <Button
          variant="text"
          onClick={(e) => setHintsAnchor(e.currentTarget)}
          aria-haspopup="dialog"
          sx={{ textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.4px' }}
        >
          Hints
        </Button>
        <Button variant="contained" size="large" disableElevation onClick={onSubmit} disabled={servings === 0}>
          Submit
        </Button>
      </Box>

      {/* Stage: plate beside the targets window */}
      <Box sx={{ display: 'flex', flexDirection: stacked ? 'column' : 'row', alignItems: 'center', gap: 2 }}>
        <PlateView
          size={stacked ? 220 : plateSize}
          plate={plate}
          emptyHint="Tap a food below to add it"
          onPortionClick={(id, anchor) => setPortion({ id, anchor })}
        />
        <Box sx={{ width: stacked ? '100%' : 'auto', flex: stacked ? 'none' : 1, minWidth: 0, display: 'flex' }}>
          <TargetsWindow challenge={challenge} totals={totals} servings={servings} />
        </Box>
      </Box>

      <FoodTray plate={plate} onAdd={add} />

      {/* Hints: the Make prototype's "Healthy Hints" for this condition. */}
      <Popover
        open={Boolean(hintsAnchor)}
        anchorEl={hintsAnchor}
        onClose={() => setHintsAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2.5, maxWidth: 340, borderRadius: 2 } } }}
      >
        <Typography variant="h6" component="h2" sx={{ color: spiceTokens.orange[900], mb: 1 }}>Hints</Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>{challenge.description}</Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {challenge.tips.map((t) => (
            <Typography component="li" variant="body2" key={t}>{t}</Typography>
          ))}
        </Box>
      </Popover>

      {/* Tapping a portion on the plate: change servings or take it off. */}
      <Popover
        open={Boolean(portion) && portionQty > 0}
        anchorEl={portion?.anchor}
        onClose={() => setPortion(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { sx: { p: 2, borderRadius: 2, minWidth: 220 } } }}
      >
        {portionFood && (
          <>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{portionFood.name}</Typography>
            <Typography variant="caption" color="text.secondary">{prettyServing(portionFood.servingSize)} per serving</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
              <IconButton size="small" aria-label={`One less ${portionFood.name}`} onClick={() => change(portionFood.id, -1)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 88, textAlign: 'center', fontSize: '0.875rem' }} aria-live="polite">
                {portionQty} {portionQty === 1 ? 'serving' : 'servings'}
              </Typography>
              <IconButton size="small" aria-label={`One more ${portionFood.name}`} onClick={() => change(portionFood.id, 1)} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Button
              size="small"
              color="error"
              onClick={() => {
                change(portionFood.id, -portionQty);
                setPortion(null);
              }}
              sx={{ mt: 1, px: 0 }}
            >
              Take it off the plate
            </Button>
          </>
        )}
      </Popover>
    </Box>
  );
}
