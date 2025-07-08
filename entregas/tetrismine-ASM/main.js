import Game from './game.js';
import EasyRuleSet from './modes/easy.js';
import HardRuleSet from './modes/hard.js';

window.createTetrismineGame = function (mode = 'easy') {
  if (window.currentGame && typeof window.currentGame.terminate === 'function') {
    window.currentGame.terminate();
  }

  const rules = mode === 'hard' ? new HardRuleSet() : new EasyRuleSet();
  window.currentMode = mode;
  window.currentGame = new Game(rules);
  return window.currentGame;
}; 