import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NutritionLabelCard, { LabelAnnotation, AnnotationBadge } from './NutritionLabelCard';
import { NUTRITION_ITEMS } from '../nutritionLabelData';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

// Mirrors Figma's "Annotated Nutrition Facts Label (custom — not a library
// component)" on Mod-4-Ch-1: a static FDA sample label with four numbered,
// outlined regions and matching callouts. Reuses NutritionLabelCard (the
// Module 1 explorer's label) in its static mode rather than redrawing the
// label, so both chapters show the same FDA sample. The ingredients block
// is generic grey bars, as in Figma, since its placement varies by package.
// Figma draws leader lines from each region to its callout; here the
// numbers do that job, so the callouts can stack below the label on narrow
// screens.
const INK = '#1a1a1a';

const CALLOUTS = [
  { title: 'Serving Size', body: 'Listed at the top, with the number of servings per container. All amounts below are per serving.' },
  { title: 'Calories per Serving', body: 'Large and bolded near the top, so it’s quick to find.' },
  { title: 'Nutrient Breakdown', body: 'The amount of each nutrient per serving.' },
  {
    title: 'Ingredients & Allergens',
    body: 'Typically next to or below the nutrition facts. Ingredients are listed in order of amount by weight, and common allergens are listed as well.',
  },
];

// The explorer's data says "8 per container" (its row label supplies
// "Servings"); a printed label reads "8 servings per container", as Figma does.
const LABEL_ITEMS = NUTRITION_ITEMS.map((item) => (item.id === 'servings' ? { ...item, amount: '8 servings per container' } : item));

function Bar({ width }) {
  return <Box sx={{ height: 6, width, borderRadius: 3, bgcolor: 'divider', mt: 0.75 }} />;
}

function IngredientsBlock() {
  const label = { fontSize: 11, fontWeight: 700, color: INK, fontFamily: '"Roboto", sans-serif' };
  return (
    <Box sx={{ width: 260, bgcolor: '#fff', border: `1.5px solid ${INK}`, borderRadius: 1, p: 1.5 }}>
      <Typography sx={label}>INGREDIENTS:</Typography>
      <Bar width="100%" />
      <Bar width="100%" />
      <Bar width="60%" />
      <Typography sx={{ ...label, mt: 1.5 }}>CONTAINS:</Typography>
      <Bar width="70%" />
    </Box>
  );
}

export default function AnnotatedNutritionLabel() {
  // Fade-in-on-scroll Rule 2/3: a substantial standalone visual block.
  const [ref, visible] = useRevealOnScroll();
  return (
    <Box
      ref={ref}
      component="figure"
      sx={{
        m: 0,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        ...revealSx(visible),
      }}
    >
      <Typography variant="h6" component="figcaption" sx={{ mb: 3 }}>
        How to Read a Nutrition Facts Label
      </Typography>
      {/* Side by side only at `lg`: breakpoints key off the window, and the
          sidebar makes the content column far narrower than the window. */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ alignItems: { xs: 'center', lg: 'flex-start' } }}>
        <Stack spacing={3} sx={{ flexShrink: 0, pt: 1 }}>
          <NutritionLabelCard items={LABEL_ITEMS} annotations={{ servings: 1, calories: 2, nutrients: 3 }} />
          <LabelAnnotation number={4}>
            <IngredientsBlock />
          </LabelAnnotation>
        </Stack>
        <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {CALLOUTS.map((c, i) => (
            <Stack key={c.title} component="li" direction="row" spacing={1.5}>
              <AnnotationBadge number={i + 1} sx={{ mt: 0.25 }} />
              <Box>
                <Typography variant="subtitle2" component="p">
                  {c.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.body}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Example label: FDA sample values for one serving. Ingredients and allergen lines are shown generically, since
        their placement varies by package.
      </Typography>
    </Box>
  );
}
