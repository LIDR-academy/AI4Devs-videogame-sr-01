import { createEmptyBoard, getCell } from './board.js';
import {
  initRenderer,
  renderBoard,
  renderNextPiece,
  renderScore,
  renderGameOver
} from './render.js';

const ROWS = 20;
const COLS = 10;
const GRAVITY_INTERVAL = 800; // milliseconds between automatic drops
const PIECE_VALUES = ['B', 1, 2, 3, 4, 5, 6, 7, 8];

// Helpers de timing para pausar/reanudar el loop
function _pauseLoop(instance) {
  if (instance.loop) {
    clearInterval(instance.loop);
    instance.loop = null;
  }
}

function _resumeLoop(instance) {
  if (!instance.loop) {
    instance.loop = setInterval(() => instance._tick(), GRAVITY_INTERVAL);
  }
}

// Helper para clonar el tablero profundamente (incluye Set)
function _cloneBoard(board) {
  return board.map((row) =>
    row.map((cell) => ({
      value: cell.value,
      fixed: cell.fixed,
      justPlaced: cell.justPlaced,
      possibleValues: new Set(cell.possibleValues)
    }))
  );
}

export default class Game {
  constructor(ruleSet, rows = ROWS, cols = COLS) {
    this.rows = rows;
    this.cols = cols;
    this.board = createEmptyBoard(rows, cols);

    // RuleSet strategy (easy / hard)
    this.rules = ruleSet;

    this.score = 100;
    this.topScore = 100;
    this.discardCount = 0;
    this.gameOver = false;

    this.currentPiece = null;
    this.nextPiece = this._randomPiece();

    // Initialise renderer
    initRenderer(this.board);
    renderScore(this.score, this.topScore);
    renderNextPiece(this.nextPiece);

    this._spawnPiece();
    this.loop = setInterval(() => this._tick(), GRAVITY_INTERVAL);

    this._bindControls();

    // Inicializar texto del botón de descarte con penalización actual
    this._updateDiscardButtonLabel();

    // Botón de descarte
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn) {
      discardBtn.addEventListener('click', () => {
        if (!this.gameOver) this._discardPiece();
      });
    }
  }

  _randomPiece() {
    return {
      value: PIECE_VALUES[Math.floor(Math.random() * PIECE_VALUES.length)],
      x: Math.floor(this.cols / 2),
      y: 0
    };
  }

  _spawnPiece() {
    this.currentPiece = this.nextPiece;
    this.currentPiece.x = Math.floor(this.cols / 2);
    this.currentPiece.y = 0;
    this.nextPiece = this._randomPiece();

    /* Si la celda de aparición está ocupada → Game Over */
    if (getCell(this.board, this.currentPiece.y, this.currentPiece.x).fixed) {
      this._endGame();
      return;
    }

    /* ─── Render inmediato ─── */
    renderBoard(this.board, this.currentPiece);
    renderNextPiece(this.nextPiece);
  }

  _movePiece(dx, dy) {
    const newX = this.currentPiece.x + dx;
    const newY = this.currentPiece.y + dy;

    if (newX < 0 || newX >= this.cols || newY >= this.rows) return false;
    const target = getCell(this.board, newY, newX);
    if (target.fixed) return false;

    this.currentPiece.x = newX;
    this.currentPiece.y = newY;
    return true;
  }

  _fixCurrentPiece() {
    const snapshot = _cloneBoard(this.board); // estado antes de mutar
    let shouldSpawnNext = true;
    const { x, y, value } = this.currentPiece;
    const cell = getCell(this.board, y, x);
    cell.value = value;
    cell.fixed = true;
    cell.justPlaced = true;

    // Validación completa niveles 1-3
    const valid = this.rules.isMoveValid(this.board, y, x);

    if (!valid) {
      // El movimiento es inválido: revertimos cualquier bomba añadida
      _rollbackToSnapshot(this.board, snapshot);
      renderBoard(this.board, null);

      // Movimiento inválido → aplicar penalización
      const mistakePenalty = this.rules.getMistakePenalty();
      if (this.score >= mistakePenalty) {
        this.score -= mistakePenalty;
        // Eliminar la pieza inválida para que no quede fijada
        cell.value = null;
        cell.fixed = false;
        cell.justPlaced = false;
        renderScore(this.score, this.topScore);

        // Pausa y muestra popup; al cerrar, continúa
        const missMsg = mistakePenalty >= 100 ? MSG.mistakeMinus100 : MSG.mistakeMinus50;
        _pauseLoop(this);
        window.Modal && Modal.show(missMsg, () => {
          this._spawnPiece();
          _resumeLoop(this);
        });
        shouldSpawnNext = false;
        return shouldSpawnNext;
      } else {
        // Restaurar también el tablero antes de terminar la partida
        _rollbackToSnapshot(this.board, snapshot);
        renderBoard(this.board, null);
        this.score = 0;
        renderScore(this.score, this.topScore);
        this._endGame();
        shouldSpawnNext = false;
        return shouldSpawnNext; // termina aquí
      }
    }

    // Caso válido: la pieza queda fijada definitivamente
    cell.justPlaced = false;

    // ─── RECOMPENSA POR JUGADA CORRECTA ───
    this.score += this.rules.getReward();
    this._updateTopScore();
    renderScore(this.score, this.topScore);

    return shouldSpawnNext;
  }

  _tick() {
    if (this.gameOver) return;

    if (!this._movePiece(0, 1)) {
      // Can't move down → fix piece & maybe spawn next one
      const spawn = this._fixCurrentPiece();
      if (spawn) this._spawnPiece();
    }

    renderBoard(this.board, this.currentPiece);
    renderNextPiece(this.nextPiece);
  }

  _discardPiece() {
    const penalty = this.rules.getDiscardPenalty(this.discardCount);
    if (this.score < penalty) {
      window.Modal ? Modal.show(MSG.notEnoughPoints) : alert(MSG.notEnoughPoints);
      return;
    }

    this.score -= penalty;
    this.discardCount++;
    this._updateDiscardButtonLabel();
    renderScore(this.score, this.topScore);

    // Simplemente lanzamos la siguiente pieza
    this._spawnPiece();
    renderBoard(this.board, this.currentPiece);
    renderNextPiece(this.nextPiece);
  }

  _bindControls() {
    window.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      let changed = false;
      switch (e.key) {
        case 'ArrowLeft':
          changed = this._movePiece(-1, 0);
          break;
        case 'ArrowRight':
          changed = this._movePiece(1, 0);
          break;
        case 'ArrowDown':
          changed = this._movePiece(0, 1);
          break;
        case ' ':
        case 'Spacebar':
        case 'Space':
          while (this._movePiece(0, 1)) {}
          changed = true;
          break;
        default:
          break;
      }
      // Tecla X para descartar pieza
      if (!changed && (e.key === 'x' || e.key === 'X')) {
        this._discardPiece();
        changed = true;
      }
      if (changed) {
        renderBoard(this.board, this.currentPiece);
      }
    });
  }

  _endGame() {
    this.gameOver = true;
    _pauseLoop(this);

    /* ─── Añade puntuación al ranking ─── */
    if (window.saveScore && window.playerName) {
      window.saveScore(window.playerName, this.topScore);
    }

    // Mostrar popup Game Over con opciones
    if (window.Modal && window.MSG) {
      const html = `
        <p class="modalText">${MSG.gameOver}</p>
        <button id="btnAgain" class="modalBtn arcadeBtn" aria-label="Play again">${MSG.playAgain}</button>
        <button id="btnMenu" class="modalBtn arcadeBtn" aria-label="Main menu">${MSG.mainMenu}</button>`;
      Modal.showHtml(html);

      const btnAgain = document.getElementById('btnAgain');
      const btnMenu  = document.getElementById('btnMenu');

      btnAgain.onclick = () => {
        Modal.hide();
        this._resetGame();
      };
      btnMenu.onclick = () => {
        Modal.hide();
        const welcome = document.getElementById('welcomeScreen');
        const gameUI  = document.getElementById('gameUI');
        welcome.classList.remove('hidden');
        gameUI.classList.add('hidden');
        /* Refresca el TOP-10 visible */
        window.renderLeaderboard && window.renderLeaderboard();
      };

      /* Establecer foco inicial en botón Again para accesibilidad */
      btnAgain.focus();
    } else {
      // Fallback simple
      alert('GAME OVER');
    }
  }

  /* Reinicia la partida sin perder el récord */
  _resetGame() {
    this.board = createEmptyBoard(this.rows, this.cols);
    this.score = 100;
    /* NO reiniciamos this.topScore: se conserva */
    this.discardCount = 0;
    this.gameOver = false;

    // Reinicia renderer
    renderScore(this.score, this.topScore);
    renderBoard(this.board, null);
    this._updateDiscardButtonLabel();

    // Generar nueva pieza
    this.currentPiece = null;
    this.nextPiece = this._randomPiece();
    this._spawnPiece();

    // Reactivar loop
    _resumeLoop(this);
  }

  /* ─── Helpers para puntuación ─── */
  _updateTopScore() {
    if (this.score > this.topScore) {
      this.topScore = this.score;
      renderScore(this.score, this.topScore);
    }
  }

  _updateDiscardButtonLabel() {
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn) {
      const penalty = this.rules.getDiscardPenalty(this.discardCount);
      discardBtn.textContent = `Discard (-${penalty} pts)`;
    }
  }

  /* Permite detener completamente la partida desde fuera */
  terminate() {
    this.gameOver = true;
    if (this.loop) {
      clearInterval(this.loop);
      this.loop = null;
    }
  }
}

// Aplica las diferencias entre snapshot y board, restaurando celdas que cambiaron a bomba
// pero mantiene otros cambios previos.
function _rollbackToSnapshot(current, snapshot) {
  for (let y = 0; y < current.length; y++) {
    for (let x = 0; x < current[0].length; x++) {
      const cur = current[y][x];
      const snap = snapshot[y][x];
      // Si la versión actual es bomba fija pero en snapshot no lo era,
      // restauramos a snapshot.
      if (cur.fixed && cur.value === 'B' && !(snap.fixed && snap.value === 'B')) {
        current[y][x].value = snap.value;
        current[y][x].fixed = snap.fixed;
        current[y][x].possibleValues = new Set(snap.possibleValues);
      }
      // Si la celda era la que colocó el jugador, eliminamos su valor.
      if (cur.justPlaced) {
        current[y][x] = { ...snap };
      }
    }
  }
} 