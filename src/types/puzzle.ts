// Placeholder types for puzzle entities

export type PuzzlePiece = {
  id: number;
  edges: [string, string, string, string];
  motif: string;
};

export type Piece = {
  id: number;
  edges: [string, string, string, string]; // top, right, bottom, left
};

export type BoardPosition = {
  x: number;
  y: number;
  piece: Piece | null;
};

export type PuzzleBoardData = {
  width: number;
  height: number;
  board: BoardPosition[];
//  motif: string;
};
