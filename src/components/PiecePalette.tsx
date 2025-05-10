import React, { useState, useEffect, useRef } from "react";
import { allPieces } from "../data/pieces";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

interface PiecePaletteProps {
  placedPieceIds: Set<number>;
  motifStyle: MotifStyle;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  onRotatePiece: (id: number, rotation: number) => void;
  pieceRotations?: Record<number, number>;
}

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

const PiecePalette: React.FC<PiecePaletteProps> = ({
  placedPieceIds,
  motifStyle,
  onDragStart,
  onDragEnd,
  onRotatePiece,
  pieceRotations = {},
}) => {
  const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));
  const [rotations, setRotations] = useState<Record<number, number>>(pieceRotations);
  const [isVisible, setIsVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 300, height: window.innerHeight / 2 });
  const [position, setPosition] = useState({ top: window.innerHeight / 2, left: window.innerWidth - 320 });

  const paletteRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setRotations((prev) => ({ ...pieceRotations, ...prev }));
  }, [pieceRotations]);

  const handleLeftClick = (id: number) => {
    const newRotation = ((rotations[id] || 0) + 1) % 4;
    setRotations((prev) => ({ ...prev, [id]: newRotation }));
    onRotatePiece(id, newRotation);
  };

  const handleRightClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setRotations((prev) => ({ ...prev, [id]: 0 }));
    onRotatePiece(id, 0);
  };

  const handleDragStart = (e: React.DragEvent, id: number, rotation: number) => {
    e.dataTransfer.setData("pieceId", id.toString());
    e.dataTransfer.setData("rotation", rotation.toString());
    onDragStart(id);
  };

  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth + moveEvent.clientX - startX);
      const newHeight = Math.max(MIN_HEIGHT, startHeight + moveEvent.clientY - startY);
      setDimensions({ width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleMoveStart = (e: React.MouseEvent) => {
    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        top: Math.max(0, moveEvent.clientY - dragOffset.current.y),
        left: Math.max(0, moveEvent.clientX - dragOffset.current.x),
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          setDimensions({ width: 300, height: window.innerHeight / 2 });
          setPosition({ top: window.innerHeight / 2, left: window.innerWidth - 320 });
        }}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        Show Pieces
      </button>
    );
  }

  return (
    <div
      ref={paletteRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={(e) => {handleMoveStart}
        style={{
          cursor: "move",
          backgroundColor: "#ddd",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Piece Palette</span>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>

      {/* Pieces Grid */}
      <div
        style={{
          flexGrow: 1,
          overflow: "auto",
          padding: "6px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
            gap: "6px",
          }}
        >
          {unplacedPieces.map((piece) => {
            const rotation = rotations[piece.id] || 0;
            return (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => handleDragStart(e, piece.id, rotation)}
                onDragEnd={onDragEnd}
                onClick={() => handleLeftClick(piece.id)}
                onContextMenu={(e) => handleRightClick(e, piece.id)}
                style={{ cursor: "grab" }}
              >
                <Piece
                  id={piece.id}
                  edges={piece.edges}
                  rotation={rotation}
                  isDragging={false}
                  motifStyle={motifStyle}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleResize}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "12px",
          height: "12px",
          cursor: "nwse-resize",
          backgroundColor: "#ccc",
        }}
      />
    </div>
  );
};

export default PiecePalette;
