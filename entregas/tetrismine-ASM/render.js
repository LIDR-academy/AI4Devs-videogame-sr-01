let canvas, ctx;
let nextCanvas, nextCtx;
const CELL_SIZE = 30;

// Preload mine icon
const mineImg = new Image();
mineImg.src = '/assets/mine.png';

let boardContainer, nextContainer, scoreContainer, topScoreContainer, gameOverContainer;
let cellElements = [];

export function initRenderer(board) {
  _ensureContainers();
  _initCanvases(board);
}

function _ensureContainers() {
  boardContainer = document.getElementById('board');
  if (!boardContainer) {
    boardContainer = document.createElement('div');
    boardContainer.id = 'board';
    document.body.appendChild(boardContainer);
  }

  nextContainer = document.getElementById('nextCanvas');
  if (!nextContainer) {
    nextContainer = document.createElement('canvas');
    nextContainer.id = 'nextCanvas';
    nextContainer.width = 60;
    nextContainer.height = 60;
    document.body.appendChild(nextContainer);
  }

  scoreContainer = document.getElementById('score');
  if (!scoreContainer) {
    scoreContainer = document.createElement('div');
    scoreContainer.id = 'score';
    document.body.appendChild(scoreContainer);
  }

  topScoreContainer = document.getElementById('topScore') ||
                      document.getElementById('top-score');

  if (!topScoreContainer) {
    topScoreContainer = document.createElement('div');
    topScoreContainer.id = 'topScore';
    document.body.appendChild(topScoreContainer);
  }

  gameOverContainer = document.getElementById('game-over');
  if (!gameOverContainer) {
    gameOverContainer = document.createElement('div');
    gameOverContainer.id = 'game-over';
    gameOverContainer.classList.add('gameOverBox','hidden');
    document.body.appendChild(gameOverContainer);
  }
}

function _initCanvases(board) {
  // Set up main board as canvas
  boardContainer.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.width = board[0].length * CELL_SIZE;
  canvas.height = board.length * CELL_SIZE;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  boardContainer.appendChild(canvas);
  
  ctx = canvas.getContext('2d');

  // Set up next piece canvas
  nextCanvas = document.getElementById('nextCanvas');
  if (nextCanvas) {
    nextCtx = nextCanvas.getContext('2d');
  }
}

function _classForCell(cell, isCurrent = false) {
  if (isCurrent) return 'cell current';
  if (cell.fixed) {
    if (cell.value === 'B') return 'cell bomb';
    return 'cell number';
  }
  return 'cell empty';
}

export function renderBoard(board, currentPiece) {
  if (!ctx) return;
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const rows = board.length, cols = board[0].length;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = board[y][x];
      const isCurrent = currentPiece && currentPiece.x === x && currentPiece.y === y;
      
      // Draw cell background
      if (!cell.value && !isCurrent) {
        // Empty cell - just grid lines
        ctx.strokeStyle = '#808080';
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else {
        // Determine what to draw
        let value = cell.value;
        let bgColor = '#C0C0C0';
        
        if (isCurrent) {
          value = currentPiece.value;
          // Si es bomba en caída, dibujar icono directamente
          if (value === 'B') {
            if (mineImg.complete) {
              ctx.drawImage(mineImg, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
              // Fallback
              ctx.fillStyle = '#000';
              ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 16px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('B', x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
            }
            continue; // nada más que dibujar
          }
          bgColor = '#90caf9'; // Current numeric piece color
        } else if (cell.fixed) {
          if (cell.value === 'B') {
            // Draw bomb with mine image
            if (mineImg.complete) {
              ctx.drawImage(mineImg, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
              // Fallback if image not loaded
              ctx.fillStyle = '#000';
              ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 16px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('B', x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
            }
            continue;
          } else {
            bgColor = '#F8AC1B'; // Number cell color
          }
        }
        
        // Draw background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        // Draw border
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * CELL_SIZE + 0.5, y * CELL_SIZE + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
        
        // Draw text for numbers
        if (value !== 'B' && value) {
          ctx.fillStyle = 'black';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(value, x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
        }
      }
    }
  }
}

export function renderNextPiece(piece) {
  if (!nextCtx) return;
  
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const cX = nextCanvas.width / 2, cY = nextCanvas.height / 2, sz = 40;

  if (piece.value === 'B') {
    if (mineImg.complete) {
      nextCtx.drawImage(mineImg, cX - sz / 2, cY - sz / 2, sz, sz);
    } else {
      // Fallback
      nextCtx.fillStyle = '#000';
      nextCtx.fillRect(cX - sz / 2, cY - sz / 2, sz, sz);
      nextCtx.fillStyle = '#fff';
      nextCtx.font = 'bold 20px sans-serif';
      nextCtx.textAlign = 'center';
      nextCtx.textBaseline = 'middle';
      nextCtx.fillText('B', cX, cY);
    }
  } else {
    nextCtx.fillStyle = '#F8AC1B';
    nextCtx.fillRect(cX - sz / 2, cY - sz / 2, sz, sz);

    nextCtx.strokeStyle = '#808080';
    nextCtx.lineWidth = 1;
    nextCtx.strokeRect(cX - sz / 2 + 0.5, cY - sz / 2 + 0.5, sz - 1, sz - 1);

    nextCtx.fillStyle = 'black';
    nextCtx.font = 'bold 20px sans-serif';
    nextCtx.textAlign = 'center';
    nextCtx.textBaseline = 'middle';
    nextCtx.fillText(piece.value, cX, cY);
  }
}

export function renderScore(score, topScore = null) {
  if (scoreContainer) {
    scoreContainer.textContent = score;
  }
  if (topScore !== null && topScore !== undefined && topScoreContainer) {
    topScoreContainer.textContent = topScore;
  }
}

export function renderGameOver(score) {
  gameOverContainer.innerHTML = `<h2>Game Over</h2><p>Final score: ${score}</p>`;
  gameOverContainer.classList.remove('hidden');
} 