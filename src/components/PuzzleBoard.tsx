import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import PieceComponent from "./Piece";
import type { BoardPosition, Piece as PieceDataType, DndDraggablePieceItem, PreviewPieceData } from "../types/puzzle";
import { ItemTypes } from "../types/puzzle";
import type { MotifStyle } from "../App"; // Assuming App exports MotifStyle
import { allPieces } from "../data/pieces";
// Assuming PlacementValidityResult is exported from App.tsx or types/puzzle.ts
// If it's in App.tsx and not exported, you might need to define it here or import it.
// For this example, let's assume it's imported from App or types.
import type { PlacementValidityResult } from "../App"; // Or from "../types/puzzle" if moved there

const MAX_PIECE_SIZE = 120;
const MIN_PIECE_SIZE = 17;
interface PuzzleBoardCellProps {
    cellData: BoardPosition;
    cellIndex: number;
    squareSize: number;
    motifStyle: MotifStyle;
    rotationMap: Record<number, number>;
    onPieceDrop: (targetCellIndex: number, draggedItem: DndDraggablePieceItem) => void;
    onRemovePiece: (index: number) => void;
    onRotatePiece: (index: number) => void;

    previewPiece: PreviewPieceData | null;
    setPreviewPiece: (preview: PreviewPieceData | null) => void;
    previewCellIndex: number | null;
    setPreviewCellIndex: (index: number | null) => void;
    isPreviewDropValid: boolean;
    setIsPreviewDropValid: (isValid: boolean) => void;
    determinePlacementValidityAndRotation: (
        pieceEdges: [string, string, string, string],
        initialRotationStep: number,
        targetX: number,
        targetY: number,
        boardWidth: number,
        boardHeight: number
    ) => PlacementValidityResult; // Use the prop from App.tsx
    currentlyDraggedItem: DndDraggablePieceItem | null;
    setCurrentlyDraggedItem: (item: DndDraggablePieceItem | null) => void;
    clearAllDragStates: () => void;
    boardWidth: number;
    boardHeight: number;
}

