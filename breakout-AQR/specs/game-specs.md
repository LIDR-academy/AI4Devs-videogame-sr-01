# 📘 Especificación del Juego: Breakout Escolar Futurista

## ✨ Descripción General

Este proyecto es un clon de **Breakout/Arkanoid**, ambientado en un mundo **futurista escolar**. Está desarrollado 100% con **HTML5, CSS (Tailwind), y JavaScript usando Phaser 3**, siguiendo principios de ingeniería de software como **SOLID**, separación de responsabilidades y buenas prácticas.

Este juego está diseñado para ser completamente accesible desde **navegadores modernos**, incluyendo:

* 📱 Teléfonos móviles (iOS y Android)
* 💻 PCs de escritorio y laptops
* 📱 Tablets

La experiencia es **responsive y optimizada para pantallas táctiles** (arrastre de dedo) y también compatible con teclado y mouse, sin necesidad de instalar nada.

---

## 🎯 Objetivo del Jugador
- Controlar una **paleta** (estilizada como una goma escolar futurista).
- Hacer rebotar la **pelota** para destruir todos los **ladrillos** (representados como libros, libretas, etc).
- Usar **power-ups escolares** (como regla-láser, aumento de visión, etc).
- Evitar que la pelota se caiga.
- Superar niveles dinámicos e infinitos generados aleatoriamente.

---

## 🧪 Tecnología y Herramientas
- **Phaser 3** (motor principal de juego)
- **HTML5**
- **JavaScript (Vanilla)**
- **Tailwind CSS** para UI/estética
- Para desarrollo local: usar servidor local (Live Server, Python `http.server`) para evitar errores CORS
- Para publicación: usar plataformas que soporten proyectos estáticos, como GitHub Pages, Netlify o Itch.io

---

## 🎨 Estilo Visual

### Temática
- **Futurismo escolar**: mezcla de objetos escolares con estética sci-fi.
- **Flat Design**: minimalista, sin sombras realistas.
- Paleta de colores limpia y contrastante, estilo educación digital:

| Elemento   | Color Principal | Detalle Secundario |
|------------|------------------|---------------------|
| Fondo      | #2E2A4D (violeta oscuro) | #F4F4F9 (neutral) |
| Paleta     | #F96167 (rosa goma)      | #C4C4C4 (metálico claro) |
| Bola       | #FFD93D (amarillo pastel) | sombra #E2B000 |
| Ladrillo   | #547AA5, #BA68C8, #4DD0E1 (libros) | líneas blancas |
| PowerUps   | íconos con contraste: ⭐🔍📏🔫 |

### Tipografía
- **Titulares**: Orbitron (futurista)
- **Texto base**: Inter, Roboto o sans-serif simple

---

## 🔧 Arquitectura y Código

### Principios
- Aplicar principios **SOLID**:
  - *S*: Clases separadas para paddle, bola, brick, power-up
  - *O*: Extensión de niveles sin modificar el core
  - *L*: Sustituir lógicas de power-up sin romper compatibilidad
  - *I*: Interfaces simples (si usas TypeScript o comentarios claros)
  - *D*: Dependencias inyectables o desacopladas en funciones


### 🛠 Estructura de Carpetas Sugerida

```bash
project-root/
├── index.html
├── main.js
├── assets/
│   ├── images/
│   └── audio/
├── scenes/
│   ├── BootScene.js
│   ├── GameScene.js
│   └── UIScene.js
├── specs/
│   ├── game-specs.md
│   ├── gameplay.md
│   ├── sprites.md
│   └── controls.md
└── utils/
    └── helpers.js
```

---

## 🔗 Documentación

* Markdown plano (`specs/`)
* O herramientas externas:

  * Docusaurus (web)
  * Obsidian (local)
* Comentarios tipo JSDoc en archivos
