/**
 * results.js
 * Gestiona la pantalla de resultados: lecturas de parámetros, ranking y UI.
 */
import { calculateScore } from "./utils.js";
import { updateRanking, getRanking } from "./dataLayer.js";

export function initResults(){
  const params = new URLSearchParams(window.location.search);
  const hits = Number(params.get("hits") || 0);
  const fails = Number(params.get("fails") || 0);
  const timeLeft = Number(params.get("timeLeft") || 0);
  let score = Number(params.get("score"));
  if(Number.isNaN(score)) score = calculateScore(hits,fails,timeLeft);

  // Mostrar stats
  document.getElementById("aciertos").textContent = hits;
  document.getElementById("fallos").textContent   = fails;
  document.getElementById("puntos").textContent   = score;
  const m = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const s = String(timeLeft%60).padStart(2,"0");
  document.getElementById("tiempo").textContent   = `${m}:${s}`;

  const playerName = sessionStorage.getItem("playerName") || "Jugador";
  document.getElementById("jugador").textContent = playerName;

  // Actualizar ranking
  updateRanking({ name: playerName, score, hits, fails, timeLeft, date: Date.now() });

  renderRanking();

  // Botón jugar de nuevo
  const btn = document.getElementById("playAgainBtn");
  btn?.addEventListener("click",()=>{
    window.location.href = "./index.html";
  });
}

function renderRanking(){
  const tbody = document.getElementById("tabla-ranking");
  if(!tbody) return;
  tbody.innerHTML = "";
  const ranking = getRanking();
  ranking.forEach((entry,i)=>{
    const tr = document.createElement("tr");
    const fecha = new Date(entry.date).toLocaleDateString();
    tr.innerHTML = `<td>${i+1}</td><td>${entry.name}</td><td>${entry.score}</td><td>${fecha}</td>`;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", initResults); 