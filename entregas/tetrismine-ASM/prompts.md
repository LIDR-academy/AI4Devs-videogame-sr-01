# Prompt Maestro para IA o Desarrollador - Rol: Arquitecto de Software Especialista en Juegos Web

## Rol:
Actúa como un Arquitecto de Software experto en videojuegos web, especializado en JavaScript, HTML5 y lógica de juegos basada en tablero. Aplica buenas prácticas de ingeniería de software: separación de responsabilidades, código mantenible, modularidad, testabilidad, y una arquitectura orientada a la robustez y la claridad.

---

## Estrategia y objetivos

- Analiza en profundidad los requisitos funcionales y de validación del juego.
- Proporciona una estructura de proyecto clara, separando la lógica de juego, renderizado, validación y gestión de usuario.
- Implementa buenas prácticas de desarrollo web (nombrado claro, modularidad, comentarios útiles, evitar duplicidades, uso responsable de eventos y timers).
- Recomienda tests automáticos y validaciones visuales/manuales.
- Prioriza la experiencia de usuario, el rendimiento y la claridad del código.

---

## Especificación del juego: “TetrisMine”

- El juego es una fusión entre Tetris y Buscaminas.
- Tablero: 20 filas x 10 columnas.
- Solo caen piezas de 1x1 celda: pueden ser bomba (“B”) o un número (1-8).
- Ficha aparece en la parte superior central, cae automáticamente.
- Jugador puede mover la ficha con flechas (izq/der) o acelerar caída (abajo).
- Al tocar suelo o una ficha fijada, se fija y aparece una nueva.
- Panel lateral: próxima ficha, puntuación, botón para descartar ficha.
- Estilo: pixel-art, arcade Tetris, con validación tipo Buscaminas en cada movimiento.
- Arquitectura sugerida: archivos/lógica separados para motor de juego, validación, renderizado y gestión de eventos.

---

## Lógica y validación (reglas Buscaminas extendidas)

- Fichas bomba (“B”): sin restricciones de colocación.
- Fichas numéricas (1-8): cada una representa cuántas bombas deben rodearla (en sus 8 adyacentes).
- Al fijar una ficha numérica:
    - Contar bombas ya presentes en celdas adyacentes.
    - Contar huecos vacíos adyacentes.
    - Validar: bombas presentes + huecos libres >= valor de la ficha.
    - Si bombas presentes > valor de la ficha, jugada inválida.
    - Validación cruzada: ninguna ficha vecina puede quedar en estado imposible tras la jugada.
    - En caso de conflicto con huecos compartidos entre varias fichas, repartir las bombas potenciales sin sobrepasar el máximo posible.
    - Si la validación falla, el jugador debe descartar la ficha (con penalización) o el juego termina.

---

## Pseudocódigo para validación:
Para cada ficha numérica recién colocada:
bombas_actuales = número de bombas en celdas adyacentes
huecos_libres = número de celdas vacías adyacentes
máximo_bombas_posibles = bombas_actuales + huecos_libres

SI máximo_bombas_posibles < valor de la ficha:
    -> Movimiento inválido (imposible cumplir la condición)
SI bombas_actuales > valor de la ficha:
    -> Movimiento inválido (ya se han puesto demasiadas bombas)
SI al repartir bombas en huecos compartidos con otras fichas vecinas
   no se pueden satisfacer todas las fichas a la vez:
    -> Movimiento inválido


---

## Buenas prácticas recomendadas

- Usa módulos o archivos distintos para: lógica de tablero, renderizado, validación y eventos.
- Nombra las funciones y variables de manera descriptiva y consistente.
- Añade comentarios solo donde aporten valor real.
- Implementa tests unitarios para la función de validación de fichas numéricas.
- Proporciona una interfaz de usuario clara y responsiva.
- Evita duplicación de lógica (DRY).
- Maneja correctamente el ciclo de vida del juego y los eventos para evitar bugs y fugas de memoria.
- Prepara el código para ser fácilmente ampliable (modos de juego, tamaños de tablero, skins).

---

## Estrategia de entrega

- Incluye README o prompts.md explicando los prompts usados, la lógica implementada y las decisiones clave.
- Deja el código preparado para revisión por parte de terceros o por una IA, facilitando la comprensión y validación.
- Documenta cualquier desviación respecto a los requisitos iniciales.

---

**Por favor, responde con la estructura de archivos recomendada y el esqueleto de cada archivo clave (en código y comentarios) antes de proceder al desarrollo completo. Si tienes dudas sobre las reglas o validación, pregunta antes de avanzar.**
