// Desktop icons: draggable + click-to-open.
// Click = release without move → open window. Drag = move position (session only, not persisted).
// Layout always resets to default on reload.

import { openWindow } from './window-manager.js';

const ICON_W = 96, ICON_H = 100;
const PAD = 16;
const DRAG_THRESHOLD = 5; // px before pointerdown counts as drag, not click

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
  // Always start from default layout (no persistence)
  const positions = defaultLayout(ids);
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
        // Session-only position update (not persisted; resets on reload)
        positions[id] = { left: li.offsetLeft, top: li.offsetTop };
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
  });
}
