class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this._cells = this.createEmptyGrid();
    this.previousCells = this.createEmptyGrid();
  }

  get cells() {
    return this._cells;
  }

  set cells(newCells) {
    this._cells = newCells;
  }

  createEmptyGrid() {
    return Array(this.height).fill(null).map(() => Array(this.width).fill(0));
  }

  clear() {
    this.cells = this.createEmptyGrid();
    this.previousCells = this.createEmptyGrid();
  }

  resize(width, height) {
    const oldCells = this.cells;
    this.width = width;
    this.height = height;
    this.cells = this.createEmptyGrid();
    this.previousCells = this.createEmptyGrid();

    const minWidth = Math.min(width, oldCells[0]?.length || 0);
    const minHeight = Math.min(height, oldCells.length);

    for (let row = 0; row < minHeight; row++) {
      for (let col = 0; col < minWidth; col++) {
        this.cells[row][col] = oldCells[row][col];
      }
    }
  }

  getCell(row, col) {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      return 0;
    }
    const value = this.cells[row][col];

    return value;
  }

  setCell(row, col, value) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      const oldValue = this.cells[row][col];
      this.cells[row][col] = value ? 1 : 0;
    }
  }

  toggleCell(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      this.cells[row][col] = this.cells[row][col] ? 0 : 1;
    }
  }

  countNeighbors(row, col) {
    let count = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;

        let newRow = row + dr;
        let newCol = col + dc;

        newRow = (newRow + this.height) % this.height;
        newCol = (newCol + this.width) % this.width;

        count += this.cells[newRow][newCol];
      }
    }

    return count;
  }

  nextGeneration() {
    this.previousCells = deepCopy(this.cells);
    const newCells = this.createEmptyGrid();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const neighbors = this.countNeighbors(row, col);
        const currentCell = this.cells[row][col];

        if (currentCell === 1) {
          newCells[row][col] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          newCells[row][col] = (neighbors === 3) ? 1 : 0;
        }
      }
    }

    this.cells = newCells;
  }

  getPopulation() {
    return this.cells.flat().reduce((sum, cell) => sum + cell, 0);
  }

  hasChanged() {
    if (!this.previousCells) return true;

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.cells[row][col] !== this.previousCells[row][col]) {
          return true;
        }
      }
    }
    return false;
  }

  isEmpty() {
    return this.getPopulation() === 0;
  }

  fillRandom(probability = 0.3) {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.cells[row][col] = Math.random() < probability ? 1 : 0;
      }
    }
  }

  getCellsInRegion(startRow, startCol, endRow, endCol) {
    const cells = [];
    const minRow = Math.max(0, Math.min(startRow, endRow));
    const maxRow = Math.min(this.height - 1, Math.max(startRow, endRow));
    const minCol = Math.max(0, Math.min(startCol, endCol));
    const maxCol = Math.min(this.width - 1, Math.max(startCol, endCol));

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ row, col, value: this.cells[row][col] });
      }
    }

    return cells;
  }

  setCellsInRegion(startRow, startCol, endRow, endCol, value) {
    const minRow = Math.max(0, Math.min(startRow, endRow));
    const maxRow = Math.min(this.height - 1, Math.max(startRow, endRow));
    const minCol = Math.max(0, Math.min(startCol, endCol));
    const maxCol = Math.min(this.width - 1, Math.max(startCol, endCol));

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        this.cells[row][col] = value ? 1 : 0;
      }
    }
  }

  copy() {
    const newGrid = new Grid(this.width, this.height);
    newGrid.cells = deepCopy(this.cells);
    newGrid.previousCells = deepCopy(this.previousCells);
    return newGrid;
  }

  toString() {
    return this.cells.map(row =>
      row.map(cell => cell ? '█' : '·').join('')
    ).join('\n');
  }

  toArray() {
    return deepCopy(this.cells);
  }

  fromArray(array) {
    if (!array || !array.length || !array[0]) return;

    this.height = array.length;
    this.width = array[0].length;
    this.cells = deepCopy(array);
    this.previousCells = this.createEmptyGrid();
  }

  getStats() {
    const population = this.getPopulation();
    const density = population / (this.width * this.height);

    return {
      population,
      density: Math.round(density * 100),
      dimensions: `${this.width}x${this.height}`,
      totalCells: this.width * this.height
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Grid;
}
