// --- Parámetros -------------------------------------------------------------
const ROWS = 20, COLS = 10;
let board, score, topScore, gravityId, nextPiece, justSpawned, discardCount;

// ------------------ util ------------------
// --- Generador de piezas: modo normal y modo test ---
//const PIECE_SEQUENCE = [1,'B',1,2,2,2,'B',2,1,1,1,'B']; // ← aquí puedes poner los valores que quieras, ej: [1,2,'B',1,1,'B']
//const PIECE_SEQUENCE = [3,3,1,2,2,2,'B',2,1,1,1,'B']; // ← aquí puedes poner los valores que quieras, ej: [1,2,'B',1,1,'B']

function randPiece() {
  //if (PIECE_SEQUENCE.length > 0) {
  //  return PIECE_SEQUENCE.shift(); // saca el primero de la lista
  //}
  // modo normal (random)
  return (Math.random() < 0.2 ? 'B' : Math.floor(Math.random() * 8) + 1);
}

//modo PRO: const randPiece = () => (Math.random() < 0.2 ? 'B' : Math.floor(Math.random() * 8) + 1);

const activePos = () => {
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (board[y][x].justPlaced) return { y, x };
  return null;
};

/* helpers to pause / resume gravity */
const pauseGame  = () => { clearInterval(gravityId); gravityId = null; };
const resumeGame = () => { if (!gravityId) gravityId = setInterval(tick, 500); };

// ------------------ mecánica --------------
function spawnPiece() {
  const value = nextPiece ?? randPiece();
  nextPiece = randPiece();

  const x = Math.floor(COLS / 2), y = 0;
  if (board[y][x].value) return gameOver();

  board[y][x] = { value, fixed: false, justPlaced: true };
  justSpawned = true;
  Render.render(board, nextPiece, score, topScore);
}

function fixCell(cell) {
  cell.fixed = true;
  cell.justPlaced = false;
}

function tick() {
  if (justSpawned) {
    justSpawned = false;
    return Render.render(board, nextPiece, score, topScore);
  }

  const pos = activePos();
  if (!pos) { spawnPiece(); return; }
  const { y, x } = pos;

  if (y === ROWS - 1 || board[y + 1][x].value) {
    fixCell(board[y][x]);

    if (!Validation.validateBoard(board)){
      handleInvalidMove(y, x);
      return;
    }

    addScore(100);
    Render.render(board, nextPiece, score, topScore);
    spawnPiece();
    return;
  }

  board[y + 1][x] = { ...board[y][x] };
  board[y][x] = Board.createEmptyCell();
  Render.render(board, nextPiece, score, topScore);
}

function moveHoriz(dx) {
  const p = activePos();
  if (!p) return;
  const { y, x } = p, nx = x + dx;
  if (nx < 0 || nx >= COLS || board[y][nx].value) return;
  board[y][nx] = { ...board[y][x] };
  board[y][x] = Board.createEmptyCell();
  Render.render(board, nextPiece, score, topScore);
}

// ------------------ input -----------------
function key(e) {
  if (!gravityId) return;                 // ← ignore controls when paused
  if (e.key === 'ArrowLeft')  moveHoriz(-1);
  if (e.key === 'ArrowRight') moveHoriz(1);
  if (e.key === 'ArrowDown')  tick();
}

function updateDiscardButtonText() {
  const penalty = (discardCount + 1) * 5;
  document.getElementById('discardBtn').textContent = `Discard (-${penalty} pts)`;
}

function discard() {
  if (!gravityId) return;                 // ← ignore click when paused
  const penalty = (discardCount + 1) * 5;
  if (score < penalty) {
    Modal.show(MSG.notEnoughPoints);
    return;
  }
  const p = activePos();
  if (!p) return;                 // no hay ficha en caída

  /* 3. Eliminar la ficha, restar puntos y generar nueva */
  board[p.y][p.x] = Board.createEmptyCell();
  score -= penalty;
  discardCount++;
  updateDiscardButtonText();
  Render.render(board, nextPiece, score, topScore);
  spawnPiece();
}

