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

  return (
    <div style={{
      overflowY: "auto",
      height: "100vh",
      width: "180px",
      backgroundColor: "#f9f9f9",
      borderRight: "1px solid #ccc",
      padding: "8px",
    }}>
      <h3 style={{ marginTop: 0 }}>Piece Palette</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
          gap: "4px",
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
  );
};

export default PiecePalette;
