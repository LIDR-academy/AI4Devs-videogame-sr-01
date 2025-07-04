/**
 * Game Objects for Will of Persia
 * Contains all interactive elements and collectibles
 * Follows Interface Segregation Principle - each object has specific behaviors
 */

/**
 * Base GameObject class
 */
class GameObject extends PhysicsBody {
  constructor(x, y, width, height, type) {
    super(x, y, width, height);
    this.type = type;
    this.active = true;
    this.hasGravity = false;
    this.animationFrame = 0;
    this.animationSpeed = 0.1;
  }

  update(deltaTime) {
    this.animationFrame += this.animationSpeed;
  }

  render(ctx, camera) {
    // Override in subclasses
  }

  onPlayerCollision(player) {
    // Override in subclasses
  }
}

/**
 * Collectible Key
 */
class Key extends GameObject {
  constructor(x, y) {
    super(x, y, 24, 24, "key");
    this.collected = false;
    this.glowIntensity = 0;
    this.floatOffset = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (!this.collected) {
      this.glowIntensity = Math.sin(this.animationFrame * 3) * 0.5 + 0.5;
      this.floatOffset = Math.sin(this.animationFrame * 2) * 3;
    }
  }

  render(ctx, camera) {
    if (this.collected) return;

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y + this.floatOffset;

    // Draw glow effect
    const glowRadius = 15 + this.glowIntensity * 5;
    const gradient = ctx.createRadialGradient(
      screenX + this.width / 2,
      screenY + this.height / 2,
      0,
      screenX + this.width / 2,
      screenY + this.height / 2,
      glowRadius
    );
    gradient.addColorStop(
      0,
      `rgba(255, 215, 0, ${0.3 + this.glowIntensity * 0.2})`
    );
    gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(
      screenX - glowRadius,
      screenY - glowRadius,
      this.width + glowRadius * 2,
      this.height + glowRadius * 2
    );

    // Draw key body
    Utils.drawRoundedRect(
      ctx,
      screenX + 2,
      screenY + 2,
      this.width - 4,
      this.height - 8,
      3,
      Colors.KEY
    );

    // Draw key teeth
    ctx.fillStyle = Colors.KEY;
    ctx.fillRect(screenX + this.width - 8, screenY + this.height - 6, 6, 2);
    ctx.fillRect(screenX + this.width - 8, screenY + this.height - 3, 4, 2);

    // Draw key ring
    ctx.strokeStyle = Colors.KEY;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(screenX + 6, screenY + 6, 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  onPlayerCollision(player) {
    if (!this.collected) {
      this.collected = true;

      // Play key collection sound
      if (window.audioManager) {
        window.audioManager.playKeyCollect();
      }

      return { type: "keyCollected" };
    }
    return null;
  }
}

/**
 * Interactive Switch
 */
class Switch extends GameObject {
  constructor(x, y, targetId) {
    super(x, y, 32, 16, "switch");
    this.activated = false;
    this.targetId = targetId; // ID of the door/platform this switch controls
    this.activationCooldown = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.activationCooldown > 0) {
      this.activationCooldown -= deltaTime;
    }
  }

  render(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Draw switch base
    Utils.drawRoundedRect(
      ctx,
      screenX,
      screenY + 8,
      this.width,
      8,
      2,
      Colors.PLATFORM,
      Colors.PLATFORM_EDGE
    );

    // Draw switch button
    const buttonColor = this.activated ? Colors.SWITCH_ON : Colors.SWITCH_OFF;
    const buttonY = this.activated ? screenY + 6 : screenY + 2;

    Utils.drawRoundedRect(ctx, screenX + 8, buttonY, 16, 8, 3, buttonColor);

    // Draw interaction hint when near player
    if (this.activationCooldown <= 0) {
      Utils.drawTextWithOutline(
        ctx,
        "E",
        screenX + this.width / 2,
        screenY - 10,
        Colors.TEXT_PRIMARY,
        "#000",
        12
      );
    }
  }

  onPlayerCollision(player) {
    // This switch will be activated by player input in the game loop
    return null;
  }

  activate() {
    if (this.activationCooldown <= 0) {
      this.activated = !this.activated;
      this.activationCooldown = 0.5; // Prevent spam activation

      // Play switch activation sound
      if (window.audioManager) {
        window.audioManager.playSwitch();
      }

      return {
        type: "switchToggled",
        targetId: this.targetId,
        state: this.activated,
      };
    }
    return null;
  }
}

/**
 * Door that can be opened/closed by switches
 */
class Door extends GameObject {
  constructor(x, y, width, height, id) {
    super(x, y, width, height, "door");
    this.id = id;
    this.isOpen = false;
    this.targetY = this.y;
    this.closedY = this.y;
    this.openY = this.y - this.height + 10; // Door slides up when open
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Animate door opening/closing
    const targetY = this.isOpen ? this.openY : this.closedY;
    this.y = Utils.smoothStep(this.y, targetY, 0.1);
  }

