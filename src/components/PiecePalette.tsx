// PiecePalette.tsx
import React from "react";
import { allPieces } from "../data/pieces";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

interface PiecePaletteProps {
  placedPieceIds: Set<number>;
  motifStyle: MotifStyle;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
}

const PiecePalette: React.FC<PiecePaletteProps> = ({
  placedPieceIds,
  motifStyle,
  onDragStart,
  onDragEnd,
}) => {
  const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));

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
        {unplacedPieces.map((piece) => (
          <div
            key={piece.id}
            draggable
            onDragStart={() => onDragStart(piece.id)}
            onDragEnd={onDragEnd}
            style={{ cursor: "grab" }}
          >
            <Piece
              id={piece.id}
              edges={piece.edges}
              rotation={0}
              isDragging={false}
              motifStyle={motifStyle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PiecePalette;
