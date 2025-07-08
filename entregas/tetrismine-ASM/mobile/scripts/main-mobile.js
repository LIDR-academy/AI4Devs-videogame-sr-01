// Punto de entrada para la versión smartphone de TetrisMine.
// En pasos siguientes importaremos la lógica común y montaremos la UI.

import { initUILabels } from './ui-mobile.js';
import { initControls } from './controls-mobile.js';
import Game from '../../game.js';
import EasyRuleSet from '../../modes/easy.js';
import HardRuleSet from '../../modes/hard.js';

function startMobileGame(mode='easy'){
  // Update body class for accent color
  document.body.classList.remove('easyMode','hardMode');
  document.body.classList.add(mode==='hard'?'hardMode':'easyMode');

  // Update mode label text
  const modeLabel = document.getElementById('modeLabel');
  if(modeLabel && window.MSG){
    modeLabel.textContent = mode==='hard'? MSG.hardModeLabel : MSG.easyModeLabel;
  }

  const rules = mode==='hard'? new HardRuleSet(): new EasyRuleSet();
  if(window.currentGame && typeof window.currentGame.terminate==='function'){
    window.currentGame.terminate();
  }
  window.currentGame = new Game(rules);
}

console.log('TetrisMine Mobile – Bootstrap cargado');

document.addEventListener('DOMContentLoaded', () => {
  initUILabels();

  const input = document.getElementById('playerName');
  const btnEasy = document.getElementById('startEasyBtn');
  const btnHard = document.getElementById('startHardBtn');
  const welcome = document.getElementById('welcomeScreen');
  const app     = document.getElementById('mobileApp');

  // Enable buttons when name typed
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^A-Za-z0-9 ]/g, '');
    const disabled = !input.value.trim();
    btnEasy.disabled = disabled;
    btnHard.disabled = disabled;
  });

  function launch(mode){
    window.playerName = input.value.trim().slice(0,15);
    welcome.classList.add('hidden');
    app.classList.remove('hidden');

    initControls();
    startMobileGame(mode);
    window.renderLeaderboard && window.renderLeaderboard();
  }

  btnEasy.addEventListener('click', () => launch('easy'));
  btnHard.addEventListener('click', () => launch('hard'));

  // Logo click returns to welcome
  const logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
    if(window.currentGame && typeof window.currentGame.terminate==='function'){
      window.currentGame.terminate();
      window.currentGame = null;
    }
    app.classList.add('hidden');
    welcome.classList.remove('hidden');
    input.value = '';
    input.focus();
    btnEasy.disabled = true;
    btnHard.disabled = true;
    const modeLabel = document.getElementById('modeLabel');
    if(modeLabel) modeLabel.textContent = '';
    window.renderLeaderboard && window.renderLeaderboard();
  });

  // Share button
  const shareBtn = document.getElementById('shareBtn');
  if(shareBtn){
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'TetrisMine',
        text: '¡Juega a TetrisMine conmigo! Un arcade retro que mezcla Tetris y Buscaminas.',
        url: window.location.href
      };

      try{
        if(navigator.share){
          await navigator.share(shareData);
        }else{
          await navigator.clipboard.writeText(shareData.url);
          const original = shareBtn.textContent;
          shareBtn.textContent = 'LINK COPIED!';
          setTimeout(()=> shareBtn.textContent = original, 2000);
        }
      }catch(err){ console.error('Error sharing:', err); }
    });
  }
}); 