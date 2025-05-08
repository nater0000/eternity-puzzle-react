import React from 'react';

const baseStyle = {
  stroke: 'black',
  strokeWidth: 2,
};

const MotifSymbols: Record<string, React.FC<{ size: number }>> = {};

for (let i = 0; i < 27; i++) {
  const id = i.toString(16).padStart(2, '0');

  MotifSymbols[id] = ({ size }) => {
    const center = size / 2;
    const radius = size / 4;

    switch (i % 3) {
      case 0:
        return (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={`hsl(${(i * 137.5) % 360}, 60%, 60%)`}
            {...baseStyle}
          />
        );
      case 1:
        return (
          <rect
            x={center - radius}
            y={center - radius}
            width={radius * 2}
            height={radius * 2}
            fill={`hsl(${(i * 137.5) % 360}, 60%, 70%)`}
            {...baseStyle}
          />
        );
      case 2:
        return (
          <polygon
            points={[
              [center, center - radius],
              [center + radius, center + radius],
              [center - radius, center + radius],
            ]
              .map((p) => p.join(','))
              .join(' ')}
            fill={`hsl(${(i * 137.5) % 360}, 60%, 50%)`}
            {...baseStyle}
          />
        );
    }
  };
}

export default MotifSymbols;
