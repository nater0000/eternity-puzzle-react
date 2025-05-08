import React from 'react';
import Header from './components/Header';
import PuzzleBoard from './components/PuzzleBoard';
import PiecePalette from './components/PiecePalette';
import ControlPanel from './components/ControlPanel';
import { loadLegacyPuzzle } from './lib/loadLegacyPuzzle';

const App: React.FC = () => {
  const puzzleData = loadLegacyPuzzle();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Eternity Puzzle Solver 🧩</h1>
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Header />
        <ControlPanel />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {puzzleData ? (
            <PuzzleBoard {...puzzleData} />
          ) : (
            <p className="text-red-600">⚠️ Failed to load puzzle data from URL.</p>
          )}
          <PiecePalette />
        </div>
      </div>
    </main>
  );
};

export default App;
