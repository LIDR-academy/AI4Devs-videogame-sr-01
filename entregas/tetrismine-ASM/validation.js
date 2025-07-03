// ---------------------------------------------------------------------------
//  Validation ‒ Consistencia global estilo Buscaminas
// ---------------------------------------------------------------------------
//  Se comprueba, tras cada fijado de ficha, si existe alguna distribución
//  de bombas en los huecos libres que satisfaga TODAS las fichas numéricas
//  colocadas en el tablero.
//  Algoritmo: back-tracking con poda sobre los huecos relevantes.
// ---------------------------------------------------------------------------

/* Formato de board[y][x] (creado en Board):
   {
     value: null | 'B' | 1..8,
     fixed: boolean,
     justPlaced: boolean
   }
*/

const Validation = (() => {
  // ----------------------------- helpers -----------------------------------
  // Devuelve true si el tablero no contiene números => siempre válido
  function hasNumbers(board) {
    for (const row of board)
      for (const c of row)
        if (typeof c.value === 'number') return true;
    return false;
  }

  // ------------------------- recopilación datos ----------------------------
  function buildConstraintSystem(board) {
    const constraints = [];           // cada número => restricción
    const varMap      = new Map();    // 'y,x' -> index en variables[]
    const variables   = [];           // array de { y,x, constraints:[] }

    const addVariable = (y, x) => {
      const key = y + ',' + x;
      if (varMap.has(key)) return varMap.get(key);
      const idx = variables.length;
      varMap.set(key, idx);
      variables.push({ y, x, cons: [] });
      return idx;
    };

    // Recorrer tablero para detectar celdas numéricas
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        const cell = board[y][x];
        if (typeof cell.value !== 'number') continue;        // no es número

        const N  = cell.value;
        let fixedBombs = 0;
        const vars = [];

        Board.forEachNeighbor(board, y, x, (nCell, ny, nx) => {
          if (nCell.value === 'B') fixedBombs++;
          else if (nCell.value === null) vars.push(addVariable(ny, nx));
        });

        console.log(`Número en (${y},${x}) = ${N}, bombas fijas: ${fixedBombs}, huecos: ${vars.length}`);

        // Poda básica inmediata
        if (fixedBombs > N) return null;               // demasiadas bombas fijas
        if (fixedBombs + vars.length < N) return null; // imposible llegar a N

        const idx = constraints.length;
        constraints.push({
          need: N,
          current: fixedBombs,
          remaining: vars.length,
          y, x
        });

        // Enlazar variables con esta restricción
        for (const vi of vars) variables[vi].cons.push(idx);
      }
    }

    return { constraints, variables };
  }

  // ---------------------------- back-tracking ------------------------------
  function satisfiesGlobal(board) {
    if (!hasNumbers(board)) return true;  // tablero vacío de números

    const system = buildConstraintSystem(board);
    if (!system) return false;           // poda básica ya falló

    const { constraints, variables } = system;

    // Orden heurístico: variable con mayor grado primero
    variables.sort((a, b) => b.cons.length - a.cons.length);

    function dfs(idx) {
      if (idx === variables.length) {
        return constraints.every(c => c.current === c.need);
      }

      const v = variables[idx];

      // Intento 1: colocar bomba
      if (tryAssign(idx, v, 1)) return true;
      // Intento 2: dejar vacío
      if (tryAssign(idx, v, 0)) return true;

      return false; // ningún valor funcionó
    }

    function tryAssign(idx, variable, isBomb) {
      const touched = [];

      for (const ci of variable.cons) {
        const c = constraints[ci];
        c.remaining--;
        if (isBomb) c.current++;
        touched.push(ci);

        // Poda
        if (c.current > c.need || c.current + c.remaining < c.need) {
          console.log(`Poda: restricción ${ci} (${constraints[ci].need} en (${constraints[ci].y},${constraints[ci].x})), current=${c.current}, remaining=${c.remaining}`);
          for (const ti of touched) {
            const tc = constraints[ti];
            if (isBomb) tc.current--;
            tc.remaining++;
          }
          return false;
        }
      }

      // Siguiente variable
      if (dfs(idx + 1)) return true;

      // Back-track
      for (const ci of touched) {
        const c = constraints[ci];
        if (isBomb) c.current--;
        c.remaining++;
      }
      return false;
    }

    // Arrancar búsqueda
    return dfs(0);
  }

  // ------------------------- API pública -----------------------------------
  function validateBoard(board) {
    return satisfiesGlobal(board);
  }

  return { validateBoard };
})(); 