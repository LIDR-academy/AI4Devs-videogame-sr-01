const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const getMousePos = (canvas, e) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const deepCopy = (arr) => {
  return arr.map(row => [...row]);
};

class FPSCounter {
  constructor() {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fps = 0;
  }

  update() {
    this.frames++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
    }

    return this.fps;
  }
}

const formatNumber = (num) => {
  return num.toLocaleString();
};

const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const clearCanvas = (ctx, width, height) => {
  ctx.clearRect(0, 0, width, height);
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const isPointInRect = (x, y, rectX, rectY, rectWidth, rectHeight) => {
  return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;
};

const requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((callback) => setTimeout(callback, 1000 / 60));

const cancelAnimationFrame = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  clearTimeout;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    getMousePos,
    clamp,
    random,
    deepCopy,
    FPSCounter,
    formatNumber,
    createCanvas,
    clearCanvas,
    hexToRgb,
    rgbToHex,
    lerp,
    distance,
    isPointInRect
  };
}
