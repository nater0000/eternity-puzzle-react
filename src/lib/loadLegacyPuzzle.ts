import { allPieces } from "../data/pieces";
import type { PuzzleBoardData, BoardPosition, Piece } from "../types/puzzle";

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
    let rotated = [...edges]; // Create a copy to avoid modifying the original array
    const numRotations = times % 4; // Handle rotations greater than 3
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
    const targetEdgeString = targetEdges.join("").toLowerCase(); // Case-insensitive match

    for (const pieceData of allPieces) {
        for (let rot = 0; rot < 4; rot++) {
            const rotated = rotateEdges(pieceData.edges, rot);
            if (rotated.join("").toLowerCase() === targetEdgeString) {
                // Return a copy of the piece data to avoid mutation issues
                return { pieceData: { ...pieceData }, rotation: rot };
            }
        }
    }
    return { pieceData: null, rotation: null }; // No matching piece found
}

/**
 * Loads puzzle data from legacy hash parameters (board_w, board_h, board_edges, board_pieces).
 * Prioritizes board_edges for defining the board layout and piece rotations. If edges do not match a known piece,
 * a piece representing those edges is created with a special ID.
 * If board_pieces is also provided, it validates the piece IDs (interpreted as 1-based numbers)
 * against those inferred from board_edges.
 * If board_edges is missing or invalid, falls back to loading piece IDs from board_pieces
 * (interpreted as 1-based numbers) with default rotation.
 * @returns PuzzleBoardData if loading is successful, otherwise null.
 */
