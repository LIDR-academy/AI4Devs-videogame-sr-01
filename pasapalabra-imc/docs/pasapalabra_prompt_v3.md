# 🟢 Prompt Definitivo – Juego “Pasapalabra · El Rosco”
*(HTML5 + CSS + JavaScript ES Modules + JSON – sin dependencias externas)*  

> **Propósito de este documento**  
> Este prompt especifica **exhaustivamente** todos los requisitos funcionales, técnicos, de diseño, de mantenimiento y de entrega para que una IA de codificación (p. ej. Cursor) genere el videojuego **sin ambigüedades** ni “alucinaciones”.  
> Cada sección está redactada en _imperativo_ y precedida por un numeral (➊,➋…). Sigue el orden tal cual.  

---

## ➊ Filosofía general

* **Arquitectura *multi‑pantalla***: portada → juego → resultados.  
* **Fuente del juego** en `src/` _exclusivamente_. Rutas **relativas** (sin “/” inicial) para que el conjunto funcione igual si el directorio se despliega en la raíz de un dominio o en un subdirectorio.  
* **Prototipos** se conservan tal cual en `docs/` para referencia visual; **el banco de preguntas se copia** a `src/data/questions.json` para que todo el juego resida dentro de `src/`.  
* Toda la configuración editable (tiempo, alfabeto, colores…) vive en **constantes** centralizadas (`config.js`).  
* Se documenta cada decisión mediante un **changelog** (`logs/CHANGELOG.md`) y cada interacción con la IA queda en `prompts/aaaa‑mm‑ddThh‑mm‑ss_prompt.md`.  

---

## ➋ Estructura de carpetas (obligatoria)

```text
pasapalabra-imc/
├── src/                  # TODO: este subdirectorio contiene TODO el código ejecutable
│   ├── index.html        # Portada (pantalla 1)
│   ├── game.html         # Rosco & cronómetro (pantalla 2)
│   ├── results.html      # Top‑10 + resumen (pantalla 3)
│   ├── css/
│   │   └── styles.css
│   ├── data/
│   │   └── questions.json
│   ├── js/
│   │   ├── config.js         # Constantes de juego/modo mantenimiento
│   │   ├── app.js            # Orquestador – `type="module"`
│   │   ├── dataLayer.js      # Carga JSON, ranking (localStorage)
│   │   ├── ui.js             # Renderiza/actualiza DOM
│   │   ├── timer.js          # Lógica del cronómetro & animación SVG
│   │   ├── rosco.js          # Estado del rosco y sus transiciones
│   │   └── speech.js         # Web Speech API (opcional)
│   └── assets/               # Iconos, fuentes locales opcionales
├── docs/                 # **NO se toca** – material de referencia
│   ├── maqueta_portada.html
│   ├── maqueta_rosco.html
│   ├── maqueta_resultados.html
│   └── questions.json
├── prompts/
│   └── 2025‑07‑09T18‑00‑00_prompt.md   # Ejemplo (se autogenera)
├── logs/
│   └── CHANGELOG.md       # Historial en formato Markdown
└── README.md
```

**Prohibido** añadir archivos, carpetas o dependencias ajenas a las listadas, salvo dentro de `assets/` para recursos estáticos opcionales.

---

## ➌ Flujo de pantallas (UI absoluta)

1. **Portada (`index.html`)**  
   * Campo obligatorio “Nombre del jugador” (`<input required autofocus>`).  
   * Botón “Comenzar” (`id="startBtn"`).  
   * Al pulsar → se guarda el nombre en `sessionStorage.playerName` y se hace `location.href = "./game.html"`.

2. **Juego (`game.html`)**  
   * Se construye dinámicamente el rosco SVG (27 segmentos) según `ALPHABET` de `config.js`.  
   * Cronómetro _cuenta atrás_ (`TIMER_START_SECONDS`, default = 120).  
   * Al agotar tiempo o terminar palabras → redirigir a `results.html?score=…&hits=…&fails=…&timeLeft=…` con `URLSearchParams`.

3. **Resultados (`results.html`)**  
   * Lee `URLSearchParams`, calcula puntuación (`calculateScore()`).  
   * Actualiza ranking Local Storage (`dataLayer.updateRanking`).  
   * Renderiza tabla Top 10.  
   * Botón “Jugar de nuevo” → `index.html`.  

---

## ➍ Configuración editable (`config.js`)

```js
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
```

Cualquier cambio futuro (p. ej. quitar la Ñ) requiere **solo** editar este archivo, preservando el resto del sistema.

---

## ➎ Formato de datos

### ➎.1 Banco de preguntas (`src/data/questions.json`)

* Ruta fija: `data/questions.json` (desde los scripts en `src/js/` usar `fetch("../src/data/questions.json")`).  
* Estructura idéntica a la versión 2 del prompt (≥ 3 pistas por letra, respuestas en minúsculas y sin tildes).  
* La función `dataLayer.getRandomClue(letter)` selecciona al azar **una** pista por sesión.  

### ➎.2 Ranking Local Storage

* Clave: `pasapalabraRanking`  
* Máximo 10 entradas, ordenadas por `score` descendente.  
* Estructura de objeto idéntico a la versión 2.  

