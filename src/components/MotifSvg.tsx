import React from "react";
import { motifDefinitions } from "../data/motifDefinitions";

type Props = {
  edge: string;
  direction: 'top' | 'right' | 'bottom' | 'left';
  motifStyle: 'circle' | 'symbol';
};

const rotationDegrees: Record<Props["direction"], number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

const MotifSvg: React.FC<Props> = ({ edge, direction, motifStyle }) => {
  const rotation = rotationDegrees[direction];
  const motif = motifDefinitions[edge];

  if (!motif) return null;

  return (
    <g transform={`rotate(${rotation}, 50, 50)`}>
      {motifStyle === "circle" ? (
        <circle
          cx="50"
          cy="20"
          r="8"
          fill={motif.color}
          stroke="black"
          strokeWidth="1"
        />
      ) : (
        <text
          x="50"
          y="25"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18"
          fill={motif.color}
        >
          {motif.symbol}
        </text>
      )}
    </g>
  );
};

export default MotifSvg;
