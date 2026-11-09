import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { spiceTokens } from '../theme';
import { rowStatus, formatAmount, scoreMessage, proportionStatus } from './plateBuilderData';

const CHIP_COLOR = {
  met: { color: '#43a047', border: 'rgba(46,125,50,0.5)' },
  high: { color: '#d32f2f', border: 'rgba(211,47,47,0.5)' },
  low: { color: spiceTokens.orange[900], border: 'rgba(222,122,45,0.5)' },
};
const STATUS_WORD = { met: 'met', high: 'too high', low: 'too low' };

// D5: results as a bottom sheet over the game, pinned to the bottom of the
// content pane (the parent must be position: relative).
// Level 1 shows the scenario's Educational Takeaway; Level 2 keeps the
// Make's score message. `isLast` = last challenge of its level.
export default function ResultsSheet({ open, challenge, totals, isLast, onEdit, onNext }) {
  const headingRef = useRef(null);
  const nutrients = challenge.level.nutrients;
  const rows = nutrients.map((n) => ({ ...n, value: totals[n.key], status: rowStatus(n, totals, challenge.targets) }));
  // The Proportion chip reads "Proportion · 51/24/25% · met".
  const chipText = (r) => {
    if (r.kind !== 'proportion') return `${r.label} · ${formatAmount(r.value, r.unit)} · ${STATUS_WORD[r.status]}`;
    const { parts } = proportionStatus(totals, challenge.targets);
    return `${r.label} · ${parts.map((p) => Math.round(p.value)).join('/')}% · ${r.status === 'met' ? 'met' : 'off balance'}`;
  };
  const met = rows.filter((r) => r.status === 'met').length;
  const sorted = [...rows].sort((a, b) => (a.status === 'met') - (b.status === 'met'));

  useEffect(() => {
    if (open) headingRef.current?.focus();
  }, [open]);

  return (
    <Slide in={open} direction="up" mountOnEnter unmountOnExit>
      <Box
        role="dialog"
        aria-labelledby="plate-results-heading"
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          bgcolor: 'common.white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0px -8px 32px 0px rgba(38,26,13,0.18)',
          px: 3,
          pt: 1.75,
          pb: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.75,
        }}
      >
        <Box sx={{ width: 40, height: 4, borderRadius: '2px', bgcolor: 'divider', alignSelf: 'center' }} />
        <Box>
          <Typography variant="h6" sx={{ color: spiceTokens.orange[900] }}>Plate submitted</Typography>
          <Typography id="plate-results-heading" ref={headingRef} tabIndex={-1} variant="h2" sx={{ outline: 'none', mt: 0.5 }}>
            {met} of {nutrients.length} targets met
          </Typography>
          {challenge.takeaway ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Box component="span" sx={{ fontWeight: 500 }}>Takeaway: </Box>
              {challenge.takeaway}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {scoreMessage(met, nutrients.length)}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sorted.map((r) => (
            <Chip
              key={r.key}
              size="small"
              variant="outlined"
              label={chipText(r)}
              sx={{ color: CHIP_COLOR[r.status].color, borderColor: CHIP_COLOR[r.status].border, fontSize: '0.8125rem' }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="large" onClick={onEdit}>Edit My Plate</Button>
          <Button variant="contained" size="large" onClick={onNext} disableElevation>
            {isLast ? `Finish Level ${challenge.level.number}` : 'Next Challenge'}
          </Button>
        </Box>
      </Box>
    </Slide>
  );
}
