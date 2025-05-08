import React from "react";
import MotifSvg from "./MotifSvg";

type Props = {
  edges: [string, string, string, string]; // [top, right, bottom, left]
  id: number;
  motifStyle: 'circle' | 'symbol';
};

const Piece: React.FC<Props> = ({ edges, id, motifStyle }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      shapeRendering="geometricPrecision"
    >
      <rect
        width="100"
        height="100"
        rx="8"
        fill="#f3f4f6"
        stroke="#4b5563"
        strokeWidth="2"
      />
      {edges.map((edge, i) => (
        <MotifSvg
          key={i}
          edge={edge}
          direction={["top", "right", "bottom", "left"][i] as any}
          motifStyle={motifStyle}
        />
      ))}
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