  render(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    const doorColor = this.isOpen ? Colors.DOOR_OPEN : Colors.DOOR_CLOSED;

    // Draw door
    Utils.drawGradientRect(
      ctx,
      screenX,
      screenY,
      this.width,
      this.height,
      doorColor,
      "#654321"
    );

    // Draw door details
    ctx.strokeStyle = "#8b4513";
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX + 2, screenY + 2, this.width - 4, this.height - 4);

    // Draw door handle if closed
    if (!this.isOpen) {
      ctx.fillStyle = Colors.TEXT_PRIMARY;
      ctx.fillRect(
        screenX + this.width - 8,
        screenY + this.height / 2 - 2,
        4,
        4
      );
    }
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  setOpen(open) {
    if (this.isOpen !== open) {
      this.isOpen = open;

      // Play door sound when state changes
      if (window.audioManager) {
        window.audioManager.playDoorOpen();
      }
    }
  }

  /**
   * Check if door is blocking (for collision purposes)
   */
  isBlocking() {
    return !this.isOpen;
  }
}

/**
 * Moving Platform
 */
class MovingPlatform extends GameObject {
  constructor(x, y, width, height, endX, endY, speed = 1) {
    super(x, y, width, height, "movingPlatform");
    this.startX = x;
    this.startY = y;
    this.endX = endX;
    this.endY = endY;
    this.speed = speed;
    this.direction = 1; // 1 for forward, -1 for backward
    this.isMoving = true;
    this.hasGravity = false;
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.isMoving) {
      // Calculate movement
      const deltaX = this.endX - this.startX;
      const deltaY = this.endY - this.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 0) {
        const normalizedX = deltaX / distance;
        const normalizedY = deltaY / distance;

        this.velocityX = normalizedX * this.speed * this.direction;
        this.velocityY = normalizedY * this.speed * this.direction;

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Check if reached destination
        const distanceToEnd =
          this.direction === 1
            ? Utils.distance(
                { x: this.x, y: this.y },
                { x: this.endX, y: this.endY }
              )
            : Utils.distance(
                { x: this.x, y: this.y },
                { x: this.startX, y: this.startY }
              );

        if (distanceToEnd < this.speed) {
          this.direction *= -1; // Reverse direction
          // Snap to exact position
          if (this.direction === 1) {
            this.x = this.startX;
            this.y = this.startY;
          } else {
            this.x = this.endX;
            this.y = this.endY;
          }
        }
      }
    }
  }

  render(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Draw platform with moving pattern
    Utils.drawGradientRect(
      ctx,
      screenX,
      screenY,
      this.width,
      this.height,
      Colors.PLATFORM_EDGE,
      Colors.PLATFORM
    );

    // Draw moving indicator arrows
    const arrowSpacing = 16;
    const arrowOffset = (this.animationFrame * 10) % arrowSpacing;

    ctx.fillStyle = Colors.TEXT_PRIMARY;
    for (let i = -arrowOffset; i < this.width; i += arrowSpacing) {
      const arrowX = screenX + i;
      const arrowY = screenY + this.height / 2;

      if (arrowX >= screenX && arrowX <= screenX + this.width - 8) {
        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 6, arrowY - 3);
        ctx.lineTo(arrowX + 6, arrowY + 3);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

/**
 * Exit Portal
 */
class Portal extends GameObject {
  constructor(x, y) {
    super(x, y, 48, 64, "portal");
    this.particleTime = 0;
    this.particles = [];
    this.requiresKeys = true;
    this.active = false;
  }

  update(deltaTime) {
    super.update(deltaTime);

    this.particleTime += deltaTime;

    // Generate particles
    if (this.particleTime > 0.1) {
      this.particles.push({
        x: Utils.random(this.x, this.x + this.width),
        y: this.y + this.height,
        velocityX: Utils.random(-1, 1),
        velocityY: Utils.random(-3, -1),
        life: 1.0,
        size: Utils.random(2, 4),
      });
      this.particleTime = 0;
    }

    // Update particles
    this.particles = this.particles.filter((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life -= 0.02;
      return particle.life > 0;
    });
  }

  render(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Draw portal base
    const gradient = ctx.createLinearGradient(
      screenX,
      screenY,
      screenX,
      screenY + this.height
    );
    const opacity = this.active ? 1 : 0.3;
    gradient.addColorStop(0, `rgba(0, 255, 136, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(0, 200, 100, ${opacity})`);
    gradient.addColorStop(1, `rgba(0, 150, 80, ${opacity})`);

    ctx.fillStyle = gradient;
    Utils.drawRoundedRect(
      ctx,
      screenX,
      screenY,
      this.width,
      this.height,
      8,
      gradient
    );

    // Draw portal ring
    ctx.strokeStyle = this.active ? Colors.PORTAL : Colors.SWITCH_OFF;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(
      screenX + this.width / 2,
      screenY + this.height / 2,
      20,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // Draw particles
    this.particles.forEach((particle) => {
      const particleScreenX = particle.x - camera.x;
      const particleScreenY = particle.y - camera.y;

      ctx.fillStyle = `rgba(0, 255, 136, ${particle.life})`;
      ctx.fillRect(
        particleScreenX,
        particleScreenY,
        particle.size,
        particle.size
      );
    });

    // Draw status text
    if (!this.active) {
      Utils.drawTextWithOutline(
        ctx,
        "Collect all keys!",
        screenX + this.width / 2,
        screenY - 15,
        Colors.TEXT_SECONDARY,
        "#000",
        12
      );
    } else {
      Utils.drawTextWithOutline(
        ctx,
        "ENTER",
        screenX + this.width / 2,
        screenY - 15,
        Colors.PORTAL,
        "#000",
        14
      );
    }
  }

  setActive(active) {
    this.active = active;
  }

  onPlayerCollision(player) {
    if (this.active) {
      return { type: "levelComplete" };
    }
    return null;
  }
}

/**
 * Deadly Spike Trap
 */
class SpikeTrap extends GameObject {
  constructor(x, y, width) {
    super(x, y, width, 16, "spikes");
    this.hasGravity = false;
  }

  render(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Draw spikes
    ctx.fillStyle = Colors.DANGER;
    const spikeWidth = 16;
    const spikeCount = Math.floor(this.width / spikeWidth);

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = screenX + i * spikeWidth;

      ctx.beginPath();
      ctx.moveTo(spikeX, screenY + this.height);
      ctx.lineTo(spikeX + spikeWidth / 2, screenY);
      ctx.lineTo(spikeX + spikeWidth, screenY + this.height);
      ctx.closePath();
      ctx.fill();

      // Add outline
      ctx.strokeStyle = "#cc0000";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  onPlayerCollision(player) {
    return { type: "playerDeath", cause: "spikes" };
  }
}

/**
 * Falling Spike Trap
 * A ceiling-mounted spike trap that descends and kills the player
 */
class FallingSpikeTrap extends GameObject {
  constructor(x, y, width, speed = 2) {
    super(x, y, width, 32, "fallingSpikes");
    this.hasGravity = false;
    this.fallSpeed = speed;
    this.startY = y;
    this.maxFallDistance = 400; // Maximum distance it can fall
    this.isActive = false;
    this.activationDelay = 0;
    this.hasBeenActivated = false;
    this.warningTime = 1.0; // Time to show warning before falling
    this.warningTimer = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Check if player is nearby to activate
    if (!this.hasBeenActivated && this.shouldActivate()) {
      this.hasBeenActivated = true;
      this.warningTimer = this.warningTime;

      // Play warning sound
      if (window.audioManager) {
        window.audioManager.playWarning();
      }
    }

    // Handle warning phase
    if (this.warningTimer > 0) {
      this.warningTimer -= deltaTime;
      if (this.warningTimer <= 0) {
        this.isActive = true;
      }
    }

    // Fall when active
    if (this.isActive) {
      // Safari-optimized movement: direct pixel-per-second instead of FPS normalization
      this.y += this.fallSpeed * deltaTime * 200; // 200 pixels per second base speed

      // Stop falling if hit ground or max distance
      if (this.y >= this.startY + this.maxFallDistance) {
        this.y = this.startY + this.maxFallDistance;
        this.isActive = false;
      }
    }
  }

  shouldActivate() {
    // Check if player is within activation range
    const game = window.game;
    if (!game || !game.player) return false;

    const player = game.player;
    const distanceX = Math.abs(player.x - (this.x + this.width / 2));
    const distanceY = Math.abs(player.y - this.y);

    // Activate if player is within 200 pixels horizontally and below the trap
    return distanceX < 200 && player.y > this.y && distanceY < 300;
  }

  render(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Draw warning effect during warning phase
    if (this.warningTimer > 0) {
      const warningAlpha = (Math.sin(this.warningTimer * 10) + 1) * 0.5;
      ctx.fillStyle = `rgba(255, 0, 0, ${warningAlpha * 0.3})`;
      ctx.fillRect(
        screenX - 10,
        screenY - 10,
        this.width + 20,
        this.height + 20
      );

      // Warning text
      Utils.drawTextWithOutline(
        ctx,
        "DANGER!",
        screenX + this.width / 2,
        screenY - 20,
        Colors.DANGER,
        "#000",
        12
      );
    }

    // Draw the main trap body
    ctx.fillStyle = Colors.PLATFORM_EDGE;
    ctx.fillRect(screenX, screenY, this.width, this.height - 16);

    // Draw spikes at bottom
    ctx.fillStyle = Colors.DANGER;
    const spikeWidth = 16;
    const spikeCount = Math.floor(this.width / spikeWidth);

    for (let i = 0; i < spikeCount; i++) {
      const spikeX = screenX + i * spikeWidth;
      const spikeY = screenY + this.height - 16;

      ctx.beginPath();
      ctx.moveTo(spikeX, spikeY);
      ctx.lineTo(spikeX + spikeWidth / 2, spikeY + 16);
      ctx.lineTo(spikeX + spikeWidth, spikeY);
      ctx.closePath();
      ctx.fill();

      // Add outline
      ctx.strokeStyle = "#cc0000";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw chain or mechanism at the top
    ctx.fillStyle = "#666";
    ctx.fillRect(screenX + this.width / 2 - 2, screenY - 20, 4, 20);
  }

  onPlayerCollision(player) {
    if (this.isActive || this.warningTimer <= 0) {
      return { type: "playerDeath", cause: "falling spikes" };
    }
    return null;
  }

  reset() {
    this.y = this.startY;
    this.isActive = false;
    this.hasBeenActivated = false;
    this.warningTimer = 0;
  }
}
