// UI helpers for TetrisMine Mobile
export function initUILabels() {
  if (!window.MSG) return;
  const map = [
    ['nextLabel', 'nextLabel'],
    ['topLabel', 'topLabel'],
    ['scoreLabel', 'scoreLabel'],
    ['discard-btn', 'discardLabel']
  ];
  map.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && MSG[key]) {
      if (id === 'discard-btn') el.textContent = MSG[key];
      else el.textContent = MSG[key];
    }
  });
} 