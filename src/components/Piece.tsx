import React from "react";

type Props = {
  edges: [string, string, string, string]; // [top, right, bottom, left]
  id: number;
};

const motifColor = (char: string) =>
  `hsl(${(char.charCodeAt(0) - 97) * 13}, 70%, 60%)`; // unique hue per letter a-z

const Piece: React.FC<Props> = ({ edges, id }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      shapeRendering="geometricPrecision"
    >
      {/* Background */}
      <rect
        width="100"
        height="100"
        rx="8"
        fill="#f3f4f6"
        stroke="#4b5563"
        strokeWidth="2"
      />

      {/* Render one motif per edge */}
      {edges.map((edge, i) => {
        const direction = ["top", "right", "bottom", "left"][i];
        const transform = {
          top: "translate(50, 10)",
          right: "translate(90, 50) rotate(90)",
          bottom: "translate(50, 90) rotate(180)",
          left: "translate(10, 50) rotate(270)",
        }[direction];

        return (
          <g key={i} transform={transform}>
            <circle r="10" fill={motifColor(edge)} />
            <text
              textAnchor="middle"
              y="4"
              fontSize="8"
              fill="#111"
              fontFamily="monospace"
            >
              {edge}
            </text>
          </g>
        );
      })}

      {/* Center label for piece ID */}
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="#222"
      >
        {id}
      </text>
    </svg>
  );
};

export default Piece;
