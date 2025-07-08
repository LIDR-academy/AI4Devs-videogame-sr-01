/**
 * MenuScene - Escena del menú principal
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Título del juego
        const title = this.add.text(width / 2, height / 3, 'BREAKOUT\nESCOLAR FUTURISTA', {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#F96167',
            align: 'center',
            stroke: '#2E2A4D',
            strokeThickness: 4
        });
        title.setOrigin(0.5);

        // Botón Jugar
        const playButton = this.add.text(width / 2, height / 2 + 50, 'JUGAR', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#F4F4F9',
            backgroundColor: '#547AA5',
            padding: { x: 20, y: 10 }
        });
        playButton.setOrigin(0.5);
        playButton.setInteractive();

        // Efectos hover para el botón
        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: '#FFD93D' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: '#F4F4F9' });
        });

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Mostrar puntuación más alta
        const highScore = window.gameState.highScore;
        const highScoreText = this.add.text(width / 2, height - 100, `Puntuación más alta: ${highScore}`, {
            fontSize: '16px',
            fontFamily: 'Arial',
            fill: '#C4C4C4'
        });
        highScoreText.setOrigin(0.5);

        // Instrucciones
        const instructions = this.add.text(width / 2, height - 50, 'Usa las flechas o mueve el mouse para controlar la paleta', {
            fontSize: '14px',
            fontFamily: 'Arial',
            fill: '#C4C4C4',
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Efectos visuales de fondo (comentado temporalmente)
        // this.createBackgroundEffects();
    }

    createBackgroundEffects() {
        // Crear partículas flotantes para efecto futurista usando la nueva API
        const particles = this.add.particles('gameAtlas', 'ball');
        
        const emitter = particles.createEmitter({
            speed: { min: 20, max: 50 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 3000,
            frequency: 200,
            quantity: 1,
            blendMode: 'ADD',
            bounds: { x: 0, y: 0, width: this.cameras.main.width, height: this.cameras.main.height }
        });
    }
}

// Hacer la clase disponible globalmente
window.MenuScene = MenuScene; 