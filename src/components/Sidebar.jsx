import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ChapterMenuItem from './ChapterMenuItem';

// Mirrors Figma's "Sidebar" (Module Header Card + Chapter List) — but built
// as a Coursera/LinkedIn-Learning-style left rail: flush against the true
// left edge of its row and stretched to fill that row's full height (set by
// the page shell, see Module2Chapter2.jsx etc.), not a floating card that
// only hugs its own content height. This is what makes an always-visible
// "next chapter" footer possible below the content column — the row this
// sits in is a fixed-height viewport slice with its own internal scroll,
// not one long page the whole browser scrolls.
//
// The chapter list scrolls independently (overflowY: auto) when it's
// taller than the row; the Module Header Card stays pinned to the top of
// that scroll via its own position: sticky (relative to THIS box's own
// scrollport, unrelated to the page-level sticky header/back-link bars).
// 308px is the real Figma "Sidebar" component width (node 3139:13139),
// not an eyeballed round number — Figma's equivalent "Dashboard Nav Drawer"
// component is genuinely 320px, so the two aren't meant to match despite
// both being "the app's left nav panel" (the Dashboard Nav Drawer's own
// on-screen nav has since moved into PageTopBar's NestNavSwitcher dropdown
// instead of a standing side panel — see NestNavSwitcher.jsx — but its
// Figma width is still the reference point this 308 is deliberately NOT
// matching).
// Per direct user direction: unbuilt/disabled rows (interactive games, the
// one remaining unbuilt chapter, printable/infographic/text resources with
// no real page) are hidden entirely rather than shown dimmed -- EXCEPT
// Reflection rows, which stay visible even if a future module's reflection
// isn't built yet (every one currently built has a real `to`, but the rule
// is written to hold regardless). `active` has to be included even though
// it implies a built chapter: the current page's own sidebar entry never
// sets `to` by convention (see ChapterMenuItem's own comment — it doesn't
// need a link to itself), so filtering on `to` alone would hide the very
// chapter the reader is on.
function isVisible(item) {
  return Boolean(item.to) || item.active || item.label === 'Reflection';
}

export default function Sidebar({ moduleNumber, moduleTitle, items, width = 308 }) {
  const visibleItems = items.filter(isVisible);
  const [openId, setOpenId] = useState(() => visibleItems.find((i) => i.active && i.sections)?.chapterId ?? null);

  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '2px 0 6px rgba(64, 49, 38, 0.05)',
      }}
    >
      <Box sx={{ bgcolor: 'primary.dark', color: '#fff', px: 2.5, py: 2, position: 'sticky', top: 0, zIndex: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.85 }}>
          Module {moduleNumber}
        </Typography>
        <Typography sx={{ fontFamily: 'Vollkorn, Georgia, serif', fontWeight: 700, fontSize: '1.125rem', color: '#fff', mt: 0.25 }}>
          {moduleTitle}
        </Typography>
      </Box>
      <List disablePadding>
        {visibleItems.map((item) => (
          <ChapterMenuItem
            key={item.chapterId}
            {...item}
            open={item.sections ? openId === item.chapterId : undefined}
            onToggle={item.sections ? () => setOpenId((cur) => (cur === item.chapterId ? null : item.chapterId)) : undefined}
          />
        ))}
      </List>
    </Box>
  );
}
