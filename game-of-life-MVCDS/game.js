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
    this.selectedPattern = null;
    this.isDragging = false;
    this.lastMousePos = { x: 0, y: 0 };

    this.setupCanvas();
    this.setupEventListeners();
    this.setupControls();
    this.render();
    this.updateUI();
  }

  setupCanvas() {
    this.updateCanvasSize();
    this.canvas.style.cursor = 'crosshair';
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
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));

    window.addEventListener('resize', debounce(() => {
      this.updateCanvasSize();
      this.render();
    }, 250));
  }

  setupControls() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stepBtn = document.getElementById('stepBtn');
    const resetBtn = document.getElementById('resetBtn');
    const clearBtn = document.getElementById('clearBtn');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const gridSizeSelect = document.getElementById('gridSize');
    const patternSelect = document.getElementById('patternSelect');

    playBtn.addEventListener('click', () => this.play());
    pauseBtn.addEventListener('click', () => this.pause());
    stepBtn.addEventListener('click', () => this.step());
    resetBtn.addEventListener('click', () => this.reset());
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
      this.canvas.style.cursor = this.selectedPattern ? 'copy' : 'crosshair';
    });
  }

  handleCanvasClick(e) {
    const pos = getMousePos(this.canvas, e);
    const col = Math.floor(pos.x / this.cellSize);
    const row = Math.floor(pos.y / this.cellSize);

    if (this.selectedPattern) {
      this.placePattern(row, col);
    } else {
      this.grid.toggleCell(row, col);
    }

    this.render();
    this.updateUI();
  }

  handleMouseDown(e) {
    if (this.selectedPattern) return;

    this.isDragging = true;
    const pos = getMousePos(this.canvas, e);
    this.lastMousePos = pos;

    const col = Math.floor(pos.x / this.cellSize);
    const row = Math.floor(pos.y / this.cellSize);
    const currentCell = this.grid.getCell(row, col);
    this.dragValue = currentCell ? 0 : 1;

    this.grid.setCell(row, col, this.dragValue);
    this.render();
    this.updateUI();
  }

  handleMouseMove(e) {
    if (!this.isDragging || this.selectedPattern) return;

    const pos = getMousePos(this.canvas, e);
    const col = Math.floor(pos.x / this.cellSize);
    const row = Math.floor(pos.y / this.cellSize);

    this.grid.setCell(row, col, this.dragValue);
    this.render();
    this.updateUI();
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  placePattern(row, col) {
    if (!this.selectedPattern) return;

    const patternSize = PatternManager.getSize(this.selectedPattern);
    const startRow = Math.max(0, row - Math.floor(patternSize.height / 2));
    const startCol = Math.max(0, col - Math.floor(patternSize.width / 2));

    this.grid.cells = PatternManager.place(this.grid.cells, this.selectedPattern, startRow, startCol);
  }

  play() {
    if (this.isRunning) return;

    this.isRunning = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;

    this.gameLoop();
  }

  pause() {
    this.isRunning = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  step() {
    this.nextGeneration();
    this.render();
    this.updateUI();
  }

  reset() {
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
    this.grid.nextGeneration();
    this.generation++;

    if (this.grid.isEmpty()) {
      this.pause();
    }
  }

  gameLoop() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    const targetDelta = 1000 / this.speed;

    if (deltaTime >= targetDelta) {
      this.nextGeneration();
      this.render();
      this.updateUI();
      this.lastTime = currentTime;
    }

    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawCells();

    const fps = this.fpsCounter.update();
    document.getElementById('fpsCount').textContent = fps;
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

    for (let row = 0; row < this.grid.height; row++) {
      for (let col = 0; col < this.grid.width; col++) {
        if (this.grid.getCell(row, col)) {
          const x = col * this.cellSize;
          const y = row * this.cellSize;

          this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
        }
      }
    }
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new GameOfLife();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameOfLife;
}
