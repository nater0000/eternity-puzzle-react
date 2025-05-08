// Placeholder types for puzzle entities

export type PuzzlePiece = {
  id: number;
  edges: [string, string, string, string];
  motif: string;
};

export type BoardPosition = {
  x: number;
  y: number;
  piece: PuzzlePiece | null;
};
