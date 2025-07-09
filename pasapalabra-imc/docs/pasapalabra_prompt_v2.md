# 🟢 Prompt Definitivo – Juego “Pasapalabra · El Rosco”
*(HTML + CSS + JavaScript + JSON – sin librerías externas)*  

> **Propósito del documento**  
> Este prompt fija **todos** los requisitos funcionales, técnicos y de diseño necesarios para que una IA de codificación (p. ej. Cursor) genere el juego sin ambigüedades.  
> Las secciones están redactadas en _imperativo_ y contienen nombres de variables, eventos y rutas definitivos.  

---

## 1 · Estructura de carpetas (obligatoria)

```text
pasapalabra/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          # Script maestro (type="module")
│   ├── dataLayer.js    # Carga JSON y gestiona ranking (localStorage)
│   ├── ui.js           # Renderiza y actualiza DOM
│   └── speech.js       # Web Speech API (opcional según soporte)
├── data/
│   └── questions.json
└── assets/             # Íconos o fuentes locales (opcional)
```

No se permite añadir otros archivos ni dependencias externas.

---

## 2 · Formatos de datos

### 2.1 Preguntas (`data/questions.json`)

```jsonc
[
  {
    "letter": "A",
    "clues": [
      { "question": "Empieza por A: Capital de Aragón.", "answer": "zaragoza" },
      { "question": "Empieza por A: En informática, copia de seguridad.", "answer": "backup" },
      { "question": "Contiene la A: Primer hombre según la Biblia.", "answer": "adan" }
    ]
  },
  …
]
```

* **Total letras**: 27 (A–Z, Ñ).  
* **Mínimo pistas**: `MIN_QUESTIONS_PER_LETTER = 3`.  
* Las respuestas irán en minúsculas, sin tildes ni caracteres especiales.  

### 2.2 Ranking (localStorage)

* **Clave**: `pasapalabraRanking`  
* **Formato** (array de máx. 10 objetos, ordenados descendentemente por `score`):

```jsonc
[
  {
    "player": "Nombre",
    "score": 65,
    "hits": 22,
    "fails": 5,
    "timeLeft": 14,          // segundos restantes
    "datetime": "2025-07-09T18:25:43.511Z"
  }
]
```

---

## 3 · Modelo de puntuación

```
score = hits * 3  -  fails * 1
```

* `hits`  (+3 pts) → letra acertada.  
* `fails` (–1 pt) → letra fallada.  
* Letras pasadas o pendientes no puntúan hasta resolverse.  
* Al finalizar la partida se calcula `score`; si el ranking tiene < 10 entradas o el nuevo `score` excede la décima puntuación, se inserta manteniendo el orden.

---

## 4 · Lógica de juego (detallada)

| Paso | Acción | Responsable (archivo / fn) |
|------|--------|----------------------------|
| 1 | **Inicio** → `app.init()` | `app.js` |
| 2 | Cargar `questions.json` (`dataLayer.loadQuestions`) | `dataLayer.js` |
| 3 | Solicitar nombre del jugador (prompt modal) | `ui.askPlayerName` |
| 4 | Barajar pistas (`shuffle`) manteniendo correspondencia letra⇄clue | `dataLayer.getRandomClue(letter)` |
| 5 | Inicializar **estado global**:<br>`currentLetter`, `pending[]`, `hits`, `fails`, `timeLeft = 120`, `statusMap` (A:neutral…) | `app.startGame()` |
| 6 | Iniciar cronómetro (`setInterval` 1 000 ms) | `app.startTimer()` |
| 7 | Bucle principal `app.askNext()`:<br>  a. Seleccionar `currentLetter` = primera de `pending`.<br>  b. Mostrar pista en panel. | |
| 8 | Eventos de usuario:<br>  • “Enviar” btn / Enter → `app.submitAnswer(text)`<br>  • “Pasar” btn        → `app.pass()`<br>  • Micrófono (`speech.js`) → rellena `<input>` y dispara “Enviar”. | |
| 9 | `submitAnswer` → comparar con `normalize(answer)`:<br>  • **Correcto** → verde, `hits++`.<br>  • **Incorrecto** → rojo, mostrar solución 2 s, `fails++`. | |
| 10 | `pass` → naranja y re‑encolar letra al final de `pending`. | |
| 11 | Avanzar:<br>  • Si `pending.length > 0` y `timeLeft > 0` → volver a paso 7.<br>  • Else → `app.endGame()`. | |
| 12 | `endGame`:<br>  a. Para cronómetro.<br>  b. Calcular `score`.<br>  c. `dataLayer.updateRanking()`.<br>  d. Mostrar **pantalla resumen** con:<br>       `hits`, `fails`, `score`, `timeLeft`, tabla “Top 10”.<br>  e. Botón “Jugar de nuevo” → vuelve a paso 5. | |

