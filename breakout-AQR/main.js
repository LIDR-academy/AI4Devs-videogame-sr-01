/**
 * Breakout Escolar Futurista
 * Main Game Configuration
 */

// Configuración del juego

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2E2A4D',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    audio: {
        disableWebAudio: false
    },
    render: {
        pixelArt: false,
        antialias: true
    }
};

// Crear instancia del juego
const game = new Phaser.Game(config);

// Variables globales del juego
window.gameState = {
    score: 0,
    lives: 3,
    level: 1,
    highScore: localStorage.getItem('breakoutHighScore') || 0
};

// Hacer el juego disponible globalmente
window.game = game; 