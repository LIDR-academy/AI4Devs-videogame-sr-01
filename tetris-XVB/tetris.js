// Tetris Game Implementation
// Author: AI4Devs

// --- Constants ---
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const BOARD_COLOR = '#222';
const COLORS = [
    null,
    '#00f0f0', // I
    '#0000f0', // J
    '#f0a000', // L
    '#f0f000', // O
    '#00f000', // S
    '#a000f0', // T
    '#f00000'  // Z
];

const SHAPES = [
    [],
    [ // I
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [ // J
        [2,0,0],
        [2,2,2],
        [0,0,0]
    ],
    [ // L
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ],
    [ // O
        [4,4],
        [4,4]
    ],
    [ // S
        [0,5,5],
        [5,5,0],
        [0,0,0]
    ],
    [ // T
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],
    [ // Z
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]
];

// --- Utility Functions ---
function randomPieceType() {
    return 1 + Math.floor(Math.random() * 7);
}

// --- Tetromino Class ---
class Tetromino {
    constructor(type) {
        this.type = type;
        this.shape = SHAPES[type].map(row => [...row]);
        this.row = 0;
        this.col = Math.floor((COLS - this.shape[0].length) / 2);
    }
    rotate() {
        // Deep copy and rotate
        const N = this.shape.length;
        const rotated = Array.from({length: N}, () => Array(N).fill(0));
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                rotated[c][N-1-r] = this.shape[r][c];
            }
        }
        return rotated;
    }
}

// --- Board Class ---
class Board {
    constructor() {
        this.grid = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    }
    isValid(tetromino, rowOffset = 0, colOffset = 0, shapeOverride = null) {
        const shape = shapeOverride || tetromino.shape;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const newRow = tetromino.row + r + rowOffset;
                    const newCol = tetromino.col + c + colOffset;
                    if (
                        newRow < 0 || newRow >= ROWS ||
                        newCol < 0 || newCol >= COLS ||
                        this.grid[newRow][newCol]
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    place(tetromino) {
        for (let r = 0; r < tetromino.shape.length; r++) {
            for (let c = 0; c < tetromino.shape[r].length; c++) {
                if (tetromino.shape[r][c]) {
                    this.grid[tetromino.row + r][tetromino.col + c] = tetromino.type;
                }
            }
        }
    }
    clearLines() {
        let lines = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (this.grid[r].every(cell => cell !== 0)) {
                this.grid.splice(r, 1);
                this.grid.unshift(Array(COLS).fill(0));
                lines++;
                r++; // recheck this row
            }
        }
        return lines;
    }
}

// --- Game State ---
let board, current, next, score, level, lines, dropInterval, dropTimer, isPaused, isGameOver;

function resetGame() {
    board = new Board();
    current = new Tetromino(randomPieceType());
    next = new Tetromino(randomPieceType());
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 800;
    isPaused = false;
    isGameOver = false;
    updateUI();
    draw();
    if (dropTimer) clearInterval(dropTimer);
    dropTimer = setInterval(gameTick, dropInterval);
}

function gameTick() {
    if (isPaused || isGameOver) return;
    if (board.isValid(current, 1, 0)) {
        current.row++;
    } else {
        board.place(current);
        const cleared = board.clearLines();
        if (cleared > 0) {
            score += [0, 100, 300, 500, 800][cleared] * level;
            lines += cleared;
            if (lines >= level * 10) {
                level++;
                dropInterval = Math.max(100, 800 - (level - 1) * 50);
                clearInterval(dropTimer);
                dropTimer = setInterval(gameTick, dropInterval);
            }
        }
        current = next;
        next = new Tetromino(randomPieceType());
        if (!board.isValid(current)) {
            endGame();
            return;
        }
    }
    updateUI();
    draw();
}

function endGame() {
    isGameOver = true;
    clearInterval(dropTimer);
    document.getElementById('game-over').classList.add('active');
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
}

// --- Rendering ---
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece');
const nextCtx = nextCanvas.getContext('2d');

function drawBlock(ctx, x, y, type) {
    ctx.fillStyle = COLORS[type];
    ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#111';
    ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
}

function draw() {
    // Draw board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board.grid[r][c]) {
                drawBlock(ctx, c * BLOCK_SIZE, r * BLOCK_SIZE, board.grid[r][c]);
            }
        }
    }
    // Draw current tetromino
    for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[r].length; c++) {
            if (current.shape[r][c]) {
                drawBlock(ctx, (current.col + c) * BLOCK_SIZE, (current.row + r) * BLOCK_SIZE, current.type);
            }
        }
    }
    // Draw next piece
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    for (let r = 0; r < next.shape.length; r++) {
        for (let c = 0; c < next.shape[r].length; c++) {
            if (next.shape[r][c]) {
                drawBlock(nextCtx, c * BLOCK_SIZE, r * BLOCK_SIZE, next.type);
            }
        }
    }
}

// --- UI Updates ---
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// --- Input Handling ---
document.addEventListener('keydown', (e) => {
    if (isGameOver || isPaused) return;
    let moved = false;
    if (e.key === 'ArrowLeft') {
        if (board.isValid(current, 0, -1)) {
            current.col--;
            moved = true;
        }
    } else if (e.key === 'ArrowRight') {
        if (board.isValid(current, 0, 1)) {
            current.col++;
            moved = true;
        }
    } else if (e.key === 'ArrowDown') {
        if (board.isValid(current, 1, 0)) {
            current.row++;
            moved = true;
        }
    } else if (e.key === 'ArrowUp') {
        // Rotate
        const rotated = current.rotate();
        if (board.isValid(current, 0, 0, rotated)) {
            current.shape = rotated;
            moved = true;
        }
    } else if (e.key === ' ') {
        // Hard drop
        while (board.isValid(current, 1, 0)) {
            current.row++;
            score += 2;
        }
        moved = true;
        gameTick();
    } else if (e.key.toLowerCase() === 'p') {
        togglePause();
    }
    if (moved) {
        updateUI();
        draw();
    }
});

document.getElementById('pause-btn').onclick = togglePause;
document.getElementById('restart-btn').onclick = resetGame;
document.getElementById('restart-btn-overlay').onclick = () => {
    document.getElementById('game-over').classList.remove('active');
    resetGame();
};

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    document.getElementById('pause-btn').textContent = isPaused ? 'Resume' : 'Pause';
}

// --- Start Game ---
window.onload = resetGame; 