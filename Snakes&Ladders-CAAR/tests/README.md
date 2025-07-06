# 🧪 Tests de Serpientes y Escaleras

Esta carpeta contiene los archivos de prueba y testing del juego Serpientes y Escaleras, consolidados en 2 archivos principales para mayor simplicidad y mantenimiento.

## 📁 Estructura de Archivos

### Archivos principales de test:

- `functional-tests.html` - **Tests Funcionales Automatizados**

  - Suite completa de tests automatizados
  - Verificación de lógica del juego
  - Tests de movimiento, tablero, jugadores y reglas

- `visual-tests.html` - **Tests Visuales Interactivos**
  - Verificación visual de componentes
  - Tests interactivos de movimiento
  - Validación de numeración y elementos gráficos

## 🚀 Cómo ejecutar los tests

### Tests Funcionales:

1. Abrir `functional-tests.html` en el navegador
2. Los tests se ejecutan automáticamente al cargar
3. Ver resultados en la interfaz y consola del navegador

### Tests Visuales:

1. Abrir `visual-tests.html` en el navegador
2. Verificar visualmente la numeración del tablero
3. Probar movimiento interactivo con el botón de dado
4. Verificar distribución de serpientes y escaleras
5. Probar navegación entre pantallas

## 📊 Cobertura de Tests

### Tests Funcionales Automatizados:

- ✅ **Tablero y Numeración:**

  - Patrón zigzag correcto
  - Numeración de celdas (1-100)
  - Posiciones específicas del tablero

- ✅ **Jugadores:**

  - Creación de jugadores
  - Posición inicial
  - Asignación de propiedades

- ✅ **Movimiento:**

  - Movimiento básico de fichas
  - Límite de tablero (no pasar de 100)
  - Movimiento exacto a posición 100

- ✅ **Serpientes y Escaleras:**

  - Funcionalidad de serpientes (bajar)
  - Funcionalidad de escaleras (subir)
  - Validación de posiciones especiales

- ✅ **Lógica del Juego:**
  - Validación de direcciones (serpientes bajan, escaleras suben)
  - No conflictos entre serpientes y escaleras
  - Reglas especiales (posiciones 1 y 100)

### Tests Visuales Interactivos:

- 👁️ **Numeración del Tablero:** Verificación visual del patrón zigzag
- 🐍 **Serpientes y Escaleras:** Distribución y colores correctos
- 🎲 **Movimiento:** Simulación interactiva de lanzamiento de dado
- 🧭 **Navegación:** Tests de enlaces y cambios de pantalla

## 🎯 Ventajas de la Consolidación

- **Simplicidad:** Solo 2 archivos en lugar de 8
- **Mantenimiento:** Más fácil de actualizar y mantener
- **Cobertura completa:** Todos los tests importantes incluidos
- **Separación clara:** Funcionales vs Visuales
- **Mejor organización:** Estructura más limpia y profesional
- **Board Numbering**: Verificación de numeración zigzag
- **Snakes & Ladders**: Consistencia visual vs lógica
- **Navigation**: Flujo entre pantallas

## 🔧 Desarrollo

### Agregar nuevos tests:

1. Editar `tests.js` para tests automatizados
2. Crear nuevo `test-nuevo.html` para tests visuales
3. Usar `test-classes.js` para testing aislado

### Debugging:

- Todos los tests incluyen logging detallado
- Usar herramientas de desarrollador del navegador
- Verificar consola para errores y resultados

## ⚠️ Importante

**NO cargar archivos de test en el juego principal (`index.html`)**

- Los tests deben ejecutarse solo desde esta carpeta
- Esto previene múltiples instancias del juego
- Mantiene separación entre producción y testing
