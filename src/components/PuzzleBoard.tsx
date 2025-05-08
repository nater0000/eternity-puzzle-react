import React from "react";
import type { BoardPosition } from "../types/puzzle";
import Piece from "./Piece";

type Props = {
  width: number;
  height: number;
  board: BoardPosition[];
};

const PuzzleBoard: React.FC<Props> = ({ width, board }) => {
  return (
    <div
      className="grid gap-1 bg-gray-800 p-2 rounded shadow"
      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
    >
      {board.map((cell, idx) => (
        <div
          key={idx}
          className="aspect-square bg-gray-200 rounded flex items-center justify-center"
        >
          {cell.piece ? (
            <Piece id={cell.piece.id} edges={cell.piece.edges} />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;
