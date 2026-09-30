import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import PageTopBar from '../components/PageTopBar';
import ArticleTextIcon from '../components/ArticleTextIcon';
import ModulePreviewCard from '../components/ModulePreviewCard';
import { MODULES } from '../moduleData';
import { useViewedChapters } from '../hooks/useViewedChapters';
import { useSettledWidth } from '../hooks/useSettledWidth';
import { HEADER_HEIGHT, DASHBOARD_CONTENT_PT, DASHBOARD_SHELL_BACKGROUND } from '../layoutConstants';
import { asset } from '../assetPath';

// Finds "the next thing to read" -- the first not-yet-viewed BUILT chapter
// in curriculum order, paired with its own parent module (the "Up Next"
// card needs both: the module for context/thumbnail, the chapter for the
// actual link). Falls back to the very first built chapter if everything
// built so far has already been read. This is the "or which one is next"
// fallback the request explicitly allowed as an alternative to true
// timestamp-based "most recently visited" tracking, which the existing
// useViewedChapters storage (a flat viewed/not-viewed map, no "when") can't
// support without a schema change.
function getNextUp(isViewed) {
  for (const mod of MODULES) {
    const chapter = mod.chapters.find((c) => c.to && !isViewed(c.chapterId));
    if (chapter) return { module: mod, chapter };
  }
  for (const mod of MODULES) {
    const chapter = mod.chapters.find((c) => c.to);
    if (chapter) return { module: mod, chapter };
  }
  return null;
}

// The app's actual front door (route "/"): a splash screen, not the Modules
// list -- that's now reached via the drawer's own "Modules" row instead.
// Still shares the drawer for nav consistency, just swaps the Modules-list
// content column for a hero + headline + intro + one CTA.
// The title's own bottom margin in wide mode (see the title Typography's
// `mb: isNarrow ? 0 : 1` below) -- getBoundingClientRect/ResizeObserver
// don't include an element's own margin, so this has to be added back in by
// hand when summing title+chapter heights into one wide-mode image size.
const TITLE_TO_CHAPTER_GAP = 8;
// Below this measured card width, the wide (image-spans-two-rows) layout no
// longer has room to breathe: card padding (p:3 -> 24px each side = 48px) +
// the image's own clamped minimum (96px) + the column gap (24px) + a
// realistic minimum for the text column itself (~200px before the chapter
// row's icon+label+arrow start crowding) adds up to ~370px, so 420px leaves
// a bit of margin before things get uncomfortably tight. This is checked
// against the CARD's own measured width (useSettledWidth), never a viewport
// media-query breakpoint -- the card's real available width is already
// narrower than the viewport by the content column's own responsive `px`
// gutter (see the page shell below) well before any viewport breakpoint
// would fire. Using a viewport breakpoint here was the actual bug: the
// layout could stay in "wide" mode long after the card itself had shrunk
// too narrow for it, letting the chapter row's content spill out instead of
// stacking in time.
const STACK_BREAKPOINT_PX = 420;
// The module title's own grid column never shrinks narrower than this --
// enough room for a real word or two per line (checked against actual
// module titles in moduleData.js, several 40+ characters long) so it keeps
// wrapping normally instead of degrading into single-character lines below
// that. Below this, the card accepts a small amount of overflow rather than
// destroying legibility to avoid it -- see the "title" grid item's own
// comment for the full reasoning.
const TITLE_MIN_WIDTH = 150;

