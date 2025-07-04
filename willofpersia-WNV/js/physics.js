/**
 * Physics Engine for Will of Persia
 * Handles gravity, collisions, and movement calculations
 * Follows Open/Closed Principle - easy to extend with new physics behaviors
 */

class PhysicsEngine {
  constructor() {
    this.gravity = GameConstants.GRAVITY;
    this.friction = GameConstants.FRICTION;
  }

  /**
   * Apply gravity to an entity
   */
  applyGravity(entity) {
    if (!entity.grounded && entity.hasGravity !== false) {
      entity.velocityY += this.gravity;
    }
  }

  /**
   * Apply friction to an entity
   */
  applyFriction(entity) {
    if (entity.grounded) {
      entity.velocityX *= this.friction;
    }
  }

  /**
   * Update entity position based on velocity
   */
  updatePosition(entity) {
    entity.x += entity.velocityX;
    entity.y += entity.velocityY;
  }

  /**
   * Check collision between entity and platforms
   */
  checkPlatformCollisions(entity, platforms) {
    entity.grounded = false;

    for (let platform of platforms) {
      if (this.checkEntityPlatformCollision(entity, platform)) {
        this.resolveEntityPlatformCollision(entity, platform);
      }
    }
  }

  /**
   * Check if entity collides with a specific platform
   */
  checkEntityPlatformCollision(entity, platform) {
    return Utils.rectCollision(
      { x: entity.x, y: entity.y, width: entity.width, height: entity.height },
      {
        x: platform.x,
        y: platform.y,
        width: platform.width,
        height: platform.height,
      }
    );
  }

  /**
   * Resolve collision between entity and platform
   */
  resolveEntityPlatformCollision(entity, platform) {
    const entityRect = {
      x: entity.x,
      y: entity.y,
      width: entity.width,
      height: entity.height,
    };
    const platformRect = {
      x: platform.x,
      y: platform.y,
      width: platform.width,
      height: platform.height,
    };

    // Calculate overlap on each axis
    const overlapX = Math.min(
      entityRect.x + entityRect.width - platformRect.x,
      platformRect.x + platformRect.width - entityRect.x
    );
    const overlapY = Math.min(
      entityRect.y + entityRect.height - platformRect.y,
      platformRect.y + platformRect.height - entityRect.y
    );

    // Resolve collision based on smallest overlap
    if (overlapX < overlapY) {
      // Horizontal collision
      if (entity.x < platform.x) {
        // Hit from left
        entity.x = platform.x - entity.width;
      } else {
        // Hit from right
        entity.x = platform.x + platform.width;
      }
      entity.velocityX = 0;
    } else {
      // Vertical collision
      if (entity.y < platform.y) {
        // Hit from above (landing on platform)
        entity.y = platform.y - entity.height;
        entity.velocityY = 0;
        entity.grounded = true;

        // If platform is moving, move entity with it
        if (platform.velocityX !== undefined) {
          entity.x += platform.velocityX;
        }
      } else {
        // Hit from below (hitting ceiling)
        entity.y = platform.y + platform.height;
        entity.velocityY = 0;
      }
    }
  }

  /**
   * Check collision between two entities
   */
  checkEntityCollision(entity1, entity2) {
    return Utils.rectCollision(
      {
        x: entity1.x,
        y: entity1.y,
        width: entity1.width,
        height: entity1.height,
      },
      {
        x: entity2.x,
        y: entity2.y,
        width: entity2.width,
        height: entity2.height,
      }
    );
  }

  /**
   * Check if entity is within world bounds
   */
  checkWorldBounds(entity, worldWidth, worldHeight) {
    let collision = false;

    // Left boundary
    if (entity.x < 0) {
      entity.x = 0;
      entity.velocityX = 0;
      collision = true;
    }

    // Right boundary
    if (entity.x + entity.width > worldWidth) {
      entity.x = worldWidth - entity.width;
      entity.velocityX = 0;
      collision = true;
    }

    // Top boundary
    if (entity.y < 0) {
      entity.y = 0;
      entity.velocityY = 0;
      collision = true;
    }

    // Bottom boundary (usually death zone)
    if (entity.y > worldHeight) {
      collision = true;
    }

    return collision;
  }

  /**
   * Apply movement input to entity
   */
  applyMovement(entity, horizontalInput, moveSpeed) {
    if (horizontalInput !== 0) {
      entity.velocityX = horizontalInput * moveSpeed;
      entity.facing = horizontalInput > 0 ? "right" : "left";
    }
  }

  /**
   * Apply jump force to entity
   */
  applyJump(entity, jumpForce) {
    if (entity.grounded) {
      entity.velocityY = jumpForce;
      entity.grounded = false;
      return true; // Jump successful
    }
    return false; // Jump failed
  }

  /**
   * Check if entity can reach a target position
   */
  canReachPosition(entity, targetX, targetY, platforms) {
    // Simple raycast to check if path is clear
    const steps = 10;
    const deltaX = (targetX - entity.x) / steps;
    const deltaY = (targetY - entity.y) / steps;

    for (let i = 1; i <= steps; i++) {
      const checkX = entity.x + deltaX * i;
      const checkY = entity.y + deltaY * i;

      const testEntity = {
        x: checkX,
        y: checkY,
        width: entity.width,
        height: entity.height,
      };

      for (let platform of platforms) {
        if (this.checkEntityPlatformCollision(testEntity, platform)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Get entities within a certain distance
   */
  getEntitiesInRange(centerEntity, entities, range) {
    return entities.filter((entity) => {
      if (entity === centerEntity) return false;

      const distance = Utils.distance(
        {
          x: centerEntity.x + centerEntity.width / 2,
          y: centerEntity.y + centerEntity.height / 2,
        },
        { x: entity.x + entity.width / 2, y: entity.y + entity.height / 2 }
      );

      return distance <= range;
    });
  }

  /**
   * Calculate velocity needed to reach a target position
   */
  calculateVelocityToTarget(entity, targetX, targetY, speed) {
    const deltaX = targetX - (entity.x + entity.width / 2);
    const deltaY = targetY - (entity.y + entity.height / 2);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance === 0) {
      return { velocityX: 0, velocityY: 0 };
    }

    return {
      velocityX: (deltaX / distance) * speed,
      velocityY: (deltaY / distance) * speed,
    };
  }

  /**
   * Check if entity is on moving platform
   */
  getMovingPlatform(entity, platforms) {
    for (let platform of platforms) {
      if (platform.isMoving && entity.grounded) {
        const onPlatform =
          entity.x + entity.width > platform.x &&
          entity.x < platform.x + platform.width &&
          entity.y + entity.height <= platform.y + 5; // Small tolerance

        if (onPlatform) {
          return platform;
        }
      }
    }
    return null;
  }
}

/**
 * Physics body interface for entities
 */
class PhysicsBody {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.grounded = false;
    this.facing = "right";
    this.hasGravity = true;
  }

  /**
   * Get center position
   */
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
  }

  /**
   * Get bounds as rectangle object
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Set position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add velocity
   */
  addVelocity(vx, vy) {
    this.velocityX += vx;
    this.velocityY += vy;
  }

  /**
   * Set velocity
   */
  setVelocity(vx, vy) {
    this.velocityX = vx;
    this.velocityY = vy;
  }
}
