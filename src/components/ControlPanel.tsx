import React, { useState, useRef, useEffect } from 'react';
import type { MotifStyle } from '../App'; // Assuming App exports MotifStyle
import githubIconSrc from '/git.png'; // Using the path from your last version

interface ControlPanelProps {
    motifStyle: MotifStyle;
    setMotifStyle: (style: MotifStyle) => void;
    motifStyles: MotifStyle[];
    onClearBoard: () => void;
    onRotateBoard: () => void;
    isPiecePaletteVisible: boolean;
    togglePiecePalette: () => void;
    style?: React.CSSProperties;
    githubRepoUrl?: string;
    // Callback to report its height to the parent (App.tsx)
    reportHeight?: (height: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    motifStyle,
    setMotifStyle,
    motifStyles,
    onClearBoard,
    onRotateBoard,
    isPiecePaletteVisible,
    togglePiecePalette,
    style,
    githubRepoUrl,
    reportHeight
}) => {
    const [isPanelContentVisible, setIsPanelContentVisible] = useState(true);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (panelRef.current && reportHeight) {
            reportHeight(panelRef.current.offsetHeight);
        }
        // Report height when panel content visibility changes too
    }, [isPanelContentVisible, reportHeight]);


    const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMotifStyle(event.target.value as MotifStyle);
    };

    // Adjusted styles for smaller vertical footprint while trying to preserve font size
    const commonButtonStyles: React.CSSProperties = {
        marginLeft: '6px', // Slightly reduced margin
        padding: '2px 6px', // Reduced vertical padding
        fontSize: '0.875rem', // Kept from previous version
        border: '1px solid #555',
        borderRadius: '4px',
        background: '#3a3a3a',
        color: 'white',
        cursor: 'pointer',
        minWidth: '90px', // Slightly reduced minWidth
        textAlign: 'center',
        lineHeight: '1.4', // Adjust line height for better vertical fit
    };

    const selectStyle: React.CSSProperties = {
        padding: '2px 4px', // Reduced vertical padding
        fontSize: '0.875rem', // Kept from previous version
        background: '#333',
        color: 'white',
        border: '1px solid #555',
        borderRadius: '4px',
        marginLeft: '6px',
        lineHeight: '1.4', // Adjust line height
    };

    const hamburgerButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.4rem', // Slightly smaller hamburger for vertical space
        cursor: 'pointer',
        padding: '0 6px', // Reduced padding
        marginRight: '8px',
    };

    const githubIconStyle: React.CSSProperties = {
        height: '22px', // Slightly smaller for vertical fit
        width: '22px',  // Slightly smaller for vertical fit
        verticalAlign: 'middle',
        borderRadius: '50%', // Circular mask
        border: '1px solid #4a4a4a', // Optional: subtle border for the circle
    };

    const githubLinkStyle: React.CSSProperties = {
        marginLeft: 'auto', // Pushes it to the right
        display: 'flex', // To align icon properly if needed
        alignItems: 'center',
        padding: '0 6px', // Minimal padding
    };

    return (
        <div
            ref={panelRef}
            style={{
                padding: '4px 8px', // Reduced vertical padding for the whole panel
                backgroundColor: '#282c34',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap', // Prevent wrapping to ensure hamburger and git icon stay on ends
                width: '100%',
                boxSizing: 'border-box',
                ...style
            }}
        >
            <button
                onClick={() => setIsPanelContentVisible(!isPanelContentVisible)}
                style={hamburgerButtonStyle}
                title={isPanelContentVisible ? "Hide Controls" : "Show Controls"}
            >
                ☰
            </button>

            {isPanelContentVisible && (
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-start' }}>
                    {/* Removed "Style:" label */}
                    <select
                        id="motif-style"
                        value={motifStyle}
                        onChange={handleStyleChange}
                        style={selectStyle}
                        title="Select piece rendering style (SVG or Symbol)"
                    >
                        {motifStyles.map((s) => (
                            <option key={s} value={s} style={{ background: '#333', color: 'white' }}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={togglePiecePalette}
                        style={commonButtonStyles}
                        title={isPiecePaletteVisible ? "Hide Piece Palette" : "Show Piece Palette"}
                    >
                        {isPiecePaletteVisible ? 'Palette' : 'Palette'}
                    </button>
                    <button
                        onClick={onRotateBoard}
                        style={commonButtonStyles}
                        title="Rotate the entire puzzle board 90 degrees clockwise"
                    >
                        Rotate Board
                    </button>
                    <button
                        onClick={onClearBoard}
                        style={commonButtonStyles}
                        title="Clear all pieces from the board (cannot be undone)"
                    >
                        Clear Board
                    </button>
                </div>
            )}
            {/* Spacer to push GitHub icon to the right if controls are hidden */}
            {!isPanelContentVisible && <div style={{ flexGrow: 1 }}></div>}


            {githubRepoUrl && (
                <a
                    href={githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View project on GitHub" // Tooltip for GitHub link
                    style={githubLinkStyle}
                >
                    <img
                        src={githubIconSrc}
                        alt="GitHub Repository"
                        style={githubIconStyle}
                    />
                </a>
            )}
        </div>
    );
};

export default ControlPanel;
