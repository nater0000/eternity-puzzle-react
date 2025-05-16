import React from "react";

export type MotifComponentProps = {
    size: number;
};

// Corresponds to "00" in motifs-svg.html
export const SvgA: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#9a9a9a" stroke="#9a9a9a" strokeWidth={1} />
    </svg>
);

// Corresponds to "01" in motifs-svg.html
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

// Corresponds to "02" in motifs-svg.html
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

// Corresponds to "03" in motifs-svg.html
export const SvgD: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#854aa3" stroke="black" strokeWidth={1} />
        <path
            d="M0,96 v -32 a64,64 30 0,1 0,128 v -40 l 24, 24 l 24,-24 l -24,-24 l 24,-24 l -24,-24 l -24,24"
            fill="#eced25"
            stroke="#c9bb4b"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "04" in motifs-svg.html
export const SvgE: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#33b441" stroke="black" strokeWidth={1} />
        <path
            d="M0,64 h 32 l 32,32 v 64 l -32,32 h -32 v -16 a48,48 30 1,0 0,-96"
            fill="#265e93"
            stroke="#3b6c8c"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "05" in motifs-svg.html
export const SvgF: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#5cc9f2" stroke="black" strokeWidth={1} />
        <path
            d="M0,32 l 32,32 l -8,40 l 40,-8 l 32,32 l -32,32 l -40,-8 l 8,40 l -32,32"
            fill="#ee3fa8"
            stroke="#8682bc"
            strokeWidth={1} // Added, assuming default 1 from HTML where it was missing
        />
    </svg>
);

// Corresponds to "06" in motifs-svg.html
export const SvgG: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#ac3c6b" stroke="black" strokeWidth={1} />
        <path
            d="M0,96 v -32 a64,64 30 0,1 0,128 v -40 l 24, 24 l 24,-24 l -24,-24 l 24,-24 l -24,-24 l -24,24"
            fill="#2bb35a"
            stroke="#76615e"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "07" in motifs-svg.html
export const SvgH: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#ee3ea8" stroke="black" strokeWidth={1} />
        <path
            d="M0,56 a16,16 0 1,1 8,32 v 32 h 32 a16,16 0 1,1 0,16 h -32 v 32 a16,16 0 1,1 -8,32"
            fill="#f0ed24"
            stroke="#d7ad60"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "08" in motifs-svg.html
export const SvgI: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#f88512" stroke="black" strokeWidth={1} />
        <path
            d="M0,48 h 16 a64,64 30 0,0 64,64 v 32 a64,64 30 0,0 -64,64 h -16"
            fill="#80d5f8"
            stroke="#9ea599"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "09" in motifs-svg.html
export const SvgJ: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#265e92" stroke="black" strokeWidth={1} />
        <path
            d="M0,32 l 96,96 l -96, 96 v -32 l 64,-64 l -64,-64"
            fill="#75cff2"
            stroke="#4585ad"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "0a" in motifs-svg.html (0a hex = 10 dec)
export const SvgK: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#eded25" stroke="black" strokeWidth={1} />
        <path
            d="M0,32 l 96,96 l -96, 96 v -32 l 64,-64 l -64,-64"
            fill="#2bb356"
            stroke="#cbcd2a"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "0b" in motifs-svg.html (0b hex = 11 dec)
export const SvgL: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#32b459" stroke="black" strokeWidth={1} />
        <path
            d="M0,56 a16,16 0 1,1 8,32 v 32 h 32 a16,16 0 1,1 0,16 h -32 v 32 a16,16 0 1,1 -8,32"
            fill="#ee3ea8"
            stroke="#698367"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "0c" in motifs-svg.html (0c hex = 12 dec)
export const SvgM: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#831b43" stroke="black" strokeWidth={1} />
        <path
            d="M-8,128 m0,-40 a16,16 30 1,1 16,0 l 32,32 a16,16 30 1,1 0,16 l -32,32 a16,16 30 1,1 -16,0 l 8,-16 l 24,-24 l -24,-24"
            fill="#f48614"
            stroke="#b76742"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "0d" in motifs-svg.html (0d hex = 13 dec)
export const SvgN: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#fdf103" stroke="black" strokeWidth={1} />
        <path
            d="M0,0 m0,32 l 32,32 l -8,8 l 32,32 l 8,-8 l 32,32 l -32,32 l -8,-8 l -32,32 l 8,8 l -32,32"
            fill="#145c8c"
            stroke="#8e9743"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "0e" in motifs-svg.html (0e hex = 14 dec)
