import React from 'react';

const noop = () => null;

const MotifSymbols: Record<string, React.FC<{ size: number }>> = {
  '00': noop,
  '01': ({ size }) => <circle cx={size / 2} cy={size / 2} r={size / 4} fill="#f38622" />,
  '02': ({ size }) => <rect x={size * 0.2} y={size * 0.2} width={size * 0.6} height={size * 0.6} fill="#ee3fa8" />,
  '03': ({ size }) => <polygon points={`0,0 ${size},${size} 0,${size}`} fill="#eced25" />,
  '04': ({ size }) => <path d={`M0,${size * 0.25} h${size * 0.5}`} stroke="#265e93" fill="none" />,
  '05': ({ size }) => <path d={`M0,${size * 0.1} l${size * 0.5},${size * 0.5}`} stroke="#8682bc" fill="none" />,
  '06': ({ size }) => <polygon points={`0,0 ${size * 0.75},${size * 0.25} ${size / 2},${size}`} fill="#2bb35a" />,
  '07': ({ size }) => <circle cx={size / 3} cy={size / 2} r={size / 6} fill="#f0ed24" />,
  '08': ({ size }) => <ellipse cx={size / 2} cy={size / 2} rx={size / 3} ry={size / 4} fill="#80d5f8" />,
  '09': ({ size }) => <polygon points={`0,0 ${size * 0.75},${size * 0.75} 0,${size}`} fill="#75cff2" />,
  '0a': ({ size }) => <polygon points={`0,0 ${size * 0.75},${size * 0.75} 0,${size}`} fill="#2bb356" />,
  '0b': ({ size }) => <path d={`M0,${size * 0.2} a20,20 0 1,1 ${size * 0.1},${size * 0.4}`} stroke="#ee3ea8" fill="none" />,
  '0c': ({ size }) => <polygon points={`0,0 ${size * 0.5},${size * 0.25} 0,${size}`} fill="#f48614" />,
  '0d': ({ size }) => <path d={`M0,0 l${size * 0.4},${size * 0.4}`} stroke="#145c8c" fill="none" />,
  '0e': ({ size }) => <polygon points={`0,0 ${size / 2},${size / 2} ${size / 3},${size}`} fill="#f4892a" />,
  '0f': ({ size }) => <polygon points={`0,0 ${size * 0.7},${size * 0.7} ${size * 0.3},${size}`} fill="#b6e8f9" />,
  '10': ({ size }) => <path d={`M0,${size * 0.25} a32,32 0 1,1 0,${size * 0.5}`} stroke="#fef102" fill="none" />,
  '11': ({ size }) => <path d={`M0,${size * 0.25} l${size / 2},${size / 2}`} stroke="#ec359e" fill="none" />,
  '12': ({ size }) => <path d={`M0,0 l${size * 0.3},${size * 0.3}`} stroke="#fdf102" fill="none" />,
  '13': ({ size }) => <path d={`M0,${size / 2} l${size / 3},-${size / 3}`} stroke="#864ca4" fill="none" />,
  '14': ({ size }) => <path d={`M0,${size / 2} l${size / 3},-${size / 3}`} stroke="#eced29" fill="none" />,
  '15': ({ size }) => <path d={`M0,${size / 2} l${size / 3},-${size / 3}`} stroke="#43aee6" fill="none" />,
  '16': ({ size }) => <path d={`M0,${size * 0.25} a64,64 0 0,0 ${size * 0.5},${size * 0.5}`} stroke="#81d1f0" fill="none" />,
  '17': ({ size }) => <polygon points={`0,0 ${size},${size / 2} 0,${size}`} fill="#123456" />,
  '18': ({ size }) => <rect x={size * 0.1} y={size * 0.1} width={size * 0.8} height={size * 0.8} fill="#abcdef" />,
};

export default MotifSymbols;
