// Desktop icons: draggable + click-to-open.
// Click = release without move → open window. Drag = move + persist position.
//
// Persistence: localStorage key `icon-positions` stores { [windowId]: {left,top} }.

import { openWindow } from './window-manager.js';

const STORE = 'icon-positions';
const ICON_W = 96, ICON_H = 100;
const PAD = 16;
const DRAG_THRESHOLD = 5; // px before pointerdown counts as drag, not click

function readPositions() {
  try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; }
}
function writePositions(p) { localStorage.setItem(STORE, JSON.stringify(p)); }

function defaultLayout(ids) {
  // Auto-flow column-first from top-left. Wrap to new column when overflow.
  const taskbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-h')) || 40;
  const maxRows = Math.max(1, Math.floor((window.innerHeight - taskbarH - PAD * 2) / ICON_H));
  const out = {};
  ids.forEach((id, i) => {
    const col = Math.floor(i / maxRows);
    const row = i % maxRows;
    out[id] = { left: PAD + col * ICON_W, top: PAD + row * ICON_H };
  });
  return out;
}

function clamp(pos) {
  const taskbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-h')) || 40;
  return {
    left: Math.max(0, Math.min(window.innerWidth - ICON_W, pos.left)),
    top:  Math.max(0, Math.min(window.innerHeight - taskbarH - ICON_H, pos.top)),
  };
}

function apply(li, pos) {
  li.style.left = pos.left + 'px';
  li.style.top  = pos.top  + 'px';
}

export function initDesktopIcons() {
  const items = [...document.querySelectorAll('.icons-grid > li')];
  if (items.length === 0) return;

  const ids = items.map(li => li.querySelector('.icon').dataset.window);
  let positions = readPositions();
  // Fill any missing ids with default layout
  if (ids.some(id => !positions[id])) {
    positions = { ...defaultLayout(ids), ...positions };
  }
  items.forEach(li => {
    const id = li.querySelector('.icon').dataset.window;
    apply(li, clamp(positions[id]));
  });

  // Drag + click handling
  items.forEach(li => {
    const icon = li.querySelector('.icon');
    const id = icon.dataset.window;
    let startX = 0, startY = 0, origL = 0, origT = 0, moved = false, active = false;

    icon.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      active = true; moved = false;
      startX = e.clientX; startY = e.clientY;
      origL = li.offsetLeft; origT = li.offsetTop;
      icon.setPointerCapture(e.pointerId);
    });

    icon.addEventListener('pointermove', e => {
      if (!active) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        moved = true;
        icon.classList.add('is-dragging');
      }
      if (moved) {
        const next = clamp({ left: origL + dx, top: origT + dy });
        apply(li, next);
      }
    });

    function finish(e) {
      if (!active) return;
      active = false;
      icon.classList.remove('is-dragging');
      if (moved) {
        positions[id] = { left: li.offsetLeft, top: li.offsetTop };
        writePositions(positions);
      } else {
        // Treat as click → open window
        openWindow(id);
      }
      icon.releasePointerCapture(e.pointerId);
    }

    icon.addEventListener('pointerup', finish);
    icon.addEventListener('pointercancel', finish);

    // Keyboard: Enter/Space open
    icon.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWindow(id); }
    });
  });

  // Re-clamp on resize so icons don't escape taskbar
  window.addEventListener('resize', () => {
    items.forEach(li => {
      const id = li.querySelector('.icon').dataset.window;
      const clamped = clamp({ left: li.offsetLeft, top: li.offsetTop });
      apply(li, clamped);
      positions[id] = clamped;
    });
    writePositions(positions);
  });
}
