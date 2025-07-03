// --- Board utilities --------------------------------------------------------
const Board = (() => {
  function createEmptyCell() {
    return { value: null, fixed: false, justPlaced: false };
  }

  function createEmptyBoard(rows, cols) {
    const b = [];
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) row.push(createEmptyCell());
      b.push(row);
    }
    return b;
  }

  function getCell(board, y, x) {
    return board[y]?.[x] ?? null;
  }

  function setCell(board, y, x, cell) {
    if (board[y] && board[y][x]) board[y][x] = cell;
  }

  function forEachNeighbor(board, y, x, cb) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        const ny = y + dy, nx = x + dx;
        if (ny >= 0 && ny < board.length && nx >= 0 && nx < board[0].length) {
          cb(board[ny][nx], ny, nx);
        }
      }
    }
  }  
  /*function forEachNeighbor(board, y, x, cb) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;
        const ny = y + dy, nx = x + dx;
        if (board[ny] && board[ny][nx]) cb(board[ny][nx], ny, nx);
      }
    }
  }*/

  return { createEmptyCell, createEmptyBoard, getCell, setCell, forEachNeighbor };
})();
  