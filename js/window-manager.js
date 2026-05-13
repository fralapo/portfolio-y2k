// Window manager: open, focus, drag, min/max/close.
// Single source of truth: AppState.openWindows Map<id, instance>.

const TEMPLATE = document.getElementById('window-template');
const LAYER    = document.querySelector('.windows-layer');

function nextZ() {
  return ++window.AppState.zIndexCounter;
}

export async function openWindow(id) {
  if (window.AppState.openWindows.has(id)) {
    focusWindow(id);
    return;
  }
  let fragment;
  try {
    const url = `/windows/${id}.html`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('not found');
    fragment = await res.text();
  } catch (e) {
    // try /pages/
    try {
      const res = await fetch(`/pages/${id}.html`);
      if (!res.ok) throw e;
      fragment = await res.text();
    } catch {
      fragment = `<p>⚠️ File not found: <code>${id}</code></p><button onclick="this.closest('.window').querySelector('.win-close').click()">Back</button>`;
    }
  }

  const clone = TEMPLATE.content.firstElementChild.cloneNode(true);
  clone.dataset.windowId = id;

  // Position with cascading offset
  const count = window.AppState.openWindows.size;
  const baseLeft = 80, baseTop = 60;
  clone.style.left = (baseLeft + count * 30) + 'px';
  clone.style.top  = (baseTop + count * 30) + 'px';
  clone.style.zIndex = nextZ();

  // Set title from fragment <h2 data-window-title> if present, else from id
  clone.querySelector('.window-body').innerHTML = fragment;
  const titleEl = clone.querySelector('[data-window-title]') || clone.querySelector('.window-body h2');
  const titleText = titleEl ? titleEl.textContent.trim() : id;
  clone.querySelector('.window-title').textContent = titleText;

  // Icon
  const iconImg = clone.querySelector('.window-icon');
  iconImg.src = `/assets/img/icons/${id.split('-')[0]}.png`;

  LAYER.appendChild(clone);
  window.AppState.openWindows.set(id, { el: clone });

  wireControls(clone, id);
  focusWindow(id);

  // i18n hook (filled in Task 11)
  if (window.applyI18n) window.applyI18n(clone);

  // Emit event for taskbar to update
  document.dispatchEvent(new CustomEvent('windows:changed'));
}

function wireControls(el, id) {
  el.querySelector('.win-close').addEventListener('click', () => closeWindow(id));
  el.querySelector('.win-min').addEventListener('click', () => minimizeWindow(id));
  el.querySelector('.win-max').addEventListener('click', () => toggleMaximize(id));
  el.addEventListener('pointerdown', () => focusWindow(id));
  el.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      el.querySelectorAll('[role="tab"]').forEach(t => t.classList.toggle('is-active', t === tab));
      el.querySelectorAll('[data-tab-panel]').forEach(p => p.classList.toggle('is-active', p.dataset.tabPanel === target));
    });
  });
}

export function focusWindow(id) {
  const inst = window.AppState.openWindows.get(id);
  if (!inst) return;
  document.querySelectorAll('.window.is-focused').forEach(w => w.classList.remove('is-focused'));
  inst.el.classList.add('is-focused');
  inst.el.classList.remove('is-minimized');
  inst.el.style.zIndex = nextZ();
  window.AppState.focusedWindowId = id;
  inst.el.focus();
}

export function closeWindow(id) {
  const inst = window.AppState.openWindows.get(id);
  if (!inst) return;
  inst.el.remove();
  window.AppState.openWindows.delete(id);
  document.dispatchEvent(new CustomEvent('windows:changed'));
}

export function minimizeWindow(id) {
  const inst = window.AppState.openWindows.get(id);
  if (!inst) return;
  inst.el.classList.add('is-minimized');
  document.dispatchEvent(new CustomEvent('windows:changed'));
}

export function toggleMaximize(id) {
  const inst = window.AppState.openWindows.get(id);
  if (!inst) return;
  inst.el.classList.toggle('is-maximized');
}

// Drag
export function makeDraggable(el) {
  const bar = el.querySelector('.window-titlebar');
  let ox = 0, oy = 0, dragging = false;

  bar.addEventListener('pointerdown', e => {
    if (e.target.closest('.window-controls')) return;
    dragging = true;
    ox = e.clientX - el.offsetLeft;
    oy = e.clientY - el.offsetTop;
    bar.setPointerCapture(e.pointerId);
  });

  bar.addEventListener('pointermove', e => {
    if (!dragging) return;
    const taskbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-h'));
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - taskbarH - 24;
    el.style.left = Math.max(0, Math.min(maxX, e.clientX - ox)) + 'px';
    el.style.top  = Math.max(0, Math.min(maxY, e.clientY - oy)) + 'px';
  });

  bar.addEventListener('pointerup', () => { dragging = false; });
  bar.addEventListener('pointercancel', () => { dragging = false; });
}
