// Flappy Bird Clone - Minimalist Vanilla JS Implementation

// Canvas and game constants
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Responsive canvas sizing
const BASE_WIDTH = 360;
const BASE_HEIGHT = 640;

// Bird constants
const BIRD_RADIUS = 18;
const BIRD_X = BASE_WIDTH * 0.28;
const GRAVITY = 0.52;
const FLAP = -8.5;

// Pipe constants
const PIPE_WIDTH = 56;
const PIPE_GAP = 148;
const PIPE_SPEED = 2.2;
const PIPE_INTERVAL = 1200; // ms

// Ground constants
const GROUND_HEIGHT = 64;

// Game state
let birdY, birdVY, pipes, score, best, gameOver, lastPipeTime, animationId;

// Touch controls
let touchStartY = null;

// Utility: scale canvas for device pixel ratio
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  let width = Math.min(window.innerWidth * 0.9, BASE_WIDTH);
  let height = width * (BASE_HEIGHT / BASE_WIDTH);
  if (window.innerHeight * 0.9 < height) {
    height = window.innerHeight * 0.9;
    width = height * (BASE_WIDTH / BASE_HEIGHT);
  }
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(canvas.width / BASE_WIDTH, canvas.height / BASE_HEIGHT);
}
window.addEventListener('resize', resizeCanvas);

// Initialize or reset game state
function resetGame() {
  birdY = BASE_HEIGHT / 2;
  birdVY = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  lastPipeTime = performance.now();
  document.getElementById('score').textContent = score;
  document.getElementById('game-over').classList.add('hidden');
  resizeCanvas();
  spawnPipe();
}

// Draw the bird (circle with a small beak)
function drawBird() {
  // Body
  ctx.save();
  ctx.beginPath();
  ctx.arc(BIRD_X, birdY, BIRD_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = 'var(--bird)';
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  // Beak (triangle)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(BIRD_X + BIRD_RADIUS - 2, birdY - 6);
  ctx.lineTo(BIRD_X + BIRD_RADIUS + 10, birdY);
  ctx.lineTo(BIRD_X + BIRD_RADIUS - 2, birdY + 6);
  ctx.closePath();
  ctx.fillStyle = '#f9844a';
  ctx.fill();
  ctx.restore();

  // Eye
  ctx.save();
  ctx.beginPath();
  ctx.arc(BIRD_X + 7, birdY - 6, 3.2, 0, 2 * Math.PI);
  ctx.fillStyle = '#22223b';
  ctx.fill();
  ctx.restore();
}

// Draw pipes (rectangles with rounded ends)
function drawPipes() {
  ctx.save();
  ctx.fillStyle = 'var(--pipe)';
  pipes.forEach(pipe => {
    // Top pipe
    roundRect(ctx, pipe.x, 0, PIPE_WIDTH, pipe.top, 16);
    ctx.fill();
    // Bottom pipe
    roundRect(ctx, pipe.x, pipe.bottom, PIPE_WIDTH, BASE_HEIGHT - pipe.bottom - GROUND_HEIGHT, 16);
    ctx.fill();
  });
  ctx.restore();
}

// Draw ground (simple rectangle)
function drawGround() {
  ctx.save();
  ctx.fillStyle = 'var(--ground)';
  ctx.fillRect(0, BASE_HEIGHT - GROUND_HEIGHT, BASE_WIDTH, GROUND_HEIGHT);
  ctx.restore();
}

// Utility: draw rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Spawn a new pipe pair
function spawnPipe() {
  const minPipeHeight = 60;
  const maxPipeHeight = BASE_HEIGHT - PIPE_GAP - GROUND_HEIGHT - minPipeHeight;
  const top = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
  pipes.push({
    x: BASE_WIDTH,
    top: top,
    bottom: top + PIPE_GAP,
    passed: false
  });
}

// Main game loop
function gameLoop(now) {
  // Physics
  birdVY += GRAVITY;
  birdY += birdVY;

  // Pipes movement
  pipes.forEach(pipe => {
    pipe.x -= PIPE_SPEED;
  });

  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
  }

  // Spawn new pipes
  if (now - lastPipeTime > PIPE_INTERVAL) {
    spawnPipe();
    lastPipeTime = now;
  }

  // Collision detection
  if (birdY + BIRD_RADIUS > BASE_HEIGHT - GROUND_HEIGHT) {
    // Hit the ground
    endGame();
    return;
  }
  if (birdY - BIRD_RADIUS < 0) {
    // Hit the ceiling
    birdY = BIRD_RADIUS;
    birdVY = 0;
  }
  for (const pipe of pipes) {
    if (
      BIRD_X + BIRD_RADIUS > pipe.x &&
      BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH
    ) {
      if (
        birdY - BIRD_RADIUS < pipe.top ||
        birdY + BIRD_RADIUS > pipe.bottom
      ) {
        endGame();
        return;
      }
    }
    // Score update
    if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
      pipe.passed = true;
      score++;
      document.getElementById('score').textContent = score;
    }
  }

  // Drawing
  ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  drawGround();
  drawPipes();
  drawBird();
 
  // Continue loop
  if (!gameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// End the game and show game over screen
function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  document.getElementById('final-score').textContent = `Score: ${score}`;
  document.getElementById('game-over').classList.remove('hidden');
}

// Bird jump (flap)
function flap() {
  if (gameOver) return;
  birdVY = FLAP;
}

// Permitir salto con la barra espaciadora o flecha arriba en toda la ventana
window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    flap();
  }
}); 

// Obtener la mejor puntuación de localStorage
function getBestScore() {
  return parseInt(localStorage.getItem('flappy_best') || '0', 10);
}

// Guardar la mejor puntuación en localStorage
function setBestScore(val) {
  localStorage.setItem('flappy_best', val);
}

// Actualizar visualmente el marcador de best score
function updateBestDisplay(val) {
  document.getElementById('best').textContent = 'Best: ' + val;
}

// Modifica resetGame para mostrar el best score
function resetGame() {
  birdY = BASE_HEIGHT / 2;
  birdVY = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  lastPipeTime = performance.now();
  document.getElementById('score').textContent = score;
  updateBestDisplay(getBestScore());
  document.getElementById('game-over').classList.add('hidden');
  resizeCanvas();
  spawnPipe();
}

// Modifica endGame para actualizar el best score si es necesario
function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  if (score > getBestScore()) {
    setBestScore(score);
    updateBestDisplay(score);
  }
  document.getElementById('final-score').textContent = `Score: ${score}`;
  document.getElementById('game-over').classList.remove('hidden');
} 

// Event listeners for controls
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  flap();
  canvas.focus();
});
canvas.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    flap();
  }
});
canvas.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: false });
canvas.addEventListener('touchend', e => {
  if (touchStartY !== null) {
    flap();
    touchStartY = null;
  }
}, { passive: false });

// Restart button
document.getElementById('restart-btn').addEventListener('click', () => {
  resetGame();
  animationId = requestAnimationFrame(gameLoop);
  canvas.focus();
});

// Accessibility: allow pressing Enter to restart
document.getElementById('restart-btn').addEventListener('keydown', e => {
  if (e.code === 'Enter' || e.code === 'Space') {
    resetGame();
    animationId = requestAnimationFrame(gameLoop);
    canvas.focus();
  }
});

// Start game on load
window.addEventListener('DOMContentLoaded', () => {
  resetGame();
  animationId = requestAnimationFrame(gameLoop);
  canvas.focus();
}); 