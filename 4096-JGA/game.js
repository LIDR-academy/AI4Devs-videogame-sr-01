class Game2048 {
  constructor() {
    this.GRID_SIZE = 5;
    this.TARGET = 4096;
    this.board = [];
    this.score = 0;
    this.bestScore = this.loadBestScore();
    this.gameState = 'playing'; // 'playing', 'won', 'lost'
    this.previousState = null;
    this.canUndo = false;

    this.initializeGame();
    this.bindEvents();
    this.updateDisplay();
  }

  initializeGame() {
    this.board = Array(this.GRID_SIZE)
      .fill()
      .map(() => Array(this.GRID_SIZE).fill(0));
    this.score = 0;
    this.gameState = 'playing';
    this.canUndo = false;
    this.addRandomTile();
    this.addRandomTile();
    this.updateDisplay();
  }

  saveState() {
    this.previousState = {
      board: this.board.map((row) => [...row]),
      score: this.score,
      gameState: this.gameState,
    };
    this.canUndo = true;
    this.updateUndoButton();
  }

  undo() {
    if (this.canUndo && this.previousState) {
      this.board = this.previousState.board;
      this.score = this.previousState.score;
      this.gameState = this.previousState.gameState;
      this.canUndo = false;
      this.updateDisplay();
      this.updateUndoButton();
    }
  }

  updateUndoButton() {
    const undoBtn = document.getElementById('undo-btn');
    undoBtn.disabled = !this.canUndo;
    undoBtn.style.opacity = this.canUndo ? '1' : '0.5';
  }

  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    if (this.gameState !== 'playing') return;

    this.saveState();
    let moved = false;

    const newBoard = this.board.map((row) => [...row]);

    switch (direction) {
      case 'ArrowLeft':
        moved = this.moveLeft(newBoard);
        break;
      case 'ArrowRight':
        moved = this.moveRight(newBoard);
        break;
      case 'ArrowUp':
        moved = this.moveUp(newBoard);
        break;
      case 'ArrowDown':
        moved = this.moveDown(newBoard);
        break;
    }

    if (moved) {
      this.board = newBoard;
      this.addRandomTile();
      this.updateDisplay();
      this.checkGameState();
    } else {
      this.canUndo = false;
      this.updateUndoButton();
    }
  }

  moveLeft(board) {
    let moved = false;
    for (let i = 0; i < this.GRID_SIZE; i++) {
      const row = board[i].filter((cell) => cell !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < this.GRID_SIZE) {
        row.push(0);
      }

      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (board[i][j] !== row[j]) {
          moved = true;
          board[i][j] = row[j];
        }
      }
    }
    return moved;
  }

  moveRight(board) {
    let moved = false;
    for (let i = 0; i < this.GRID_SIZE; i++) {
      const row = board[i].filter((cell) => cell !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j - 1, 1);
          j--;
        }
      }
      while (row.length < this.GRID_SIZE) {
        row.unshift(0);
      }

      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (board[i][j] !== row[j]) {
          moved = true;
          board[i][j] = row[j];
        }
      }
    }
    return moved;
  }

  moveUp(board) {
    let moved = false;
    for (let j = 0; j < this.GRID_SIZE; j++) {
      const column = [];
      for (let i = 0; i < this.GRID_SIZE; i++) {
        if (board[i][j] !== 0) {
          column.push(board[i][j]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
        }
      }

      while (column.length < this.GRID_SIZE) {
        column.push(0);
      }

      for (let i = 0; i < this.GRID_SIZE; i++) {
        if (board[i][j] !== column[i]) {
          moved = true;
          board[i][j] = column[i];
        }
      }
    }
    return moved;
  }

  moveDown(board) {
    let moved = false;
    for (let j = 0; j < this.GRID_SIZE; j++) {
      const column = [];
      for (let i = 0; i < this.GRID_SIZE; i++) {
        if (board[i][j] !== 0) {
          column.push(board[i][j]);
        }
      }

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i - 1, 1);
          i--;
        }
      }

      while (column.length < this.GRID_SIZE) {
        column.unshift(0);
      }

      for (let i = 0; i < this.GRID_SIZE; i++) {
        if (board[i][j] !== column[i]) {
          moved = true;
          board[i][j] = column[i];
        }
      }
    }
    return moved;
  }

  checkGameState() {
    // Check for win condition
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (this.board[i][j] === this.TARGET && this.gameState === 'playing') {
          this.gameState = 'won';
          this.showMessage('¡Felicidades!', `¡Has alcanzado ${this.TARGET}!`, 'win');
          return;
        }
      }
    }

    // Check for lose condition
    if (!this.canMove()) {
      this.gameState = 'lost';
      this.showMessage('Juego Terminado', '¡No hay más movimientos posibles!', 'lose');
    }
  }

  canMove() {
    // Check for empty cells
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    // Check for possible merges
    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        const current = this.board[i][j];
        if (
          (i > 0 && this.board[i - 1][j] === current) ||
          (i < this.GRID_SIZE - 1 && this.board[i + 1][j] === current) ||
          (j > 0 && this.board[i][j - 1] === current) ||
          (j < this.GRID_SIZE - 1 && this.board[i][j + 1] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  showMessage(title, text, type) {
    const messageElement = document.getElementById('game-message');
    const titleElement = document.getElementById('message-title');
    const textElement = document.getElementById('message-text');

    titleElement.textContent = title;
    textElement.textContent = text;

    messageElement.className = `game-message ${type}-message show`;
  }

  hideMessage() {
    const messageElement = document.getElementById('game-message');
    messageElement.classList.remove('show');
  }

  updateDisplay() {
    this.updateBoard();
    this.updateScore();
    this.updateBestScore();
    this.updateUndoButton();
  }

  updateBoard() {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';

    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        const tile = document.createElement('div');
        tile.className = 'tile';

        const value = this.board[i][j];
        if (value !== 0) {
          tile.textContent = value;
          tile.classList.add(`tile-${value}`);
        }

        boardElement.appendChild(tile);
      }
    }
  }

  updateScore() {
    document.getElementById('score').textContent = this.score;
  }

  updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveBestScore();
    }
    document.getElementById('best-score').textContent = this.bestScore;
  }

  saveBestScore() {
    // Store in a simple variable since localStorage is not available
    window.gameData = window.gameData || {};
    window.gameData.bestScore = this.bestScore;
  }

  loadBestScore() {
    // Load from simple variable
    return (window.gameData && window.gameData.bestScore) || 0;
  }

  restart() {
    this.hideMessage();
    this.initializeGame();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        this.move(e.key);
      }
    });

    // Touch events for mobile
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
    });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          this.move('ArrowLeft');
        } else {
          this.move('ArrowRight');
        }
      } else {
        if (diffY > 0) {
          this.move('ArrowUp');
        } else {
          this.move('ArrowDown');
        }
      }

      startX = 0;
      startY = 0;
    });
  }
}

// Initialize the game
const game = new Game2048();
