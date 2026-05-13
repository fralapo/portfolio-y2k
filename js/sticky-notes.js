const POSITIONS = [
  { top: '40%', right: '8%',  rot:  4 },
  { top: '70%', left: '12%',  rot: -3 },
  { top: '20%', right: '4%', rot:  2 },
];

export function initStickyNotes() {
  const layer = document.querySelector('.sticky-notes');
  POSITIONS.forEach((pos, i) => {
    const note = document.createElement('div');
    note.className = 'sticky';
    note.setAttribute('role', 'note');
    note.style.transform = `rotate(${pos.rot}deg)`;
    Object.assign(note.style, pos);
    note.innerHTML = `<span data-i18n="sticky.${i}">📌</span>`;
    layer.appendChild(note);
    makeDraggable(note);
  });
  if (window.applyI18n) window.applyI18n(layer);
}

function makeDraggable(el) {
  let ox=0, oy=0, dragging=false;
  el.addEventListener('pointerdown', e => {
    dragging = true;
    ox = e.clientX - el.offsetLeft;
    oy = e.clientY - el.offsetTop;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', e => {
    if (!dragging) return;
    el.style.right = 'auto'; el.style.bottom = 'auto';
    el.style.left = (e.clientX - ox) + 'px';
    el.style.top  = (e.clientY - oy) + 'px';
  });
  el.addEventListener('pointerup', () => { dragging = false; });
}
