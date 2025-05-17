import React, { useEffect, useState, useCallback, useRef } from "react";
import ControlPanel from "./components/ControlPanel";
import PiecePalette from "./components/PiecePalette";
import PuzzleBoard from "./components/PuzzleBoard";
import { loadLegacyPuzzle } from "./lib/loadLegacyPuzzle";
import { allPieces } from "./data/pieces";
import type { PuzzleBoardData, BoardPosition } from "./types/puzzle";
import './App.css';

const gitRepoUrl = "https://github.com/nater0000/eternity-puzzle-react";
const motifStyles = ["svg", "symbol"] as const;
export type MotifStyle = (typeof motifStyles)[number];

const BORDER_MOTIF = 'a';

type PieceTypeClassification = 'corner' | 'edge' | 'center';

const getEffectiveEdges = (edges: [string, string, string, string], rotation: number): [string, string, string, string] => {
    const currentEdges = [...edges] as [string, string, string, string];
    if (rotation === 0) return currentEdges;
    const N = currentEdges.length;
    const r = ((rotation % N) + N) % N;
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

const App: React.FC = () => {
    const [puzzleData, setPuzzleData] = useState<PuzzleBoardData | null>(null);
    const [motifStyle, setMotifStyle] = useState<MotifStyle>(motifStyles[0]);
    const [placedPieceIds, setPlacedPieceIds] = useState<Set<number>>(new Set());
    const [pieceRotations, setPieceRotations] = useState<Record<number, number>>({});
    const [isPiecePaletteVisible, setIsPiecePaletteVisible] = useState(true);

    const [isControlPanelContentVisible, setIsControlPanelContentVisible] = useState(true);
    const [controlPanelContentHeight, setControlPanelContentHeight] = useState(0); // Will store actual height when visible

    const [notification, setNotification] = useState<{ message: string; id: number } | null>(null);
    const notificationTimeoutRef = useRef<number | null>(null);

    const handleControlPanelHeightChange = useCallback((height: number) => {
        // Only update if the height actually changes to prevent unnecessary re-renders
        setControlPanelContentHeight(prevHeight => {
            if (prevHeight !== height) {
                return height;
            }
            return prevHeight;
        });
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
            setPuzzleData(loaded);
            const initialPlacedIds = new Set<number>();
            const initialRotationMap: Record<number, number> = {};
            for (const pos of loaded.board) {
                if (pos.piece) {
                    initialPlacedIds.add(pos.piece.id);
                    initialRotationMap[pos.piece.id] = pos.rotation;
                }
            }
            setPlacedPieceIds(initialPlacedIds);
            setPieceRotations(initialRotationMap);
        }
    }, []);

    const showNotification = useCallback((message: string) => {
        if (notificationTimeoutRef.current !== null) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, id: Date.now() });
        notificationTimeoutRef.current = window.setTimeout(() => {
            setNotification(null);
            notificationTimeoutRef.current = null;
        }, 3000);
    }, []);

    const handleDropPiece = (targetCellIndex: number, droppedPieceId: number, draggedPieceInitialRotation: number = 0, originalIndex: number) => {
        if (!puzzleData) return;
        const droppedPieceData = allPieces.find((p) => p.id === droppedPieceId);
        if (!droppedPieceData) return;

        const targetX = targetCellIndex % puzzleData.width;
        const targetY = Math.floor(targetCellIndex / puzzleData.width);
        const boardWidth = puzzleData.width;
        const boardHeight = puzzleData.height;

        const targetCell = puzzleData.board[targetCellIndex];
        const pieceOriginallyAtTarget = targetCell.piece;
        const rotationOriginallyAtTarget = targetCell.rotation;

        const pieceClassification = classifyPieceType(droppedPieceData.edges, BORDER_MOTIF);

        const isTargetCorner = (targetX === 0 && targetY === 0) ||
            (targetX === boardWidth - 1 && targetY === 0) ||
            (targetX === 0 && targetY === boardHeight - 1) ||
            (targetX === boardWidth - 1 && targetY === boardHeight - 1);
        const isTargetEdge = !isTargetCorner && (targetX === 0 || targetX === boardWidth - 1 || targetY === 0 || targetY === boardHeight - 1);

        if (pieceClassification === 'corner' && !isTargetCorner) {
            showNotification("Corner pieces must be placed in corners.");
            return;
        }
        if (pieceClassification === 'edge' && !isTargetEdge && !isTargetCorner) {
            const effectiveEdges = getEffectiveEdges(droppedPieceData.edges, draggedPieceInitialRotation);
            const borderSidesAtInitialRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
            if (isTargetCorner && borderSidesAtInitialRot < 2) {
                showNotification("Edge pieces in corners require two border sides.");
                return;
            } else if (!isTargetEdge && !isTargetCorner) {
                showNotification("Edge pieces must be placed on edges.");
                return;
            }
        }
        if (pieceClassification === 'center' && (isTargetCorner || isTargetEdge)) {
            showNotification("Center pieces must be placed in the center area.");
            return;
        }

        let finalRotationForDrop = draggedPieceInitialRotation;
        if (pieceClassification === 'corner' || pieceClassification === 'edge') {
            let validRotationFound = false;
            for (let r = 0; r < 4; r++) {
                const effectiveEdges = getEffectiveEdges(droppedPieceData.edges, r);
                let satisfies = true;
                if (targetY === 0 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                if (targetY > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[0].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX === boardWidth - 1)) { satisfies = false; }
                if (targetX === boardWidth - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                if (targetX < boardWidth - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[1].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY === boardHeight - 1)) { satisfies = false; }
                if (targetY === boardHeight - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                if (targetY < boardHeight - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[2].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX === boardWidth - 1)) { satisfies = false; }
                if (targetX === 0 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                if (targetX > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[3].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY === boardHeight - 1)) { satisfies = false; }

                if (pieceClassification === 'corner' && isTargetCorner && satisfies) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    if (borderSidesAtRot !== 2) { satisfies = false; }
                    if (targetX === 0 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                    if (targetX === boardWidth - 1 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                    if (targetX === 0 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                    if (targetX === boardWidth - 1 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                }
                if (pieceClassification === 'edge' && isTargetEdge && satisfies) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    if (borderSidesAtRot !== 1) { satisfies = false; }
                    if (targetY === 0 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                    if (targetX === boardWidth - 1 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                    if (targetY === boardHeight - 1 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                    if (targetX === 0 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) { satisfies = false; }
                }
                if (pieceClassification === 'edge' && isTargetCorner && satisfies) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    if (borderSidesAtRot !== 2) { satisfies = false; }
                    if (targetX === 0 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                    if (targetX === boardWidth - 1 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                    if (targetX === 0 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                    if (targetX === boardWidth - 1 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) { satisfies = false; }
                }
                if (satisfies) {
                    validRotationFound = true;
                    finalRotationForDrop = r;
                    break;
                }
            }
            if (!validRotationFound) {
                showNotification(`This ${pieceClassification} piece cannot fit here with any rotation.`);
                return;
            }
        }

        const updatedBoard = [...puzzleData.board];
        const newPieceRotations = { ...pieceRotations };
        const newPlacedPieceIds = new Set(placedPieceIds);

        if (!isNaN(originalIndex)) {
            const newOriginalCell: BoardPosition = { ...updatedBoard[originalIndex], piece: null, rotation: 0 };
            if (pieceOriginallyAtTarget) {
                const swappedPieceFullData = allPieces.find(p => p.id === pieceOriginallyAtTarget.id);
                let finalRotationForSwappedPiece = rotationOriginallyAtTarget;
                if (swappedPieceFullData) {
                    const swappedPieceClassification = classifyPieceType(swappedPieceFullData.edges, BORDER_MOTIF);
                    const originalCellX = originalIndex % boardWidth;
                    const originalCellY = Math.floor(originalIndex / boardWidth);
                    const isOriginalCellCorner = (originalCellX === 0 && originalCellY === 0) || (originalCellX === boardWidth - 1 && originalCellY === 0) || (originalCellX === 0 && originalCellY === boardHeight - 1) || (originalCellX === boardWidth - 1 && originalCellY === boardHeight - 1);
                    const isOriginalCellEdge = !isOriginalCellCorner && (originalCellX === 0 || originalCellX === boardWidth - 1 || originalCellY === 0 || originalCellY === boardHeight - 1);

                    if ((swappedPieceClassification === 'corner' || swappedPieceClassification === 'edge') && (isOriginalCellCorner || isOriginalCellEdge)) {
                        let validRotationForSwappedFound = false;
                        for (let r = 0; r < 4; r++) {
                            const effectiveEdgesSwapped = getEffectiveEdges(swappedPieceFullData.edges, r);
                            let satisfiesSwapped = true;
                            if (originalCellY === 0 && effectiveEdgesSwapped[0].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                            if (originalCellY > 0 && (isOriginalCellEdge || isOriginalCellCorner) && effectiveEdgesSwapped[0].toLowerCase() === BORDER_MOTIF && !(originalCellX === 0 || originalCellX === boardWidth - 1)) { satisfiesSwapped = false; }
                            if (originalCellX === boardWidth - 1 && effectiveEdgesSwapped[1].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                            if (originalCellX < boardWidth - 1 && (isOriginalCellEdge || isOriginalCellCorner) && effectiveEdgesSwapped[1].toLowerCase() === BORDER_MOTIF && !(originalCellY === 0 || originalCellY === boardHeight - 1)) { satisfiesSwapped = false; }
                            if (originalCellY === boardHeight - 1 && effectiveEdgesSwapped[2].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                            if (originalCellY < boardHeight - 1 && (isOriginalCellEdge || isOriginalCellCorner) && effectiveEdgesSwapped[2].toLowerCase() === BORDER_MOTIF && !(originalCellX === 0 || originalCellX === boardWidth - 1)) { satisfiesSwapped = false; }
                            if (originalCellX === 0 && effectiveEdgesSwapped[3].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                            if (originalCellX > 0 && (isOriginalCellEdge || isOriginalCellCorner) && effectiveEdgesSwapped[3].toLowerCase() === BORDER_MOTIF && !(originalCellY === 0 || originalCellY === boardHeight - 1)) { satisfiesSwapped = false; }

                            if (swappedPieceClassification === 'corner' && isOriginalCellCorner && satisfiesSwapped) {
                                const borderSidesAtRotSwapped = effectiveEdgesSwapped.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                                if (borderSidesAtRotSwapped !== 2) { satisfiesSwapped = false; }
                                if (originalCellX === 0 && originalCellY === 0 && (effectiveEdgesSwapped[0].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[3].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                                if (originalCellX === boardWidth - 1 && originalCellY === 0 && (effectiveEdgesSwapped[0].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[1].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                                if (originalCellX === 0 && originalCellY === boardHeight - 1 && (effectiveEdgesSwapped[2].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[3].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                                if (originalCellX === boardWidth - 1 && originalCellY === boardHeight - 1 && (effectiveEdgesSwapped[2].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[1].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                            }
                            if (swappedPieceClassification === 'edge' && isOriginalCellEdge && satisfiesSwapped) {
                                const borderSidesAtRotSwapped = effectiveEdgesSwapped.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                                if (borderSidesAtRotSwapped !== 1) { satisfiesSwapped = false; }
                                if (originalCellY === 0 && originalCellX > 0 && originalCellX < boardWidth - 1 && effectiveEdgesSwapped[0].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                                if (originalCellX === boardWidth - 1 && originalCellY > 0 && originalCellY < boardHeight - 1 && effectiveEdgesSwapped[1].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                                if (originalCellY === boardHeight - 1 && originalCellX > 0 && originalCellX < boardWidth - 1 && effectiveEdgesSwapped[2].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                                if (originalCellX === 0 && originalCellY > 0 && originalCellY < boardHeight - 1 && effectiveEdgesSwapped[3].toLowerCase() !== BORDER_MOTIF) { satisfiesSwapped = false; }
                            }
                            if (swappedPieceClassification === 'edge' && isOriginalCellCorner && satisfiesSwapped) {
                                const borderSidesAtRotSwapped = effectiveEdgesSwapped.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                                if (borderSidesAtRotSwapped !== 2) { satisfiesSwapped = false; }
                                if (originalCellX === 0 && originalCellY === 0 && (effectiveEdgesSwapped[0].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[3].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                                if (originalCellX === boardWidth - 1 && originalCellY === 0 && (effectiveEdgesSwapped[0].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[1].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                                if (originalCellX === 0 && originalCellY === boardHeight - 1 && (effectiveEdgesSwapped[2].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[3].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                                if (originalCellX === boardWidth - 1 && originalCellY === boardHeight - 1 && (effectiveEdgesSwapped[2].toLowerCase() !== BORDER_MOTIF || effectiveEdgesSwapped[1].toLowerCase() !== BORDER_MOTIF)) { satisfiesSwapped = false; }
                            }
                            if (satisfiesSwapped) {
                                finalRotationForSwappedPiece = r;
                                validRotationForSwappedFound = true;
                                break;
                            }
                        }
                        if (!validRotationForSwappedFound) {
                            showNotification(`Swapped piece (ID: ${swappedPieceFullData.id}) cannot fit. Swap cancelled.`);
                            return;
                        }
                    }
                }
                newOriginalCell.piece = { ...pieceOriginallyAtTarget };
                newOriginalCell.rotation = finalRotationForSwappedPiece;
                newPieceRotations[pieceOriginallyAtTarget.id] = finalRotationForSwappedPiece;
            }
            updatedBoard[originalIndex] = newOriginalCell;
            updatedBoard[targetCellIndex] = { ...updatedBoard[targetCellIndex], piece: { ...droppedPieceData }, rotation: finalRotationForDrop };
            newPieceRotations[droppedPieceId] = finalRotationForDrop;
        } else {
            updatedBoard[targetCellIndex] = { ...updatedBoard[targetCellIndex], piece: { ...droppedPieceData }, rotation: finalRotationForDrop };
            newPlacedPieceIds.add(droppedPieceId);
            newPieceRotations[droppedPieceId] = finalRotationForDrop;
            if (pieceOriginallyAtTarget) {
                newPlacedPieceIds.delete(pieceOriginallyAtTarget.id);
                delete newPieceRotations[pieceOriginallyAtTarget.id];
            }
        }
        setPuzzleData({ ...puzzleData, board: updatedBoard });
        setPieceRotations(newPieceRotations);
        setPlacedPieceIds(newPlacedPieceIds);
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
        const pieceData = allPieces.find((p) => p.id === pieceId);
        if (!pieceData) return;

        const currentRotation = pieceRotations[pieceId] ?? 0;
        let newProposedRotation = (currentRotation + 1) % 4;

        const pieceClassification = classifyPieceType(pieceData.edges, BORDER_MOTIF);
        const targetX = pos.x;
        const targetY = pos.y;
        const boardWidth = puzzleData.width;
        const boardHeight = puzzleData.height;
        const isTargetCorner = (targetX === 0 && targetY === 0) || (targetX === boardWidth - 1 && targetY === 0) || (targetX === 0 && targetY === boardHeight - 1) || (targetX === boardWidth - 1 && targetY === boardHeight - 1);
        const isTargetEdge = !isTargetCorner && (targetX === 0 || targetX === boardWidth - 1 || targetY === 0 || targetY === boardHeight - 1);

        if (pieceClassification === 'corner' || pieceClassification === 'edge') {
            let canRotateToNewProposed = false;
            for (let i = 0; i < 4; i++) {
                const effectiveEdges = getEffectiveEdges(pieceData.edges, newProposedRotation);
                let rotationSatisfiesConstraints = true;
                if (targetY === 0 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetY > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[0].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX === boardWidth - 1)) rotationSatisfiesConstraints = false;
                if (targetX === boardWidth - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetX < boardWidth - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[1].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY === boardHeight - 1)) { rotationSatisfiesConstraints = false; }
                if (targetY === boardHeight - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetY < boardHeight - 1 && (isTargetEdge || isTargetCorner) && effectiveEdges[2].toLowerCase() === BORDER_MOTIF && !(targetX === 0 || targetX === boardWidth - 1)) { rotationSatisfiesConstraints = false; }
                if (targetX === 0 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                if (targetX > 0 && (isTargetEdge || isTargetCorner) && effectiveEdges[3].toLowerCase() === BORDER_MOTIF && !(targetY === 0 || targetY === boardHeight - 1)) { rotationSatisfiesConstraints = false; }

                if (pieceClassification === 'corner' && isTargetCorner && rotationSatisfiesConstraints) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    if (borderSidesAtRot !== 2) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                }
                if (pieceClassification === 'edge' && isTargetEdge && rotationSatisfiesConstraints) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    if (borderSidesAtRot !== 1) rotationSatisfiesConstraints = false;
                    if (targetY === 0 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[0].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                    if (targetY === boardHeight - 1 && targetX > 0 && targetX < boardWidth - 1 && effectiveEdges[2].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[3].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY > 0 && targetY < boardHeight - 1 && effectiveEdges[1].toLowerCase() !== BORDER_MOTIF) rotationSatisfiesConstraints = false;
                }
                if (pieceClassification === 'edge' && isTargetCorner && rotationSatisfiesConstraints) {
                    const borderSidesAtRot = effectiveEdges.filter(edge => edge.toLowerCase() === BORDER_MOTIF).length;
                    if (borderSidesAtRot !== 2) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY === 0 && (effectiveEdges[0].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === 0 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[3].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                    if (targetX === boardWidth - 1 && targetY === boardHeight - 1 && (effectiveEdges[2].toLowerCase() !== BORDER_MOTIF || effectiveEdges[1].toLowerCase() !== BORDER_MOTIF)) rotationSatisfiesConstraints = false;
                }

                if (rotationSatisfiesConstraints) {
                    canRotateToNewProposed = true;
                    break;
                }
                newProposedRotation = (newProposedRotation + 1) % 4;
            }
            if (!canRotateToNewProposed) {
                showNotification(`This ${pieceClassification} piece cannot rotate further here.`);
                return;
            }
        }
        setPieceRotations((prevRotations) => ({ ...prevRotations, [pieceId]: newProposedRotation }));
        const updatedBoard = [...puzzleData.board];
        updatedBoard[index] = { ...updatedBoard[index], rotation: newProposedRotation };
        setPuzzleData({ ...puzzleData, board: updatedBoard });
    };

    const handleRotatePalettePiece = (pieceId: number, currentPaletteRotation: number) => {
        const newRotation = (currentPaletteRotation + 1) % 4;
        setPieceRotations(prev => ({ ...prev, [pieceId]: newRotation }));
    };

    const handleClearBoard = () => {
        if (!puzzleData) return;
        if (window.confirm("Are you sure you want to clear the board? This action cannot be undone.")) {
            const newBoard = puzzleData.board.map(cell => ({ ...cell, piece: null, rotation: 0 }));
            setPuzzleData({ ...puzzleData, board: newBoard });
            setPlacedPieceIds(new Set());
            setPieceRotations({});
        }
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
                    const newPieceDataRotation = (cell.rotation + 1) % 4;
                    newBoard[newIndex] = { x: newX, y: newY, piece: cell.piece, rotation: newPieceDataRotation };
                    newPieceRotationsState[cell.piece.id] = newPieceDataRotation;
                }
            }
        }
        setPuzzleData({ width: newWidth, height: newHeight, board: newBoard });
        setPieceRotations(newPieceRotationsState);
    };

    if (!puzzleData) {
        return <div style={{ color: "white", padding: "20px", textAlign: "center" }}>Loading puzzle definition...</div>;
    }

    const paletteTopOffset = isControlPanelContentVisible && controlPanelContentHeight > 0
        ? controlPanelContentHeight + 8
        : 40;

    // Effective height for the board wrapper takes into account if the control panel content is visible
    const boardWrapperPaddingTop = isControlPanelContentVisible ? controlPanelContentHeight : 0;

    return (
        <div className="app-root">
            {notification && (
                <div key={notification.id} className="notification-banner">
                    {notification.message}
                </div>
            )}

            <ControlPanel
                motifStyle={motifStyle}
                setMotifStyle={setMotifStyle}
                motifStyles={[...motifStyles]}
                onClearBoard={handleClearBoard}
                onRotateBoard={handleRotateBoard}
                isPiecePaletteVisible={isPiecePaletteVisible}
                togglePiecePalette={() => setIsPiecePaletteVisible(!isPiecePaletteVisible)}
                githubRepoUrl={gitRepoUrl}
                reportHeight={handleControlPanelHeightChange}
                isContentVisible={isControlPanelContentVisible}
                toggleContentVisibility={toggleControlPanelContent}
            />

            <div
                className="board-wrapper"
                style={{
                    paddingTop: `${boardWrapperPaddingTop}px`,
                    height: `calc(100vh - ${boardWrapperPaddingTop}px)` // Use 100vh for full viewport height consideration
                }}
            >
                {puzzleData && ( // Ensure puzzleData is loaded before rendering PuzzleBoard
                    <PuzzleBoard
                        width={puzzleData.width}
                        height={puzzleData.height}
                        board={puzzleData.board}
                        motifStyle={motifStyle}
                        rotationMap={pieceRotations}
                        onDropPiece={handleDropPiece}
                        onRemovePiece={handleRemovePiece}
                        onRotatePiece={handleRotatePieceOnBoard}
                        // Pass the height that the control panel is occupying
                        // This will trigger a re-calculation of squareSize in PuzzleBoard
                        controlPanelSpace={boardWrapperPaddingTop}
                    />
                )}
            </div>

            {isPiecePaletteVisible && (
                <PiecePalette
                    placedPieceIds={placedPieceIds}
                    motifStyle={motifStyle}
                    onDragStart={() => { }}
                    onDragEnd={() => { }}
                    onRotatePiece={handleRotatePalettePiece}
                    pieceRotations={pieceRotations}
                    onClose={() => setIsPiecePaletteVisible(false)}
                    initialTopOffset={paletteTopOffset}
                />
            )}
        </div>
    );
};

export default App;
