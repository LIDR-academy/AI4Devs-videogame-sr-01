// Board layout - defines which region each cell belongs to
const boardLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 2],
  [1, 1, 3, 3, 3, 3, 3, 2, 2],
  [4, 4, 3, 3, 5, 3, 3, 2, 2],
  [4, 6, 6, 7, 7, 7, 6, 6, 2],
  [4, 6, 6, 7, 7, 7, 6, 6, 2],
  [4, 6, 6, 6, 6, 6, 6, 6, 8],
  [4, 6, 6, 6, 6, 6, 6, 6, 8],
  [4, 4, 9, 9, 9, 9, 8, 8, 8],
  [4, 4, 4, 4, 9, 9, 9, 9, 8],
];

// Cell states
const EMPTY = 0;
const X_MARK = 1;
const CROWN = 2;

// Game state
let gameState = [];
let moveHistory = [];
let conflictingCells = new Set();

// Initialize game
function initGame() {
  gameState = Array(9)
    .fill(null)
    .map(() => Array(9).fill(EMPTY));
  moveHistory = [];
  conflictingCells.clear();
  renderBoard();
  updateMessage("");
}

// Render the game board
function renderBoard() {
  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.className = `cell region-${boardLayout[row][col]}`;
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Add state classes
      if (gameState[row][col] === X_MARK) {
        cell.classList.add("x");
      } else if (gameState[row][col] === CROWN) {
        cell.classList.add("crown");
        if (conflictingCells.has(`${row},${col}`)) {
          cell.classList.add("conflict");
        }
      }

      cell.addEventListener("click", handleCellClick);
      boardElement.appendChild(cell);
    }
  }

  // Update undo button state
  document.getElementById("undo-btn").disabled = moveHistory.length === 0;
}

// Handle cell click
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  // Save current state to history
  moveHistory.push({
    row,
    col,
    previousState: gameState[row][col],
    gameStateCopy: gameState.map(row => [...row]),
  });

  // Cycle through states: empty -> X -> crown -> empty
  if (gameState[row][col] === EMPTY) {
    gameState[row][col] = X_MARK;
  } else if (gameState[row][col] === X_MARK) {
    gameState[row][col] = CROWN;
  } else {
    gameState[row][col] = EMPTY;
  }

  // Check for conflicts and win condition
  checkConflicts();
  checkWinCondition();
  renderBoard();
}

// Check for conflicts
function checkConflicts() {
  conflictingCells.clear();
  const crowns = [];

  // Find all crowns
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (gameState[row][col] === CROWN) {
        crowns.push({ row, col });
      }
    }
  }

  // Check each pair of crowns for conflicts
  for (let i = 0; i < crowns.length; i++) {
    for (let j = i + 1; j < crowns.length; j++) {
      const crown1 = crowns[i];
      const crown2 = crowns[j];

      // Check if in same row
      if (crown1.row === crown2.row) {
        conflictingCells.add(`${crown1.row},${crown1.col}`);
        conflictingCells.add(`${crown2.row},${crown2.col}`);
      }

      // Check if in same column
      if (crown1.col === crown2.col) {
        conflictingCells.add(`${crown1.row},${crown1.col}`);
        conflictingCells.add(`${crown2.row},${crown2.col}`);
      }

      // Check if in same region
      if (boardLayout[crown1.row][crown1.col] === boardLayout[crown2.row][crown2.col]) {
        conflictingCells.add(`${crown1.row},${crown1.col}`);
        conflictingCells.add(`${crown2.row},${crown2.col}`);
      }

      // Check if touching (including diagonally)
      const rowDiff = Math.abs(crown1.row - crown2.row);
      const colDiff = Math.abs(crown1.col - crown2.col);
      if (rowDiff <= 1 && colDiff <= 1) {
        conflictingCells.add(`${crown1.row},${crown1.col}`);
        conflictingCells.add(`${crown2.row},${crown2.col}`);
      }
    }
  }
}

// Check win condition
function checkWinCondition() {
  // Count crowns
  let crownCount = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (gameState[row][col] === CROWN) {
        crownCount++;
      }
    }
  }

  // Need exactly 9 crowns with no conflicts
  if (crownCount === 9 && conflictingCells.size === 0) {
    // Verify each row, column, and region has exactly one crown
    if (isValidSolution()) {
      updateMessage("Congratulations! You solved the puzzle!", true);
    }
  } else {
    updateMessage("");
  }
}

// Verify the solution is valid
function isValidSolution() {
  // Check rows
  for (let row = 0; row < 9; row++) {
    let count = 0;
    for (let col = 0; col < 9; col++) {
      if (gameState[row][col] === CROWN) count++;
    }
    if (count !== 1) return false;
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      if (gameState[row][col] === CROWN) count++;
    }
    if (count !== 1) return false;
  }

  // Check regions
  const regionCounts = new Array(10).fill(0); // regions 1-9
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (gameState[row][col] === CROWN) {
        regionCounts[boardLayout[row][col]]++;
      }
    }
  }
  for (let i = 1; i <= 9; i++) {
    if (regionCounts[i] !== 1) return false;
  }

  return true;
}

// Undo last move
function undo() {
  if (moveHistory.length === 0) return;

  const lastMove = moveHistory.pop();
  gameState = lastMove.gameStateCopy;

  checkConflicts();
  checkWinCondition();
  renderBoard();
}

// Reset game
function reset() {
  if (confirm("Are you sure you want to reset the game?")) {
    initGame();
  }
}

// Update message
function updateMessage(text, isSuccess = false) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = text;
  messageElement.className = isSuccess ? "message success" : "message";
}

// Event listeners
document.getElementById("undo-btn").addEventListener("click", undo);
document.getElementById("reset-btn").addEventListener("click", reset);

// Initialize game on load
initGame();
