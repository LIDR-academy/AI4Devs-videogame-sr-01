import { validateAfterFix } from '../validation.js';

export default class EasyRuleSet {
  /*
   * Placeholder ruleset that keeps current behaviour. The real validation
   * and scoring logic will be migrated poco a poco desde Game.
   */
  validate(/* board, piece */) {
    /* Por defecto todo movimiento es válido y no hay penalización */
    return { valid: true, penalty: 0 };
  }

  onPieceFixed(/* board, piece, gameState */) {
    /* Aquí se añadirían +100 pts, top-score, etc.  Por ahora lo gestiona Game. */
  }

  /* Devuelve true si la pieza en (y,x) cumple las reglas del modo fácil */
  isMoveValid(board, y, x) {
    return validateAfterFix(board, y, x);
  }

  /* Puntuación que se otorga al colocar correctamente una pieza */
  getReward() {
    return 100;
  }

  /* Penalización por movimiento inválido (si el jugador tiene suficientes puntos) */
  getMistakePenalty() {
    return 50;
  }

  /* Penalización por descartar pieza; depende de cuántas veces haya descartado antes */
  getDiscardPenalty(discardCount) {
    return (discardCount + 1) * 5;
  }
} 