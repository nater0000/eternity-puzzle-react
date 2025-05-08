import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import PuzzleBoard from './components/PuzzleBoard';
import PiecePalette from './components/PiecePalette';
import ControlPanel from './components/ControlPanel';
import { loadLegacyPuzzle } from './lib/loadLegacyPuzzle';
import type { PuzzleBoardData } from './types/puzzle';
import MotifSymbols from './components/MotifSymbols';

const App: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleBoardData | null>(null);
  const [motifStyle, setMotifStyle] = useState<'circle' | 'symbol'>('circle');

  useEffect(() => {
    const loaded = loadLegacyPuzzle();
    setPuzzleData(loaded);
  }, []);

  return (
    <>
      <MotifSymbols />
      <main className="min-h-screen bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <Header />
          <ControlPanel motifStyle={motifStyle} setMotifStyle={setMotifStyle} />
          <div className="grid md:grid-cols-3 gap-4 items-start">
            {puzzleData ? (
              <PuzzleBoard {...puzzleData} motifStyle={motifStyle} />
            ) : (
              <div className="md:col-span-2 p-4 border border-red-400 text-red-300 rounded">
                ⚠️ Failed to load puzzle data from URL.
              </div>
            )}
            <PiecePalette />
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
