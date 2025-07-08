document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('playerName');
  const btnEasy = document.getElementById('startEasyBtn');
  const btnHard = document.getElementById('startHardBtn');
  const welcome = document.getElementById('welcomeScreen');
  const gameUI = document.getElementById('gameUI');
  const shareBtn = document.getElementById('shareBtn');

  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^A-Za-z0-9 ]/g, '');
    const disabled = !input.value.trim();
    btnEasy.disabled = disabled;
    btnHard.disabled = disabled;
  });

  function startGame(mode){
    welcome.classList.add('hidden');
    gameUI.classList.remove('hidden');
    window.playerName = input.value.trim().slice(0, 15);

    /* Indicador de modo encima de NEXT PIECE */
    const modeLabel = document.getElementById('modeLabel');
    if (modeLabel) {
      modeLabel.textContent = mode === 'hard' ? MSG.hardModeLabel : MSG.easyModeLabel;
    }

    /* Cambiar clase del <body> para que CSS actualice colores */
    document.body.classList.remove('easyMode', 'hardMode');
    document.body.classList.add(mode === 'hard' ? 'hardMode' : 'easyMode');

    window.createTetrismineGame(mode);

    /* Foco accesible: ir al botón Discard */
    const discardBtn = document.getElementById('discard-btn');
    discardBtn && discardBtn.focus();
  }

  btnEasy.addEventListener('click', () => startGame('easy'));
  btnHard.addEventListener('click', () => startGame('hard'));

  /* Etiquetas estáticas desde messages.js */
  const setTxt = (id, key) => {
    const el = document.getElementById(id);
    if (el && window.MSG && MSG[key]) el.textContent = MSG[key];
  };
  setTxt('nextLabel',  'nextLabel');
  setTxt('topLabel',   'topLabel');
  setTxt('scoreLabel', 'scoreLabel');

  const discardBtn = document.getElementById('discard-btn');
  if (discardBtn && window.MSG) {
    discardBtn.textContent = MSG.discardLabel;
  }

  /* Al pulsar el logo se vuelve al menú principal */
  const logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
    /* 1.  Detener la partida si está en curso */
    if (window.currentGame && !window.currentGame.gameOver) {
      window.currentGame.terminate();
      window.currentGame = null;
    }

    /* 2.  Mostrar pantalla principal */
    gameUI.classList.add('hidden');
    welcome.classList.remove('hidden');

    /* 3.  Vaciar el input y desactivar el botón START        */
    input.value = '';
    input.focus();
    btnEasy.disabled = true;
    btnHard.disabled = true;

    /* 4.  Refrescar los TOP-5 */
    const modeLabel = document.getElementById('modeLabel');
    if (modeLabel) modeLabel.textContent = '';
    document.body.classList.remove('easyMode', 'hardMode');
    window.renderLeaderboard && window.renderLeaderboard();
  });

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'TetrisMine',
        text: '¡Juega a TetrisMine conmigo! Un arcade retro que mezcla Tetris y Buscaminas.',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData); // API nativa de compartir
        } else {
          await navigator.clipboard.writeText(shareData.url); // Fallback: copiar
          const originalText = shareBtn.textContent;
          shareBtn.textContent = 'LINK COPIED!';
          setTimeout(() => {
            shareBtn.textContent = originalText;
          }, 2000);
        }
      } catch (err) {
        console.error('Error sharing:', err);
      }
    });
  }
});

// Se eliminan las utilidades de leaderboard aquí — ahora vive en leaderboard.js 