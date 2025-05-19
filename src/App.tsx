import React, { useEffect, useState, useCallback, useRef } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ControlPanel from "./components/ControlPanel";
import PiecePalette from "./components/PiecePalette";
import PuzzleBoard from "./components/PuzzleBoard";
import { loadLegacyPuzzle } from "./lib/loadLegacyPuzzle";
import { allPieces } from "./data/pieces";
import type {
    PuzzleBoardData,
    BoardPosition,
    Piece as PieceDataType,
    DndDraggablePieceItem,
    PreviewPieceData
} from "./types/puzzle";
import './App.css';

const gitRepoUrl = "https://github.com/nater0000/eternity-puzzle-react";
const motifStyles = ["svg", "symbol"] as const;
export type MotifStyle = (typeof motifStyles)[number];

const BORDER_MOTIF = 'a';

type PieceTypeClassification = 'corner' | 'edge' | 'center';

// --- Utility functions (getEffectiveEdges, classifyPieceType) ---
const getEffectiveEdges = (edges: [string, string, string, string], rotationStep: number): [string, string, string, string] => {
    const currentEdges = [...edges] as [string, string, string, string];
    if (rotationStep === 0) return currentEdges;
    const N = currentEdges.length;
    const r = ((rotationStep % N) + N) % N;
    const rotated = [];
    for (let i = 0; i < N; i++) {
        rotated.push(currentEdges[(i - r + N) % N]);
    }
    return rotated as [string, string, string, string];
};

const classifyPieceType = (pieceEdges: [string, string, string, string], borderMotif: string): PieceTypeClassification => {
    const borderSides = pieceEdges.filter(edge => edge.toLowerCase() === borderMotif.toLowerCase()).length;
    if (borderSides >= 2) return 'corner';
    if (borderSides === 1) return 'edge';
    return 'center';
};
// --- End Utility Functions ---

// Result type for our enhanced validation function
export interface PlacementValidityResult { // Export if PuzzleBoard needs to know its structure
    isValid: boolean;
    fittingRotationStep?: number; // The rotation step (0-3) that allows the piece to fit
}