export default function Home() {
  const { isViewed } = useViewedChapters();
  const nextUp = getNextUp(isViewed);
  const hasProgress = MODULES.some((mod) => mod.chapters.some((c) => c.to && isViewed(c.chapterId)));
  // Only modules AFTER the current one -- per direct user direction, Home
  // is "just the current one and previews of the modules to come", never
  // earlier modules (those already have their own real progress row on the
  // Modules tab; repeating them here would be exactly the "extraneous
  // information" the preview list is meant to avoid).
  const upcomingModules = nextUp ? MODULES.filter((mod) => mod.number > nextUp.module.number) : [];

  // Two independent measurements (title block, "Up Next" chapter card) via
  // ResizeObserver, not one combined block -- resizing the card narrow now
  // reassigns these two blocks to different positions via CSS Grid (see
  // below), so the thumbnail needs a DIFFERENT size depending on which
  // grouping is actually visible: in wide mode it spans title+chapter's
  // combined height (the original design); in narrow mode it shrinks to
  // just the title block's height, sitting beside the module number/title
  // only, with the chapter card dropping to its own full-width row
  // underneath. Measured via JS rather than a CSS percentage-height/
  // aspect-ratio trick, which already proved unreliable for this exact image
  // once before (see the sizing comment further down).
  // `entry.borderBoxSize[0].blockSize`, not `entry.contentRect.height` --
  // measured live: the chapter box has its own 1px border and 24px
  // top/bottom padding, which `contentRect` EXCLUDES entirely (it's the
  // element's inner content area only), understating `chapterHeight` by a
  // full 50px versus the box's real rendered height. That silently threw
  // off every downstream calculation that assumed these two measurements
  // reflected actual visual size (the wide-mode image's own height formula,
  // and therefore its overhang math below) -- confirmed by comparing the
  // formula's predicted overhang against the image's actual measured
  // position, which didn't match until this was fixed. `titleRef`'s own box
  // has no padding/border of its own, so this doesn't change ITS number,
  // but both use the same (correct) measurement now for consistency.
  const titleRef = useRef(null);
  const [titleHeight, setTitleHeight] = useState(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const boxSize = entry.borderBoxSize && entry.borderBoxSize[0];
      setTitleHeight(boxSize ? boxSize.blockSize : entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chapterRef = useRef(null);
  const [chapterHeight, setChapterHeight] = useState(null);
  useEffect(() => {
    const el = chapterRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const boxSize = entry.borderBoxSize && entry.borderBoxSize[0];
      setChapterHeight(boxSize ? boxSize.blockSize : entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The card's OWN rendered width, debounced (see useSettledWidth's own
  // doc) -- this is what decides wide-vs-stacked, not a viewport breakpoint.
  // Deliberately NOT `cardWidth > 0 && cardWidth < STACK_BREAKPOINT_PX` --
  // that extra `> 0` guard was tried first (to treat width:0 as "not yet
  // measured, assume wide") and turned out to be a real bug: when the
  // drawer alone doesn't fit the viewport, the card's content box can
  // measure as a genuine, settled 0 (not "unmeasured"), and treating that
  // as "assume wide" is exactly backwards -- confirmed live via a scripted
  // resize sweep, where the card rendered in WIDE mode with its image
  // overflowing 200+px past the card's own edge at the narrowest widths
  // tested. Comparing plain `cardWidth < STACK_BREAKPOINT_PX` means the
  // brief window before the very first measurement lands (default 0) shows
  // the narrow/stacked layout instead -- a harmless one-frame default in
  // the ordinary case, and the SAFE (non-overflowing) choice in the
  // degenerate case, rather than the unsafe one.
  const [cardRef, cardWidth] = useSettledWidth();
  const isNarrow = cardWidth < STACK_BREAKPOINT_PX;

  // Both sizes are CLAMPED, not just computed -- without a ceiling, this is
  // a genuine feedback loop, not just a one-way measurement: the image's own
  // (square) size determines the grid image column's width, which
  // determines how much width is left for the title/chapter column, which
  // determines how much the title/chapter text wraps, which determines
  // titleHeight/chapterHeight, which feeds back into the image's size. On a
  // narrowing window this can compound every render (less width -> more
  // wrap -> taller text -> bigger image -> even less width for text -> ...)
  // instead of settling, which is what actually caused the image to grow
  // large enough to spill out of the card and overlap surrounding content.
  // A hard min/max stops that spiral cold: once the size hits the ceiling,
  // it can't feed back in any larger, so the loop can't run away regardless
  // of how narrow the card gets.
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  // No added overhang baked into the size anymore -- per direct user
  // direction, the wide-mode thumbnail should be "only as tall as the
  // content next to it" (titleHeight + the real gap + chapterHeight,
  // nothing extra), not taller than that on purpose. The image still reads
  // as having more room above than below, but that's now entirely the
  // CARD's own asymmetric padding (`pt` vs `pb`, clearing the "Dive Back
  // In" badge) doing the work, not the image itself overhanging past its
  // content on either end -- see the card's own `pt` comment below.
  const wideImageSize =
    titleHeight && chapterHeight
      ? clamp(Math.round(titleHeight + TITLE_TO_CHAPTER_GAP + chapterHeight), 96, 220)
      : 160;
  // In narrow mode the image sits in its own grid column beside the text
  // column, so its width directly competes with the text for the card's
  // available space -- confirmed via the same resize sweep: with the
  // chapter row's own text truncated (see below), the image pinned at its
  // normal 120px ceiling was STILL the thing forcing the grid wider than the
  // card at real, non-degenerate widths (~480-630px viewport, not just the
  // already-out-of-scope "drawer alone doesn't fit" zone). `narrowImageMax`
  // shrinks that ceiling to whatever's actually left after the grid gap and
  // the title column's own real minimum (TITLE_MIN_WIDTH -- reusing the SAME
  // constant the title box's `minWidth` uses below, not a separately-guessed
  // number, is what makes this actually consistent: a mismatched smaller
  // guess here was the exact bug that let the grid demand more total width
  // than this formula thought it needed to reserve, overflowing the card
  // even though the image had "given way"). Never below 32 -- a thumbnail
  // smaller than that stops being a recognizable image at all; below that
  // point, this is the same "drawer doesn't fit" territory already accepted
  // as out of scope.
  const CARD_INNER_PADDING_PX = 48; // p: 3 on each side
  const GRID_GAP_PX = 24; // columnGap: 3
  const narrowImageMax =
    cardWidth > 0
      ? clamp(cardWidth - CARD_INNER_PADDING_PX - GRID_GAP_PX - TITLE_MIN_WIDTH, 32, 120)
      : 120;
  // Floor dropped from an earlier 56 (a "still looks like a photo" minimum)
  // to 32, matching narrowImageMax's own floor -- per direct user feedback,
  // once stacked the thumbnail should read as small, roughly matching the
  // text block's own height, not be held to an artificial larger minimum.
  const narrowImageSize = titleHeight ? clamp(Math.round(titleHeight), 32, narrowImageMax) : 40;
  // Below this, even a fully-shrunk image (down to its own 32px absolute
  // floor above) and tightened gaps/padding (see the chapter row's `gap`/
  // `pl`/`pr` below) aren't enough -- the trailing arrow icon's own fixed
  // 24px glyph size is what's left forcing a few px of overflow (confirmed
  // via the same resize sweep: at a 104px card width, every other element
  // fit, only the arrow's own <svg> still stuck out). Dropping the arrow
  // specifically (not the leading content-type icon, which is the more
  // essential piece) is the last, smallest possible concession -- it's a
  // decorative affordance, not identifying content. `cardWidth === 0`
  // (not yet measured) defaults to showing it, matching every other
  // "assume the comfortable case until proven otherwise" default above.
  const showChapterArrow = cardWidth === 0 || cardWidth >= 150;
  // Border-radius scales WITH the image's own current size instead of
  // staying a flat 12px (1.5) always -- per direct user feedback, a fixed
  // 12px radius reads fine on a 150-220px wide-mode image (a modest ~6-8%
  // of its size) but looks disproportionately circular once the thumbnail
  // shrinks down toward its new, smaller narrow-mode floor (12px is 37% of
  // a 32px image). 12% of the current size, clamped to the same 4-12px
  // range the two modes actually span, keeps the rounding looking
  // proportionate at every size instead of just picking one number that
  // only works for one end of the range.
  const currentImageSize = isNarrow ? narrowImageSize : wideImageSize;
  const imageBorderRadius = clamp(Math.round(currentImageSize * 0.12), 4, 12);

  // The hero row: side-by-side (photo left, text right) vs stacked (photo
  // full-width on top, text below) is decided by measurement, NOT a
  // viewport breakpoint -- the exact same class of bug already fixed for
  // the "Up Next" card applies here too: whether the headline+intro fit
  // beside a fixed-height photo depends on how much text there actually is
  // and how wide the CONTENT COLUMN is (which is narrower than the
  // viewport by the drawer's own width), not on the raw viewport size.
  //
  // The tricky part: deciding whether to stack requires knowing how tall
  // the text would be AT the side-by-side width -- but if stacked, the
  // text isn't rendered at that width at all, so measuring the visible
  // text directly can't answer "should we switch back to side-by-side".
  // Solved with a HIDDEN probe: an invisible, out-of-flow copy of the exact
  // same heading+intro text, permanently held at the side-by-side text
  // column's own width (a simple function of the row's measured width, not
  // of our own layout choice), so its measured height has no feedback loop
  // and can safely decide "would this fit beside the photo" every time the
  // row resizes, regardless of which mode is currently showing.
  const HERO_PHOTO_HEIGHT = 300; // fixed -- explicitly does NOT scale with width, per direct user direction
  const HERO_PHOTO_FRACTION = 0.45; // side-by-side photo width, matches the original aspect-ratio-based sizing
  const HERO_GAP_PX = 40; // gap: 5
  const [heroRowRef, heroRowWidth] = useSettledWidth();
  const heroProbeRef = useRef(null);
  const [heroTextProbeHeight, setHeroTextProbeHeight] = useState(0);
  useEffect(() => {
    const el = heroProbeRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const boxSize = entry.borderBoxSize && entry.borderBoxSize[0];
      setHeroTextProbeHeight(boxSize ? boxSize.blockSize : entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const heroSideBySideTextWidth = heroRowWidth > 0 ? Math.max(0, heroRowWidth * (1 - HERO_PHOTO_FRACTION) - HERO_GAP_PX) : 0;
  // `heroRowWidth > 0` guards the same "not yet measured" default-to-
  // comfortable-case pattern used everywhere else in this file -- assume
  // side-by-side (the more common case at normal widths) until proven
  // otherwise, rather than a guaranteed-wrong guess either way.
  const isHeroStacked = heroRowWidth > 0 && heroTextProbeHeight > HERO_PHOTO_HEIGHT;

  // `compact` shrinks the heading/intro one step down -- used ONLY for the
  // actually-visible text once stacked (full-width, photo now above rather
  // than beside it, so the extra room the smaller side-by-side column used
  // to need for text is gone; per direct user direction, both lines should
  // read smaller once they've dropped underneath the photo, not stay at
  // their side-by-side size). The PROBE below deliberately always renders
  // at `compact=false` (full size) regardless of the current layout -- it
  // exists purely to answer "would the FULL-SIZE text fit beside the photo
  // at this width", which is what actually decides `isHeroStacked` in the
  // first place. If the probe shrank too, the decision would create its own
  // feedback loop (shrinking because stacked -> now fits beside the photo
  // after all -> un-stacks -> back to full size -> too tall again -> re-
  // stacks -> ...); keeping the probe at a fixed size breaks that loop, the
  // same way the "Up Next" card's own measurement-vs-clamp bugs were fixed
  // above.
  function renderHeroText(compact) {
    return (
      <>
        <Typography variant="h1" sx={{ mb: 2, fontSize: compact ? '1.5rem' : undefined }}>
          Welcome to Your Nutrition Journey
        </Typography>
        <Typography sx={{ fontSize: compact ? 16 : 18, color: 'text.secondary' }}>
          NEST brings together practical nutrition guidance, meal planning tools, and caregiver support in one place.
          Work through the modules at your own pace, whenever you're ready.
        </Typography>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: `calc(100vh - ${HEADER_HEIGHT}px)`, background: DASHBOARD_SHELL_BACKGROUND }}>
      <PageTopBar />

      {/* Used to share this row with a permanently-visible DashboardDrawer;
          that nav now lives inside PageTopBar's own NestNavSwitcher dropdown
          instead (see NestNavSwitcher.jsx), so the content column runs the
          full row width on its own -- no more side-by-side drawer+content
          split here. `px` still grows at wider breakpoints so the (centered,
          max-width) content column keeps a real minimum gutter from the true
          viewport edge, instead of relying solely on the Container's own
          auto-margin. */}
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', px: { xs: 2, md: 3, xl: 6 } }}>
          <Container maxWidth="md" sx={{ pt: DASHBOARD_CONTENT_PT, pb: 6 }}>
          {/* The hero photo sits beside the headline/intro (photo narrower,
              text taking the rest of the row) UNLESS the text, measured at
              that side-by-side width via the hidden probe below, would be
              taller than the photo's own fixed height -- then it falls back
              to the full-width-photo-on-top, text-below layout instead.
              Decided by `isHeroStacked` (a real measurement), not a
              viewport breakpoint -- see that constant's own comment. The
              photo's height (`HERO_PHOTO_HEIGHT`) is the SAME fixed value
              in both layouts; only its WIDTH changes (45% vs 100%), so it
              never scales proportionally, per direct user direction. */}
          <Box
            ref={heroRowRef}
            sx={{
              display: 'flex',
              flexDirection: isHeroStacked ? 'column' : 'row',
              alignItems: isHeroStacked ? 'stretch' : 'center',
              gap: isHeroStacked ? 3 : `${HERO_GAP_PX}px`,
              mb: 8,
            }}
          >
            {/* Real photo -- dropped into public/images/home/hero.jpg.
                Fixed height always; `objectFit: 'cover'` handles the crop
                as width changes between the two layouts instead of an
                aspect-ratio that would otherwise change the photo's own
                proportions (and therefore effectively its height) between
                them. */}
            <Box
              component="img"
              src={asset('/images/home/hero.jpg')}
              alt="A person writing a grocery list at a kitchen counter surrounded by fresh produce"
              sx={{
                width: isHeroStacked ? '100%' : `${HERO_PHOTO_FRACTION * 100}%`,
                height: HERO_PHOTO_HEIGHT,
                flexShrink: 0,
                borderRadius: 2,
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <Box sx={{ minWidth: 0 }}>{renderHeroText(isHeroStacked)}</Box>
          </Box>

          {/* Hidden measurement probe -- an out-of-flow, invisible copy of
              the exact same heading+intro text, permanently held at the
              side-by-side text column's own width (`heroSideBySideTextWidth`,
              a plain function of the row's measured width). Its height
              answers "would this text fit beside the photo" regardless of
              which layout is actually showing right now -- measuring the
              VISIBLE text instead would only tell us how tall it is at
              whatever width it's CURRENTLY rendered at, which can't decide
              whether to switch back to side-by-side once already stacked
              (a real feedback loop, not just a hypothetical one -- the
              same class of bug the "Up Next" card's own image-vs-text
              sizing already ran into once). */}
          <Box
            ref={heroProbeRef}
            aria-hidden="true"
            sx={{
              position: 'absolute',
              visibility: 'hidden',
              pointerEvents: 'none',
              width: heroSideBySideTextWidth || 1,
              top: 0,
              left: -99999,
            }}
          >
            {renderHeroText(false)}
          </Box>

          {nextUp ? (
          <>
            {/* Same big module-card-style CTA (thumbnail + module title +
            // "Up Next" chapter row) for BOTH a new learner and a returning
            // one -- only the overhanging badge's label and destination
            // change. `getNextUp` already resolves to "the very first built
            // chapter in curriculum order" when nothing has been viewed yet
            // (its own first loop finds the first chapter matching
            // `!isViewed`, which is trivially every chapter when the viewed
            // map is empty), so no separate "first chapter" lookup is
            // needed here -- reusing `nextUp` for both cases keeps them
            // structurally identical, matching the direct request that a
            // new learner get "the same 'up next' card as before". Topped
            // with a small badge that overhangs the card's own top-left
            // edge -- same pattern as TipExample's overlapping "type"
            // badge, just re-colored to this page's own palette instead of
            // copying Tip-Example's yellow.
            // The module thumbnail is a SQUARE, sized to EXACTLY match the
            // right-hand content column's own measured height (title +
            // chapter combined, no added overhang) rather than a fixed
            // guess -- bigger than ModuleProgressRow's own fixed 96px
            // square, but the same 1:1 shape. The inset "Up Next" row
            // mirrors ChapterMenuItem/ModuleProgressRow's chapter-row
            // language (content-type icon, caption label, subtitle title,
            // "not yet viewed" dot) using plain Boxes with an explicit,
            // equal icon<->text gap and left padding, rather than
            // ListItemIcon/ListItemText's own implicit spacing.
            // `pt: 5` (not the card's own `p: 3` on every other side) --
            // deliberately MORE than `pb` (which stays the plain `p: 3`
            // value), so the card reads as having more breathing room
            // above than below. Per direct user direction, this asymmetry
            // is now the CARD's job, not the image's: the thumbnail itself
            // is flush top-and-bottom with the title/chapter content next
            // to it (no overhang baked into its own size or position, see
            // `wideImageSize`/`mt` below) -- the "more room above, to
            // account for the badge" look comes entirely from this padding
            // difference. Re-measure/adjust this value directly if the
            // badge's own size or position ever changes; there's no
            // formula tying the two together on purpose (padding is a
            // flat card-level choice, independent of the image). */}
            <Box ref={cardRef} sx={{ position: 'relative', p: 3, pt: 3.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ position: 'absolute', top: -12, left: 20, bgcolor: 'primary.dark', color: '#fff', borderRadius: 1, px: 1, py: 0.5 }}>
                <Typography sx={{ fontFamily: '"Noto Sans", sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {hasProgress ? 'Dive Back In' : 'Get Started'}
                </Typography>
              </Box>

              {/* CSS Grid, not flex -- the same three grid items (image /
                  title / chapter) just get reassigned to different
                  `gridTemplateAreas` positions based on `isNarrow` (the
                  CARD's own measured width, see STACK_BREAKPOINT_PX above),
                  with no markup duplication and no reparenting: wide,
                  "image" spans both rows (the original tall-thumbnail
                  design, beside title+chapter's combined height); narrow,
                  "image" sits only beside "title" in row 1, and "chapter"
                  drops to its own full-width row 2. The thumbnail's size is
                  still MEASURED (wideImageSize/narrowImageSize, from each
                  block's real rendered height via ResizeObserver), not left
                  to a CSS percentage-height/stretch trick -- that already
                  proved unreliable for this exact image once before (a flex
                  item's `height: '100%'` combined with aspect-ratio on an
                  <img> fell back to the source photo's raw intrinsic pixel
                  size instead of the intended stretch, rendering enormous).
                  A concrete measured pixel value can't have that ambiguity.
                  `minWidth: 0` on "chapter" (below) is what lets IT shrink
                  freely; "title" instead gets an explicit `TITLE_MIN_WIDTH`
                  floor (see that Box's own comment) so its text keeps
                  wrapping normally instead of degrading into unreadable
                  single-character lines once the column gets narrower than
                  even one word. `overflowX: 'auto'` is the safety net for
                  what happens once the card is narrower than everything
                  ELSE can shrink to accommodate (image at its own 32px
                  floor, arrow already hidden, chapter text truncated) --
                  confirmed via `scrollWidth` vs `clientWidth` live: without
                  this, the excess visibly pokes the chapter chip out past
                  the card's own right border instead of scrolling inside
                  it, the same failure mode ComparisonTable.jsx already
                  solves the same way elsewhere in this app. Only applied in
                  NARROW mode (`isNarrow`), never wide -- kept this way even
                  though the wide-mode image no longer overhangs (it's
                  flush now, see `mt` below): setting `overflow-x` to
                  anything but `visible` forces the browser to also compute
                  `overflow-y` as `auto` (per the CSS overflow spec,
                  whenever one axis isn't `visible` the other can't stay
                  `visible` either) -- harmless today since nothing
                  overhangs in wide mode to clip, but scoping it to narrow
                  mode only is still the safer default against a future
                  wide-mode change re-introducing an overhang. */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gridTemplateAreas: isNarrow ? `"image title" "chapter chapter"` : `"image title" "image chapter"`,
                  columnGap: 3,
                  rowGap: isNarrow ? 2 : 0,
                  overflowX: isNarrow ? 'auto' : 'visible',
                  // No transition here -- `gridTemplateColumns` never
                  // actually changes value (always 'auto 1fr'; it's
                  // `gridTemplateAreas` that switches), and CSS transitions
                  // don't apply to `grid-template-areas` in the first place,
                  // so a transition on this property was dead weight that
                  // did nothing but was easy to mistake for "the layout
                  // switch animates" (see the image's own removed
                  // transition for why that assumption is actively unsafe
                  // here).
                }}
              >
                <Box
                  component="img"
                  src={nextUp.module.thumbSrc}
                  alt=""
                  sx={{
                    gridArea: 'image',
                    width: isNarrow ? narrowImageSize : wideImageSize,
                    height: isNarrow ? narrowImageSize : wideImageSize,
                    // No margin -- per direct user direction, the image is
                    // no longer meant to overhang past the title/chapter
                    // content on either end (that's what `wideImageSize`
                    // dropping its old `+ IMAGE_OVERHANG * 2` means too):
                    // flush top AND bottom with the content beside it,
                    // full stop. The "more room above" look comes entirely
                    // from the card's own `pt` vs `pb` now (see the card's
                    // own comment), not from this image reaching up past
                    // its own content the way it used to.
                    mt: 0,
                    borderRadius: `${imageBorderRadius}px`,
                    objectFit: 'cover',
                    display: 'block',
                    // Deliberately NO transition on width/height/margin-top --
                    // one was added here for a smoother visual snap between
                    // sizes, but it caused a real, reproducible bug: a CSS
                    // transition on width/height makes the browser report a
                    // genuinely different box size on every animation frame
                    // for its whole 200ms duration, and `ResizeObserver`
                    // fires on each of those -- which kept resetting
                    // `useSettledWidth`'s own 200ms debounce for `cardWidth`
                    // (the thing that decides `isNarrow` in the first
                    // place). Confirmed live via a scripted resize
                    // sequence: with the transition, resizing wide then
                    // immediately back narrow could leave the card stuck in
                    // WIDE mode for 1000ms+ instead of the intended ~200ms
                    // (occasionally longer than any reasonable settle
                    // window a real user would wait through mid-resize);
                    // removing the transition made every repeated resize in
                    // the same test settle within ~300-400ms, consistently.
                    // The layout still changes instantly, just without the
                    // animated snap -- a real, user-visible correctness bug
                    // is a worse trade than losing that polish.
                  }}
                />
                {/* `minWidth: TITLE_MIN_WIDTH`, not 0 -- this is the actual,
                    corrected fix for "the chapter inset module has no
                    minimum width". `overflowWrap: 'anywhere'` was tried
                    first (letting a browser break within a word to avoid
                    forcing the column wider) and DID eliminate the overflow,
                    but at real narrow widths it let the module title
                    collapse into an unreadable single-character-per-line
                    "ladder" once the column got narrower than even one
                    letter's comfortable width -- confirmed visually via
                    screenshots at the same widths the resize sweep was
                    testing. Zero pixel overflow isn't actually the goal if
                    the text becomes illegible getting there. A real,
                    explicit minWidth is the correct fix: the module title
                    keeps wrapping normally (word by word) down to
                    TITLE_MIN_WIDTH, and only below THAT does the card accept
                    a small, bounded amount of overflow -- the same
                    "irreducible floor" tradeoff already accepted for the
                    chapter row's own icon/arrow, not a new one. */}
                {/* `alignSelf: 'start'` -- without it, a grid item with no
                    explicit height defaults to `align-self: stretch`, so in
                    wide mode (where "image" spans both rows) this box
                    stretches to fill whatever height the ROW ends up at --
                    and since `wideImageSize` is computed FROM this box's
                    own measured height, a stretched (inflated) height feeds
                    back into a bigger image, which needs a taller row,
                    which stretches this box even MORE. A real, confirmed
                    feedback loop (measured live: it stabilized at the
                    image's 220px clamp ceiling instead of the correct
                    ~140-180px), not the same one `clamp()` already guards
                    against elsewhere -- that one was about the image's
                    WIDTH competing with text WIDTH; this one is the image's
                    HEIGHT computed FROM a box whose height the image itself
                    ends up influencing via row-stretch. `alignSelf: 'start'`
                    keeps this box at its own natural content height always,
                    which is what `titleHeight` needs to mean for the
                    formula to be self-consistent. */}
                <Box ref={titleRef} sx={{ gridArea: 'title', minWidth: TITLE_MIN_WIDTH, alignSelf: 'start' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Module {nextUp.module.number}
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'text.primary', mb: isNarrow ? 0 : 1 }}>
                    {nextUp.module.title}
                  </Typography>
                </Box>

                {/* Icon<->text gap (gap: 2) and the row's own left padding
                    (pl: 2) are the SAME explicit value per direct user
                    direction, instead of relying on ListItemIcon's
                    implicit minWidth-driven spacing (which doesn't
                    guarantee the two are equal, or even give a precise,
                    known gap value in the first place). The dot anchors to
                    the icon's own top-right corner (top/right: -2) rather
                    than a hardcoded left offset, so it stays correctly
                    placed regardless of the icon's own rendered size. */}
                <Box
                  ref={chapterRef}
                  component={Link}
                  to={nextUp.chapter.to}
                  sx={{
                    gridArea: 'chapter',
                    // Same `alignSelf: 'start'` fix as "title" above, and
                    // for the same reason -- this box's own measured height
                    // feeds `wideImageSize` too, so it can't be allowed to
                    // stretch to fill a row height that the image itself
                    // (computed from this measurement) ends up dictating.
                    alignSelf: 'start',
                    display: 'flex',
                    alignItems: 'center',
                    // Still the SAME value for gap and pl/pr as each other
                    // (the original "left padding as large as the icon<->
                    // text gap" requirement) -- just a smaller shared value
                    // in narrow mode, reclaiming a little more room for the
                    // icon/arrow/text at genuinely tight widths, confirmed
                    // via the same resize sweep as the fixes above.
                    gap: isNarrow ? 1.25 : 2,
                    minWidth: 0,
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    py: 1.5,
                    pl: isNarrow ? 1.25 : 2,
                    pr: isNarrow ? 1.25 : 2,
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
                    <ArticleTextIcon fontSize="small" sx={{ color: '#a69889' }} />
                    {!isViewed(nextUp.chapter.chapterId) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          border: '1.5px solid',
                          borderColor: 'background.default',
                        }}
                      />
                    )}
                  </Box>
                  {/* Truncated to one line each (nowrap + ellipsis), not
                      left to wrap -- this is the actual fix for "the
                      chapter inset module has no minimum width": WITHOUT
                      this, a long chapter label/title's own min-content
                      width (the widest word it can't break on wrapping) is
                      a REAL, unavoidable floor (measured ~144px live, via a
                      scripted resize sweep, regardless of `minWidth: 0` on
                      every ancestor) -- `minWidth: 0` only lets a box shrink
                      down to its content's min-content size, and wrapped
                      text's min-content is never 0. An ellipsis-truncated
                      line's min-content IS effectively 0 (a browser can
                      always render just "…"), so this is what actually lets
                      the module keep shrinking instead of forcing the grid
                      column -- and the whole card -- wider than the space
                      available and overflowing. The module TITLE (h3, the
                      sibling grid area above) is deliberately NOT truncated
                      this way -- it's the more prominent element, its own
                      wrap-floor is smaller anyway (no icon/arrow/padding
                      overhead competing for the same row), and cutting a
                      whole heading down to one ellipsized line reads far
                      worse than a small chip's incidental subtitle doing
                      the same. */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {nextUp.chapter.label}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {nextUp.chapter.title}
                    </Typography>
                  </Box>
                  {showChapterArrow && <ArrowForwardRoundedIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />}
                </Box>
              </Box>
            </Box>

            {upcomingModules.length > 0 && (
              // "Coming Up" preview list -- modules strictly AFTER the
              // current one, never earlier ones (see `upcomingModules`'s
              // own comment above). Deliberately thin: no progress bar, no
              // chapter count, no expand affordance -- that's what
              // ModuleProgressRow is for, and it already lives on the
              // Modules tab. This is meant to read as "here's what's
              // ahead", not a second copy of the real modules list.
              //
              // One Tooltip wraps the WHOLE bordered section, not each
              // card individually -- per direct user direction, repeating
              // the identical "why is this dimmed" explanation on every
              // single preview card was noise; it only needs to be said
              // once for the section as a whole. The border + subtle hover
              // background is what makes the section itself read as one
              // hoverable unit (matching the "Up Next" card's own bordered
              // language above it), rather than a bare list of dimmed rows
              // with no visual container.
              <Tooltip title="These modules unlock as you complete the ones before them" arrow placement="top">
                <Box
                  sx={{
                    mt: 4,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Coming Up
                  </Typography>
                  <Stack spacing={0.5}>
                    {upcomingModules.map((mod) => (
                      <ModulePreviewCard key={mod.number} moduleNumber={mod.number} title={mod.title} thumbSrc={mod.thumbSrc} />
                    ))}
                  </Stack>
                </Box>
              </Tooltip>
            )}
          </>
          ) : (
            <Button
              component={Link}
              to={nextUp ? nextUp.chapter.to : '/dashboard'}
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Dive In
            </Button>
          )}
          </Container>
      </Box>
    </Box>
  );
}
