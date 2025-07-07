# 🎮 Controles del Jugador

## 🎯 Movimientos Básicos (+entrada por teclado y puntero)

| Acción                  | Tecla principal      | Alternativa |
| ----------------------- | -------------------- | ----------- |
| Mover a la izquierda    | ← Flecha Izquierda   | A           |
| Mover a la derecha      | → Flecha Derecha     | D           |
| Mover con mouse/touch   | pointermove (Phaser) |             |
| Disparo (si aplica)     | Espacio              |             |
| Pausar / Reanudar juego | Enter                | P           |

## 🧠 Consideraciones UX

* Las teclas deben estar escuchadas con `Phaser.Input.Keyboard`.
* Permitir control por puntero/touch agregando eventos `pointermove`, para que la paleta siga el dedo o mouse horizontalmente.
* Mostrar visualmente en pantalla si un power-up cambia la funcionalidad (ej. activar botón disparo).
* Posibilidad futura de agregar input por mouse o touch (para móviles).

## 🛠 Buenas prácticas

* Asociar controles dentro de la escena principal (GameScene) y pasar referencias necesarias.
* Separar archivo de configuración de teclas (`controls.js`) si crece.
* Incluir íconos en pantalla que representen los controles (accesibilidad y feedback visual).

## 🧪 Futuro (opcional)

* Compatibilidad con gamepad.
* Sistema de configuración de teclas personalizado.
