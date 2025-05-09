import React from "react";

export type MotifComponentProps = {
  size: number;
};

export const SvgA: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#9a9a9a" stroke="#9a9a9a" strokeWidth={1} />
  </svg>
);

export const SvgB: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#26638e" stroke="black" strokeWidth={1} />
    <path
      d="M0,56 a16,16 0 1,1 8,32 v 32 h 32 a16,16 0 1,1 0,16 h -32 v 32 a16,16 0 1,1 -8,32"
      fill="#f38622"
      stroke="#c1732d"
      strokeWidth={1}
    />
  </svg>
);

export const SvgC: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#5cc9f2" stroke="black" strokeWidth={1} />
    <path
      d="M0,0 m0,32 l 32,32 l -8,8 l 32,32 l 8,-8 l 32,32 l -32,32 l -8,-8 l -32,32 l 8,8 l -32,32"
      fill="#ee3fa8"
      stroke="#8682bc"
      strokeWidth={1}
    />
  </svg>
);

export const SvgD: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#854aa3" stroke="black" strokeWidth={1} />
    <path
      d="M0,96 v -32 a64,64 30 0,1 0,128 v -40 
         l 24, 24 l 24,-24 l -24,-24 
         l 24,-24 l -24,-24 l -24,24"
      fill="#eced25"
      stroke="#c9bb4b"
      strokeWidth={1}
    />
  </svg>
);

export const SvgE: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#33b441" stroke="black" strokeWidth={1} />
    <path
      d="M0,64 h 32 l 32,32 v 64 l -32,32 h -32
         v -16 a48,48 30 1,0 0,-96"
      fill="#265e93"
      stroke="#3b6c8c"
      strokeWidth={1}
    />
  </svg>
);

export const SvgF: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#f1cd2e" stroke="black" strokeWidth={1} />
    <path
      d="M0,16 h 16 l 16,16 v 64 l -16,16 h -16
         v -16 a32,32 30 1,0 0,-64"
      fill="#ec3b8b"
      stroke="#d72b79"
      strokeWidth={1}
    />
  </svg>
);

export const SvgG: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#1f9a82" stroke="black" strokeWidth={1} />
    <path
      d="M0,0 m 0,32 l 64,64 l -64,64"
      fill="#f2f2f2"
      stroke="#888888"
      strokeWidth={12}
    />
  </svg>
);

export const SvgH: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#e95d2b" stroke="black" strokeWidth={1} />
    <path
      d="M0,0 m 0,32 l 64,64 l -64,64"
      fill="none"
      stroke="#ffffff"
      strokeWidth={16}
    />
  </svg>
);

export const SvgI: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#ab47bc" stroke="black" strokeWidth={1} />
    <path
      d="M0,0 m 0,32 l 64,64 l -64,64"
      fill="none"
      stroke="#f2f2f2"
      strokeWidth={24}
    />
  </svg>
);

export const SvgJ: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#00838f" stroke="black" strokeWidth={1} />
    <circle cx="32" cy="96" r="16" fill="#ffee58" stroke="#fdd835" strokeWidth={1} />
    <circle cx="96" cy="160" r="16" fill="#ffee58" stroke="#fdd835" strokeWidth={1} />
    <circle cx="64" cy="128" r="16" fill="#ffee58" stroke="#fdd835" strokeWidth={1} />
  </svg>
);

export const SvgK: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#43a047" stroke="black" strokeWidth={1} />
    <path
      d="M0,0 l64,64 l-64,64 z"
      fill="#81c784"
      stroke="#2e7d32"
      strokeWidth={4}
    />
  </svg>
);

export const SvgL: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#5c6bc0" stroke="black" strokeWidth={1} />
    <line x1="0" y1="0" x2="128" y2="128" stroke="#c5cae9" strokeWidth={12} />
    <line x1="0" y1="256" x2="128" y2="128" stroke="#c5cae9" strokeWidth={12} />
  </svg>
);

