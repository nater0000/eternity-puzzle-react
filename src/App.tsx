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
  const [rotationMap, setRotationMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const loaded = loadLegacyPuzzle();
    setPuzzleData(loaded);
    setPlacedPieces(loaded.pieces);
    const initialRotations: Record<number, number> = {};
    loaded.pieces.forEach(p => {
      initialRotations[p.id] = p.rotation ?? 0;
    });
    setRotationMap(initialRotations);
  }, []);

  const allPieceIds = PIECES.map((_, index) => index);
  const placedIds = placedPieces.map(p => p.id);
  const unplacedIds = allPieceIds.filter(id => !placedIds.includes(id));

  const handleDropPiece = (id: number, x: number, y: number, rotation = 0) => {
    const existing = placedPieces.find(p => p.x === x && p.y === y);
    if (existing) return; // prevent overwrite
    setPlacedPieces(prev => [...prev, { id, x, y, rotation }]);
    setRotationMap(prev => ({ ...prev, [id]: rotation }));
  };

  const handleRemovePiece = (x: number, y: number) => {
    const piece = placedPieces.find(p => p.x === x && p.y === y);
    if (!piece) return;
    setPlacedPieces(prev => prev.filter(p => !(p.x === x && p.y === y)));
    // keep rotation in rotationMap
  };

  const handleRotatePiece = (x: number, y: number) => {
    setPlacedPieces(prev =>
      prev.map(p =>
        p.x === x && p.y === y
          ? {
              ...p,
              rotation: (p.rotation + 1) % 4,
            }
          : p
      )
    );
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
                onRotatePiece={handleRotatePiece}
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
            rotationMap={rotationMap}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
