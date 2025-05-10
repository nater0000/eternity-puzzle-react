import React, { useState, useRef, useEffect } from "react";
import Piece from "./Piece";
import { allPieces } from "../data/pieces";
import "./PiecePalette.css";

interface PiecePaletteProps {
  placedPieceIds: Set<number>;
  motifStyle: "symbol" | "svg";
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  onRotatePiece: (id: number, rotation: number) => void;
  pieceRotations?: Record<number, number>;
}

const PiecePalette: React.FC<PiecePaletteProps> = ({
  placedPieceIds,
  motifStyle,
  onDragStart,
  onDragEnd,
  onRotatePiece,
  pieceRotations = {},
}) => {
  const [visible, setVisible] = useState(true);
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [size, setSize] = useState({ width: 5 * 60 + 16, height: window.innerHeight / 2 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const MARGIN = 8;
  const MARGIN_BOTTOM = 8;
  const MARGIN_TOP = 8;
  const MIN_WIDTH = 200;
  const MIN_HEIGHT = 100;

  useEffect(() => {
    if (visible) {
      const width = 5 * 60 + 16;
      const height = window.innerHeight / 2;
      const left = window.innerWidth - width - MARGIN;
      const maxTop = window.innerHeight - MIN_HEIGHT - MARGIN_BOTTOM;
      const top = Math.max(
        MARGIN_TOP,
        Math.min(window.innerHeight - height - MARGIN_BOTTOM, maxTop)
      );
      setSize({ width, height });
      setPosition({ top, left });
    }
  }, [visible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const newLeft = Math.min(Math.max(e.clientX - offset.x, MARGIN), window.innerWidth - size.width - MARGIN);
        const newTop = Math.min(Math.max(e.clientY - offset.y, MARGIN_TOP), window.innerHeight - MARGIN_BOTTOM);
        setPosition({ top: newTop, left: newLeft });
      } else if (resizing) {
        const newWidth = Math.max(MIN_WIDTH, e.clientX - position.left);
        const newHeight = Math.max(MIN_HEIGHT, e.clientY - position.top);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, offset, position, size]);

  const unplacedPieces = Object.values(allPieces).filter((p) => !placedPieceIds.has(p.id));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (popupRef.current && e.target === popupRef.current.querySelector(".title-bar")) {
      const rect = popupRef.current.getBoundingClientRect();
      setDragging(true);
      setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <>
      {!visible && (
        <button
          style={{ position: "fixed", bottom: MARGIN, right: MARGIN, zIndex: 1000 }}
          onClick={() => setVisible(true)}
        >
          Show Pieces
        </button>
      )}
      {visible && (
        <div
          ref={popupRef}
          className="piece-palette"
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: size.width,
            height: size.height,
            zIndex: 1000,
            backgroundColor: "#eee",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 12px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          <div
            className="title-bar"
            onMouseDown={handleMouseDown}
            style={{
              cursor: "move",
              padding: "4px 8px",
              background: "#ccc",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            Piece Palette
            <button onClick={() => setVisible(false)}>×</button>
          </div>
          <div
            className="palette-content"
            style={{
              overflowY: "auto",
              padding: "4px",
              height: `calc(100% - 32px)`,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 60px)",
              gap: "4px",
              justifyContent: "center",
            }}
          >
            {unplacedPieces.map((piece) => (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("pieceId", piece.id.toString());
                  e.dataTransfer.setData("rotation", (pieceRotations[piece.id] || 0).toString());
                  onDragStart(piece.id);
                }}
                onDragEnd={() => onDragEnd()}
                onClick={(e) => {
                  e.preventDefault();
                  const newRotation = ((pieceRotations[piece.id] || 0) + 1) % 4;
                  onRotatePiece(piece.id, newRotation);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onRotatePiece(piece.id, 0);
                }}
              >
                <Piece
                  id={piece.id}
                  edges={piece.edges}
                  rotation={pieceRotations[piece.id] || 0}
                  isDragging={false}
                  motifStyle={motifStyle}
                />
              </div>
            ))}
          </div>
          <div
            className="resize-handle"
            onMouseDown={() => setResizing(true)}
            style={{
              position: "absolute",
              width: "16px",
              height: "16px",
              bottom: "0",
              right: "0",
              cursor: "nwse-resize",
              backgroundColor: "transparent",
            }}
          />
        </div>
      )}
    </>
  );
};

export default PiecePalette;