#### Reglas adicionales

* Letras falladas **no** vuelven a jugarse.  
* Letras pasadas permanecen pendientes hasta que todas estén resueltas o se agote el tiempo.  
* El cronómetro muestra el tiempo en formato `MM:SS`, con animación circular SVG (`stroke-dashoffset`).  
* Cuando `timeLeft ≤ 15 s`, el contador parpadea (`animation: blinker 1s step-start infinite`).  
* Vibración (`navigator.vibrate(80)`) al acertar y de 200 ms al fallar (solo móviles con API).  
* Si `hits === 27` antes de consumir el tiempo → lanzar `ui.showVictoryScreen()` (pantalla celebratoria).

---

## 5 · Interfaz de usuario (DOM definitivo)

### 5.1 Distribución

```
<header>  ➜  h1 título
<main id="game">
  <section id="rosco">           <!-- letras -->
    <button class="letter" data-letter="A">A</button>
    …
  </section>
  <section id="panel">
    <div id="timer"   role="timer" aria-live="polite">02:00</div>
    <div id="hits">Aciertos: 0</div>
    <div id="fails">Fallos: 0</div>
    <div id="inputArea">
      <input id="answerInput" type="text" autocomplete="off" />
      <button id="sendBtn">Enviar</button>
      <button id="passBtn">Pasar</button>
      <button id="micBtn" aria-label="Dictar respuesta" hidden>🎤</button>
    </div>
    <p id="clueText"></p>
  </section>
</main>
<dialog id="summaryModal"> … </dialog>
<template id="rankingRowTmpl">
  <tr><td class="pos"></td><td class="player"></td><td class="score"></td><td class="date"></td></tr>
</template>
```

### 5.2 Paleta y tipografía

* Fondo #0d1117, letras neutras #3498db, pendientes #e67e22, aciertos #2ecc71, fallos #e74c3c.  
* Texto principal en **Poppins** _400/600_.  
* Tamaño base 18 px; botones ≥ 48 px lado.  

### 5.3 Accesibilidad

| Elemento | Requisito |
|----------|-----------|
| Contraste | ≥ 4.5:1 texto/fondo |
| Navegación | Orden lógico `tabindex`; atajos ←/→ para pasar letras |
| Lectores de pantalla | `aria-live` para pistas y estado de letra |
| Foco | `outline: 2px dotted #fff` personalizado |

---

## 6 · Implementación (pautas obligatorias)

1. **ES Modules** en todos los scripts.  
2. Funciones y constantes documentadas con **JSDoc**.  
3. Utilizar **`const`** excepto cuando la variable sea reasignada.  
4. Prohibido `innerHTML` con cadenas sin sanitizar (usar `textContent`).  
5. En `speech.js`, detectar soporte:

```js
export function isSpeechSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}
```

6. Manejar errores:  
   * Faltan preguntas → `throw new Error("Question bank incompleto")`.  
   * `localStorage` lleno → limpiar el último registro antes de guardar.  

---

## 7 · Pruebas y QA (todas obligatorias)

- **Unidad**: `normalize()`, `updateRanking()`, `calculateScore()`.  
- **Integración**: bucle completo con `timeLeft = 5` s simulado.  
- **Responsive**: 320 px ancho mínimo, 1440 px máximo.  
- **Performance**: `Lighthouse Performance ≥ 90`.  
- **Accesibilidad**: `Lighthouse Accessibility ≥ 90`.  
- **Compatibilidad**: Chrome ≥ 110, Firefox ≥ 110, Safari iOS ≥ 15, Edge ≥ 110.  
- **Offline**: Abrir `index.html` desde disco sin servidor (CORS file://) funciona.  
- **Ranking**: Verificar inserción, orden y truncado a 10 entradas.  

---

## 8 · Entregables

1. Código fuente conforme a la estructura.  
2. `README.md` con instrucciones de ejecución local.  
3. Un `questions.json` de ejemplo con ≥ 3 pistas por letra.  

---

**Fin del documento.**  
