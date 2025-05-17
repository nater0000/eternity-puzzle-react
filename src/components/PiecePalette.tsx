import React, { useState, useEffect, useRef } from "react";
import { allPieces } from "../data/pieces";
import Piece from "./Piece";
import type { MotifStyle } from "../App"; // Assuming App exports MotifStyle

interface PiecePaletteProps {
    placedPieceIds: Set<number>;
    motifStyle: MotifStyle;
    onDragStart: (id: number, rotation: number) => void;
    onDragEnd: () => void;
    onRotatePiece: (id: number, currentRotation: number) => void;
    pieceRotations: Record<number, number>;
    onClose: () => void;
    initialTopOffset?: number; // New prop for initial top position based on ControlPanel height
}

const MIN_WIDTH = 220; // Slightly increased min width
const MIN_HEIGHT = 200; // Increased min height for "taller" start
const MARGIN_RIGHT = 12;
const MARGIN_BOTTOM = 12;
// MARGIN_TOP is now effectively controlled by initialTopOffset, but keep for clamping
const PALETTE_MARGIN_TOP_FALLBACK = 8;
const TITLEBAR_HEIGHT = 28; // Adjusted to better match ControlPanel's new smaller height

const PiecePalette: React.FC<PiecePaletteProps> = ({
    placedPieceIds,
    motifStyle,
    onDragStart,
    onDragEnd,
    onRotatePiece,
    pieceRotations,
    onClose,
    initialTopOffset, // Use this for initial positioning
}) => {
    const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));

    const initialWidth = 300;
    // Make it taller: use a larger portion of window height, and increased MIN_HEIGHT
    const calculatedInitialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - (initialTopOffset || PALETTE_MARGIN_TOP_FALLBACK) - MARGIN_BOTTOM, window.innerHeight * 0.55));

    // Use initialTopOffset if provided, otherwise fallback to a small margin from top of viewport
    const initialTop = initialTopOffset || PALETTE_MARGIN_TOP_FALLBACK;
    const initialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);

    const [dimensions, setDimensions] = useState({ width: initialWidth, height: calculatedInitialHeight });
    const [position, setPosition] = useState({ top: initialTop, left: initialLeft });
    const dragOffset = useRef({ x: 0, y: 0 });
    const isInitialized = useRef(false); // To prevent initial useEffect from overriding calculated position

    // Effect to set initial position and dimensions once initialTopOffset is available
    useEffect(() => {
        if (initialTopOffset && !isInitialized.current) {
            const newInitialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - initialTopOffset - MARGIN_BOTTOM, window.innerHeight * 0.55));
            const newInitialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);

            setPosition({ top: initialTopOffset, left: newInitialLeft });
            setDimensions({ width: initialWidth, height: newInitialHeight });
            isInitialized.current = true;
        }
    }, [initialTopOffset, initialWidth]);


    useEffect(() => {
        // This effect now primarily handles window resize adjustments AFTER initial setup
        const handleWindowResize = () => {
            if (!isInitialized.current) return; // Don't run if not yet initialized with offset

            const newAvailableHeight = window.innerHeight - (position.top) - MARGIN_BOTTOM; // Use current top
            const currentHeight = dimensions.height;
            const newHeight = Math.max(MIN_HEIGHT, Math.min(currentHeight, newAvailableHeight));
            const currentWidth = dimensions.width;

            setPosition((pos) => ({
                top: Math.min(
                    Math.max(PALETTE_MARGIN_TOP_FALLBACK, pos.top), // Ensure it doesn't go above a minimum top margin
                    window.innerHeight - TITLEBAR_HEIGHT - MARGIN_BOTTOM
                ),
                left: Math.min(
                    Math.max(MARGIN_RIGHT, pos.left),
                    window.innerWidth - currentWidth - MARGIN_RIGHT
                ),
            }));
            setDimensions(dims => ({
                width: Math.max(MIN_WIDTH, Math.min(dims.width, window.innerWidth - MARGIN_RIGHT * 2)),
                height: newHeight
            }));
        };

        window.addEventListener("resize", handleWindowResize);
        // Initial call might not be needed if first useEffect handles it, or call it if initialTopOffset is not provided
        if (!initialTopOffset) {
            handleWindowResize();
        }

        return () => window.removeEventListener("resize", handleWindowResize);
    }, [dimensions.height, dimensions.width, initialTopOffset, position.top]); // Added dependencies


    const handlePalettePieceClick = (id: number) => {
        const currentRotation = pieceRotations[id] || 0;
        onRotatePiece(id, currentRotation);
    };

    const handlePalettePieceContextMenu = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        const currentRotation = pieceRotations[id] || 0;
        onRotatePiece(id, (currentRotation + 3) % 4);
    };

    const handleDragStart = (e: React.DragEvent, id: number, rotation: number) => {
        e.dataTransfer.setData("text/plain", String(id));
        e.dataTransfer.setData("rotation", String(rotation));
        e.dataTransfer.effectAllowed = "move";
        onDragStart(id, rotation);
    };

    const handleResizeGesture = (e: React.MouseEvent) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = dimensions.width;
        const startHeight = dimensions.height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(MIN_WIDTH, Math.min(startWidth + (moveEvent.clientX - startX), window.innerWidth - position.left - MARGIN_RIGHT));
            const newHeight = Math.max(MIN_HEIGHT, Math.min(startHeight + (moveEvent.clientY - startY), window.innerHeight - position.top - MARGIN_BOTTOM));
            setDimensions({ width: newWidth, height: newHeight });
        };
        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const handleMoveStart = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-resize-handle]')) return;

        e.preventDefault();
        dragOffset.current = { x: e.clientX - position.left, y: e.clientY - position.top };

        const onMouseMove = (moveEvent: MouseEvent) => {
            const proposedLeft = moveEvent.clientX - dragOffset.current.x;
            const proposedTop = moveEvent.clientY - dragOffset.current.y;

            // Ensure palette top respects the initialTopOffset as a minimum when dragging
            const minTop = initialTopOffset ? Math.max(PALETTE_MARGIN_TOP_FALLBACK, initialTopOffset) : PALETTE_MARGIN_TOP_FALLBACK;

            const clampedTop = Math.min(window.innerHeight - dimensions.height - MARGIN_BOTTOM, Math.max(minTop, proposedTop));
            const clampedLeft = Math.min(window.innerWidth - dimensions.width - MARGIN_RIGHT, Math.max(MARGIN_RIGHT, proposedLeft));
            setPosition({ top: clampedTop, left: clampedLeft });
        };
        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    // Styles for the title bar to match ControlPanel
    const titleBarStyle: React.CSSProperties = {
        cursor: "move",
        backgroundColor: "#282c34", // Match ControlPanel background
        color: "white",             // Match ControlPanel text color
        padding: "4px 8px",         // Match ControlPanel vertical padding
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        userSelect: "none",
        borderBottom: "1px solid #4a4a4a", // Slightly darker border
        height: `${TITLEBAR_HEIGHT}px`,
        fontSize: "0.875rem", // Match ControlPanel font size
        fontWeight: "normal", // ControlPanel text is not bold by default
    };

    const closeButtonStyle: React.CSSProperties = {
        border: 'none',
        background: 'transparent',
        fontSize: '1.2rem', // Adjusted for new title bar height
        cursor: 'pointer',
        color: '#b0b0b0', // Lighter color for close button on dark background
        padding: "0 5px",
    };


    return (
        <div
            style={{
                position: "fixed", top: position.top, left: position.left,
                width: dimensions.width, height: dimensions.height,
                backgroundColor: "#3a3a3a", // Slightly lighter background for palette content area
                color: "white",
                border: "1px solid #4a4a4a", // Border to match general theme
                borderRadius: "6px", display: "flex", flexDirection: "column",
                zIndex: 999, // Ensure it's below notification banner (1000) but above board
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT, overflow: "hidden",
            }}
        >
            <div
                onMouseDown={handleMoveStart}
                style={titleBarStyle} // Apply new title bar styles
            >
                <span style={{ fontWeight: "bold" }}>Piece Palette ({unplacedPieces.length})</span> {/* Kept bold for emphasis */}
                <button onClick={onClose} style={closeButtonStyle} title="Close Palette" > × </button>
            </div>

            <div style={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", padding: "8px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: "8px" }} >
                    {unplacedPieces.map((piece) => {
                        const rotationValue = pieceRotations[piece.id] || 0;
                        return (
                            <div
                                key={piece.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, piece.id, rotationValue)}
                                onDragEnd={onDragEnd}
                                onClick={() => handlePalettePieceClick(piece.id)}
                                onContextMenu={(e) => handlePalettePieceContextMenu(e, piece.id)}
                                style={{ cursor: "grab", aspectRatio: '1 / 1' }}
                                title={`Piece ${piece.id}\nEdges: ${piece.edges.join(',')}\nRotation: ${rotationValue * 90}°\nClick to rotate, Drag to place`}
                            >
                                <Piece
                                    id={piece.id} edges={piece.edges}
                                    rotation={rotationValue * 90}
                                    isDragging={false}
                                    motifStyle={motifStyle}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                data-resize-handle
                onMouseDown={handleResizeGesture}
                style={{
                    position: "absolute", right: 0, bottom: 0, width: "14px",
                    height: "14px", cursor: "nwse-resize", backgroundColor: "#555", // Darker resize handle
                    borderTopLeftRadius: "4px", zIndex: 1001,
                }}
            />
        </div>
    );
};

export default PiecePalette;
