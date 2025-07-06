/**
 * Juego de Serpientes y Escaleras
 * Implementación completa con OOP y principios SOLID
 */

// ===== CLASES PRINCIPALES =====

class Game {
  constructor() {
    this.gameId = Math.random().toString(36).substr(2, 9); // ID único
    console.log(`🎮 Creando nueva instancia del juego: ${this.gameId}`);

    this.players = [];
    this.currentPlayerIndex = 0;
    this.board = new Board();
    this.theme = "kwai";
    this.isGameActive = false;
    this.isAnimating = false; // ✅ Flag para prevenir animaciones simultáneas
    this.soundManager = new SoundManager();
    this.uiManager = new UIManager(this);

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    console.log("🔧 Inicializando event listeners...");

    // Pantalla de inicio
    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        console.log('🖱️ Botón "Comenzar Aventura" clickeado');
        this.uiManager.showScreen("boardSelect");
      });
      console.log("✅ Event listener para startBtn agregado");
    } else {
      console.error("❌ Elemento startBtn no encontrado");
    }

    // Selección de tema
    const themeOptions = document.querySelectorAll(".theme-option");
    console.log(`🎨 Encontradas ${themeOptions.length} opciones de tema`);
    themeOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        console.log(`🎨 Tema seleccionado: ${e.currentTarget.dataset.theme}`);
        this.selectTheme(e.currentTarget.dataset.theme);
      });
    });

    // Navegación entre pantallas
    const backToHome = document.getElementById("backToHome");
    if (backToHome) {
      backToHome.addEventListener("click", () => {
        console.log("🏠 Volviendo a la pantalla de inicio");
        this.uiManager.showScreen("homeScreen");
      });
    }

    const backToThemes = document.getElementById("backToThemes");
    if (backToThemes) {
      backToThemes.addEventListener("click", () => {
        console.log("🎨 Volviendo a selección de temas");
        this.uiManager.showScreen("boardSelect");
      });
    }

    // Configuración de jugadores
    document.querySelectorAll(".count-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setPlayerCount(parseInt(e.target.dataset.count));
      });
    });

    const startGameBtn = document.getElementById("startGame");
    if (startGameBtn) {
      startGameBtn.addEventListener("click", () => {
        console.log("🎮 Iniciando juego...");
        this.startGame();
      });
    }

    // Controles del juego
    const rollDiceBtn = document.getElementById("rollDice");
    if (rollDiceBtn) {
      // ✅ CRÍTICO: Usar una propiedad para la función y remover listeners anteriores
      if (this.handleRollDice) {
        rollDiceBtn.removeEventListener("click", this.handleRollDice);
      }

      this.handleRollDice = () => {
        console.log(`🎲 [Juego: ${this.gameId}] Click en dado detectado`);
        this.rollDice();
      };

      rollDiceBtn.addEventListener("click", this.handleRollDice);
      console.log(
        `✅ [Juego: ${this.gameId}] Listener único de dado configurado`
      );
    }

    const pauseGameBtn = document.getElementById("pauseGame");
    if (pauseGameBtn) {
      pauseGameBtn.addEventListener("click", () => {
        this.pauseGame();
      });
    }

    const quitGameBtn = document.getElementById("quitGame");
    if (quitGameBtn) {
      quitGameBtn.addEventListener("click", () => {
        this.quitGame();
      });
    }

    // Pantalla de ganador
    const playAgainBtn = document.getElementById("playAgain");
    if (playAgainBtn) {
      playAgainBtn.addEventListener("click", () => {
        this.restartGame();
      });
    }

    const newGameBtn = document.getElementById("newGame");
    if (newGameBtn) {
      newGameBtn.addEventListener("click", () => {
        this.newGame();
      });
    }

    console.log("✅ Event listeners inicializados");
  }

  selectTheme(theme) {
    console.log(`🎨 Tema seleccionado: ${theme}`);
    this.theme = theme;
    document.body.className = `theme-${theme}`;
    this.uiManager.showScreen("playerSetup");
    this.setPlayerCount(3); // Default
  }

  setPlayerCount(count) {
    // Actualizar botones
    document.querySelectorAll(".count-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-count="${count}"]`).classList.add("active");

    // Generar inputs de jugadores
    this.generatePlayerInputs(count);
  }

  generatePlayerInputs(count) {
    const container = document.getElementById("playerInputs");
    container.innerHTML = "";

    const avatars = this.getThemeAvatars();

    for (let i = 0; i < count; i++) {
      const playerDiv = document.createElement("div");
      playerDiv.className = "player-input";
      playerDiv.innerHTML = `
                <h4>Jugador ${i + 1}</h4>
                <input type="text" placeholder="Nombre del jugador" maxlength="20" value="Jugador ${
                  i + 1
                }">
                <div class="avatar-selector">
                    ${avatars
                      .map(
                        (avatar, index) =>
                          `<div class="avatar-option ${
                            index === i ? "selected" : ""
                          }" data-avatar="${avatar}">${avatar}</div>`
                      )
                      .join("")}
                </div>
            `;
      container.appendChild(playerDiv);

      // Event listeners para avatares
      playerDiv.querySelectorAll(".avatar-option").forEach((option) => {
        option.addEventListener("click", (e) => {
          playerDiv
            .querySelectorAll(".avatar-option")
            .forEach((o) => o.classList.remove("selected"));
          e.target.classList.add("selected");
        });
      });
    }
  }

  getThemeAvatars() {
    const avatars = {
      kwai: ["🦄", "🌈", "⭐", "🎀", "🌸", "🎪", "🎁", "🍭"],
      futuristic: ["🤖", "👾", "🛸", "⚡", "🔮", "💎", "🚀", "⭐"],
      classic: ["♠️", "♥️", "♦️", "♣️", "👑", "🎭", "🎯", "🏆"],
    };
    return avatars[this.theme] || avatars.kwai;
  }

  startGame() {
    console.log(`🎮 ===== INICIO startGame() [Juego: ${this.gameId}] =====`);

    // Validar y crear jugadores
    const playerInputs = document.querySelectorAll(".player-input");
    this.players = [];

    playerInputs.forEach((input, index) => {
      const name =
        input.querySelector("input").value.trim() || `Jugador ${index + 1}`;
      const avatar = input.querySelector(".avatar-option.selected").dataset
        .avatar;

      this.players.push(new Player(name, avatar, index + 1));
    });

    // Inicializar tablero
    this.board.generate();
    this.board.render();

    // Posicionar fichas inicialmente (todas en posición 0 = fuera del tablero)
    this.players.forEach((player) => {
      this.board.updatePlayerPosition(player);
    });

    // Configurar UI
    this.uiManager.showScreen("gameBoard");
    this.uiManager.updatePlayersPanel(this.players);
    this.uiManager.updateCurrentPlayer(this.players[this.currentPlayerIndex]);

    this.isGameActive = true;
    console.log(
      "Juego iniciado con:",
      this.players.map((p) => p.name)
    );
  }

  rollDice() {
    console.log(`🎲 ===== INICIO rollDice() [Juego: ${this.gameId}] =====`);

    // ✅ Verificar que el juego no esté destruido
    if (this.isDestroyed) {
      console.log(`🚫 [Juego: ${this.gameId}] Juego destruido, ignorando dado`);
      return;
    }

    if (!this.isGameActive) {
      console.log("🚫 Juego no activo, ignorando dado");
      return;
    }

    // ✅ Verificar que esta es la instancia activa
    if (window.game && window.game !== this) {
      console.log(
        `🚫 [Juego: ${this.gameId}] No es la instancia activa, ignorando dado`
      );
      return;
    }

    const diceBtn = document.getElementById("rollDice");

    // ✅ Verificar si el botón ya está deshabilitado
    if (diceBtn.disabled) {
      console.log("🚫 Dado ya está siendo lanzado, ignorando click");
      return;
    }

    // ✅ Verificar si ya estamos animando
    if (this.isAnimating) {
      console.log("🚫 Animación en curso, ignorando dado");
      return;
    }

    console.log(`🎲 Lanzando dado... [Juego: ${this.gameId}]`);
    diceBtn.disabled = true;

    // Animación del dado
    const dice = document.getElementById("dice");
    dice.classList.add("rolling");
    this.soundManager.play("dice");

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      dice.classList.remove("rolling");

      console.log(
        `🎲 ===== RESULTADO: ${result} [Juego: ${this.gameId}] =====`
      );

      // Mostrar resultado
      document.getElementById(
        "diceResult"
      ).textContent = `Resultado: ${result}`;
      dice.querySelector(".dice-face").textContent = this.getDiceFace(result);

      // Mover jugador
      console.log(
        `🚀 Llamando movePlayer con resultado: ${result} [Juego: ${this.gameId}]`
      );
      this.movePlayer(this.players[this.currentPlayerIndex], result);

      // NO llamar nextTurn aquí - se llamará después de todas las animaciones
    }, 1000);
  }

  getDiceFace(number) {
    const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
    return faces[number - 1];
  }

  movePlayer(player, steps) {
    // ✅ Verificar si hay una animación en curso
    if (this.isAnimating) {
      console.log("🚫 Animación en curso, ignorando movimiento");
      return;
    }

    console.log(
      `🎯 INICIO movePlayer [Juego: ${this.gameId}]: ${player.name} posición actual: ${player.position}, pasos: ${steps}`
    );

    // ✅ Marcar que estamos animando
    this.isAnimating = true;

    // Calcular nueva posición
    // Si está en posición 0 (inicio), el primer movimiento lo lleva a la casilla del dado
    let newPosition;

    if (player.position === 0) {
      // Primer movimiento: va directamente a la casilla del dado
      newPosition = steps;
      console.log(
        `👶 Primer movimiento: ${player.name} va de 0 a ${newPosition}`
      );
    } else {
      // Movimientos siguientes: suma la posición actual + pasos
      newPosition = player.position + steps;
      console.log(
        `➡️ Movimiento normal: ${player.name} va de ${player.position} a ${newPosition}`
      );
    }

    // Verificar que no se pase de 100
    if (newPosition > 100) {
      console.log(
        `🚫 ${player.name} necesita exactamente ${
          100 - player.position
        } para ganar (tiró ${steps}). No se mueve.`
      );
      // ✅ Liberar animación y terminar turno
      this.isAnimating = false;
      this.finalizeTurn();
      return;
    }

    console.log(
      `✅ ${player.name} se moverá de ${player.position} a ${newPosition} (${steps} pasos)`
    );
    this.animatePlayerMovement(player, newPosition);
  }

  animatePlayerMovement(player, targetPosition) {
    const startPos = player.position;
    let currentVisualPos = startPos;

    console.log(
      `🎬 Animando movimiento de ${player.name}: ${startPos} → ${targetPosition}`
    );

    const moveInterval = setInterval(() => {
      if (currentVisualPos < targetPosition) {
        currentVisualPos++;

        // ✅ Mostrar ficha en posición visual sin modificar player.position
        this.board.showPlayerAtPosition(player, currentVisualPos);
        this.soundManager.play("move");
      } else {
        clearInterval(moveInterval);

        // ✅ AHORA SÍ actualizar la posición lógica del jugador
        player.position = targetPosition;
        this.board.updatePlayerPosition(player);
        this.uiManager.updatePlayersPanel(this.players);

        console.log(`✅ ${player.name} llegó a casilla ${targetPosition}`);

        // Verificar serpientes y escaleras después del movimiento
        setTimeout(() => {
          this.checkSpecialCells(player);
        }, 500);
      }
    }, 300); // Velocidad de animación
  }

  checkSpecialCells(player) {
    const ladder = this.board.ladders.find((l) => l.from === player.position);
    const snake = this.board.snakes.find((s) => s.from === player.position);

    console.log(
      `🔍 Verificando casilla ${player.position} para ${player.name} [Board: ${this.board.boardId}]`
    );
    console.log(
      `🪜 Escaleras disponibles [Board: ${this.board.boardId}]:`,
      this.board.ladders.map((l) => `${l.from}→${l.to}`)
    );
    console.log(
      `🐍 Serpientes disponibles [Board: ${this.board.boardId}]:`,
      this.board.snakes.map((s) => `${s.from}→${s.to}`)
    );

    if (ladder) {
      console.log(
        `🪜 ${player.name} subió por una escalera de ${ladder.from} a ${ladder.to}!`
      );
      this.soundManager.play("ladder");
      setTimeout(() => {
        console.log(`🔄 ANTES: ${player.name} posición: ${player.position}`);
        player.position = ladder.to;
        console.log(
          `🔄 DESPUÉS: ${player.name} nueva posición: ${player.position}`
        );

        // ✅ VERIFICAR que la posición cambió correctamente
        if (player.position === ladder.to) {
          console.log(`✅ Posición actualizada correctamente a ${ladder.to}`);
        } else {
          console.error(
            `❌ ERROR: Posición no cambió. Esperado: ${ladder.to}, Actual: ${player.position}`
          );
        }

        this.board.updatePlayerPosition(player);
        this.uiManager.updatePlayersPanel(this.players);
        console.log(
          `✅ ${player.name} ahora está en casilla ${player.position}`
        );

        // Verificar victoria después del movimiento
        this.checkVictory(player);
        // Terminar turno después de la escalera
        this.finalizeTurn();
      }, 800);
    } else if (snake) {
      console.log(
        `🐍 ${player.name} bajó por una serpiente de ${snake.from} a ${snake.to}!`
      );
      this.soundManager.play("snake");
      setTimeout(() => {
        console.log(`🔄 ANTES: ${player.name} posición: ${player.position}`);
        player.position = snake.to;
        console.log(
          `🔄 DESPUÉS: ${player.name} nueva posición: ${player.position}`
        );

        // ✅ VERIFICAR que la posición cambió correctamente
        if (player.position === snake.to) {
          console.log(`✅ Posición actualizada correctamente a ${snake.to}`);
        } else {
          console.error(
            `❌ ERROR: Posición no cambió. Esperado: ${snake.to}, Actual: ${player.position}`
          );
        }

        this.board.updatePlayerPosition(player);
        this.uiManager.updatePlayersPanel(this.players);
        console.log(
          `⬇️ ${player.name} ahora está en casilla ${player.position}`
        );

        // Verificar victoria después del movimiento
        this.checkVictory(player);
        // Terminar turno después de la serpiente
        this.finalizeTurn();
      }, 800);
    } else {
      console.log(
        `➡️ ${player.name} se queda en casilla ${player.position} (sin serpientes ni escaleras)`
      );
      // Si no hay serpiente ni escalera, verificar victoria y terminar turno inmediatamente
      this.checkVictory(player);
      this.finalizeTurn();
    }
  }

  checkVictory(player) {
    if (player.position === 100) {
      this.playerWins(player);
      return true;
    }
    return false;
  }

  finalizeTurn() {
    console.log(
      `🏁 finalizeTurn() [Juego: ${this.gameId}] - Liberando animación y preparando siguiente turno`
    );

    // ✅ Liberar el flag de animación
    this.isAnimating = false;

    // Solo continuar con el siguiente turno si el juego sigue activo
    if (this.isGameActive) {
      setTimeout(() => {
        const diceBtn = document.getElementById("rollDice");
        if (diceBtn) {
          diceBtn.disabled = false;
          console.log(`✅ Botón de dado habilitado [Juego: ${this.gameId}]`);
        }
        this.nextTurn();
      }, 800); // ✅ Aumentado de 500ms a 800ms para evitar solapamientos
    }
  }

  playerWins(player) {
    this.isGameActive = false;
    this.soundManager.play("victory");

    setTimeout(() => {
      document.getElementById("winnerName").textContent = player.name;
      document.getElementById("winnerAvatar").textContent = player.avatar;
      this.uiManager.showScreen("winnerScreen");
    }, 1000);
  }

  nextTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    this.uiManager.updateCurrentPlayer(this.players[this.currentPlayerIndex]);
    this.uiManager.updatePlayersPanel(this.players);
  }

  pauseGame() {
    this.isGameActive = !this.isGameActive;
    const btn = document.getElementById("pauseGame");
    btn.textContent = this.isGameActive ? "⏸️ Pausar" : "▶️ Continuar";
  }

  quitGame() {
    if (confirm("¿Estás seguro de que quieres salir del juego?")) {
      this.newGame();
    }
  }

  restartGame() {
    console.log(`🔄 ===== RESTART GAME [Juego: ${this.gameId}] =====`);

    // Reiniciar posiciones a 0 (fuera del tablero)
    this.players.forEach((player) => {
      player.position = 0;
    });

    this.currentPlayerIndex = 0;

    // ✅ Reiniciar estados de juego
    this.isAnimating = false;
    this.isGameActive = true;

    // ✅ Habilitar el botón del dado
    const diceBtn = document.getElementById("rollDice");
    if (diceBtn) {
      diceBtn.disabled = false;
      console.log(
        `✅ Botón de dado habilitado para reinicio [Juego: ${this.gameId}]`
      );
    }

    // Solo reposicionar fichas
    this.players.forEach((player) => {
      this.board.updatePlayerPosition(player);
    });

    this.uiManager.showScreen("gameBoard");
    this.uiManager.updatePlayersPanel(this.players);
    this.uiManager.updateCurrentPlayer(this.players[this.currentPlayerIndex]);

    console.log(
      `✅ Juego reiniciado con tablero existente [Board: ${this.board.boardId}]`
    );
  }

  newGame() {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.isGameActive = false;
    document.body.className = "";
    this.uiManager.showScreen("homeScreen");
  }

  cleanupEventListeners() {
    console.log(`🧹 [Juego: ${this.gameId}] Limpiando event listeners...`);

    // Limpiar listener del dado
    const rollDiceBtn = document.getElementById("rollDice");
    if (rollDiceBtn && this.handleRollDice) {
      rollDiceBtn.removeEventListener("click", this.handleRollDice);
      console.log(`✅ [Juego: ${this.gameId}] Listener de dado removido`);
    }

    // Marcar como destruido
    this.isDestroyed = true;
  }

  destroy() {
    console.log(`💀 [Juego: ${this.gameId}] Destruyendo instancia...`);
    this.cleanupEventListeners();

    // Si esta es la instancia global, limpiarla
    if (window.game === this) {
      window.game = null;
      console.log(`✅ [Juego: ${this.gameId}] Instancia global limpiada`);
    }
  }
}

class Player {
  constructor(name, avatar, id) {
    this.name = name;
    this.avatar = avatar;
    this.id = id;
    this.position = 0; // ✅ Cambiar a 0 para que empiecen fuera del tablero
    this.color = this.getPlayerColor(id);
  }

  getPlayerColor(id) {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"];
    return colors[id - 1] || colors[0];
  }
}

class Board {
  constructor() {
    this.boardId = Math.random().toString(36).substr(2, 6); // ID único para debugging
    this.ladders = [];
    this.snakes = [];
    this.cells = [];
    console.log(`🏁 Creando nuevo Board: ${this.boardId}`);
  }

  generate() {
    this.generateLadders();
    this.generateSnakes();
    console.log(
      `🪜 Escaleras generadas [Board: ${this.boardId}]:`,
      this.ladders.map((l) => `${l.from}→${l.to}`)
    );
    console.log(
      `🐍 Serpientes generadas [Board: ${this.boardId}]:`,
      this.snakes.map((s) => `${s.from}→${s.to}`)
    );

    // Verificar que hay suficientes elementos
    if (this.ladders.length === 0) {
      console.warn(`⚠️ No se generaron escaleras [Board: ${this.boardId}]`);
    }
    if (this.snakes.length === 0) {
      console.warn(`⚠️ No se generaron serpientes [Board: ${this.boardId}]`);
    }
  }

  generateLadders() {
    this.ladders = [];
    const ladderCount = 8;
    console.log(`🪜 Generando ${ladderCount} escaleras...`);

    for (let i = 0; i < ladderCount; i++) {
      let attempts = 0;
      let ladder;

      do {
        const from = Math.floor(Math.random() * 80) + 2; // 2-81
        const to = from + Math.floor(Math.random() * (100 - from - 10)) + 10;
        ladder = { from, to };
        attempts++;
      } while (this.isConflicting(ladder) && attempts < 50);

      if (attempts < 50) {
        this.ladders.push(ladder);
        console.log(`✅ Escalera ${i + 1}: ${ladder.from} → ${ladder.to}`);
      } else {
        console.warn(
          `⚠️ No se pudo generar escalera ${i + 1} después de 50 intentos`
        );
      }
    }
    console.log(`🪜 Total escaleras generadas: ${this.ladders.length}`);
  }

  generateSnakes() {
    this.snakes = [];
    const snakeCount = 8;
    console.log(`🐍 Generando ${snakeCount} serpientes...`);

    for (let i = 0; i < snakeCount; i++) {
      let attempts = 0;
      let snake;

      do {
        const from = Math.floor(Math.random() * 80) + 20; // 20-99
        const to = Math.floor(Math.random() * (from - 10)) + 2;
        snake = { from, to };
        attempts++;
      } while (this.isConflicting(snake) && attempts < 50);

      if (attempts < 50) {
        this.snakes.push(snake);
        console.log(`✅ Serpiente ${i + 1}: ${snake.from} → ${snake.to}`);
      } else {
        console.warn(
          `⚠️ No se pudo generar serpiente ${i + 1} después de 50 intentos`
        );
      }
    }
    console.log(`🐍 Total serpientes generadas: ${this.snakes.length}`);
  }

  isConflicting(element) {
    // Verificar conflictos con escaleras existentes
    for (let ladder of this.ladders) {
      if (
        element.from === ladder.from ||
        element.from === ladder.to ||
        element.to === ladder.from ||
        element.to === ladder.to
      ) {
        return true;
      }
    }

    // Verificar conflictos con serpientes existentes
    for (let snake of this.snakes) {
      if (
        element.from === snake.from ||
        element.from === snake.to ||
        element.to === snake.from ||
        element.to === snake.to
      ) {
        return true;
      }
    }

    return false;
  }

  render() {
    console.log(`🎨 RENDER: Renderizando tablero [Board: ${this.boardId}]...`);
    console.log(
      `🪜 RENDER: Escaleras a renderizar [Board: ${this.boardId}]:`,
      this.ladders.map((l) => `${l.from}→${l.to}`)
    );
    console.log(
      `🐍 RENDER: Serpientes a renderizar [Board: ${this.boardId}]:`,
      this.snakes.map((s) => `${s.from}→${s.to}`)
    );

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    // Crear celdas (de 100 a 1, en zigzag)
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cellNumber = this.getCellNumber(row, col);
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.number = cellNumber;
        cell.id = `cell-${cellNumber}`;

        // Agregar número
        cell.textContent = cellNumber;

        // Marcar celdas especiales
        this.markSpecialCells(cell, cellNumber);

        boardElement.appendChild(cell);
      }
    }

    console.log(
      `🎨 RENDER: Tablero renderizado completamente [Board: ${this.boardId}]`
    );

    // ✅ Verificar consistencia visual después del renderizado
    setTimeout(() => {
      this.verifyVisualConsistency();
    }, 100); // Small delay to ensure DOM is updated
  }

  getCellNumber(row, col) {
    // Patrón de tablero Serpientes y Escaleras estándar:
    // row 0: 91-100 (izq a der)
    // row 1: 90-81 (der a izq)
    // row 2: 71-80 (izq a der)
    // row 3: 70-61 (der a izq)
    // ...
    // row 7: 30-21 (der a izq)
    // row 8: 11-20 (izq a der)
    // row 9: 10-1 (der a izq)

    const rowFromBottom = 9 - row; // 0=fila inferior, 9=fila superior
    const baseNumber = rowFromBottom * 10;

    if (rowFromBottom % 2 === 0) {
      // Filas pares desde abajo (0,2,4,6,8): izquierda a derecha
      return baseNumber + col + 1;
    } else {
      // Filas impares desde abajo (1,3,5,7,9): derecha a izquierda
      return baseNumber + 10 - col;
    }
  }

  markSpecialCells(cell, number) {
    if (number === 1) {
      cell.classList.add("start");
      cell.innerHTML = `${number}<br>🏁`;
    } else if (number === 100) {
      cell.classList.add("finish");
      cell.innerHTML = `${number}<br>🏆`;
    }

    // Marcar escaleras
    const ladder = this.ladders.find((l) => l.from === number);
    if (ladder) {
      console.log(
        `🪜 VISUAL [Board: ${this.boardId}]: Marcando escalera en casilla ${number} → ${ladder.to}`
      );
      cell.classList.add("ladder", "special");
      cell.innerHTML = `${number}<br>🪜→${ladder.to}`;
    }

    // Marcar serpientes
    const snake = this.snakes.find((s) => s.from === number);
    if (snake) {
      console.log(
        `🐍 VISUAL [Board: ${this.boardId}]: Marcando serpiente en casilla ${number} → ${snake.to}`
      );
      cell.classList.add("snake", "special");
      cell.innerHTML = `${number}<br>🐍→${snake.to}`;
    }
  }

  updatePlayerPosition(player) {
    console.log(
      `🎯 updatePlayerPosition: ${player.name} → casilla ${player.position}`
    );

    // Remover ficha anterior de todas las posiciones
    const oldTokens = document.querySelectorAll(`.token.p${player.id}`);
    console.log(
      `🗑️ Removiendo ${oldTokens.length} fichas anteriores de ${player.name}`
    );
    oldTokens.forEach((token) => {
      token.remove();
    });

    // Solo agregar ficha si la posición es válida (1-100)
    // Posición 0 = fuera del tablero (no se muestra)
    if (player.position >= 1 && player.position <= 100) {
      const cell = document.getElementById(`cell-${player.position}`);
      if (cell) {
        const token = document.createElement("div");
        token.className = `token p${player.id}`;
        token.style.backgroundColor = player.color;
        token.textContent = player.avatar;

        // Posicionar múltiples fichas en la misma casilla
        const existingTokens = cell.querySelectorAll(".token");
        const tokenCount = existingTokens.length;

        // Ajustar posición para evitar superposición
        if (tokenCount > 0) {
          const offset = tokenCount * 5; // 5px de offset por cada ficha
          token.style.marginLeft = `${offset}px`;
          token.style.marginTop = `${offset}px`;
          token.style.zIndex = 10 + tokenCount;
        }

        cell.appendChild(token);
        console.log(
          `✅ ${player.name} (${player.avatar}) colocado en casilla ${player.position}`
        );
      } else {
        console.error(`❌ Casilla ${player.position} no encontrada`);
      }
    } else if (player.position === 0) {
      console.log(
        `${player.name} está en posición inicial (fuera del tablero)`
      );
    }
  }

  showPlayerAtPosition(player, position) {
    // Remover ficha anterior de todas las posiciones
    document.querySelectorAll(`.token.p${player.id}`).forEach((token) => {
      token.remove();
    });

    // Mostrar ficha en la posición especificada (solo para animación)
    if (position >= 1 && position <= 100) {
      const cell = document.getElementById(`cell-${position}`);
      if (cell) {
        const token = document.createElement("div");
        token.className = `token p${player.id}`;
        token.style.backgroundColor = player.color;
        token.textContent = player.avatar;

        // Posicionar múltiples fichas en la misma casilla
        const existingTokens = cell.querySelectorAll(".token");
        const tokenCount = existingTokens.length;

        // Ajustar posición para evitar superposición
        if (tokenCount > 0) {
          const offset = tokenCount * 5;
          token.style.marginLeft = `${offset}px`;
          token.style.marginTop = `${offset}px`;
          token.style.zIndex = 10 + tokenCount;
        }

        cell.appendChild(token);
      }
    }
  }

  // ✅ MÉTODO DE VERIFICACIÓN para debugging visual
  verifyVisualConsistency() {
    console.log(
      `🔍 VERIFICANDO CONSISTENCIA VISUAL [Board: ${this.boardId}]...`
    );

    // Verificar escaleras
    this.ladders.forEach((ladder) => {
      const cell = document.getElementById(`cell-${ladder.from}`);
      if (cell) {
        const displayText = cell.innerHTML;
        if (!displayText.includes(`→${ladder.to}`)) {
          console.error(
            `❌ ESCALERA INCONSISTENTE [Board: ${this.boardId}]: Casilla ${ladder.from} muestra "${displayText}" pero debería mostrar "→${ladder.to}"`
          );
        } else {
          console.log(
            `✅ Escalera ${ladder.from}→${ladder.to} visualmente correcta [Board: ${this.boardId}]`
          );
        }
      }
    });

    // Verificar serpientes
    this.snakes.forEach((snake) => {
      const cell = document.getElementById(`cell-${snake.from}`);
      if (cell) {
        const displayText = cell.innerHTML;
        if (!displayText.includes(`→${snake.to}`)) {
          console.error(
            `❌ SERPIENTE INCONSISTENTE [Board: ${this.boardId}]: Casilla ${snake.from} muestra "${displayText}" pero debería mostrar "→${snake.to}"`
          );
        } else {
          console.log(
            `✅ Serpiente ${snake.from}→${snake.to} visualmente correcta [Board: ${this.boardId}]`
          );
        }
      }
    });
  }
}

class SoundManager {
  constructor() {
    // Intentar usar sonidos sintéticos primero
    if (typeof SynthSoundManager !== "undefined") {
      this.synthManager = new SynthSoundManager();
      this.useSynth = true;
    } else {
      this.useSynth = false;
    }

    // Fallback a elementos de audio HTML
    this.sounds = {
      dice: document.getElementById("diceSound"),
      move: document.getElementById("moveSound"),
      ladder: document.getElementById("ladderSound"),
      snake: document.getElementById("snakeSound"),
      victory: document.getElementById("victorySound"),
    };
    this.enabled = true;
  }

  play(soundName) {
    if (!this.enabled) return;

    // Usar sonidos sintéticos si están disponibles
    if (this.useSynth && this.synthManager) {
      this.synthManager.play(soundName);
      return;
    }

    // Fallback a elementos de audio HTML
    if (!this.sounds[soundName]) return;

    try {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch((e) => {
        console.log("Error playing sound:", e);
      });
    } catch (error) {
      console.log("Sound not available:", soundName);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.synthManager) {
      this.synthManager.toggle();
    }
  }
}

class UIManager {
  constructor(game) {
    this.game = game;
  }

  showScreen(screenId) {
    console.log(`🔄 Cambiando a pantalla: ${screenId}`);

    // Verificar que la pantalla existe
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) {
      console.error(`❌ Pantalla ${screenId} no encontrada`);
      return;
    }

    // Ocultar todas las pantallas
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });

    // Mostrar la pantalla objetivo
    targetScreen.classList.add("active");
    console.log(`✅ Pantalla ${screenId} mostrada`);
  }

  updateCurrentPlayer(player) {
    document.getElementById("currentPlayerName").textContent = player.name;
    const avatar = document.getElementById("currentPlayerAvatar");
    avatar.textContent = player.avatar;
    avatar.style.backgroundColor = player.color;
  }

  updatePlayersPanel(players) {
    const container = document.getElementById("playersStatus");
    container.innerHTML = "";

    players.forEach((player, index) => {
      const playerDiv = document.createElement("div");
      playerDiv.className = `player-status ${
        index === this.game.currentPlayerIndex ? "current" : ""
      }`;

      playerDiv.innerHTML = `
                <div class="status-avatar" style="background-color: ${player.color}">
                    ${player.avatar}
                </div>
                <div>
                    <strong>${player.name}</strong><br>
                    Posición: ${player.position}
                </div>
            `;

      container.appendChild(playerDiv);
    });
  }
}

// ===== TESTS BÁSICOS =====
class GameTests {
  static runTests() {
    console.log("Ejecutando tests básicos...");

    // Test 1: Creación de jugador
    const player = new Player("Test", "🎮", 1);
    console.assert(
      player.name === "Test",
      "Test 1 fallido: nombre del jugador"
    );
    console.assert(player.position === 1, "Test 1 fallido: posición inicial");

    // Test 2: Tablero
    const board = new Board();
    board.generate();
    console.assert(
      board.ladders.length > 0,
      "Test 2 fallido: generación de escaleras"
    );
    console.assert(
      board.snakes.length > 0,
      "Test 2 fallido: generación de serpientes"
    );

    // Test 3: Número de celda
    console.assert(
      board.getCellNumber(0, 0) === 91,
      "Test 3 fallido: número de celda"
    );
    console.assert(
      board.getCellNumber(9, 9) === 10,
      "Test 3 fallido: número de celda esquina"
    );

    console.log("✅ Todos los tests básicos pasaron");
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 DOM cargado, inicializando juego...");

  // Solo inicializar si NO estamos en una página de prueba
  const isTestPage =
    document.body.classList.contains("test-page") ||
    document.title.includes("Test") ||
    window.location.pathname.includes("test-");

  if (isTestPage) {
    console.log(
      "🧪 Página de prueba detectada, saltando inicialización automática"
    );
    return;
  }

  // ✅ Prevenir múltiples instancias
  if (window.game) {
    console.warn("⚠️ Ya existe una instancia del juego, no creando otra");
    return;
  }

  // ✅ NO ejecutar tests en el juego principal - solo en páginas de prueba
  // Los tests ahora se ejecutan únicamente en test-*.html

  // ✅ Destruir instancia anterior si existe
  if (window.game) {
    console.log("🗑️ Destruyendo instancia anterior del juego");
    window.game.destroy();
  }

  // Inicializar juego
  window.game = new Game();
  console.log("🎮 Juego de Serpientes y Escaleras inicializado");

  // Verificar que los elementos existen
  const startBtn = document.getElementById("startBtn");
  const boardSelect = document.getElementById("boardSelect");

  if (!startBtn) {
    console.error("❌ Botón startBtn no encontrado");
  }
  if (!boardSelect) {
    console.error("❌ Pantalla boardSelect no encontrada");
  }

  console.log("✅ Elementos principales verificados");
});
