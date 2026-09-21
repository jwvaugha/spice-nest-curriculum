// Shared sticky-offset math. GlobalHeader and DashboardBackLink are both
// sticky (stacked at the top of the viewport); anything else that's sticky
// further down the page (Sidebar, DashboardDrawer) needs to offset its own
// `top` past whichever of these bars are present above it, or it slides
// underneath them as the page scrolls instead of stopping below them.
export const HEADER_HEIGHT = 64; // GlobalHeader's AppBar toolbar height
export const BACKLINK_HEIGHT = 48; // DashboardBackLink bar height (chapter pages only)

// Cascading content widths (all centered on the same axis, widest to
// narrowest) — deliberately NOT one single column for everything below the
// hero. Per user direction: photos should read a bit narrower than the hero
// image, and body text narrower still, so the page has a "stepped" rhythm
// instead of one rigid column both text and photos are squeezed into.
//
// HERO_WIDTH is the outer canvas's own maxWidth, not the hero image's
// rendered width — the canvas carries 32px of horizontal padding on each
// side (see the page shells' `px: 4`), so the hero image itself actually
// renders at HERO_WIDTH - 64. PHOTO_MAX_WIDTH/TEXT_MAX_WIDTH are sized
// against THAT effective width (808px), not the nominal 872 — otherwise a
// "800" photo cap is only 8px narrower than the hero and reads as identical.
export const HERO_WIDTH = 872; // outer canvas maxWidth; hero image itself renders at HERO_WIDTH - 64 = 808
export const PHOTO_MAX_WIDTH = 720; // body photos (NumberedListItem, MythFactCard) — clearly narrower than the ~808px hero image
export const TEXT_MAX_WIDTH = 600; // paragraphs/headings/lists — the narrowest, most readable column

// The CSS transition applied to the content canvas's `width` AND `padding`
// (see useSettledWidth.js). The debounce itself makes the canvas hold still
// during an active drag and only commit a new width once resizing settles
// — this transition is what makes that commit visibly animate into place
// instead of snapping instantly to the new size.
export const RESIZE_TRANSITION = 'width 0.35s ease, padding 0.35s ease';

// Content canvas's own horizontal padding — the margin between the chapter
// content column and the content panel's own left/right edges (the panel
// being the area right of the module sidebar, above the chapter footer).
// BASE_PADDING_X applies while the panel is wide enough for the canvas to
// sit at its full HERO_WIDTH with room to spare. Once the panel itself
// (measured via useSettledWidth, NOT a global CSS breakpoint — the panel is
// already narrower than the viewport by the sidebar's width, so a
// viewport-keyed breakpoint fires at the wrong moment) is narrower than
// HERO_WIDTH, the canvas is no longer capped by its max-width and is
// actively shrinking to fit — that's exactly the moment more breathing
// room is wanted, so the margin steps up to NARROW_PADDING_X instead of
// leaving content to run right up to the panel's own edges as it shrinks.
export const BASE_PADDING_X = 4; // 32px
export const NARROW_PADDING_X = 6; // 48px

export function getContentPaddingX(panelWidth) {
  return panelWidth && panelWidth < HERO_WIDTH ? NARROW_PADDING_X : BASE_PADDING_X;
}

// Figma "slot" gap values — swept directly off the real component
// definitions on the Nest V2 library page (itemSpacing/padding read via the
// Plugin API on the actual components, not eyeballed from a screenshot or
// copied from one instance's possibly-overridden geometry). These are the
// single source of truth for every content-spacing decision in
// Section.jsx/NumberedList.jsx/NumberedListItem.jsx — a page should never
// hand-pick its own `mb`/`spacing` value for the gap between two pieces of
// body content; that's exactly the drift this file exists to prevent.
//
//   Section (Slot):     pt:24, pb:32, itemSpacing:32 (title -> content)
//   Content Slot:       pl:20, itemSpacing:32 (between EVERY direct content
//                        child — heading, paragraph, list, image alike; one
//                        flat auto-layout gap, not a tighter "heading to its
//                        own paragraph" special case)
//   List Slot:          itemSpacing:40 (between List Items)
//   List Item:          itemSpacing:20 (badge -> content), pb:24 (baked into
//                        the item itself, so it composes with List Slot's 40
//                        for a 64px total gap between items — two genuinely
//                        separate values in the real component tree, not a
//                        single number counted twice)
//   Item Content Slot:  pt:8, itemSpacing:24 (title/paragraph/image within
//                        ONE list item)
//   Bulleted List Slot: itemSpacing:12
// SECTION_PT/PB were originally swept 1:1 from Figma's Section (Slot)
// component (pt:24/pb:32) but read as too tight, and inconsistent with each
// other, once seen rendered end-to-end across a full page — bumped up and
// unified to a single value per explicit user direction (code's own visual
// judgment wins over the raw Figma figure here, same as the rest of
// theme.js's typographic-scale overrides).
export const SECTION_PT = 6; // 48px
export const SECTION_PB = 6; // 48px
export const SECTION_TITLE_GAP = 4; // 32px, title -> content
export const SECTION_CONTENT_INDENT = 2.5; // 20px, Content Slot's own left padding
export const SECTION_CONTENT_GAP = 4; // 32px, between every direct content child
// LIST_ITEM_GAP/LIST_ITEM_PB were the literal Figma "List Slot"/"List Item"
// figures (40px + 24px = 64px total between NumberedListItems), but read as
// too much dead space once seen end-to-end on a real page -- tightened per
// direct user feedback, same "code's own visual judgment wins" precedent as
// SECTION_PT/PB above.
export const LIST_ITEM_GAP = 4; // 32px, between List Items (NumberedList's own Stack)
export const LIST_ITEM_PB = 2; // 16px, baked into NumberedListItem itself (total gap: 48px)
export const LIST_ITEM_CONTENT_PT = 1; // 8px, Item Content Slot's own top padding
export const LIST_ITEM_CONTENT_GAP = 3; // 24px, within one list item (title/paragraph/image)
export const BULLETED_LIST_GAP = 1.5; // 12px, between Bulleted List Items
export const LABELED_PARAGRAPH_GAP = 1.5; // 12px, Paragraph/Body Normal's own internal label -> body gap
// Consecutive Reference cards were inheriting Section's general 32px
// between-any-content-child gap, which reads as too loose for a dense list
// of short citation cards -- References get their own tighter gap instead
// (matching Bulleted List's own rhythm), via Section's `contentGap` prop
// override.
export const REFERENCE_LIST_GAP = 1.5; // 12px, between Reference cards