const App: React.FC = () => {
    const [puzzleData, setPuzzleData] = useState<PuzzleBoardData | null>(null);
    const [motifStyle, setMotifStyle] = useState<MotifStyle>(motifStyles[0]);
    const [placedPieceIds, setPlacedPieceIds] = useState<Set<number>>(new Set());
    const [pieceRotations, setPieceRotations] = useState<Record<number, number>>({});
    const [isPiecePaletteVisible, setIsPiecePaletteVisible] = useState(true);

    const [isControlPanelContentVisible, setIsControlPanelContentVisible] = useState(true);
    const [controlPanelContentHeight, setControlPanelContentHeight] = useState(0);

    const [notification, setNotification] = useState<{ message: string; id: number } | null>(null);
    const notificationTimeoutRef = useRef<number | null>(null);

    const [previewPiece, setPreviewPiece] = useState<PreviewPieceData | null>(null);
    const [previewCellIndex, setPreviewCellIndex] = useState<number | null>(null);
    const [isPreviewDropValid, setIsPreviewDropValid] = useState<boolean>(false);
    const [currentlyDraggedItem, setCurrentlyDraggedItem] = useState<DndDraggablePieceItem | null>(null);

    const handleControlPanelHeightChange = useCallback((height: number) => {
        setControlPanelContentHeight(prevHeight => prevHeight !== height ? height : prevHeight);
    }, []);

    const toggleControlPanelContent = useCallback(() => {
        setIsControlPanelContentVisible(prev => !prev);
    }, []);

    useEffect(() => {
        document.title = "Eternity II Puzzle Playground";
        const loaded = loadLegacyPuzzle();
        if (loaded) {
            const expectedSize = loaded.width * loaded.height;
            if (loaded.board.length < expectedSize) {
                for (let i = loaded.board.length; i < expectedSize; i++) {
                    loaded.board.push({
                        x: i % loaded.width,
                        y: Math.floor(i / loaded.width),
                        piece: null,
                        rotation: 0,
                    });
                }
            }
            const initialPlacedIds = new Set<number>();
            const initialRotationMap: Record<number, number> = {};
            loaded.board.forEach(pos => {
                if (pos.piece) {
                    initialPlacedIds.add(pos.piece.id);
                    initialRotationMap[pos.piece.id] = pos.rotation;
                }
            });
            setPuzzleData(loaded);
            setPlacedPieceIds(initialPlacedIds);
            setPieceRotations(initialRotationMap);
        }
    }, []);

    const showNotification = useCallback((message: string) => {
        if (notificationTimeoutRef.current !== null) { clearTimeout(notificationTimeoutRef.current); }
        setNotification({ message, id: Date.now() });
        notificationTimeoutRef.current = window.setTimeout(() => {
            setNotification(null);
            notificationTimeoutRef.current = null;
        }, 3000);
    }, []);

    // Enhanced validation: tries all rotations for edge/corner pieces
    const determinePlacementValidityAndRotation = useCallback((
        pieceEdges: [string, string, string, string],
        initialRotationStep: number, // The piece's current rotation as it's being dragged
        targetX: number,
        targetY: number,
        boardWidth: number,
        boardHeight: number
    ): PlacementValidityResult => {
        const pieceClassification = classifyPieceType(pieceEdges, BORDER_MOTIF);
        const isTargetCorner = (targetX === 0 && targetY === 0) || (targetX === boardWidth - 1 && targetY === 0) || (targetX === 0 && targetY === boardHeight - 1) || (targetX === boardWidth - 1 && targetY === boardHeight - 1);
        const isTargetEdge = !isTargetCorner && (targetX === 0 || targetX === boardWidth - 1 || targetY === 0 || targetY === boardHeight - 1);

        // Basic classification checks (must be on the right type of cell)
        if (pieceClassification === 'corner' && !isTargetCorner) return { isValid: false, fittingRotationStep: initialRotationStep };
        if (pieceClassification === 'edge' && !isTargetEdge && !isTargetCorner) return { isValid: false, fittingRotationStep: initialRotationStep };
        if (pieceClassification === 'center' && (isTargetCorner || isTargetEdge)) return { isValid: false, fittingRotationStep: initialRotationStep };

        if (pieceClassification === 'center') {
            // Center pieces don't have border constraints affecting their rotation for placement validity.
            // Any rotation is "valid" from a border perspective.
            return { isValid: true, fittingRotationStep: initialRotationStep };
        }

        // For edge and corner pieces, try all 4 rotations
        for (let rStep = 0; rStep < 4; rStep++) {
            const effectiveEdges = getEffectiveEdges(pieceEdges, rStep);
            let satisfiesAllConditions = true;

            // 1. Check border alignment: Correct edges must face the border
            if (targetY === 0 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) satisfiesAllConditions = false;
            if (targetX === boardWidth - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) satisfiesAllConditions = false;
            if (targetY === boardHeight - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) satisfiesAllConditions = false;
            if (targetX === 0 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) satisfiesAllConditions = false;

            // 2. Check that non-border edges don't face outwards if on a border slot
            if (isTargetEdge) { // Only for pieces on an edge (not a corner)
                if (targetY === 0 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[2].toLowerCase() === BORDER_MOTIF) satisfiesAllConditions = false; // Top edge, bottom faces in
                if (targetY === boardHeight - 1 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[0].toLowerCase() === BORDER_MOTIF) satisfiesAllConditions = false; // Bottom edge, top faces in
                if (targetX === 0 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[1].toLowerCase() === BORDER_MOTIF) satisfiesAllConditions = false; // Left edge, right faces in
                if (targetX === boardWidth - 1 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[3].toLowerCase() === BORDER_MOTIF) satisfiesAllConditions = false; // Right edge, left faces in
            }

            if (!satisfiesAllConditions) continue;

            const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
            if (pieceClassification === 'corner' && isTargetCorner) {
                if (borderSidesAtRot !== 2) satisfiesAllConditions = false;
            } else if (pieceClassification === 'edge' && isTargetEdge) {
                if (borderSidesAtRot !== 1) satisfiesAllConditions = false;
            } else if (pieceClassification === 'edge' && isTargetCorner) {
                if (borderSidesAtRot !== 2) satisfiesAllConditions = false;
            }

            if (satisfiesAllConditions) {
                return { isValid: true, fittingRotationStep: rStep };
            }
        }
        return { isValid: false, fittingRotationStep: initialRotationStep }; // No rotation worked, return initial for preview styling
    }, []);

    const handlePieceDrop = (targetCellIndex: number, draggedItem: DndDraggablePieceItem) => {
        console.log("[App] handlePieceDrop, targetIndex:", targetCellIndex, "item:", draggedItem);
        if (!puzzleData || !previewPiece) {
            setCurrentlyDraggedItem(null); setPreviewPiece(null); setPreviewCellIndex(null);
            return;
        }

        const { id: droppedPieceId, source, originalBoardIndex, edges: draggedPieceEdges } = draggedItem;
        // Use the rotation from the previewPiece state, as it contains the auto-determined fitting rotation
        const finalRotationStep = previewPiece.currentRotationStep;

        const targetX = targetCellIndex % puzzleData.width;
        const targetY = Math.floor(targetCellIndex / puzzleData.width);

        // Final validation with the determined (potentially auto-rotated) rotation from preview
        const placementCheckResult = determinePlacementValidityAndRotation(draggedPieceEdges, finalRotationStep, targetX, targetY, puzzleData.width, puzzleData.height);

        // Crucially, ensure the final drop uses the exact rotation that was deemed valid for the preview
        if (!placementCheckResult.isValid || placementCheckResult.fittingRotationStep !== finalRotationStep) {
            showNotification("Invalid placement for drop (final check with preview rotation failed).");
            setCurrentlyDraggedItem(null); setPreviewPiece(null); setPreviewCellIndex(null);
            return;
        }

        const actualDropRotationStep = finalRotationStep; // Use the rotation that the preview was showing

        const droppedPieceFullData = allPieces.find((p: PieceDataType) => p.id === droppedPieceId);
        if (!droppedPieceFullData) {
            console.error("Dropped piece data not found in allPieces for board update!");
            setCurrentlyDraggedItem(null); setPreviewPiece(null); setPreviewCellIndex(null);
            return;
        }

        const targetCellInBoard = puzzleData.board[targetCellIndex];
        const pieceOriginallyAtTarget = targetCellInBoard.piece;
        const rotationOriginallyAtTargetStep = targetCellInBoard.rotation;

        const updatedBoard = [...puzzleData.board];
        const newPieceRotations = { ...pieceRotations };
        const newPlacedPieceIds = new Set(placedPieceIds);

        if (source === 'board' && originalBoardIndex !== undefined && originalBoardIndex !== targetCellIndex) {
            const originalCell = updatedBoard[originalBoardIndex];
            updatedBoard[originalBoardIndex] = { ...originalCell, piece: null, rotation: 0 };
            if (pieceOriginallyAtTarget) {
                const swappedPieceData = allPieces.find(p => p.id === pieceOriginallyAtTarget.id);
                if (swappedPieceData) {
                    const swapValidation = determinePlacementValidityAndRotation(swappedPieceData.edges, rotationOriginallyAtTargetStep, originalCell.x, originalCell.y, puzzleData.width, puzzleData.height);
                    if (swapValidation.isValid && swapValidation.fittingRotationStep !== undefined) {
                        updatedBoard[originalBoardIndex] = { ...originalCell, piece: pieceOriginallyAtTarget, rotation: swapValidation.fittingRotationStep };
                        if (pieceOriginallyAtTarget.id != null) newPieceRotations[pieceOriginallyAtTarget.id] = swapValidation.fittingRotationStep;
                    } else {
                        showNotification(`Cannot swap: Piece ${pieceOriginallyAtTarget.id} does not fit. Dragged piece not placed.`);
                        updatedBoard[originalBoardIndex] = { ...originalCell, piece: droppedPieceFullData, rotation: actualDropRotationStep };
                        if (!newPlacedPieceIds.has(droppedPieceFullData.id)) newPlacedPieceIds.add(droppedPieceFullData.id);
                        newPieceRotations[droppedPieceFullData.id] = actualDropRotationStep;
                        setCurrentlyDraggedItem(null); setPreviewPiece(null); setPreviewCellIndex(null);
                        setPuzzleData({ ...puzzleData, board: updatedBoard });
                        setPieceRotations(newPieceRotations);
                        setPlacedPieceIds(newPlacedPieceIds);
                        return;
                    }
                }
            }
        } else if (source === 'palette' && pieceOriginallyAtTarget) {
            if (pieceOriginallyAtTarget.id != null) {
                newPlacedPieceIds.delete(pieceOriginallyAtTarget.id);
                delete newPieceRotations[pieceOriginallyAtTarget.id];
            }
        } else if (pieceOriginallyAtTarget && pieceOriginallyAtTarget.id !== droppedPieceId) {
            if (pieceOriginallyAtTarget.id != null) {
                newPlacedPieceIds.delete(pieceOriginallyAtTarget.id);
                delete newPieceRotations[pieceOriginallyAtTarget.id];
            }
        }

        updatedBoard[targetCellIndex] = { ...targetCellInBoard, piece: droppedPieceFullData, rotation: actualDropRotationStep };
        newPlacedPieceIds.add(droppedPieceId);
        newPieceRotations[droppedPieceId] = actualDropRotationStep;

        setPuzzleData({ ...puzzleData, board: updatedBoard });
        setPieceRotations(newPieceRotations);
        setPlacedPieceIds(newPlacedPieceIds);

        setCurrentlyDraggedItem(null);
        setPreviewPiece(null);
        setPreviewCellIndex(null);
    };

    const handleRemovePiece = (index: number) => {
        if (!puzzleData) return;
        const updatedBoard = [...puzzleData.board];
        const removedPiece = updatedBoard[index].piece;
        if (!removedPiece) return;
        updatedBoard[index] = { ...updatedBoard[index], piece: null, rotation: 0 };
        const updatedPlaced = new Set(placedPieceIds);
        updatedPlaced.delete(removedPiece.id);
        const updatedRotations = { ...pieceRotations };
        delete updatedRotations[removedPiece.id];
        setPuzzleData({ ...puzzleData, board: updatedBoard });
        setPlacedPieceIds(updatedPlaced);
        setPieceRotations(updatedRotations);
    };

    const handleRotatePieceOnBoard = (index: number) => {
        if (!puzzleData) return;
        const pos = puzzleData.board[index];
        if (!pos.piece) return;
        const pieceId = pos.piece.id;
        const pieceData = allPieces.find((p: PieceDataType) => p.id === pieceId);
        if (!pieceData) return;

        const currentRotationStep = pieceRotations[pieceId] ?? 0;
        let newProposedRotationStep = (currentRotationStep + 1) % 4; // Initial proposal

        const pieceClassification = classifyPieceType(pieceData.edges, BORDER_MOTIF);
        if (pieceClassification === 'corner' || pieceClassification === 'edge') {
            const boardWidth = puzzleData.width;
            const boardHeight = puzzleData.height;
            const targetX = pos.x;
            const targetY = pos.y;

            let foundNextValidRotation = false;
            for (let i = 0; i < 4; ++i) { // Try up to 4 rotations to find the next valid one
                const validityResult = determinePlacementValidityAndRotation(pieceData.edges, newProposedRotationStep, targetX, targetY, boardWidth, boardHeight);
                if (validityResult.isValid) {
                    // We use newProposedRotationStep itself if it's valid, determinePlacementValidityAndRotation might suggest a different fitting one
                    // but for explicit rotation, we just check if the *next* increment is valid.
                    // The key is that determinePlacementValidityAndRotation will confirm if newProposedRotationStep is valid.
                    // If it returns a *different* fittingRotationStep, that means newProposedRotationStep itself wasn't the best fit,
                    // but for user-triggered rotation, we stick to the increment if valid.
                    // A more sophisticated approach might cycle to the *absolute next valid* rotation.
                    // For now, let's check if the *incremented* rotation is valid.
                    const directCheck = determinePlacementValidityAndRotation(pieceData.edges, newProposedRotationStep, targetX, targetY, boardWidth, boardHeight);
                    if (directCheck.isValid && directCheck.fittingRotationStep === newProposedRotationStep) {
                        foundNextValidRotation = true;
                        break;
                    }
                }
                newProposedRotationStep = (newProposedRotationStep + 1) % 4;
                if (newProposedRotationStep === (currentRotationStep + 1) % 4 && i > 0) { // Cycled all options
                    break;
                }
            }
            if (!foundNextValidRotation) {
                showNotification(`This ${pieceClassification} piece cannot rotate further here due to border constraints.`);
                return;
            }
        }
        // If not a border piece or if rotation is allowed, apply it:
        setPieceRotations((prevRotations) => ({ ...prevRotations, [pieceId]: newProposedRotationStep }));
        const updatedBoard = [...puzzleData.board];
        updatedBoard[index] = { ...updatedBoard[index], rotation: newProposedRotationStep };
        setPuzzleData({ ...puzzleData, board: updatedBoard });
    };

    const handleRotatePalettePiece = (pieceId: number, currentRotationStep: number, direction: 'forward' | 'backward' = 'forward') => {
        let newRotationStep = 0;
        if (direction === 'forward') {
            newRotationStep = (currentRotationStep + 1) % 4;
        } else {
            newRotationStep = (currentRotationStep + 3) % 4;
        }
        setPieceRotations(prev => ({ ...prev, [pieceId]: newRotationStep }));
    };

    const handleClearBoard = () => {
        if (!puzzleData || !window.confirm("Are you sure you want to clear the board?")) return;
        const newBoard = puzzleData.board.map(cell => ({ ...cell, piece: null, rotation: 0 }));
        setPuzzleData({ ...puzzleData, board: newBoard });
        setPlacedPieceIds(new Set());
        setPieceRotations({});
    };

    const handleRotateBoard = () => {
        if (!puzzleData) return;
        const { width, height, board } = puzzleData;
        const newWidth = height;
        const newHeight = width;
        const newBoard: BoardPosition[] = Array(newWidth * newHeight).fill(null).map((_, i) => ({
            x: i % newWidth,
            y: Math.floor(i / newWidth),
            piece: null,
            rotation: 0,
        }));
        const newPieceRotationsState = { ...pieceRotations };

        for (const cell of board) {
            if (cell.piece) {
                const oldX = cell.x;
                const oldY = cell.y;
                const newX = height - 1 - oldY;
                const newY = oldX;
                const newIndex = newY * newWidth + newX;

                if (newIndex >= 0 && newIndex < newBoard.length) {
                    const newPieceRotationStep = (cell.rotation + 1) % 4;
                    newBoard[newIndex] = { x: newX, y: newY, piece: cell.piece, rotation: newPieceRotationStep };
                    if (cell.piece.id != null) newPieceRotationsState[cell.piece.id] = newPieceRotationStep;
                }
            }
        }
        setPuzzleData({ width: newWidth, height: newHeight, board: newBoard });
        setPieceRotations(newPieceRotationsState);
    };

    if (!puzzleData) { return <div style={{ color: "white", padding: "20px", textAlign: "center" }}>Loading puzzle definition...</div>; }

    const paletteTopOffset = isControlPanelContentVisible && controlPanelContentHeight > 0 ? controlPanelContentHeight + 8 : 40;
    const boardWrapperPaddingTop = isControlPanelContentVisible ? controlPanelContentHeight : 0;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="app-root">
                {notification && (<div key={notification.id} className="notification-banner"> {notification.message} </div>)}

                <ControlPanel
                    motifStyle={motifStyle} setMotifStyle={setMotifStyle} motifStyles={[...motifStyles]}
                    onClearBoard={handleClearBoard} onRotateBoard={handleRotateBoard}
                    isPiecePaletteVisible={isPiecePaletteVisible} togglePiecePalette={() => setIsPiecePaletteVisible(!isPiecePaletteVisible)}
                    githubRepoUrl={gitRepoUrl}
                    reportHeight={handleControlPanelHeightChange}
                    isContentVisible={isControlPanelContentVisible}
                    toggleContentVisibility={toggleControlPanelContent}
                />

                <div className="board-wrapper" style={{ paddingTop: `${boardWrapperPaddingTop}px`, height: `calc(100vh - ${boardWrapperPaddingTop}px)` }}>
                    {puzzleData && (
                        <PuzzleBoard
                            width={puzzleData.width} height={puzzleData.height} board={puzzleData.board}
                            motifStyle={motifStyle} rotationMap={pieceRotations}
                            onPieceDrop={handlePieceDrop}
                            onRemovePiece={handleRemovePiece} onRotatePiece={handleRotatePieceOnBoard}
                            controlPanelSpace={boardWrapperPaddingTop}

                            previewPiece={previewPiece}
                            setPreviewPiece={setPreviewPiece}
                            previewCellIndex={previewCellIndex}
                            setPreviewCellIndex={setPreviewCellIndex}
                            isPreviewDropValid={isPreviewDropValid}
                            setIsPreviewDropValid={setIsPreviewDropValid}
                            determinePlacementValidityAndRotation={determinePlacementValidityAndRotation}
                            currentlyDraggedItem={currentlyDraggedItem}
                            setCurrentlyDraggedItem={setCurrentlyDraggedItem}
                        />
                    )}
                </div>

                {isPiecePaletteVisible && (
                    <PiecePalette
                        placedPieceIds={placedPieceIds} motifStyle={motifStyle}
                        pieceRotations={pieceRotations}
                        onRotatePiece={handleRotatePalettePiece}
                        onClose={() => setIsPiecePaletteVisible(false)}
                        initialTopOffset={paletteTopOffset}
                        setCurrentlyDraggedItem={setCurrentlyDraggedItem}
                        setPreviewPiece={setPreviewPiece}
                        clearAllDragStates={() => {
                            setPreviewPiece(null);
                            setPreviewCellIndex(null);
                            setIsPreviewDropValid(false);
                            setCurrentlyDraggedItem(null);
                        }}
                    />
                )}
            </div>
        </DndProvider>
    );
};

export default App;
