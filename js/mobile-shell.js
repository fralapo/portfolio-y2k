import { setLang } from './i18n.js';

const MQ = window.matchMedia('(max-width: 768px)');

async function openMetroWindow(id) {
  const win = document.getElementById('metro-window');
  const body = win.querySelector('.metro-window-body');
  let fragment = '<p>⚠️ Not found</p>';
  try {
    const res = await fetch(`/windows/${id}.html`) ;
    if (res.ok) fragment = await res.text();
    else {
      const r2 = await fetch(`/pages/${id}.html`);
      if (r2.ok) fragment = await r2.text();
    }
  } catch {}
  body.innerHTML = fragment;
  if (window.applyI18n) window.applyI18n(body);
  win.classList.add('is-open');
  win.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMetroWindow() {
  const win = document.getElementById('metro-window');
  win.classList.remove('is-open');
  win.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initMobileShell() {
  if (!MQ.matches) return;

  document.querySelectorAll('.metro-tile[data-window]').forEach(t => {
    t.addEventListener('click', () => openMetroWindow(t.dataset.window));
  });
  document.querySelector('#metro-window .back').addEventListener('click', closeMetroWindow);

  const langBtn = document.querySelector('.metro-lang');
  langBtn.textContent = window.AppState.lang.toUpperCase();
  langBtn.addEventListener('click', async () => {
    const next = window.AppState.lang === 'it' ? 'en' : 'it';
    await setLang(next);
    langBtn.textContent = next.toUpperCase();
  });
}
