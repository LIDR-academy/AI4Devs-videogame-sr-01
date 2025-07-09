/**
 * utils.js
 * Funciones auxiliares para el juego.
 */

/**
 * Normaliza una cadena: minúsculas, sin tildes ni diéresis, trim.
 * @param {string} str
 * @returns {string}
 */
export function normalize(str){
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();
}

/**
 * Calcula la puntuación final siguiendo la fórmula básica del prompt v2.
 * @param {number} hits
 * @param {number} fails
 * @param {number} timeLeft segundos restantes
 * @returns {number}
 */
export function calculateScore(hits,fails,timeLeft=0){
  // Cada acierto suma 3 puntos, cada fallo resta 1. El tiempo no influye.
  return hits * 3 - fails * 1;
} 