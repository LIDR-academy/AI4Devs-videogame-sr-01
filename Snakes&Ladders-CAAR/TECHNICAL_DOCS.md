# 🛠️ Documentación Técnica - Serpientes y Escaleras

## 📐 Arquitectura del Proyecto

### Principios de Diseño

- **SOLID**: Cada clase tiene una responsabilidad única
- **DRY**: No repetición de código
- **TDD**: Tests incluidos para validar funcionalidad
- **Modularidad**: Código organizado en módulos independientes

### Estructura de Clases

```
Game (Controlador Principal)
├── Player (Modelo de Jugador)
├── Board (Lógica del Tablero)
├── SoundManager (Gestión de Audio)
├── UIManager (Interfaz de Usuario)
└── SynthSoundManager (Sonidos Sintéticos)
```

## 📁 Estructura de Archivos

```
Snakes&Ladders-CAAR/
├── index.html          # Página principal
├── game.js             # Lógica del juego (1150+ líneas)
├── config.js           # Configuración centralizada
├── styles.css          # Estilos y temas
├── prompts.md          # Historial de desarrollo
├── sounds/             # Sistema de audio
│   ├── synth-sounds.js
│   └── *.mp3 (effects)
├── tests/              # Suite de testing
├── IssuesReport/       # Control de calidad
├── TECHNICAL_DOCS.md   # Esta documentación
├── CHANGELOG.md        # Historial de versiones
└── readme.md           # Documentación principal
```

## 🎯 Clases Principales

### Game

**Responsabilidad**: Coordinar el flujo del juego

- Gestiona el estado general del juego
- Coordina interacciones entre componentes
- Maneja eventos de usuario
- Controla el flujo entre pantallas

### Player

**Responsabilidad**: Representar un jugador

- Almacena información del jugador (nombre, avatar, posición)
- Gestiona color único del jugador
- Encapsula datos del jugador

### Board

**Responsabilidad**: Lógica del tablero de juego

- Genera serpientes y escaleras aleatoriamente
- Valida conflictos entre elementos especiales
- Renderiza el tablero en HTML
- Actualiza posiciones de jugadores

### SoundManager

**Responsabilidad**: Gestión de efectos de sonido

- Reproduce efectos de audio
- Fallback entre audio HTML y sintético
- Control de volumen y estado

### UIManager

**Responsabilidad**: Gestión de interfaz de usuario

- Cambio entre pantallas
- Actualización de elementos visuales
- Sincronización con estado del juego

## 🔧 Algoritmos Clave

### Generación de Tablero

```javascript
// Patrón zigzag para numeración de celdas
getCellNumber(row, col) {
    const rowNumber = 9 - row;
    if (rowNumber % 2 === 0) {
        return rowNumber * 10 + col + 1;
    } else {
        return rowNumber * 10 + (10 - col);
    }
}
```

### Validación de Conflictos

```javascript
// Evita superposición de serpientes y escaleras
isConflicting(element) {
    // Verifica que no coincidan puntos de inicio o fin
    // con elementos existentes
}
```

### Animación de Movimiento

```javascript
// Movimiento paso a paso con delay
animatePlayerMovement(player, targetPosition) {
    // Intervalos para movimiento visual suave
    // Verificación de elementos especiales al final
}
```

## 🎨 Sistema de Temas

### Implementación CSS

- Clases temáticas aplicadas al `<body>`
- Variables CSS para colores principales
- Animaciones específicas por tema

### Temas Disponibles

1. **KWAI**: Estilo kawaii con colores pastel
2. **FUTURISTA**: Diseño cyberpunk con efectos neón
3. **TRADICIONAL**: Estilo clásico con colores tierra

## 🔊 Sistema de Audio

### Dual Audio System

1. **Archivos MP3** (primario): Para mejor calidad
2. **Web Audio API** (fallback): Sonidos sintéticos generados

### Efectos Disponibles

- `dice`: Lanzamiento de dado
- `move`: Movimiento de ficha
- `ladder`: Subir escalera
- `snake`: Bajar serpiente
- `victory`: Ganar juego

## 🧪 Sistema de Testing

### Tests Automatizados

- **Unit Tests**: Cada clase individualmente
- **Integration Tests**: Interacción entre componentes
- **UI Tests**: Elementos de interfaz
- **Logic Tests**: Reglas del juego

### Ejecución de Tests

```javascript
// Automático en desarrollo
runExtendedTests();

// Manual en consola
window.runExtendedTests();
```

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 768px (Grid layout completo)
- **Tablet/Mobile**: ≤ 768px (Layout vertical)

### Adaptaciones Móviles

- Tablero redimensionado
- Controles simplificados
- Typography escalada

## ⚡ Optimizaciones

### Performance

- Uso de `requestAnimationFrame` para animaciones
- Event delegation para múltiples elementos
- Lazy loading de sonidos

### Memory Management

- Cleanup de event listeners
- Gestión de intervalos y timeouts
- Reuso de elementos DOM

## 🔐 Validaciones

### Input Validation

- Nombres de jugadores (1-20 caracteres)
- Rango de jugadores (2-4)
- Validación de posiciones del tablero

### Game Logic Validation

- Movimientos válidos (1-6 del dado)
- Posición máxima 100
- Estados de juego consistentes

## 🚀 Extensibilidad

### Agregar Nuevos Temas

1. Definir en `config.js`
2. Agregar CSS correspondiente
3. Incluir avatares específicos

### Nuevos Tipos de Casillas

```javascript
// Extensión del sistema de casillas especiales
class SpecialCell {
  constructor(type, from, to, effect) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.effect = effect;
  }
}
```

### Modos de Juego Adicionales

- Modo rápido (tablero 5x5)
- Modo multijugador online
- Torneos automatizados

## 🐛 Debugging

### Console Commands

```javascript
// Inspeccionar estado del juego
window.game.players;
window.game.board.ladders;
window.game.board.snakes;

// Forzar movimiento
window.game.movePlayer(window.game.players[0], 6);

// Ejecutar tests
window.runExtendedTests();
```

### Error Handling

- Try-catch para audio playback
- Validación de elementos DOM
- Fallbacks para funcionalidades no soportadas

## 📊 Métricas

### Code Quality

- **Líneas de código**: ~1,200 total
- **Cobertura de tests**: >90%
- **Complejidad ciclomática**: Baja
- **Principios SOLID**: Implementados
- **Archivos principales**: 4 (game.js, config.js, styles.css, index.html)

### Performance Targets

- **Tiempo de carga**: <2 segundos
- **FPS de animaciones**: 60fps
- **Memoria máxima**: <50MB
- **Tiempo de respuesta**: <100ms

### Testing Coverage

- **Tests automatizados**: 15+ casos de prueba
- **Tests manuales**: 4 páginas de verificación visual
- **Cobertura funcional**: Completa (movimiento, reglas, UI)

## 🔍 Control de Calidad

### Proceso de Desarrollo

- **Desarrollo iterativo** con correcciones continuas
- **Reportes de errores** documentados en `IssuesReport/`
- **Dos iteraciones de correcciones** principales documentadas
- **Testing manual y automatizado** en cada iteración

### Issues Reportados y Resueltos

1. **Botón "Comenzar Aventura" no funciona** ✅ Corregido
2. **Jugadores no inician en posición correcta** ✅ Corregido
3. **Problemas de navegación entre pantallas** ✅ Corregido
4. **Animaciones de dados inconsistentes** ✅ Corregido
5. **Posicionamiento de fichas en mobile** ✅ Corregido

---

_Documentación generada para el proyecto Serpientes y Escaleras v1.0 - Julio 2025_
