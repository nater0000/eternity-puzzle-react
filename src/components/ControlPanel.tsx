import React from 'react';
import type { MotifStyle } from '../App';

interface ControlPanelProps {
    motifStyle: MotifStyle;
    setMotifStyle: (style: MotifStyle) => void;
    motifStyles: MotifStyle[];
    onClearBoard: () => void;
    onRotateBoard: () => void;
    isPiecePaletteVisible: boolean;
    togglePiecePalette: () => void;
    style?: React.CSSProperties; // Added for potential styling from App.tsx
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    motifStyle,
    setMotifStyle,
    motifStyles,
    onClearBoard,
    onRotateBoard,
    isPiecePaletteVisible,
    togglePiecePalette,
    style
}) => {
    const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMotifStyle(event.target.value as MotifStyle);
    };

    const buttonStyle: React.CSSProperties = {
        marginLeft: '10px',
        padding: '5px 10px',
        border: '1px solid #666',
        borderRadius: '4px',
        background: '#444',
        color: 'white',
        cursor: 'pointer'
    };

    const selectStyle: React.CSSProperties = {
        padding: '5px',
        background: '#333',
        color: 'white',
        border: '1px solid #666',
        borderRadius: '4px'
    }

    return (
        <div className="control-panel" style={{ padding: '10px', backgroundColor: '#282c34', color: 'white', ...style }}>
            <label htmlFor="motif-style" style={{ marginRight: '5px' }}>Motif Style: </label>
            <select
                id="motif-style"
                value={motifStyle}
                onChange={handleStyleChange}
                style={selectStyle}
            >
                {motifStyles.map((style) => (
                    <option key={style} value={style} style={{ background: '#333', color: 'white' }}>
                        {style}
                    </option>
                ))}
            </select>

            <button onClick={togglePiecePalette} style={{ ...buttonStyle, marginLeft: '20px' }}>
                {isPiecePaletteVisible ? 'Hide Pieces' : 'Show Pieces'}
            </button>
            <button onClick={onRotateBoard} style={buttonStyle}>Rotate Board</button>
            <button onClick={onClearBoard} style={buttonStyle}>Clear Board</button>
        </div>
    );
};

export default ControlPanel;