import { setLang } from './i18n.js';

const AUDIO_BTN = document.querySelector('.tray-audio');
const LANG_BTN  = document.querySelector('.tray-lang');

let audioEl;

function setAudioState(on) {
  window.AppState.audio = on ? 'on' : 'off';
  localStorage.setItem('audio', window.AppState.audio);
  AUDIO_BTN.textContent = on ? '🔊' : '🔇';
  AUDIO_BTN.setAttribute('aria-pressed', String(on));
  AUDIO_BTN.dataset.i18nAria = on ? 'tray.audio.on' : 'tray.audio.off';
  if (on) {
    audioEl ??= new Audio('assets/audio/ambient.ogg');
    audioEl.loop = true; audioEl.volume = 0.3;
    audioEl.play().catch(() => setAudioState(false));
  } else if (audioEl) {
    audioEl.pause();
  }
}

export function initTray() {
  // Audio default OFF regardless of localStorage on first interaction (autoplay policy)
  setAudioState(false);
  AUDIO_BTN.addEventListener('click', () => setAudioState(window.AppState.audio === 'off'));

  // Lang toggle
  LANG_BTN.addEventListener('click', async () => {
    const next = window.AppState.lang === 'it' ? 'en' : 'it';
    await setLang(next);
    LANG_BTN.textContent = next === 'it' ? '🇮🇹' : '🇬🇧';
    LANG_BTN.dataset.currentLang = next;
  });

  // Init flag based on current lang
  LANG_BTN.textContent = window.AppState.lang === 'it' ? '🇮🇹' : '🇬🇧';
}
