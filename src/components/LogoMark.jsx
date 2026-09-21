// The real SPICE brand mark, pulled directly from Figma (Global Header ->
// Logo -> Logo Icon Wrapper) via download_assets, not a placeholder.
export default function LogoMark({ size = 17, color = '#ffffff' }) {
  return (
    <svg width={size} height={(size * 21.2) / 17.2432} viewBox="0 0 17.2432 21.2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.72877 3.08562V0H0V21.2H9.72877V18.1144C7.73582 18.1144 5.82448 17.3227 4.41529 15.9134C3.00607 14.5042 2.21438 12.593 2.21438 10.6C2.21438 8.60706 3.00607 6.69572 4.41529 5.28653C5.82448 3.87731 7.73582 3.08562 9.72877 3.08562Z" fill={color} />
      <path d="M9.72879 3.08562V18.1144C11.7217 18.1144 13.6331 17.3227 15.0423 15.9134C16.4515 14.5042 17.2432 12.593 17.2432 10.6C17.2432 8.60706 16.4515 6.69572 15.0423 5.28653C13.6331 3.87731 11.7217 3.08562 9.72879 3.08562Z" fill={color} />
    </svg>
  );
}
