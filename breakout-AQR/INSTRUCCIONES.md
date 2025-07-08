# 🚀 Instrucciones para Ejecutar Breakout Escolar Futurista

## ✅ **Problema Solucionado**

El error `createEmitter removed` ha sido corregido. Las partículas han sido comentadas temporalmente para evitar problemas de compatibilidad con Phaser 3.70.0.

## 🎮 **Cómo Ejecutar el Juego**

### Opción 1: Servidor Node.js (Recomendado)

```bash
# Instalar dependencias (si tienes Node.js)
npm install

# Ejecutar el servidor
npm start
# o
node server.js
```

Luego abre `http://localhost:8000` en tu navegador.

### Opción 2: Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Opción 3: Live Server (VS Code)

1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🎯 **Funcionalidades Disponibles**

- ✅ **Carga de assets** con barra de progreso
- ✅ **Menú principal** con interfaz interactiva
- ✅ **Juego completo** con física de Breakout
- ✅ **Power-ups** (enlarge, zoom, multi)
- ✅ **Sistema de puntuación** con localStorage
- ✅ **Game Over** con estadísticas
- ✅ **Controles** de teclado y mouse/touch

## 🎮 **Controles**

| Acción | Teclado | Mouse/Touch |
|--------|---------|-------------|
| Mover paleta | ← → Flechas | Mover cursor/dedo |
| Lanzar bola | ESPACIO | - |
| Pausar | ENTER | - |

## 🔧 **Solución de Problemas**

### Si ves errores en la consola:

1. **Asegúrate de usar un servidor local** (no abrir el archivo directamente)
2. **Verifica que todos los archivos estén en su lugar**:
   - `assets/images/spritesheet.png`
   - `assets/images/spritesheet.json`
   - `assets/audio/*.mp3`

### Si el juego no carga:

1. **Abre las herramientas de desarrollador** (F12)
2. **Revisa la pestaña Console** para errores
3. **Verifica la pestaña Network** para ver si los assets se cargan

## 📱 **Compatibilidad**

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles (iOS/Android)

## 🎨 **Características del Juego**

- **Temática escolar futurista** con colores vibrantes
- **Física realista** de rebote de la bola
- **Power-ups dinámicos** que aparecen al destruir ladrillos
- **Sistema de niveles** que aumenta la dificultad
- **Puntuación persistente** guardada localmente

## 🚀 **Próximas Mejoras**

- [ ] Restaurar efectos de partículas
- [ ] Implementar modo láser completo
- [ ] Agregar más tipos de power-ups
- [ ] Efectos visuales mejorados
- [ ] Sonidos adicionales

---

**¡Disfruta jugando Breakout Escolar Futurista!** 🎮 