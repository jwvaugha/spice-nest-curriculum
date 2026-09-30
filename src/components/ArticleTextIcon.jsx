import SvgIcon from '@mui/material/SvgIcon';

// Mirrors the real glyph Figma uses for text/article content (the "Article"
// instance-swap default on the "Chapter Icon" component, node 2995:14163) --
// a solid rounded-square badge with the text lines cut out as negative
// space, NOT a MUI "document with a folded corner" icon (DescriptionRounded
// et al all read as file/page icons, which is a different metaphor). Pulled
// directly from Figma's own exported SVG rather than approximated with a
// different stock MUI icon, since no bundled icon actually matches this
// shape. Built with MUI's SvgIcon (not createSvgIcon) so the 15x15 viewBox
// is baked in here rather than needing to be passed at every call site --
// this is a drop-in replacement for any `<Icon fontSize="small" />` usage
// that previously pointed at ArticleTextIcon for a text/article/
// notebook-type row.
export default function ArticleTextIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 15 15">
      <path d="M13.3333 0H1.66667C0.75 0 0 0.75 0 1.66667V13.3333C0 14.25 0.75 15 1.66667 15H13.3333C14.25 15 15 14.25 15 13.3333V1.66667C15 0.75 14.25 0 13.3333 0ZM9.16667 11.6667H3.33333V10H9.16667V11.6667ZM11.6667 8.33333H3.33333V6.66667H11.6667V8.33333ZM11.6667 5H3.33333V3.33333H11.6667V5Z" />
    </SvgIcon>
  );
}
