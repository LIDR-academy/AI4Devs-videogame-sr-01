class GameOfLife {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.grid = new Grid(50, 50);
    this.isRunning = false;
    this.generation = 0;
    this.speed = 5;
    this.cellSize = 10;
    this.lastTime = 0;
    this.animationId = null;
    this.fpsCounter = new FPSCounter();
    this.selectedPattern = PatternManager.get('single');
    this.isDragging = false;
    this.lastMousePos = { x: 0, y: 0 };
    this.patternPreview = {
      active: false,
      row: 0,
      col: 0,
      pattern: null
    };

    this.setupCanvas();
    this.setupEventListeners();
    this.setupControls();
    this.render();
    this.updateUI();
  }

  setupCanvas() {
    this.updateCanvasSize();
    this.canvas.style.cursor = 'none';
    this.canvas.classList.add('pattern-mode');
  }

  updateCanvasSize() {
    const containerWidth = this.canvas.parentElement.clientWidth;
    const maxWidth = Math.min(containerWidth - 40, 800);
    const maxHeight = 600;

    this.cellSize = Math.min(
      Math.floor(maxWidth / this.grid.width),
      Math.floor(maxHeight / this.grid.height)
    );

    this.canvas.width = this.grid.width * this.cellSize;
    this.canvas.height = this.grid.height * this.cellSize;
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.canvas.addEventListener('mouseenter', this.handleMouseEnter.bind(this));

    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.addEventListener('click', this.handleContainerClick.bind(this));
    canvasContainer.addEventListener('mousemove', this.handleContainerMouseMove.bind(this));
    canvasContainer.addEventListener('mouseleave', () => {
      if (this.patternPreview.active) {
        this.patternPreview.active = false;
        this.render();
      }
    });

    window.addEventListener('resize', debounce(() => {
      this.updateCanvasSize();
      this.render();
    }, 250));
  }

  setupControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stepBtn = document.getElementById('stepBtn');
    const randomBtn = document.getElementById('randomBtn');
    const clearBtn = document.getElementById('clearBtn');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const gridSizeSelect = document.getElementById('gridSize');
    const patternSelect = document.getElementById('patternSelect');

    playBtn.addEventListener('click', () => this.play());
    pauseBtn.addEventListener('click', () => this.pause());
    stepBtn.addEventListener('click', () => this.step());
    randomBtn.addEventListener('click', () => this.random());
    clearBtn.addEventListener('click', () => this.clear());

    speedSlider.addEventListener('input', (e) => {
      this.speed = parseInt(e.target.value);
      speedValue.textContent = this.speed;
    });

    gridSizeSelect.addEventListener('change', (e) => {
      const size = parseInt(e.target.value);
      this.resizeGrid(size, size);
    });

    patternSelect.addEventListener('change', (e) => {
      const patternName = e.target.value;
      this.selectedPattern = patternName ? PatternManager.get(patternName) : null;
      this.canvas.style.cursor = this.selectedPattern ? 'none' : 'crosshair';

      if (this.selectedPattern) {
        this.canvas.classList.add('pattern-mode');
      } else {
        this.canvas.classList.remove('pattern-mode');
        this.patternPreview.active = false;
        this.render();
      }
    });
  }

  handleCanvasClick(e) {
    if (this.isRunning) {
      this.pause();
    }

    const pos = getMousePos(this.canvas, e);
    const col = Math.floor(pos.x / this.cellSize);
    const row = Math.floor(pos.y / this.cellSize);

    if (this.selectedPattern && this.selectedPattern.name === "Single Cell") {
      this.grid.toggleCell(row, col);
    } else if (this.selectedPattern) {
      this.placePattern(row, col);
    } else {
      this.grid.toggleCell(row, col);
    }

    this.render();
    this.updateUI();
  }

  handleMouseDown(e) {
    if (this.selectedPattern && this.selectedPattern.name !== "Single Cell") return;

    if (this.isRunning) {
      this.pause();
    }

    this.isDragging = true;
    const pos = getMousePos(this.canvas, e);
    this.lastMousePos = pos;

    const col = Math.floor(pos.x / this.cellSize);
    const row = Math.floor(pos.y / this.cellSize);

    if (this.selectedPattern && this.selectedPattern.name === "Single Cell") {
      this.dragValue = 1;
    } else {
      const currentCell = this.grid.getCell(row, col);
      this.dragValue = currentCell ? 0 : 1;
    }

    this.grid.setCell(row, col, this.dragValue);
    this.render();
    this.updateUI();
  }

  handleMouseMove(e) {
    const pos = getMousePos(this.canvas, e);
    let col = Math.floor(pos.x / this.cellSize);
    let row = Math.floor(pos.y / this.cellSize);

    if (this.selectedPattern && this.selectedPattern.name !== "Single Cell") {
      this.patternPreview.active = true;
      this.patternPreview.row = row;
      this.patternPreview.col = col;
      this.patternPreview.pattern = this.selectedPattern;
      this.render();
    } else if (this.selectedPattern && this.selectedPattern.name === "Single Cell") {
      if (this.isDragging) {
        if (pos.x >= 0 && pos.x < this.canvas.width && pos.y >= 0 && pos.y < this.canvas.height) {
          col = Math.max(0, Math.min(col, this.grid.width - 1));
          row = Math.max(0, Math.min(row, this.grid.height - 1));
          this.grid.setCell(row, col, this.dragValue);
          this.render();
          this.updateUI();
        }
      } else {
        this.patternPreview.active = true;
        this.patternPreview.row = row;
        this.patternPreview.col = col;
        this.patternPreview.pattern = this.selectedPattern;
        this.render();
      }
    } else if (!this.isDragging) {
      if (this.patternPreview.active) {
        this.patternPreview.active = false;
        this.render();
      }
    } else {
      if (pos.x >= 0 && pos.x < this.canvas.width && pos.y >= 0 && pos.y < this.canvas.height) {
        col = Math.max(0, Math.min(col, this.grid.width - 1));
        row = Math.max(0, Math.min(row, this.grid.height - 1));
        this.grid.setCell(row, col, this.dragValue);
        this.render();
        this.updateUI();
      }
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  handleMouseEnter() {
    if (this.selectedPattern) {
      this.patternPreview.active = true;
      this.render();
    }
  }

  handleMouseLeave() {
    this.isDragging = false;
  } placePattern(row, col) {
    if (!this.selectedPattern) return;

    const patternSize = PatternManager.getSize(this.selectedPattern);
    const startRow = row - Math.floor(patternSize.height / 2);
    const startCol = col - Math.floor(patternSize.width / 2);

    if (this.selectedPattern.pattern === "random") {
      this.grid.fillRandom(0.3);
      return;
    }

    for (let pRow = 0; pRow < this.selectedPattern.pattern.length; pRow++) {
      for (let pCol = 0; pCol < this.selectedPattern.pattern[pRow].length; pCol++) {
        if (this.selectedPattern.pattern[pRow][pCol]) {
          let gridRow = startRow + pRow;
          let gridCol = startCol + pCol;

          gridRow = ((gridRow % this.grid.height) + this.grid.height) % this.grid.height;
          gridCol = ((gridCol % this.grid.width) + this.grid.width) % this.grid.width;

          this.grid.setCell(gridRow, gridCol, 1);
        }
      }
    }
  }

  play() {
    if (this.isRunning) return;

    this.isRunning = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;

    this.lastTime = performance.now();
    this.gameLoop();
  }

  pause() {
    this.isRunning = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.render();
  }

  step() {
    this.grid.nextGeneration();
    this.generation++;

    if (this.grid.isEmpty()) {
      this.pause();
    }

    this.render();
    this.updateUI();
  }

  random() {
    this.pause();
    this.grid.fillRandom(0.3);
    this.generation = 0;
    this.render();
    this.updateUI();
  }

  clear() {
    this.pause();
    this.grid.clear();
    this.generation = 0;
    this.render();
    this.updateUI();
  }

  resizeGrid(width, height) {
    this.pause();
    this.grid.resize(width, height);
    this.updateCanvasSize();
    this.render();
    this.updateUI();
  }

  nextGeneration() {
    if (!this.isRunning) {
      return;
    }

    this.grid.nextGeneration();
    this.generation++;

    if (this.grid.isEmpty()) {
      this.pause();
    }
  }

  gameLoop() {
    if (!this.isRunning) {
      this.animationId = null;
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    const targetDelta = 1000 / this.speed;

    if (deltaTime >= targetDelta) {
      this.nextGeneration();
      this.render();
      this.updateUI();
      this.lastTime = currentTime;
    }

    if (this.isRunning) {
      this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawCells();
    this.drawPatternPreview();

    if (this.isRunning) {
      const fps = this.fpsCounter.update();
      document.getElementById('fpsCount').textContent = fps;
    }
  }

  drawGrid() {
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 0.5;

    for (let i = 0; i <= this.grid.width; i++) {
      const x = i * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let i = 0; i <= this.grid.height; i++) {
      const y = i * this.cellSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawCells() {
    this.ctx.fillStyle = '#2c3e50';
    let drawnCells = 0;

    for (let row = 0; row < this.grid.height; row++) {
      for (let col = 0; col < this.grid.width; col++) {
        const cellValue = this.grid.getCell(row, col);
        if (cellValue) {
          const x = col * this.cellSize;
          const y = row * this.cellSize;
          this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
          drawnCells++;
        }
      }
    }
  }

  drawPatternPreview() {
    if (!this.patternPreview.active || !this.patternPreview.pattern) return;

    const pattern = this.patternPreview.pattern;
    const patternSize = PatternManager.getSize(pattern);
    const startRow = this.patternPreview.row - Math.floor(patternSize.height / 2);
    const startCol = this.patternPreview.col - Math.floor(patternSize.width / 2);

    if (pattern.pattern === "random") return;

    this.ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
    this.ctx.strokeStyle = '#3498db';
    this.ctx.lineWidth = 2;

    for (let row = 0; row < pattern.pattern.length; row++) {
      for (let col = 0; col < pattern.pattern[row].length; col++) {
        if (pattern.pattern[row][col]) {
          let gridRow = startRow + row;
          let gridCol = startCol + col;

          gridRow = ((gridRow % this.grid.height) + this.grid.height) % this.grid.height;
          gridCol = ((gridCol % this.grid.width) + this.grid.width) % this.grid.width;

          const x = gridCol * this.cellSize;
          const y = gridRow * this.cellSize;

          this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
          this.ctx.strokeRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
        }
      }
    }

    this.ctx.fillStyle = 'rgba(52, 152, 219, 0.1)';
    this.ctx.strokeStyle = '#3498db';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);

    for (let row = 0; row < pattern.pattern.length; row++) {
      for (let col = 0; col < pattern.pattern[row].length; col++) {
        let gridRow = startRow + row;
        let gridCol = startCol + col;

        gridRow = ((gridRow % this.grid.height) + this.grid.height) % this.grid.height;
        gridCol = ((gridCol % this.grid.width) + this.grid.width) % this.grid.width;

        const x = gridCol * this.cellSize;
        const y = gridRow * this.cellSize;

        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      }
    }

    this.ctx.setLineDash([]);
  }

  updateUI() {
    document.getElementById('generationCount').textContent = formatNumber(this.generation);
    document.getElementById('populationCount').textContent = formatNumber(this.grid.getPopulation());
  }

  getState() {
    return {
      cells: this.grid.toArray(),
      generation: this.generation,
      isRunning: this.isRunning,
      speed: this.speed,
      gridSize: { width: this.grid.width, height: this.grid.height }
    };
  }

  setState(state) {
    this.pause();
    this.grid.fromArray(state.cells);
    this.generation = state.generation || 0;
    this.speed = state.speed || 5;

    if (state.gridSize) {
      this.grid.resize(state.gridSize.width, state.gridSize.height);
    }

    this.updateCanvasSize();
    this.render();
    this.updateUI();

    document.getElementById('speedSlider').value = this.speed;
    document.getElementById('speedValue').textContent = this.speed;
  }

  handleContainerMouseMove(e) {
    if (!this.selectedPattern) return;

    const canvasRect = this.canvas.getBoundingClientRect();
    const containerRect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    let col = Math.floor(x / this.cellSize);
    let row = Math.floor(y / this.cellSize);

    this.patternPreview.active = true;
    this.patternPreview.row = row;
    this.patternPreview.col = col;
    this.patternPreview.pattern = this.selectedPattern;
    this.render();
  }

  handleContainerClick(e) {
    if (e.target === this.canvas) return;

    if (!this.selectedPattern) return;

    if (this.isRunning) {
      this.pause();
    }

    const canvasRect = this.canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    if (this.selectedPattern.name === "Single Cell") {
      const wrappedCol = ((col % this.grid.width) + this.grid.width) % this.grid.width;
      const wrappedRow = ((row % this.grid.height) + this.grid.height) % this.grid.height;
      this.grid.toggleCell(wrappedRow, wrappedCol);
    } else {
      this.placePattern(row, col);
    }

    this.render();
    this.updateUI();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new GameOfLife();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameOfLife;
}
