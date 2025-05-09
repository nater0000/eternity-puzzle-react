import { allPieces } from "../data/pieces";
import type { PuzzleBoardData, BoardPosition, Piece } from "../types/puzzle";

function parseHashParams(): Record<string, string> {
  const hash = window.location.hash.slice(1); // remove #
  return Object.fromEntries(new URLSearchParams(hash));
}

// Helper to rotate edges clockwise by 90° steps
function rotateEdges(edges: [string, string, string, string], times: number): [string, string, string, string] {
  let rotated = edges;
  for (let i = 0; i < times; i++) {
    rotated = [rotated[3], rotated[0], rotated[1], rotated[2]];
  }
  return rotated;
}

// Helper to find rotation needed to match a target edge order
function findRotation(baseEdges: [string, string, string, string], targetEdges: [string, string, string, string]): number | null {
  for (let rot = 0; rot < 4; rot++) {
    const rotated = rotateEdges(baseEdges, rot);
    if (rotated.join("") === targetEdges.join("")) {
      return rot;
    }
  }
  return null;
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
    let rotation = 0;

    if (piecesStr) {
      const idStr = piecesStr.slice(i * 3, i * 3 + 3);
      const id = parseInt(idStr, 10);
      const pieceData = allPieces.find(p => p.id === id);

      if (pieceData) {
        const rot = findRotation(pieceData.edges, edges);
        if (rot !== null) {
          piece = {
            id: pieceData.id,
            edges: pieceData.edges,
          };
          rotation = rot;
        } else {
          console.warn(`Could not determine rotation for piece id=${id} at index ${i}`);
        }
      }
    }

    board.push({
      x: i % width,
      y: Math.floor(i / width),
      piece,
      rotation,
    });
  }

  return {
    width,
    height,
    board,
  };
}
