// Bootstrap.
import { openWindow, makeDraggable } from './window-manager.js';
import { initStartMenu } from './start-menu.js';
import { initTaskbar } from './taskbar.js';
import { initTray } from './tray.js';
import { initStickyNotes } from './sticky-notes.js';
import { initMobileShell } from './mobile-shell.js';
import { initDesktopIcons } from './desktop-icons.js';
import { loadDictionary, applyI18n, setLang } from './i18n.js';

window.AppState = {
  lang: localStorage.getItem('lang') || 'it',
  audio: localStorage.getItem('audio') || 'off',
  openWindows: new Map(),
  focusedWindowId: null,
  zIndexCounter: 100,
  startMenuOpen: false,
};

// Bootstrap i18n first (top-level await ok inside <script type="module">)
await loadDictionary(window.AppState.lang);
applyI18n();
window.applyI18n = applyI18n;  // expose for window-manager dynamic content

// Desktop icons: drag + click (handled by desktop-icons.js)
initDesktopIcons();

// Make new windows draggable when added
const obs = new MutationObserver(muts => {
  muts.forEach(m => m.addedNodes.forEach(n => {
    if (n.classList && n.classList.contains('window')) makeDraggable(n);
  }));
});
obs.observe(document.querySelector('.windows-layer'), { childList: true });

// Esc closes focused window; Meta key opens start menu
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && window.AppState.focusedWindowId) {
    import('./window-manager.js').then(m => m.closeWindow(window.AppState.focusedWindowId));
  }
  if ((e.key === 'Meta' || e.key === 'OS') && !e.repeat) {
    e.preventDefault();
    document.querySelector('.start-orb').click();
  }
});

initTray();
initStartMenu();
initStickyNotes();
initMobileShell();
initTaskbar();

// Deep-link: ?window=<id>&lang=<it|en>
const params = new URLSearchParams(location.search);
if (params.get('lang')) {
  await setLang(params.get('lang'));
}
if (params.get('window')) {
  await openWindow(params.get('window'));
}

console.info('Portfolio Y2K — ready');

// Visitor counter fetch (works only from public domain; localhost will silent-fail)
fetch('https://jacopino.goatcounter.com/counter//TOTAL.txt')
  .then(r => r.text()).then(t => {
    const el = document.getElementById('visitor-count');
    if (el) el.textContent = t.trim();
  }).catch(() => {});
