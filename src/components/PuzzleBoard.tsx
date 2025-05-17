import React, { useEffect, useRef, useState } from "react";
import Piece from "./Piece";
import type { BoardPosition } from "../types/puzzle";
import type { MotifStyle } from "../App";

interface PuzzleBoardProps {
    width: number;
    height: number;
    board: BoardPosition[];
    motifStyle: MotifStyle;
    rotationMap: Record<number, number>;
    onDropPiece: (index: number, pieceId: number, rotation: number, originalIndex: number) => void; // Added originalIndex
    onRemovePiece: (index: number) => void;
    onRotatePiece: (index: number) => void;
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
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState(60);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const padding = 8;

    useEffect(() => {
        const updateSize = () => {
            const container = containerRef.current;
            if (!container) return;
            const { clientWidth, clientHeight } = container;
            const availableGridWidth = clientWidth - (padding * 2);
            const availableGridHeight = clientHeight - (padding * 2);
            const maxSquareWidth = availableGridWidth / width;
            const maxSquareHeight = availableGridHeight / height;
            let newSize = Math.floor(Math.min(maxSquareWidth, maxSquareHeight));
            newSize = Math.min(newSize, MAX_PIECE_SIZE);
            newSize = Math.max(newSize, MIN_PIECE_SIZE);
            setSquareSize(newSize);
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [width, height, padding]);

    const handleDrop = (e: React.DragEvent, index: number) => {
        // console.log(`PuzzleBoard: Drop event fired on index ${index}`); // Removed debugging log
        e.preventDefault(); // Crucial for drop to work
        setDragOverIndex(null);

        const pieceIdStr = e.dataTransfer.getData("text/plain"); // Use text/plain
        const rotationStr = e.dataTransfer.getData("rotation"); // Keep this key for rotation
        const originalIndexStr = e.dataTransfer.getData("originalIndex"); // Get original index

        // --- Removed detailed logging for raw dataTransfer values ---
        // console.log(`PuzzleBoard: Raw dataTransfer.getData("text/plain"): "${pieceIdStr}"`);
        // console.log(`PuzzleBoard: Raw dataTransfer.getData("rotation"): "${rotationStr}"`);
        // console.log(`PuzzleBoard: Raw dataTransfer.getData("originalIndex"): "${originalIndexStr}"`);
        // ---------------------------------------------------------

        const pieceId = parseInt(pieceIdStr, 10);
        const rotationPalette = parseInt(rotationStr, 10) || 0;
        const originalIndex = parseInt(originalIndexStr, 10); // Parse original index

        // console.log(`PuzzleBoard: Parsed pieceId: ${pieceId}, Parsed rotation: ${rotationPalette}, Parsed originalIndex: ${originalIndex}`); // Removed debugging log

        if (!isNaN(pieceId)) {
            // Pass originalIndex to the drop handler in App.tsx
            onDropPiece(index, pieceId, rotationPalette, originalIndex);
        } else {
            // console.log("PuzzleBoard: Dropped item did not have a valid pieceId."); // Removed debugging log
            // console.log("Available data types:", e.dataTransfer.types); // Removed debugging log
        }
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        // console.log(`PuzzleBoard: DragOver event fired on index ${index}`); // Keep this if needed, but can be noisy
        e.preventDefault(); // Crucial for drop to work
        if (index !== dragOverIndex) {
            setDragOverIndex(index);
        }
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragLeaveCell = () => { // Renamed to avoid conflict with board's onDragLeave
        setDragOverIndex(null);
    };

    // Passed the piece's index to this handler
    const handleDragStartBoardPiece = (e: React.DragEvent, pieceId: number, rotationValue: number, originalIndex: number) => {
        // console.log(`PuzzleBoard: Dragging board piece ID ${pieceId} from index ${originalIndex} with rotation ${rotationValue} started.`); // Removed debugging log
        // console.log(`PuzzleBoard: Setting dataTransfer - pieceId: ${pieceId}, rotation: ${rotationValue}, originalIndex: ${originalIndex}`); // Removed debugging log
        e.dataTransfer.setData("text/plain", pieceId.toString()); // Explicitly set data type
        e.dataTransfer.setData("rotation", rotationValue.toString()); // Keep this key for rotation
        e.dataTransfer.setData("originalIndex", originalIndex.toString()); // Store the original index
        e.dataTransfer.effectAllowed = "move";
    };

    const handleContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        if (board[index]?.piece) {
            onRemovePiece(index);
        }
    };

    const gridGap = Math.max(1, Math.floor(squareSize * 0.03));

    return (
        <div
            ref={containerRef}
            style={{
                flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center",
                overflow: "hidden", padding: `${padding}px`, width: "100%", height: "100%",
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
            >
                {board.map((cell, index) => {
                    const isHovered = index === dragOverIndex;
                    const cellPiece = cell.piece;
                    const pieceRotationValue = cellPiece ? rotationMap[cellPiece.id] ?? 0 : 0;

                    return (
                        <div
                            // --- Corrected Key: Use x and y coordinates for stable key ---
                            key={`${cell.x}-${cell.y}`}
                            // -------------------------------------------------------------
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeaveCell} // Use cell-specific drag leave
                            // --- Add native ondrop listener for debugging empty cells ---
                            ref={node => {
                                if (node && !cellPiece) { // Only for empty cells
                                    node.ondrop = () => {
                                        // console.log(`Native ondrop fired on empty cell index ${index}`); // Removed debugging log
                                        // Do NOT call preventDefault here to avoid interfering with React's handler
                                    };
                                } else if (node) {
                                    // If cell becomes occupied, remove the native listener
                                    node.ondrop = null;
                                }
                            }}
                            // -------------------------------------------------------------
                            style={{
                                width: squareSize,
                                height: squareSize,
                                backgroundColor: isHovered ? "#777" : "#5D5D5D",
                                border: `1px solid ${isHovered ? "#999" : "#666"}`,
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background-color 0.2s ease",
                                // --- Added style for empty cells during drag to visualize drop target ---
                                // Keeping the visual indicator but removing the drop-preview div
                                ...(isHovered && !cellPiece && {
                                    outline: '2px dashed #999', // Make drop target visible
                                    outlineOffset: '-4px',
                                    backgroundColor: 'rgba(150, 150, 150, 0.3)', // Change background slightly
                                }),
                                // -----------------------------------------------------------------------
                            }}
                        >
                            {cellPiece && (
                                <div
                                    draggable
                                    // Pass the current index to the drag start handler
                                    onDragStart={(e) => handleDragStartBoardPiece(e, cellPiece.id, pieceRotationValue, index)}
                                    onContextMenu={(e) => handleContextMenu(e, index)}
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
                            {/* --- Removed the !cellPiece && isHovered drop-preview-indicator div --- */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PuzzleBoard;
