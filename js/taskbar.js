import { focusWindow, minimizeWindow } from './window-manager.js';

const TASK_LIST = document.querySelector('.task-buttons');
const CLOCK = document.querySelector('.clock');

function pad(n) { return String(n).padStart(2, '0'); }

function tickClock() {
  const d = new Date();
  CLOCK.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  CLOCK.dateTime = d.toISOString();
  CLOCK.title = d.toLocaleDateString(window.AppState.lang === 'en' ? 'en-US' : 'it-IT', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function renderTaskButtons() {
  TASK_LIST.innerHTML = '';
  for (const [id, inst] of window.AppState.openWindows) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'task-btn';
    if (window.AppState.focusedWindowId === id && !inst.el.classList.contains('is-minimized')) btn.classList.add('is-active');
    const desktopBtn = document.querySelector(`.icon[data-window="${id}"]`);
    const iconKey = desktopBtn?.dataset.icon || id;
    btn.innerHTML = `<img src="assets/img/icons/${iconKey}.svg" alt=""> <span>${inst.el.querySelector('.window-title').textContent}</span>`;
    btn.addEventListener('click', () => {
      if (inst.el.classList.contains('is-minimized') || window.AppState.focusedWindowId !== id) focusWindow(id);
      else minimizeWindow(id);
    });
    li.appendChild(btn);
    TASK_LIST.appendChild(li);
  }
}

export function initTaskbar() {
  tickClock();
  setInterval(tickClock, 30_000);
  document.addEventListener('windows:changed', renderTaskButtons);
}
