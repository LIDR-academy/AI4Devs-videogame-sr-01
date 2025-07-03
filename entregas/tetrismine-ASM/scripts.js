// Variables de estado del juego (solo lógica)
let board = [];
let rows = 20, cols = 10;
let score = 100;
let gravityInterval;
let currentPiece = null;
let nextPiece = null;

// Funciones getter para que render.js pueda acceder a los datos
function getBoard() { return board; }
function getRows() { return rows; }
function getCols() { return cols; }
function getScore() { return score; }
function getNextPiece() { return nextPiece; }

function startGame() {
  // Inicializar renderer
  initRenderer();
  
  // Inicializar estado del juego
  board = createEmptyBoard(rows, cols);
  
  // Generar primera pieza y siguiente
  nextPiece = generateRandomPiece();
  spawnNewPiece();
  
  // Event listeners
  document.addEventListener('keydown', handleKey);
  document.getElementById('discardBtn').addEventListener('click', discardPiece);
  
  // Iniciar gravedad y renderizado
  gravityInterval = setInterval(moveDown, 500);
  render();
}

function handleKey(e) {
  if (e.key === 'ArrowLeft') moveHorizontally(-1);
  if (e.key === 'ArrowRight') moveHorizontally(1);
  if (e.key === 'ArrowDown') moveDown();
  render();
}

function moveHorizontally(dir) {
  for (let y = 0; y < rows; y++) {
    for (let x = (dir === 1 ? cols - 1 : 0); (dir === 1 ? x >= 0 : x < cols); x -= dir) {
      const cell = board[y][x];
      if (cell.justPlaced && !cell.fixed) {
        const newX = x + dir;

        // Evita moverse si justo debajo ya hay una ficha (se considera fijada)
        if (y === rows - 1 || board[y + 1][x].fixed || board[y + 1][x].value) {
          return; // ya no se puede mover horizontalmente
        }

        if (
          newX >= 0 && newX < cols &&
          !board[y][newX].value
        ) {
          board[y][newX] = { ...cell };
          board[y][x] = createEmptyCell();
          return;
        }
      }
    }
  }
}

function moveDown() {
  /* 1)  Si la ficha activa está ya en la última fila,
         se fija inmediatamente y se genera la siguiente */
  for (let x = 0; x < cols; x++) {
    const bottomCell = board[rows - 1][x];
    if (bottomCell.justPlaced) {
      bottomCell.fixed = true;
      bottomCell.justPlaced = false;
      score += 100;
      updateScoreDisplay(score);
      spawnNewPiece();      // ⇒ Coloca la ficha del panel en la fila 0
      return;               // Salimos; el render lo hace spawnNewPiece
    }
  }

  /* 2)  Mover la ficha activa una casilla hacia abajo
         (iteramos de abajo-arriba para no sobrescribir) */
  for (let y = rows - 2; y >= 0; y--) {
    for (let x = 0; x < cols; x++) {
      const cell = board[y][x];
      if (cell.justPlaced && !board[y + 1][x].value) {
        board[y + 1][x] = { ...cell };      // baja una fila
        board[y][x]   = createEmptyCell();  // libera casilla
        render();
        return;                             // ya se movió, terminamos
      }
      if (cell.justPlaced && board[y + 1][x].value) {
        /*  La ficha no puede bajar porque hay otra debajo,
            así que se fija y aparece la nueva ficha              */
        cell.fixed = true;
        cell.justPlaced = false;
        score += 100;
        updateScoreDisplay(score);
        spawnNewPiece();
        return;
      }
    }
  }

  // Si llegamos aquí no había ficha activa; generamos una nueva
  spawnNewPiece();
}

function generateRandomPiece() {
  return Math.random() < 0.2 ? 'B' : Math.floor(Math.random() * 8) + 1;
}

function spawnNewPiece() {
  // Limpiar cualquier celda con justPlaced activa
  for (let row of board) {
    for (let cell of row) {
      if (cell.justPlaced) cell.justPlaced = false;
    }
  }

  // 1. Colocar la ficha que estaba en "siguiente ficha"
  const value = nextPiece;

  // 2. Generar la nueva ficha para el panel
  nextPiece = generateRandomPiece();

  // 3. Colocar la ficha en el tablero
  const x = Math.floor(cols / 2);
  const y = 0;

  // Comprobar si hay colisión al aparecer (Game Over)
  if (board[y][x].value) {
    alert('Game Over');
    clearInterval(gravityInterval);
    return;
  }

  board[y][x] = {
    value,
    resolved: false,
    possibleBomb: false,
    possibleNumbers: new Set(),
    fixed: false,
    justPlaced: true
  };

  // 4. Actualizar el panel de siguiente ficha
  drawNextPiece();
  render();
}

function discardPiece() {
  // Buscar la pieza activa
  let foundActive = false;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = board[y][x];
      if (cell.justPlaced && !cell.fixed) {
        // Eliminar la pieza activa
        board[y][x] = createEmptyCell();
        foundActive = true;
        
        // Penalizar puntos
        score -= 5;
        updateScoreDisplay(score);
        
        // Generar nueva pieza
        spawnNewPiece();
        render();
        return;
      }
    }
  }
  
  if (!foundActive) {
    alert('No hay ficha para descartar');
  }
}