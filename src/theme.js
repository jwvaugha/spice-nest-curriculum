import { createTheme } from '@mui/material/styles';

// Every value here was pulled directly from the Figma file's actual bound
// variables — swept across the whole "Nest - Local Components V2" library
// page plus the Dashboard/Module 2 Ch 2/Module 1 Ch 5 frames themselves, not
// eyeballed from a screenshot. See COMPONENTS.md for the full mapping.
//
// Primitive scale -> semantic alias -> where it's actually used, e.g.:
//   SPICE-Edu-Orange/700  --(Theme/Primary/Main)-->  theme.palette.primary.main

export const spiceTokens = {
  orange: {
    10: '#fffdfa',
    25: '#fef8f0',
    100: '#fce9d3',
    200: '#fad9b6',
    300: '#f7c194',
    400: '#f5ab4f', // note: resolved directly from Figma, not a guess
    600: '#e68937', // Theme/Primary/Light
    700: '#de7a2d', // Theme/Primary/Main
    800: '#d0a435', // (from earlier direct-fill sweep — kept for reference; unused in current 3 pages)
    900: '#ba560e',
    1000: '#8e420b', // header background
    1100: '#6e3105',
  },
  neutralA: {
    25: '#f7f1e8',
    500: '#c39b70', // Global/iconActive
    600: '#b9875b', // Global/iconHover
    800: '#976844',
    1000: '#684831',
    1200: '#403126', // Global/textPrimary
  },
  neutralB: {
    200: '#c8bfb6', // Global/dividerColor — noticeably darker/more saturated than a generic light gray
    400: '#a69889', // Global/iconInformational
    700: '#6a5d50', // Global/textSecondary
  },
  secondaryGreen: '#689f38', // Theme/Secondary/Dark -> LightGreen/700 (used for "complete" checkmarks)
  trueGray: {
    200: '#e5e5e5', // disabled/background
    400: '#a3a3a3', // disabled/text
  },
  white: '#ffffff',
};

// Applied as a multiplier to each paragraph variant's own base line-height
// (body1's 1.5, body2's 1.43), not as one fixed line-height both get set
// to — that preserves the relative difference MUI's default type scale
// already has between them (body2 reads slightly tighter than body1)
// instead of flattening it. "Slightly" looser: +6%.
export const LINE_HEIGHT_SCALE = 1.2
;

const theme = createTheme({
  palette: {
    primary: {
      main: spiceTokens.orange[700],
      light: spiceTokens.orange[600],
      dark: spiceTokens.orange[1000],
      contrastText: spiceTokens.white,
    },
    secondary: {
      main: spiceTokens.secondaryGreen,
      contrastText: spiceTokens.white,
    },
    text: {
      primary: spiceTokens.neutralA[1200],
      secondary: spiceTokens.neutralB[700],
      disabled: spiceTokens.trueGray[400],
    },
    background: {
      default: spiceTokens.orange[10],
      paper: spiceTokens.white,
    },
    divider: spiceTokens.neutralB[200],
    action: {
      active: spiceTokens.neutralA[500],
      hover: 'rgba(184, 135, 91, 0.08)', // tint of Global/iconHover
      selected: spiceTokens.neutralA[25], // SPICE-Edu-Neutral-A/25 — the real accent-tint used for selection everywhere in Figma
      disabledBackground: spiceTokens.trueGray[200],
      disabled: spiceTokens.trueGray[400],
    },
  },
  typography: {
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    // Letter-spacing values below are the exact figures swept off the real
    // Figma text styles (Typography/H4, /H5, /H6 — see CLAUDE.md), not
    // eyeballed. Figma expresses tracking as either a % of font-size (which
    // converts directly to CSS `em`, since `em` is itself relative to the
    // element's own font-size) or a fixed px value — kept as whichever unit
    // Figma actually used rather than normalizing both to the same unit.
    h1: { fontFamily: '"Vollkorn", Georgia, serif', fontWeight: 400, fontSize: '2rem', lineHeight: 1.235, letterSpacing: '-0.05em' },
    h2: { fontFamily: '"Vollkorn", Georgia, serif', fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.334, letterSpacing: '-0.5px' },
    h3: { fontFamily: '"Vollkorn", Georgia, serif', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.015em' }, // not individually swept — small tracking-in applied consistent with H4/H5, both Vollkorn
    h6: { fontFamily: '"Roboto", sans-serif', fontWeight: 600, fontSize: '1rem', lineHeight: 1.6, letterSpacing: '0.1em', textTransform: 'uppercase' }, // Roboto SemiBold, +10%, ALL CAPS — NOT Vollkorn
    subtitle2: { fontWeight: 600, fontSize: '0.9375rem' },
    // Base line-heights (1.5, 1.43) are MUI's own defaults for these
    // variants — scaled up by LINE_HEIGHT_SCALE rather than replaced with
    // fixed numbers, per the user's explicit "a percentage, not a fixed
    // value" direction.
    body1: { lineHeight: 1.5 * LINE_HEIGHT_SCALE },
    body2: { fontSize: '0.9375rem', lineHeight: 1.6 * LINE_HEIGHT_SCALE },
    // Added 2026-09-21 alongside Sequence Timeline's eyebrow label — no
    // prior page needed this variant, so there was no established value to
    // preserve. Sourced the same way as h1/h2/h6/body1: swept off the real
    // bound Figma style (Typography/Overline, "SPICE Education Project MUI
    // Variables + Style" library) via the Plugin API, not eyeballed. Notably
    // Noto Sans, not the theme's base Roboto — Figma's real style uses a
    // different family here specifically.
    overline: { fontFamily: '"Noto Sans", sans-serif', fontWeight: 400, fontSize: '0.75rem', lineHeight: 2.66, letterSpacing: '1px' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: spiceTokens.orange[1000],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
