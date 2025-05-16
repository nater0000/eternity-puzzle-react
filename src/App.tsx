import React, { useEffect, useState } from "react";
import ControlPanel from "./components/ControlPanel"; // Assuming this is your updated one
import PiecePalette from "./components/PiecePalette"; // Assuming this is your updated one
import PuzzleBoard from "./components/PuzzleBoard";   // Assuming this is your updated one
import { loadLegacyPuzzle } from "./lib/loadLegacyPuzzle";
import { allPieces } from "./data/pieces";
import type { PuzzleBoardData, BoardPosition } from "./types/puzzle";
import './App.css'

const motifStyles = ["svg", "symbol"] as const;
export type MotifStyle = (typeof motifStyles)[number];

const BORDER_MOTIF = 'a'; // IMPORTANT: Ensure this matches your border motif character

type PieceTypeClassification = 'corner' | 'edge' | 'center';

const getEffectiveEdges = (edges: [string, string, string, string], rotation: number): [string, string, string, string] => {
    const currentEdges = [...edges] as [string, string, string, string];
    if (rotation === 0) return currentEdges;
    const N = currentEdges.length;
    const r = ((rotation % N) + N) % N; // Ensure positive rotation index
    const rotated = [];
    for (let i = 0; i < N; i++) {
        rotated.push(currentEdges[(i - r + N) % N]); // Piece rotates clockwise, so edges effectively rotate counter-clockwise relative to fixed directions
    }
    return rotated as [string, string, string, string];
};

const classifyPieceType = (pieceEdges: [string, string, string, string], borderMotif: string): PieceTypeClassification => {
    const borderSides = pieceEdges.filter(edge => edge.toLowerCase() === borderMotif.toLowerCase()).length;
    if (borderSides >= 2) return 'corner'; // Can be >2 if piece definition is odd, but typically 2 for corners
    if (borderSides === 1) return 'edge';
    return 'center';
};

