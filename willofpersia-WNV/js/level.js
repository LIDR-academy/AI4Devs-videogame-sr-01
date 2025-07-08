/**
 * Level System for Will of Persia
 * Manages level data, platforms, and interactive objects
 * Follows Factory Pattern for level creation
 */

class Level {
  constructor(levelData) {
    this.id = levelData.id;
    this.name = levelData.name;
    this.width = levelData.width;
    this.height = levelData.height;
    this.backgroundColor = levelData.backgroundColor || Colors.BACKGROUND_DARK;

    // Game objects
    this.platforms = [];
    this.gameObjects = [];
    this.spawnPoint = levelData.spawnPoint || { x: 50, y: 400 };
    this.targetKeysCount = 0;

    // Timer functionality
    this.hasTimer = levelData.hasTimer || false;
    this.timerDuration = levelData.timerDuration || 60; // Default 60 seconds
    this.currentTimer = this.timerDuration;
    this.timerActive = false;

    // Initialize level from data
    this.initializeFromData(levelData);
  }

  /**
   * Initialize level from level data
   */
  initializeFromData(levelData) {
    // Create platforms
    if (levelData.platforms) {
      levelData.platforms.forEach((platformData) => {
        this.platforms.push(this.createPlatform(platformData));
      });
    }

    // Create game objects
    if (levelData.objects) {
      levelData.objects.forEach((objData) => {
        const obj = this.createGameObject(objData);
        if (obj) {
          this.gameObjects.push(obj);
          if (obj.type === "key") {
            this.targetKeysCount++;
          }
        }
      });
    }
  }

  /**
   * Create a platform from data
   */
  createPlatform(data) {
    const platform = {
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      type: data.type || "solid",
      color: data.color || Colors.PLATFORM,
      edgeColor: data.edgeColor || Colors.PLATFORM_EDGE,
    };

    // Add moving platform properties if specified
    if (data.movement) {
      platform.isMoving = true;
      platform.startX = data.x;
      platform.startY = data.y;
      platform.endX = data.movement.endX;
      platform.endY = data.movement.endY;
      platform.speed = data.movement.speed || 1;
      platform.direction = 1;
      platform.velocityX = 0;
      platform.velocityY = 0;
    }

    return platform;
  }

  /**
   * Create a game object from data
   */
  createGameObject(data) {
    switch (data.type) {
      case "key":
        return new Key(data.x, data.y);

      case "switch":
        return new Switch(data.x, data.y, data.targetId);

      case "door":
        return new Door(data.x, data.y, data.width, data.height, data.id);

      case "movingPlatform":
        return new MovingPlatform(
          data.x,
          data.y,
          data.width,
          data.height,
          data.endX,
          data.endY,
          data.speed
        );

      case "portal":
        return new Portal(data.x, data.y);

      case "spikes":
        return new SpikeTrap(data.x, data.y, data.width);

      case "fallingSpikes":
        return new FallingSpikeTrap(data.x, data.y, data.width, data.speed);

      default:
        console.warn(`Unknown object type: ${data.type}`);
        return null;
    }
  }

  /**
   * Update level (moving platforms, animations, etc.)
   */
  update(deltaTime) {
    // Update moving platforms
    this.platforms.forEach((platform) => {
      if (platform.isMoving) {
        this.updateMovingPlatform(platform, deltaTime);
      }
    });

    // Update game objects
    this.gameObjects.forEach((obj) => {
      if (obj.update) {
        obj.update(deltaTime);
      }
    });

    // Update timer
    if (this.hasTimer && this.timerActive) {
      this.updateTimer(deltaTime);
    }
  }

