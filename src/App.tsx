import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import PuzzleBoard from './components/PuzzleBoard';
import PiecePalette from './components/PiecePalette';
import ControlPanel from './components/ControlPanel';
import { loadLegacyPuzzle } from './lib/loadLegacyPuzzle';
import { PIECES } from './data/pieces';
import type { PuzzleBoardData, PlacedPiece } from './types/puzzle';

const motifStyles = ['svg', 'symbol'] as const;
export type MotifStyle = (typeof motifStyles)[number];

const App: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleBoardData | null>(null);
  const [motifStyle, setMotifStyle] = useState<MotifStyle>(motifStyles[0]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);

  useEffect(() => {
    const loaded = loadLegacyPuzzle();
    setPuzzleData(loaded);
    setPlacedPieces(loaded.pieces);
  }, []);

  const allPieceIds = PIECES.map((_, index) => index);

  const placedIds = placedPieces.map(p => p.id);
  const unplacedIds = allPieceIds.filter(id => !placedIds.includes(id));

  const handleDropPiece = (id: number, x: number, y: number) => {
    const existing = placedPieces.find(p => p.x === x && p.y === y);
    if (existing) return; // prevent overwrite
    setPlacedPieces(prev => [...prev, { id, x, y, rotation: 0 }]);
  };

  const handleRemovePiece = (x: number, y: number) => {
    setPlacedPieces(prev => prev.filter(p => !(p.x === x && p.y === y)));
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <Header />
        <ControlPanel
          motifStyle={motifStyle}
          setMotifStyle={setMotifStyle}
          motifStyles={[...motifStyles]}
        />
        <div className="grid md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            {puzzleData ? (
              <PuzzleBoard
                rows={puzzleData.rows}
                cols={puzzleData.cols}
                motifStyle={motifStyle}
                pieces={placedPieces}
                onDropPiece={handleDropPiece}
                onRemovePiece={handleRemovePiece}
              />
            ) : (
              <div className="p-4 border border-red-400 text-red-300 rounded">
                ⚠️ Failed to load puzzle data from URL.
              </div>
            )}
          </div>
          <PiecePalette
            unplacedPieceIds={unplacedIds}
            motifStyle={motifStyle}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
