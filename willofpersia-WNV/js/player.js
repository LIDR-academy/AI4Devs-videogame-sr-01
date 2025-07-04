/**
 * Player Class for Will of Persia
 * Handles player movement, animations, and interactions
 * Follows Single Responsibility Principle
 */

class Player extends PhysicsBody {
  constructor(x, y) {
    super(x, y, GameConstants.PLAYER_SIZE, GameConstants.PLAYER_SIZE);

    // Player stats
    this.health = 3;
    this.maxHealth = 3;
    this.keysCollected = 0;
    this.alive = true;

    // Movement properties
    this.moveSpeed = GameConstants.MOVE_SPEED;
    this.jumpForce = GameConstants.JUMP_FORCE;
    this.coyoteTime = 0.1; // Time after leaving platform where player can still jump
    this.coyoteTimer = 0;
    this.jumpBufferTime = 0.1; // Time jump input is buffered
    this.jumpBuffer = 0;

    // Animation properties
    this.animationFrame = 0;
    this.animationSpeed = 0.15;
    this.currentAnimation = "idle";
    this.lastGroundedFrame = 0;

    // Visual effects
    this.squashStretch = { x: 1, y: 1 };
    this.landingEffect = 0;
    this.trailPositions = [];

    // Interaction
    this.nearbyInteractables = [];

    // Respawn point
    this.respawnPoint = { x: x, y: y };
  }

  /**
   * Update player state
   */
  update(deltaTime, input, physics) {
    if (!this.alive) return;

    // Update timers
    this.updateTimers(deltaTime);

    // Handle input
    this.handleInput(input, physics);

    // Apply physics
    physics.applyGravity(this);
    physics.applyFriction(this);

    // 🔧 FIX: Update position based on velocity!
    physics.updatePosition(this);

    // Update animation
    this.updateAnimation(deltaTime);

    // Update visual effects
    this.updateVisualEffects(deltaTime);

    // Update trail
    this.updateTrail();
  }

  /**
   * Update various timers
   */
  updateTimers(deltaTime) {
    if (this.coyoteTimer > 0) {
      this.coyoteTimer -= deltaTime;
    }

    if (this.jumpBuffer > 0) {
      this.jumpBuffer -= deltaTime;
    }

    if (this.landingEffect > 0) {
      this.landingEffect -= deltaTime * 3;
    }
  }

  /**
   * Handle player input
   */
  handleInput(input, physics) {
    // Horizontal movement
    const horizontalInput = input.getHorizontalInput();

    if (horizontalInput !== 0) {
      physics.applyMovement(this, horizontalInput, this.moveSpeed);
    }

    // Jump input buffering
    if (input.isJumpJustPressed()) {
      this.jumpBuffer = this.jumpBufferTime;
    }

    // Jump logic with coyote time and buffering
    if (this.jumpBuffer > 0 && (this.grounded || this.coyoteTimer > 0)) {
      const jumpSuccess = physics.applyJump(this, this.jumpForce);
      if (jumpSuccess) {
        this.jumpBuffer = 0;
        this.coyoteTimer = 0;
        this.addSquashStretch(1.2, 0.8); // Stretch vertically when jumping

        // Play jump sound
        if (window.audioManager) {
          window.audioManager.playJump();
        }
      }
    }

    // Variable jump height (shorter press = shorter jump)
    if (!input.isJumpPressed() && this.velocityY < 0) {
      this.velocityY *= 0.5;
    }
  }

  /**
   * Update animation state
   */
  updateAnimation(deltaTime) {
    this.animationFrame += this.animationSpeed;

    // Determine current animation
    if (!this.grounded) {
      this.currentAnimation = this.velocityY < 0 ? "jumping" : "falling";
    } else if (Math.abs(this.velocityX) > 0.5) {
      this.currentAnimation = "running";
    } else {
      this.currentAnimation = "idle";
    }

    // Landing effect
    if (
      this.grounded &&
      this.currentAnimation !== "jumping" &&
      this.currentAnimation !== "falling"
    ) {
      if (this.animationFrame - this.lastGroundedFrame > 5) {
        this.landingEffect = 1;
        this.addSquashStretch(0.8, 1.2); // Squash on landing
        this.lastGroundedFrame = this.animationFrame;
      }
    }
  }

