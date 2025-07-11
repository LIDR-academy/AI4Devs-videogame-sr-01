const PATTERNS = {
  single: {
    name: "Single Cell",
    description: "A single cell - basic building block",
    pattern: [
      [1]
    ]
  },

  glider: {
    name: "Glider",
    description: "A small spaceship that moves diagonally",
    pattern: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ]
  },

  blinker: {
    name: "Blinker",
    description: "A simple oscillator with period 2",
    pattern: [
      [1, 1, 1]
    ]
  },

  toad: {
    name: "Toad",
    description: "An oscillator with period 2",
    pattern: [
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ]
  },

  beacon: {
    name: "Beacon",
    description: "An oscillator with period 2",
    pattern: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    ]
  },

  pulsar: {
    name: "Pulsar",
    description: "An oscillator with period 3",
    pattern: [
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
    ]
  },

  gosperGun: {
    name: "Gosper Glider Gun",
    description: "A gun that shoots gliders",
    pattern: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },

  block: {
    name: "Block",
    description: "A still life - remains unchanged",
    pattern: [
      [1, 1],
      [1, 1]
    ]
  },

  beehive: {
    name: "Beehive",
    description: "A still life - remains unchanged",
    pattern: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0]
    ]
  },

  loaf: {
    name: "Loaf",
    description: "A still life - remains unchanged",
    pattern: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0]
    ]
  },

  boat: {
    name: "Boat",
    description: "A still life - remains unchanged",
    pattern: [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0]
    ]
  },

  lightweight: {
    name: "Lightweight Spaceship",
    description: "A spaceship that moves horizontally",
    pattern: [
      [1, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 1]
    ]
  },

  pentadecathlon: {
    name: "Pentadecathlon",
    description: "An oscillator with period 15",
    pattern: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },

  random: {
    name: "Random",
    description: "Fill grid with random cells",
    pattern: "random"
  }
};

const PatternManager = {
  get: (name) => {
    return PATTERNS[name] || null;
  },

  getAll: () => {
    return Object.keys(PATTERNS).map(key => ({
      key,
      ...PATTERNS[key]
    }));
  },

  place: (grid, pattern, startRow, startCol) => {
    if (!pattern || !pattern.pattern) return grid;

    const newGrid = deepCopy(grid);
    const patternData = pattern.pattern;

    if (patternData === "random") {
      for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          newGrid[row][col] = Math.random() < 0.3 ? 1 : 0;
        }
      }
      return newGrid;
    }

    for (let row = 0; row < patternData.length; row++) {
      for (let col = 0; col < patternData[row].length; col++) {
        const gridRow = startRow + row;
        const gridCol = startCol + col;

        if (gridRow >= 0 && gridRow < newGrid.length &&
          gridCol >= 0 && gridCol < newGrid[gridRow].length) {
          newGrid[gridRow][gridCol] = patternData[row][col];
        }
      }
    }

    return newGrid;
  },

  rotate: (pattern) => {
    if (!pattern || !pattern.pattern || pattern.pattern === "random") return pattern;

    const originalPattern = pattern.pattern;
    const rows = originalPattern.length;
    const cols = originalPattern[0].length;
    const rotatedPattern = [];

    for (let col = 0; col < cols; col++) {
      rotatedPattern[col] = [];
      for (let row = rows - 1; row >= 0; row--) {
        rotatedPattern[col][rows - 1 - row] = originalPattern[row][col];
      }
    }

    return {
      ...pattern,
      pattern: rotatedPattern
    };
  },

  flip: (pattern) => {
    if (!pattern || !pattern.pattern || pattern.pattern === "random") return pattern;

    const flippedPattern = pattern.pattern.map(row => [...row].reverse());

    return {
      ...pattern,
      pattern: flippedPattern
    };
  },

  getSize: (pattern) => {
    if (!pattern || !pattern.pattern || pattern.pattern === "random") {
      return { width: 0, height: 0 };
    }

    return {
      width: pattern.pattern[0].length,
      height: pattern.pattern.length
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PATTERNS, PatternManager };
}
