import React from 'react';

type Props = {
  edge: string;
  direction: 'top' | 'right' | 'bottom' | 'left';
  motifStyle: 'circle' | 'symbol';
};

const MotifSvg: React.FC<Props> = ({ edge, direction, motifStyle }) => {
  const transform = {
    top: '',
    right: 'rotate(90)',
    bottom: 'rotate(180)',
    left: 'rotate(270)',
  }[direction];

  return (
    <g transform={`translate(50, 50) ${transform}`}>
      {motifStyle === 'symbol' ? (
        <use href={`#motif-${edge}`} />
      ) : (
        <>
          <circle r={10} fill={`hsl(${edge.charCodeAt(0) * 20}, 70%, 60%)`} />
          <text textAnchor="middle" y="4" fontSize="10" fill="#000">
            {edge}
          </text>
        </>
      )}
    </g>
  );
};

export default MotifSvg;
