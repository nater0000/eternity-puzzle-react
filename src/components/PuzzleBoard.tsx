import React from "react";
import Piece from "./Piece";
import { BoardPosition, MotifStyle } from "../types/puzzle";

interface PuzzleBoardProps {
  board: BoardPosition[][];
  width: number;
  height: number;
  motifStyle: MotifStyle;
  onDropPiece: (pieceId: number, x: number, y: number, rotation?: number) => void;
  onRemovePiece: (x: number, y: number) => void;
  onRotatePiece: (x: number, y: number) => void;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  board,
  width,
  height,
  motifStyle,
  onDropPiece,
  onRemovePiece,
  onRotatePiece,
}) => {
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData("pieceId");
    const rotationStr = e.dataTransfer.getData("rotation");
    if (!pieceIdStr) return;

    const pieceId = parseInt(pieceIdStr, 10);
    const rotation = rotationStr ? parseInt(rotationStr, 10) : 0;

    onDropPiece(pieceId, x, y, rotation);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = (x: number, y: number) => {
    onRotatePiece(x, y);
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    onRemovePiece(x, y);
  };

  return (
    <div className="flex justify-center items-center w-full h-full overflow-hidden">
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          width: "min(90vmin, 100%)",
          height: `calc(min(90vmin, 100%) * ${height / width})`,
          maxHeight: "calc(100vh - 6rem)",
          aspectRatio: `${width} / ${height}`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              onDrop={(e) => handleDrop(e, x, y)}
              onDragOver={handleDragOver}
              onClick={() => handleClick(x, y)}
              onContextMenu={(e) => handleContextMenu(e, x, y)}
              className="w-full h-full bg-neutral-100 flex items-center justify-center"
            >
              {cell.piece && (
                <Piece
                  id={cell.piece.id}
                  edges={cell.piece.edges}
                  rotation={cell.rotation}
                  isDragging={false}
                  motifStyle={motifStyle}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PuzzleBoard;
