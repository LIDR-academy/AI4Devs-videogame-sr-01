/**
 * Input Handler for Will of Persia
 * Manages keyboard input and provides clean interface for game controls
 * Follows Single Responsibility Principle
 */

class InputHandler {
  constructor() {
    this.keys = {};
    this.previousKeys = {};

    // Mobile touch states
    this.touchControls = {
      left: false,
      right: false,
      jump: false,
      action: false,
    };
    this.previousTouchControls = {
      left: false,
      right: false,
      jump: false,
      action: false,
    };

    this.setupEventListeners();
    this.setupMobileControls();
  }

  /**
   * Initialize event listeners
   */
  setupEventListeners() {
    // Keyboard events
    document.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      e.preventDefault();
    });

    document.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      e.preventDefault();
    });

    // Handle window focus/blur to prevent stuck keys
    window.addEventListener("blur", () => {
      this.keys = {};
    });

    // Prevent arrow keys and space from scrolling the page
    window.addEventListener("keydown", (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    });
  }

  setupMobileControls() {
    // Only setup mobile controls if on mobile device
    if (typeof window.isMobile === "undefined" || !window.isMobile) {
      return;
    }

    // Get mobile control buttons
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");
    const jumpBtn = document.getElementById("jumpBtn");
    const actionBtn = document.getElementById("actionBtn");

    // Left button
    if (leftBtn) {
      leftBtn.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.touchControls.left = true;
        },
        { passive: false }
      );

      leftBtn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          this.touchControls.left = false;
        },
        { passive: false }
      );

      leftBtn.addEventListener(
        "touchcancel",
        (e) => {
          e.preventDefault();
          this.touchControls.left = false;
        },
        { passive: false }
      );
    }

    // Right button
    if (rightBtn) {
      rightBtn.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.touchControls.right = true;
        },
        { passive: false }
      );

      rightBtn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          this.touchControls.right = false;
        },
        { passive: false }
      );

      rightBtn.addEventListener(
        "touchcancel",
        (e) => {
          e.preventDefault();
          this.touchControls.right = false;
        },
        { passive: false }
      );
    }

    // Jump button
    if (jumpBtn) {
      jumpBtn.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.touchControls.jump = true;
        },
        { passive: false }
      );

      jumpBtn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          this.touchControls.jump = false;
        },
        { passive: false }
      );

      jumpBtn.addEventListener(
        "touchcancel",
        (e) => {
          e.preventDefault();
          this.touchControls.jump = false;
        },
        { passive: false }
      );
    }

    // Action button
    if (actionBtn) {
      actionBtn.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.touchControls.action = true;
        },
        { passive: false }
      );

      actionBtn.addEventListener(
        "touchend",
        (e) => {
          e.preventDefault();
          this.touchControls.action = false;
        },
        { passive: false }
      );

      actionBtn.addEventListener(
        "touchcancel",
        (e) => {
          e.preventDefault();
          this.touchControls.action = false;
        },
        { passive: false }
      );
    }
  }

  /**
   * Update previous keys state (call this at the end of each frame)
   */
  update() {
    this.previousKeys = { ...this.keys };
    this.previousTouchControls = { ...this.touchControls };
  }

  /**
   * Check if a key is currently pressed
   */
  isPressed(keyCode) {
    return !!this.keys[keyCode];
  }

  /**
   * Check if a key was just pressed this frame
   */
  isJustPressed(keyCode) {
    return !!this.keys[keyCode] && !this.previousKeys[keyCode];
  }

  /**
   * Get horizontal input (-1 left, 0 none, 1 right)
   */
  getHorizontalInput() {
    let horizontal = 0;

    // Keyboard input
    if (this.isPressed("ArrowLeft") || this.isPressed("KeyA")) {
      horizontal -= 1;
    }
    if (this.isPressed("ArrowRight") || this.isPressed("KeyD")) {
      horizontal += 1;
    }

    // Mobile touch input
    if (this.touchControls.left) {
      horizontal -= 1;
    }
    if (this.touchControls.right) {
      horizontal += 1;
    }

    return horizontal;
  }

  /**
   * Check if jump is currently pressed
   */
  isJumpPressed() {
    return (
      this.isPressed("Space") ||
      this.isPressed("ArrowUp") ||
      this.isPressed("KeyW") ||
      this.touchControls.jump
    );
  }

  /**
   * Check if jump was just pressed
   */
  isJumpJustPressed() {
    const keyboardJump =
      this.isJustPressed("Space") ||
      this.isJustPressed("ArrowUp") ||
      this.isJustPressed("KeyW");
    const touchJump =
      this.touchControls.jump && !this.previousTouchControls.jump;
    return keyboardJump || touchJump;
  }

  /**
   * Check if action is just pressed
   */
  isActionJustPressed() {
    const keyboardAction =
      this.isJustPressed("KeyE") || this.isJustPressed("Enter");
    const touchAction =
      this.touchControls.action && !this.previousTouchControls.action;
    return keyboardAction || touchAction;
  }

  /**
   * Check if restart is just pressed
   */
  isRestartJustPressed() {
    return this.isJustPressed("KeyR");
  }

  /**
   * Reset all key states
   */
  reset() {
    this.keys = {};
    this.previousKeys = {};
    this.touchControls = {
      left: false,
      right: false,
      jump: false,
      action: false,
    };
    this.previousTouchControls = {
      left: false,
      right: false,
      jump: false,
      action: false,
    };
  }

  /**
   * Get debug info for input state
   */
  getDebugInfo() {
    const activeKeys = Object.keys(this.keys).filter((key) => this.keys[key]);
    return {
      activeKeys,
      horizontal: this.getHorizontalInput(),
      jumping: this.isJumpPressed(),
      action: this.isPressed("KeyE") || this.isPressed("Enter"),
    };
  }
}

// Input key mappings for reference
const KeyMappings = {
  MOVE_LEFT: ["ArrowLeft", "KeyA"],
  MOVE_RIGHT: ["ArrowRight", "KeyD"],
  JUMP: ["Space", "ArrowUp", "KeyW"],
  ACTION: ["KeyE", "Enter"],
  PAUSE: ["Escape", "KeyP"],
  RESTART: ["KeyR"],
};
