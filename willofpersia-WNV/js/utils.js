/**
 * Utility Functions for Will of Persia
 * Contains helper functions for math, collision detection, and drawing
 */

// Math utilities
const Utils = {
  /**
   * Clamp a value between min and max
   */
  clamp: (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  },

  /**
   * Linear interpolation between two values
   */
  lerp: (start, end, factor) => {
    return start + (end - start) * factor;
  },

  /**
   * Check if two rectangles are colliding
   */
  rectCollision: (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  },

  /**
   * Check if a point is inside a rectangle
   */
  pointInRect: (point, rect) => {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  },

  /**
   * Get distance between two points
   */
  distance: (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Draw a rounded rectangle
   */
  drawRoundedRect: (
    ctx,
    x,
    y,
    width,
    height,
    radius,
    fillColor,
    strokeColor = null
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },

  /**
   * Draw a gradient rectangle
   */
  drawGradientRect: (
    ctx,
    x,
    y,
    width,
    height,
    color1,
    color2,
    direction = "vertical"
  ) => {
    const gradient =
      direction === "vertical"
        ? ctx.createLinearGradient(x, y, x, y + height)
        : ctx.createLinearGradient(x, y, x + width, y);

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  },

  /**
   * Draw text with outline
   */
  drawTextWithOutline: (
    ctx,
    text,
    x,
    y,
    fillColor,
    strokeColor,
    fontSize = 16
  ) => {
    ctx.font = `${fontSize}px Cinzel, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw outline
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);

    // Draw fill
    ctx.fillStyle = fillColor;
    ctx.fillText(text, x, y);
  },

  /**
   * Animate a value towards a target
   */
  smoothStep: (current, target, speed) => {
    const diff = target - current;
    return current + diff * speed;
  },

  /**
   * Generate a random number between min and max
   */
  random: (min, max) => {
    return Math.random() * (max - min) + min;
  },

  /**
   * Generate a random integer between min and max (inclusive)
   */
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Convert degrees to radians
   */
  degToRad: (degrees) => {
    return degrees * (Math.PI / 180);
  },

  /**
   * Convert radians to degrees
   */
  radToDeg: (radians) => {
    return radians * (180 / Math.PI);
  },
};

// Color constants for the game
const Colors = {
  PLAYER: "#d4af37",
  PLAYER_SHADOW: "#b8941f",
  PLATFORM: "#4a4a6a",
  PLATFORM_EDGE: "#6a6a8a",
  BACKGROUND_DARK: "#1e1e3f",
  BACKGROUND_LIGHT: "#2d2d5f",
  KEY: "#ffd700",
  KEY_GLOW: "#ffea00",
  PORTAL: "#00ff88",
  PORTAL_GLOW: "#00cc66",
  SWITCH_OFF: "#666666",
  SWITCH_ON: "#00ff00",
  DOOR_CLOSED: "#8b4513",
  DOOR_OPEN: "#228b22",
  DANGER: "#ff4444",
  TEXT_PRIMARY: "#d4af37",
  TEXT_SECONDARY: "#e6e6e6",
};

// Game constants
const GameConstants = {
  GRAVITY: 0.8,
  FRICTION: 0.85,
  JUMP_FORCE: -16,
  MOVE_SPEED: 5,
  PLAYER_SIZE: 32,
  TILE_SIZE: 32,
  CAMERA_SMOOTHNESS: 0.1,
};
