/* Leaderboard — Top-5 per mode (Easy / Hardcore) */
const MAX = 5;
const KEY_EASY = 'tetrismineScores_easy';
const KEY_HARD = 'tetrismineScores_hard';

const _key = (mode = 'easy') => (mode === 'hard' ? KEY_HARD : KEY_EASY);

function loadScores(mode = 'easy') {
  try {
    return JSON.parse(localStorage.getItem(_key(mode))) || [];
  } catch {
    return [];
  }
}

function saveScore(name, score, mode = (window.currentMode || 'easy')) {
  const list = loadScores(mode);
  list.push({ name, score });
  list.sort((a, b) => b.score - a.score);
  localStorage.setItem(_key(mode), JSON.stringify(list.slice(0, MAX)));
  renderLeaderboard();
}

function _renderOne(mode, elementId) {
  const ol = document.getElementById(elementId);
  if (!ol) return;
  ol.innerHTML = '';
  loadScores(mode).forEach(({ name, score }, i) => {
    const li = document.createElement('li');
    li.textContent = `${String(i + 1).padStart(2, '0')}  ${name} – ${score}`;
    ol.appendChild(li);
  });
}

function renderLeaderboard() {
  _renderOne('easy', 'leaderboardEasy');
  _renderOne('hard', 'leaderboardHard');
}

window.saveScore = saveScore;
window.renderLeaderboard = renderLeaderboard;

document.addEventListener('DOMContentLoaded', renderLeaderboard); 