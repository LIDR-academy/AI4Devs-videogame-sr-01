// Gestor de controles táctiles y clics para TetrisMine Mobile

function _dispatchKey(key) {
  const e = new KeyboardEvent('keydown', { key, bubbles: true });
  window.dispatchEvent(e);
}

export function initControls() {
  const map = [
    ['btn-left',  'ArrowLeft'],
    ['btn-down',  'ArrowDown'],
    ['btn-right', 'ArrowRight']
  ];

  map.forEach(([id, keyName]) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    const press = () => btn.classList.add('pressed');
    const release = () => btn.classList.remove('pressed');

    const handler = (ev) => {
      ev.preventDefault();
      press();
      _dispatchKey(keyName);
    };

    // Soporte tanto touch como click para compatibilidad
    btn.addEventListener('touchstart', handler, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('mousedown', handler);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);

    // Hard drop al mantener pulsado el botón de abajo (opcional)
    if (id === 'btn-down') {
      let interval;
      const start = () => interval = setInterval(() => _dispatchKey('ArrowDown'), 100);
      const stop  = () => interval && clearInterval(interval);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', stop, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', stop);
      btn.addEventListener('mouseleave', stop);
    }
  });
} 