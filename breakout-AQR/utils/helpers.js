/**
 * Utilidades y funciones auxiliares para el juego
 */

// Función para generar colores aleatorios para los ladrillos
function getRandomBrickColor() {
    const colors = [0x547AA5, 0xBA68C8, 0x4DD0E1, 0xFFB74D, 0x81C784, 0xFF8A65];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Función para calcular el ángulo de rebote de la bola
function calculateBallAngle(ball, paddle) {
    const hitPoint = (ball.x - paddle.x) / (paddle.width / 2);
    return hitPoint * Math.PI / 3; // -60° a +60°
}

// Función para generar velocidad aleatoria para la bola
function getRandomBallVelocity(speed) {
    const angle = Phaser.Math.Between(-45, 45);
    return {
        x: speed * Math.sin(Phaser.Math.DegToRad(angle)),
        y: -speed * Math.cos(Phaser.Math.DegToRad(angle))
    };
}

// Función para crear efectos de partículas
function createParticleEffect(scene, x, y, texture, config = {}) {
    const particles = scene.add.particles(texture);
    const emitter = particles.createEmitter({
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 1000,
        frequency: 50,
        quantity: 5,
        blendMode: 'ADD',
        x: x,
        y: y,
        ...config
    });
    
    return emitter;
}

// Función para formatear puntuación
function formatScore(score) {
    return score.toString().padStart(6, '0');
}

// Función para verificar si se batió un récord
function checkNewRecord(currentScore, highScore) {
    return currentScore > highScore;
}

// Función para guardar puntuación en localStorage
function saveHighScore(score) {
    const currentHigh = localStorage.getItem('breakoutHighScore') || 0;
    if (score > currentHigh) {
        localStorage.setItem('breakoutHighScore', score);
        return true;
    }
    return false;
}

// Función para obtener puntuación más alta
function getHighScore() {
    return parseInt(localStorage.getItem('breakoutHighScore')) || 0;
}

// Función para crear texto con estilo consistente
function createStyledText(scene, x, y, text, style = {}) {
    const defaultStyle = {
        fontSize: '16px',
        fontFamily: 'Arial',
        fill: '#F4F4F9'
    };
    
    return scene.add.text(x, y, text, { ...defaultStyle, ...style });
}

// Función para crear botón interactivo
function createButton(scene, x, y, text, callback, style = {}) {
    const defaultStyle = {
        fontSize: '18px',
        fontFamily: 'Arial',
        fill: '#F4F4F9',
        backgroundColor: '#547AA5',
        padding: { x: 10, y: 5 }
    };
    
    const button = scene.add.text(x, y, text, { ...defaultStyle, ...style });
    button.setOrigin(0.5);
    button.setInteractive();
    
    // Efectos hover
    button.on('pointerover', () => {
        button.setStyle({ fill: '#FFD93D' });
    });
    
    button.on('pointerout', () => {
        button.setStyle({ fill: defaultStyle.fill });
    });
    
    button.on('pointerdown', callback);
    
    return button;
}

// Función para generar layout de ladrillos
function generateBrickLayout(rows = 5, cols = 10, brickWidth = 64, brickHeight = 16, padding = 4) {
    const layout = [];
    const offsetTop = 80;
    const offsetLeft = 80;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetLeft + col * (brickWidth + padding);
            const y = offsetTop + row * (brickHeight + padding);
            
            layout.push({
                x: x,
                y: y,
                row: row,
                col: col,
                hasPowerUp: Math.random() < 0.1,
                powerUpType: Math.random() < 0.1 ? getRandomPowerUpType() : null
            });
        }
    }
    
    return layout;
}

// Función para obtener tipo de power-up aleatorio
function getRandomPowerUpType() {
    const types = ['enlarge', 'laser', 'zoom', 'multi'];
    return types[Math.floor(Math.random() * types.length)];
}

// Función para crear efecto de pantalla completa
function createFullscreenEffect(scene) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x000000, 0.5);
    graphics.fillRect(0, 0, scene.cameras.main.width, scene.cameras.main.height);
    
    scene.tweens.add({
        targets: graphics,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            graphics.destroy();
        }
    });
    
    return graphics;
}

// Hacer las funciones disponibles globalmente
window.gameHelpers = {
    getRandomBrickColor,
    calculateBallAngle,
    getRandomBallVelocity,
    createParticleEffect,
    formatScore,
    checkNewRecord,
    saveHighScore,
    getHighScore,
    createStyledText,
    createButton,
    generateBrickLayout,
    getRandomPowerUpType,
    createFullscreenEffect
}; 