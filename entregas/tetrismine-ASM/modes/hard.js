import EasyRuleSet from './easy.js';
import { validateAfterFix } from '../validation.js';

export default class HardRuleSet extends EasyRuleSet {
  /*
   * Hardcore mode: valida igual que Easy pero NO fija automáticamente bombas.
   * Para lograrlo clonamos el tablero antes de llamar a validateAfterFix.
   */

  isMoveValid(board, y, x) {
    // Deep-ish clone: copiamos celdas y sus sets para no mutar tablero real
    const clone = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        possibleValues: new Set(cell.possibleValues)
      }))
    );
    return validateAfterFix(clone, y, x);
  }

  /* Puntuaciones más exigentes */
  getReward() {
    return 150; // más puntos por acierto para compensar la dureza
  }

  getMistakePenalty() {
    return 100; // penalización doble
  }

  getDiscardPenalty(discardCount) {
    // Penalización cuadrática: 20, 40, 60…
    return (discardCount + 1) * 20;
  }
} 