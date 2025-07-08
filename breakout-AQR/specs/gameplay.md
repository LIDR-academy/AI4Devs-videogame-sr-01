# 🎮 Gameplay: Breakout Escolar Futurista

## 🎯 Mecánica Principal

* El jugador controla una **paleta escolar** para hacer rebotar una **pelota**.
* El objetivo es destruir todos los **ladrillos** en pantalla.
* Algunos ladrillos pueden contener **power-ups** que mejoran o modifican la paleta.

## 🧱 Niveles

* Los niveles se generan aleatoriamente tras completar uno.
* Varían en cantidad de ladrillos, color, disposición y dificultad.
* A medida que avanzas, la velocidad de la bola puede aumentar.

## 💣 Condiciones de juego

* **Victoria**: cuando se destruyen todos los ladrillos del nivel.
* **Derrota**: cuando se pierden todas las vidas.
* El jugador comienza con 3 vidas (configurable).

## 🔄 Progresión dinámica

* Cuando un nivel termina, se genera uno nuevo sin recargar la página.
* Nuevos ladrillos, velocidad diferente, y aparición de enemigos opcionales.

## 🧠 IA/Interacciones Futuras

* Power-ups que alteran la física.
* Enemigos móviles (robots escolares) que interactúan con la paleta o bola.

## 🧩 Power-ups previstos

* ⭐ Ampliar paleta
* 🔫 Activar disparos desde la paleta
* 🔍 Zoom out para mayor visión
* 🌀 Bola múltiple (duplicar bolas)

## 💡 Detalles UX/UI

* Mostrar HUD con puntaje, vidas, nivel actual
* Sonidos escolares: campanas, clics de plumón, efectos "tech"
* Efectos visuales brillantes o fosforescentes
* Modo oscuro activado por default

## 🕹 Controles por defecto

* Flechas izquierda/derecha (o A/D) para mover la paleta
* Espacio: activar disparo (si power-up disponible)
* Enter: pausar/reanudar
* **Mouse o touch:** la paleta puede seguir el movimiento horizontal del puntero o dedo mediante eventos `pointermove`. Esto permite control más natural en dispositivos móviles y pantallas táctiles.
* Flechas izquierda/derecha (o A/D) para mover la paleta
* Espacio: activar disparo (si power-up disponible)
* Enter: pausar/reanudar