  /**
   * Update moving platform logic
   */
  updateMovingPlatform(platform, deltaTime) {
    // Calculate movement direction
    const deltaX = platform.endX - platform.startX;
    const deltaY = platform.endY - platform.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 0) {
      const normalizedX = deltaX / distance;
      const normalizedY = deltaY / distance;

      platform.velocityX = normalizedX * platform.speed * platform.direction;
      platform.velocityY = normalizedY * platform.speed * platform.direction;

      // Update position
      platform.x += platform.velocityX;
      platform.y += platform.velocityY;

      // Check if reached destination
      const currentDistance =
        platform.direction === 1
          ? Utils.distance(
              { x: platform.x, y: platform.y },
              { x: platform.endX, y: platform.endY }
            )
          : Utils.distance(
              { x: platform.x, y: platform.y },
              { x: platform.startX, y: platform.startY }
            );

      if (currentDistance < platform.speed) {
        platform.direction *= -1; // Reverse direction
        // Snap to exact position
        if (platform.direction === 1) {
          platform.x = platform.startX;
          platform.y = platform.startY;
        } else {
          platform.x = platform.endX;
          platform.y = platform.endY;
        }
      }
    }
  }

  /**
   * Update timer countdown
   */
  updateTimer(deltaTime) {
    this.currentTimer -= deltaTime;

    // Check if timer expired
    if (this.currentTimer <= 0) {
      this.currentTimer = 0;
      this.timerActive = false;
      return { type: "timerExpired" };
    }

    return null;
  }

  /**
   * Start the timer
   */
  startTimer() {
    if (this.hasTimer) {
      this.timerActive = true;
      this.currentTimer = this.timerDuration;
    }
  }

  /**
   * Stop the timer
   */
  stopTimer() {
    this.timerActive = false;
  }

  /**
   * Reset the timer
   */
  resetTimer() {
    this.currentTimer = this.timerDuration;
    this.timerActive = false;
  }

  /**
   * Get timer info
   */
  getTimerInfo() {
    return {
      hasTimer: this.hasTimer,
      active: this.timerActive,
      timeLeft: this.currentTimer,
      duration: this.timerDuration,
      isExpired: this.currentTimer <= 0,
    };
  }

  /**
   * Render the level
   */
  render(ctx, camera) {
    // Draw background
    this.renderBackground(ctx, camera);

    // Draw platforms
    this.renderPlatforms(ctx, camera);

    // Draw game objects
    this.renderGameObjects(ctx, camera);

    // Render timer
    this.renderTimer(ctx, camera);
  }

  /**
   * Render background
   */
  renderBackground(ctx, camera) {
    // Clear with background color
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Add atmospheric background elements
    this.renderBackgroundElements(ctx, camera);
  }

  /**
   * Render atmospheric background elements
   */
  renderBackgroundElements(ctx, camera) {
    // Draw background grid/pattern
    const gridSize = 64;
    const offsetX = camera.x % gridSize;
    const offsetY = camera.y % gridSize;

    ctx.strokeStyle = "rgba(100, 100, 150, 0.1)";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = -offsetX; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = -offsetY; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }

    // Add depth with distant elements
    const distantOpacity = 0.3;
    ctx.fillStyle = `rgba(100, 100, 150, ${distantOpacity})`;

    // Distant pillars
    for (let i = 0; i < 5; i++) {
      const pillarX = i * 200 - ((camera.x * 0.3) % 1000);
      const pillarY = ctx.canvas.height - 100;
      ctx.fillRect(pillarX, pillarY, 20, 100);
    }
  }

  /**
   * Render platforms
   */
  renderPlatforms(ctx, camera) {
    this.platforms.forEach((platform) => {
      const screenX = platform.x - camera.x;
      const screenY = platform.y - camera.y;

      // Skip if platform is not visible
      if (
        screenX + platform.width < 0 ||
        screenX > ctx.canvas.width ||
        screenY + platform.height < 0 ||
        screenY > ctx.canvas.height
      ) {
        return;
      }

      // Draw platform based on type
      switch (platform.type) {
        case "solid":
          this.renderSolidPlatform(ctx, platform, screenX, screenY);
          break;
        case "oneway":
          this.renderOneWayPlatform(ctx, platform, screenX, screenY);
          break;
        default:
          this.renderSolidPlatform(ctx, platform, screenX, screenY);
      }

      // Draw moving platform indicators
      if (platform.isMoving) {
        this.renderMovingPlatformIndicators(ctx, platform, screenX, screenY);
      }
    });
  }

  /**
   * Render solid platform
   */
  renderSolidPlatform(ctx, platform, screenX, screenY) {
    // Draw main platform body
    Utils.drawGradientRect(
      ctx,
      screenX,
      screenY,
      platform.width,
      platform.height,
      platform.color,
      platform.edgeColor
    );

    // Draw platform outline
    ctx.strokeStyle = platform.edgeColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, platform.width, platform.height);

    // Add texture details
    const textureSpacing = 16;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";

    for (let x = 0; x < platform.width; x += textureSpacing) {
      for (let y = 0; y < platform.height; y += textureSpacing) {
        if ((x + y) % (textureSpacing * 2) === 0) {
          ctx.fillRect(screenX + x, screenY + y, 2, 2);
        }
      }
    }
  }

  /**
   * Render one-way platform
   */
  renderOneWayPlatform(ctx, platform, screenX, screenY) {
    // Draw thinner platform for one-way
    const oneWayHeight = Math.min(platform.height, 8);

    Utils.drawGradientRect(
      ctx,
      screenX,
      screenY,
      platform.width,
      oneWayHeight,
      platform.color,
      platform.edgeColor
    );

    // Draw arrows indicating one-way nature
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    const arrowSpacing = 32;

    for (let x = arrowSpacing; x < platform.width; x += arrowSpacing) {
      const arrowX = screenX + x;
      const arrowY = screenY - 8;

      // Draw upward arrow
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 4, arrowY - 6);
      ctx.lineTo(arrowX + 4, arrowY - 6);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Render moving platform indicators
   */
  renderMovingPlatformIndicators(ctx, platform, screenX, screenY) {
    // Draw movement path
    ctx.strokeStyle = "rgba(100, 200, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    const startScreenX = platform.startX - (platform.x - screenX);
    const startScreenY = platform.startY - (platform.y - screenY);
    const endScreenX = platform.endX - (platform.x - screenX);
    const endScreenY = platform.endY - (platform.y - screenY);

    ctx.beginPath();
    ctx.moveTo(
      startScreenX + platform.width / 2,
      startScreenY + platform.height / 2
    );
    ctx.lineTo(
      endScreenX + platform.width / 2,
      endScreenY + platform.height / 2
    );
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash
  }

  /**
   * Render game objects
   */
  renderGameObjects(ctx, camera) {
    // Sort objects by y position for proper layering
    const sortedObjects = [...this.gameObjects].sort((a, b) => {
      return a.y + a.height - (b.y + b.height);
    });

    sortedObjects.forEach((obj) => {
      if (obj.render && obj.active !== false) {
        obj.render(ctx, camera);
      }
    });
  }

  /**
   * Handle switch activation
   */
  handleSwitchToggle(targetId, state) {
    this.gameObjects.forEach((obj) => {
      if (obj.id === targetId) {
        if (obj.setOpen) {
          obj.setOpen(state);
        } else if (obj.toggle) {
          obj.toggle();
        }
      }
    });
  }

  /**
   * Check if level is complete
   */
  isComplete(keysCollected) {
    const portal = this.gameObjects.find((obj) => obj.type === "portal");
    if (portal) {
      const hasAllKeys = keysCollected >= this.targetKeysCount;
      portal.setActive(hasAllKeys);
      return hasAllKeys;
    }
    return false;
  }

  /**
   * Get active game objects (for collision detection)
   */
  getActiveGameObjects() {
    return this.gameObjects.filter((obj) => obj.active !== false);
  }

  /**
   * Reset level to initial state
   */
  reset() {
    // Reset all game objects
    this.gameObjects.forEach((obj) => {
      if (obj.reset) {
        obj.reset();
      }
    });

    // Reset timer
    this.resetTimer();
  }

  /**
   * Render timer on screen
   */
  renderTimer(ctx, camera) {
    if (!this.hasTimer) return;

    const timerInfo = this.getTimerInfo();
    if (!timerInfo.active && timerInfo.timeLeft === timerInfo.duration) return;

    // Timer position (top center of screen)
    const timerX = ctx.canvas.width / 2;
    const timerY = 50;

    // Format time as MM:SS
    const minutes = Math.floor(timerInfo.timeLeft / 60);
    const seconds = Math.floor(timerInfo.timeLeft % 60);
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    // Timer background
    const bgWidth = 120;
    const bgHeight = 40;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(
      timerX - bgWidth / 2,
      timerY - bgHeight / 2,
      bgWidth,
      bgHeight
    );

    // Timer border (color based on time remaining)
    let borderColor = Colors.TEXT_PRIMARY;
    if (timerInfo.timeLeft < 10) {
      borderColor = Colors.DANGER;
    } else if (timerInfo.timeLeft < 30) {
      borderColor = "#ff6600";
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      timerX - bgWidth / 2,
      timerY - bgHeight / 2,
      bgWidth,
      bgHeight
    );

    // Timer text
    Utils.drawTextWithOutline(
      ctx,
      timeString,
      timerX,
      timerY + 5,
      borderColor,
      "#000",
      18
    );

    // Timer label
    Utils.drawTextWithOutline(
      ctx,
      "TIME LEFT",
      timerX,
      timerY - 25,
      Colors.TEXT_SECONDARY,
      "#000",
      10
    );

    // Warning effects for low time
    if (timerInfo.timeLeft < 10) {
      const warningAlpha = (Math.sin(timerInfo.timeLeft * 10) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha * 0.2})`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }
}

/**
 * Level Factory - Creates levels from predefined data
 */
class LevelFactory {
  static createLevel(levelNumber) {
    const levelData = LevelData[`level${levelNumber}`];
    if (!levelData) {
      console.error(`Level ${levelNumber} not found`);
      return null;
    }
    return new Level(levelData);
  }

  static getLevelCount() {
    return Object.keys(LevelData).length;
  }
}

/**
 * Level Data - Defines all levels
 */
const LevelData = {
  level1: {
    id: 1,
    name: "The Beginning",
    width: 1600,
    height: 600,
    spawnPoint: { x: 50, y: 400 },
    platforms: [
      // Ground platforms
      { x: 0, y: 500, width: 300, height: 100 },
      { x: 400, y: 450, width: 200, height: 32 },
      { x: 700, y: 400, width: 150, height: 32 },
      { x: 950, y: 350, width: 200, height: 32 },
      { x: 1250, y: 300, width: 350, height: 300 },

      // Upper platforms
      { x: 500, y: 250, width: 100, height: 32 },
      { x: 800, y: 200, width: 150, height: 32 },
    ],
    objects: [
      { type: "key", x: 450, y: 400 },
      { type: "key", x: 750, y: 350 },
      { type: "key", x: 850, y: 150 },
      { type: "portal", x: 1400, y: 236 },
    ],
  },

  level2: {
    id: 2,
    name: "Simple Switches",
    width: 1800,
    height: 600,
    spawnPoint: { x: 50, y: 400 },
    platforms: [
      // Ground level - más conectado
      { x: 0, y: 500, width: 350, height: 100 },
      { x: 450, y: 500, width: 300, height: 100 },
      { x: 850, y: 500, width: 300, height: 100 },
      { x: 1250, y: 500, width: 350, height: 100 },

      // Middle level - saltos más fáciles
      { x: 200, y: 380, width: 150, height: 32 },
      { x: 400, y: 350, width: 150, height: 32 },
      { x: 650, y: 320, width: 150, height: 32 },
      { x: 900, y: 300, width: 150, height: 32 },
      { x: 1150, y: 280, width: 150, height: 32 },

      // Upper level - más accesible
      { x: 300, y: 200, width: 200, height: 32 },
      { x: 600, y: 180, width: 200, height: 32 },
      { x: 900, y: 160, width: 200, height: 32 },
      { x: 1200, y: 140, width: 200, height: 32 },
    ],
    objects: [
      { type: "key", x: 250, y: 330 },
      { type: "switch", x: 450, y: 334, targetId: "door1" },
      { type: "door", x: 580, y: 80, width: 32, height: 100, id: "door1" },
      { type: "key", x: 650, y: 130 },
      { type: "switch", x: 950, y: 144, targetId: "door2" },
      { type: "door", x: 1120, y: 40, width: 32, height: 100, id: "door2" },
      { type: "key", x: 1250, y: 90 },
      { type: "portal", x: 1500, y: 436 },
    ],
  },

  level3: {
    id: 3,
    name: "Complex Switches",
    width: 2200,
    height: 600,
    spawnPoint: { x: 50, y: 400 },
    platforms: [
      // Ground level
      { x: 0, y: 500, width: 300, height: 100 },
      { x: 400, y: 500, width: 250, height: 100 },
      { x: 750, y: 500, width: 250, height: 100 },
      { x: 1100, y: 500, width: 250, height: 100 },
      { x: 1450, y: 500, width: 300, height: 100 },
      { x: 1850, y: 450, width: 350, height: 150 },

      // Multi-level platforms
      { x: 200, y: 380, width: 120, height: 32 },
      { x: 450, y: 360, width: 120, height: 32 },
      { x: 700, y: 340, width: 120, height: 32 },
      { x: 950, y: 320, width: 120, height: 32 },
      { x: 1200, y: 300, width: 120, height: 32 },
      { x: 1450, y: 280, width: 120, height: 32 },

      // Upper level
      { x: 150, y: 240, width: 150, height: 32 },
      { x: 400, y: 220, width: 150, height: 32 },
      { x: 650, y: 200, width: 150, height: 32 },
      { x: 900, y: 180, width: 150, height: 32 },
      { x: 1150, y: 160, width: 150, height: 32 },
      { x: 1400, y: 140, width: 150, height: 32 },

      // Top level
      { x: 300, y: 100, width: 200, height: 32 },
      { x: 600, y: 80, width: 200, height: 32 },
      { x: 900, y: 60, width: 200, height: 32 },
      { x: 1200, y: 40, width: 200, height: 32 },
    ],
    objects: [
      // First area
      { type: "key", x: 250, y: 330 },
      { type: "switch", x: 500, y: 344, targetId: "door1" },

      // Second area - door blocks path
      { type: "door", x: 820, y: 100, width: 32, height: 240, id: "door1" },
      { type: "key", x: 700, y: 150 },
      { type: "switch", x: 1000, y: 164, targetId: "door2" },

      // Third area
      { type: "door", x: 1120, y: 60, width: 32, height: 100, id: "door2" },
      { type: "key", x: 1350, y: 90 },
      { type: "switch", x: 1450, y: 124, targetId: "door3" },

      // Final area
      { type: "door", x: 1570, y: 340, width: 32, height: 160, id: "door3" },
      { type: "portal", x: 1950, y: 386 },
    ],
  },

  level4: {
    id: 4,
    name: "Moving Platforms",
    width: 2000,
    height: 600,
    spawnPoint: { x: 50, y: 450 },
    hasTimer: true,
    timerDuration: 90, // 90 seconds to complete the level
    platforms: [
      // Static platforms - better spacing and height differences
      { x: 0, y: 500, width: 200, height: 100 },
      { x: 300, y: 450, width: 120, height: 32 },
      { x: 550, y: 420, width: 120, height: 32 },
      { x: 800, y: 380, width: 120, height: 32 },
      { x: 1050, y: 340, width: 120, height: 32 },
      { x: 1300, y: 300, width: 120, height: 32 },

      // Safe rest platforms
      { x: 650, y: 320, width: 80, height: 32 },
      { x: 950, y: 260, width: 80, height: 32 },
      { x: 1200, y: 200, width: 100, height: 32 },

      // Final area - more accessible
      { x: 1500, y: 380, width: 150, height: 32 },
      { x: 1700, y: 450, width: 300, height: 150 },

      // Moving platforms - slower and safer
      {
        x: 220,
        y: 350,
        width: 80,
        height: 16,
        movement: { endX: 320, endY: 350, speed: 0.8 },
      },
      {
        x: 470,
        y: 320,
        width: 80,
        height: 16,
        movement: { endX: 470, endY: 380, speed: 0.7 },
      },
      {
        x: 720,
        y: 250,
        width: 80,
        height: 16,
        movement: { endX: 850, endY: 250, speed: 0.9 },
      },
      {
        x: 1150,
        y: 200,
        width: 80,
        height: 16,
        movement: { endX: 1250, endY: 160, speed: 0.6 },
      },
      // Final moving platform - predictable pattern
      {
        x: 1420,
        y: 280,
        width: 100,
        height: 16,
        movement: { endX: 1580, endY: 280, speed: 0.8 },
      },
    ],
    objects: [
      // Keys positioned on safer platforms
      { type: "key", x: 350, y: 400 },
      { type: "key", x: 680, y: 270 },
      { type: "key", x: 1230, y: 150 },

      // Fewer and more strategic spikes
      { type: "spikes", x: 420, y: 484, width: 96 },
      { type: "spikes", x: 900, y: 484, width: 80 },

      // Falling spike traps - adding pressure and challenge
      { type: "fallingSpikes", x: 600, y: 50, width: 120, speed: 1.5 },
      { type: "fallingSpikes", x: 1100, y: 30, width: 100, speed: 2.0 },
      { type: "fallingSpikes", x: 1400, y: 40, width: 140, speed: 1.8 },

      // Portal in accessible location
      { type: "portal", x: 1800, y: 386 },
    ],
  },

  level5: {
    id: 5,
    name: "The Gauntlet",
    width: 2800,
    height: 600,
    spawnPoint: { x: 50, y: 450 },
    platforms: [
      // Start area
      { x: 0, y: 500, width: 200, height: 100 },
      { x: 300, y: 450, width: 100, height: 32 },

      // Moving platform section
      { x: 500, y: 400, width: 100, height: 32 },
      { x: 800, y: 350, width: 100, height: 32 },

      // Switch puzzle area
      { x: 1100, y: 500, width: 150, height: 100 },
      { x: 1350, y: 400, width: 100, height: 32 },
      { x: 1550, y: 350, width: 100, height: 32 },
      { x: 1750, y: 300, width: 100, height: 32 },

      // Upper level maze
      { x: 1200, y: 200, width: 150, height: 32 },
      { x: 1450, y: 180, width: 150, height: 32 },
      { x: 1700, y: 160, width: 150, height: 32 },
      { x: 1950, y: 140, width: 150, height: 32 },

      // Final section
      { x: 2200, y: 450, width: 200, height: 32 },
      { x: 2500, y: 400, width: 300, height: 200 },

      // Moving platforms
      {
        x: 250,
        y: 350,
        width: 80,
        height: 16,
        movement: { endX: 350, endY: 350, speed: 1.5 },
      },
      {
        x: 600,
        y: 250,
        width: 80,
        height: 16,
        movement: { endX: 600, endY: 350, speed: 1.2 },
      },
      {
        x: 900,
        y: 200,
        width: 80,
        height: 16,
        movement: { endX: 1000, endY: 200, speed: 1.8 },
      },
      {
        x: 2050,
        y: 300,
        width: 100,
        height: 16,
        movement: { endX: 2150, endY: 250, speed: 1.0 },
      },
    ],
    objects: [
      // First key
      { type: "key", x: 350, y: 400 },

      // Dangerous section
      { type: "spikes", x: 450, y: 484, width: 128 },
      { type: "spikes", x: 650, y: 484, width: 96 },

      // Moving platform key
      { type: "key", x: 650, y: 200 },

      // Switch sequence
      { type: "switch", x: 1150, y: 484, targetId: "door1" },
      { type: "door", x: 1320, y: 300, width: 32, height: 100, id: "door1" },
      { type: "switch", x: 1400, y: 384, targetId: "door2" },
      { type: "door", x: 1520, y: 250, width: 32, height: 100, id: "door2" },
      { type: "switch", x: 1600, y: 334, targetId: "door3" },
      { type: "door", x: 1720, y: 200, width: 32, height: 100, id: "door3" },

      // Upper maze
      { type: "key", x: 1500, y: 130 },
      { type: "spikes", x: 1350, y: 164, width: 64 },
      { type: "spikes", x: 1600, y: 144, width: 64 },
      { type: "spikes", x: 1850, y: 124, width: 64 },

      // Final challenges
      { type: "switch", x: 2000, y: 124, targetId: "door4" },
      { type: "door", x: 2170, y: 350, width: 32, height: 100, id: "door4" },
      { type: "spikes", x: 2300, y: 434, width: 128 },

      // Victory
      { type: "portal", x: 2650, y: 336 },
    ],
  },
};

/**
 * Camera System
 */
class Camera {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.smoothness = GameConstants.CAMERA_SMOOTHNESS;
    this.bounds = null;
  }

  /**
   * Follow a target (usually the player)
   */
  follow(target, canvasWidth, canvasHeight) {
    // Calculate desired camera position (center target on screen)
    this.targetX = target.x + target.width / 2 - canvasWidth / 2;
    this.targetY = target.y + target.height / 2 - canvasHeight / 2;

    // Apply bounds if set
    if (this.bounds) {
      this.targetX = Utils.clamp(
        this.targetX,
        this.bounds.minX,
        this.bounds.maxX - canvasWidth
      );
      this.targetY = Utils.clamp(
        this.targetY,
        this.bounds.minY,
        this.bounds.maxY - canvasHeight
      );
    }

    // Smooth camera movement
    this.x = Utils.lerp(this.x, this.targetX, this.smoothness);
    this.y = Utils.lerp(this.y, this.targetY, this.smoothness);
  }

  /**
   * Set camera bounds
   */
  setBounds(minX, minY, maxX, maxY) {
    this.bounds = { minX, minY, maxX, maxY };
  }

  /**
   * Set camera position immediately
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  /**
   * Shake camera for effects
   */
  shake(intensity = 5, duration = 0.5) {
    // Simple camera shake implementation
    const originalX = this.x;
    const originalY = this.y;

    const shakeTimer = setInterval(() => {
      this.x = originalX + (Math.random() - 0.5) * intensity;
      this.y = originalY + (Math.random() - 0.5) * intensity;
      intensity *= 0.9; // Decay shake

      if (intensity < 0.1) {
        clearInterval(shakeTimer);
        this.x = originalX;
        this.y = originalY;
      }
    }, 16);
  }
}
