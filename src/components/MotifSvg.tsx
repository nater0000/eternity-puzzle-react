import React from 'react';
import motifDefinitions from '../data/motifDefinitions';

export type MotifSvgProps = {
  motif: string;
  size: number;
  style?: 'svg' | 'symbol' | 'circle';
};

const MotifSvg: React.FC<MotifSvgProps> = ({ motif, size, style = 'svg' }) => {
  const definition = motifDefinitions[motif];

  if (!definition) {
    return (
      <polygon
        points="0,0 128,128 0,256"
        fill="#999"
        stroke="#999"
        strokeWidth="1"
      />
    );
  }

  if (style === 'circle') {
    return (
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2.5}
        fill={definition.fill || '#999'}
      />
    );
  }

  if (style === 'symbol') {
    return <use href={`#${motif}`} />;
  }

  // default 'svg'
  return (
    <>
      <polygon
        points="0,0 128,128 0,256"
        fill={definition.fill}
        stroke="black"
        strokeWidth="1"
      />
      {definition.path && (
        <path
          d={definition.path}
          fill={definition.pathFill}
          stroke={definition.pathStroke}
          strokeWidth={definition.pathStrokeWidth || '1'}
        />
      )}
    </>
  );
};

export default MotifSvg;
