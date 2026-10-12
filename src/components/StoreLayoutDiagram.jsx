import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRevealOnScroll, revealSx } from '../hooks/useRevealOnScroll';

// Mirrors Figma's "Grocery Store Layout Diagram (custom — not a library
// component)" on Mod-4-Ch-1 (a redraw of the source PowerPoint's slide-4
// store map). Every zone's position/size is copied from the Figma frame's
// "Store Map" (625 x 308 coordinate space), and every color from the
// variable bound to it in Figma (named inline). Drawn as one SVG so the
// whole map scales with the column instead of reflowing.
const W = 625;
const H = 308;

const C = {
  floor: '#f7f1e9', // SPICE-Edu-Neutral-A/25
  divider: '#c8bfb6', // Global/dividerColor
  text: '#403126', // Global/textPrimary
  meat: '#c5e1a5', // LightGreen/200
  drinks: '#c39b70', // SPICE-Edu-Neutral-A/500
  processed: '#de7a2d', // Theme/Primary/Main
  prepared: '#f5ab4f', // SPICE-Edu-Orange/400
  produce: '#689f38', // Theme/Secondary/Dark
  pharmacy: '#d8d8d8',
  service: '#8f8f8f',
};

const LABEL = { fontFamily: 'Roboto, sans-serif', fontSize: 12, letterSpacing: 0.4, fill: C.text };
const SERVICE_LABEL = { fontFamily: 'Roboto, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: 0.4, fill: '#fff' };

// A labeled zone. `lines` stacks multi-line labels; `vertical` reads
// bottom-to-top, matching the rotated Figma text.
function Zone({ x, y, w, h, fill, stroke, r = 6, lines, vertical, labelStyle = LABEL }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const lineH = labelStyle.fontSize * 1.35;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={stroke ? 1 : 0} />
      <text
        {...labelStyle}
        textAnchor="middle"
        dominantBaseline="central"
        transform={vertical ? `rotate(-90 ${cx} ${cy})` : undefined}
      >
        {lines.map((line, i) => (
          <tspan key={line} x={cx} y={cy + (i - (lines.length - 1) / 2) * lineH}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

const AISLE_XS = [318, 339, 359, 380, 400, 421, 441, 462];
const LANE_XS = [387, 418, 450, 481, 512, 544, 575];

export default function StoreLayoutDiagram() {
  // Fade-in-on-scroll Rule 2/3: a substantial standalone visual block.
  const [ref, visible] = useRevealOnScroll();
  return (
    <Box
      ref={ref}
      component="figure"
      sx={{
        m: 0,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        ...revealSx(visible),
      }}
    >
      <Typography variant="h6" component="figcaption" id="store-layout-title" sx={{ mb: 2 }}>
        Common Grocery Store Layout Example
      </Typography>
      <Box
        component="svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="store-layout-title store-layout-desc"
        sx={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <desc id="store-layout-desc">
          Floor plan of a typical grocery store. Dairy and eggs, plus frozen foods, run along the back wall. Below
          them, from left: the meat counter and shelves, alcohol and drinks, a processed-food wall, a processed-food
          endcap above prepared meals and the bakery, eight processed-food aisles, and the pharmacy and other
          departments. Along the front: fresh produce on the left, the cashier and candy area with checkout lanes on
          the right, and the entrance and exit below fresh produce.
        </desc>
        <rect x={0.75} y={0.75} width={W - 1.5} height={289 - 1.5} rx={12} fill={C.floor} stroke={C.divider} strokeWidth={1.5} />
        <Zone x={16} y={12} w={592} h={33} fill="#fff" stroke={C.divider} lines={['Dairy & Eggs (+ Frozen Foods)']} />
        <Zone x={16} y={59} w={89} h={131} fill={C.meat} lines={['Meat Counter', '& Shelves']} />
        <Zone x={112} y={57} w={36} h={135} fill={C.drinks} vertical lines={['Alcohol & Drinks']} />
        <Zone x={158} y={57} w={36} h={135} fill={C.processed} vertical lines={['Processed Food']} />
        <Zone x={202} y={59} w={103} h={33} fill={C.processed} lines={['Processed Food']} />
        <Zone x={202} y={102} w={103} h={40} fill={C.prepared} lines={['Prepared Meals']} />
        <Zone x={202} y={146} w={103} h={45} fill={C.prepared} lines={['Bakery']} />
        <text {...LABEL} x={397} y={69} textAnchor="middle" dominantBaseline="central">
          Processed Food Aisles
        </text>
        {AISLE_XS.map((x) => (
          <rect key={x} x={x} y={87} width={14} height={103} rx={3} fill={C.processed} />
        ))}
        <Zone
          x={488}
          y={60}
          w={122}
          h={130}
          fill={C.pharmacy}
          lines={['Pharmacy & other', 'departments', '(hygiene, technology,', 'household, etc.)']}
        />
        <Zone x={16} y={204} w={336} h={69} fill={C.produce} lines={['Fresh Produce']} />
        <Zone x={387} y={204} w={205} h={21} fill={C.service} lines={['Cashier & Candy']} labelStyle={SERVICE_LABEL} />
        {LANE_XS.map((x) => (
          <rect key={x} x={x} y={235} width={17} height={38} rx={3} fill={C.divider} />
        ))}
        <Zone x={88} y={281} w={166} h={22} r={5} fill={C.service} lines={['Entrance/Exit']} labelStyle={SERVICE_LABEL} />
      </Box>
    </Box>
  );
}
