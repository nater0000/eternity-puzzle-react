import React from 'react';
import type { BoardPosition } from '../types/puzzle';

type Props = {
  width: number;
  height: number;
  board: BoardPosition[];
};

const PuzzleBoard: React.FC<Props> = ({ width, height: _height, board }) => {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}>
      {board.map((cell, idx) => (
        <div
          key={idx}
          className="aspect-square bg-gray-300 border border-gray-500 flex items-center justify-center"
        >
          {cell.piece ? `#${cell.piece.id}` : '•'}
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;