const BoardCell: React.FC<PuzzleBoardCellProps> = ({
    cellData, cellIndex, squareSize, motifStyle, rotationMap,
    onPieceDrop, onRemovePiece, onRotatePiece,
    previewPiece, setPreviewPiece, previewCellIndex, setPreviewCellIndex,
    isPreviewDropValid, setIsPreviewDropValid, determinePlacementValidityAndRotation,
    currentlyDraggedItem, setCurrentlyDraggedItem, clearAllDragStates,
    boardWidth, boardHeight
}) => {
    const originalCellPiece = cellData.piece;
    const originalPieceRotationStep = originalCellPiece ? rotationMap[originalCellPiece.id] ?? 0 : 0;

    const [{ isOver, canDrop: canDropOnCell }, dropRef] = useDrop(() => ({
        accept: ItemTypes.PIECE,
        hover: (item: DndDraggablePieceItem, monitor) => {
            if (!monitor.isOver({ shallow: true })) {
                // If not hovering this cell anymore, but it was the preview target, clear its specific preview
                if (previewCellIndex === cellIndex) {
                    // Let App.tsx handle clearing based on new hover target or drag end
                }
                return;
            }

            const targetX = cellIndex % boardWidth;
            const targetY = Math.floor(cellIndex / boardWidth);

            const validityResult = determinePlacementValidityAndRotation(
                item.edges,
                item.currentRotationStep, // Pass the item's current actual drag rotation as initial
                targetX, targetY, boardWidth, boardHeight
            );

            setPreviewCellIndex(cellIndex); // Mark this cell as the current hover target
            setIsPreviewDropValid(validityResult.isValid);

            if (validityResult.isValid && validityResult.fittingRotationStep !== undefined) {
                // If valid and a fitting rotation was found, update the preview piece with that rotation
                setPreviewPiece({
                    id: item.id,
                    edges: item.edges,
                    currentRotationStep: validityResult.fittingRotationStep
                });
            } else {
                // If not valid, or no specific fitting rotation (e.g. center piece, or no valid rotation found for edge/corner)
                // show preview with its current dragged rotation (it will be styled as invalid by isPreviewDropValid).
                setPreviewPiece({
                    id: item.id,
                    edges: item.edges,
                    currentRotationStep: item.currentRotationStep // Use original drag rotation for preview if not valid or no fit found
                });
            }
        },
        canDrop: (item: DndDraggablePieceItem) => {
            const targetX = cellIndex % boardWidth;
            const targetY = Math.floor(cellIndex / boardHeight);
            const validityResult = determinePlacementValidityAndRotation(item.edges, item.currentRotationStep, targetX, targetY, boardWidth, boardHeight);
            return validityResult.isValid;
        },
        drop: (item: DndDraggablePieceItem, monitor) => {
            if (monitor.didDrop()) return;
            onPieceDrop(cellIndex, item);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver({ shallow: true }),
            canDrop: !!monitor.canDrop(),
        }),
    }), [cellIndex, boardWidth, boardHeight, determinePlacementValidityAndRotation, onPieceDrop, setPreviewCellIndex, setIsPreviewDropValid, setPreviewPiece, currentlyDraggedItem]); // Added currentlyDraggedItem to deps for hover logic

    const dndItemForBoardPieceObject: DndDraggablePieceItem | null = originalCellPiece ? {
        id: originalCellPiece.id,
        type: ItemTypes.PIECE,
        edges: originalCellPiece.edges,
        currentRotationStep: originalPieceRotationStep,
        source: 'board',
        originalBoardIndex: cellIndex,
    } : null;

    const [{ isDragging: isThisPieceDragging }, dragSourceRef, connectPieceDragPreview] = useDrag(() => ({
        type: ItemTypes.PIECE,
        item: () => {
            if (dndItemForBoardPieceObject) {
                console.log("[BoardCell] Drag Start from board:", dndItemForBoardPieceObject);
                setCurrentlyDraggedItem(dndItemForBoardPieceObject);
                setPreviewPiece({
                    id: dndItemForBoardPieceObject.id,
                    edges: dndItemForBoardPieceObject.edges,
                    currentRotationStep: dndItemForBoardPieceObject.currentRotationStep,
                });
            }
            return dndItemForBoardPieceObject!;
        },
        canDrag: !!originalCellPiece && !(previewCellIndex === cellIndex && previewPiece),
        end: (_, monitor) => {
            console.log("[BoardCell] Drag End from board. Dropped:", monitor.didDrop());
            clearAllDragStates();
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [originalCellPiece, originalPieceRotationStep, cellIndex, previewCellIndex, previewPiece, setCurrentlyDraggedItem, setPreviewPiece, clearAllDragStates]);

    useEffect(() => {
        if (connectPieceDragPreview) {
            connectPieceDragPreview(getEmptyImage(), { captureDraggingState: true });
        }
    }, [connectPieceDragPreview]);

    const handleCellContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (originalCellPiece && !(previewCellIndex === cellIndex && previewPiece)) {
            onRemovePiece(cellIndex);
        }
    };

    let pieceToDisplay: PieceDataType | null = originalCellPiece;
    let rotationToDisplay: number = originalPieceRotationStep;
    let displayOpacity = 1;
    let currentPieceStyling: React.CSSProperties = {};

    const isThisCellThePreviewTarget = previewCellIndex === cellIndex && previewPiece !== null;

    if (isThisCellThePreviewTarget && previewPiece) {
        const previewPieceFullData = allPieces.find(p => p.id === previewPiece.id);
        if (previewPieceFullData) {
            pieceToDisplay = previewPieceFullData;
            rotationToDisplay = previewPiece.currentRotationStep; // This now uses the auto-rotated step
            if (!isPreviewDropValid) {
                currentPieceStyling = {
                    filter: 'grayscale(60%) brightness(0.7) sepia(1) hue-rotate(-55deg) saturate(5)',
                    opacity: 0.6
                };
            }
        }
    } else if (originalCellPiece && currentlyDraggedItem?.source === 'board' && currentlyDraggedItem?.originalBoardIndex === cellIndex) {
        displayOpacity = 0.2;
    }

    const effectiveIsOverAndCanDrop = isOver && canDropOnCell;
    let cellBorderColor = "#666"; // Default
    let cellBoxShadow = 'none';

    if (isThisCellThePreviewTarget) {
        cellBorderColor = isPreviewDropValid ? "#7FFF00" : "#FF4500";
        cellBoxShadow = `0 0 12px 4px ${isPreviewDropValid ? "rgba(127, 255, 0, 0.7)" : "rgba(255, 69, 0, 0.7)"}`;
    } else if (effectiveIsOverAndCanDrop && currentlyDraggedItem) { // Only show general droppable highlight if an item is actually being dragged over
        cellBorderColor = "#66FF66";
        cellBoxShadow = `0 0 10px 2px rgba(102,255,102,0.5)`;
    }

    return (
        <div
            ref={dropRef}
            style={{
                width: squareSize, height: squareSize,
                backgroundColor: "#5D5D5D",
                border: `2px solid ${cellBorderColor}`,
                position: "relative", display: "flex",
                alignItems: "center", justifyContent: "center",
                transition: "border-color 0.1s ease, box-shadow 0.1s ease",
                boxShadow: cellBoxShadow,
                zIndex: isThisCellThePreviewTarget || effectiveIsOverAndCanDrop ? 2 : 1,
            }}
            onContextMenu={handleCellContextMenu}
        >
            {pieceToDisplay && (
                <div
                    ref={originalCellPiece && !isThisCellThePreviewTarget ? dragSourceRef : null}
                    onClick={() => { if (originalCellPiece && !isThisCellThePreviewTarget) onRotatePiece(cellIndex); }}
                    style={{
                        width: "100%",
                        height: "100%",
                        cursor: (originalCellPiece && !isThisCellThePreviewTarget) ? "grab" : "default",
                        opacity: displayOpacity,
                        ...currentPieceStyling
                    }}
                    title={originalCellPiece && !isThisCellThePreviewTarget ? `Piece ${originalCellPiece.id} (Rot: ${originalPieceRotationStep * 90}°)` : (isThisCellThePreviewTarget ? (isPreviewDropValid ? 'Drop here' : 'Cannot drop here') : '')}
                >
                    <PieceComponent
                        id={pieceToDisplay.id}
                        edges={pieceToDisplay.edges}
                        rotation={rotationToDisplay * 90}
                        isDragging={isThisPieceDragging}
                        motifStyle={motifStyle}
                    />
                </div>
            )}
            {isThisCellThePreviewTarget && (
                <div style={{
                    position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
                    backgroundColor: isPreviewDropValid ? 'rgba(127, 255, 0, 0.1)' : 'rgba(255, 69, 0, 0.1)',
                    pointerEvents: 'none',
                    zIndex: -1,
                }} />
            )}
        </div>
    );
};

interface PuzzleBoardProps {
    width: number;
    height: number;
    board: BoardPosition[];
    motifStyle: MotifStyle;
    rotationMap: Record<number, number>;
    onPieceDrop: (targetCellIndex: number, draggedItem: DndDraggablePieceItem) => void;
    onRemovePiece: (index: number) => void;
    onRotatePiece: (index: number) => void;
    controlPanelSpace: number;

    previewPiece: PreviewPieceData | null;
    setPreviewPiece: (preview: PreviewPieceData | null) => void;
    previewCellIndex: number | null;
    setPreviewCellIndex: (index: number | null) => void;
    isPreviewDropValid: boolean;
    setIsPreviewDropValid: (isValid: boolean) => void;
    determinePlacementValidityAndRotation: (
        pieceEdges: [string, string, string, string],
        initialRotationStep: number,
        targetX: number,
        targetY: number,
        boardWidth: number,
        boardHeight: number
    ) => PlacementValidityResult;
    currentlyDraggedItem: DndDraggablePieceItem | null;
    setCurrentlyDraggedItem: (item: DndDraggablePieceItem | null) => void;
    // clearAllDragStates is passed to BoardCell from App.tsx via PuzzleBoard
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
    width, height, board, motifStyle, rotationMap,
    onPieceDrop, onRemovePiece, onRotatePiece, controlPanelSpace,
    previewPiece, setPreviewPiece, previewCellIndex, setPreviewCellIndex,
    isPreviewDropValid, setIsPreviewDropValid, determinePlacementValidityAndRotation,
    currentlyDraggedItem, setCurrentlyDraggedItem
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState(60);
    const padding = 8;

    useLayoutEffect(() => {
        const updateSize = () => {
            const container = containerRef.current;
            if (!container) return;
            const availableGridWidth = container.clientWidth - (padding * 2);
            const availableGridHeight = container.clientHeight - (padding * 2);
            const maxSquareWidth = availableGridWidth / width;
            const maxSquareHeight = availableGridHeight / height;
            let newSize = Math.floor(Math.min(maxSquareWidth, maxSquareHeight));
            newSize = Math.min(newSize, MAX_PIECE_SIZE);
            newSize = Math.max(newSize, MIN_PIECE_SIZE);
            setSquareSize(currentSize => currentSize !== newSize ? newSize : currentSize);
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [width, height, padding, controlPanelSpace]);

    const gridGap = Math.max(1, Math.floor(squareSize * 0.03));

    const handleGridContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const clearAllAppDragStates = () => {
        setCurrentlyDraggedItem(null);
        setPreviewPiece(null);
        setPreviewCellIndex(null);
        setIsPreviewDropValid(false);
    };

    return (
        <div ref={containerRef} style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", padding: `${padding}px`, width: "100%", height: "100%", boxSizing: 'border-box' }}
            onDragLeave={(e) => {
                if (e.currentTarget === e.target && currentlyDraggedItem) {
                    console.log("[PuzzleBoard] Drag left entire board container.");
                    setPreviewCellIndex(null); // Clear specific cell hover
                    setIsPreviewDropValid(false); // Reset validity
                    // If you want the piece preview to disappear entirely when leaving board, also:
                    // setPreviewPiece(null); 
                    // However, currentlyDraggedItem is cleared by useDrag's end, which might be better.
                }
            }}
        >
            <div
                style={{ display: "grid", gridTemplateColumns: `repeat(${width}, ${squareSize}px)`, gridTemplateRows: `repeat(${height}, ${squareSize}px)`, gap: `${gridGap}px`, border: "1px solid #333", backgroundColor: "#4a4a4a" }}
                onContextMenu={handleGridContextMenu}
            >
                {board.map((cell, index) => (
                    <BoardCell
                        key={`${cell.x}-${cell.y}-${index}`}
                        cellData={cell}
                        cellIndex={index}
                        squareSize={squareSize}
                        motifStyle={motifStyle}
                        rotationMap={rotationMap}
                        onPieceDrop={onPieceDrop}
                        onRemovePiece={onRemovePiece}
                        onRotatePiece={onRotatePiece}
                        previewPiece={previewPiece}
                        setPreviewPiece={setPreviewPiece}
                        previewCellIndex={previewCellIndex}
                        setPreviewCellIndex={setPreviewCellIndex}
                        isPreviewDropValid={isPreviewDropValid}
                        setIsPreviewDropValid={setIsPreviewDropValid}
                        determinePlacementValidityAndRotation={determinePlacementValidityAndRotation}
                        currentlyDraggedItem={currentlyDraggedItem}
                        setCurrentlyDraggedItem={setCurrentlyDraggedItem}
                        clearAllDragStates={clearAllAppDragStates} // Pass the App-level clearer
                        boardWidth={width}
                        boardHeight={height}
                    />
                ))}
            </div>
        </div>
    );
};

export default PuzzleBoard;
