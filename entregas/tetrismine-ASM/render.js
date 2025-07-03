let canvas, ctx;
let nextCanvas, nextCtx;
const cellSize = 30;

/* preload mine icon once */
const mineImg = new Image();
mineImg.src = 'assets/mine.png';

// Se llamará una vez al inicio
function initRenderer(rows, cols) {
  canvas     = document.getElementById('gameCanvas');
  ctx        = canvas.getContext('2d');
  nextCanvas = document.getElementById('nextCanvas');
  nextCtx    = nextCanvas.getContext('2d');

  canvas.width  = cols * cellSize;
  canvas.height = rows * cellSize;
}

// Dibuja el tablero completo
function drawBoard(board) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rows = board.length, cols = board[0].length;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = board[y][x];

      if (!cell.value) {
        ctx.strokeStyle = '#808080';
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      } else {
        /* draw bomb icon or numbered cell */
        if (cell.value === 'B'){
          ctx.drawImage(mineImg,
            x * cellSize, y * cellSize, cellSize, cellSize);
        }else{
          ctx.fillStyle = '#F8AC1B';           // warmer amber
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

          /* thin grey outline so adjacent numbers stay visually separate */
          ctx.strokeStyle = '#808080';
          ctx.lineWidth   = 1;
          ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5,
                         cellSize - 1, cellSize - 1);

          ctx.fillStyle = 'black';
          ctx.font = 'bold 16px sans-serif';   // already bold
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cell.value,
                       x * cellSize + cellSize / 2,
                       y * cellSize + cellSize / 2);
        }
      }
    }
  }
}

// Dibuja la pieza que vendrá después
function drawNext(nextPiece) {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const cX = nextCanvas.width / 2, cY = nextCanvas.height / 2, sz = 40;

  if (nextPiece === 'B'){
    nextCtx.drawImage(mineImg,
      cX - sz / 2, cY - sz / 2, sz, sz);
  }else{
    nextCtx.fillStyle = '#F8AC1B';
    nextCtx.fillRect(cX - sz / 2, cY - sz / 2, sz, sz);

    nextCtx.strokeStyle = '#808080';
    nextCtx.lineWidth   = 1;
    nextCtx.strokeRect(cX - sz / 2 + .5, cY - sz / 2 + .5, sz-1, sz-1);

    nextCtx.fillStyle = 'black';
    nextCtx.font = 'bold 20px sans-serif';
    nextCtx.textAlign = 'center';
    nextCtx.textBaseline = 'middle';
    nextCtx.fillText(nextPiece, cX, cY);
  }
}

function updateScores(score, top) {
  document.getElementById('score').textContent    = score;
  document.getElementById('topScore').textContent = top;
}

// Método público para Game
function render(board, nextPiece, score, topScore) {
  drawBoard(board);
  drawNext(nextPiece);
  updateScores(score, topScore);
}

window.Render = { initRenderer, render }; 