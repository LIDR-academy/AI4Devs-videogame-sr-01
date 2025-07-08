import { forEachNeighbor } from './board.js';

/**
 * Validate that the current board can be satisfied by some placement of bombs
 * in all unfixed (empty) cells.
 * Returns true if consistent, false otherwise.
 */
export function validateBoard(board) {
  const constraints = []; // array of {value, bombsFixed, remainingUnknowns, unknownIndices:Set}
  const variableCoords = []; // index → {y,x}
  const varIndexMap = new Map(); // key=y*100+x → idx

  // Helper to generate a unique key for coords
  const key = (y, x) => y * 100 + x;

  // Gather constraints and variables
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      const cell = board[y][x];
      if (cell.fixed && Number.isInteger(cell.value)) {
        const constraint = {
          value: cell.value,
          bombsFixed: 0,
          unknownIndices: new Set()
        };
        forEachNeighbor(board, y, x, (nCell, ny, nx) => {
          if (nCell.fixed && nCell.value === 'B') {
            constraint.bombsFixed++;
          } else if (!nCell.fixed) {
            let idx;
            const k = key(ny, nx);
            if (varIndexMap.has(k)) {
              idx = varIndexMap.get(k);
            } else {
              idx = variableCoords.length;
              variableCoords.push({ y: ny, x: nx });
              varIndexMap.set(k, idx);
            }
            constraint.unknownIndices.add(idx);
          }
        });
        constraint.remainingUnknowns = constraint.unknownIndices.size;
        constraints.push(constraint);
      }
    }
  }

  // Quick contradictions
  for (const c of constraints) {
    if (c.bombsFixed > c.value) return false;
    if (c.bombsFixed + c.remainingUnknowns < c.value) return false;
  }

  if (variableCoords.length === 0) {
    // Fully determined board
    return constraints.every((c) => c.bombsFixed === c.value);
  }

  // Map variable → list of constraints it belongs to
  const varToConstraints = Array.from({ length: variableCoords.length }, () => []);
  constraints.forEach((c, ci) => {
    for (const vi of c.unknownIndices) {
      varToConstraints[vi].push(ci);
    }
  });

  /**
   * Depth-first search with forward checking.
   * @param {number} varIdx current variable index
   * @returns {boolean}
   */
  function dfs(varIdx) {
    if (varIdx === variableCoords.length) {
      return constraints.every((c) => c.bombsFixed === c.value);
    }

    // Heuristic: try safe first, then bomb
    for (const assignBomb of [false, true]) {
      let violated = false;
      const impacted = varToConstraints[varIdx];

      // Apply assignment
      impacted.forEach((ci) => {
        const c = constraints[ci];
        c.remainingUnknowns--;
        if (assignBomb) c.bombsFixed++;
        // Forward-checking prune
        if (c.bombsFixed > c.value || c.bombsFixed + c.remainingUnknowns < c.value) {
          violated = true;
        }
      });

      if (!violated && dfs(varIdx + 1)) {
        return true; // Found satisfying assignment
      }

      // Revert
      impacted.forEach((ci) => {
        const c = constraints[ci];
        if (assignBomb) c.bombsFixed--;
        c.remainingUnknowns++;
      });
    }
    return false;
  }

  return dfs(0);
}

/**
 * LEVEL 1 – Apply immediate local rules for a single numeric cell.
 * Returns {changed:boolean, ok:boolean}
 *   changed → si ha modificado algún vecino.
 *   ok      → false si detecta contradicción inmediata.
 */
function applyRulesForNumber(board, y, x) {
  const cell = board[y][x];
  const N = cell.value;

  // 0) El número no puede exceder su número de vecinos reales
  let neighborCoords = [];
  forEachNeighbor(board, y, x, (_c, ny, nx) => neighborCoords.push([ny, nx]));
  const totalNeighbors = neighborCoords.length; // 3..8 dependiendo de bordes
  if (N > totalNeighbors) return { changed: false, ok: false };

  let bombsFixed = 0;
  const unknowns = [];
  for (const [ny, nx] of neighborCoords) {
    const nCell = board[ny][nx];
    if (nCell.fixed && nCell.value === 'B') bombsFixed++;
    else if (!nCell.fixed) unknowns.push(nCell);
  }

  const bombsNeeded = N - bombsFixed;
  // Contradicciones básicas
  if (bombsNeeded < 0) return { changed: false, ok: false };
  if (bombsNeeded > unknowns.length) return { changed: false, ok: false };

  let changed = false;
  if (bombsNeeded === 0) {
    // Ningún vecino restante puede ser bomba
    for (const nCell of unknowns) {
      if (nCell.possibleValues.has('B')) {
        nCell.possibleValues.delete('B');
        changed = true;
      }
    }
  } else if (bombsNeeded === unknowns.length) {
    // TODOS los vecinos desconocidos son bomba
    for (const nCell of unknowns) {
      if (!(nCell.fixed && nCell.value === 'B')) {
        nCell.possibleValues.clear();
        nCell.possibleValues.add('B');
        // Convertimos en bomba fija para futuras iteraciones
        nCell.fixed = true;
        nCell.value = 'B';
        changed = true;
      }
    }
  }
  return { changed, ok: true };
}

/**
 * LEVEL 2 – Propagación en cascada hasta punto fijo.
 * Devuelve false si encuentra contradicción.
 */
function propagateLocalConstraints(board) {
  let somethingChanged = true;
  while (somethingChanged) {
    somethingChanged = false;
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        const cell = board[y][x];
        if (!(cell.fixed && Number.isInteger(cell.value))) continue;
        const { changed, ok } = applyRulesForNumber(board, y, x);
        if (!ok) return false; // contradicción inmediata
        if (changed) somethingChanged = true;
      }
    }
  }
  return true;
}

/**
 * Nivel 1-3 combinado – llama reglas locales + propagación + CSP.
 * @param {Array<Array<object>>} board  – matriz de celdas
 * @param {number} y – fila de la ficha recién fijada
 * @param {number} x – columna de la ficha recién fijada
 * @returns {boolean} true si el tablero es coherente tras la fijación
 */
export function validateAfterFix(board, y, x) {
  const placedCell = board[y][x];
  // Comprobación rápida de bordes para el propio número si fuese numérico
  if (placedCell.fixed && Number.isInteger(placedCell.value)) {
    const neighbors = [];
    forEachNeighbor(board, y, x, (_c, ny, nx) => neighbors.push([ny, nx]));
    if (placedCell.value > neighbors.length) return false;
  }

  // 1-2) Propagación local/cascada
  const localOk = propagateLocalConstraints(board);
  if (!localOk) return false;

  // 3) Validación global CSP (puede ser costosa, pero asegura consistencia)
  return validateBoard(board);
} 