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
    initialTopOffset?: number; // This will now be influenced by ControlPanel's content visibility
}

const MIN_WIDTH = 220;
const MIN_HEIGHT = 200;
const MARGIN_RIGHT = 12;
const MARGIN_BOTTOM = 12;
const PALETTE_MARGIN_TOP_FALLBACK = 40; // Default top margin if ControlPanel content is hidden (to clear hamburger/git icon)
const TITLEBAR_HEIGHT = 28;

const PiecePalette: React.FC<PiecePaletteProps> = ({
    placedPieceIds,
    motifStyle,
    onDragStart,
    onDragEnd,
    onRotatePiece,
    pieceRotations,
    onClose,
    initialTopOffset,
}) => {
    const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));

    const initialWidth = 300;
    // Use the provided initialTopOffset (which considers ControlPanel state) or fallback
    const effectiveInitialTop = initialTopOffset !== undefined ? initialTopOffset : PALETTE_MARGIN_TOP_FALLBACK;

    const calculatedInitialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - effectiveInitialTop - MARGIN_BOTTOM, window.innerHeight * 0.55));
    const initialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);

    const [dimensions, setDimensions] = useState({ width: initialWidth, height: calculatedInitialHeight });
    const [position, setPosition] = useState({ top: effectiveInitialTop, left: initialLeft });
    const dragOffset = useRef({ x: 0, y: 0 });
    const isInitialized = useRef(false);

    useEffect(() => {
        // This effect now correctly uses effectiveInitialTop which is derived from the prop or a fallback.
        // It helps in setting the initial state correctly.
        if (!isInitialized.current) {
            const newInitialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - effectiveInitialTop - MARGIN_BOTTOM, window.innerHeight * 0.55));
            const newInitialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);

            setPosition({ top: effectiveInitialTop, left: newInitialLeft });
            setDimensions({ width: initialWidth, height: newInitialHeight });
            isInitialized.current = true;
        }
    }, [effectiveInitialTop, initialWidth]); // Depend on effectiveInitialTop


    useEffect(() => {
        const handleWindowResize = () => {
            if (!isInitialized.current) return;

            const currentTop = position.top; // Use current position.top
            const newAvailableHeight = window.innerHeight - currentTop - MARGIN_BOTTOM;
            const newHeight = Math.max(MIN_HEIGHT, Math.min(dimensions.height, newAvailableHeight));

            setPosition((pos) => ({
                top: Math.min(
                    // Allow dragging up to a minimal margin, or the original offset if it was higher
                    Math.max(PALETTE_MARGIN_TOP_FALLBACK, pos.top),
                    window.innerHeight - TITLEBAR_HEIGHT - MARGIN_BOTTOM
                ),
                left: Math.min(
                    Math.max(MARGIN_RIGHT, pos.left),
                    window.innerWidth - dimensions.width - MARGIN_RIGHT
                ),
            }));
            setDimensions(dims => ({
                width: Math.max(MIN_WIDTH, Math.min(dims.width, window.innerWidth - MARGIN_RIGHT * 2)),
                height: newHeight
            }));
        };

        window.addEventListener("resize", handleWindowResize);
        // Call once on mount if initialized, to ensure correct sizing based on initial position
        if (isInitialized.current) handleWindowResize();


        return () => window.removeEventListener("resize", handleWindowResize);
    }, [dimensions.width, dimensions.height, position.top]); // Reworked dependencies


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

            // When dragging, ensure it doesn't go above a certain minimum (like PALETTE_MARGIN_TOP_FALLBACK)
            // or the initial offset if that was dynamically set to be lower (e.g. when control panel is visible)
            const minTopForDragging = initialTopOffset !== undefined ? Math.min(initialTopOffset, PALETTE_MARGIN_TOP_FALLBACK) : PALETTE_MARGIN_TOP_FALLBACK;

            const clampedTop = Math.min(window.innerHeight - dimensions.height - MARGIN_BOTTOM, Math.max(minTopForDragging, proposedTop));
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

    const titleBarStyle: React.CSSProperties = {
        cursor: "move",
        backgroundColor: "#282c34",
        color: "white",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        userSelect: "none",
        borderBottom: "1px solid #4a4a4a",
        height: `${TITLEBAR_HEIGHT}px`,
        fontSize: "0.875rem",
        fontWeight: "normal",
    };

    const closeButtonStyle: React.CSSProperties = {
        border: 'none',
        background: 'transparent',
        fontSize: '1.2rem',
        cursor: 'pointer',
        color: '#b0b0b0',
        padding: "0 5px",
    };


    return (
        <div
            style={{
                position: "fixed", top: position.top, left: position.left,
                width: dimensions.width, height: dimensions.height,
                backgroundColor: "#3a3a3a",
                color: "white",
                border: "1px solid #4a4a4a",
                borderRadius: "6px", display: "flex", flexDirection: "column",
                zIndex: 400, // Lower z-index than ControlPanel's floating bar
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT, overflow: "hidden",
            }}
        >
            <div
                onMouseDown={handleMoveStart}
                style={titleBarStyle}
            >
                <span style={{ fontWeight: "bold" }}>Piece Palette ({unplacedPieces.length})</span>
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
                    height: "14px", cursor: "nwse-resize", backgroundColor: "#555",
                    borderTopLeftRadius: "4px", zIndex: 1001, // Keep high for resize handle
                }}
            />
        </div>
    );
};

export default PiecePalette;
