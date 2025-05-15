import React, { useEffect, useRef, useState } from "react";
import Piece from "./Piece";
import type { BoardPosition } from "../types/puzzle";
import type { MotifStyle } from "../App";

interface PuzzleBoardProps {
  width: number;
  height: number;
  board: BoardPosition[];
  motifStyle: MotifStyle;
  rotationMap: Record<number, number>;
  onDropPiece: (index: number, pieceId: number, rotation: number) => void;
  onRemovePiece: (index: number) => void;
  onRotatePiece: (index: number) => void;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  width,
  height,
  board,
  motifStyle,
  rotationMap,
  onDropPiece,
  onRemovePiece,
  onRotatePiece,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = useState(50);
  const padding = 8;

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth, clientHeight } = container;

      const maxSquareWidth = (clientWidth - padding * 2) / width;
      const maxSquareHeight = (clientHeight - padding * 2) / height;
      const newSize = Math.floor(Math.min(maxSquareWidth, maxSquareHeight));

      setSquareSize(newSize);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [width, height]);

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData("pieceId");
    const rotationStr = e.dataTransfer.getData("rotation");

    const pieceId = parseInt(pieceIdStr, 10);
    const rotation = parseInt(rotationStr, 10) || 0;

    if (!isNaN(pieceId)) {
      onDropPiece(index, pieceId, rotation);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, pieceId: number, rotation: number) => {
    e.dataTransfer.setData("pieceId", pieceId.toString());
    e.dataTransfer.setData("rotation", rotation.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    onRemovePiece(index);
  };

  return (
    <div
      ref={containerRef}
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: `${padding}px`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${width}, ${squareSize}px)`,
          gridTemplateRows: `repeat(${height}, ${squareSize}px)`,
          gap: 2,
        }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none", // Prevent text selection
            }}
          >
            {cell.piece && (
              <div
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, cell.piece!.id, rotationMap[cell.piece!.id] ?? 0)
                }
                onContextMenu={(e) => handleContextMenu(e, index)}
                onClick={() => onRotatePiece(index)}
                style={{
                  width: squareSize,
                  height: squareSize,
                }}
              >
                <Piece
                  id={cell.piece.id}
                  edges={cell.piece.edges}
                  rotation={rotationMap[cell.piece.id] ?? 0}
                  isDragging={false}
                  motifStyle={motifStyle}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleBoard;
