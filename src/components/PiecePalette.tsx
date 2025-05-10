import React, { useState, useEffect, useRef } from "react";
import { allPieces } from "../data/pieces";
import Piece from "./Piece";
import type { MotifStyle } from "../App";

interface PiecePaletteProps {
  placedPieceIds: Set<number>;
  motifStyle: MotifStyle;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  onRotatePiece: (id: number, rotation: number) => void;
  pieceRotations?: Record<number, number>;
}

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const MIN_TOP = 8;
const PADDING_BOTTOM = 8;

const PiecePalette: React.FC<PiecePaletteProps> = ({
  placedPieceIds,
  motifStyle,
  onDragStart,
  onDragEnd,
  onRotatePiece,
  pieceRotations = {},
}) => {
  const unplacedPieces = allPieces.filter((piece) => !placedPieceIds.has(piece.id));
  const [rotations, setRotations] = useState<Record<number, number>>(pieceRotations);
  const [isVisible, setIsVisible] = useState(true);

  const initialWidth = 300;
  const initialHeight = Math.min(window.innerHeight / 2, window.innerHeight - 100);
  const initialTop = Math.max(MIN_TOP, window.innerHeight - initialHeight - PADDING_BOTTOM);
  const initialLeft = Math.max(8, window.innerWidth - initialWidth - 8);

  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [position, setPosition] = useState({ top: initialTop, left: initialLeft });

  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setRotations((prev) => ({ ...pieceRotations, ...prev }));
  }, [pieceRotations]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((pos) => ({
        top: Math.min(Math.max(MIN_TOP, pos.top), window.innerHeight - MIN_HEIGHT),
        left: Math.min(Math.max(0, pos.left), window.innerWidth - MIN_WIDTH),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLeftClick = (id: number) => {
    const newRotation = ((rotations[id] || 0) + 1) % 4;
    setRotations((prev) => ({ ...prev, [id]: newRotation }));
    onRotatePiece(id, newRotation);
  };

  const handleRightClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setRotations((prev) => ({ ...prev, [id]: 0 }));
    onRotatePiece(id, 0);
  };

  const handleDragStart = (e: React.DragEvent, id: number, rotation: number) => {
    e.dataTransfer.setData("pieceId", id.toString());
    e.dataTransfer.setData("rotation", rotation.toString());
    onDragStart(id);
  };

  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth + moveEvent.clientX - startX);
      const newHeight = Math.max(MIN_HEIGHT, startHeight + moveEvent.clientY - startY);
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
    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newLeft = Math.min(
        window.innerWidth - MIN_WIDTH,
        Math.max(0, moveEvent.clientX - dragOffset.current.x)
      );
      const newTop = Math.min(
        window.innerHeight - MIN_HEIGHT,
        Math.max(MIN_TOP, moveEvent.clientY - dragOffset.current.y)
      );
      setPosition({ top: newTop, left: newLeft });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          setDimensions({ width: initialWidth, height: initialHeight });
          setPosition({ top: initialTop, left: initialLeft });
        }}
        style={{
          position: "fixed",
          bottom: "12px",
          right: "12px",
          zIndex: 1000,
          padding: "8px 14px",
          background: "#eee",
          border: "1px solid #aaa",
          borderRadius: "4px",
        }}
      >
        Show Pieces
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        overflow: "hidden",
      }}
    >
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          handleMoveStart(e);
        }}
        style={{
          cursor: "move",
          backgroundColor: "#ddd",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Piece Palette</span>
        <button onClick={() => setIsVisible(false)}>×</button>
      </div>

      <div style={{ flexGrow: 1, overflow: "auto", padding: "6px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
            gap: "6px",
          }}
        >
          {unplacedPieces.map((piece) => {
            const rotation = rotations[piece.id] || 0;
            return (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => handleDragStart(e, piece.id, rotation)}
                onDragEnd={onDragEnd}
                onClick={() => handleLeftClick(piece.id)}
                onContextMenu={(e) => handleRightClick(e, piece.id)}
                style={{ cursor: "grab" }}
              >
                <Piece
                  id={piece.id}
                  edges={piece.edges}
                  rotation={rotation}
                  isDragging={false}
                  motifStyle={motifStyle}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        onMouseDown={handleResize}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "12px",
          height: "12px",
          cursor: "nwse-resize",
          backgroundColor: "#ccc",
        }}
      />
    </div>
  );
};

export default PiecePalette;
