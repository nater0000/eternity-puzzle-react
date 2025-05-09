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
  pieceRotations?: Record<number, number>; // new prop to support preserved rotation
}

const PiecePalette: React.FC<PiecePaletteProps> = ({
  placedPieceIds,
  motifStyle,
  onDragStart,
  onDragEnd,
  pieceRotations = {},
}) => {
  const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));
  const [rotations, setRotations] = useState<Record<number, number>>(pieceRotations);

  // keep local rotation in sync with external changes
  useEffect(() => {
    setRotations((prev) => ({ ...pieceRotations, ...prev }));
  }, [pieceRotations]);

  const handleLeftClick = (id: number) => {
    setRotations((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % 4,
    }));
  };

  const handleRightClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setRotations((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  const handleDragStart = (e: React.DragEvent, id: number, rotation: number) => {
    e.dataTransfer.setData("pieceId", id.toString());
    e.dataTransfer.setData("rotation", rotation.toString());
    onDragStart(id);
  };

  return (
    <div
      style={{
        overflowY: "auto",
        padding: "8px",
        maxHeight: "100vh",
        width: "180px",
        backgroundColor: "#f9f9f9",
        borderRight: "1px solid #ccc",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Piece Palette</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
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
  );
};

export default PiecePalette;
