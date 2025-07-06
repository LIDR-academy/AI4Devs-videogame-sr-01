/**
 * Configuración del juego Serpientes y Escaleras
 */

const GameConfig = {
  // Configuración del tablero
  board: {
    size: 10,
    ladderCount: 8,
    snakeCount: 8,
    minLadderLength: 10,
    maxLadderLength: 30,
    minSnakeLength: 10,
    maxSnakeLength: 40,
  },

  // Configuración de jugadores
  players: {
    min: 2,
    max: 4,
    defaultCount: 3,
    maxNameLength: 20,
  },

  // Configuración de animaciones
  animations: {
    moveDelay: 200, // ms entre movimientos
    diceRollDuration: 1000, // duración de la animación del dado
    fadeInDuration: 500, // duración de fade in de pantallas
    specialCellDelay: 500, // delay antes de activar serpiente/escalera
  },

  // Configuración de sonidos
  audio: {
    enabled: true,
    volume: 0.3,
    useSyntheticSounds: true,
  },

  // Temas disponibles
  themes: {
    kwai: {
      name: "🌸 KWAI",
      description: "Estilo pastel y kawaii",
      avatars: ["🦄", "🌈", "⭐", "🎀", "🌸", "🎪", "🎁", "🍭"],
      primaryColor: "#ff6b9d",
      secondaryColor: "#ffecd2",
      backgroundColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    futuristic: {
      name: "🚀 FUTURISTA",
      description: "Neón y alta tecnología",
      avatars: ["🤖", "👾", "🛸", "⚡", "🔮", "💎", "🚀", "⭐"],
      primaryColor: "#00f5ff",
      secondaryColor: "#1a1a2e",
      backgroundColor: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)",
    },
    classic: {
      name: "🏛️ TRADICIONAL",
      description: "Estilo clásico de madera",
      avatars: ["♠️", "♥️", "♦️", "♣️", "👑", "🎭", "🎯", "🏆"],
      primaryColor: "#654321",
      secondaryColor: "#d2b48c",
      backgroundColor: "linear-gradient(135deg, #d2b48c 0%, #8b4513 100%)",
    },
  },

  // Mensajes del juego
  messages: {
    welcome: "¡Bienvenido a Serpientes y Escaleras!",
    selectTheme: "Elige tu estilo de juego",
    configPlayers: "Configura los jugadores",
    gameStart: "¡Que comience el juego!",
    yourTurn: "Es tu turno",
    rollDice: "Lanza el dado",
    ladder: "¡Subiste por una escalera!",
    snake: "¡Una serpiente te hizo bajar!",
    exactWin: "Necesitas caer exacto en el 100 para ganar",
    victory: "¡Felicitaciones! ¡Has ganado!",
    confirmQuit: "¿Estás seguro de que quieres salir del juego?",
  },

  // Configuración de desarrollo
  debug: {
    enabled: false,
    showConsoleMessages: true,
    runTests: true,
    logPlayerMovements: true,
  },
};

// Exportar configuración
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameConfig;
} else if (typeof window !== "undefined") {
  window.GameConfig = GameConfig;
}
