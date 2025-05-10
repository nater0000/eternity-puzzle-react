import React, { useEffect, useRef, useState } from "react";
import { BoardPosition } from "../types/puzzle";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

interface PuzzleBoardProps {
  board: BoardPosition[];
  rows: number;
  cols: number;
  motifStyle: MotifStyle;
  placedPieceIds: Set<number>;
  pieceRotations: Record<number, number>;
  onDropPiece: (id: number, x: number, y: number, rotation?: number) => void;
  onRemovePiece: (id: number) => void;
  onRotatePiece: (id: number, rotation: number) => void;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  board,
  rows,
  cols,
  motifStyle,
  placedPieceIds,
  pieceRotations,
  onDropPiece,
  onRemovePiece,
  onRotatePiece,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState<number>(48);

  useEffect(() => {
    const updateTileSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const availableWidth = clientWidth - 16;
        const availableHeight = clientHeight - 16;
        const newSize = Math.floor(Math.min(availableWidth / cols, availableHeight / rows));
        setTileSize(Math.max(24, newSize));
      }
    };

    // Defer first calculation until after render
    requestAnimationFrame(updateTileSize);

    const resizeObserver = new ResizeObserver(updateTileSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [rows, cols]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, x: number, y: number) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData("pieceId");
    const rotationStr = e.dataTransfer.getData("rotation");
    const pieceId = parseInt(pieceIdStr, 10);
    const rotation = rotationStr ? parseInt(rotationStr, 10) : 0;

    if (!isNaN(pieceId)) {
      onDropPiece(pieceId, x, y, rotation);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="flex-grow flex justify-center items-center p-2 overflow-hidden"
    >
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
        }}
      >
        {Array.from({ length: rows * cols }, (_, index) => {
          const x = index % cols;
          const y = Math.floor(index / cols);
          const position = board.find((p) => p.x === x && p.y === y);
          const piece = position?.piece;

          return (
            <div
              key={`${x}-${y}`}
              onDrop={(e) => handleDrop(e, x, y)}
              onDragOver={handleDragOver}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: "#e0e0e0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {piece && (
                <Piece
                  id={piece.id}
                  edges={piece.edges}
                  rotation={pieceRotations[piece.id] ?? 0}
                  isDragging={false}
                  motifStyle={motifStyle}
                  size={tileSize}
                  onClick={() =>
                    onRotatePiece(piece.id, ((pieceRotations[piece.id] ?? 0) + 1) % 4)
                  }
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onRemovePiece(piece.id);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PuzzleBoard;