export const SvgM: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#ef5350" stroke="black" strokeWidth={1} />
    <path
      d="M0,128 a128,128 0 0,1 128,0"
      fill="none"
      stroke="#ffffff"
      strokeWidth={12}
    />
  </svg>
);

export const SvgN: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#26c6da" stroke="black" strokeWidth={1} />
    <path
      d="M0,0 L128,128 L0,256 Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth={8}
    />
    <circle cx="64" cy="128" r="12" fill="#ffffff" />
  </svg>
);

export const SvgO: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#ff7043" stroke="black" strokeWidth={1} />
    <path
      d="M0,64 h64 v128 h-64 z"
      fill="#ffe0b2"
      stroke="#ffcc80"
      strokeWidth={2}
    />
  </svg>
);

export const SvgP: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#8e24aa" stroke="black" strokeWidth={1} />
    <rect x="20" y="60" width="40" height="136" fill="#ce93d8" />
    <rect x="60" y="108" width="40" height="40" fill="#ab47bc" />
  </svg>
);

export const SvgQ: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#009688" stroke="black" strokeWidth={1} />
    <circle cx="64" cy="128" r="40" fill="#4db6ac" />
    <circle cx="64" cy="128" r="20" fill="#00695c" />
  </svg>
);

export const SvgR: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#fbc02d" stroke="black" strokeWidth={1} />
    <polygon points="0,64 64,128 0,192" fill="#fff59d" />
    <line x1="0" y1="64" x2="64" y2="128" stroke="#fbc02d" strokeWidth={4} />
    <line x1="64" y1="128" x2="0" y2="192" stroke="#fbc02d" strokeWidth={4} />
  </svg>
);

export const SvgS: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#6d4c41" stroke="black" strokeWidth={1} />
    <path
      d="M0,128 c64,-64 64,64 128,0"
      fill="none"
      stroke="#d7ccc8"
      strokeWidth={8}
    />
  </svg>
);

export const SvgT: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#42a5f5" stroke="black" strokeWidth={1} />
    <line x1="0" y1="0" x2="0" y2="256" stroke="#bbdefb" strokeWidth={12} />
    <line x1="0" y1="0" x2="128" y2="128" stroke="#2196f3" strokeWidth={4} />
    <line x1="128" y1="128" x2="0" y2="256" stroke="#2196f3" strokeWidth={4} />
  </svg>
);

export const SvgU: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#ef5350" stroke="black" strokeWidth={1} />
    <circle cx="32" cy="64" r="24" fill="#ef9a9a" />
    <circle cx="64" cy="128" r="24" fill="#ef9a9a" />
    <circle cx="32" cy="192" r="24" fill="#ef9a9a" />
  </svg>
);

export const SvgV: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#7e57c2" stroke="black" strokeWidth={1} />
    <rect x="0" y="100" width="100" height="56" fill="#d1c4e9" />
    <rect x="20" y="120" width="60" height="16" fill="#9575cd" />
  </svg>
);

export const SvgW: React.FC<MotifComponentProps> = ({ size }) => (
  <svg viewBox="0 0 256 256" width={size} height={size}>
    <polygon points="0,0 128,128 0,256" fill="#ff7043" stroke="black" strokeWidth={1} />
    <path
      d="M10,246 L64,128 L10,10"
      fill="none"
      stroke="#ffab91"
      strokeWidth={12}
    />
  </svg>
);

// Mapping from motif keys to their respective components
const motifSvgMap: Record<string, React.FC<MotifComponentProps>> = {
  A: SvgA,
  B: SvgB,
  C: SvgC,
  D: SvgD,
  E: SvgE,
  F: SvgF,
  G: SvgG,
  H: SvgH,
  I: SvgI,
  J: SvgJ,
  K: SvgK,
  L: SvgL,
  M: SvgM,
  N: SvgN,
  O: SvgO,
  P: SvgP,
  Q: SvgQ,
  R: SvgR,
  S: SvgS,
  T: SvgT,
  U: SvgU,
  V: SvgV,
  W: SvgW,
};

const MotifSvg = { motifSvgMap };
export default MotifSvg;
