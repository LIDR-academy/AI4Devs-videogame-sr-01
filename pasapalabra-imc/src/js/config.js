/**
 * Configuración y constantes globales del juego Pasapalabra · El Rosco
 * @version 1.0.0
 */

/* eslint-disable import/prefer-default-export */

/** Número total de segundos del cronómetro */
export const TIMER_START_SECONDS = 120;

/** Alfabeto en orden de juego (se puede eliminar letra borrándola del array) */
export const ALPHABET = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];

/** Colores de estados del rosco */
export const COLORS = {
  neutral: "#3498db",
  pending: "#e67e22",
  hit:     "#2ecc71",
  fail:    "#e74c3c"
};

/** Versión semver interna */
export const VERSION = "1.0.0"; 