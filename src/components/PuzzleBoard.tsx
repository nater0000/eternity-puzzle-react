import React, { useEffect, useRef, useState } from "react";
import type { BoardPosition } from "../types/puzzle";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

type Props = {
  width: number;
  height: number;
  board: BoardPosition[];
  motifStyle: MotifStyle;
  rotationMap: Record<number, number>;
  onDropPiece: (index: number, pieceId: number, rotation: number) => void;
  onRemovePiece: (index: number) => void;
  onRotatePiece: (index: number) => void;
};

const PuzzleBoard: React.FC<Props> = ({
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
  const [tileSize, setTileSize] = useState(48);

  const updateTileSize = () => {
    const container = containerRef.current;
    const padding = 24;

    let availableWidth = window.innerWidth - padding;
    let availableHeight = window.innerHeight - padding;

    if (container) {
      availableWidth = container.clientWidth - padding;
      availableHeight = container.clientHeight - padding;
    }

    const maxTileWidth = availableWidth / width;
    const maxTileHeight = availableHeight / height;

    const size = Math.floor(Math.min(maxTileWidth, maxTileHeight));
    setTileSize(Math.max(24, size)); // Don't allow tiles smaller than 24px
  };

  useEffect(() => {
    updateTileSize();
    window.addEventListener("resize", updateTileSize);
    return () => window.removeEventListener("resize", updateTileSize);
  }, [width, height]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData("pieceId");
    const pieceId = parseInt(pieceIdStr, 10);
    const rotationStr = e.dataTransfer.getData("rotation");
    const rotation = rotationStr ? parseInt(rotationStr, 10) : 0;
    if (!isNaN(pieceId)) {
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
    <div className="flex-grow flex justify-center items-center overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full flex justify-center items-center"
        style={{
          minWidth: "80vw",
          minHeight: "80vh",
        }}
      >
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
          }}
        >
          {board.map((cell, idx) => (
            <div
              key={idx}
              onDrop={(e) => handleDrop(e, idx)}
              onDragOver={handleDragOver}
              onContextMenu={(e) => handleRightClick(e, idx)}
              onClick={(e) => handleLeftClick(e, idx)}
              className="bg-gray-200 rounded flex items-center justify-center"
              style={{
                width: tileSize,
                height: tileSize,
              }}
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
                <div className="w-full h-full bg-gray-300 border border-gray-400 rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuzzleBoard;