export const SvgO: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#2bb35a" stroke="black" strokeWidth={1} />
        <path
            d="M0,32 l 32,32 l -8,40 l 40,-8 l 32,32 l -32,32 l -40,-8 l 8,40 l -32,32"
            fill="#f4892a"
            stroke="#778e3d"
            strokeWidth={1} // Added, assuming default 1
        />
    </svg>
);

// Corresponds to "0f" in motifs-svg.html (0f hex = 15 dec)
export const SvgP: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#864ba3" stroke="black" strokeWidth={1} />
        <path
            d="M0,32 l 32,32 l -8,40 l 40,-8 l 32,32 l -32,32 l -40,-8 l 8,40 l -32,32"
            fill="#b6e8f9"
            stroke="#8d8db2"
            strokeWidth={1} // Added, assuming default 1
        />
    </svg>
);

// Corresponds to "10" in motifs-svg.html (10 hex = 16 dec)
export const SvgQ: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#155c8c" stroke="black" strokeWidth={1} />
        <path
            d="M0,64 a32,32 30 0,1 32,32 a32,32 30 0,1 0,64 a32,32 30 0,1 -32,32 v -32 a32,32 30 0,0 0,-64"
            fill="#fef102"
            stroke="#7c8c48"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "11" in motifs-svg.html (11 hex = 17 dec)
export const SvgR: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#145c8c" stroke="black" strokeWidth={1} />
        <path
            d="M0,96 v -32 a64,64 30 0,1 0,128 v -40 l 24, 24 l 24,-24 l -24,-24 l 24,-24 l -24,-24 l -24,24"
            fill="#ec359e"
            stroke="#a95397"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "12" in motifs-svg.html (12 hex = 18 dec)
export const SvgS: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#ed3da5" stroke="black" strokeWidth={1} />
        <path
            d="M0,0 m0,32 l 32,32 l -8,8 l 32,32 l 8,-8 l 32,32 l -32,32 l -8,-8 l -32,32 l 8,8 l -32,32"
            fill="#fdf102"
            stroke="#edc524"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "13" in motifs-svg.html (13 hex = 19 dec)
export const SvgT: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#f88826" stroke="black" strokeWidth={1} />
        <path
            d="M0,96 l 32,-32 v 48 l 32,16 l -32,16 v 48 l -32,-32"
            fill="#864ca4"
            stroke="#b56844"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "14" in motifs-svg.html (14 hex = 20 dec)
export const SvgU: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#ac3c6b" stroke="black" strokeWidth={1} />
        <path
            d="M0,96 l 32,-32 v 48 l 32,16 l -32,16 v 48 l -32,-32"
            fill="#eced29"
            stroke="#944b53"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "15" in motifs-svg.html (15 hex = 21 dec)
export const SvgV: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#eded25" stroke="black" strokeWidth={1} />
        <path
            d="M0,96 l 32,-32 v 48 l 32,16 l -32,16 v 48 l -32,-32"
            fill="#43aee6"
            stroke="#92ad65"
            strokeWidth={1}
        />
    </svg>
);

// Corresponds to "16" in motifs-svg.html (16 hex = 22 dec)
export const SvgW: React.FC<MotifComponentProps> = ({ size }) => (
    <svg viewBox="0 0 256 256" width={size} height={size}>
        <polygon points="0,0 128,128 0,256" fill="#ec35a0" stroke="black" strokeWidth={1} />
        <path
            d="M0,48 h 16 a64,64 30 0,0 64,64 v 32 a64,64 30 0,0 -64,64 h -16 v -48 a32,32 30 1,0 0,-64"
            fill="#81d1f0"
            stroke="#af4f8d"
            strokeWidth={1}
        />
    </svg>
);

// Mapping from motif keys to their respective components
const motifSvgMap: Record<string, React.FC<MotifComponentProps>> = {
    A: SvgA, B: SvgB, C: SvgC, D: SvgD, E: SvgE, F: SvgF, G: SvgG,
    H: SvgH, I: SvgI, J: SvgJ, K: SvgK, L: SvgL, M: SvgM, N: SvgN,
    O: SvgO, P: SvgP, Q: SvgQ, R: SvgR, S: SvgS, T: SvgT, U: SvgU,
    V: SvgV, W: SvgW,
};

const MotifSvg = motifSvgMap;
export default MotifSvg;