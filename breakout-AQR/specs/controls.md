# 🎮 Controles del Jugador

## 🎯 Movimientos Básicos (+entrada por teclado y puntero)

### Desktop (Teclado y Mouse)

| Acción                  | Tecla principal      | Alternativa |
| ----------------------- | -------------------- | ----------- |
| Mover a la izquierda    | ← Flecha Izquierda   | A           |
| Mover a la derecha      | → Flecha Derecha     | D           |
| Lanzar la bola          | Espacio              | Clic        |
| Mover con mouse         | pointermove (Phaser) |             |
| Pausar / Reanudar juego | Enter                | P           |

### Móvil (Touch)

| Acción                  | Gestura              | Descripción |
| ----------------------- | -------------------- | ----------- |
| Lanzar la bola          | Toque en pantalla    | Cualquier toque inicia el juego |
| Mover el paddle         | Deslizar el dedo     | El paddle sigue el dedo horizontalmente |
| Control intuitivo       | Touch nativo         | Optimizado para pantallas táctiles |

## 🧠 Consideraciones UX

* Las teclas deben estar escuchadas con `Phaser.Input.Keyboard`.
* Control por puntero/touch implementado con eventos `pointermove` y `pointerdown`.
* Mostrar visualmente en pantalla si un power-up cambia la funcionalidad (ej. activar botón disparo).
* La paleta sigue el dedo o mouse horizontalmente de forma fluida.
* Controles adaptativos: detecta automáticamente si es dispositivo móvil.
* Feedback visual inmediato al tocar la pantalla.

## 🛠 Implementación Técnica

* Controles implementados en `GameScene.js` dentro de `setupControls()`.
* Eventos de touch: `pointerdown` para iniciar juego, `pointermove` para mover paddle.
* Compatibilidad completa entre desktop y móvil.
* No requiere configuración adicional del usuario.

### 🛠 Buenas prácticas

* Asociar controles dentro de la escena principal (GameScene) y pasar referencias necesarias.
* Separar archivo de configuración de teclas (`controls.js`) si crece.
* Incluir íconos en pantalla que representen los controles (accesibilidad y feedback visual).

## ✅ Funcionalidades Implementadas

- ✅ Control por teclado (flechas + espacio)
- ✅ Control por mouse (movimiento + clic)
- ✅ Control por touch (toque + deslizar)
- ✅ Detección automática de dispositivo
- ✅ Controles responsivos y adaptativos

## 🧪 TODO (futuro)

* Compatibilidad con gamepad.
* Sistema de configuración de teclas personalizado.
* Gestos avanzados para móvil (pinch, swipe).