  /**
   * Update visual effects
   */
  updateVisualEffects(deltaTime) {
    // Smooth squash and stretch back to normal
    this.squashStretch.x = Utils.lerp(this.squashStretch.x, 1, 0.2);
    this.squashStretch.y = Utils.lerp(this.squashStretch.y, 1, 0.2);

    // Update coyote time
    if (!this.grounded) {
      if (this.coyoteTimer <= 0 && this.wasGrounded) {
        this.coyoteTimer = this.coyoteTime;
      }
    }

    this.wasGrounded = this.grounded;
  }

  /**
   * Update movement trail
   */
  updateTrail() {
    // Add current position to trail
    this.trailPositions.unshift({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      alpha: 1,
    });

    // Update and remove old trail positions
    this.trailPositions = this.trailPositions.filter((pos, index) => {
      pos.alpha -= 0.1;
      return pos.alpha > 0 && index < 8;
    });
  }

  /**
   * Add squash and stretch effect
   */
  addSquashStretch(scaleX, scaleY) {
    this.squashStretch.x = scaleX;
    this.squashStretch.y = scaleY;
  }

  /**
   * Render the player
   */
  render(ctx, camera) {
    if (!this.alive) {
      return;
    }

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    // Draw a simple golden rectangle (the player)
    ctx.fillStyle = Colors.PLAYER; // Should be '#d4af37' (gold)
    ctx.fillRect(screenX, screenY, this.width, this.height);

    // Draw a border to make it more visible
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, this.width, this.height);

