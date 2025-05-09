import React, { useEffect, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import PiecePalette from "./components/PiecePalette";
import PuzzleBoard from "./components/PuzzleBoard";
import { loadLegacyPuzzle } from "./lib/loadLegacyPuzzle";
import { allPieces } from "./data/pieces";
import type { PuzzleBoardData, BoardPosition } from "./types/puzzle";

const motifStyles = ["svg", "symbol"] as const;
export type MotifStyle = (typeof motifStyles)[number];

const App: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleBoardData | null>(null);
  const [motifStyle, setMotifStyle] = useState<MotifStyle>(motifStyles[0]);
  const [placedPieceIds, setPlacedPieceIds] = useState<Set<number>>(new Set());
  const [pieceRotations, setPieceRotations] = useState<Record<number, number>>({});

  useEffect(() => {
    const loaded = loadLegacyPuzzle();
    if (loaded) {
      setPuzzleData(loaded);

      const placedIds = new Set<number>();
      const rotationMap: Record<number, number> = {};

      for (const pos of loaded.board) {
        if (pos.piece) {
          placedIds.add(pos.piece.id);
          rotationMap[pos.piece.id] = pos.rotation;
        }
      }

      setPlacedPieceIds(placedIds);
      setPieceRotations(rotationMap);
    }
  }, []);

  const handleDropPiece = (index: number, pieceId: number, rotation: number = 0) => {
    if (!puzzleData) return;

    const piece = allPieces.find((p) => p.id === pieceId);
    if (!piece) return;

    const x = index % puzzleData.width;
    const y = Math.floor(index / puzzleData.width);

    const updatedBoard = [...puzzleData.board];
    updatedBoard[index] = {
      x,
      y,
      piece,
      rotation,
    };

    const updatedPlaced = new Set(placedPieceIds);
    updatedPlaced.add(pieceId);

    const updatedRotations = { ...pieceRotations, [pieceId]: rotation };

    setPuzzleData({ ...puzzleData, board: updatedBoard });
    setPlacedPieceIds(updatedPlaced);
    setPieceRotations(updatedRotations);
  };

  const handleRemovePiece = (index: number) => {
    if (!puzzleData) return;

    const updatedBoard = [...puzzleData.board];
    const removedPiece = updatedBoard[index].piece;
    updatedBoard[index] = {
      ...updatedBoard[index],
      piece: null,
    };

    const updatedPlaced = new Set(placedPieceIds);
    const updatedRotations = { ...pieceRotations };

    if (removedPiece) {
      updatedPlaced.delete(removedPiece.id);
      delete updatedRotations[removedPiece.id];
    }

    setPuzzleData({ ...puzzleData, board: updatedBoard });
    setPlacedPieceIds(updatedPlaced);
    setPieceRotations(updatedRotations);
  };

  const handleRotatePiece = (index: number) => {
    if (!puzzleData) return;
    const pos = puzzleData.board[index];
    if (!pos.piece) return;

    const id = pos.piece.id;
    const prevRotation = pieceRotations[id] ?? 0;
    const newRotation = (prevRotation + 1) % 4;

    setPieceRotations((prev) => ({
      ...prev,
      [id]: newRotation,
    }));
  };

  if (!puzzleData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ControlPanel
        motifStyle={motifStyle}
        setMotifStyle={setMotifStyle}
        motifStyles={[...motifStyles]}
      />
      <PuzzleBoard
        width={puzzleData.width}
        height={puzzleData.height}
        board={puzzleData.board}
        motifStyle={motifStyle}
        rotationMap={pieceRotations}
        onDropPiece={handleDropPiece}
        onRemovePiece={handleRemovePiece}
        onRotatePiece={handleRotatePiece}
      />
      <PiecePalette
        placedPieceIds={placedPieceIds}
        motifStyle={motifStyle}
        onDragStart={() => {}}
        onDragEnd={() => {}}
        onRotatePiece={(id, rotation) =>
          setPieceRotations((prev) => ({ ...prev, [id]: rotation }))
        }
        pieceRotations={pieceRotations}
      />
    </div>
  );
};

export default App;
