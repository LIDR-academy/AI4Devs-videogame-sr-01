/**
 * gameController.js
 * Maneja la lógica principal de la partida.
 */
import { ALPHABET, TIMER_START_SECONDS } from "./config.js";
import { start as startTimer } from "./timer.js";
import { drawRosco } from "./rosco.js";
import { getRandomClue } from "./dataLayer.js";
import { normalize, calculateScore } from "./utils.js";
import { startListening, isSpeechSupported } from "./speech.js";

export class GameController{
  constructor(){
    this.hits = 0;
    this.fails = 0;
    this.timeLeft = TIMER_START_SECONDS;
    this.currentIndex = 0;
    this.pending = [...ALPHABET];
    this.stateMap = {};
    this.clues = new Map(); // letra -> {question,answer}
  }

  async init(){
    await this.prepareClues();
    this.cacheElements();
    this.bindEvents();
    drawRosco(this.stateMap);
    this.showCurrentClue();
    this.stopTimer = startTimer(TIMER_START_SECONDS,(t)=>{
      this.timeLeft = t;
      this.updateClock();
      if(t<=0) this.endGame();
    });
  }

  async prepareClues(){
    for(const letter of ALPHABET){
      const clue = await getRandomClue(letter);
      this.clues.set(letter, clue);
      this.stateMap[letter] = 'neutral';
    }
  }

  cacheElements(){
    this.clockEl = document.getElementById("clock");
    this.hitsEl  = document.getElementById("hits");
    this.failsEl = document.getElementById("fails");
    this.questionEl = document.getElementById("pregunta");
    this.inputEl = document.getElementById("respuesta");
    this.btnSend = document.querySelector(".boton.enviar");
    this.btnPass = document.querySelector(".boton.pasar");
    this.btnVoice = document.querySelector(".boton.voz");
  }

  bindEvents(){
    this.btnSend.addEventListener("click",()=>this.onSubmit());
    this.btnPass.addEventListener("click",()=>this.onPass());
    this.inputEl.addEventListener("keyup",e=>{
      if(e.key==="Enter") this.onSubmit();
    });
    if(this.btnVoice){
      if(isSpeechSupported()){
        this.btnVoice.addEventListener("click",()=>{
          startListening(text=>{
            this.inputEl.value = text;
            this.onSubmit();
          });
        });
      }else{
        this.btnVoice.disabled = true;
        this.btnVoice.title = "Dictado no soportado en este navegador";
      }
    }
  }

  currentLetter(){
    return this.pending[this.currentIndex];
  }

  showCurrentClue(){
    const letter = this.currentLetter();
    const clue   = this.clues.get(letter);
    if(!clue) return;
    this.questionEl.innerHTML = `${clue.question}`;
    this.inputEl.value = "";
    this.inputEl.focus();
  }

  updateClock(){
    const m = String(Math.floor(this.timeLeft/60)).padStart(2,"0");
    const s = String(this.timeLeft%60).padStart(2,"0");
    this.clockEl.textContent = `${m}:${s}`;
  }

  onSubmit(){
    const userAnswer = normalize(this.inputEl.value);
    const letter = this.currentLetter();
    const { answer } = this.clues.get(letter);

    if(!userAnswer) return;

    let isCorrect = false;
    if(userAnswer === answer){
      this.hits++;
      this.stateMap[letter] = 'hit';
      isCorrect = true;
    }else{
      this.fails++;
      this.stateMap[letter] = 'fail';
    }

    // Actualizar stats UI
    this.hitsEl.textContent = `✔ Aciertos: ${this.hits}`;
    this.failsEl.textContent = `✖ Fallos: ${this.fails}`;

    // Eliminar letra actual de pendientes
    this.pending.splice(this.currentIndex,1);
    if(this.currentIndex >= this.pending.length) this.currentIndex = 0; // wrap

    drawRosco(this.stateMap);

    // Mostrar feedback
    if(isCorrect){
      this.questionEl.innerHTML = `<span style="color:var(--verde);font-weight:bold">¡Correcto!</span>`;
    }else{
      this.questionEl.innerHTML = `Incorrecto. Respuesta: <strong>${answer}</strong>`;
    }

    // Deshabilitar entrada temporalmente
    this.inputEl.disabled = true;
    this.btnSend.disabled = true;
    this.btnPass.disabled = true;
    if(this.btnVoice) this.btnVoice.disabled = true;

    // Decidir próxima acción tras 2 s
    setTimeout(()=>{
      // Rehabilitar entrada
      this.inputEl.disabled = false;
      this.btnSend.disabled = false;
      this.btnPass.disabled = false;
      if(this.btnVoice && isSpeechSupported()) this.btnVoice.disabled = false;

      // Comprobar fin de juego
      if(this.pending.length===0){
        this.endGame();
        return;
      }
      this.showCurrentClue();
    },2000);
  }

  onPass(){
    // Mover letra actual al final de la cola
    const letter = this.pending.splice(this.currentIndex,1)[0];
    this.pending.push(letter);
    if(this.currentIndex >= this.pending.length) this.currentIndex = 0;
    this.stateMap[letter] = 'pending';
    drawRosco(this.stateMap);
    this.showCurrentClue();
  }

  endGame(){
    this.stopTimer?.();
    const score = calculateScore(this.hits,this.fails,this.timeLeft);
    const params = new URLSearchParams({
      score:String(score),
      hits:String(this.hits),
      fails:String(this.fails),
      timeLeft:String(this.timeLeft)
    });
    window.location.href = `./results.html?${params.toString()}`;
  }
} 