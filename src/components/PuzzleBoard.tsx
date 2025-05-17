import React, { useRef, useState, useLayoutEffect } from "react";
import Piece from "./Piece";
import type { BoardPosition } from "../types/puzzle";
import type { MotifStyle } from "../App";

interface PuzzleBoardProps {
    width: number;
    height: number;
    board: BoardPosition[];
    motifStyle: MotifStyle;
    rotationMap: Record<number, number>;
    onDropPiece: (index: number, pieceId: number, rotation: number, originalIndex: number) => void;
    onRemovePiece: (index: number) => void;
    onRotatePiece: (index: number) => void;
    controlPanelSpace: number; // New prop: The space taken by the control panel
}

const MAX_PIECE_SIZE = 120;
const MIN_PIECE_SIZE = 17;

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
    width,
    height,
    board,
    motifStyle,
    rotationMap,
    onDropPiece,
    onRemovePiece,
    onRotatePiece,
    controlPanelSpace, // Use this prop
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState(60);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const padding = 8;

    // useLayoutEffect is better for DOM measurements that affect layout
    useLayoutEffect(() => {
        const updateSize = () => {
            const container = containerRef.current;
            if (!container) return;

            // clientWidth/Height are the dimensions of containerRef (the outer div of PuzzleBoard)
            // These dimensions are affected by the parent's (board-wrapper) padding and height.
            const availableGridWidth = container.clientWidth - (padding * 2);
            const availableGridHeight = container.clientHeight - (padding * 2);

            const maxSquareWidth = availableGridWidth / width;
            const maxSquareHeight = availableGridHeight / height;
            let newSize = Math.floor(Math.min(maxSquareWidth, maxSquareHeight));
            newSize = Math.min(newSize, MAX_PIECE_SIZE);
            newSize = Math.max(newSize, MIN_PIECE_SIZE);

            // Only update if the size actually changes to prevent potential infinite loops
            // if something else in the effect causes a re-render.
            setSquareSize(currentSize => currentSize !== newSize ? newSize : currentSize);
        };

        updateSize(); // Initial size calculation

        // Also listen to window resize for general responsiveness
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);

        // Add controlPanelSpace to dependencies. When it changes, PuzzleBoard's container size effectively changes.
    }, [width, height, padding, controlPanelSpace]);

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(null);

        const pieceIdStr = e.dataTransfer.getData("text/plain");
        const rotationStr = e.dataTransfer.getData("rotation");
        const originalIndexStr = e.dataTransfer.getData("originalIndex");

        const pieceId = parseInt(pieceIdStr, 10);
        const rotationPalette = parseInt(rotationStr, 10) || 0;
        const originalIndex = parseInt(originalIndexStr, 10);

        if (!isNaN(pieceId)) {
            onDropPiece(index, pieceId, rotationPalette, originalIndex);
        }
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (index !== dragOverIndex) {
            setDragOverIndex(index);
        }
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragLeaveCell = () => {
        setDragOverIndex(null);
    };

    const handleDragStartBoardPiece = (e: React.DragEvent, pieceId: number, rotationValue: number, originalIndex: number) => {
        e.dataTransfer.setData("text/plain", pieceId.toString());
        e.dataTransfer.setData("rotation", rotationValue.toString());
        e.dataTransfer.setData("originalIndex", originalIndex.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handlePieceContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (board[index]?.piece) {
            onRemovePiece(index);
        }
    };

    const handleGridContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const gridGap = Math.max(1, Math.floor(squareSize * 0.03));

    return (
        <div
            ref={containerRef}
            style={{
                flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center",
                overflow: "hidden",
                padding: `${padding}px`,
                width: "100%", height: "100%",
                boxSizing: 'border-box'
            }}
            onDragLeave={() => setDragOverIndex(null)}
        >
            <div
                style={{
                    display: "grid", gridTemplateColumns: `repeat(${width}, ${squareSize}px)`,
                    gridTemplateRows: `repeat(${height}, ${squareSize}px)`, gap: `${gridGap}px`,
                    border: "1px solid #333", backgroundColor: "#4a4a4a",
                }}
                onContextMenu={handleGridContextMenu}
            >
                {board.map((cell, index) => {
                    const isHovered = index === dragOverIndex;
                    const cellPiece = cell.piece;
                    const pieceRotationValue = cellPiece ? rotationMap[cellPiece.id] ?? 0 : 0;

                    return (
                        <div
                            key={`${cell.x}-${cell.y}`}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeaveCell}
                            style={{
                                width: squareSize, height: squareSize,
                                backgroundColor: isHovered ? "#777" : "#5D5D5D",
                                border: `1px solid ${isHovered ? "#999" : "#666"}`,
                                position: "relative", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                transition: "background-color 0.2s ease",
                                ...(isHovered && !cellPiece && {
                                    outline: '2px dashed #999',
                                    outlineOffset: '-4px',
                                    backgroundColor: 'rgba(150, 150, 150, 0.3)',
                                }),
                            }}
                        >
                            {cellPiece && (
                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStartBoardPiece(e, cellPiece.id, pieceRotationValue, index)}
                                    onContextMenu={(e) => handlePieceContextMenu(e, index)}
                                    onClick={() => onRotatePiece(index)}
                                    style={{ width: "100%", height: "100%", cursor: "grab" }}
                                    title={`Piece ${cellPiece.id} (Rot: ${pieceRotationValue * 90}°)\nEdges: ${cellPiece.edges.join(',')}\nClick to rotate, Right-click to remove, Drag to move`}
                                >
                                    <Piece
                                        id={cellPiece.id} edges={cellPiece.edges}
                                        rotation={pieceRotationValue * 90}
                                        isDragging={false}
                                        motifStyle={motifStyle}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PuzzleBoard;
