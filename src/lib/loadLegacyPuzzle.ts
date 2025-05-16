import { allPieces } from "../data/pieces";
import type { PuzzleBoardData, BoardPosition, Piece } from "../types/puzzle";

const DEFAULT_BOARD_WIDTH = 16;
const DEFAULT_BOARD_HEIGHT = 16;

/**
 * Parses hash parameters from the URL.
 * @returns A record of hash parameters.
 */
function parseHashParams(): Record<string, string> {
    const hash = window.location.hash.slice(1); // remove #
    return Object.fromEntries(new URLSearchParams(hash));
}

/**
 * Helper to rotate edges clockwise by 90° steps.
 * @param edges The 4-character edge array [Top, Right, Bottom, Left].
 * @param times The number of 90° clockwise rotations (0, 1, 2, or 3).
 * @returns The rotated edge array.
 */
function rotateEdges(edges: [string, string, string, string], times: number): [string, string, string, string] {
    let rotated = [...edges];
    const numRotations = times % 4;
    for (let i = 0; i < numRotations; i++) {
        rotated = [rotated[3], rotated[0], rotated[1], rotated[2]];
    }
    return rotated as [string, string, string, string];
}

/**
 * Helper to find a piece and its rotation that matches the target edges.
 * Searches through all available pieces and their rotations.
 * @param targetEdges The 4-character edge array [Top, Right, Bottom, Left].
 * @returns An object containing the matching PieceData and the rotation (0-3), or null if no match is found.
 */
function findPieceAndRotation(targetEdges: [string, string, string, string]): { pieceData: Piece | null, rotation: number | null } {
    const targetEdgeString = targetEdges.join("").toLowerCase();

    for (const pieceData of allPieces) {
        for (let rot = 0; rot < 4; rot++) {
            const rotated = rotateEdges(pieceData.edges, rot);
            if (rotated.join("").toLowerCase() === targetEdgeString) {
                return { pieceData: { ...pieceData }, rotation: rot };
            }
        }
    }
    return { pieceData: null, rotation: null };
}

/**
 * Creates an empty board with the given dimensions.
 * @param boardWidth The width of the board.
 * @param boardHeight The height of the board.
 * @returns PuzzleBoardData for an empty board.
 */
function createEmptyBoard(boardWidth: number, boardHeight: number): PuzzleBoardData {
    const board: BoardPosition[] = [];
    const totalSpaces = boardWidth * boardHeight;
    for (let i = 0; i < totalSpaces; i++) {
        board.push({
            x: i % boardWidth,
            y: Math.floor(i / boardWidth),
            piece: null,
            rotation: 0,
        });
    }
    return {
        width: boardWidth,
        height: boardHeight,
        board,
    };
}


