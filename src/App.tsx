import React from 'react';
import Header from './components/Header';
import PuzzleBoard from './components/PuzzleBoard';
import PiecePalette from './components/PiecePalette';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            <Header />
            <ControlPanel />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PuzzleBoard />
                <PiecePalette />
            </div>
        </div>
    );
};

export default App;
