import { openWindow } from './window-manager.js';

const ORB = document.querySelector('.start-orb');
const MENU = document.querySelector('.start-menu');

function open() {
  MENU.hidden = false;
  ORB.setAttribute('aria-expanded', 'true');
  window.AppState.startMenuOpen = true;
  document.addEventListener('click', closeOnOutside, true);
}

function close() {
  MENU.hidden = true;
  ORB.setAttribute('aria-expanded', 'false');
  window.AppState.startMenuOpen = false;
  document.removeEventListener('click', closeOnOutside, true);
}

function closeOnOutside(e) {
  if (e.target.closest('.start-menu') || e.target.closest('.start-orb')) return;
  close();
}

export function initStartMenu() {
  ORB.addEventListener('click', () => {
    window.AppState.startMenuOpen ? close() : open();
  });
  MENU.querySelectorAll('button[data-window]').forEach(b => {
    b.addEventListener('click', () => { openWindow(b.dataset.window); close(); });
  });
  MENU.querySelector('[data-action="shutdown"]').addEventListener('click', () => {
    location.href = '/404.html?reason=shutdown';
  });
  // Search filter icone desktop
  const search = MENU.querySelector('.sm-search input');
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('.icons-grid .icon').forEach(icon => {
      const label = icon.querySelector('.icon-label').textContent.toLowerCase();
      icon.parentElement.style.display = (q === '' || label.includes(q)) ? '' : 'none';
    });
  });
}
