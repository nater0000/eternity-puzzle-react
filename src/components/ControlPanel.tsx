import React, { useRef, useLayoutEffect } from 'react';
import type { MotifStyle } from '../App';
import githubIconSrc from '/git.png';

interface ControlPanelProps {
    motifStyle: MotifStyle;
    setMotifStyle: (style: MotifStyle) => void;
    motifStyles: MotifStyle[];
    onClearBoard: () => void;
    onRotateBoard: () => void;
    isPiecePaletteVisible: boolean;
    togglePiecePalette: () => void;
    githubRepoUrl?: string;
    reportHeight: (height: number) => void;
    isContentVisible: boolean;
    toggleContentVisibility: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    motifStyle,
    setMotifStyle,
    motifStyles,
    onClearBoard,
    onRotateBoard,
    isPiecePaletteVisible,
    togglePiecePalette,
    githubRepoUrl,
    reportHeight,
    isContentVisible,
    toggleContentVisibility
}) => {
    const outermostPanelRef = useRef<HTMLDivElement>(null);
    const panelContentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (reportHeight) {
            if (isContentVisible && outermostPanelRef.current) {
                reportHeight(outermostPanelRef.current.offsetHeight);
            } else {
                reportHeight(0);
            }
        }
    }, [isContentVisible, reportHeight, motifStyle, isPiecePaletteVisible]);

    const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMotifStyle(event.target.value as MotifStyle);
    };

    const commonButtonStyles: React.CSSProperties = {
        marginLeft: '6px', padding: '2px 6px', fontSize: '0.875rem', // 14px
        border: '1px solid #555', borderRadius: '4px', background: '#3a3a3a',
        color: 'white', cursor: 'pointer', minWidth: '90px',
        textAlign: 'center', lineHeight: '1.4', // Approx 19.6px line height
        height: 'calc(0.875rem * 1.4 + 2px * 2 + 2px)', // font-size * line-height + padding-top/bottom + border-top/bottom
    };

    const selectStyle: React.CSSProperties = {
        padding: '2px 4px', fontSize: '0.875rem', background: '#333',
        color: 'white', border: '1px solid #555', borderRadius: '4px',
        marginLeft: '6px', lineHeight: '1.4',
        height: 'calc(0.875rem * 1.4 + 2px * 2 + 2px)', // Match button height
    };

    // Adjusted Hamburger Button Style
    const hamburgerButtonStyle: React.CSSProperties = {
        background: 'none', border: 'none', color: 'white',
        fontSize: '1rem', // Reduced font size (was 1.4rem). Adjust as needed for "☰" character.
        cursor: 'pointer',
        padding: '2px 6px', // Match vertical padding of other buttons
        marginRight: '8px',
        pointerEvents: 'auto', zIndex: 1,
        display: 'flex', // For better control over centering the icon if needed
        alignItems: 'center', // Vertically center the "☰" character within the button's padding box
        justifyContent: 'center',
        lineHeight: '1', // Set line height to 1 to prevent extra space from the font itself
        // Ensure its height matches other buttons for alignment by parent flexbox
        // Height will be determined by font-size, line-height, and padding.
        // Explicit height can be set if needed, similar to commonButtonStyles
        height: commonButtonStyles.height, // Match height of other buttons
    };

    const githubIconStyle: React.CSSProperties = {
        height: '22px', width: '22px', verticalAlign: 'middle',
        borderRadius: '50%', border: '1px solid #4a4a4a',
    };

    const githubLinkStyle: React.CSSProperties = {
        marginLeft: 'auto', display: 'flex', alignItems: 'center',
        padding: '0 6px', pointerEvents: 'auto', zIndex: 1,
        height: commonButtonStyles.height, // Match height for alignment
    };

    const floatingBarStyle: React.CSSProperties = {
        position: 'absolute', top: 0, left: 0, width: '100%',
        padding: '4px 8px',
        display: 'flex', alignItems: 'center', // This centers children vertically
        zIndex: 500, boxSizing: 'border-box',
        backgroundColor: isContentVisible ? '#282c34' : 'transparent',
        boxShadow: isContentVisible ? '0 2px 5px rgba(0,0,0,0.3)' : 'none',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        pointerEvents: isContentVisible ? 'auto' : 'none',
        minHeight: `calc(${commonButtonStyles.height} + 4px * 2)` // Ensure floating bar is tall enough for its padding + button height
    };

    const contentAreaStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', flexGrow: 1,
        justifyContent: 'flex-start', pointerEvents: 'auto',
    };

    return (
        <div ref={outermostPanelRef} style={floatingBarStyle}>
            <button
                onClick={toggleContentVisibility}
                style={hamburgerButtonStyle}
                title={isContentVisible ? "Hide Controls" : "Show Controls"}
            >
                ☰
            </button>

            {isContentVisible && (
                <div ref={panelContentRef} style={contentAreaStyle}>
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

            {isContentVisible ?
                <div style={{ flexGrow: 1, pointerEvents: 'none' }}></div> :
                <div style={{ flexGrow: 1, pointerEvents: 'none' }}></div>
            }

            {githubRepoUrl && (
                <a
                    href={githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View project on GitHub"
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
