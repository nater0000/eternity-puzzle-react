import React, { useEffect, useState } from "react";
import PuzzleBoard from "./components/PuzzleBoard";
import PiecePalette from "./components/PiecePalette";
import ControlPanel from "./components/ControlPanel";
import { loadLegacyPuzzle } from "./lib/loadLegacyPuzzle";
import { PIECES } from "./data/pieces";
import type { BoardPosition } from "./types/puzzle";

export const motifStyles = ['svg', 'symbol'] as const;
export type MotifStyle = (typeof motifStyles)[number];

const App: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<{
    board: BoardPosition[];
    rows: number;
    cols: number;
  } | null>(null);

  const [motifStyle, setMotifStyle] = useState<MotifStyle>("svg");

  const [rotationMap, setRotationMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const loaded = loadLegacyPuzzle();
    if (loaded) {
      setPuzzleData({
        board: loaded.board,
        rows: loaded.height,
        cols: loaded.width,
      });

      const newRotationMap: Record<number, number> = {};
      loaded.board.forEach((pos) => {
        if (pos.piece) {
          newRotationMap[pos.piece.id] = pos.rotation ?? 0;
        }
      });
      setRotationMap(newRotationMap);
    }
  }, []);

  const allPieceIds = PIECES.map((_, i) => i);
  const placedIds = new Set(puzzleData?.board.map((pos) => pos.piece?.id).filter(Boolean) ?? []);
  const pieceStates = allPieceIds.map((id) => ({
    id,
    isPlaced: placedIds.has(id),
    rotation: rotationMap[id] ?? 0,
  }));

  const handleDropPiece = (index: number, pieceId: string, rotation: number) => {
    if (!puzzleData) return;
    const id = parseInt(pieceId, 10);
    const pieceData = PIECES[id];
    const newBoard = [...puzzleData.board];
    newBoard[index] = {
      ...newBoard[index],
      piece: { id, edges: pieceData },
    };
    setPuzzleData({ ...puzzleData, board: newBoard });

    setRotationMap((prev) => ({ ...prev, [id]: rotation }));
  };

  const handleRemovePiece = (index: number) => {
    if (!puzzleData) return;
    const newBoard = [...puzzleData.board];
    newBoard[index] = { ...newBoard[index], piece: null };
    setPuzzleData({ ...puzzleData, board: newBoard });
  };

  const handleRotatePiece = (index: number) => {
    if (!puzzleData) return;
    const piece = puzzleData.board[index].piece;
    if (!piece) return;
    setRotationMap((prev) => ({
      ...prev,
      [piece.id]: ((prev[piece.id] ?? 0) + 90) % 360,
    }));
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-2 overflow-y-auto">
        <ControlPanel motifStyle={motifStyle} setMotifStyle={setMotifStyle} motifStyles={motifStyles} />
        <PiecePalette
          pieceStates={pieceStates}
          motifStyle={motifStyle}
        />
      </div>
      <div className="w-3/4 flex justify-center items-center">
        {puzzleData && (
          <PuzzleBoard
            width={puzzleData.cols}
            height={puzzleData.rows}
            board={puzzleData.board}
            motifStyle={motifStyle}
            rotationMap={rotationMap}
            onDropPiece={handleDropPiece}
            onRemovePiece={handleRemovePiece}
            onRotatePiece={handleRotatePiece}
          />
        )}
      </div>
    </div>
  );
};

export default App;
