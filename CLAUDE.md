# nest-react-app — working rules

The primary code deliverable: a real React + MUI build of the SPICE Education Hub chapter pages. It is hand-built, not generated from Figma, and the two are kept in sync by hand. Each can be ahead of the other (for example, Mod-5-Ch-1's reveal cards and hand figures exist only here).

These are the standing rules. For the dated history behind any of them (why a component works the way it does, what was tried and rejected), read `docs/build-log.md`. Project-wide context, Figma docs and the content rules live in the root `../CLAUDE.md`.

## Stack, running, shipping

- Vite + React 19 + `@mui/material` v9 + `@mui/icons-material` + `react-router-dom` v7. Run with `npm run dev`.
- **Deploy:** `npm run deploy` (the `gh-pages` package pushes `dist/` to the `gh-pages` branch). Live at https://jwvaugha.github.io/spice-nest-curriculum/, about 40 s after deploying. Pushing and deploying are separate steps: a `git push` alone doesn't update the live site. After a deploy, verify on the live URL (zero console errors, zero failed requests, a deep link survives a hard reload). A passing local check isn't enough for anything to do with base paths or routing.
- **Remotes:** `origin` = `jwvaugha/spice-nest-curriculum` (public). `ncsa` = `ncsa/spice-explorer` (private; the original Next.js/Prisma front and back end). This app lives there as standalone branch `nest-curriculum-frontend`, with no shared history with its `main`. Update it with `git push ncsa main:nest-curriculum-frontend`.
- **Static hosting requirements (permanent):** `vite.config.js` sets `base: '/spice-nest-curriculum/'`, and `main.jsx` uses `HashRouter`. Wrap every runtime image path in `asset()` (`src/assetPath.js`). Vite's `base` rewriting doesn't touch plain strings, so a bare `/images/...` 404s once deployed.
- **Never commit** `scripts/hand-viz/references v2/` or `scripts/hand-viz/refstyle/cache/`. They hold licensed Adobe Stock source art and are gitignored.

## MUI v9 gotchas

This MUI version is newer than most documentation assumes. Render and check; don't trust prior MUI knowledge.
- `Stack`/`Grid` no longer take `alignItems`/`justifyContent` as props. They leak to the DOM and silently do nothing, so use `sx`. This once broke `position: sticky`, because a stretched aside has nowhere to stick to. Verify sticky or stretch-sensitive layouts by measuring `getBoundingClientRect()` while scrolling, not from a static screenshot.
- `ListItemText` uses `slotProps={{primary, secondary}}`, not `primaryTypographyProps`.
- A `Stack` `spacing` margin beats a child's `sx` margin, and it wipes negative margins. Wrap the child in a plain `Box`.
- After `npm i` or `uninstall`, a long-running Vite server can serve `504 (Outdated Optimize Dep)` and a blank page. Restart it with `--force`.

## Theme and tokens (`src/theme.js`)

- The structure mirrors the Figma file's connected MUI library ("SPICE Education Project MUI Variables + Style"). Pull values from variables actually bound to fills or strokes in the real design. The library also holds unused alternate themes and the generic MUI palette, so never trust a variable by name alone.
- `fontSize` values stay `rem` strings, never bare numbers (accessibility: they must scale with the browser font size).
- Typography matches the bound Figma styles. H4 is Vollkorn 40px at −0.05em; H5 is Vollkorn SemiBold 28px at −0.5px; H6 is **Roboto** SemiBold 18px at +0.1em with uppercase baked into the theme. H6 is for titles labeling a content slot (list-item titles, column headers, label/body pairs), never a table cell value.
- Paragraph line-height = MUI default × `LINE_HEIGHT_SCALE` (1.06). Non-`Typography` text (e.g. `Reference.jsx`) imports the same constant.
- `EMPHASIS_TEXT_SX` (Medium 500, `text.primary`) is shared by the active sidebar title, a table's antecedent column (`ComparisonTable emphasizeColumnA`, `DataTable emphasizeFirstColumn`) and `ComparisonTable` row labels.
- `shape.borderRadius` is 8, so `borderRadius: 2` in `sx` = 16px (Figma's card radius).
- App-wide `::selection` is SPICE-Edu-Orange/200 with dark text.
- Two components that share an HTML variant name aren't necessarily the same Figma component. For example, the Module Header Card and Dashboard "NEST" headings use their own inline styles rather than `h6`.

## Layout

- App shell: `GlobalHeader` (sticky, full viewport width, deliberately outside any `Container`) and `DashboardBackLink` are the only page-level scroll. Below them, each page is a fixed-height row: `Sidebar` (308px; `DashboardDrawer` is genuinely 320px, so don't "fix" it) plus a scrollable content pane with `ChapterFooter` pinned at the bottom. Heights live in `src/layoutConstants.js`; update them if a bar's real height changes.
- Cascading widths, centered on one axis: `HERO_WIDTH` 872 → `PHOTO_MAX_WIDTH` 720 → `TEXT_MAX_WIDTH` 600. Standalone photos may use `PHOTO_MAX_WIDTH`. A list item's photo sits inside its text column, so it matches the paragraph width exactly.
- Content padding comes from `getContentPaddingX(panelWidth)`, based on the measured panel width, never a viewport breakpoint. `useSettledWidth` debounces the reading column's width during a resize.
- **Spacing is owned by slot components, never by hand-picked `mb`/`py`/`spacing` on a page.** Use `Section` (pt 24 / pb 32, 20px content indent, a uniform 32px gap between children), `NumberedList` (40px), `NumberedListItem` (pb 24, content pt 8, gap 24), `BulletedList` (12px), and `Paragraph` (a genuine label+body pair, 12px internal gap). The raw numbers and their Figma provenance live in `layoutConstants.js`. The first section after `ChapterHero` takes `sx={{pt: 0}}`.
- `StickyAsideSection` is for a compact always-visible control beside a long explanation. It uses `HERO_WIDTH` and mirrors `Section`'s rhythm, and it is sticky from `md` up. Any height cap inside it must be measured from the real scroll pane (`ChapterFooter` is a sibling that eats pane height), never computed from `window.innerHeight` plus constants.

## Components and conventions

- **`ChapterMenuItem`:** all whole-item styling (tint `rgba(222,122,45,0.04)`, accent bar, hover, border) lives on one outer container, covering the header and expanded list together. `sections` accepts plain strings (preview only) or `{label, id}` (a real scroll link, only for the active chapter). A row with both `to` and `sections` navigates on its body; its chevron is a separate sibling button. Titles are 400 weight, or 500 when active; icons `#a69889`; the unviewed dot is `primary.main`.
- **`Sidebar`** hides rows without a `to`, except the active row and any "Reflection" row (per the user). Sidebar section previews exclude References.
- **References:** always `<ReferenceList title="References">` holding `<Reference>` children. More than 3 collapse to a preview with a fade, a chevron and a "See more" button. Sort alphabetically by true author/org surname, determined by hand (a "first comma" regex breaks on "U.S." and First-Last names). URLs auto-link. Rewrite library-proxy DOI links (`doi-org.proxy2.library.illinois.edu`) to public `https://doi.org/...`.
- **`TipExample`:** a neutral `action.hover` card with an overhanging badge, flat (no expand). It takes `sx`, but see the Stack gotcha above.
- **Tables:** `ComparisonTable` for 2-column pairs (optional row label; `reveal` mode for click-to-reveal); `DataTable` for N columns (a real MUI `Table`).
- **Flags, never fake content:** `DesignNote` marks a future-component opportunity. `ContentUnderReview` (dashed orange) marks content that the source itself flags for revision.
- **Fade-in on scroll** (`useRevealOnScroll`, `revealSx`): whole `Section`/`StickyAsideSection`/`ChapterHero` blocks reveal together. Elements get their own reveal only if they're a substantial visual: a `NumberedListItem` with a photo, plus every `MythFactCard`/`ComparisonTable`. A reveal fires once, respects reduced motion, and the observer root is the real scroll pane.
- Every `Section` boundary gets a divider; re-check this after every new chapter.
- **`/lab/*` routes are isolated test pages** (currently `#/lab/plate-builder`, the Plate Builder game). Don't link them from any sidebar, footer or `moduleData.js`, and keep them out of the progress model (no `ChapterFooter`, no `useReachedEnd`) until the user promotes them.

## Progress model

- `useViewedChapters` (localStorage `nest-viewed-chapters`, `nest-last-visited-chapter`) is shared by the Dashboard, Home and every sidebar.
- A chapter counts as read at 85% scroll plus a 1.5 s dwell (`useReachedEnd`).
- `getResumeTarget()` drives "Dive Back In". `getLockedModules()`/`isModuleComplete()` (`moduleData.js`) are shared by Home and the Modules tab.
- Progress counts **built chapters only** (`to` set). Reflections don't count toward progress, and "Reset Progress" doesn't erase journal entries (`nest-reflection-<id>`).
- "Jump to Module" in the user menu is a testing control (`setProgressToModule`).

## Adding or porting a chapter (checklist)

1. Copy body text, lists and references verbatim from the Figma frame or source doc. Never fabricate content, and don't propagate copy-paste errors found in the source; flag them instead.
2. Images go in `public/images/<page-slug>/` (`hero.jpg`, `item-<slug>.jpg`). Downscale with `sips -Z 1600 -s formatOptions 82`, and **`mkdir -p` the folder first**: `sips --out` into a missing folder silently writes a file with that name. Figma images: `download_assets`, then match by SHA-1 against `imageHash`.
3. Wiring: the route in `App.jsx`; the `to` in `moduleData.js`; sibling chapters' sidebar rows (`src/sidebars/moduleN.js`, or inline `SIDEBAR_ITEM_DEFS`); the previous chapter's footer; this page's own footer (a module's last chapter goes to its Module Reflection). Route numbers follow the chapterId, not the display label.
4. Verify in Playwright: no console errors, no horizontal overflow at 1400 and ~800px, every image loads, dividers present. Measure positions rather than eyeballing. Playwright's `chrome-headless-shell` version folder changes, so `find` it rather than hardcoding the path.
5. Update the root `CLAUDE.md` index if needed, append the story to `docs/build-log.md`, and add any new standing rule here.

## Generated figures: never hand-edit the output

- **Volume figures (Mod-5-Ch-1):** data in `src/viz/volumeComparisons.js`. `npm run viz:volume` runs the full simulation plus render (~30 min, mostly rice); `npm run viz:volume:render` re-renders only. Output goes to `src/viz/generated/`. `render.mjs` fails on any ratio miss. Contact stiffness `CONTACT_HZ = 300`, and pours fail above 2% overlap. After a rice re-sim, check that the top grain sits near the fill line and that no grain stands upright on top. Pass `--export-figma` to write `Chapter Content/`. It's off by default to protect the user's Illustrator edits.
- **Hand figures (Mod-5-Ch-1):** the page uses the user's hand-tuned Illustrator files from `Chapter Content/Images/Module 5/Chapter 1 - .../hand-*.svg`, imported with `npm run viz:hands:import` into `src/viz/hand/`. Edit the source file, then re-import; never edit `src/viz/hand/`. The Blender (`viz:hands`) and refstyle (`viz:hands:refstyle`) pipelines still run but don't feed the page. Never overwrite `scripts/hand-viz/poses/*.blend` without asking.
- **When the user hand-edits a generated figure in Illustrator,** diff their file against the generator output and port the change into the generator; don't copy the edited file into the app.
