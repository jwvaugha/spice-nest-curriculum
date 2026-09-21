import Stack from '@mui/material/Stack';
import { LIST_ITEM_GAP } from '../layoutConstants';

// Mirrors Figma's "List" component — owns the real 40px "List Slot" gap
// between NumberedListItem children. Pages previously hand-wrote
// `<Stack spacing={N}>` at each usage site with an inconsistent N (28px in
// one page, 40px in another); this is the single source of truth instead,
// matching NumberedListItem's own `pb` for the *other* half of the real
// gap (see layoutConstants.js — List Item's own bottom padding and List
// Slot's gap are two separate values in the real component tree, both
// needed for the correct total space between items).
export default function NumberedList({ children }) {
  return <Stack spacing={LIST_ITEM_GAP}>{children}</Stack>;
}
