/**
 * dataLayer.js
 * Abstracción de acceso a datos: preguntas (fetch JSON) y ranking (LocalStorage).
 * TODO: Implementar funciones reales.
 */

import { normalize } from "./utils.js";

let QUESTIONS_CACHE = null;

/** Devuelve las preguntas (cacheadas) */
export async function getQuestions(){
  if(QUESTIONS_CACHE) return QUESTIONS_CACHE;
  QUESTIONS_CACHE = await loadQuestions();
  return QUESTIONS_CACHE;
}

/** Selecciona una pista aleatoria para la letra indicada */
export async function getRandomClue(letter){
  const questions = await getQuestions();
  const list = questions[letter];
  if(!list) throw new Error(`No hay preguntas para la letra ${letter}`);
  const random = list[Math.floor(Math.random()*list.length)];
  return { question: random.question, answer: normalize(random.answer) };
}

export async function loadQuestions(){
  const response = await fetch("data/questions.json");
  if(!response.ok) throw new Error("No se pudieron cargar las preguntas");
  const arr = await response.json();
  const map = {};
  arr.forEach(item=>{
    map[item.letter] = item.clues;
  });
  return map;
}

export function getRanking(){
  return JSON.parse(localStorage.getItem("pasapalabraRanking") || "[]");
}

export function updateRanking(entry){
  const ranking = getRanking();
  ranking.push(entry);
  ranking.sort((a,b)=>b.score - a.score);
  if(ranking.length > 10) ranking.length = 10;
  localStorage.setItem("pasapalabraRanking", JSON.stringify(ranking));
} 