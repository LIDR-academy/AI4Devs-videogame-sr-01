/**
 * GameOverScene - Escena de fin de juego
 */
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fondo semi-transparente
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, width, height);

        // Título Game Over
        const gameOverText = this.add.text(width / 2, height / 3, 'GAME OVER', {
            fontSize: '48px',
            fontFamily: 'Arial',
            fill: '#F96167',
            stroke: '#2E2A4D',
            strokeThickness: 4
        });
        gameOverText.setOrigin(0.5);

        // Mostrar puntuación final
        const finalScore = window.gameState.score;
        const scoreText = this.add.text(width / 2, height / 2, `Puntuación Final: ${finalScore}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#F4F4F9'
        });
        scoreText.setOrigin(0.5);

        // Mostrar puntuación más alta
        const highScore = window.gameState.highScore;
        const highScoreText = this.add.text(width / 2, height / 2 + 40, `Puntuación más alta: ${highScore}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            fill: '#C4C4C4'
        });
        highScoreText.setOrigin(0.5);

        // Mensaje especial si se batió el récord
        if (finalScore >= highScore && finalScore > 0) {
            const newRecordText = this.add.text(width / 2, height / 2 + 80, '¡NUEVO RÉCORD!', {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#FFD93D',
                stroke: '#2E2A4D',
                strokeThickness: 2
            });
            newRecordText.setOrigin(0.5);
        }

        // Botón Jugar de nuevo
        const playAgainButton = this.add.text(width / 2, height - 150, 'JUGAR DE NUEVO', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#F4F4F9',
            backgroundColor: '#547AA5',
            padding: { x: 15, y: 8 }
        });
        playAgainButton.setOrigin(0.5);
        playAgainButton.setInteractive();

        // Efectos hover para el botón
        playAgainButton.on('pointerover', () => {
            playAgainButton.setStyle({ fill: '#FFD93D' });
        });

        playAgainButton.on('pointerout', () => {
            playAgainButton.setStyle({ fill: '#F4F4F9' });
        });

        playAgainButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Botón Volver al menú
        const menuButton = this.add.text(width / 2, height - 100, 'MENÚ PRINCIPAL', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fill: '#C4C4C4',
            backgroundColor: '#2E2A4D',
            padding: { x: 12, y: 6 }
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive();

        // Efectos hover para el botón del menú
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#FFD93D' });
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#C4C4C4' });
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Efectos visuales (comentado temporalmente)
        // this.createGameOverEffects();
    }

    createGameOverEffects() {
        // Crear partículas de "game over" usando la nueva API
        const particles = this.add.particles('gameAtlas', 'ball');
        
        const emitter = particles.createEmitter({
            speed: { min: 50, max: 150 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 2000,
            frequency: 100,
            quantity: 2,
            blendMode: 'ADD',
            gravityY: 100,
            bounds: { x: 0, y: 0, width: this.cameras.main.width, height: 100 }
        });
    }
}

// Hacer la clase disponible globalmente
window.GameOverScene = GameOverScene; 