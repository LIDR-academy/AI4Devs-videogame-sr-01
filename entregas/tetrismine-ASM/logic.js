import { forEachNeighbor } from './board.js';

/**
 * Propagate basic Minesweeper constraints to shrink possibleValues sets.
 * Runs until no more changes occur (simple fix-point iteration).
 */
export function updatePossibleValues(board) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        const cell = board[y][x];
        if (!(cell.fixed && Number.isInteger(cell.value))) continue;

        const target = cell.value;
        let bombsFixed = 0;
        const unknownNeighbors = [];

        forEachNeighbor(board, y, x, (nCell) => {
          if (nCell.fixed && nCell.value === 'B') {
            bombsFixed++;
          } else if (!nCell.fixed) {
            unknownNeighbors.push(nCell);
          }
        });

        const remaining = target - bombsFixed;
        if (remaining === 0) {
          // All bombs accounted for → neighbors cannot be bombs
          for (const nCell of unknownNeighbors) {
            if (nCell.possibleValues.has('B')) {
              nCell.possibleValues.delete('B');
              changed = true;
            }
          }
        } else if (remaining === unknownNeighbors.length) {
          // Every unknown neighbor must be a bomb
          for (const nCell of unknownNeighbors) {
            if (!(nCell.possibleValues.size === 1 && nCell.possibleValues.has('B'))) {
              nCell.possibleValues.clear();
              nCell.possibleValues.add('B');
              changed = true;
            }
          }
        }
      }
    }
  }
}

/**
 * Quick contradiction check (local only).
 * Returns true if any numeric cell is impossible even before full CSP.
 */
export function detectImmediateContradictions(board) {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      const cell = board[y][x];
      if (!(cell.fixed && Number.isInteger(cell.value))) continue;
      const target = cell.value;
      let bombsFixed = 0;
      let unknown = 0;
      forEachNeighbor(board, y, x, (nCell) => {
        if (nCell.fixed && nCell.value === 'B') bombsFixed++;
        else if (!nCell.fixed) unknown++;
      });
      if (bombsFixed > target) return true;
      if (bombsFixed + unknown < target) return true;
    }
  }
  return false;
} 