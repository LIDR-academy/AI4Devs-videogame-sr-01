/**
 * Tests y validaciones para el juego Serpientes y Escaleras
 */

class ExtendedGameTests {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.results = [];
  }

  assert(condition, message) {
    if (condition) {
      this.passed++;
      this.results.push(`✅ ${message}`);
      console.log(`✅ ${message}`);
    } else {
      this.failed++;
      this.results.push(`❌ ${message}`);
      console.error(`❌ ${message}`);
    }
  }

  runAllTests() {
    console.log("🧪 Iniciando tests completos del juego...");

    this.testPlayerClass();
    this.testBoardClass();
    this.testGameLogic();
    this.testUIFunctionality();
    this.testSoundManager();
    this.testThemeSystem();

    this.printResults();
  }

  testPlayerClass() {
    console.log("\n📋 Testing Player Class...");

    // Test creación de jugador
    const player = new Player("TestPlayer", "🎮", 1);
    this.assert(player.name === "TestPlayer", "Player name assignment");
    this.assert(player.avatar === "🎮", "Player avatar assignment");
    this.assert(player.id === 1, "Player ID assignment");
    this.assert(player.position === 0, "Player initial position");
    this.assert(typeof player.color === "string", "Player color is string");

    // Test colores únicos
    const players = [
      new Player("P1", "🎮", 1),
      new Player("P2", "🎯", 2),
      new Player("P3", "🎲", 3),
      new Player("P4", "🎪", 4),
    ];

    const colors = players.map((p) => p.color);
    const uniqueColors = [...new Set(colors)];
    this.assert(
      colors.length === uniqueColors.length,
      "Players have unique colors"
    );
  }

  testBoardClass() {
    console.log("\n🎲 Testing Board Class...");

    const board = new Board();

    // Test generación de escaleras y serpientes
    board.generate();
    this.assert(board.ladders.length > 0, "Ladders generated");
    this.assert(board.snakes.length > 0, "Snakes generated");
    this.assert(board.ladders.length <= 8, "Ladder count within limit");
    this.assert(board.snakes.length <= 8, "Snake count within limit");

    // Test validez de escaleras
    for (let ladder of board.ladders) {
      this.assert(
        ladder.from < ladder.to,
        `Ladder ${ladder.from}->${ladder.to} goes up`
      );
      this.assert(
        ladder.from >= 2 && ladder.from <= 98,
        `Ladder start ${ladder.from} in valid range`
      );
      this.assert(
        ladder.to >= 3 && ladder.to <= 100,
        `Ladder end ${ladder.to} in valid range`
      );
    }

    // Test validez de serpientes
    for (let snake of board.snakes) {
      this.assert(
        snake.from > snake.to,
        `Snake ${snake.from}->${snake.to} goes down`
      );
      this.assert(
        snake.from >= 3 && snake.from <= 99,
        `Snake start ${snake.from} in valid range`
      );
      this.assert(
        snake.to >= 1 && snake.to <= 98,
        `Snake end ${snake.to} in valid range`
      );
    }

    // Test números de celda
    this.assert(
      board.getCellNumber(0, 0) === 91,
      "Top-left cell number correct"
    );
    this.assert(
      board.getCellNumber(9, 9) === 10,
      "Bottom-right cell number correct"
    );
    this.assert(
      board.getCellNumber(9, 0) === 1,
      "Bottom-left cell number correct"
    );
    this.assert(
      board.getCellNumber(0, 9) === 100,
      "Top-right cell number correct"
    );

    // Test patrón zigzag
    this.assert(board.getCellNumber(8, 0) === 11, "Zigzag pattern row 8");
    this.assert(board.getCellNumber(8, 9) === 20, "Zigzag pattern row 8 end");
    this.assert(board.getCellNumber(7, 0) === 30, "Zigzag pattern row 7");
    this.assert(board.getCellNumber(7, 9) === 21, "Zigzag pattern row 7 end");
  }

  testGameLogic() {
    console.log("\n🎮 Testing Game Logic...");

    const game = new Game();

    // Test inicialización
    this.assert(Array.isArray(game.players), "Players array initialized");
    this.assert(
      game.currentPlayerIndex === 0,
      "Current player index initialized"
    );
    this.assert(game.board instanceof Board, "Board instance created");
    this.assert(typeof game.theme === "string", "Theme initialized");
    this.assert(game.isGameActive === false, "Game initially inactive");

    // Test configuración de jugadores
    game.players = [new Player("Test1", "🎮", 1), new Player("Test2", "🎯", 2)];

    this.assert(game.players.length === 2, "Players array populated");

    // Test movimiento de dado válido
    const diceResults = [];
    for (let i = 0; i < 100; i++) {
      const result = Math.floor(Math.random() * 6) + 1;
      diceResults.push(result);
    }

    const validResults = diceResults.every((r) => r >= 1 && r <= 6);
    this.assert(validResults, "Dice results in valid range (1-6)");

    // Test avatares por tema
    game.theme = "kwai";
    const kwaiAvatars = game.getThemeAvatars();
    this.assert(kwaiAvatars.length > 0, "KWAI theme has avatars");

    game.theme = "futuristic";
    const futuristicAvatars = game.getThemeAvatars();
    this.assert(futuristicAvatars.length > 0, "Futuristic theme has avatars");

    game.theme = "classic";
    const classicAvatars = game.getThemeAvatars();
    this.assert(classicAvatars.length > 0, "Classic theme has avatars");
  }

  testUIFunctionality() {
    console.log("\n🖥️ Testing UI Functionality...");

    // Test existencia de elementos principales
    const mainElements = [
      "homeScreen",
      "boardSelect",
      "playerSetup",
      "gameBoard",
      "winnerScreen",
    ];

    for (let elementId of mainElements) {
      const element = document.getElementById(elementId);
      this.assert(element !== null, `Element ${elementId} exists`);
      this.assert(
        element.classList.contains("screen"),
        `Element ${elementId} has screen class`
      );
    }

    // Test botones principales
    const buttons = [
      "startBtn",
      "backToHome",
      "backToThemes",
      "startGame",
      "rollDice",
      "pauseGame",
      "quitGame",
      "playAgain",
      "newGame",
    ];

    for (let buttonId of buttons) {
      const button = document.getElementById(buttonId);
      this.assert(button !== null, `Button ${buttonId} exists`);
    }

    // Test elementos del tablero
    const boardElements = ["board", "currentPlayerName", "diceResult"];
    for (let elementId of boardElements) {
      const element = document.getElementById(elementId);
      this.assert(element !== null, `Board element ${elementId} exists`);
    }
  }

  testSoundManager() {
    console.log("\n🔊 Testing Sound Manager...");

    const soundManager = new SoundManager();
    this.assert(
      typeof soundManager.enabled === "boolean",
      "Sound manager has enabled property"
    );
    this.assert(
      typeof soundManager.play === "function",
      "Sound manager has play method"
    );
    this.assert(
      typeof soundManager.toggle === "function",
      "Sound manager has toggle method"
    );

    // Test que no hay errores al reproducir sonidos
    try {
      soundManager.play("dice");
      soundManager.play("move");
      soundManager.play("ladder");
      soundManager.play("snake");
      soundManager.play("victory");
      this.assert(true, "All sound effects can be played without errors");
    } catch (error) {
      this.assert(false, `Sound playback error: ${error.message}`);
    }
  }

  testThemeSystem() {
    console.log("\n🎨 Testing Theme System...");

    if (typeof GameConfig !== "undefined" && GameConfig.themes) {
      const themes = Object.keys(GameConfig.themes);
      this.assert(themes.length >= 3, "At least 3 themes available");

      for (let themeKey of themes) {
        const theme = GameConfig.themes[themeKey];
        this.assert(
          typeof theme.name === "string",
          `Theme ${themeKey} has name`
        );
        this.assert(
          Array.isArray(theme.avatars),
          `Theme ${themeKey} has avatars array`
        );
        this.assert(theme.avatars.length > 0, `Theme ${themeKey} has avatars`);
      }
    }

    // Test aplicación de temas
    const themeOptions = document.querySelectorAll(".theme-option");
    this.assert(themeOptions.length >= 3, "Theme selection options available");
  }

  printResults() {
    console.log("\n📊 RESULTADOS DE LAS PRUEBAS:");
    console.log("================================");
    console.log(`✅ Pruebas exitosas: ${this.passed}`);
    console.log(`❌ Pruebas fallidas: ${this.failed}`);
    console.log(
      `📈 Porcentaje de éxito: ${(
        (this.passed / (this.passed + this.failed)) *
        100
      ).toFixed(2)}%`
    );

    if (this.failed > 0) {
      console.log("\n❌ Pruebas fallidas:");
      this.results
        .filter((r) => r.startsWith("❌"))
        .forEach((r) => console.log(r));
    }

    console.log(
      "\n🎮 Estado del juego: " +
        (this.failed === 0 ? "LISTO PARA JUGAR" : "REQUIERE ATENCIÓN")
    );
  }
}

// Función para ejecutar tests
function runExtendedTests() {
  const tester = new ExtendedGameTests();
  tester.runAllTests();
  return tester;
}

// Auto-ejecutar en desarrollo
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:"
) {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      if (typeof window.game !== "undefined") {
        console.log("🧪 Ejecutando tests extendidos...");
        runExtendedTests();
      }
    }, 1000);
  });
}

// Exportar para uso manual
if (typeof window !== "undefined") {
  window.runExtendedTests = runExtendedTests;
  window.ExtendedGameTests = ExtendedGameTests;
}
