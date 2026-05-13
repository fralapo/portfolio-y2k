let dictionary = {};

export async function loadDictionary(lang) {
  const res = await fetch(`/i18n/${lang}.json`);
  if (!res.ok) throw new Error('i18n fetch failed');
  dictionary = await res.json();
  document.documentElement.lang = lang;
  document.documentElement.dataset.i18nLang = lang;
}

export function t(key) {
  return dictionary[key] ?? key;
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (dictionary[k] !== undefined) el.textContent = dictionary[k];
  });
  root.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const k = el.dataset.i18nAria;
    if (dictionary[k] !== undefined) el.setAttribute('aria-label', dictionary[k]);
  });
}

export async function setLang(lang) {
  await loadDictionary(lang);
  applyI18n();
  window.AppState.lang = lang;
  localStorage.setItem('lang', lang);
  // Announce
  const live = document.querySelector('[aria-live="polite"]');
  if (live) live.textContent = t('lang.changed');
  document.dispatchEvent(new CustomEvent('lang:changed', { detail: lang }));
}
