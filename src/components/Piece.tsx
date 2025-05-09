import React from "react";
import svgSymbols from './MotifSvg';
import symbolSymbols from './MotifSymbols';
import type { MotifStyle } from '../App';

interface Props {
  id: number;
  edges: [string, string, string, string];
  rotation: number;
  isDragging: boolean; // for future styling while dragging pieces
  motifStyle: MotifStyle;
}

type Direction = 'top' | 'right' | 'bottom' | 'left';

const Piece: React.FC<Props> = ({ edges, id, motifStyle, rotation }) => {
  const renderMotif = (edge: string, direction: Direction, index: number) => {
    const Component = motifStyle === 'symbol' ? symbolSymbols[edge] : svgSymbols[edge];
    if (!Component) return null;

    return (
      <g key={index} transform={getTransform(direction)}>
        <Component size={20} />
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
      style={{ transform: `rotate(${rotation}deg)` }} // apply rotation
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
