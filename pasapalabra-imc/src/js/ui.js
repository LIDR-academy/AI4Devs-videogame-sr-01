/**
 * ui.js
 * Funciones de renderizado y manipulación del DOM.
 * TODO: Implementar según flujo de pantallas.
 */

export function showPlayerName(name){
  const el = document.getElementById("jugador");
  if(el) el.textContent = name;
} 