const App: React.FC = () => {
    const [puzzleData, setPuzzleData] = useState<PuzzleBoardData | null>(null);
    const [motifStyle, setMotifStyle] = useState<MotifStyle>(motifStyles[0]);
    const [placedPieceIds, setPlacedPieceIds] = useState<Set<number>>(new Set());
    const [pieceRotations, setPieceRotations] = useState<Record<number, number>>({});
    const [isPiecePaletteVisible, setIsPiecePaletteVisible] = useState(true); // From your previous version

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
            setPuzzleData(loaded);

            const initialPlacedIds = new Set<number>();
            const initialRotationMap: Record<number, number> = {};
            for (const pos of loaded.board) {
                if (pos.piece) {
                    initialPlacedIds.add(pos.piece.id);
                    // Rotation from loadLegacyPuzzle is 0-3 representing clockwise turns needed
                    // to match piece.edges to the board_edges definition
                    initialRotationMap[pos.piece.id] = pos.rotation;
                }
            }
            setPlacedPieceIds(initialPlacedIds);
            setPieceRotations(initialRotationMap);
        }
    }, []);

    // Added originalIndex parameter
    const handleDropPiece = (targetCellIndex: number, droppedPieceId: number, draggedPieceInitialRotation: number = 0, originalIndex: number) => {
        // --- Removed debugging log ---
        // console.log(`App: handleDropPiece called for piece ${droppedPieceId} at target ${targetCellIndex} from original ${!isNaN(originalIndex) ? originalIndex : 'palette'}`);
        // -----------------------------

        if (!puzzleData) {
            // console.log("App: handleDropPiece - puzzleData is null, returning."); // Removed debugging log
            return;
        }

        const droppedPieceData = allPieces.find((p) => p.id === droppedPieceId);
        if (!droppedPieceData) {
            // console.log(`App: handleDropPiece - piece data not found for id ${droppedPieceId}, returning.`); // Removed debugging log
            return;
        }

        const targetX = targetCellIndex % puzzleData.width;
        const targetY = Math.floor(targetCellIndex / puzzleData.width);
        const boardWidth = puzzleData.width;
        const boardHeight = puzzleData.height;

        // Get piece data from the target cell *before* updating the board
        const targetCell = puzzleData.board[targetCellIndex];
        const pieceOriginallyAtTarget = targetCell.piece;
        const rotationOriginallyAtTarget = targetCell.rotation;

        // --- Constraint checks ---
        const pieceClassification = classifyPieceType(droppedPieceData.edges, BORDER_MOTIF);

        // console.log(`App: Checking basic placement constraints for piece ${droppedPieceId} (type: ${pieceClassification}) at target ${targetCellIndex} (x:${targetX}, y:${targetY})`); // Removed debugging log

        // 1. Check basic placement constraints for the *dragged* piece at the *target* location
        const isTargetCorner = (targetX === 0 && targetY === 0) ||
            (targetX === boardWidth - 1 && targetY === 0) ||
            (targetX === 0 && targetY === boardHeight - 1) ||
            (targetX === boardWidth - 1 && targetY === boardHeight - 1);
        const isTargetEdge = !isTargetCorner && (targetX === 0 || targetX === boardWidth - 1 || targetY === 0 || targetY === boardHeight - 1);
        //const isTargetCenter = !isTargetCorner && !isTargetEdge;


        if (pieceClassification === 'corner' && !isTargetCorner) {
            // console.log(`App: Basic constraint failed: Corner piece ${droppedPieceId} dropped at non-corner ${targetCellIndex}.`); // Removed debugging log
            alert("Invalid move: Corner pieces must be placed in corners.");
            return;
        }
        if (pieceClassification === 'edge' && !isTargetEdge && !isTargetCorner) { // Allow edge pieces in corners if they fit
            // Additional check for edge piece in corner: make sure 2 sides are border
            const effectiveEdges = getEffectiveEdges(droppedPieceData.edges, draggedPieceInitialRotation);
            const borderSidesAtInitialRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
            if (isTargetCorner && borderSidesAtInitialRot < 2) {
                // console.log(`App: Basic constraint failed: Edge piece ${droppedPieceId} dropped at corner ${targetCellIndex} without 2 border sides.`); // Removed debugging log
                alert("Invalid move: Edge pieces placed in corners must have two border sides facing outwards.");
                return;
            } else if (!isTargetEdge && !isTargetCorner) {
                // console.log(`App: Basic constraint failed: Edge piece ${droppedPieceData.id} dropped at non-edge/non-corner ${targetCellIndex}.`); // Removed debugging log
                alert("Invalid move: Edge pieces must be placed on edges (not in the center area).");
                return;
            }
        }
        if (pieceClassification === 'center' && (isTargetCorner || isTargetEdge)) {
            // console.log(`App: Basic constraint failed: Center piece ${droppedPieceId} dropped at border/corner ${targetCellIndex}.`); // Removed debugging log
            alert("Invalid move: Center pieces must be placed in the center area.");
            return;
        }
        // console.log("App: Basic placement constraints passed."); // Removed debugging log
        // --- End Basic Placement Constraint checks ---

        let finalRotationForDrop = draggedPieceInitialRotation; // Use rotation from drag source initially

        // console.log(`App: Checking border constraint rotation for piece ${droppedPieceId} at target ${targetCellIndex}. Initial rotation: ${draggedPieceInitialRotation * 90}°`); // Removed debugging log
        // Determine auto-rotation if it's a corner or edge piece being placed in a valid border spot
        if (pieceClassification === 'corner' || pieceClassification === 'edge') {
            let validRotationFound = false; // Use a boolean flag
            for (let r = 0; r < 4; r++) {
                const effectiveEdges = getEffectiveEdges(droppedPieceData.edges, r);
                let satisfies = true;
                // console.log(`App:   Checking rotation ${r * 90}°. Effective edges: ${effectiveEdges.join('')}`); // Removed debugging log

                // Check border constraints for the *dragged piece* at the *target position* with rotation r

                // Top Edge Constraint: If target is top row, top edge must be border. If target is not top row but is border/corner, top edge must *not* be border (unless it's a corner and the border is on the side).
                if (targetY === 0 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed top border check: Edge 0 ('${effectiveEdges[0]}') is not border motif ('${BORDER_MOTIF}') in top row.`); */ } // Removed debugging log
                if (targetY > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[0].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX === boardWidth - 1)) { satisfies = false; /* console.log(`App: Failed top edge border placement check: Edge 0 ('${effectiveEdges[0]}') is border motif but target is inner edge on top.`); */ } // Removed debugging log

                // Right Edge Constraint: If target is right column, right edge must be border. If target is not right column but is border/corner, right edge must *not* be border (unless it's a corner and the border is on the side).
                if (targetX === boardWidth - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed right border check: Edge 1 ('${effectiveEdges[1]}') is not border motif ('${BORDER_MOTIF}') in right column.`); */ } // Removed debugging log
                if (targetX < boardWidth - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[1].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY !== boardHeight - 1)) { satisfies = false; /* console.log(`App: Failed right edge border placement check: Edge 1 ('${effectiveEdges[1]}') is border motif but target is inner edge on right.`); */ } // Removed debugging log

                // Bottom Edge Constraint: If target is bottom row, bottom edge must be border. If target is not bottom row but is border/corner, bottom edge must *not* be border (unless it's a corner and the border is on the side).
                if (targetY === boardHeight - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed bottom border check: Edge 2 ('${effectiveEdges[2]}') is not border motif ('${BORDER_MOTIF}') in bottom row.`); */ } // Removed debugging log
                if (targetY < boardHeight - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[2].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX !== boardWidth - 1)) { satisfies = false; /* console.log(`App: Failed bottom edge border placement check: Edge 2 ('${effectiveEdges[2]}') is border motif but target is inner edge on bottom.`); */ } // Removed debugging log

                // Left Edge Constraint: If target is left column, left edge must be border. If target is not left column but is border/corner, left edge must *not* be border (unless it's a corner and the border is on the side).
                if (targetX === 0 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed left border check: Edge 3 ('${effectiveEdges[3]}') is not border motif ('${BORDER_MOTIF}') in left column.`); */ } // Removed debugging log
                if (targetX > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[3].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY !== boardHeight - 1)) { satisfies = false; /* console.log(`App: Failed left edge border placement check: Edge 3 ('${effectiveEdges[3]}') is border motif but target is inner edge on left.`); */ } // Removed debugging log


                if (pieceClassification === 'corner' && isTargetCorner && satisfies) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    const expectedBorderSides = 2; // For a corner spot
                    if (borderSidesAtRot !== expectedBorderSides) { satisfies = false; /* console.log(`App: Failed corner border count check (expected ${expectedBorderSides}, got ${borderSidesAtRot}).`); */ } // Removed debugging log

                    // Also ensure the border sides are on the outer edges of the corner (Corrected Logic)
                    // Top-Left Corner (0,0): Top (0) and Left (3) must be border
                    if (targetX === 0 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; /* console.log(`App: Failed top-left corner specific border check: Edges 0 or 3 not border.`); */ } // Removed debugging log
                    // Top-Right Corner (w-1,0): Top (0) and Right (1) must be border
                    if (targetX === boardWidth - 1 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; /* console.log(`App: Failed top-right corner specific border check: Edges 0 or 1 not border.`); */ } // Removed debugging log
                    // Bottom-Left Corner (0,h-1): Bottom (2) and Left (3) must be border
                    if (targetX === 0 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; /* console.log(`App: Failed bottom-left corner specific border check: Edges 2 or 3 not border.`); */ } // Removed debugging log
                    // Bottom-Right Corner (w-1,h-1): Bottom (2) and Right (1) must be border
                    if (targetX === boardWidth - 1 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; /* console.log(`App: Failed bottom-right corner specific border check: Edges 2 or 1 not border.`); */ } // Removed debugging log

                }
                if (pieceClassification === 'edge' && isTargetEdge && satisfies) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    const expectedBorderSides = 1; // For an edge spot (not corner)
                    if (borderSidesAtRot !== expectedBorderSides) { satisfies = false; /* console.log(`App: Failed edge border count check (expected ${expectedBorderSides}, got ${borderSidesAtRot}).`); */ } // Removed debugging log

                    // Ensure the border side is on the correct outer edge for edge positions (Corrected Logic)
                    if (targetY === 0 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed top edge specific border check: Edge 0 not border.`); */ } // Removed debugging log
                    if (targetY === boardHeight - 1 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed bottom edge specific border check: Edge 2 not border.`); */ } // Removed debugging log
                    if (targetX === 0 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed left edge specific border check: Edge 3 not border.`); */ } // Removed debugging log
                    if (targetX === boardWidth - 1 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) { satisfies = false; /* console.log(`App: Failed right edge specific border check: Edge 1 not border.`); */ } // Removed debugging log
                }

                // console.log(`App:   Rotation ${r * 90}° satisfies constraints: ${satisfies}`); // Removed debugging log
                if (satisfies) {
                    validRotationFound = true; // Found at least one valid rotation
                    finalRotationForDrop = r; // Use the first valid rotation found
                    // console.log(`App: Found valid rotation ${r * 90}° for piece ${droppedPieceId} at target ${targetCellIndex}. Setting finalRotationForDrop.`); // Removed debugging log
                    break; // Found a valid rotation, use this one
                }
            }

            // If no rotation satisfied the constraints at the target position
            if (!validRotationFound) {
                // console.log(`App: Border constraint failed: No valid rotation found for piece ${droppedPieceId} at target ${targetCellIndex}.`); // Removed debugging log
                // If it's a border/corner piece, and no rotation works at the new spot, placement is invalid.
                alert(`This ${pieceClassification} piece cannot be placed at this position with any rotation due to border constraints.`);
                return; // Stop the drop operation
            }
            // console.log(`App: Border constraint rotation check passed. Final rotation for drop: ${finalRotationForDrop * 90}°`); // Removed debugging log
            // If auto-rotation was found, finalRotationForDrop is updated.
            // If no auto-rotation was needed/found (validRotationFound remained false and piece wasn't border/corner or was moved back to original spot),
            // finalRotationForDrop remains draggedPieceInitialRotation (the rotation the piece had when picked up).
        }


        // --- Update board state based on the drop scenario ---
        const updatedBoard = [...puzzleData.board]; // Create a copy of the current board
        const newPieceRotations = { ...pieceRotations };
        const newPlacedPieceIds = new Set(placedPieceIds);

        if (!isNaN(originalIndex)) { // Scenario: Dragging from Board
            // console.log(`App: Handling Board to Board drag from ${originalIndex} to ${targetCellIndex}. Target originally had piece: ${pieceOriginallyAtTarget?.id ?? 'none'}`); // Removed debugging log

            // Create the new cell object for the original index
            const newOriginalCell: BoardPosition = {
                ...updatedBoard[originalIndex], // Keep existing x, y
                piece: null, // Default to null
                rotation: 0, // Default to 0
            };

            if (pieceOriginallyAtTarget) { // Sub-scenario: Dropping onto an occupied cell (Swap)
                // console.log(`App: Performing Swap: Dragged ${droppedPieceId} (from ${originalIndex}) with ${pieceOriginallyAtTarget.id} (at ${targetCellIndex})`); // Removed debugging log
                // Update the new original cell to contain the piece from the target
                newOriginalCell.piece = { ...pieceOriginallyAtTarget };
                newOriginalCell.rotation = rotationOriginallyAtTarget; // Keep original rotation for swapped piece

                // Update rotation state for the swapped piece (at original index)
                newPieceRotations[pieceOriginallyAtTarget.id] = rotationOriginallyAtTarget;

            } else { // Sub-scenario: Dropping onto an empty cell (Move)
                // console.log(`App: Performing Move: Dragged ${droppedPieceId} from ${originalIndex} to empty ${targetCellIndex}`); // Removed debugging log
                // The new original cell remains piece: null, rotation: 0
            }

            // Place the new original cell into the updated board
            updatedBoard[originalIndex] = newOriginalCell;
            // console.log(`App: Updated original index ${originalIndex}. New piece: ${newOriginalCell.piece?.id ?? 'none'}`); // Removed debugging log


            // Create the new cell object for the target index
            const newTargetCell: BoardPosition = {
                ...updatedBoard[targetCellIndex], // Keep existing x, y
                piece: { ...droppedPieceData }, // Place the dragged piece here
                rotation: finalRotationForDrop, // Use calculated rotation for dragged piece
            };
            updatedBoard[targetCellIndex] = newTargetCell;
            // console.log(`App: Updated target index ${targetCellIndex}. New piece: ${newTargetCell.piece?.id ?? 'none'}`); // Removed debugging log


            // Update rotation state for the dragged piece (at target index)
            newPieceRotations[droppedPieceId] = finalRotationForDrop;


            // console.log(`App: Scenario: Board to Board. Dragged ${droppedPieceId} from ${originalIndex} to ${targetCellIndex}. Target was ${pieceOriginallyAtTarget ? 'occupied' : 'empty'}.`); // Removed debugging log


        } else { // Scenario: Dragging from Palette
            // console.log(`App: Handling Palette to Board drag to ${targetCellIndex}. Target originally had piece: ${pieceOriginallyAtTarget?.id ?? 'none'}`); // Removed debugging log
            // Place the dragged piece into the target index
            updatedBoard[targetCellIndex] = {
                ...updatedBoard[targetCellIndex],
                piece: { ...droppedPieceData },
                rotation: finalRotationForDrop, // Use calculated rotation for dragged piece
            };
            // console.log(`App: Updated target index ${targetCellIndex}. New piece: ${updatedBoard[targetCellIndex].piece?.id ?? 'none'}`); // Removed debugging log


            // Update placedPieceIds and pieceRotations
            newPlacedPieceIds.add(droppedPieceId); // Add the dropped piece to placed IDs
            newPieceRotations[droppedPieceId] = finalRotationForDrop; // Add rotation for the dropped piece


            // If a piece was already at the target, remove it from placed IDs and rotations
            if (pieceOriginallyAtTarget) {
                newPlacedPieceIds.delete(pieceOriginallyAtTarget.id);
                delete newPieceRotations[pieceOriginallyAtTarget.id];
                // console.log(`App: Palette to Board: Removed piece ${pieceOriginallyAtTarget.id} from placedIds and rotations.`); // Removed debugging log
            }
            // console.log(`App: Scenario: Palette to Board. Piece ${droppedPieceId} placed at ${targetCellIndex}. Target was ${pieceOriginallyAtTarget ? 'occupied' : 'empty'}.`); // Removed debugging log
        }

        // console.log("App: Final updatedBoard state before setPuzzleData:", updatedBoard); // Removed debugging log
        setPuzzleData({ ...puzzleData, board: updatedBoard });
        setPieceRotations(newPieceRotations);
        setPlacedPieceIds(newPlacedPieceIds);

    };


    const handleRemovePiece = (index: number) => {
        // This function should be fine from previous version if it just clears the cell
        // and updates placedPieceIds and pieceRotations.
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
        console.log(`App: Removed piece ${removedPiece.id} from index ${index}.`);
    };

    const handleRotatePieceOnBoard = (index: number) => {
        // Rotation logic from previous attempt needs to be re-verified against constraints
        // This is similar to the auto-rotation check in handleDropPiece
        if (!puzzleData) return;
        const pos = puzzleData.board[index];
        if (!pos.piece) return;

        const pieceId = pos.piece.id;
        const pieceData = allPieces.find((p) => p.id === pieceId);
        if (!pieceData) return;

        const currentRotation = pieceRotations[pieceId] ?? 0;
        let newProposedRotation = (currentRotation + 1) % 4; // Try next rotation first

        const pieceClassification = classifyPieceType(pieceData.edges, BORDER_MOTIF);
        const targetX = pos.x; // Use pos.x and pos.y for constraint checks
        const targetY = pos.y;
        const boardWidth = puzzleData.width;
        const boardHeight = puzzleData.height;
        const isTargetCorner = (targetX === 0 && targetY === 0) || (targetX === boardWidth - 1 && targetY === 0) || (targetX === 0 && targetY === boardHeight - 1) || (targetX === boardWidth - 1 && targetY === boardHeight - 1);
        const isTargetEdge = !isTargetCorner && (targetX === 0 || targetX === boardWidth - 1 || targetY === 0 || targetY === boardHeight - 1);


        if (pieceClassification === 'corner' || pieceClassification === 'edge') {
            let canRotateToNewProposed = false;
            // Try all 4 rotations to find the *next valid one* after currentRotation
            for (let i = 0; i < 4; i++) {
                const effectiveEdges = getEffectiveEdges(pieceData.edges, newProposedRotation);
                let rotationSatisfiesConstraints = true;

                // Check border constraints for the *current piece* at its *current position* with newProposedRotation
                if (targetY === 0 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetY > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[0].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX === boardWidth - 1)) rotationSatisfiesConstraints = false;

                if (targetX === boardWidth - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetX < boardWidth - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[1].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY !== boardHeight - 1)) rotationSatisfiesConstraints = false;

                if (targetY === boardHeight - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetY < boardHeight - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[2].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX !== boardWidth - 1)) rotationSatisfiesConstraints = false;

                if (targetX === 0 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetX > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[3].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY !== boardHeight - 1)) rotationSatisfiesConstraints = false;


                if (pieceClassification === 'corner' && rotationSatisfiesConstraints) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    const expectedBorderSides = 2;
                    if (borderSidesAtRot !== expectedBorderSides) rotationSatisfiesConstraints = false;

                    if (targetX === 0 && targetY === 0 && (effectiveEdges[1].toLowerCase() !== BORDER_MOTIF || effectiveEdges[2].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY === 0 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY === boardHeight - 1 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY === boardHeight - 1 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                }
                if (pieceClassification === 'edge' && isTargetEdge && rotationSatisfiesConstraints) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    const expectedBorderSides = 1;
                    if (borderSidesAtRot !== expectedBorderSides) rotationSatisfiesConstraints = false;

                    if (targetY === 0 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                    if (targetY === boardHeight - 1 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                }


                if (rotationSatisfiesConstraints) {
                    canRotateToNewProposed = true;
                    break;
                }
                newProposedRotation = (newProposedRotation + 1) % 4;
                if (newProposedRotation === (currentRotation + 1) % 4 && i > 0) { // Cycled all options, none worked
                    break;
                }
            }
            if (!canRotateToNewProposed) {
                alert(`This ${pieceClassification} piece cannot be rotated further at this position due to border constraints.`);
                return;
            }
        }

        // Typo fixed here: changed prev to prevRotations
        setPieceRotations((prevRotations) => ({ ...prevRotations, [pieceId]: newProposedRotation }));
        const updatedBoard = [...puzzleData.board];
        updatedBoard[index] = { ...updatedBoard[index], rotation: newProposedRotation };
        setPuzzleData({ ...puzzleData, board: updatedBoard });
        console.log(`App: Rotated piece ${pieceId} at index ${index} to ${newProposedRotation * 90}°`);
    };

    const handleRotatePalettePiece = (pieceId: number, currentPaletteRotation: number) => {
        const newRotation = (currentPaletteRotation + 1) % 4;
        setPieceRotations(prev => ({ ...prev, [pieceId]: newRotation }));
        console.log(`App: Rotated palette piece ${pieceId} to ${newRotation * 90}°`);
    };

    const handleClearBoard = () => {
        if (!puzzleData) return;
        if (window.confirm("Are you sure you want to clear the board? This action cannot be undone.")) {
            const newBoard = puzzleData.board.map(cell => ({ ...cell, piece: null, rotation: 0 }));
            setPuzzleData({ ...puzzleData, board: newBoard });
            setPlacedPieceIds(new Set());
            setPieceRotations({});
            console.log("App: Board cleared.");
        }
    };

    const handleRotateBoard = () => {
        // This logic was generally okay, but ensure piece rotations are also updated in pieceRotations state
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
                    const newPieceDataRotation = (cell.rotation + 1) % 4; // Use cell.rotation, which should be authoritative
                    newBoard[newIndex] = {
                        x: newX,
                        y: newY,
                        piece: cell.piece,
                        rotation: newPieceDataRotation,
                    };
                    newPieceRotationsState[cell.piece.id] = newPieceDataRotation;
                }
            }
        }
        setPuzzleData({ width: newWidth, height: newHeight, board: newBoard });
        setPieceRotations(newPieceRotationsState);
        console.log("App: Board rotated.");
    };


    if (!puzzleData) {
        return <div style={{ color: "white", padding: "20px", textAlign: "center" }}>Loading puzzle definition...</div>;
    }

    // Use the version of ControlPanel and PiecePalette that includes the new buttons/features
    return (
        <div className="app-root">
            <ControlPanel
                motifStyle={motifStyle}
                setMotifStyle={setMotifStyle}
                motifStyles={[...motifStyles]}
                onClearBoard={handleClearBoard}
                onRotateBoard={handleRotateBoard}
                isPiecePaletteVisible={isPiecePaletteVisible}
                togglePiecePalette={() => setIsPiecePaletteVisible(!isPiecePaletteVisible)}
            // Removed style prop, assuming styling via CSS
            />
            <div className="board-wrapper">
                <PuzzleBoard
                    width={puzzleData.width}
                    height={puzzleData.height}
                    board={puzzleData.board}
                    motifStyle={motifStyle}
                    rotationMap={pieceRotations}
                    onDropPiece={handleDropPiece}
                    onRemovePiece={handleRemovePiece}
                    onRotatePiece={handleRotatePieceOnBoard}
                />
            </div>
            {isPiecePaletteVisible && (
                <PiecePalette
                    placedPieceIds={placedPieceIds}
                    motifStyle={motifStyle}
                    onDragStart={() => { /* Placeholder if not used, ensure PuzzleBoard sets data */ }}
                    onDragEnd={() => { }}
                    onRotatePiece={handleRotatePalettePiece}
                    pieceRotations={pieceRotations}
                    onClose={() => setIsPiecePaletteVisible(false)}
                />
            )}
        </div>
    );
};

export default App;