    // Draw simple eyes
    ctx.fillStyle = "#000";
    ctx.fillRect(screenX + 8, screenY + 8, 4, 4);
    ctx.fillRect(screenX + 20, screenY + 8, 4, 4);
  }

  /**
   * Render movement trail
   */
  renderTrail(ctx, camera) {
    this.trailPositions.forEach((pos) => {
      const screenX = pos.x - camera.x;
      const screenY = pos.y - camera.y;

      ctx.fillStyle = `rgba(212, 175, 55, ${pos.alpha * 0.3})`;
      ctx.fillRect(screenX - 2, screenY - 2, 4, 4);
    });
  }

  /**
   * Render player body
   */
  renderPlayerBody(ctx, screenX, screenY) {
    // Main body
    const bodyColor = Colors.PLAYER;
    const shadowColor = Colors.PLAYER_SHADOW;

    // Draw body with gradient
    Utils.drawGradientRect(
      ctx,
      screenX,
      screenY,
      this.width,
      this.height,
      bodyColor,
      shadowColor
    );

    // Draw body outline
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, this.width, this.height);

    // Animation-specific drawing
    switch (this.currentAnimation) {
      case "running":
        this.renderRunningAnimation(ctx, screenX, screenY);
        break;
      case "jumping":
        this.renderJumpingAnimation(ctx, screenX, screenY);
        break;
      case "falling":
        this.renderFallingAnimation(ctx, screenX, screenY);
        break;
      default:
        this.renderIdleAnimation(ctx, screenX, screenY);
    }
  }

  /**
   * Render player details (face, etc.)
   */
  renderPlayerDetails(ctx, screenX, screenY) {
    // Draw eyes
    ctx.fillStyle = "#fff";
    const eyeSize = 3;
    const eyeY = screenY + 8;

    if (this.facing === "right") {
      ctx.fillRect(screenX + 18, eyeY, eyeSize, eyeSize);
      ctx.fillRect(screenX + 24, eyeY, eyeSize, eyeSize);
    } else {
      ctx.fillRect(screenX + 5, eyeY, eyeSize, eyeSize);
      ctx.fillRect(screenX + 11, eyeY, eyeSize, eyeSize);
    }

    // Draw pupils
    ctx.fillStyle = "#000";
    if (this.facing === "right") {
      ctx.fillRect(screenX + 19, eyeY + 1, 1, 1);
      ctx.fillRect(screenX + 25, eyeY + 1, 1, 1);
    } else {
      ctx.fillRect(screenX + 6, eyeY + 1, 1, 1);
      ctx.fillRect(screenX + 12, eyeY + 1, 1, 1);
    }
  }

  /**
   * Render different animation states
   */
  renderIdleAnimation(ctx, screenX, screenY) {
    // Simple breathing effect
    const breathe = Math.sin(this.animationFrame * 2) * 0.5;
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(screenX + 8, screenY + 12 + breathe, 16, 8);
  }

  renderRunningAnimation(ctx, screenX, screenY) {
    // Add motion lines
    ctx.strokeStyle = Colors.PLAYER_SHADOW;
    ctx.lineWidth = 1;

    const motionOffset = Math.sin(this.animationFrame * 8) * 2;
    ctx.beginPath();
    ctx.moveTo(screenX - 5, screenY + 16 + motionOffset);
    ctx.lineTo(screenX, screenY + 16 + motionOffset);
    ctx.stroke();
  }

  renderJumpingAnimation(ctx, screenX, screenY) {
    // Add upward motion effect
    ctx.fillStyle = "rgba(212, 175, 55, 0.3)";
    ctx.fillRect(screenX + 12, screenY + this.height, 8, 4);
  }

  renderFallingAnimation(ctx, screenX, screenY) {
    // Add downward motion effect
    ctx.fillStyle = "rgba(212, 175, 55, 0.3)";
    ctx.fillRect(screenX + 12, screenY - 4, 8, 4);
  }

  /**
   * Render health display
   */
  renderHealth(ctx, camera) {
    const heartSize = 16;
    const heartSpacing = 20;
    const startX = 20;
    const startY = 50;

    for (let i = 0; i < this.maxHealth; i++) {
      const heartX = startX + i * heartSpacing;
      const filled = i < this.health;

      // Draw heart
      ctx.fillStyle = filled ? "#ff4444" : "#444444";

      ctx.beginPath();
      ctx.moveTo(heartX + 8, startY + 4);
      ctx.bezierCurveTo(
        heartX + 8,
        startY,
        heartX + 4,
        startY,
        heartX + 4,
        startY + 4
      );
      ctx.bezierCurveTo(heartX + 4, startY, heartX, startY, heartX, startY + 4);
      ctx.bezierCurveTo(
        heartX,
        startY + 8,
        heartX + 8,
        startY + 12,
        heartX + 8,
        startY + 12
      );
      ctx.bezierCurveTo(
        heartX + 8,
        startY + 12,
        heartX + 16,
        startY + 8,
        heartX + 16,
        startY + 4
      );
      ctx.bezierCurveTo(
        heartX + 16,
        startY,
        heartX + 12,
        startY,
        heartX + 12,
        startY + 4
      );
      ctx.bezierCurveTo(
        heartX + 12,
        startY,
        heartX + 8,
        startY,
        heartX + 8,
        startY + 4
      );
      ctx.fill();
    }
  }

  /**
   * Render interaction hints
   */
  renderInteractionHints(ctx, camera) {
    this.nearbyInteractables.forEach((obj) => {
      if (obj.type === "switch") {
        const screenX = obj.x - camera.x + obj.width / 2;
        const screenY = obj.y - camera.y - 10;

        Utils.drawTextWithOutline(
          ctx,
          "Press E",
          screenX,
          screenY,
          Colors.TEXT_PRIMARY,
          "#000",
          12
        );
      }
    });
  }

  /**
   * Handle collision with game objects
   */
  onCollisionWithObject(obj) {
    if (!this.alive || !obj.active) return null;

    const result = obj.onPlayerCollision(this);

    if (result) {
      switch (result.type) {
        case "keyCollected":
          this.keysCollected++;
          return result;

        case "playerDeath":
          this.takeDamage(this.health); // Kill player
          return result;

        case "levelComplete":
          return result;
      }
    }

    return result;
  }

  /**
   * Take damage
   */
  takeDamage(amount) {
    this.health -= amount;
    this.addSquashStretch(0.7, 1.3); // Damage effect

    if (this.health <= 0) {
      this.alive = false;

      // Play death laugh sound
      if (window.audioManager) {
        window.audioManager.playDeathLaugh();
      }
    } else {
      // Play damage sound if still alive
      if (window.audioManager) {
        window.audioManager.playDamage();
      }
    }
  }

  /**
   * Heal player
   */
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  /**
   * Reset player to respawn point
   */
  respawn() {
    this.x = this.respawnPoint.x;
    this.y = this.respawnPoint.y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.health = this.maxHealth;
    this.alive = true;
    this.grounded = false;
  }

  /**
   * Set respawn point
   */
  setRespawnPoint(x, y) {
    this.respawnPoint.x = x;
    this.respawnPoint.y = y;
  }

  /**
   * Check if player can interact with nearby objects
   */
  updateNearbyInteractables(objects) {
    this.nearbyInteractables = objects.filter((obj) => {
      if (!obj.active || obj.type !== "switch") return false;

      const distance = Utils.distance(this.getCenter(), obj.getCenter());
      return distance < 50;
    });
  }

  /**
   * Interact with nearby objects
   */
  interact() {
    const results = [];

    this.nearbyInteractables.forEach((obj) => {
      if (obj.type === "switch" && obj.activate) {
        const result = obj.activate();
        if (result) {
          results.push(result);
        }
      }
    });

    return results;
  }
}
