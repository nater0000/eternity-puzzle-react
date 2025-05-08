import React from 'react';
import motifDefinitions from '../data/motifDefinitions';

type Direction = 'top' | 'right' | 'bottom' | 'left';

export type MotifSvgProps = {
  edge: string;
  direction: Direction;
  motifStyle: 'circle' | 'symbol' | 'svg';
};

const rotationDegrees: Record<Direction, number> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

const MotifSvg: React.FC<MotifSvgProps> = ({ edge, direction, motifStyle }) => {
  const rotation = rotationDegrees[direction];

  if (motifStyle === 'circle') {
    return (
      <circle
        cx="50"
        cy="10"
        r="6"
        fill="#4f46e5"
        transform={`rotate(${rotation} 50 50)`}
      />
    );
  }

  if (motifStyle === 'symbol') {
    return (
      <use
        href={`#${edge}`}
        transform={`rotate(${rotation} 50 50)`}
        x="0"
        y="0"
        width="100"
        height="100"
      />
    );
  }

  // fallback to SVG from motifDefinitions
  const motif = motifDefinitions[edge];
  if (!motif) return null;

  return (
    <g transform={`rotate(${rotation} 50 50)`}>
      {motif.fill && <circle cx="50" cy="10" r="6" fill={motif.fill} />}
      {motif.path && (
        <path
          d={motif.path}
          fill={motif.pathFill ?? 'none'}
          stroke={motif.pathStroke ?? '#000'}
          strokeWidth={motif.pathStrokeWidth ?? 1}
        />
      )}
    </g>
  );
};

export default MotifSvg;