// ------------------ ciclo -----------------
function gameOver() {
  pauseGame();

  /* store topScore not final score */
  if (playerName){
    const arr = getScores();
    arr.push({ name:playerName, score:topScore });
    arr.sort((a,b)=>b.score-a.score);
    saveScores(arr);
  }
  renderLeaderboard();

  /* build HTML with two buttons */
  Modal.showHtml(`
       <p style="margin-bottom:18px">${MSG.gameOver}</p>
       <button id="btnAgain" class="modalBtn">${MSG.playAgain}</button>
       <button id="btnMenu"  class="modalBtn">${MSG.mainMenu}</button>
  `);

  document.getElementById('btnAgain').onclick = () => {
       Modal.hide();
       resetGame();
  };
  document.getElementById('btnMenu').onclick  = () => {
       Modal.hide();
       document.getElementById('welcomeScreen').style.display = 'flex';
  };
}

function start() {
  board = Board.createEmptyBoard(ROWS, COLS);
  score = 100;
  topScore = 100;
  nextPiece = randPiece();
  justSpawned = false;
  discardCount = 0;
  updateDiscardButtonText();

  Render.initRenderer(ROWS, COLS);

  /* ---- inyectar etiquetas desde messages.js ---- */
  document.getElementById('scoreLabel').textContent = MSG.scoreLabel + ' ';
  document.getElementById('topLabel').textContent   = MSG.topLabel + ' ';
  document.getElementById('discardBtn').textContent = MSG.discardLabel;
  document.getElementById('nextLabel').textContent = MSG.nextLabel;

  document.addEventListener('keydown', key);
  document.getElementById('discardBtn').addEventListener('click', discard);

  spawnPiece();
  gravityId = setInterval(tick, 500);
}

/* ---------- NEW helper ---------- */
function handleInvalidMove(y, x){
  pauseGame();                          // stop gravity

  if (score >= 50){
    score -= 50;                        // A.1
    board[y][x] = Board.createEmptyCell();  // A.2  remove bad piece
    Render.render(board, nextPiece, score, topScore);

    // A.3  show banner, resume on click
    Modal.show(MSG.mistakeMinus50, () => {
      spawnPiece();                     // continue with next piece
      resumeGame();
    });
  }else{
    score = 0;                          // B.1
    Render.render(board, nextPiece, score, topScore);
    gameOver();                         // B.2  normal Game Over popup
  }
}

/* ───  NEW GLOBAL  ───────────────────────────────── */
let playerName = '';     // filled from start screen

/* ───  WELCOME-SCREEN HANDLERS  ───────────────────── */
function initWelcome(){
  const input  = document.getElementById('playerName');
  const start  = document.getElementById('startBtn');

  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^A-Za-z0-9 ]/g, '');
    start.disabled = !input.value.trim();
  });

  start.addEventListener('click', () => {
    playerName = input.value.trim().slice(0, 15);   // hard cap
    document.getElementById('welcomeScreen').style.display = 'none';
    Game.start();                // begin the game
  });

  renderLeaderboard();           // show top-10 immediately
}
window.addEventListener('DOMContentLoaded', initWelcome);

/* ───  LEADERBOARD UTILITIES  ─────────────────────── */
const LS_KEY = 'tetrismineScores';

function getScores(){
  return JSON.parse(localStorage.getItem(LS_KEY)||'[]');
}
function saveScores(arr){
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}
function renderLeaderboard(){
  const list = document.getElementById('leaderboard');
  const scores = getScores().slice(0,10);
  list.innerHTML = scores.map(
    s=>`<li>${s.name.padEnd(12,'&nbsp;')}  ${s.score}</li>`).join('');
}

function addScore(delta){
  score += delta;
  if (score > topScore) topScore = score;
}

/* helper: fully reset state without touching name / leaderboard */
function resetGame(){
  board     = Board.createEmptyBoard(ROWS, COLS);
  score     = 100;
  topScore  = 100;
  nextPiece = randPiece();
  justSpawned = false;
  discardCount = 0;
  updateDiscardButtonText();
  Render.render(board, nextPiece, score, topScore);
  gravityId = setInterval(tick, 500);
}

window.Game = { start };

document.getElementById('logo').addEventListener('click', () => {
  // Pausa el juego
  pauseGame && pauseGame();
  // Limpia el tablero y variables
  if (typeof resetGame === 'function') resetGame();
  // Limpia el nombre y desactiva el botón de start
  document.getElementById('playerName').value = '';
  document.getElementById('startBtn').disabled = true;
  // Muestra la pantalla principal
  document.getElementById('welcomeScreen').style.display = 'flex';
  // Oculta el tablero
  document.getElementById('gameScreen').style.display = 'none';
});