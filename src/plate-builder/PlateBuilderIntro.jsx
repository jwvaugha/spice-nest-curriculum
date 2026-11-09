import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Section from '../components/Section';
import SectionDivider from '../components/SectionDivider';
import NumberedList from '../components/NumberedList';
import NumberedListItem from '../components/NumberedListItem';
import { spiceTokens } from '../theme';
import PlateView from './PlateView';
import { FoodArt } from './FoodTray';
import { ALL_CHALLENGES, LEVELS, LEVEL_1_FOODS, GAME_DISCLAIMER } from './plateBuilderData';

const BORDER_LIGHT = '#e9dbc6';
// The D0 hero plate: salmon, two broccoli, quinoa and avocado (Level 1's
// versions of those foods).
const EXAMPLE_PLATE = { 'baked-salmon': 1, broccoli: 2, quinoa: 1, avocado: 1 };

// Flag in the project's ContentUnderReview style (dashed orange): the
// Figma annotation itself says this content still needs RDN review.
function ReviewFlag() {
  return (
    <Box sx={{ border: '1px dashed', borderColor: '#bd5116', borderRadius: 1, bgcolor: '#fff8ee', p: 2, mb: 4 }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', color: '#924511', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75 }}>
        Test build · Content under review
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: '#924511' }}>
        This page isn't linked from anywhere in the app. Level 1&apos;s scenarios come from the team&apos;s scenario
        document, with foods from USDA FoodData Central. Level 2&apos;s foods and challenges come from the Figma Make
        prototype. None of it has been reviewed by a registered dietitian yet. Colored shapes stand in for the food art.
      </Typography>
    </Box>
  );
}

// The scenario doc's "General Disclaimer (Display Before Gameplay)",
// shown above the Start button so it's read before the first challenge.
function Disclaimer() {
  return (
    <Box sx={{ border: '1px solid', borderColor: BORDER_LIGHT, borderRadius: 2, bgcolor: spiceTokens.neutralA[25], p: 2 }}>
      <Typography variant="h6" component="p" sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.75 }}>
        Before you play
      </Typography>
      <Typography variant="body2">{GAME_DISCLAIMER}</Typography>
    </Box>
  );
}

// `index` is into ALL_CHALLENGES; the card label uses the in-level number.
function ChallengeCard({ challenge, index, state, onStart }) {
  const locked = state === 'locked';
  const chip = { next: 'Up next', locked: 'Locked', done: 'Completed' }[state];
  return (
    <ButtonBase
      disabled={locked}
      onClick={() => onStart(index)}
      aria-label={`Level ${challenge.level.number}, challenge ${challenge.levelIndex + 1}: ${challenge.name}. ${chip}`}
      sx={{
        flex: '1 1 160px',
        minWidth: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        gap: 1,
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: locked ? spiceTokens.neutralA[25] : 'common.white',
        '&:hover': locked ? {} : { borderColor: 'primary.main' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      <FoodArt category={challenge.art} size={48} />
      <Typography variant="h6" component="span" sx={{ color: locked ? 'text.secondary' : spiceTokens.orange[900] }}>
        Challenge {challenge.levelIndex + 1}
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 }}>{challenge.name}</Typography>
      <Chip
        size="small"
        variant="outlined"
        label={chip}
        sx={{
          fontSize: '0.8125rem',
          borderColor: state === 'next' ? 'primary.main' : state === 'done' ? 'rgba(46,125,50,0.5)' : BORDER_LIGHT,
          color: state === 'next' ? 'primary.main' : state === 'done' ? '#43a047' : 'text.primary',
        }}
      />
    </ButtonBase>
  );
}

// D0: the intro before the first challenge. A challenge unlocks once the
// one before it has been submitted, across levels (Level 2 opens after
// Level 1's last challenge).
export default function PlateBuilderIntro({ completed, onStart, stacked }) {
  const nextIndex = ALL_CHALLENGES.findIndex((c) => !completed.has(c.id));
  const allDone = nextIndex === -1;
  const next = ALL_CHALLENGES[nextIndex];
  const stateFor = (i) => {
    if (completed.has(ALL_CHALLENGES[i].id)) return 'done';
    if (i === nextIndex) return 'next';
    return 'locked';
  };

  return (
    <>
      <ReviewFlag />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: stacked ? 'column-reverse' : 'row', pb: 4 }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <Typography variant="h6" component="p" sx={{ color: spiceTokens.orange[900] }}>Interactive · Module 1</Typography>
          <Typography variant="h1">Plate Builder</Typography>
          <Typography variant="body1">
            Build a meal one food at a time and see how it measures up. Each challenge sets a different goal, like an
            energizing breakfast or a plate that helps keep blood sugar steady. Your plate&apos;s nutrition updates as you
            go, using the same numbers you&apos;ll find on a Nutrition Facts label.
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            label={`${LEVELS.length} levels · ${ALL_CHALLENGES.length} challenges`}
            sx={{ borderColor: BORDER_LIGHT, fontSize: '0.8125rem' }}
          />
          <Disclaimer />
          <Button variant="contained" size="large" disableElevation onClick={() => onStart(allDone ? 0 : nextIndex)}>
            {allDone ? 'Play Again' : `Start Level ${next.level.number}, Challenge ${next.levelIndex + 1}`}
          </Button>
        </Box>
        <PlateView size={260} plate={EXAMPLE_PLATE} foods={LEVEL_1_FOODS} />
      </Box>

      <SectionDivider />
      <Section id="how-to-play" title="How to play">
        <NumberedList>
          <NumberedListItem number={1} title="Read your challenge">
            Each round names a goal and shows the targets your plate should reach.
          </NumberedListItem>
          <NumberedListItem number={2} title="Tap foods to build your plate">
            Tap a food in the tray to add a serving. Tap a food on your plate to change servings or take it off.
          </NumberedListItem>
          <NumberedListItem number={3} title="Check the numbers, then submit">
            Watch the targets fill in, or switch to the label view to see the same numbers as a Nutrition Facts label.
            Submit when you’re ready.
          </NumberedListItem>
        </NumberedList>
      </Section>

      {LEVELS.map((level) => (
        <Box key={level.id}>
          <SectionDivider />
          <Section id={level.id} title={`Level ${level.number}: ${level.name}`}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {ALL_CHALLENGES.map((c, i) =>
                c.level === level ? <ChallengeCard key={c.id} challenge={c} index={i} state={stateFor(i)} onStart={onStart} /> : null,
              )}
            </Box>
          </Section>
        </Box>
      ))}
    </>
  );
}
