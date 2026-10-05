import { useLayoutEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import StickyAsideSection, { STICKY_TOP } from './StickyAsideSection';
import NutritionLabelCard from './NutritionLabelCard';
import TipExample from './TipExample';
import { NUTRITION_ITEMS, HEALTH_CONDITIONS, getConditionNotes } from '../nutritionLabelData';

// Breathing room between the label's own bottom edge and the scroll pane's
// bottom edge, so it doesn't look like it's touching/clipped by the pane
// boundary even when the computed max-height is exactly hit.
const LABEL_BOTTOM_MARGIN = 24;
// Never shrink the label below this even if the math above says to --
// purely a safety net against a literally-zero/negative computed height on
// an extreme window (which would be an invalid/degenerate CSS value, not
// just a small one). Deliberately SMALL, not a "still looks nice" floor --
// an earlier version used 280px here, which on a genuinely short window
// forced the label past the truly-available space and overlapped
// `ChapterFooter`'s own button, the exact clipping bug this whole
// measurement exists to prevent. A small floor plus the header/scrollable-
// middle split means an extreme window shows a cramped but fully contained
// (never overlapping) card -- scrolling to see more of the header-adjacent
// rows -- rather than a taller card that looks fine in isolation but
// visually collides with something else on screen.
const LABEL_MIN_HEIGHT = 120;

// The interactive centerpiece of Module 1, Chapter 3 -- adapted from a
// Figma Make prototype the user pointed Claude at directly ("Sticky
// Nutrition Label"), re-integrated into this app's own component/typography
// conventions rather than dropped in as raw Tailwind.
//
// The label+selector stay STICKY beside the description list via
// `StickyAsideSection` (see that component's own doc comment for why this
// needed a dedicated wider layout instead of living inside a normal
// `Section`) -- this is the whole point of the original source prototype's
// own design (it used plain CSS `lg:sticky` too), and per direct user
// direction this app's own version needed the same "click a row, watch the
// matching explanation scroll into view while the label itself stays put"
// feel, not a simplified stacked substitute.
//
// Clicking a row still drives the highlight+scroll via plain
// `scrollIntoView` against the page's own scroll pane (no scroll-event
// listener reversing the sync, i.e. scrolling the description list does NOT
// walk the label's own highlight back and forth) -- the original
// prototype's whole-page scroll tracking doesn't translate cleanly onto a
// page where this tool is one section among several, so this keeps the
// simpler, one-directional interaction instead.
export default function NutritionLabelExplorer({ id, title, sx }) {
  const [activeNutrient, setActiveNutrient] = useState(null);
  const [healthCondition, setHealthCondition] = useState('default');
  const itemRefs = useRef({});

  const handleNutrientClick = (nutrientId) => {
    setActiveNutrient(nutrientId);
    itemRefs.current[nutrientId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Caps the LABEL's own height so "health condition selector + label"
  // together always fit within the visible viewport once stuck -- per
  // direct user feedback, an earlier version computed this from fixed
  // constants (HEADER_HEIGHT + BACKLINK_HEIGHT + an assumed selector
  // height), which still let the label's bottom get clipped in practice:
  // that arithmetic silently assumed the scroll pane's own top edge always
  // lands at exactly HEADER_HEIGHT + BACKLINK_HEIGHT, which isn't a safe
  // enough assumption to build a hard cap on. This measures the REAL
  // numbers directly from the rendered page instead -- the scroll pane's
  // actual top (found by walking up from this component's own DOM node
  // until hitting a real scrolling ancestor, not by assuming which page
  // shell it's mounted in) and the selector's own actual rendered height
  // -- so the two can never drift out of sync with reality.
  const asideRef = useRef(null);
  const selectorRef = useRef(null);
  const [labelMaxHeight, setLabelMaxHeight] = useState(null);

  useLayoutEffect(() => {
    function measure() {
      const asideEl = asideRef.current;
      const selectorEl = selectorRef.current;
      if (!asideEl || !selectorEl) return;

      // Below `md`, StickyAsideSection's own sticky positioning is
      // disabled (see that component) and this whole column just stacks
      // in normal flow -- no cap needed there, the page's own scroll
      // already reaches everything. Checking the REAL computed position
      // (rather than duplicating StickyAsideSection's breakpoint as a
      // second hardcoded number here) means the two can never disagree.
      const stickyWrapper = asideEl.parentElement;
      if (!stickyWrapper || getComputedStyle(stickyWrapper).position !== 'sticky') {
        setLabelMaxHeight(null);
        return;
      }

      let scrollAncestor = stickyWrapper.parentElement;
      while (scrollAncestor && !['auto', 'scroll'].includes(getComputedStyle(scrollAncestor).overflowY)) {
        scrollAncestor = scrollAncestor.parentElement;
      }
      if (!scrollAncestor) {
        setLabelMaxHeight(null);
        return;
      }

      // Real bug, caught after the first version of this still clipped the
      // label in practice: this used to compute available space as
      // `window.innerHeight - containerTop - ...`, which silently assumes
      // the scroll pane's own visible bottom edge reaches all the way down
      // to the bottom of the browser window. It doesn't -- `ChapterFooter`
      // (the "Continue to Next Chapter" bar) is a SIBLING of this scroll
      // pane, stacked BELOW it in the same fixed-height column, so it eats
      // real vertical space that was never actually available to anything
      // inside the pane. The pane's own rendered height (flexbox already
      // resolved this correctly when laying out the page: pane gets
      // `flex: 1`, footer gets its own natural height, out of the same
      // shared column) is the right number to measure against instead --
      // no need to separately account for header/backlink/footer heights
      // at all, since they're already excluded from this measurement by
      // construction.
      const paneHeight = scrollAncestor.getBoundingClientRect().height;
      const selectorHeight = selectorEl.getBoundingClientRect().height;
      // The Stack's own `spacing={3}` gap between the selector and the
      // label -- a value this component fully controls (not a guess about
      // an external library's rendering, the way the selector's own height
      // is), so it's safe to hardcode as the known 8px-per-unit MUI default
      // this app uses everywhere (confirmed against layoutConstants.js's
      // own "value * 8 = px" convention) rather than measuring it too.
      const ASIDE_GAP = 3 * 8;
      const available = paneHeight - STICKY_TOP - selectorHeight - ASIDE_GAP - LABEL_BOTTOM_MARGIN;
      setLabelMaxHeight(Math.max(available, LABEL_MIN_HEIGHT));
    }

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const aside = (
    <Stack ref={asideRef} spacing={3} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
      <FormControl ref={selectorRef} size="small" sx={{ width: 260 }}>
        <InputLabel id="health-condition-select-label">Health Condition</InputLabel>
        <Select
          labelId="health-condition-select-label"
          label="Health Condition"
          value={healthCondition}
          onChange={(e) => setHealthCondition(e.target.value)}
        >
          {HEALTH_CONDITIONS.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <NutritionLabelCard
        items={NUTRITION_ITEMS}
        activeNutrient={activeNutrient}
        onNutrientClick={handleNutrientClick}
        maxHeight={labelMaxHeight ?? 'none'}
      />
    </Stack>
  );

  return (
    <StickyAsideSection id={id} title={title} aside={aside} asideWidth={260} sx={sx}>
      {/* Gap BETWEEN each nutrient's whole description block (title row +
          subtitle + body + optional Daily Value box + optional
          TipExample) -- per direct user feedback, bumped from 24px to 40px
          (matching this app's own "List Slot" gap between List Items
          elsewhere) so consecutive nutrients read as more clearly
          separated blocks, not a single dense run of text. */}
      <Stack spacing={5}>
        {NUTRITION_ITEMS.map((item) => {
          const notes = getConditionNotes(item.id, healthCondition);
          const isActive = activeNutrient === item.id;
          return (
            <Box
              key={item.id}
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              onClick={() => handleNutrientClick(item.id)}
              sx={{
                p: isActive ? 2 : 0,
                mx: isActive ? -2 : 0,
                borderRadius: 2,
                bgcolor: isActive ? 'action.selected' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
            >
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography variant="h6">{item.name}</Typography>
                <Stack spacing={0} sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{item.amount}</Typography>
                  {item.dailyValue && (
                    <Typography variant="caption" color="text.secondary">
                      {item.dailyValue} Daily Value
                    </Typography>
                  )}
                </Stack>
              </Stack>
              <Typography variant="subtitle2" sx={{ color: 'primary.dark', mt: 0.5, mb: 1 }}>
                {item.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.details}
              </Typography>

              {/* Restored from the source prototype (dropped in the first
                  pass here) -- a distinct highlighted callout under the
                  details paragraph, not just the inline "X% Daily Value"
                  caption next to the amount above. The original showed
                  daily-value info in both places; this keeps that, just
                  recolored to this app's own `action.hover` tint instead of
                  a literal gray. `dailyValueBasis` (added 2026-09-30, pulled
                  from the updated Figma copy) is the REAL per-nutrient
                  reference amount ("Based on 78 g of total fat...") --
                  replaces the old placeholder line every nutrient repeated
                  verbatim ("Based on a 2,000 calorie diet"), which was
                  accurate but far less specific/useful. */}
              {item.dailyValue && (
                <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5, mt: 1.5 }}>
                  <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Daily Value:
                    </Box>{' '}
                    {item.dailyValue}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.dailyValueBasis}
                  </Typography>
                </Box>
              )}

              {notes.map((note) => (
                <TipExample key={note.title} label={note.title}>
                  {note.content}
                </TipExample>
              ))}
            </Box>
          );
        })}
      </Stack>
    </StickyAsideSection>
  );
}