export function loadLegacyPuzzle(): PuzzleBoardData | null {
    const params = parseHashParams();

    let width = parseInt(params["board_w"]);
    let height = parseInt(params["board_h"]);
    const edgeStr = params["board_edges"];
    const piecesStr = params["board_pieces"];

    let usingDefaultDimensions = false;

    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
        console.warn("loadLegacyPuzzle: Missing or invalid board dimensions from URL (board_w or board_h). Using default dimensions.");
        width = DEFAULT_BOARD_WIDTH;
        height = DEFAULT_BOARD_HEIGHT;
        usingDefaultDimensions = true;
    }

    const totalSpaces = width * height;
    const emptyPieceIdString = '000';
    const unknownPieceId = -1;
    let board: BoardPosition[] | null = null;

    console.log(`loadLegacyPuzzle: Attempting to load puzzle. Dimensions: ${width}x${height}. URL params used: ${!usingDefaultDimensions}`);

    // Only attempt to load from edgeStr or piecesStr if dimensions are NOT defaulted
    // OR if the strings are actually provided (even with default dimensions, user might provide pieces/edges)
    if (!usingDefaultDimensions || params["board_edges"] || params["board_pieces"]) {
        const edgeStrProvidedAndValid = edgeStr && edgeStr.length === totalSpaces * 4;
        const piecesStrProvidedAndValid = piecesStr && piecesStr.length === totalSpaces * 3;

        if (edgeStrProvidedAndValid) {
            console.log("loadLegacyPuzzle: board_edges parameter found and is valid. Recreating board state from board_edges.");
            board = [];
            for (let i = 0; i < totalSpaces; i++) {
                const edges: [string, string, string, string] = [
                    edgeStr[i * 4 + 0], edgeStr[i * 4 + 1], edgeStr[i * 4 + 2], edgeStr[i * 4 + 3],
                ];
                const edgeStringLower = edges.join('').toLowerCase();
                const isEmptyFiller = edgeStringLower === 'aaaa' || edgeStringLower === 'zzzz';
                let piece: Piece | null = null;
                let rotation = 0;
                if (!isEmptyFiller) {
                    const found = findPieceAndRotation(edges);
                    if (found.pieceData) {
                        piece = { ...found.pieceData };
                        rotation = found.rotation ?? 0;
                    } else {
                        console.warn(`loadLegacyPuzzle: Invalid piece edges "${edges.join('')}" found at index ${i} in board_edges. No matching piece. Creating unknown piece.`);
                        piece = { id: unknownPieceId, edges: [...edges] };
                        rotation = 0;
                    }
                }
                board.push({ x: i % width, y: Math.floor(i / width), piece, rotation });
            }
            console.log("loadLegacyPuzzle: Finished recreating board from board_edges.");

            if (piecesStrProvidedAndValid && board !== null) {
                console.log("loadLegacyPuzzle: Validating board_pieces against board_edges inference.");
                for (let i = 0; i < totalSpaces; i++) {
                    const idStrFromPieces = piecesStr.slice(i * 3, i * 3 + 3);
                    let pieceIdFromPieces: number | null = null;
                    if (idStrFromPieces !== emptyPieceIdString) {
                        const pieceNumberFromPieces = parseInt(idStrFromPieces, 10);
                        if (!isNaN(pieceNumberFromPieces) && pieceNumberFromPieces > 0 && pieceNumberFromPieces <= allPieces.length) {
                            pieceIdFromPieces = pieceNumberFromPieces - 1;
                        } else {
                            console.warn(`loadLegacyPuzzle: board_pieces specifies invalid piece number "${idStrFromPieces}" at index ${i}.`);
                        }
                    }
                    const inferredPieceId = board[i].piece?.id ?? -1;
                    if (pieceIdFromPieces !== null && pieceIdFromPieces !== inferredPieceId) {
                        console.warn(`loadLegacyPuzzle: board_pieces mismatch at index ${i}. Edges imply ID ${inferredPieceId}, pieces_str implies ID ${pieceIdFromPieces}.`);
                    } else if (pieceIdFromPieces === null && inferredPieceId !== -1) {
                        // console.warn(`loadLegacyPuzzle: board_pieces implies empty at index ${i}, but edges imply piece ID ${inferredPieceId}.`);
                    }
                }
                console.log("loadLegacyPuzzle: Finished validating board_pieces.");
            } else if (piecesStr) {
                console.warn(`loadLegacyPuzzle: board_pieces parameter has inconsistent length (${piecesStr.length}). Validation skipped.`);
            }

            if (board !== null && board.length === totalSpaces) {
                return { width, height, board };
            } else {
                console.error("loadLegacyPuzzle: Failed to populate board from board_edges.");
                // Fall through to default board creation if something went wrong
            }
        } else if (piecesStrProvidedAndValid) {
            console.warn(`loadLegacyPuzzle: board_edges missing or invalid. Loading from board_pieces.`);
            board = [];
            for (let i = 0; i < totalSpaces; i++) {
                const idStrFromPieces = piecesStr.slice(i * 3, i * 3 + 3);
                let piece: Piece | null = null;
                let rotation = 0;
                if (idStrFromPieces !== emptyPieceIdString) {
                    const pieceNumberFromPieces = parseInt(idStrFromPieces, 10);
                    if (!isNaN(pieceNumberFromPieces) && pieceNumberFromPieces > 0 && pieceNumberFromPieces <= allPieces.length) {
                        const pieceIdFromPieces = pieceNumberFromPieces - 1;
                        const pieceData = allPieces.find(p => p.id === pieceIdFromPieces);
                        if (pieceData) {
                            piece = { ...pieceData };
                        } else {
                            console.warn(`loadLegacyPuzzle: board_pieces valid number ${pieceNumberFromPieces}, but piece data not found for ID ${pieceIdFromPieces} at index ${i}.`);
                        }
                    } else {
                        console.warn(`loadLegacyPuzzle: board_pieces specifies invalid piece number "${idStrFromPieces}" at index ${i}.`);
                    }
                }
                board.push({ x: i % width, y: Math.floor(i / width), piece, rotation });
            }
            console.log("loadLegacyPuzzle: Finished loading board from board_pieces.");
            if (board !== null && board.length === totalSpaces) {
                return { width, height, board };
            } else {
                console.error("loadLegacyPuzzle: Failed to populate board from board_pieces.");
                // Fall through to default board creation
            }
        }
    }

    // If board is still null at this point, it means neither board_edges nor board_pieces
    // were successfully used (or they weren't valid for the given/defaulted dimensions).
    // So, create a default empty board.
    if (board === null) {
        if (usingDefaultDimensions) {
            console.log(`loadLegacyPuzzle: No valid board_edges or board_pieces for default ${width}x${height}. Creating default empty board.`);
        } else {
            console.warn(`loadLegacyPuzzle: Neither board_edges nor board_pieces parameter is reliably available or correctly sized for specified ${width}x${height}. Creating default empty board for these dimensions.`);
        }
        return createEmptyBoard(width, height);
    }

    // Fallback in case logic above somehow fails to return but board was populated.
    // This specific return null should ideally not be reached if the logic is sound.
    // The final `if (board === null)` handles the primary default case.
    if (board !== null && board.length === totalSpaces) {
        return { width, height, board };
    }

    console.error("loadLegacyPuzzle: Reached end of function without returning a valid board. This should not happen.");
    return null; // Should be unreachable if logic is correct, but as a final fallback.
}