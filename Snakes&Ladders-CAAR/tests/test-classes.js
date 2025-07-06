/**
 * Clases para páginas de prueba
 * Solo contiene las clases Board y Player sin inicialización automática
 */

// Utilidades
function createUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// ===== CLASE BOARD (Solo para pruebas) =====
class Board {
  constructor() {
    this.boardId = createUniqueId();
    console.log(`📋 Creando tablero de prueba: ${this.boardId}`);

    this.snakes = [
      { from: 99, to: 78 },
      { from: 95, to: 75 },
      { from: 92, to: 88 },
      { from: 87, to: 24 },
      { from: 64, to: 60 },
      { from: 62, to: 19 },
      { from: 54, to: 34 },
      { from: 17, to: 7 },
    ];

    this.ladders = [
      { from: 1, to: 38 },
      { from: 4, to: 14 },
      { from: 9, to: 21 },
      { from: 16, to: 6 },
      { from: 21, to: 42 },
      { from: 28, to: 84 },
      { from: 36, to: 44 },
      { from: 51, to: 67 },
      { from: 71, to: 91 },
      { from: 80, to: 100 },
    ];

    console.log(`📋 [Tablero: ${this.boardId}] Serpientes:`, this.snakes);
    console.log(`📋 [Tablero: ${this.boardId}] Escaleras:`, this.ladders);
  }

  getNumberPosition(number) {
    const row = Math.floor((number - 1) / 10);
    const col = (number - 1) % 10;

    // En filas pares (0, 2, 4...) numeración normal (izq a der)
    // En filas impares (1, 3, 5...) numeración invertida (der a izq)
    const isEvenRow = row % 2 === 0;
    const finalCol = isEvenRow ? col : 9 - col;

    return {
      row: 9 - row, // Invertir porque el tablero visual va de arriba a abajo
      col: finalCol,
    };
  }

  checkForSnake(position) {
    const snake = this.snakes.find((s) => s.from === position);
    if (snake) {
      console.log(
        `🐍 [Tablero: ${this.boardId}] Serpiente encontrada en ${position} → ${snake.to}`
      );
      return snake.to;
    }
    return null;
  }

  checkForLadder(position) {
    const ladder = this.ladders.find((l) => l.from === position);
    if (ladder) {
      console.log(
        `🪜 [Tablero: ${this.boardId}] Escalera encontrada en ${position} → ${ladder.to}`
      );
      return ladder.to;
    }
    return null;
  }

  verifyVisualConsistency() {
    console.log(
      `🔍 [Tablero: ${this.boardId}] Verificando consistencia visual...`
    );

    let inconsistencies = 0;

    // Verificar serpientes
    this.snakes.forEach((snake) => {
      const startElement = document.querySelector(
        `[data-number="${snake.from}"]`
      );
      const endElement = document.querySelector(`[data-number="${snake.to}"]`);

      if (startElement && !startElement.classList.contains("snake-start")) {
        console.error(
          `❌ Serpiente ${snake.from}→${snake.to}: inicio no marcado visualmente`
        );
        inconsistencies++;
      }
      if (endElement && !endElement.classList.contains("snake-end")) {
        console.error(
          `❌ Serpiente ${snake.from}→${snake.to}: final no marcado visualmente`
        );
        inconsistencies++;
      }
    });

    // Verificar escaleras
    this.ladders.forEach((ladder) => {
      const startElement = document.querySelector(
        `[data-number="${ladder.from}"]`
      );
      const endElement = document.querySelector(`[data-number="${ladder.to}"]`);

      if (startElement && !startElement.classList.contains("ladder-start")) {
        console.error(
          `❌ Escalera ${ladder.from}→${ladder.to}: inicio no marcado visualmente`
        );
        inconsistencies++;
      }
      if (endElement && !endElement.classList.contains("ladder-end")) {
        console.error(
          `❌ Escalera ${ladder.from}→${ladder.to}: final no marcado visualmente`
        );
        inconsistencies++;
      }
    });

    if (inconsistencies === 0) {
      console.log(
        `✅ [Tablero: ${this.boardId}] Consistencia visual verificada: 100% correcto`
      );
    } else {
      console.error(
        `❌ [Tablero: ${this.boardId}] ${inconsistencies} inconsistencias encontradas`
      );
    }

    return inconsistencies === 0;
  }
}

// ===== CLASE PLAYER (Solo para pruebas) =====
class Player {
  constructor(name, color, id) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.position = 0; // Posición lógica (0 = fuera del tablero)
    this.visualPosition = 0; // Posición visual
  }
}

console.log("🧪 Clases de prueba cargadas (Board, Player)");
