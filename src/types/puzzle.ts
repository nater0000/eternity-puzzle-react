// Placeholder types for puzzle entities

export type PuzzlePiece = {
  id: number;
  edges: [string, string, string, string];
  motif: string;
  rotation: number;
};

export type Piece = {
  id: number;
  edges: [string, string, string, string]; // top, right, bottom, left
};

export type BoardPosition = {
  x: number;
  y: number;
  piece: Piece | null;
  rotation: number; // in degrees or multiples of 90
  isDragging?: boolean;
};

export type PuzzleBoardData = {
  width: number;
  height: number;
  board: BoardPosition[];
};
