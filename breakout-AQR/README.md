# 🎮 Breakout Escolar Futurista

Un clon moderno del clásico juego Breakout con temática escolar futurista, desarrollado con **Phaser 3** y **HTML5**.

## ✨ Características

- 🎯 **Gameplay clásico**: Controla una paleta para hacer rebotar la bola y destruir ladrillos
- 🎨 **Temática futurista**: Diseño escolar con estética sci-fi y colores vibrantes
- 🎵 **Audio inmersivo**: Efectos de sonido para cada acción del juego
- 📱 **Responsive**: Compatible con dispositivos móviles y de escritorio
- ⚡ **Power-ups**: Sistema de mejoras temporales (ampliar paleta, múltiples bolas, etc.)
- 🏆 **Sistema de puntuación**: Guarda récords localmente
- 🎮 **Controles múltiples**: Teclado, mouse y touch

## 🚀 Cómo jugar

1. **Inicio**: Presiona "JUGAR" en el menú principal
2. **Lanzamiento**: Presiona **ESPACIO** para lanzar la bola
3. **Control**: Usa las **flechas** o **mueve el mouse** para controlar la paleta
4. **Objetivo**: Destruye todos los ladrillos para completar el nivel
5. **Power-ups**: Recoge los power-ups que caen de algunos ladrillos
6. **Supervivencia**: Evita que la bola se caiga - tienes 3 vidas

## 🎮 Controles

| Acción | Teclado | Mouse/Touch |
|--------|---------|-------------|
| Mover paleta | ← → Flechas | Mover cursor/dedo |
| Lanzar bola | ESPACIO | - |
| Pausar | ENTER | - |

## 🎨 Power-ups

- **⭐ Enlarge**: Amplía la paleta temporalmente
- **🔫 Laser**: Activa modo disparo (en desarrollo)
- **🔍 Zoom**: Vista expandida de la pantalla
- **🌀 Multi**: Crea múltiples bolas

## 🛠️ Tecnologías

- **Phaser 3.70.0**: Motor de juego HTML5
- **HTML5/CSS3**: Estructura y estilos
- **JavaScript ES6+**: Lógica del juego
- **LocalStorage**: Persistencia de puntuaciones

## 📁 Estructura del Proyecto

```
breakout-AQRv2/
├── index.html              # Página principal
├── main.js                 # Configuración de Phaser
├── scenes/                 # Escenas del juego
│   ├── BootScene.js        # Carga de assets
│   ├── MenuScene.js        # Menú principal
│   ├── GameScene.js        # Juego principal
│   └── GameOverScene.js    # Pantalla de fin
├── utils/                  # Utilidades
│   └── helpers.js          # Funciones auxiliares
├── assets/                 # Recursos del juego
│   ├── images/             # Sprites y texturas
│   └── audio/              # Efectos de sonido
└── specs/                  # Documentación
    ├── game-specs.md       # Especificaciones generales
    ├── gameplay.md         # Mecánicas de juego
    ├── sprites.md          # Información de sprites
    └── controls.md         # Controles del juego
```

## 🚀 Instalación y Ejecución

### Opción 1: Servidor Local (Recomendado)

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 2: Live Server (VS Code)

1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 3: Abrir directamente

⚠️ **Nota**: Algunos navegadores pueden bloquear la carga de assets por políticas CORS.

## 🎨 Paleta de Colores

| Elemento | Color | Código |
|----------|-------|--------|
| Fondo | Violeta oscuro | `#2E2A4D` |
| Paleta | Rosa goma | `#F96167` |
| Bola | Amarillo pastel | `#FFD93D` |
| Ladrillos | Varios | `#547AA5`, `#BA68C8`, `#4DD0E1` |
| Texto | Blanco suave | `#F4F4F9` |

## 🔧 Desarrollo

### Principios SOLID Aplicados

- **S** (Single Responsibility): Cada escena tiene una responsabilidad específica
- **O** (Open/Closed): Fácil extensión sin modificar código existente
- **L** (Liskov Substitution): Power-ups intercambiables
- **I** (Interface Segregation): Interfaces simples y específicas
- **D** (Dependency Inversion): Dependencias inyectables

### Estructura Modular

- **Escenas**: Separación clara de responsabilidades
- **Utilidades**: Funciones reutilizables
- **Assets**: Organización por tipo
- **Configuración**: Centralizada en `main.js`

## 🎵 Audio

El juego incluye efectos de sonido para:
- Golpe de bola en paleta
- Destrucción de ladrillos
- Recolección de power-ups
- Game Over
- Completar nivel

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles (iOS/Android)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Phaser Team**: Por el increíble motor de juegos
- **Comunidad de desarrollo**: Por las herramientas y recursos
- **Artistas de sonido**: Por los efectos de audio

---

**¡Disfruta jugando Breakout Escolar Futurista!** 🚀 