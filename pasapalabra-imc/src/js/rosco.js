/**
 * rosco.js
 * Estado y lógica del rosco (letras, aciertos, fallos, pendientes).
 * TODO: Implementar transiciones y renderizado.
 */

import { ALPHABET } from "./config.js";
import { COLORS } from "./config.js";

/**
 * Dibuja el rosco SVG/canvas a partir del alfabeto configurado.
 */
export function drawRosco(stateMap = {}){
  const canvas = document.getElementById("rosco");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const wrapper = document.getElementById("rosco-wrapper");
  if(!wrapper) return;

  function render(){
    const size = wrapper.clientWidth;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const center = size / 2;
    const rFicha = size * 0.048;
    const gap    = size * 0.006;
    const rRosco = center - rFicha - gap;
    const step   = (2 * Math.PI) / ALPHABET.length;

    ctx.clearRect(0, 0, size, size);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${rFicha * 1.1}px Arial, sans-serif`;

    ALPHABET.forEach((letter, i) => {
      const angle = -Math.PI / 2 + i * step;
      const x = center + rRosco * Math.cos(angle);
      const y = center + rRosco * Math.sin(angle);

      const status = stateMap[letter] || 'neutral';
      ctx.fillStyle = COLORS[status] || COLORS.neutral;
      ctx.beginPath();
      ctx.arc(x, y, rFicha, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--blanco");
      ctx.fillText(letter, x, y);
    });
  }

  window.addEventListener("resize", render);
  render();
}

export const roscoState = {
  hits: 0,
  fails: 0,
  pending: []
}; 