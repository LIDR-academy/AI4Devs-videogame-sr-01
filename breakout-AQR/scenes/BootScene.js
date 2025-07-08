/**
 * BootScene - Escena de carga inicial
 * Precarga todos los assets del juego
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Crear barra de progreso
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Cargando...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '14px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // Actualizar barra de progreso
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Cargando: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // Cargar spritesheet
        this.load.atlas('gameAtlas', 'assets/images/spritesheet.png', 'assets/images/spritesheet.json');
        
        // Agregar manejo de errores para debug
        this.load.on('loaderror', (file) => {
            console.error('Error cargando archivo:', file.src);
        });

        // Cargar audio
        this.load.audio('brick_hit', 'assets/audio/brick_hit.mp3');
        this.load.audio('paddle_hit', 'assets/audio/paddle_hit.mp3');
        this.load.audio('powerup_collect', 'assets/audio/powerup_collect.mp3');
        this.load.audio('game_over', 'assets/audio/game_over.mp3');
        this.load.audio('level_complete', 'assets/audio/level_complete.mp3');
    }

    create() {
        // Configurar audio
        this.sound.setVolume(0.7);
        
        // Verificar que los sprites se cargaron correctamente
        console.log('Sprites disponibles:', this.textures.list);
        
        // Ir al menú principal
        this.scene.start('MenuScene');
    }
}

// Hacer la clase disponible globalmente
window.BootScene = BootScene; 