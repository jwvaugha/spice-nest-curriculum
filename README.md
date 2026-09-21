# NEST — React + MUI

A real React app using actual MUI (Material UI) components — `AppBar`, `Drawer`-style `Paper`, `List`/`ListItemButton`/`Collapse`, `LinearProgress`, `Grid`, etc. — not hand-rolled CSS approximating them. This supersedes `Web Prototype/` (the earlier plain HTML/CSS/JS build) as the primary code deliverable; `Web Prototype/` is left in place as a reference, not deleted.

## Running it

```
cd nest-react-app
npm install   # first time only
npm run dev
```

Opens on **http://localhost:5173** (or the next free port). Vite hot-reloads on save.

## Structure

- `src/theme.js` — the MUI theme (`palette`, `typography`). Every color value was pulled directly from the Figma file's actual bound variables via a full sweep of the component library page plus the 3 built frames — not eyeballed. See the comments in the file for the primitive → semantic → MUI mapping (e.g. `SPICE-Edu-Orange/700` → `Theme/Primary/Main` → `theme.palette.primary.main`). A few corrections came out of this sweep vs. the earlier plain-HTML build's guessed values — notably the divider color, which is a more saturated warm gray (`#c8bfb6`) than originally guessed.
- `src/components/` — one file per Figma Nest V2 component, built from real MUI primitives:
  - `GlobalHeader.jsx` — MUI `AppBar`, rendered **outside** any width-constrained container in `App.jsx` so it spans the full browser viewport edge-to-edge.
  - `Sidebar.jsx` + `ChapterMenuItem.jsx` — `List`/`ListItemButton`/`Collapse`, with true radio-accordion behavior (opening one chapter closes any other open one in the same sidebar).
  - `DashboardDrawer.jsx`, `ModuleProgressRow.jsx`, `ChapterHero.jsx`, `NumberedListItem.jsx`, `MythFactCard.jsx`, `ChapterFooter.jsx`.
  - `Reference.jsx` — mirrors Figma's "Reference" component (a rounded `SPICE-Edu-Neutral-A/25` card per citation). **Standard element for every References section — never render a References list as a plain `<ul><li>` bullet list.** Adds one thing the static Figma design can't: any `http(s)` URL inside the citation text automatically renders as a real, underlined, clickable `Link`, not plain text.
  - `TipExample.jsx` — mirrors Figma's "Tip-Example" component: a yellow callout card with an overlapping type-badge pill (e.g. "Serving Size Examples"). Only the flat header bar is implemented — every instance built so far ships collapsed with no detail content behind it, matching the established convention (no fabricated expand panel). Used via `NumberedListItem`'s optional `tip`/`tipLabel` props, not rendered standalone.
  - `BulletedList.jsx` — mirrors Figma's real "Bulleted List"/"Bulleted List Item" components (a 5px dot + text row). Use this for every bullet list going forward — never approximate one with a raw HTML `<ul>`.
  - `ComparisonTable.jsx` — mirrors Figma's "Comparison Table (Placeholder)" exactly: a dashed-orange 2-column stand-in with a fixed "PLACEHOLDER" tag. A real comparison-table component doesn't exist in Figma yet either, so this is the deliberate, flagged placeholder — never fake a real table with it.
  - `DesignNote.jsx` — mirrors Figma's "Design Note (annotation)" pattern (not a real Figma component — hand-styled fresh each time in the source file). Flags content that's fully and correctly built with existing components but whose natural shape would be better served by a not-yet-built one; sits alongside real content, never in place of missing content.
  - **`Section.jsx`, `NumberedList.jsx`, `Paragraph.jsx` — "slot" components that own their own spacing**, mirroring Figma's real "Section (Slot)", "List", and "Paragraph/Body Normal" components exactly (gap/padding values swept off the live component definitions, not eyeballed — see `layoutConstants.js` and `CLAUDE.md` §6 for the full ground truth). **Every chapter section must use `<Section>` for its content, and every numbered list must use `<NumberedList>` — never a bare `Box component="section"` with a hand-picked `py`/`mb`, and never a raw `Stack spacing={N}` around `NumberedListItem`s.** Changing a gap value happens once, in these components (or their constants), and propagates to every page automatically — that's the whole point of a "slot": the number lives in the component, not scattered across every call site.
- `src/pages/` — `Dashboard.jsx`, `Module2Chapter2.jsx`, `Module1Chapter5.jsx`, `Module1Chapter2.jsx`, `Module3Chapter2.jsx`, routed via `react-router-dom` in `App.jsx`.
- `src/hooks/useViewedChapters.js` — the "viewed" status hook, backed by `localStorage` (persists across browser sessions). Used consistently by both the Dashboard's inline chapter list and each chapter page's own sidebar — clicking any chapter link anywhere clears its dot everywhere.
- `public/images/` — same image-drop convention as `Web Prototype/images/` (see its `README.md`): stable per-slot filenames like `hero.jpg`, `item-<slug>.jpg`. Overwrite a file, refresh, done — no code change for an already-wired slot.

## MUI version note

This project pins `@mui/material@^9`, a notably newer major than most existing MUI documentation/examples assume. Two breaking changes hit during the build, both fixed and worth knowing about if extending this app:
- `Stack` (and `Grid`) no longer accept `alignItems`/`justifyContent` as direct props — pass them inside `sx={{ alignItems: ..., justifyContent: ... }}` instead. Passing them directly silently leaks them onto the underlying DOM node as invalid HTML attributes (React logs a console warning, layout looks unstyled).
- `ListItemText`'s `primaryTypographyProps`/`secondaryTypographyProps` props were removed in favor of `slotProps={{ primary: {...}, secondary: {...} }}`.

## Component mapping

See `../Web Prototype/COMPONENTS.md` for the Figma-component-to-code table — it applies here too (same components, now built with real MUI instead of approximated CSS).
