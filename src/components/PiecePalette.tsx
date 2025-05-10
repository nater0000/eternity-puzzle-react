// PiecePalette.tsx
import React, { useState, useEffect } from "react";
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
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setDimensions({
        width: Math.max(200, startWidth + moveEvent.clientX - startX),
        height: Math.max(150, startHeight + moveEvent.clientY - startY),
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
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        padding: "8px",
        resize: "both",
        overflow: "auto",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Piece Palette</h3>
        <button onClick={() => setIsVisible(false)} style={{ marginLeft: "auto" }}>
          ×
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
          gap: "4px",
          marginTop: "8px",
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
      <div
        onMouseDown={handleResize}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "10px",
          height: "10px",
          cursor: "nwse-resize",
          backgroundColor: "#ccc",
        }}
      />
    </div>
  );
};

export default PiecePalette;
