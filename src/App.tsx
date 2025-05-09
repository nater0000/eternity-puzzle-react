import React, { useEffect, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import PiecePalette from "./components/PiecePalette";
import PuzzleBoard from "./components/PuzzleBoard";
import { loadLegacyPuzzle } from "./lib/loadLegacyPuzzle";
import { allPieces } from "./data/pieces";
import type { PuzzleBoardData } from "./types/puzzle";

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

  const handleDropPiece = (id: number, x: number, y: number, rotation: number = 0) => {
    if (!puzzleData) return;
    const piece = allPieces.find(p => p.id === id);
    if (!piece) return;

    const updatedBoard = [...puzzleData.board];
    const index = puzzleData.width * y + x;
    updatedBoard[index] = {
      x,
      y,
      piece,
      rotation,
    };

    const updatedPlaced = new Set(placedPieceIds);
    updatedPlaced.add(id);

    const updatedRotations = { ...pieceRotations, [id]: rotation };

    setPuzzleData({ ...puzzleData, board: updatedBoard });
    setPlacedPieceIds(updatedPlaced);
    setPieceRotations(updatedRotations);
  };

  const handleRemovePiece = (x: number, y: number) => {
    if (!puzzleData) return;
    const updatedBoard = [...puzzleData.board];
    const index = puzzleData.width * y + x;
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

  const handleRotatePiece = (id: number, rotation: number) => {
    setPieceRotations(prev => ({ ...prev, [id]: rotation }));
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
        onDropPiece={handleDropPiece}
        onRemovePiece={handleRemovePiece}
        onRotatePiece={handleRotatePiece}
      />
      <PiecePalette
        placedPieceIds={placedPieceIds}
        motifStyle={motifStyle}
        onDragStart={() => {}}
        onDragEnd={() => {}}
        onRotatePiece={handleRotatePiece}
        pieceRotations={pieceRotations}
      />
    </div>
  );
};

export default App;
