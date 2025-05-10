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
    if (!containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;

    // Wait until the DOM has proper dimensions
    if (clientWidth === 0 || clientHeight === 0) return;

    const padding = 16;
    const availableWidth = clientWidth - padding;
    const availableHeight = clientHeight - padding;

    const maxTileWidth = availableWidth / width;
    const maxTileHeight = availableHeight / height;
    const size = Math.floor(Math.min(maxTileWidth, maxTileHeight));

    setTileSize(Math.max(24, size)); // Prevent tiles from becoming too small
  };

  useEffect(() => {
    const resizeWithFrame = () => {
      requestAnimationFrame(() => {
        updateTileSize();
      });
    };

    resizeWithFrame();
    window.addEventListener("resize", resizeWithFrame);
    return () => window.removeEventListener("resize", resizeWithFrame);
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
    <div className="flex-grow flex justify-center items-center p-2 overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full flex justify-center items-center"
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
