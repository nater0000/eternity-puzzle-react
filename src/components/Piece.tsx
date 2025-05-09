import React from "react";
import { MotifSvg as svgSymbols } from './MotifSvg';
import { MotifSymbols as symbolSymbols } from './MotifSymbols';
import type { MotifStyle } from '../App';


type Props = {
  edges: [string, string, string, string]; // [top, right, bottom, left]
  id: number;
  motifStyle: MotifStyle;
};

type Direction = 'top' | 'right' | 'bottom' | 'left';

const Piece: React.FC<Props> = ({ edges, id, motifStyle }) => {
  const renderMotif = (edge: string, direction: Direction, index: number) => {
    const Component = motifStyle === 'symbol' ? symbolSymbols[edge] : svgSymbols[edge];
    if (!Component) return null;

    return (
      <g key={index} transform={getTransform(direction)}>
        <Component edge={edge} direction={direction} />
      </g>
    );
  };

  const getTransform = (direction: Direction) => {
    switch (direction) {
      case 'top':
        return 'translate(50, 0)';
      case 'right':
        return 'translate(100, 50) rotate(90)';
      case 'bottom':
        return 'translate(50, 100) rotate(180)';
      case 'left':
        return 'translate(0, 50) rotate(-90)';
    }
  };

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
      {edges.map((edge, i) =>
        renderMotif(edge, ["top", "right", "bottom", "left"][i] as Direction, i)
      )}
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
