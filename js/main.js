// Bootstrap.
import { openWindow, makeDraggable } from './window-manager.js';

window.AppState = {
  lang: localStorage.getItem('lang') || 'it',
  audio: localStorage.getItem('audio') || 'off',
  openWindows: new Map(),
  focusedWindowId: null,
  zIndexCounter: 100,
  startMenuOpen: false,
};

// Wire desktop icons
document.querySelectorAll('.icon[data-window]').forEach(btn => {
  btn.addEventListener('click', () => openWindow(btn.dataset.window));
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWindow(btn.dataset.window); }
  });
});

// Make new windows draggable when added
const obs = new MutationObserver(muts => {
  muts.forEach(m => m.addedNodes.forEach(n => {
    if (n.classList && n.classList.contains('window')) makeDraggable(n);
  }));
});
obs.observe(document.querySelector('.windows-layer'), { childList: true });

// Esc closes focused window
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && window.AppState.focusedWindowId) {
    import('./window-manager.js').then(m => m.closeWindow(window.AppState.focusedWindowId));
  }
});

console.info('Portfolio Y2K — ready');
