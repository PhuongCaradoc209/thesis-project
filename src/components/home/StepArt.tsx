const SKY = '#fbe7c2';
const FIELD = '#e9cf8e';
const MID = '#d99550';
const INK = '#2b1d12';
const RED = '#b14c26';
const GOLD = '#eab23a';
const LIGHT = '#fffaf0';

const ROUTE = { fill: 'none', stroke: RED, strokeWidth: 2.5, strokeDasharray: '6 8', strokeLinecap: 'round' } as const;
const OUTLINE = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' } as const;

const VIETNAM_PATH =
  'M23 55 L46 39 L78 37 L106 48 L129 37 L170 14 L207 32 L235 37 L230 60 L267 90 L294 97 L248 120 L235 133 L207 166 L193 202 L198 230 L225 258 L258 299 L304 345 L331 382 L345 428 L352 474 L361 515 L350 552 L322 575 L294 591 L253 607 L235 635 L212 658 L175 688 L147 690 L152 644 L133 607 L161 584 L212 577 L223 543 L271 520 L274 446 L276 414 L262 373 L230 331 L184 276 L161 225 L110 200 L131 179 L110 152 L74 133 L60 120 L51 92 L37 74 Z';

const Pin = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path fill={RED} {...OUTLINE} d='M0 0 C-14 -16 -16 -24 -16 -32 A16 16 0 0 1 16 -32 C16 -24 14 -16 0 0Z' />
    <circle fill={LIGHT} cx='0' cy='-32' r='6' />
  </g>
);

export const MapArt = () => (
  <svg viewBox='-40 -10 640 720' className='block h-full w-full' aria-hidden='true'>
    <rect fill={SKY} x='-40' y='-10' width='640' height='720' />
    <path stroke={MID} strokeWidth='2' opacity='0.5' d='M380 120 h120 M400 160 h90 M420 420 h130 M440 460 h80 M380 640 h100' />
    <path fill={FIELD} {...OUTLINE} d={VIETNAM_PATH} />
    <g fill={GOLD}>
      <circle cx='470' cy='325' r='4' />
      <circle cx='482' cy='334' r='3' />
      <circle cx='476' cy='318' r='3' />
      <circle cx='560' cy='640' r='3' />
      <circle cx='572' cy='652' r='4' />
      <circle cx='582' cy='636' r='3' />
    </g>
    <path {...ROUTE} d='M195 118 C240 190 250 260 275 328' />
    <g fill={LIGHT} stroke={INK} strokeWidth='2'>
      <circle cx='100' cy='60' r='9' />
      <circle cx='198' cy='154' r='9' />
      <circle cx='310' cy='355' r='9' />
    </g>
    <Pin x={195} y={118} />
    <Pin x={275} y={328} />
    <g transform='translate(500 60)'>
      <circle fill={LIGHT} {...OUTLINE} r='34' />
      <path fill={RED} d='M0 -28 L8 0 L0 28 L-8 0Z' />
      <text fill={INK} y='-40' textAnchor='middle' fontFamily='IBM Plex Mono' fontWeight='600' fontSize='18'>
        B
      </text>
    </g>
  </svg>
);
