import React from "react";
import svgSymbols from "./MotifSvg";
// Assuming MotifSymbols.tsx exists and exports symbols in a similar way.
// If not, the 'symbol' style might cause errors or show fallbacks.
import symbolSymbols from "./MotifSymbols";
import type { MotifStyle } from "../App";

interface Props {
    id: number;
    edges: [string, string, string, string];
    rotation: number; // Expecting degrees (0, 90, 180, 270) for the whole piece
    isDragging: boolean;
    motifStyle: MotifStyle;
}

type Direction = "top" | "right" | "bottom" | "left";

const Piece: React.FC<Props> = ({ edges, id, motifStyle, rotation }) => {

    const renderMotif = (edgeCharacter: string, direction: Direction, index: number) => {
        const effectiveEdgeKey = edgeCharacter.toUpperCase();
        const symbolMapExists = typeof symbolSymbols === 'object' && symbolSymbols !== null;
        const currentSymbolMap = motifStyle === "symbol" && symbolMapExists ? symbolSymbols : svgSymbols;
        const MotifComponent = currentSymbolMap[effectiveEdgeKey];

        const motifDisplaySize = 100;

        if (!MotifComponent) {
            return null;
        }

        let motifRotation = 0;
        switch (direction) {
            case "top":
                motifRotation = 90;
                break;
            case "right":
                motifRotation = 180;
                break;
            case "bottom":
                motifRotation = 270;
                break;
            case "left":
                motifRotation = 0;
                break;
        }
        const transform = `rotate(${motifRotation} 50 50)`;
        return (
            <g key={index} transform={transform}>
                <MotifComponent size={motifDisplaySize} />
            </g>
        );
    };

    const groupRotation = `rotate(${rotation} 50 50)`;
    const fontSize = 36;

    return (
        <svg
            viewBox="0 0 100 100"
            className="noselect w-full h-full puzzle-piece"
            shapeRendering="geometricPrecision"
        >
            {/* Option A: SVG Filter for Drop Shadow - uncomment to use */}
            {/* <defs>
                <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.5" />
                </filter>
            </defs> */}

            <g transform={groupRotation}> {/* Rotates the whole piece */}
                <rect
                    width="100"
                    height="100"
                    rx="8"
                    fill="#f3f4f6" // Light gray piece background
                    stroke="#4b5563"
                    strokeWidth="2"
                />
                {edges.map((edge, i) =>
                    renderMotif(edge, ["top", "right", "bottom", "left"][i] as Direction, i)
                )}
            </g>

            {/* Text and its background/shadow are outside the main rotation group to stay upright */}

            {/* Option B: Semi-transparent rectangle behind text - uncomment lines below to use */}
            {/* Note: Adjust x, y, width, height, and fill as needed */}
            {/* <rect
                x="25" // Adjust for centering: 50 (center) - (width/2)
                y="35" // Adjust for centering: 57 (text y) - (height/2) - (dominantBaseline offset approx)
                width="50" // Adjust based on typical text width
                height="40" // Adjust based on newFontSize
                rx="5" // Optional: rounded corners for the background
                fill="rgba(0, 0, 0, 0.3)" // Semi-transparent dark background
            /> */}


            {/* The ID Text */}
            <text
                x="50"
                y="57" // Might need slight adjustment with larger font for perfect centering
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize} // Increased font size
                fontWeight="bold"
                fill="#1f2937" // Dark gray text, good contrast on light piece color
                className="piece-id-text"
            // For Option A (SVG Filter Drop Shadow):
            // filter="url(#text-shadow)"
            // For CSS Drop Shadow (simpler alternative to SVG filter if preferred):
                style={{ filter: "drop-shadow(0px 0px 2px rgba(255,255,255,0.95)) drop-shadow(0px 0px 6px rgba(255,255,255,0.75)) drop-shadow(0px 0px 10px rgba(255,255,255,0.55))" }}
            >
                {id}
            </text>
        </svg>
    );
};

export default Piece;