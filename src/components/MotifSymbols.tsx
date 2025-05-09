import React from 'react';

interface SymbolProps {
  size: number;
  background: string;
  foreground: string;
}

const baseShapes: Record<string, React.FC<SymbolProps>> = {
  arc: ({ size, background, foreground }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,0 100,100 0,100" fill={background} />
      <path d="M20,100 A30,30 0 0,1 80,100" stroke={foreground} strokeWidth="10" fill="none" />
    </svg>
  ),
  triangle: ({ size, background, foreground }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,0 100,100 0,100" fill={background} />
      <polygon points="50,20 70,80 30,80" fill={foreground} />
    </svg>
  ),
  backslash: ({ size, background, foreground }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,0 100,100 0,100" fill={background} />
      <line x1="30" y1="80" x2="70" y2="20" stroke={foreground} strokeWidth="10" />
    </svg>
  ),
  chevron: ({ size, background, foreground }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,0 100,100 0,100" fill={background} />
      <polyline points="30,60 50,40 70,60" fill="none" stroke={foreground} strokeWidth="10" />
    </svg>
  ),
  half8: ({ size, background, foreground }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,0 100,100 0,100" fill={background} />
      <path d="M50,40 a10,10 0 1,1 0.1,0 z M50,70 a10,10 0 1,1 0.1,0 z" fill={foreground} />
    </svg>
  ),
  solid: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,0 100,100 0,100" fill="gray" />
    </svg>
  ),
};

const colorPairs: Array<[string, string]> = [
  ['white', 'blue'],
  ['white', 'green'],
  ['white', 'red'],
  ['white', 'orange'],
  ['blue', 'white'],
  ['green', 'white'],
  ['red', 'white'],
  ['orange', 'white'],
];

const shapes = ['arc', 'triangle', 'backslash', 'chevron', 'half8'];

const patterns: Record<string, React.FC<SymbolProps>> = {
  "A": ({ size, background: _, foreground: __ }) => baseShapes.solid({ size }), // Solid gray triangle
};

const letters = 'BCDEFGHIJKLMNOPQRSTUVW'; // 22 entries

for (let i = 0; i < letters.length; i++) {
  const char = letters[i];
  const shape = shapes[i % shapes.length] as keyof typeof baseShapes;
  const [bg, fg] = colorPairs[i % colorPairs.length];
  patterns[char] = ({ size }) => baseShapes[shape]({ size, background: bg, foreground: fg });
}

export const MotifSymbols = { patterns };
export default MotifSymbols;