---

## ➏ Lógica de juego (detallada y enlazada a módulos)

| Paso | Acción | Módulo / Función | Comentarios |
|------|--------|-----------------|-------------|
| 1 | `DOMContentLoaded` → `app.init()` | `app.js` | Carga config + preguntas, detecta soporte Speech API |
| 2 | Mostrar nombre (`sessionStorage.playerName`) | `ui.showPlayerName()` | Portada y game |
| 3 | `app.startGame()` | `app.js` | Baraja rosco, reinicia estado global |
| 4 | `timer.start()` | `timer.js` | Callback 1 s → `app.onTick()` |
| 5 | `ui.renderClue(currentLetter)` | `ui.js` | Muestra pista y enfoca `<input>` |
| 6 | Eventos usuario (`submitAnswer`, `pass`, `speechToText`) | `rosco.js` | Cambia estado letra, vibra, actualiza rayado SVG |
| 7 | Control de fin (`rosco.pending.length === 0` || `timeLeft === 0`) | `app.js` | Llama a `app.endGame()` |
| 8 | `dataLayer.updateRanking()` | `dataLayer.js` | Inserta, ordena, recorta |
| 9 | Redirige a `results.html?params…` | `app.js` | Paso final |

*Reglas adicionales* (idénticas a la versión 2; se listan completas en el Anexo A).

---

## ➐ Pautas de implementación (calidad y seguridad)

1. **ES Modules** (`type="module"` en todas las etiquetas `<script>`).  
2. Solo **`const`** o **`let`**; prohibido `var`.  
3. Documentar funciones públicas con **JSDoc** y tipar parámetros (`@typedef`) cuando convenga.  
4. Evitar `innerHTML` excepto con sanitización explícita (`DOMPurify.sanitize`).  
5. Detectar APIs opcionales (Vibration, Speech) y degradar con _feature detection_ – nunca romper.  
6. Capturar y propagar errores (`try…catch`) hasta `app.handleError(err)` que muestra `alert()` modal.  
7. Semver interno (`config.version = "1.0.0"`); cada commit al changelog **incrementa** version.

---

## ➑ Pruebas y control de calidad (QA)

* **Unitarias** (`/tests/*.spec.js` opcional) para: `normalize()`, `calculateScore()`, `updateRanking()`.  
* **Integración**: bucle completo con `TIMER_START_SECONDS = 5` (modo debug) – debe finalizar sin excepciones.  
* **Responsivo**: 320‑1440 px.  
* **Accesibilidad**: WCAG AA (`eslint-plugin-jsx-a11y` + Lighthouse ≥ 90 Accessibility).  
* **Performance**: Lighthouse ≥ 90 Performance, sin layout shifts > 0.1 CLS.  
* **Compatibilidad**: Chromium ≥ 110, Firefox ≥ 110, Safari iOS ≥ 15, Edge ≥ 110.  
* **Offline**: Abrir `src/index.html` desde `file://` funciona.  
* **Ranking**: Añadir 11 entradas → se descarta la 11ª (más baja).  

---

## ➒ Mantenimiento y extensibilidad

* **Editar maqueta**: duplicar el prototipo correspondiente en `docs/`, aplicar cambios, luego copiar manualmente al HTML real en `src/`. La lógica JS **no** debe cambiar salvo que se añadan/eliminan IDs.  
* **Quitar letra del rosco**: eliminar del array `ALPHABET` y borrar sus pistas en `questions.json`. El rosco SVG se recalcula solo.  
* **Cambiar duración**: actualizar `TIMER_START_SECONDS` en `config.js`.  
* **Registro de cambios**: cada modificación va a `logs/CHANGELOG.md` en formato:  
  ```md
  ## [1.0.1] - 2025‑07‑10
  ### Fixed
  - Se corrigió bug de foco tras dictado.

  ```
* **Nuevos prompts/iteraciones**: guardar conversación ↗ `prompts/aaaa-mm-ddThh-mm-ss_prompt.md` junto con la respuesta obtenida, separados por `---`.  

---

## ➓ Entregables finales

1. **Repositorio** listo para “arrastrar y soltar” en cualquier hosting estático.  
2. `README.md` con:  
   * Presentación (qué es Pasapalabra · El Rosco).  
   * Estructura de carpetas.  
   * Instrucciones de ejecución local (doble‑click en `src/index.html`).  
   * Parámetros configurables y modo debug.  
3. `src/data/questions.json` con **≥ 3** pistas por letra (A–Z, Ñ).  
4. `logs/CHANGELOG.md` inicial (`## [1.0.0] - 2025‑07‑09`).  
5. Ejemplo de prompt almacenado en `prompts/`.  

---

## Anexo A · Reglas completas de juego y UI

*(Incluye colores, animaciones, accesibilidad, vibración, victory screen, etc. Copiar palabra por palabra la sección “Lógica de juego › Reglas adicionales” del prompt versión 2, pues sigue vigente.)*

---

### ¡Fin del prompt!  
_Ejecuta ahora en Cursor para generar el código. Guarda este prompt en `prompts/`._
