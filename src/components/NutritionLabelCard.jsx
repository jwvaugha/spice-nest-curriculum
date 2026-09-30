import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// A deliberately shrunk-down (260px vs. the original 320px demo) mirror of
// the REAL FDA nutrition-facts-label look -- per direct user direction, this
// is the one piece of the tool that should keep looking like an actual
// American nutrition label (heavy black rules, bold condensed sans
// headlines), not get pulled toward this app's own serif/Vollkorn heading
// style. The only thing that changes to match this app's own design system
// is the INTERACTIVE accent: a clicked row highlights with the app's own
// `action.selected` tint and `primary.main` border instead of the source
// prototype's yellow, so the interaction language matches every other
// "selected/active" state in this app (Sidebar's active chapter row, a
// selected menu item) without touching the label's own black-and-white
// print-accurate styling.
const INK = '#1a1a1a';

function Row({ id, activeId, onClick, sx, children }) {
  const isActive = id === activeId;
  return (
    <Box
      onClick={() => onClick(id)}
      sx={{
        cursor: 'pointer',
        borderRadius: 1,
        border: '1.5px solid transparent',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        ...(isActive
          ? { bgcolor: 'action.selected', borderColor: 'primary.main' }
          : { '&:hover': { bgcolor: 'action.hover' } }),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

// `maxHeight` (passed by NutritionLabelExplorer, computed against the real
// page chrome + sticky offset, see that file's own comment) caps this card
// on shorter windows instead of letting it grow to whatever its full 14-
// nutrient content naturally needs -- per direct user direction, "the label
// should only be as tall as the height it's able to span," not force the
// window to scroll past its bottom to keep it fully visible while stuck.
// Structured as a 3-tier flex column (fixed header, scrollable middle,
// nothing below) rather than one flat scrolling block, so "Nutrition
// Facts"/servings/calories/the "% Daily Value" column header stay visible
// as a sticky-feeling header even while the nutrient rows themselves
// scroll underneath -- this also matches a real label's own printed
// structure, where that block is always the fixed reference point at the
// top regardless of which row you're currently reading further down.
export default function NutritionLabelCard({ items, activeNutrient, onNutrientClick, maxHeight }) {
  const [servings, servingSize, calories, ...nutrients] = items;
  const boldIds = new Set(['total-fat', 'total-carbs']);
  const indentIds = new Set(['saturated-fat', 'trans-fat', 'dietary-fiber', 'total-sugars']);

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: `2px solid ${INK}`,
        borderRadius: 1,
        width: 260,
        maxHeight,
        boxShadow: 2,
        fontFamily: '"Roboto", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Fixed header -- never scrolls. Everything a reader needs to
          orient themselves (what food, what serving, what column the
          numbers below belong to) lives here. */}
      <Box sx={{ flexShrink: 0, px: 2, pt: 2 }}>
        <Box sx={{ borderBottom: `8px solid ${INK}`, pb: 1, mb: 1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, color: INK }}>Nutrition Facts</Typography>
          <Row id={servings.id} activeId={activeNutrient} onClick={onNutrientClick} sx={{ px: 0.5, py: 0.25, mt: 0.5 }}>
            <Typography sx={{ fontSize: 13, color: INK }}>{servings.amount}</Typography>
          </Row>
          {/* On a real FDA label, "Serving size" is the visually dominant
              line in this block -- noticeably larger/bolder than "servings
              per container" above it, not just bold at the same small
              size. Bumped to match that hierarchy (18px vs. the 13px
              servings line) rather than treating the two lines as equally
              weighted. */}
          <Row id={servingSize.id} activeId={activeNutrient} onClick={onNutrientClick} sx={{ px: 0.5, py: 0.25, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: INK }}>Serving size</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: INK }}>{servingSize.amount}</Typography>
          </Row>
        </Box>

        <Row
          id={calories.id}
          activeId={activeNutrient}
          onClick={onNutrientClick}
          sx={{ borderBottom: `4px solid ${INK}`, pb: 1, mb: 1, px: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: INK }}>Calories</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: INK }}>{calories.amount}</Typography>
        </Row>

        <Typography sx={{ fontSize: 11, fontWeight: 700, textAlign: 'right', borderBottom: `1px solid ${INK}`, pb: 0.5, color: INK }}>
          % Daily Value*
        </Typography>
      </Box>

      {/* Scrollable middle -- JUST the nutrient rows. Per direct user
          feedback, the footnote below is its OWN fixed footer now (was
          previously the last thing in this scrollable area) -- the reader
          should always see "here's what the numbers mean" without having
          to scroll all the way down to find it. */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pb: 1 }}>
        <Box sx={{ pt: 0.5 }}>
          {nutrients.map((n, i) => (
            <Row
              key={n.id}
              id={n.id}
              activeId={activeNutrient}
              onClick={onNutrientClick}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                px: 0.5,
                py: 0.5,
                borderBottom: i === nutrients.length - 1 ? `4px solid ${INK}` : '1px solid #ddd',
              }}
            >
              <Typography sx={{ fontSize: 12.5, fontWeight: boldIds.has(n.id) ? 700 : 400, ml: indentIds.has(n.id) ? 1.5 : 0, color: INK }}>
                {n.name} {n.amount}
              </Typography>
              {n.dailyValue && <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{n.dailyValue}</Typography>}
            </Row>
          ))}
        </Box>
      </Box>

      {/* Fixed footer -- always visible, same tier as the header above.
          `borderTop` gives it a clear visual boundary against the
          scrollable middle now that it's a separate region rather than
          just trailing text after the last row. */}
      <Box sx={{ flexShrink: 0, px: 2, pb: 2 }}>
        <Typography sx={{ fontSize: 9.5, lineHeight: 1.3, color: '#333', borderTop: `1px solid #ccc`, pt: 1 }}>
          * The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general
          nutrition advice.
        </Typography>
      </Box>
    </Box>
  );
}