export function loadLegacyPuzzle(): PuzzleBoardData | null {
    const params = parseHashParams();

    const width = parseInt(params["board_w"]);
    const height = parseInt(params["board_h"]);
    const edgeStr = params["board_edges"];
    const piecesStr = params["board_pieces"];

    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
        console.warn("loadLegacyPuzzle: Missing or invalid board dimensions (board_w or board_h).");
        return null;
    }

    const totalSpaces = width * height;
    // In legacy board_pieces string, '000' indicates an empty slot.
    const emptyPieceIdString = '000';
    // Use a special ID for pieces loaded from edges that don't match a known piece
    const unknownPieceId = -1;
    let board: BoardPosition[] | null = null; // Initialize board as null initially

    console.log("loadLegacyPuzzle: Attempting to load puzzle from hash parameters.");

    const edgeStrProvidedAndValid = edgeStr && edgeStr.length === totalSpaces * 4;
    const piecesStrProvidedAndValid = piecesStr && piecesStr.length === totalSpaces * 3;

    if (edgeStrProvidedAndValid) {
        console.log("loadLegacyPuzzle: board_edges parameter found and is valid. Recreating board state from board_edges.");
        // Scenario 1: Load board state based on board_edges
        board = []; // Initialize board array for this scenario
        for (let i = 0; i < totalSpaces; i++) {
            const edges: [string, string, string, string] = [
                edgeStr[i * 4 + 0],
                edgeStr[i * 4 + 1],
                edgeStr[i * 4 + 2],
                edgeStr[i * 4 + 3],
            ];
            const edgeStringLower = edges.join('').toLowerCase();
            const isEmptyFiller = edgeStringLower === 'aaaa' || edgeStringLower === 'zzzz';

            let piece: Piece | null = null;
            let rotation = 0;

            if (!isEmptyFiller) {
                const found = findPieceAndRotation(edges);
                if (found.pieceData) {
                    piece = { ...found.pieceData }; // Store a copy
                    rotation = found.rotation ?? 0;
                } else {
                    // If edges don't match a known piece, create an "unknown" piece with these edges
                    console.warn(`loadLegacyPuzzle: Invalid piece edges "${edges.join('')}" found at index ${i} in board_edges. No matching piece in pieces.ts. Creating unknown piece.`);
                    piece = {
                        id: unknownPieceId, // Assign a special ID for unknown pieces
                        edges: [...edges], // Use the provided edges
                    };
                    rotation = 0; // Default rotation for the unknown piece
                }
            }

            board.push({
                x: i % width,
                y: Math.floor(i / width),
                piece,
                rotation,
            });
        }
        console.log("loadLegacyPuzzle: Finished recreating board from board_edges.");

        // If board_pieces is also provided and valid, validate against the board_edges inference
        if (piecesStrProvidedAndValid && board !== null) {
            console.log("loadLegacyPuzzle: Validating board_pieces against board_edges inference.");
            for (let i = 0; i < totalSpaces; i++) {
                const idStrFromPieces = piecesStr.slice(i * 3, i * 3 + 3);
                let pieceIdFromPieces: number | null = null; // Will store 0-indexed ID from board_pieces

                if (idStrFromPieces !== emptyPieceIdString) {
                    const pieceNumberFromPieces = parseInt(idStrFromPieces, 10);
                    // Interpret as 1-based and convert to 0-indexed
                    if (!isNaN(pieceNumberFromPieces) && pieceNumberFromPieces > 0 && pieceNumberFromPieces <= allPieces.length) {
                        pieceIdFromPieces = pieceNumberFromPieces - 1; // Convert 1-based number to 0-based ID
                    } else {
                        console.warn(`loadLegacyPuzzle: board_pieces specifies invalid piece number "${idStrFromPieces}" (parsed as ${pieceNumberFromPieces}) at index ${i}. Valid numbers are 1-${allPieces.length} or '000'.`);
                        // Keep pieceIdFromPieces as null, will be treated as mismatch
                    }
                } else {
                    // idStrFromPieces is '000', interpreted as empty. Use null ID for comparison.
                    // pieceIdFromPieces remains null
                }


                // We can safely access board[i] here because board was populated in the loop above
                // If the inferred piece is an unknown piece, its ID will be unknownPieceId (-1)
                const inferredPieceId = board[i].piece?.id ?? -1; // Use -1 for empty inferred piece from edges


                // Check for mismatch:
                // Mismatch occurs if:
                // 1. board_pieces specifies a non-empty piece (valid 0-indexed ID), but its ID does not match the inferred ID from edges.
                // 2. board_pieces specifies empty ('000', pieceIdFromPieces === null), but edges inferred a non-empty piece (inferredPieceId !== -1).
                // Note: An inferred unknown piece (id: -1) will mismatch with any non-empty ID from board_pieces.

                if (pieceIdFromPieces !== null && pieceIdFromPieces !== inferredPieceId) {
                    console.warn(`loadLegacyPuzzle: board_pieces mismatch at index ${i}. board_edges implies piece ID ${inferredPieceId} (${inferredPieceId === unknownPieceId ? 'unknown' : inferredPieceId}), board_pieces specifies ID ${pieceIdFromPieces} ('${idStrFromPieces}', interpreted as 1-based number ${pieceIdFromPieces + 1}).`);
                } else if (pieceIdFromPieces === null && inferredPieceId !== -1) {
                    // Optional: Warn if board_pieces says empty but edges imply a piece (either known or unknown)
                    // console.warn(`loadLegacyPuzzle: board_pieces specifies empty ('${idStrFromPieces}') at index ${i}, but board_edges implies piece ID ${inferredPieceId} (${inferredPieceId === unknownPieceId ? 'unknown' : inferredPieceId}).`);
                }


                // In this scenario (board_edges present), the board state from board_edges is the source of truth.
                // board_pieces is only used for validation/warnings.
            }
            console.log("loadLegacyPuzzle: Finished validating board_pieces.");
        } else if (piecesStr) {
            // board_pieces was provided but not valid length
            console.warn(`loadLegacyPuzzle: board_pieces parameter has inconsistent length (${piecesStr.length}). Validation against board_edges skipped.`);
        }

        // After successfully loading from board_edges (with optional validation), return the board
        if (board !== null && board.length === totalSpaces) {
            return {
                width,
                height,
                board,
            };
        } else {
            // This path should ideally not be hit if edgeStrProvidedAndValid is true and loop completes,
            // but as a safeguard.
            console.error("loadLegacyPuzzle: Failed to populate board despite valid board_edges.");
            return null;
        }


    } else if (piecesStrProvidedAndValid) {
        // Scenario 2: board_edges is not valid/present, but board_pieces is valid
        console.warn(`loadLegacyPuzzle: board_edges parameter is missing or has inconsistent length (${edgeStr ? edgeStr.length : 'missing'}). Loading from board_pieces.`);
        console.log("loadLegacyPuzzle: Loading board state from board_pieces.");
        board = []; // Initialize board array for this scenario
        for (let i = 0; i < totalSpaces; i++) {
            const idStrFromPieces = piecesStr.slice(i * 3, i * 3 + 3);
            let pieceIdFromPieces: number | null = null; // Will store 0-indexed ID

            let piece: Piece | null = null;
            let rotation = 0; // Default to 0 rotation when loading only from board_pieces

            if (idStrFromPieces !== emptyPieceIdString) {
                const pieceNumberFromPieces = parseInt(idStrFromPieces, 10);
                // Interpret as 1-based and convert to 0-indexed
                if (!isNaN(pieceNumberFromPieces) && pieceNumberFromPieces > 0 && pieceNumberFromPieces <= allPieces.length) {
                    pieceIdFromPieces = pieceNumberFromPieces - 1; // Convert 1-based number to 0-based ID
                    const pieceData = allPieces.find(p => p.id === pieceIdFromPieces); // Find using 0-indexed ID
                    if (pieceData) {
                        piece = { ...pieceData }; // Store a copy
                        // rotation remains 0
                    } else {
                        // This case should ideally not happen if pieceIdFromPieces is within valid range, but as a fallback
                        console.warn(`loadLegacyPuzzle: board_pieces specifies valid range number ${pieceNumberFromPieces} ('${idStrFromPieces}'), but piece data not found for ID ${pieceIdFromPieces} at index ${i}. Location will be empty.`);
                    }
                } else {
                    console.warn(`loadLegacyPuzzle: board_pieces specifies invalid piece number "${idStrFromPieces}" (parsed as ${pieceNumberFromPieces}) at index ${i}. Valid numbers are 1-${allPieces.length} or '000'. Location will be empty.`);
                }
            }
            // If idStrFromPieces is '000', piece remains null and rotation remains 0

            board.push({
                x: i % width,
                y: Math.floor(i / width),
                piece,
                rotation,
            });
        }
        console.log("loadLegacyPuzzle: Finished loading board from board_pieces.");

        // After successfully loading from board_pieces, return the board
        if (board !== null && board.length === totalSpaces) {
            return {
                width,
                height,
                board,
            };
        } else {
            // This path should ideally not be hit if piecesStrProvidedAndValid is true and loop completes,
            // but as a safeguard.
            console.error("loadLegacyPuzzle: Failed to populate board despite valid board_pieces.");
            return null;
        }


    } else {
        // Scenario 3: Neither board_edges nor board_pieces is valid/present
        console.warn(`loadLegacyPuzzle: Neither board_edges (${edgeStr ? edgeStr.length : 'missing'}) nor board_pieces (${piecesStr ? piecesStr.length : 'missing'}) parameter is reliably available or correctly sized. Cannot load puzzle.`);
        return null;
    }
}