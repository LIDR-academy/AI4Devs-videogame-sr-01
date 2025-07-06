# 🧪 Tests de Serpientes y Escaleras

Esta carpeta contiene todos los archivos de prueba y testing del juego Serpientes y Escaleras.

## 📁 Estructura de Archivos

### Archivos principales de test:

- `test-page.html` - **Página principal de tests** con tests automatizados
- `test-classes.js` - Clases mínimas para testing (Board, Player)
- `tests.js` - Suite completa de tests automatizados

### Páginas de prueba específicas:

- `test-movement.html` - Pruebas del movimiento de fichas
- `test-board-numbering.html` - Verificación de numeración del tablero
- `test-snakes-ladders.html` - Pruebas de serpientes y escaleras
- `test-navigation.html` - Pruebas de navegación entre pantallas

## 🚀 Cómo ejecutar los tests

### Tests automatizados completos:

1. Abrir `test-page.html` en el navegador
2. Los tests se ejecutan automáticamente al cargar
3. Ver resultados en la consola del navegador

### Tests específicos:

1. Abrir cualquier archivo `test-*.html` específico
2. Seguir las instrucciones en pantalla
3. Ver resultados visuales y en consola

## 📊 Cobertura de Tests

### Tests automatizados (test-page.html):

- ✅ Creación de jugadores
- ✅ Posición inicial de jugadores
- ✅ Numeración del tablero (patrón zigzag)
- ✅ Generación de serpientes y escaleras
- ✅ Movimiento básico de fichas
- ✅ Lógica de primer movimiento
- ✅ Límite de tablero (no pasar de 100)
- ✅ Funcionalidad de serpientes
- ✅ Funcionalidad de escaleras

### Tests visuales específicos:

- **Movement**: Verificación visual del movimiento correcto
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
