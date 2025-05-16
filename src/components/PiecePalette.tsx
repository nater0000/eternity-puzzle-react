import React, { useState, useEffect, useRef } from "react";
import { allPieces } from "../data/pieces";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

interface PiecePaletteProps {
    placedPieceIds: Set<number>;
    motifStyle: MotifStyle;
    onDragStart: (id: number, rotation: number) => void;
    onDragEnd: () => void;
    onRotatePiece: (id: number, currentRotation: number) => void;
    pieceRotations: Record<number, number>;
    onClose: () => void;
}

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const MARGIN_RIGHT = 12;
const MARGIN_BOTTOM = 12;
const MARGIN_TOP = 8;
const TITLEBAR_HEIGHT = 30;

const PiecePalette: React.FC<PiecePaletteProps> = ({
    placedPieceIds,
    motifStyle,
    onDragStart,
    onDragEnd,
    onRotatePiece,
    pieceRotations,
    onClose,
}) => {
    const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));

    const initialWidth = 300;
    // availableHeight calculation was fine
    const initialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - MARGIN_TOP - MARGIN_BOTTOM, window.innerHeight * 0.4));

    const initialTop = MARGIN_TOP;
    const initialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);

    const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
    const [position, setPosition] = useState({ top: initialTop, left: initialLeft });
    const dragOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleWindowResize = () => {
            const newAvailableHeight = window.innerHeight - MARGIN_TOP - MARGIN_BOTTOM;
            const currentHeight = dimensions.height; // Use current height from state for comparison
            const newHeight = Math.max(MIN_HEIGHT, Math.min(currentHeight, newAvailableHeight));

            const currentWidth = dimensions.width; // Use current width from state

            setPosition((pos) => ({
                top: Math.min(
                    Math.max(MARGIN_TOP, pos.top),
                    window.innerHeight - TITLEBAR_HEIGHT - MARGIN_BOTTOM
                ),
                left: Math.min(
                    Math.max(MARGIN_RIGHT, pos.left),
                    window.innerWidth - currentWidth - MARGIN_RIGHT // Use currentWidth
                ),
            }));
            setDimensions(dims => ({ // dims is previous state for dimensions
                width: Math.max(MIN_WIDTH, Math.min(dims.width, window.innerWidth - MARGIN_RIGHT * 2)),
                height: newHeight
            }));
        };
        window.addEventListener("resize", handleWindowResize);
        handleWindowResize(); // Initial call to set based on window size
        return () => window.removeEventListener("resize", handleWindowResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Dependencies intentionally limited to run mostly on mount


    const handlePalettePieceClick = (id: number) => {
        const currentRotation = pieceRotations[id] || 0;
        onRotatePiece(id, currentRotation); // App.tsx adds 1 to currentRotation
    };

    const handlePalettePieceContextMenu = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        const currentRotation = pieceRotations[id] || 0;
        // To rotate counter-clockwise, App.tsx's onRotatePiece needs to handle this.
        // A simple way: send a signal or a specific value.
        // Or, if onRotatePiece in App always adds 1, send `(currentRotation - 2 + 4) % 4`
        // to achieve a net -1 rotation.
        // For now, let's make it cycle through:
        onRotatePiece(id, (currentRotation + 3) % 4); // Equivalent to (current - 1 + 4) for next state in App
    };

    const handleDragStart = (e: React.DragEvent, id: number, rotation: number) => {
        // console.log(`PiecePalette: Dragging piece ID ${id} with rotation ${rotation} started.`); // Removed debugging log
        // console.log(`PiecePalette: Setting dataTransfer - pieceId: ${id}, rotation: ${rotation}`); // Removed debugging log
        e.dataTransfer.setData("text/plain", String(id)); // Explicitly set data type
        e.dataTransfer.setData("rotation", String(rotation)); // Keep this key for rotation, but can also use text/plain if needed
        e.dataTransfer.effectAllowed = "move";
        onDragStart(id, rotation); // Notify the parent component
    };

    const handleResizeGesture = (e: React.MouseEvent) => { // Renamed to avoid conflict if 'handleResize' is used elsewhere
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
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-resize-handle]')) return; // Check for resize handle too

        e.preventDefault();
        dragOffset.current = { x: e.clientX - position.left, y: e.clientY - position.top };

        const onMouseMove = (moveEvent: MouseEvent) => {
            const proposedLeft = moveEvent.clientX - dragOffset.current.x;
            const proposedTop = moveEvent.clientY - dragOffset.current.y;
            const clampedTop = Math.min(window.innerHeight - dimensions.height - MARGIN_BOTTOM, Math.max(MARGIN_TOP, proposedTop));
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

    return (
        <div
            style={{
                position: "fixed", top: position.top, left: position.left,
                width: dimensions.width, height: dimensions.height,
                backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc",
                borderRadius: "6px", display: "flex", flexDirection: "column",
                zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT, overflow: "hidden",
            }}
        >
            <div
                onMouseDown={handleMoveStart}
                style={{
                    cursor: "move", backgroundColor: "#e0e0e0", padding: "6px 10px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    userSelect: "none", borderBottom: "1px solid #ccc", height: `${TITLEBAR_HEIGHT}px`
                }}
            >
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>Piece Palette ({unplacedPieces.length})</span>
                <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: '#555', padding: "0 5px" }} title="Close Palette" > × </button>
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
                                    rotation={rotationValue * 90} // Pass degrees to Piece
                                    isDragging={false}
                                    motifStyle={motifStyle}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                data-resize-handle // Added for handleMoveStart check
                onMouseDown={handleResizeGesture}
                style={{
                    position: "absolute", right: 0, bottom: 0, width: "14px",
                    height: "14px", cursor: "nwse-resize", backgroundColor: "#ccc",
                    borderTopLeftRadius: "4px", zIndex: 1001,
                }}
            />
        </div>
    );
};

export default PiecePalette;
