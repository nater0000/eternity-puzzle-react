// src/types/puzzle.ts

// For react-dnd, defining the type of item we are dragging
export const ItemTypes = {
  PIECE: 'piece',
};

// Canonical data structure for a single puzzle piece
export interface Piece { 
  id: number;
  edges: [string, string, string, string]; // top, right, bottom, left
}

// Represents a position on the game board
export interface BoardPosition {
  x: number;
  y: number;
  piece: Piece | null; // Uses the canonical Piece type
  rotation: number;    // Rotation step (0-3, representing 0, 90, 180, 270 degrees)
}

// Represents the entire puzzle board data
export interface PuzzleBoardData {
  width: number;
  height: number;
  board: BoardPosition[];
}

// This is the item type that react-dnd's useDrag hook will collect and manage.
// It's what gets passed around during the drag operation.
export interface DndDraggablePieceItem {
  id: number;                           // Piece ID
  type: typeof ItemTypes.PIECE;         // Crucial for react-dnd to identify the item type
  edges: [string, string, string, string]; // Piece edges for validation during hover/drop
  currentRotationStep: number;          // Current rotation of the piece being dragged (0-3)
  source: 'palette' | 'board';          // Where the piece originated
  originalBoardIndex?: number;         // If dragged from the board, its original index there
  // You can add other data here if needed, e.g., original x, y from palette if that's useful
}

// This interface is for the data needed to RENDER the "temporarily-placed-piece" preview on the board.
export interface PreviewPieceData {
  id: number;
  edges: [string, string, string, string];
  currentRotationStep: number; // Rotation step (0-3)
}
