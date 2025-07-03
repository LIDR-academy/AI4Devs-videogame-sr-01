/* Minimal reusable centred modal */
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'modalOverlay';
  overlay.innerHTML = '<div id="modalBox"></div>';   // <- box only
  document.body.appendChild(overlay);

  const box = document.getElementById('modalBox');

  window.Modal = {
    show(msg, cb) {
      box.innerHTML = `<span>${msg}</span>`;
      overlay.classList.add('visible');
      overlay.onclick = () => { Modal.hide(); if(cb) cb(); };
    },

    /* NEW: accept raw HTML and no auto-close */
    showHtml(html){
      box.innerHTML = html;
      overlay.classList.add('visible');
      overlay.onclick = null;          // ignore backdrop clicks
    },

    hide() { overlay.classList.remove('visible'); }
  };
})(); 