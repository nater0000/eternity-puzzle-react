import React from 'react';

interface SymbolProps {
    size: number;
    background?: string;
    foreground?: string;
}

const MotifBackgroundPolygon: React.FC<{ fill: string | undefined }> = ({ fill }) => (
    <polygon points="0,0 128,128 0,256" fill={fill} stroke="black" strokeWidth={1} />
);

const baseShapes: Record<string, React.FC<SymbolProps>> = {
    arc: ({ size, background, foreground }) => ( // From Iteration 6 - Looks great
        <svg width={size} height={size} viewBox="0 0 256 256">
            <MotifBackgroundPolygon fill={background} />
            <path
                d="M0,70 C68,70 68,186 0,186"
                stroke={foreground}
                strokeWidth="25"
                fill="none"
            />
        </svg>
    ),

    triangle_half: ({ size, background, foreground }) => ( // From Iteration 6 - Looks great
        <svg width={size} height={size} viewBox="0 0 256 256">
            <MotifBackgroundPolygon fill={background} />
            <polygon points="0,70 75,128 0,186" fill={foreground} />
        </svg>
    ),

    bolt_half: ({ size, background, foreground }) => { // NEW Check-mark design for "bolt"
        const mainSlash = { x1: 30, y1: 105, x2: 80, y2: 140 }; // More straight: dx=50, dy=35. Start a bit higher & further from seam.
        const strokeWider = "28"; // Wider stroke

        return (
            <svg width={size} height={size} viewBox="0 0 256 256">
                <MotifBackgroundPolygon fill={background} />
                {/* Main "slash" part */}
                <line
                    x1={mainSlash.x1} y1={mainSlash.y1}
                    x2={mainSlash.x2} y2={mainSlash.y2}
                    stroke={foreground}
                    strokeWidth={strokeWider}
                    strokeLinecap="round"
                />
                {/* Short line from center of hypotenuse (x=0, y=128) to the "close end" (start) of the slash */}
                <line
                    x1="0" y1="128"
                    x2={mainSlash.x1} y2={mainSlash.y1}
                    stroke={foreground}
                    strokeWidth={strokeWider}
                    strokeLinecap="round"
                />
            </svg>
        );
    },

    chevron: ({ size, background, foreground }) => ( // This was 'chevron_joiner', the < shape. Definition from Iteration 6.
        <svg width={size} height={size} viewBox="0 0 256 256">
            <MotifBackgroundPolygon fill={background} />
            <polyline
                points="15,90 60,128 15,166"
                stroke={foreground}
                strokeWidth="20"
                fill="none"
                strokeLinejoin="miter"
                strokeLinecap="butt"
            />
        </svg>
    ),

    solid_blank: ({ size, background }) => ( // Was 'chevron_floating'. Renders only BG. Definition from Iteration 6.
        <svg width={size} height={size} viewBox="0 0 256 256">
            <MotifBackgroundPolygon fill={background} />
        </svg>
    ),

    circle_touch_seam: ({ size, background, foreground }) => ( // Was 'circle_offset'. Definition from Iteration 6 that you liked (cx=R, r=R).
        <svg width={size} height={size} viewBox="0 0 256 256">
            <MotifBackgroundPolygon fill={background} />
            <circle cx="40" cy="128" r="40" fill={foreground} />
        </svg>
    ),

    solid_gray: ({ size, background = "#9a9a9a" }) => ( // For SvgA. Definition from Iteration 6.
        <svg width={size} height={size} viewBox="0 0 256 256">
            <MotifBackgroundPolygon fill={background} />
        </svg>
    ),
};

const YELLOW = "#FFFF00";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
//const BLUE = "#0033A0";
//const GREEN = "#2E8B57";
const PINK = "#FF69B4";
const SILVER = "#D3D3D3";
const RED = "#FF0000";
const LIME = "#32CD32";
const SKY = "#ADD8E6";
const PURPLE = "#800080";
const TEAL = "#00827F";

const colorPairs: Array<[string, string]> = [
    // BG, FG
    [WHITE, TEAL],
    [WHITE, BLACK],
    [SKY, PURPLE],
    [SILVER, RED],
    [PINK, YELLOW],
    [BLACK, LIME],
];

// Shapes array reflects the renaming and roles per this iteration's request
const shapes = [
    'arc',
    'triangle_half',
    'bolt_half',
    'circle_touch_seam',
    //'chevron',
];

const patterns: Record<string, React.FC<SymbolProps>> = {
    "A": ({ size }) => baseShapes.solid_gray({ size }),
};

const letters = 'BCDEFGHIJKLMNOPQRSTUVW';

for (let i = 0; i < letters.length; i++) {
    const char = letters[i];
    const shapeKey = shapes[i % shapes.length];
    const currentColorPairIndex = Math.floor(i / shapes.length) % colorPairs.length;

    const [bg, fg] = colorPairs[currentColorPairIndex];
    const ShapeComponent = baseShapes[shapeKey];
    if (ShapeComponent) {
        patterns[char] = ({ size, background = bg, foreground = fg }) =>
            ShapeComponent({ size, background, foreground });
    } else {
        patterns[char] = ({ size }) => baseShapes.solid_gray({ size, background: "lightgrey" });
    }
}

export const MotifSymbols = patterns;
export default MotifSymbols;