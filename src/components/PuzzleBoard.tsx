import React from "react";
import type { BoardPosition } from "../types/puzzle";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

type Props = {
  width: number;
  height: number;
  board: BoardPosition[];
  motifStyle: MotifStyle;
  onDropPiece: (index: number, pieceId: string) => void;
  onRemovePiece: (index: number) => void;
};

const PuzzleBoard: React.FC<Props> = ({
  width,
  board,
  motifStyle,
  onDropPiece,
  onRemovePiece,
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("text/plain");
    if (pieceId) {
      onDropPiece(index, pieceId);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Prevent browser context menu
    onRemovePiece(index);
  };

  return (
    <div
      className="grid gap-1 bg-gray-800 p-2 rounded shadow"
      style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
    >
      {board.map((cell, idx) => (
        <div
          key={idx}
          onDrop={(e) => handleDrop(e, idx)}
          onDragOver={handleDragOver}
          onContextMenu={(e) => handleRightClick(e, idx)}
          className="aspect-square bg-gray-200 rounded flex items-center justify-center"
        >
          {cell.piece ? (
            <Piece
              id={cell.piece.id}
              edges={cell.piece.edges}
              motifStyle={motifStyle}
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;
