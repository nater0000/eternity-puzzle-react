import React from "react";
import type { BoardPosition } from "../types/puzzle";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

type Props = {
  width: number;
  height: number;
  board: BoardPosition[];
  motifStyle: MotifStyle;
  rotationMap: Record<string, number>;
  onDropPiece: (index: number, pieceId: string, rotation: number) => void;
  onRemovePiece: (index: number) => void;
  onRotatePiece: (index: number) => void;
};

const PuzzleBoard: React.FC<Props> = ({
  width,
  board,
  motifStyle,
  rotationMap,
  onDropPiece,
  onRemovePiece,
  onRotatePiece,
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("text/plain");
    const rotationStr = e.dataTransfer.getData("rotation");
    const rotation = rotationStr ? parseInt(rotationStr, 10) : 0;
    if (pieceId) {
      onDropPiece(index, pieceId, rotation);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    onRemovePiece(index);
  };

  const handleLeftClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    onRotatePiece(index);
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
          onClick={(e) => handleLeftClick(e, idx)}
          className="aspect-square bg-gray-200 rounded flex items-center justify-center"
        >
          {cell.piece ? (
            <Piece
              id={cell.piece.id}
              edges={cell.piece.edges}
              motifStyle={motifStyle}
              rotation={rotationMap[cell.piece.id] ?? 0}
              isDragging={false}
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
