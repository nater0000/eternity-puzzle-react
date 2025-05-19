import React, { useState, useEffect, useRef } from "react";
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { allPieces } from "../data/pieces";
import PieceComponent from "./Piece";
import type { MotifStyle } from "../App";
import {
    ItemTypes,
    type Piece as PieceDataType,
    type DndDraggablePieceItem,
    type PreviewPieceData
} from "../types/puzzle";

interface DraggablePalettePieceProps {
    piece: PieceDataType;
    rotationStep: number;
    motifStyle: MotifStyle;
    onRotate: () => void;
    onContextMenuRotate: (e: React.MouseEvent) => void;
    setCurrentlyDraggedItem: (item: DndDraggablePieceItem | null) => void;
    setPreviewPiece: (preview: PreviewPieceData | null) => void;
    onDragEndCallback: () => void; // This will be clearAllDragStates from App.tsx
}

const DraggablePalettePiece: React.FC<DraggablePalettePieceProps> = ({
    piece,
    rotationStep,
    motifStyle,
    onRotate,
    onContextMenuRotate,
    setCurrentlyDraggedItem,
    setPreviewPiece,
    onDragEndCallback,
}) => {
    const dndItemObject: DndDraggablePieceItem = { // Define the item object separately for clarity
        id: piece.id,
        type: ItemTypes.PIECE,
        edges: piece.edges,
        currentRotationStep: rotationStep,
        source: 'palette',
    };

    const [{ isDragging }, drag, connectDragPreview] = useDrag(() => ({
        type: ItemTypes.PIECE,
        item: () => { // Use item as a function to perform side effects on drag start
            console.log("[PalettePiece] Drag Start (item function called):", dndItemObject);
            setCurrentlyDraggedItem(dndItemObject);
            setPreviewPiece({
                id: dndItemObject.id,
                edges: dndItemObject.edges,
                currentRotationStep: dndItemObject.currentRotationStep,
            });
            return dndItemObject; // Return the item being dragged
        },
        end: (_, monitor) => {
            console.log("[PalettePiece] Drag End. Dropped:", monitor.didDrop());
            onDragEndCallback();
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [piece.id, piece.edges, rotationStep, motifStyle, setCurrentlyDraggedItem, setPreviewPiece, onDragEndCallback]);

    useEffect(() => {
        if (connectDragPreview) {
            connectDragPreview(getEmptyImage(), { captureDraggingState: true });
        }
    }, [connectDragPreview]);

    return (
        <div
            ref={drag}
            onClick={onRotate}
            onContextMenu={onContextMenuRotate}
            style={{
                cursor: "grab",
                aspectRatio: '1 / 1',
                opacity: isDragging ? 0.3 : 1,
                border: isDragging ? '2px dashed #888' : '1px solid transparent',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            title={`Piece ${piece.id}\nEdges: ${piece.edges.join(',')}\nRotation: ${rotationStep * 90}°`}
        >
            <PieceComponent
                id={piece.id}
                edges={piece.edges}
                rotation={rotationStep * 90}
                isDragging={isDragging}
                motifStyle={motifStyle}
            />
        </div>
    );
};

interface PiecePaletteProps {
    placedPieceIds: Set<number>;
    motifStyle: MotifStyle;
    pieceRotations: Record<number, number>;
    onRotatePiece: (id: number, currentRotationStep: number, direction?: 'forward' | 'backward') => void;
    onClose: () => void;
    initialTopOffset?: number;
    setCurrentlyDraggedItem: (item: DndDraggablePieceItem | null) => void;
    setPreviewPiece: (preview: PreviewPieceData | null) => void;
    clearAllDragStates: () => void;
}

const MIN_WIDTH = 220;
const MIN_HEIGHT = 200;
// ... (rest of PiecePalette component remains the same as PiecePalette_tsx_react_dnd_v6_fixed_props)
const MARGIN_RIGHT = 12;
const MARGIN_BOTTOM = 12;
const PALETTE_MARGIN_TOP_FALLBACK = 40;
const TITLEBAR_HEIGHT = 28;

const PiecePalette: React.FC<PiecePaletteProps> = ({
    placedPieceIds,
    motifStyle,
    pieceRotations,
    onRotatePiece,
    onClose,
    initialTopOffset,
    setCurrentlyDraggedItem,
    setPreviewPiece,
    clearAllDragStates,
}) => {
    const unplacedPieces = allPieces.filter((p: PieceDataType) => !placedPieceIds.has(p.id));

    const initialWidth = 300;
    const effectiveInitialTop = initialTopOffset !== undefined ? initialTopOffset : PALETTE_MARGIN_TOP_FALLBACK;
    const calculatedInitialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - effectiveInitialTop - MARGIN_BOTTOM, window.innerHeight * 0.55));
    const initialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);

    const [dimensions, setDimensions] = useState({ width: initialWidth, height: calculatedInitialHeight });
    const [position, setPosition] = useState({ top: effectiveInitialTop, left: initialLeft });
    const dragOffset = useRef({ x: 0, y: 0 });
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current) {
            const newInitialHeight = Math.max(MIN_HEIGHT, Math.min(window.innerHeight - effectiveInitialTop - MARGIN_BOTTOM, window.innerHeight * 0.55));
            const newInitialLeft = Math.max(MARGIN_RIGHT, window.innerWidth - initialWidth - MARGIN_RIGHT);
            setPosition({ top: effectiveInitialTop, left: newInitialLeft });
            setDimensions({ width: initialWidth, height: newInitialHeight });
            isInitialized.current = true;
        }
    }, [effectiveInitialTop, initialWidth]);

    useEffect(() => {
        const handleWindowResize = () => {
            if (!isInitialized.current) return;
            const currentTop = position.top;
            const newAvailableHeight = window.innerHeight - currentTop - MARGIN_BOTTOM;
            const newHeight = Math.max(MIN_HEIGHT, Math.min(dimensions.height, newAvailableHeight));
            setPosition((pos) => ({
                top: Math.min(Math.max(PALETTE_MARGIN_TOP_FALLBACK, pos.top), window.innerHeight - dimensions.height - MARGIN_BOTTOM),
                left: Math.min(Math.max(MARGIN_RIGHT, pos.left), window.innerWidth - dimensions.width - MARGIN_RIGHT),
            }));
            setDimensions(dims => ({
                width: Math.max(MIN_WIDTH, Math.min(dims.width, window.innerWidth - MARGIN_RIGHT * 2)),
                height: newHeight
            }));
        };
        window.addEventListener("resize", handleWindowResize);
        if (isInitialized.current) {
            handleWindowResize();
        }
        return () => window.removeEventListener("resize", handleWindowResize);
    }, [dimensions.width, dimensions.height, position.top]);

    const handleResizeGesture = (e: React.MouseEvent) => {
        e.stopPropagation(); e.preventDefault();
        const startX = e.clientX; const startY = e.clientY;
        const startWidth = dimensions.width; const startHeight = dimensions.height;
        const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(MIN_WIDTH, Math.min(startWidth + (moveEvent.clientX - startX), window.innerWidth - position.left - MARGIN_RIGHT));
            const newHeight = Math.max(MIN_HEIGHT, Math.min(startHeight + (moveEvent.clientY - startY), window.innerHeight - position.top - MARGIN_BOTTOM));
            setDimensions({ width: newWidth, height: newHeight });
        };
        const onMouseUp = () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
        window.addEventListener("mousemove", onMouseMove); window.addEventListener("mouseup", onMouseUp);
    };

    const handleMoveStart = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).dataset.resizeHandle) return;
        e.preventDefault(); dragOffset.current = { x: e.clientX - position.left, y: e.clientY - position.top };
        const onMouseMove = (moveEvent: MouseEvent) => {
            const proposedLeft = moveEvent.clientX - dragOffset.current.x; const proposedTop = moveEvent.clientY - dragOffset.current.y;
            const minTopForDragging = PALETTE_MARGIN_TOP_FALLBACK;
            const clampedTop = Math.min(window.innerHeight - dimensions.height - MARGIN_BOTTOM, Math.max(minTopForDragging, proposedTop));
            const clampedLeft = Math.min(window.innerWidth - dimensions.width - MARGIN_RIGHT, Math.max(MARGIN_RIGHT, proposedLeft));
            setPosition({ top: clampedTop, left: clampedLeft });
        };
        const onMouseUp = () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
        window.addEventListener("mousemove", onMouseMove); window.addEventListener("mouseup", onMouseUp);
    };

    const titleBarStyle: React.CSSProperties = { cursor: "move", backgroundColor: "#282c34", color: "white", padding: "4px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none", borderBottom: "1px solid #4a4a4a", height: `${TITLEBAR_HEIGHT}px`, fontSize: "0.875rem", fontWeight: "normal" };
    const closeButtonStyle: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: '#b0b0b0', padding: "0 5px" };

    return (
        <div style={{ position: "fixed", top: position.top, left: position.left, width: dimensions.width, height: dimensions.height, backgroundColor: "#3a3a3a", color: "white", border: "1px solid #4a4a4a", borderRadius: "6px", display: "flex", flexDirection: "column", zIndex: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.25)", minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT, overflow: "hidden" }}>
            <div onMouseDown={handleMoveStart} style={titleBarStyle}>
                <span style={{ fontWeight: "bold" }}>Piece Palette ({unplacedPieces.length})</span>
                <button onClick={onClose} style={closeButtonStyle} title="Close Palette" > × </button>
            </div>
            <div style={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", padding: "8px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: "8px" }} >
                    {unplacedPieces.map((piece: PieceDataType) => {
                        const rotationStep = pieceRotations[piece.id] || 0;
                        return (
                            <DraggablePalettePiece
                                key={piece.id}
                                piece={piece}
                                rotationStep={rotationStep}
                                motifStyle={motifStyle}
                                onRotate={() => onRotatePiece(piece.id, rotationStep, 'forward')}
                                onContextMenuRotate={(e) => { e.preventDefault(); onRotatePiece(piece.id, rotationStep, 'backward'); }}
                                setCurrentlyDraggedItem={setCurrentlyDraggedItem}
                                setPreviewPiece={setPreviewPiece}
                                onDragEndCallback={clearAllDragStates}
                            />
                        );
                    })}
                </div>
            </div>
            <div data-resize-handle onMouseDown={handleResizeGesture} style={{ position: "absolute", right: 0, bottom: 0, width: "14px", height: "14px", cursor: "nwse-resize", backgroundColor: "#555", borderTopLeftRadius: "4px", zIndex: 1001 }} />
        </div>
    );
};

export default PiecePalette;
