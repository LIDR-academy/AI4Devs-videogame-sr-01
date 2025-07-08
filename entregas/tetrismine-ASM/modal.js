(function () {
  const overlay = document.createElement('div');
  overlay.id = 'modalOverlay';
  overlay.innerHTML = '<div id="modalBox"></div>';
  document.body.appendChild(overlay);

  const box = document.getElementById('modalBox');

  window.Modal = {
    show(msg, cb) {
      box.innerHTML = `<span>${msg}</span>`;
      overlay.classList.add('visible');
      overlay.onclick = () => { Modal.hide(); if (cb) cb(); };
    },

    // Permite HTML crudo y no auto-cierre
    showHtml(html) {
      box.innerHTML = html;
      overlay.classList.add('visible');
      overlay.onclick = null;
    },

    hide() { overlay.classList.remove('visible'); }
  };
})(); 