import { VERSION } from "./config.js";
// startTimer y drawRosco ya no son necesarios
import { showPlayerName } from "./ui.js";
import { GameController } from "./gameController.js";

/**
 * Punto de entrada principal del juego. Se encarga de orquestar la
 * inicialización de la aplicación y enlaza eventos globales.
 */

/** Configura eventos específicos de la portada */
function initIndexPage(){
  const startBtn   = document.getElementById("startBtn");
  const input      = document.getElementById("playerName");

  if(!startBtn || !input) return; // No estamos en index

  startBtn.addEventListener("click",()=>{
    const name=input.value.trim();
    if(!name){
      input.focus();
      return;
    }
    sessionStorage.setItem("playerName",name);
    window.location.href="./game.html";
  });
}

function initGamePage(){
  const roscoCanvas = document.getElementById("rosco");
  if(!roscoCanvas) return; // No estamos en game.html

  const playerName = sessionStorage.getItem("playerName") || "Jugador";
  document.title = `${playerName} • Rosco`;
  showPlayerName(playerName);

  const game = new GameController();
  game.init();
}

export function init(){
  console.info(`Pasapalabra · El Rosco v${VERSION} — aplicación iniciada`);
  initIndexPage();
  initGamePage();
}

document.addEventListener("DOMContentLoaded", init); 