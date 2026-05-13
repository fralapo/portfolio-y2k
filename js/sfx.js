// Sound effects: short Win7 audio cues triggered by UI events.
// Respects global audio toggle — silent when AppState.audio !== 'on'.
//
// Usage:  import { play } from './sfx.js'; play('win7-minimize');

const cache = new Map();

export function play(name, volume = 0.4) {
  if (window.AppState?.audio !== 'on') return;
  let a = cache.get(name);
  if (!a) {
    a = new Audio(`assets/audio/${name}.wav`);
    a.preload = 'auto';
    cache.set(name, a);
  }
  // Restart from beginning if already playing
  try {
    a.volume = volume;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch {}
}
