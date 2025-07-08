/**
 * Board utilities for Tetrismine (Tetris + Minesweeper)
 */
export const CELL_VALUES = ['B', 1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Factory to create a single cell.
 * @param {null|number|'B'} value
 * @param {boolean} fixed
 * @param {boolean} justPlaced
 * @returns {object}
 */
export function createCell(value = null, fixed = false, justPlaced = false) {
  return {
    value,
    fixed,
    justPlaced,
    possibleValues: new Set(CELL_VALUES)
  };
}

/**
 * Create an empty board with the given dimensions.
 * @param {number} rows
 * @param {number} cols
 * @returns {Array<Array<object>>}
 */
export function createEmptyBoard(rows, cols) {
  const board = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push(createCell());
    }
    board.push(row);
  }
  return board;
}

/**
 * Safely get a reference to the cell at (y, x). Returns null if out of bounds.
 */
export function getCell(board, y, x) {
  if (y < 0 || y >= board.length || x < 0 || x >= board[0].length) return null;
  return board[y][x];
}

/**
 * Safely set a cell at (y, x).
 */
export function setCell(board, y, x, cell) {
  if (y < 0 || y >= board.length || x < 0 || x >= board[0].length) return;
  board[y][x] = cell;
}

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], /* self */ [0, 1],
  [1, -1], [1, 0], [1, 1]
];

/**
 * Iterate over the 8-neighborhood of (y, x).
 */
export function forEachNeighbor(board, y, x, callback) {
  for (const [dy, dx] of DIRECTIONS) {
    const ny = y + dy;
    const nx = x + dx;
    if (ny < 0 || ny >= board.length || nx < 0 || nx >= board[0].length) continue;
    callback(board[ny][nx], ny, nx);
  }
} 