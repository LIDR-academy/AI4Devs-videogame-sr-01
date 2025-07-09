/**
 * speech.js
 * Capa de abstracción sobre Web Speech API.
 * Opcional: se inicializa solo si el navegador la soporta.
 */

export function isSpeechSupported(){
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Inicia el reconocimiento por voz y devuelve la transcripción vía callback.
 * @param {(text:string)=>void} onResult
 * @param {(err:Error)=>void} [onError]
 */
export function startListening(onResult,onError){
  if(!isSpeechSupported()){
    onError?.(new Error("Speech API no soportada"));
    return null;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("result", evt=>{
    const transcript = evt.results[0][0].transcript;
    onResult(transcript);
  });
  recognition.addEventListener("error", e=>{
    onError?.(e.error);
  });
  recognition.start();
  return recognition;
} 