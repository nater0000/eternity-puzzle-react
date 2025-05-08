import type { PuzzleBoardData, BoardPosition, Piece } from "../types/puzzle";

function parseHashParams(): Record<string, string> {
  const hash = window.location.hash.slice(1); // remove #
  return Object.fromEntries(new URLSearchParams(hash));
}

export function loadLegacyPuzzle(): PuzzleBoardData | null {
  const params = parseHashParams();

  const width = parseInt(params["board_w"]);
  const height = parseInt(params["board_h"]);
  const edgeStr = params["board_edges"];
  const piecesStr = params["board_pieces"];

  if (!width || !height || !edgeStr) {
    console.warn("Missing required puzzle parameters");
    return null;
  }

  const board: BoardPosition[] = [];
  const totalSpaces = width * height;

  for (let i = 0; i < totalSpaces; i++) {
    const edges: [string, string, string, string] = [
      edgeStr[i * 4 + 0],
      edgeStr[i * 4 + 1],
      edgeStr[i * 4 + 2],
      edgeStr[i * 4 + 3],
    ];

    let piece: Piece | null = null;
    if (piecesStr) {
      const idStr = piecesStr.slice(i * 3, i * 3 + 3);
      piece = {
        id: parseInt(idStr, 10),
        edges,
      };
    }

    board.push({
      x: i % width,
      y: Math.floor(i / width),
      piece,
    });
  }

  return {
    width,
    height,
    board,
  };
}
