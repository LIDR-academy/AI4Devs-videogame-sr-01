/**
 * Main Game Engine for Will of Persia
 * Coordinates all game systems and manages game state
 * Follows MVC pattern - this is the main controller
 */

class Game {
  constructor(canvasId) {
    // Canvas and context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Game systems
    this.input = new InputHandler();
    this.physics = new PhysicsEngine();
    this.camera = new Camera();

    // Game state
    this.currentState = "start"; // start, playing, paused, gameOver, levelComplete, gameComplete
    this.currentLevel = null;
    this.currentLevelNumber = 1;
    this.player = null;

    // Game loop
    this.lastTime = 0;
    this.isRunning = false;
    this.targetFPS = 60;
    this.deltaTime = 0;

    // UI elements
    this.scoreElement = document.getElementById("score");
    this.levelElement = document.getElementById("level");
    this.screens = {
      start: document.getElementById("startScreen"),
      gameOver: document.getElementById("gameOverScreen"),
      levelComplete: document.getElementById("levelCompleteScreen"),
      gameComplete: document.getElementById("gameCompleteScreen"),
    };

    // Game statistics
    this.totalPlayTime = 0;
    this.deaths = 0;

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize the game
   */
  init() {
    // Load first level
    this.loadLevel(1);

    // Setup responsive canvas
    this.handleResize();

    // Show start screen
    this.setState("start");

    // Start menu music
    if (window.audioManager) {
      setTimeout(() => {
        window.audioManager.startMenuMusic();
      }, 500); // Small delay to ensure everything is loaded
    }
  }

  /**
   * Setup event listeners for UI buttons
   */
  setupEventListeners() {
    // Start button
    document.getElementById("startButton").addEventListener("click", () => {
      this.startGame();
    });

    // Restart button
    document.getElementById("restartButton").addEventListener("click", () => {
      this.restartLevel();
    });

    // Next level button
    document.getElementById("nextLevelButton").addEventListener("click", () => {
      this.nextLevel();
    });

    // Play again button
    document.getElementById("playAgainButton").addEventListener("click", () => {
      this.restartGame();
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // Handle focus/blur for pause
    window.addEventListener("blur", () => {
      if (this.currentState === "playing") {
        this.pauseGame();
      }
    });

    window.addEventListener("focus", () => {
      if (this.currentState === "paused") {
        // Resume audio context and music when returning focus
        if (window.audioManager) {
          window.audioManager.resumeAudioContext();
        }
        setTimeout(() => {
          this.resumeGame();
        }, 100); // Small delay to ensure everything is ready
      }
    });

    // Audio controls
    const muteBtn = document.getElementById("muteBtn");
    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        if (window.audioManager) {
          const isMuted = window.audioManager.toggleMute();
          this.updateMuteButton(isMuted);
        }
      });
    }

    // Direct pause handling with DOM events
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape" || e.code === "KeyP") {
        if (this.currentState === "playing") {
          this.pauseGame();
        } else if (this.currentState === "paused") {
          this.resumeGame();
        }
      }
    });
  }

  /**
   * Start the game
   */
  startGame() {
    // Stop menu music and start game music
    if (window.audioManager) {
      window.audioManager.stopMenuMusic();
      window.audioManager.resumeAudioContext();
      setTimeout(() => {
        window.audioManager.startBackgroundMusic();
      }, 200); // Small delay for smooth transition
    }

    // Start level timer if applicable
    this.startLevelTimer();

    this.setState("playing");
    this.start();
  }

  /**
   * Start the game loop
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.gameLoop();
    }
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Pause the game
   */
  pauseGame() {
    if (this.currentState === "playing") {
      this.setState("paused");

      // Temporarily stop music while paused (but don't fully stop it)
      if (window.audioManager) {
        this.musicWasPlaying = window.audioManager.isMusicPlaying();
        if (this.musicWasPlaying) {
          window.audioManager.stopBackgroundMusic();
        }
      }

      // Don't stop the game loop, just change state
      // Game loop continues to render the pause overlay
    }
  }

  /**
   * Resume the game
   */
  resumeGame() {
    if (this.currentState === "paused") {
      this.setState("playing");

      // Resume audio context and restart music if it was playing
      if (window.audioManager) {
        window.audioManager.resumeAudioContext();
        if (this.musicWasPlaying) {
          setTimeout(() => {
            window.audioManager.startBackgroundMusic();
          }, 200); // Small delay to ensure audio context is ready
        }
      }

      // Don't restart the game loop, just change state
      // Game loop was never stopped during pause
    }
  }

  /**
   * Main game loop
   */
  gameLoop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1 / 30); // Cap at 30 FPS minimum
    this.lastTime = currentTime;

    // Safari-specific optimization: additional deltaTime smoothing
    if (this.deltaTime > 0.05) {
      // If deltaTime is > 50ms, something's wrong
      this.deltaTime = 0.016; // Force 60fps deltaTime
    }

    // Update game
    this.update(this.deltaTime);

    // Render game
    this.render();

    // Continue loop
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Update game state
   */
  update(deltaTime) {
    // Handle mute toggle - should work in any state
    if (this.input.isJustPressed("KeyM")) {
      if (window.audioManager) {
        const isMuted = window.audioManager.toggleMute();
        this.updateMuteButton(isMuted);
      }
    }

    // Only update game logic if playing
    if (this.currentState !== "playing") {
      this.input.update();
      return;
    }

    // Update total play time
    this.totalPlayTime += deltaTime;

    // Handle restart input
    if (this.input.isRestartJustPressed()) {
      this.restartLevel();
      return;
    }

    // Update game systems
    this.updateLevel(deltaTime);
    this.updatePlayer(deltaTime);
    this.updateCamera(deltaTime);
    this.updateCollisions();
    this.updateUI();

    // Check game conditions
    this.checkGameConditions();

    // Update input at end of frame
    this.input.update();
  }

  /**
   * Update current level
   */
  updateLevel(deltaTime) {
    if (this.currentLevel) {
      this.currentLevel.update(deltaTime);

      // Check if timer expired
      if (this.currentLevel.hasTimer) {
        const timerResult = this.currentLevel.updateTimer(deltaTime);
        if (timerResult && timerResult.type === "timerExpired") {
          this.handleGameEvent(timerResult);
        }
      }
    }
  }

  /**
   * Update player
   */
  updatePlayer(deltaTime) {
    if (this.player) {
      this.player.update(deltaTime, this.input, this.physics);

      // Update player's nearby interactables
      if (this.currentLevel) {
        this.player.updateNearbyInteractables(
          this.currentLevel.getActiveGameObjects()
        );
      }

      // Handle player interaction input
      if (this.input.isActionJustPressed()) {
        const results = this.player.interact();
        results.forEach((result) => this.handleGameEvent(result));
      }
    }
  }

  /**
   * Update camera
   */
  updateCamera(deltaTime) {
    if (this.player && this.currentLevel) {
      // Set camera bounds to level bounds
      this.camera.setBounds(
        0,
        0,
        this.currentLevel.width,
        this.currentLevel.height
      );

      // Follow player
      this.camera.follow(this.player, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Update collisions
   */
  updateCollisions() {
    if (!this.player || !this.currentLevel) return;

    // Get all solid platforms (regular platforms + closed doors)
    const allSolidPlatforms = [...this.currentLevel.platforms];

    // Add closed doors as solid platforms
    this.currentLevel.getActiveGameObjects().forEach((obj) => {
      if (obj.type === "door" && obj.isBlocking && obj.isBlocking()) {
        // Treat closed door as a solid platform
        allSolidPlatforms.push({
          x: obj.x,
          y: obj.y,
          width: obj.width,
          height: obj.height,
          type: "solid",
        });
      }
    });

    // Physics collisions with all solid platforms
    this.physics.checkPlatformCollisions(this.player, allSolidPlatforms);

    // World bounds
    const hitBounds = this.physics.checkWorldBounds(
      this.player,
      this.currentLevel.width,
      this.currentLevel.height
    );
    if (hitBounds && this.player.y > this.currentLevel.height) {
      // Player fell out of world
      this.handleGameEvent({ type: "playerDeath", cause: "fall" });
    }

    // Collisions with game objects (excluding doors, which are handled above)
    this.currentLevel.getActiveGameObjects().forEach((obj) => {
      if (
        obj.type !== "door" &&
        this.physics.checkEntityCollision(this.player, obj)
      ) {
        const result = this.player.onCollisionWithObject(obj);
        if (result) {
          this.handleGameEvent(result);
        }
      }
    });
  }

  /**
   * Update UI elements
   */
  updateUI() {
    if (this.player && this.currentLevel) {
      // Update score display
      this.scoreElement.textContent = `Keys: ${this.player.keysCollected}/${this.currentLevel.targetKeysCount}`;

      // Update level display
      this.levelElement.textContent = `Level: ${this.currentLevelNumber}`;
    }
  }

  /**
   * Check game conditions (win/lose)
   */
  checkGameConditions() {
    if (!this.player || !this.currentLevel) return;

    // Check if player died
    if (!this.player.alive) {
      this.handleGameEvent({ type: "playerDeath", cause: "health" });
    }

    // Check if level can be completed
    this.currentLevel.isComplete(this.player.keysCollected);
  }

  /**
   * Handle game events
   */
  handleGameEvent(event) {
    switch (event.type) {
      case "keyCollected":
        break;

      case "switchToggled":
        this.currentLevel.handleSwitchToggle(event.targetId, event.state);
        break;

      case "playerDeath":
        this.deaths++;
        this.handlePlayerDeath();
        break;

      case "levelComplete":
        this.handleLevelComplete();
        break;

      case "timerExpired":
        this.deaths++;
        this.handleTimerExpired();
        break;

      default:
        break;
    }
  }

  /**
   * Handle player death
   */
  handlePlayerDeath() {
    // Stop background music
    if (window.audioManager) {
      window.audioManager.stopBackgroundMusic();
    }

    this.setState("gameOver");
    this.stop();

    // Update game over message
    const messages = [
      "The sands of time have claimed you...",
      "Even princes must face defeat...",
      "The palace guards have bested you...",
      "Try again, brave warrior!",
    ];

    const messageElement = document.getElementById("gameOverMessage");
    messageElement.textContent =
      messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Handle timer expiration
   */
  handleTimerExpired() {
    // Stop background music
    if (window.audioManager) {
      window.audioManager.stopBackgroundMusic();
    }

    this.setState("gameOver");
    this.stop();

    // Update game over message with timer-specific message
    const messageElement = document.getElementById("gameOverMessage");
    messageElement.textContent =
      "Time has run out! The challenge was too great...";
  }

  /**
   * Handle level completion
   */
  handleLevelComplete() {
    // Play level complete sound
    if (window.audioManager) {
      window.audioManager.playLevelComplete();
    }

    const totalLevels = LevelFactory.getLevelCount();

    if (this.currentLevelNumber >= totalLevels) {
      // Game complete!
      this.setState("gameComplete");
    } else {
      // Level complete, show next level screen
      this.setState("levelComplete");
    }

    this.stop();
  }

  /**
   * Load a specific level
   */
  loadLevel(levelNumber) {
    this.currentLevel = LevelFactory.createLevel(levelNumber);
    if (!this.currentLevel) {
      console.error(`Failed to load level ${levelNumber}`);
      return false;
    }

    this.currentLevelNumber = levelNumber;

    // Create/reset player
    const spawnPoint = this.currentLevel.spawnPoint;
    if (!this.player) {
      this.player = new Player(spawnPoint.x, spawnPoint.y);
    } else {
      this.player.setPosition(spawnPoint.x, spawnPoint.y);
      this.player.respawn();
      this.player.keysCollected = 0;
    }

    // Reset camera
    this.camera.setPosition(0, 0);

    return true;
  }

  /**
   * Start timer for levels that have it
   */
  startLevelTimer() {
    if (this.currentLevel && this.currentLevel.hasTimer) {
      this.currentLevel.startTimer();
    }
  }

  /**
   * Restart current level
   */
  restartLevel() {
    this.loadLevel(this.currentLevelNumber);
    this.startGame();
  }

  /**
   * Go to next level
   */
  nextLevel() {
    const nextLevelNumber = this.currentLevelNumber + 1;
    if (this.loadLevel(nextLevelNumber)) {
      this.startGame();
    } else {
      console.error("No next level available");
    }
  }

  /**
   * Restart entire game
   */
  restartGame() {
    this.deaths = 0;
    this.totalPlayTime = 0;
    this.loadLevel(1);

    // Stop current music and return to start screen with menu music
    if (window.audioManager) {
      window.audioManager.stopBackgroundMusic();
      window.audioManager.stopMenuMusic();
    }

    this.setState("start");

    // Start menu music again
    if (window.audioManager) {
      setTimeout(() => {
        window.audioManager.startMenuMusic();
      }, 300);
    }
  }

  /**
   * Set game state and manage screen visibility
   */
  setState(newState) {
    const oldState = this.currentState;
    this.currentState = newState;

    // Hide all screens
    Object.values(this.screens).forEach((screen) => {
      screen.classList.add("hidden");
    });

    // Show appropriate screen
    switch (newState) {
      case "start":
        this.screens.start.classList.remove("hidden");
        // Start menu music if coming from a different state
        if (
          oldState !== "start" &&
          window.audioManager &&
          !window.audioManager.isMenuMusicPlaying()
        ) {
          setTimeout(() => {
            window.audioManager.startMenuMusic();
          }, 200);
        }
        break;
      case "gameOver":
        this.screens.gameOver.classList.remove("hidden");
        break;
      case "levelComplete":
        this.screens.levelComplete.classList.remove("hidden");
        break;
      case "gameComplete":
        this.screens.gameComplete.classList.remove("hidden");
        break;
      case "playing":
      case "paused":
        // No overlay screen for these states
        break;
    }
  }

  /**
   * Render the game
   */
  render() {
    // Clear canvas - Safari optimization: use faster clearRect
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Safari optimization: disable smoothing for better performance
    this.ctx.imageSmoothingEnabled = false;

    if (this.currentState === "playing") {
      // Render level
      if (this.currentLevel) {
        this.currentLevel.render(this.ctx, this.camera);
      }

      // Render player
      if (this.player) {
        this.player.render(this.ctx, this.camera);
      }

      // Render debug info if needed
      this.renderDebugInfo();
    }

    // Render pause overlay
    if (this.currentState === "paused") {
      this.renderPauseOverlay();
    }

    // Safari optimization: restore default smoothing
    this.ctx.imageSmoothingEnabled = true;
  }

  /**
   * Render debug information
   */
  renderDebugInfo() {
    if (window.DEBUG_MODE) {
      const debugY = 100;
      this.ctx.fillStyle = "white";
      this.ctx.font = "12px monospace";

      this.ctx.fillText(`FPS: ${Math.round(1 / this.deltaTime)}`, 10, debugY);
      this.ctx.fillText(
        `Player: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`,
        10,
        debugY + 15
      );
      this.ctx.fillText(
        `Velocity: ${this.player.velocityX.toFixed(
          1
        )}, ${this.player.velocityY.toFixed(1)}`,
        10,
        debugY + 30
      );
      this.ctx.fillText(`Grounded: ${this.player.grounded}`, 10, debugY + 45);
      this.ctx.fillText(
        `Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`,
        10,
        debugY + 60
      );

      // Audio debug info
      if (window.audioManager) {
        this.ctx.fillText(
          `Audio: ${window.audioManager.muted ? "MUTED" : "ON"} | Enabled: ${
            window.audioManager.audioEnabled ? "YES" : "NO"
          } | Game Music: ${
            window.audioManager.isMusicPlaying() ? "PLAYING" : "STOPPED"
          } | Menu Music: ${
            window.audioManager.isMenuMusicPlaying() ? "PLAYING" : "STOPPED"
          }`,
          10,
          debugY + 75
        );
      }

      // Door debug info
      if (this.currentLevel) {
        const doors = this.currentLevel
          .getActiveGameObjects()
          .filter((obj) => obj.type === "door");
        doors.forEach((door, index) => {
          this.ctx.fillText(
            `Door ${index + 1}: ${door.isOpen ? "OPEN" : "CLOSED"} (${
              door.id
            })`,
            10,
            debugY + 90 + index * 15
          );
        });
      }
    }
  }

  /**
   * Render pause overlay
   */
  renderPauseOverlay() {
    // Render the current game state first (frozen frame)
    if (this.currentLevel) {
      this.currentLevel.render(this.ctx, this.camera);
    }
    if (this.player) {
      this.player.render(this.ctx, this.camera);
    }

    // Dark overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    Utils.drawTextWithOutline(
      this.ctx,
      "PAUSED",
      this.canvas.width / 2,
      this.canvas.height / 2 - 30,
      Colors.TEXT_PRIMARY,
      "#000",
      48
    );

    Utils.drawTextWithOutline(
      this.ctx,
      "Press ESC or P to resume",
      this.canvas.width / 2,
      this.canvas.height / 2 + 20,
      Colors.TEXT_SECONDARY,
      "#000",
      18
    );

    Utils.drawTextWithOutline(
      this.ctx,
      "Game pauses automatically when tab loses focus",
      this.canvas.width / 2,
      this.canvas.height / 2 + 50,
      Colors.TEXT_SECONDARY,
      "#000",
      14
    );
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Make canvas responsive while maintaining aspect ratio
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Target aspect ratio (16:9)
    const targetAspectRatio = 16 / 9;

    let newWidth, newHeight;

    if (containerWidth / containerHeight > targetAspectRatio) {
      // Container is wider than target ratio
      newHeight = containerHeight;
      newWidth = containerHeight * targetAspectRatio;
    } else {
      // Container is taller than target ratio
      newWidth = containerWidth;
      newHeight = containerWidth / targetAspectRatio;
    }

    // Update canvas display size (not internal resolution)
    this.canvas.style.width = newWidth + "px";
    this.canvas.style.height = newHeight + "px";

    // On mobile, adjust for controls space
    if (window.isMobile) {
      const maxHeight = window.innerHeight - 160; // Leave space for controls
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * targetAspectRatio;
        this.canvas.style.width = newWidth + "px";
        this.canvas.style.height = newHeight + "px";
      }
    }
  }

  /**
   * Get game statistics
   */
  getStats() {
    return {
      currentLevel: this.currentLevelNumber,
      totalPlayTime: this.totalPlayTime,
      deaths: this.deaths,
      keysCollected: this.player ? this.player.keysCollected : 0,
      health: this.player ? this.player.health : 0,
    };
  }

  /**
   * Enable debug mode
   */
  enableDebugMode() {
    window.DEBUG_MODE = true;
  }

  /**
   * Disable debug mode
   */
  disableDebugMode() {
    window.DEBUG_MODE = false;
  }

  /**
   * Update mute button appearance
   */
  updateMuteButton(isMuted) {
    const muteBtn = document.getElementById("muteBtn");
    if (muteBtn) {
      muteBtn.textContent = isMuted ? "🔇" : "🔊";
      muteBtn.classList.toggle("muted", isMuted);
    }
  }
}

// Global debug functions for development
window.enableDebug = () => {
  if (window.game) {
    window.game.enableDebugMode();
  }
};

window.disableDebug = () => {
  if (window.game) {
    window.game.disableDebugMode();
  }
};

window.skipLevel = () => {
  if (window.game && window.game.currentState === "playing") {
    window.game.handleLevelComplete();
  }
};

window.godMode = () => {
  if (window.game && window.game.player) {
    window.game.player.health = 999;
    window.game.player.keysCollected = 10;
  }
};

window.toggleMusic = () => {
  if (window.audioManager) {
    if (window.audioManager.isMusicPlaying()) {
      window.audioManager.stopBackgroundMusic();
    } else {
      window.audioManager.startBackgroundMusic();
    }
  }
};

window.testSounds = () => {
  if (window.audioManager) {
    window.audioManager.playJump();
    setTimeout(() => window.audioManager.playKeyCollect(), 500);
    setTimeout(() => window.audioManager.playSwitch(), 1000);
    setTimeout(() => window.audioManager.playDoorOpen(), 1500);
    setTimeout(() => window.audioManager.playDamage(), 2000);
    setTimeout(() => window.audioManager.playLevelComplete(), 2500);
  }
};

window.testMenuMusic = () => {
  if (window.audioManager) {
    if (window.audioManager.isMenuMusicPlaying()) {
      window.audioManager.stopMenuMusic();
    } else {
      window.audioManager.startMenuMusic();
    }
  }
};

window.testDeathLaugh = () => {
  if (window.audioManager) {
    window.audioManager.playDeathLaugh();
  }
};
