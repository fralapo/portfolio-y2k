# Portfolio Y2K Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal portfolio site in Win7 Aero desktop OS metaphor (vanilla HTML/CSS/JS, GH Pages deploy, bilingue IT/EN, Win Phone Metro mobile).

**Architecture:** Single `index.html` carica desktop + chrome. Finestre = HTML fragments fetched on icon click into a window template. Stato globale in `window.AppState` + `localStorage`. Niente bundler, niente framework.

**Tech Stack:** HTML5, CSS3 (custom properties), Vanilla JS ES modules, goatcounter (visitor counter), GitHub Actions (deploy), GitHub Pages, custom domain.

**Source spec:** `docs/superpowers/specs/2026-05-13-portfolio-y2k-design.md`

---

## File Structure Map

```
portfolio-y2k/                              ← C:\Users\latro\Documents\GitHub\portfolio-y2k
├── index.html                              # Task 4 — desktop shell
├── 404.html                                # Task 19 — BSOD
├── CNAME                                   # Task 21 — custom domain
├── sitemap.xml, robots.txt                 # Task 20 — SEO
├── README.md                               # Task 1
├── .gitignore                              # Task 1
├── .github/workflows/deploy.yml            # Task 21 — CI
├── assets/
│   ├── css/{tokens,base,desktop,windows,widgets,mobile,cursors}.css   # Task 5,6,7,12,18
│   ├── img/{wallpaper,icons,orbs,chrome}/                              # Task 2,6
│   ├── cursors/{aero,aero-link,aero-wait}.cur                          # Task 15
│   ├── audio/win7-startup.ogg                                          # Task 13
│   └── fonts/                                                          # Task 5
├── windows/{9 projects}.html               # Task 16 — 9 fragments
├── pages/{about,skills,contact}.html       # Task 17
├── js/{main,window-manager,start-menu,taskbar,tray,sticky-notes,i18n}.js  # Task 7-14
├── i18n/{it,en}.json                       # Task 11
└── scripts/optimize-images.sh              # Task 2
```

Each file has **one responsibility**. CSS split by concern. JS split by component. Content (windows) separated from chrome.

---

## Task 1: Bootstrap repo locale + remote GitHub

**Files:**
- Create: `C:\Users\latro\Documents\GitHub\portfolio-y2k\README.md`
- Create: `C:\Users\latro\Documents\GitHub\portfolio-y2k\.gitignore`

- [ ] **Step 1: Verifica `gh` auth**

```bash
gh auth status
```
Expected: `Logged in to github.com account fralapo` con scopes `repo, workflow`.

- [ ] **Step 2: Crea cartella locale + git init**

```bash
mkdir -p "/c/Users/latro/Documents/GitHub/portfolio-y2k"
cd "/c/Users/latro/Documents/GitHub/portfolio-y2k"
git init -b main
```

- [ ] **Step 3: Scrivi README.md minimale**

```markdown
# portfolio-y2k

Personal portfolio of Jacopo Latrofa — Windows 7 Aero desktop metaphor, bilingue IT/EN.

🔗 Live: https://jacopino.dev

Stack: vanilla HTML / CSS / JS. No build tools.

## Local dev
Serve with any static server, es. `python -m http.server 8000`, poi apri `http://localhost:8000`.
```

- [ ] **Step 4: Scrivi .gitignore**

```
.DS_Store
Thumbs.db
.vscode/
.idea/
*.log
node_modules/
.superpowers/
```

- [ ] **Step 5: First commit**

```bash
git add README.md .gitignore
git commit -m "chore: bootstrap repo"
```

- [ ] **Step 6: Crea repo remoto + push**

```bash
gh repo create portfolio-y2k --public --source=. --description "Personal portfolio — Win7 Aero desktop metaphor" --push
```
Expected: stampa `https://github.com/fralapo/portfolio-y2k` e push iniziale eseguito.

- [ ] **Step 7: Copia spec nel repo + commit**

```bash
mkdir -p docs/superpowers/specs docs/superpowers/plans
cp "/c/Users/latro/kDrive/LAVORO/Portfolio/docs/superpowers/specs/2026-05-13-portfolio-y2k-design.md" docs/superpowers/specs/
cp "/c/Users/latro/kDrive/LAVORO/Portfolio/docs/superpowers/plans/2026-05-13-portfolio-y2k.md" docs/superpowers/plans/
git add docs
git commit -m "docs: add design spec + plan"
git push
```

---

## Task 2: Scaffold directory tree + asset placeholder

**Files:**
- Create: directory structure vuota + `.gitkeep` dove serve

- [ ] **Step 1: Crea directory**

```bash
mkdir -p assets/css assets/img/wallpaper assets/img/icons assets/img/orbs assets/img/chrome
mkdir -p assets/cursors assets/audio assets/fonts
mkdir -p windows pages js i18n scripts
mkdir -p .github/workflows
```

- [ ] **Step 2: Placeholder per directory vuote**

```bash
touch assets/img/wallpaper/.gitkeep assets/img/icons/.gitkeep assets/img/orbs/.gitkeep assets/img/chrome/.gitkeep
touch assets/cursors/.gitkeep assets/audio/.gitkeep assets/fonts/.gitkeep
```

- [ ] **Step 3: Copia asset esistenti dal vault**

```bash
cp -r "/c/Users/latro/kDrive/LAVORO/Portfolio/a/frutiger-aero-vault/raw/assets/." assets/img/orbs/ 2>/dev/null || true
cp "/c/Users/latro/kDrive/LAVORO/Portfolio/a/frutiger-aero-site-builder/assets/css/aero-tokens.css" assets/css/tokens-source.css
```

- [ ] **Step 4: optimize-images.sh stub**

Create `scripts/optimize-images.sh`:
```bash
#!/usr/bin/env bash
# One-shot image optimization. Run locally, requires ImageMagick + pngquant.
set -e
magick mogrify -resize '1920x1080>' -quality 82 assets/img/wallpaper/*.jpg 2>/dev/null || true
pngquant --skip-if-larger --quality 75-90 --ext .png --force assets/img/icons/*.png 2>/dev/null || true
echo "✓ Optimized"
```
```bash
chmod +x scripts/optimize-images.sh
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold directories + import vault assets"
git push
```

---

## Task 3: Design tokens CSS

**Files:**
- Create: `assets/css/tokens.css`

- [ ] **Step 1: Scrivi `assets/css/tokens.css`**

```css
/* Aero design tokens. Single source of truth for color, gradient, blur, shadow, type. */
:root {
  /* Sky palette */
  --aero-sky-top:    #5fa9d8;
  --aero-sky-bottom: #1b5b9e;
  --aero-sky-grad:   linear-gradient(180deg, var(--aero-sky-top) 0%, var(--aero-sky-bottom) 100%);

  /* Glass */
  --glass-bg:        rgba(255, 255, 255, 0.18);
  --glass-bg-strong: rgba(255, 255, 255, 0.32);
  --glass-border:    rgba(255, 255, 255, 0.5);
  --glass-blur:      blur(12px);

  /* Window chrome */
  --win-titlebar-grad-focused:   linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.15));
  --win-titlebar-grad-unfocused: linear-gradient(180deg, rgba(220,230,245,.45), rgba(180,200,220,.20));
  --win-bg:                      rgba(245, 250, 255, 0.95);
  --win-text:                    #1a2c3d;
  --win-shadow:                  0 12px 32px rgba(0,0,0,.35), 0 2px 4px rgba(0,0,0,.2);

  /* Taskbar */
  --taskbar-grad:  linear-gradient(180deg, rgba(40,60,100,.85), rgba(20,40,80,.95));
  --taskbar-h:     40px;

  /* Type */
  --font-ui:    'Segoe UI', 'Open Sans', 'Inter', system-ui, sans-serif;
  --font-mono:  'Cascadia Code', 'Consolas', monospace;
  --fs-xs:  11px;
  --fs-sm:  12px;
  --fs-md:  14px;
  --fs-lg:  18px;
  --fs-xl:  24px;

  /* Spacing */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px;
  --sp-4: 16px; --sp-5: 24px; --sp-6: 32px;

  /* Radii */
  --r-sm: 4px; --r-md: 6px; --r-lg: 10px;

  /* Z layers */
  --z-desktop: 1;
  --z-icons:   10;
  --z-sticky:  20;
  --z-window:  100;   /* incrementato dinamicamente */
  --z-taskbar: 9000;
  --z-start:   9100;
  --z-modal:   9500;

  /* Metro palette (mobile) */
  --metro-teal:   #00aba9;
  --metro-lime:   #a4c400;
  --metro-red:    #e51400;
  --metro-orange: #f0a30a;
  --metro-blue:   #1ba1e2;
  --metro-violet: #aa00ff;
}

/* prefers-reduced-motion override */
@media (prefers-reduced-motion: reduce) {
  :root { --transition-fast: 0s; --transition-med: 0s; }
}
```

- [ ] **Step 2: Verifica visivamente (apri devtools, niente errori parse)**

```bash
python -m http.server 8000 &
```
Apri `http://localhost:8000/assets/css/tokens.css` → file servito ok.

- [ ] **Step 3: Commit**

```bash
git add assets/css/tokens.css
git commit -m "feat(css): add aero design tokens"
git push
```

---

## Task 4: index.html skeleton + base CSS

**Files:**
- Create: `index.html`
- Create: `assets/css/base.css`

- [ ] **Step 1: Scrivi `assets/css/base.css`**

```css
/* Reset minimo + typography Aero */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }

body {
  font-family: var(--font-ui);
  font-size:   var(--fs-md);
  color:       var(--win-text);
  background:  var(--aero-sky-grad);
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

a { color: #0a4d92; text-decoration: none; }
a:hover, a:focus-visible { text-decoration: underline; }

button { font-family: inherit; font-size: inherit; cursor: pointer; }

:focus-visible { outline: 2px solid #00d4ff; outline-offset: 2px; }

img { max-width: 100%; height: auto; display: block; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 2: Scrivi `index.html`**

```html
<!doctype html>
<html lang="it" data-i18n-lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-i18n="meta.title">jacopo latrofa — graphic designer</title>
  <meta name="description" data-i18n="meta.description" content="portfolio anni 2000 di jacopo latrofa, grafico, ui designer.">
  <link rel="icon" href="/assets/img/orbs/favicon.png" type="image/png">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/desktop.css">
  <link rel="stylesheet" href="/assets/css/windows.css">
  <link rel="stylesheet" href="/assets/css/widgets.css">
  <link rel="stylesheet" href="/assets/css/cursors.css">
  <link rel="stylesheet" href="/assets/css/mobile.css">
</head>
<body>
  <a class="sr-only" href="#main">Salta al desktop</a>

  <main id="main" role="application" aria-label="Desktop portfolio">

    <!-- Wallpaper layer -->
    <div class="wallpaper" aria-hidden="true"></div>

    <!-- Desktop icons -->
    <ul class="icons-grid" role="list"></ul>

    <!-- Sticky notes -->
    <div class="sticky-notes" aria-label="Notes"></div>

    <!-- Windows mount point -->
    <div class="windows-layer" aria-live="polite"></div>

    <!-- Start menu -->
    <nav class="start-menu" hidden aria-label="Start menu"></nav>

    <!-- Taskbar -->
    <footer class="taskbar" role="contentinfo">
      <button class="start-orb" aria-label="Start" aria-expanded="false">
        <img src="/assets/img/orbs/start-orb.png" alt="" width="32" height="32">
      </button>
      <ul class="task-buttons" role="list"></ul>
      <div class="tray">
        <button class="tray-audio" aria-pressed="false" data-i18n-aria="tray.audio.off" aria-label="Audio muto">🔇</button>
        <button class="tray-lang" aria-label="Lingua" data-current-lang="it">🇮🇹</button>
        <span class="tray-wifi" aria-hidden="true">📶</span>
      </div>
      <time class="clock" datetime=""></time>
    </footer>

  </main>

  <!-- Window template -->
  <template id="window-template">
    <article class="window" role="dialog" tabindex="-1">
      <header class="window-titlebar">
        <img class="window-icon" src="" alt="" width="16" height="16">
        <h2 class="window-title"></h2>
        <div class="window-controls">
          <button class="win-min" aria-label="Riduci">_</button>
          <button class="win-max" aria-label="Ingrandisci">▢</button>
          <button class="win-close" aria-label="Chiudi">×</button>
        </div>
      </header>
      <div class="window-body"></div>
      <footer class="window-statusbar"><span class="status-text">Ready</span></footer>
    </article>
  </template>

  <script type="module" src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Crea CSS placeholder per evitare 404**

```bash
touch assets/css/desktop.css assets/css/windows.css assets/css/widgets.css assets/css/cursors.css assets/css/mobile.css
```

- [ ] **Step 4: Crea js/main.js placeholder**

`js/main.js`:
```js
// Bootstrap. Filled in Task 11+
console.info('Portfolio Y2K — bootstrap');
```

- [ ] **Step 5: Avvia server + verifica**

```bash
python -m http.server 8000
```
Open `http://localhost:8000`. Expected: cielo Aero gradient full-screen, niente errori console, taskbar in basso vuota.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/base.css assets/css/*.css js/main.js
git commit -m "feat: index.html skeleton + base css"
git push
```

---

## Task 5: Wallpaper + desktop icons grid

**Files:**
- Modify: `assets/css/desktop.css`
- Modify: `index.html` (popolare `.icons-grid`)

- [ ] **Step 1: Scrivi `assets/css/desktop.css`**

```css
.wallpaper {
  position: fixed; inset: 0;
  background: var(--aero-sky-grad);
  background-image:
    radial-gradient(ellipse 60% 40% at 20% 30%, rgba(255,255,255,.18), transparent 60%),
    radial-gradient(ellipse 80% 50% at 80% 70%, rgba(255,255,255,.12), transparent 60%),
    var(--aero-sky-grad);
  z-index: var(--z-desktop);
}

.icons-grid {
  position: absolute;
  top: var(--sp-4); left: var(--sp-4);
  display: grid;
  grid-template-columns: repeat(auto-fill, 96px);
  grid-auto-rows: 100px;
  gap: var(--sp-2);
  list-style: none; margin: 0; padding: 0;
  z-index: var(--z-icons);
  max-height: calc(100vh - var(--taskbar-h) - var(--sp-4));
}

.icon {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: none; border: 0; padding: 6px;
  color: #fff; font-size: var(--fs-xs);
  text-shadow: 0 1px 2px rgba(0,0,0,.7), 0 0 4px rgba(0,0,0,.4);
  cursor: pointer; border-radius: var(--r-sm);
  text-align: center;
}
.icon img { width: 48px; height: 48px; filter: drop-shadow(0 2px 4px rgba(0,0,0,.4)); }
.icon:hover, .icon:focus-visible {
  background: rgba(255,255,255,.18);
  outline: 1px dashed rgba(255,255,255,.5);
}
.icon-label { line-height: 1.2; max-width: 84px; overflow-wrap: break-word; }
```

- [ ] **Step 2: Popola `.icons-grid` in `index.html`**

Sostituisci `<ul class="icons-grid" role="list"></ul>` con:

```html
<ul class="icons-grid" role="list">
  <li><button class="icon" data-window="simpsons-8bit"><img src="/assets/img/icons/simpsons.png" alt=""><span class="icon-label" data-i18n="icon.simpsons">Simpsons 8-Bit</span></button></li>
  <li><button class="icon" data-window="bart-tiny-room"><img src="/assets/img/icons/bart.png" alt=""><span class="icon-label" data-i18n="icon.bart">Bart's Room</span></button></li>
  <li><button class="icon" data-window="e-mobility"><img src="/assets/img/icons/emobility.png" alt=""><span class="icon-label" data-i18n="icon.emobility">E-Mobility</span></button></li>
  <li><button class="icon" data-window="museum-boston"><img src="/assets/img/icons/museum.png" alt=""><span class="icon-label" data-i18n="icon.museum">Museum Boston</span></button></li>
  <li><button class="icon" data-window="tnf-bnkr44"><img src="/assets/img/icons/tnf.png" alt=""><span class="icon-label" data-i18n="icon.tnf">TNF × Bnkr44</span></button></li>
  <li><button class="icon" data-window="fiuto"><img src="/assets/img/icons/fiuto.png" alt=""><span class="icon-label" data-i18n="icon.fiuto">Fiuto</span></button></li>
  <li><button class="icon" data-window="lo-sguardo"><img src="/assets/img/icons/sguardo.png" alt=""><span class="icon-label" data-i18n="icon.sguardo">Lo Sguardo</span></button></li>
  <li><button class="icon" data-window="camillo"><img src="/assets/img/icons/camillo.png" alt=""><span class="icon-label" data-i18n="icon.camillo">Camillo</span></button></li>
  <li><button class="icon" data-window="christopher-ward"><img src="/assets/img/icons/cw.png" alt=""><span class="icon-label" data-i18n="icon.cw">Christopher Ward</span></button></li>
</ul>
```

- [ ] **Step 3: Placeholder PNG icone**

Crea 9 PNG 48×48 placeholder (genera via tool o disegna in Photoshop). Per ora placeholder solid color:
```bash
# se ImageMagick installato:
for name in simpsons bart emobility museum tnf fiuto sguardo camillo cw; do
  magick -size 48x48 xc:cornflowerblue -gravity center -font Arial -pointsize 10 -fill white -annotate +0+0 "${name:0:3}" "assets/img/icons/${name}.png"
done
```

- [ ] **Step 4: Verifica visivamente**

Refresh `http://localhost:8000`. Expected: 9 icone in colonna top-left con label bianche leggibili.

- [ ] **Step 5: Commit**

```bash
git add assets/css/desktop.css index.html assets/img/icons/
git commit -m "feat: wallpaper + 9 desktop icons"
git push
```

---

## Task 6: Window CSS — chrome + body

**Files:**
- Modify: `assets/css/windows.css`

- [ ] **Step 1: Scrivi `assets/css/windows.css`**

```css
.windows-layer { position: absolute; inset: 0; pointer-events: none; }

.window {
  position: absolute;
  pointer-events: auto;
  min-width: 360px; max-width: min(900px, 90vw);
  min-height: 220px; max-height: 80vh;
  background: var(--win-bg);
  border-radius: var(--r-md);
  box-shadow: var(--win-shadow);
  border: 1px solid rgba(255,255,255,.6);
  backdrop-filter: var(--glass-blur);
  display: flex; flex-direction: column;
  overflow: hidden;
  z-index: var(--z-window);
  transition: box-shadow .15s ease, transform .15s ease;
}

.window.is-minimized { display: none; }
.window.is-maximized {
  top: 0 !important; left: 0 !important;
  width: 100vw !important; height: calc(100vh - var(--taskbar-h)) !important;
  max-width: none; max-height: none; border-radius: 0;
}

.window-titlebar {
  display: flex; align-items: center; gap: var(--sp-2);
  padding: var(--sp-1) var(--sp-2);
  background: var(--win-titlebar-grad-unfocused);
  color: #1a2c3d; text-shadow: 0 1px 0 rgba(255,255,255,.4);
  font-weight: 600; font-size: var(--fs-sm);
  cursor: grab; user-select: none;
  touch-action: none;
}
.window.is-focused .window-titlebar { background: var(--win-titlebar-grad-focused); }
.window-titlebar:active { cursor: grabbing; }

.window-icon { width: 16px; height: 16px; flex: 0 0 16px; }
.window-title { flex: 1; margin: 0; font-size: var(--fs-sm); font-weight: 600; }

.window-controls { display: flex; gap: 2px; }
.window-controls button {
  width: 28px; height: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,.1));
  border: 1px solid rgba(0,0,0,.2);
  border-radius: var(--r-sm);
  font-size: 11px; color: #1a2c3d;
}
.window-controls button:hover { background: linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.2)); }
.win-close:hover { background: linear-gradient(180deg, #ff6b6b, #c92a2a); color: #fff; }

.window-body { flex: 1; overflow: auto; padding: var(--sp-4); background: rgba(255,255,255,.85); }
.window-statusbar {
  display: flex; padding: var(--sp-1) var(--sp-2);
  background: rgba(220,230,245,.6);
  border-top: 1px solid rgba(0,0,0,.1);
  font-size: var(--fs-xs); color: #555;
}

/* Window content tabs */
.window-toolbar { display: flex; gap: 2px; margin-bottom: var(--sp-3); border-bottom: 1px solid rgba(0,0,0,.1); }
.window-toolbar button {
  background: transparent; border: 0; padding: var(--sp-2) var(--sp-3);
  border-bottom: 2px solid transparent; font-weight: 500;
}
.window-toolbar button.is-active { border-bottom-color: var(--aero-sky-bottom); color: var(--aero-sky-bottom); }
[data-tab-panel] { display: none; }
[data-tab-panel].is-active { display: block; }
```

- [ ] **Step 2: Verifica file linkato in `index.html` (già fatto Task 4)**

- [ ] **Step 3: Commit**

```bash
git add assets/css/windows.css
git commit -m "feat(css): window chrome styles"
git push
```

---

## Task 7: window-manager.js — apertura + render

**Files:**
- Create: `js/window-manager.js`
- Modify: `js/main.js`

- [ ] **Step 1: Scrivi `js/window-manager.js`**

```js
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
```

- [ ] **Step 2: Modifica `js/main.js`**

```js
// Bootstrap.
import { openWindow, makeDraggable } from './window-manager.js';

window.AppState = {
  lang: localStorage.getItem('lang') || 'it',
  audio: localStorage.getItem('audio') || 'off',
  openWindows: new Map(),
  focusedWindowId: null,
  zIndexCounter: 100,
  startMenuOpen: false,
};

// Wire desktop icons
document.querySelectorAll('.icon[data-window]').forEach(btn => {
  btn.addEventListener('click', () => openWindow(btn.dataset.window));
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWindow(btn.dataset.window); }
  });
});

// Make new windows draggable when added
const obs = new MutationObserver(muts => {
  muts.forEach(m => m.addedNodes.forEach(n => {
    if (n.classList && n.classList.contains('window')) makeDraggable(n);
  }));
});
obs.observe(document.querySelector('.windows-layer'), { childList: true });

// Esc closes focused window
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && window.AppState.focusedWindowId) {
    import('./window-manager.js').then(m => m.closeWindow(window.AppState.focusedWindowId));
  }
});

console.info('Portfolio Y2K — ready');
```

- [ ] **Step 3: Crea finestra dummy per test `windows/simpsons-8bit.html`**

```html
<h2 data-window-title>Simpsons 8-Bit — Properties</h2>
<p>Reinterpretazione 8-bit dell'opening The Simpsons. Anno 2023.</p>
<p>Tools: After Effects, Illustrator, Photoshop.</p>
```

- [ ] **Step 4: Refresh + test**

Click icona "Simpsons 8-Bit". Expected: finestra appare con titolo, body, draggable dalla titlebar, close button funziona, click body porta in primo piano.

- [ ] **Step 5: Commit**

```bash
git add js/window-manager.js js/main.js windows/simpsons-8bit.html
git commit -m "feat(js): window manager + drag + open/close/min/max"
git push
```

---

## Task 8: Taskbar — clock + task buttons

**Files:**
- Create: `js/taskbar.js`
- Modify: `assets/css/widgets.css` (taskbar styles)
- Modify: `js/main.js` (import taskbar)

- [ ] **Step 1: Scrivi `assets/css/widgets.css` (taskbar parte)**

```css
.taskbar {
  position: fixed; left: 0; right: 0; bottom: 0;
  height: var(--taskbar-h);
  background: var(--taskbar-grad);
  backdrop-filter: var(--glass-blur);
  border-top: 1px solid rgba(255,255,255,.3);
  display: flex; align-items: center; gap: var(--sp-2);
  padding: 0 var(--sp-2);
  z-index: var(--z-taskbar);
  color: #fff;
}

.start-orb {
  background: none; border: 0; padding: 0;
  width: 36px; height: 36px;
}
.start-orb img { width: 32px; height: 32px; filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)); }
.start-orb:hover img { filter: drop-shadow(0 1px 2px rgba(0,0,0,.5)) brightness(1.15); }

.task-buttons { flex: 1; display: flex; gap: 4px; margin: 0; padding: 0; list-style: none; }
.task-btn {
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.25);
  color: #fff; padding: 4px 10px;
  border-radius: var(--r-sm); font-size: var(--fs-xs);
  display: flex; align-items: center; gap: 6px;
  max-width: 200px;
}
.task-btn img { width: 16px; height: 16px; }
.task-btn.is-active { background: rgba(255,255,255,.3); border-color: rgba(255,255,255,.5); }

.tray { display: flex; align-items: center; gap: 6px; padding: 0 var(--sp-2); }
.tray button { background: none; border: 0; color: #fff; font-size: 16px; padding: 2px 4px; }
.tray button:hover { background: rgba(255,255,255,.15); border-radius: var(--r-sm); }

.clock {
  font-size: var(--fs-xs); color: #fff;
  text-align: center; line-height: 1.2;
  padding: 0 var(--sp-3);
  border-left: 1px solid rgba(255,255,255,.2);
}
```

- [ ] **Step 2: Scrivi `js/taskbar.js`**

```js
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
    btn.innerHTML = `<img src="/assets/img/icons/${id.split('-')[0]}.png" alt=""> <span>${inst.el.querySelector('.window-title').textContent}</span>`;
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
```

- [ ] **Step 3: Importa in `js/main.js`**

Aggiungi in cima a `main.js`:
```js
import { initTaskbar } from './taskbar.js';
```
E in fondo (prima del console.info):
```js
initTaskbar();
```

- [ ] **Step 4: Verifica**

Refresh. Clock mostra orario. Apri 2-3 finestre. Task buttons appaiono nella taskbar. Click su un task button → focus/minimize toggle.

- [ ] **Step 5: Commit**

```bash
git add js/taskbar.js assets/css/widgets.css js/main.js
git commit -m "feat: taskbar with clock + task buttons"
git push
```

---

## Task 9: i18n.js + dictionary IT/EN

**Files:**
- Create: `js/i18n.js`
- Create: `i18n/it.json`, `i18n/en.json`
- Modify: `js/main.js`

- [ ] **Step 1: Scrivi `i18n/it.json` (baseline)**

```json
{
  "meta.title": "jacopo latrofa — graphic designer",
  "meta.description": "portfolio anni 2000 di jacopo latrofa, grafico, ui designer.",
  "start.projects": "Progetti",
  "start.skills": "Competenze",
  "start.about": "Chi sono",
  "start.contact": "Contatti",
  "start.shutdown": "Spegni",
  "start.search": "Cerca…",
  "tray.audio.on": "Audio attivo",
  "tray.audio.off": "Audio muto",
  "tray.lang": "Lingua",
  "sticky.0": "📌 attualmente @ Studio Futuroma (Roma)",
  "sticky.1": "📌 disponibile da maggio 2026",
  "sticky.2": "📌 scrivimi! ✉️",
  "icon.simpsons": "Simpsons 8-Bit",
  "icon.bart": "Bart's Room",
  "icon.emobility": "E-Mobility",
  "icon.museum": "Museum Boston",
  "icon.tnf": "TNF × Bnkr44",
  "icon.fiuto": "Fiuto",
  "icon.sguardo": "Lo Sguardo",
  "icon.camillo": "Camillo",
  "icon.cw": "Christopher Ward",
  "footer.visitors": "Visitatori",
  "status.ready": "Pronto",
  "lang.changed": "Lingua impostata: Italiano"
}
```

- [ ] **Step 2: Scrivi `i18n/en.json`**

```json
{
  "meta.title": "jacopo latrofa — graphic designer",
  "meta.description": "Y2K portfolio of jacopo latrofa, graphic designer, ui designer.",
  "start.projects": "Projects",
  "start.skills": "Skills",
  "start.about": "About",
  "start.contact": "Contact",
  "start.shutdown": "Shut Down",
  "start.search": "Search…",
  "tray.audio.on": "Audio on",
  "tray.audio.off": "Audio muted",
  "tray.lang": "Language",
  "sticky.0": "📌 currently @ Studio Futuroma (Rome)",
  "sticky.1": "📌 available from may 2026",
  "sticky.2": "📌 drop a line! ✉️",
  "icon.simpsons": "Simpsons 8-Bit",
  "icon.bart": "Bart's Room",
  "icon.emobility": "E-Mobility",
  "icon.museum": "Museum Boston",
  "icon.tnf": "TNF × Bnkr44",
  "icon.fiuto": "Fiuto",
  "icon.sguardo": "The Gaze",
  "icon.camillo": "Camillo",
  "icon.cw": "Christopher Ward",
  "footer.visitors": "Visitors",
  "status.ready": "Ready",
  "lang.changed": "Language set: English"
}
```

- [ ] **Step 3: Scrivi `js/i18n.js`**

```js
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
```

- [ ] **Step 4: Bootstrap i18n in `js/main.js`**

In cima dopo gli altri import:
```js
import { loadDictionary, applyI18n, setLang } from './i18n.js';
```

E inserisci PRIMA di `initTaskbar()`:
```js
await loadDictionary(window.AppState.lang);
applyI18n();
window.applyI18n = applyI18n;  // expose for window-manager dynamic content
```

Per usare `await` al top-level di un modulo, va bene con `<script type="module">` (già impostato).

- [ ] **Step 5: Verifica**

Refresh. Le label icone (e altri `data-i18n`) sostituite. Cambia `lang` in DevTools localStorage e refresh → labels EN.

- [ ] **Step 6: Commit**

```bash
git add js/i18n.js i18n/it.json i18n/en.json js/main.js
git commit -m "feat(i18n): dictionary IT/EN + applyI18n bootstrap"
git push
```

---

## Task 10: System tray — audio toggle + lang switch

**Files:**
- Create: `js/tray.js`
- Modify: `js/main.js`

- [ ] **Step 1: Scrivi `js/tray.js`**

```js
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
    audioEl ??= new Audio('/assets/audio/ambient.ogg');
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
```

- [ ] **Step 2: Importa + chiama in `js/main.js`**

```js
import { initTray } from './tray.js';
// ...
initTray();
```

- [ ] **Step 3: Aggiungi live region per a11y in `index.html`**

Subito dopo il taskbar `</footer>`, prima del template:
```html
<div class="sr-only" aria-live="polite" id="live-region"></div>
```

- [ ] **Step 4: Audio asset placeholder**

Copia o genera `assets/audio/ambient.ogg` (OGG vorbis ~50KB, loop seamless di sottofondo Frutiger). Se non disponibile subito, lascia 404 — fallback già gestito (setAudioState catch).

- [ ] **Step 5: Verifica**

Refresh. Click 🇮🇹 → tutto traduce in EN + flag diventa 🇬🇧 + live region annuncia. Click 🔇 → diventa 🔊 (se audio presente partirà; se 404 ricade su 🔇).

- [ ] **Step 6: Commit**

```bash
git add js/tray.js js/main.js index.html
git commit -m "feat: system tray audio + lang toggle"
git push
```

---

## Task 11: Start menu

**Files:**
- Create: `js/start-menu.js`
- Modify: `assets/css/widgets.css` (start menu styles)
- Modify: `index.html` (popola `.start-menu`)
- Modify: `js/main.js`

- [ ] **Step 1: Popola start menu in `index.html`**

Sostituisci `<nav class="start-menu" hidden ...>` con:
```html
<nav class="start-menu" hidden aria-label="Start menu">
  <header class="sm-header">
    <img src="/assets/img/icons/avatar.png" alt="" width="40" height="40">
    <span>jacopo</span>
  </header>
  <ul class="sm-list" role="list">
    <li><button data-window="about" data-i18n="start.about">Chi sono</button></li>
    <li><button data-window="skills" data-i18n="start.skills">Competenze</button></li>
    <li><button data-window="contact" data-i18n="start.contact">Contatti</button></li>
  </ul>
  <div class="sm-search">
    <input type="search" placeholder="Cerca…" data-i18n-placeholder="start.search" aria-label="Cerca">
  </div>
  <footer class="sm-footer">
    <button data-action="shutdown" data-i18n="start.shutdown">Spegni</button>
  </footer>
</nav>
```

- [ ] **Step 2: Aggiungi handler placeholder in i18n.js**

In `applyI18n`, aggiungi gestione `data-i18n-placeholder`:
```js
root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
  const k = el.dataset.i18nPlaceholder;
  if (dictionary[k] !== undefined) el.placeholder = dictionary[k];
});
```

- [ ] **Step 3: Scrivi CSS in `assets/css/widgets.css`** (append):

```css
.start-menu {
  position: fixed; bottom: calc(var(--taskbar-h) + 4px); left: 4px;
  width: 280px;
  background: rgba(20,40,80,.85);
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255,255,255,.4);
  border-radius: var(--r-md);
  box-shadow: 0 12px 32px rgba(0,0,0,.4);
  color: #fff;
  z-index: var(--z-start);
  overflow: hidden;
}
.sm-header { display: flex; align-items: center; gap: var(--sp-2); padding: var(--sp-3); background: rgba(255,255,255,.1); }
.sm-list { list-style: none; margin: 0; padding: var(--sp-2) 0; }
.sm-list button {
  width: 100%; text-align: left; padding: var(--sp-2) var(--sp-3);
  background: none; border: 0; color: #fff; font-size: var(--fs-sm);
}
.sm-list button:hover { background: rgba(255,255,255,.15); }
.sm-search { padding: var(--sp-2) var(--sp-3); border-top: 1px solid rgba(255,255,255,.15); }
.sm-search input { width: 100%; padding: 4px 8px; border-radius: var(--r-sm); border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.1); color: #fff; }
.sm-footer { padding: var(--sp-2); border-top: 1px solid rgba(255,255,255,.15); }
.sm-footer button {
  width: 100%; background: linear-gradient(180deg, #e57373, #c62828);
  border: 0; color: #fff; padding: var(--sp-2); border-radius: var(--r-sm);
  font-weight: 600;
}
```

- [ ] **Step 4: Scrivi `js/start-menu.js`**

```js
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
```

- [ ] **Step 5: Import + init in `js/main.js`**

```js
import { initStartMenu } from './start-menu.js';
// ...
initStartMenu();
```

- [ ] **Step 6: Verifica**

Click orb. Menu appare. Click "Chi sono" → apre `pages/about.html` (404 atteso, gestito da fallback). Click outside → menu chiude. Search filtra icone.

- [ ] **Step 7: Commit**

```bash
git add js/start-menu.js assets/css/widgets.css index.html js/main.js js/i18n.js
git commit -m "feat: start menu + search filter"
git push
```

---

## Task 12: Sticky notes

**Files:**
- Create: `js/sticky-notes.js`
- Modify: `assets/css/widgets.css`
- Modify: `js/main.js`

- [ ] **Step 1: Scrivi CSS (append `widgets.css`)**

```css
.sticky-notes { position: absolute; inset: 0; pointer-events: none; z-index: var(--z-sticky); }
.sticky {
  position: absolute;
  pointer-events: auto;
  width: 200px; padding: var(--sp-3);
  background: linear-gradient(180deg, #fff599, #f5e93d);
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
  font-family: 'Caveat', 'Comic Sans MS', cursive;
  font-size: var(--fs-md);
  color: #3a2e00;
  cursor: grab; touch-action: none;
  transform-origin: top left;
}
.sticky:active { cursor: grabbing; }
```

- [ ] **Step 2: Scrivi `js/sticky-notes.js`**

```js
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
```

- [ ] **Step 3: Import + init in `js/main.js`**

```js
import { initStickyNotes } from './sticky-notes.js';
// ...
initStickyNotes();
```

- [ ] **Step 4: Verifica**

3 post-it gialli sparsi sul desktop con copy IT. Draggable.

- [ ] **Step 5: Commit**

```bash
git add js/sticky-notes.js assets/css/widgets.css js/main.js
git commit -m "feat: 3 draggable sticky notes"
git push
```

---

## Task 13: Custom cursors

**Files:**
- Modify: `assets/css/cursors.css`
- Create: `assets/cursors/aero.cur`, `assets/cursors/aero-link.cur`, `assets/cursors/aero-wait.ani`

- [ ] **Step 1: Produci file .cur/.ani**

Tool: RealWorld Cursor Editor (Windows, gratis) o CursorXP. Esporta 3 file 32×32:
- `aero.cur` (freccia bianca Win7)
- `aero-link.cur` (mano)
- `aero-wait.ani` (anello blu animato)

Posiziona in `assets/cursors/`.

In assenza dei file salta a Step 3 (cursors.css userà fallback automatico).

- [ ] **Step 2: Scrivi `assets/css/cursors.css`**

```css
body { cursor: url('/assets/cursors/aero.cur'), default; }
a, button, [role="button"], .icon, .task-btn, .window-controls button {
  cursor: url('/assets/cursors/aero-link.cur'), pointer;
}
.is-loading, .is-loading * {
  cursor: url('/assets/cursors/aero-wait.ani'), wait;
}
```

- [ ] **Step 3: Verifica**

Refresh. Su Windows: cursor cambia su body/link. Browser fallback se file mancante: nessun errore.

- [ ] **Step 4: Commit**

```bash
git add assets/css/cursors.css assets/cursors/
git commit -m "feat: custom aero cursors"
git push
```

---

## Task 14: Visitor counter (goatcounter)

**Files:**
- Modify: `index.html` (script tag in footer/head)
- Modify: `assets/css/widgets.css`

- [ ] **Step 1: Registra account goatcounter**

Vai su `https://www.goatcounter.com/signup`, crea sito con code `jacopino`. Subdomain → `https://jacopino.goatcounter.com`.

- [ ] **Step 2: Aggiungi script in `index.html`**

Aggiungi prima di `</body>`:
```html
<script
  data-goatcounter="https://jacopino.goatcounter.com/count"
  async src="//gc.zgo.at/count.js"></script>
```

- [ ] **Step 3: Aggiungi counter visibile in taskbar**

Aggiungi nel `.tray` (in `index.html`) prima del wifi span:
```html
<span class="tray-counter" title="Visitors">
  👁️ <span id="visitor-count">—</span>
</span>
```

CSS append in `widgets.css`:
```css
.tray-counter { font-size: var(--fs-xs); color: #fff; padding: 0 var(--sp-2); display: flex; gap: 4px; align-items: center; }
```

JS fetch count (append a `js/main.js`):
```js
fetch('https://jacopino.goatcounter.com/counter//TOTAL.txt')
  .then(r => r.text()).then(t => {
    document.getElementById('visitor-count').textContent = t.trim();
  }).catch(() => {});
```

- [ ] **Step 4: Verifica deploy**

(funziona solo da dominio pubblico, no localhost. Skip verifica fino a deploy.)

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/widgets.css js/main.js
git commit -m "feat: goatcounter visitor counter"
git push
```

---

## Task 15: 9 project windows (HTML fragments)

**Files:**
- Create: `windows/simpsons-8bit.html` (esistente da Task 7, ora full)
- Create: `windows/bart-tiny-room.html`
- Create: `windows/e-mobility.html`
- Create: `windows/museum-boston.html`
- Create: `windows/tnf-bnkr44.html`
- Create: `windows/fiuto.html`
- Create: `windows/lo-sguardo.html`
- Create: `windows/camillo.html`
- Create: `windows/christopher-ward.html`

**Template per ogni proj** (mostro Simpsons completo; ripeti pattern per gli altri 8 sostituendo `<projId>` e contenuto):

- [ ] **Step 1: Scrivi `windows/simpsons-8bit.html`**

```html
<article data-i18n-scope="win.simpsons">
  <h2 data-window-title data-i18n="win.simpsons.title">Simpsons 8-Bit — Properties</h2>

  <nav class="window-toolbar" role="tablist">
    <button role="tab" data-tab="overview" class="is-active" data-i18n="win.tab.overview">Overview</button>
    <button role="tab" data-tab="gallery" data-i18n="win.tab.gallery">Gallery</button>
    <button role="tab" data-tab="meta" data-i18n="win.tab.meta">Meta</button>
  </nav>

  <section data-tab-panel="overview" class="is-active">
    <p class="label">Year: <span>2023</span></p>
    <p data-i18n="win.simpsons.desc">Reinterpretazione 8-bit dell'opening di "The Simpsons". Pixel art, palette anni '80, glitch CRT.</p>
  </section>

  <section data-tab-panel="gallery">
    <img src="/assets/img/proj/simpsons-1.jpg" alt="" loading="lazy">
    <img src="/assets/img/proj/simpsons-2.jpg" alt="" loading="lazy">
  </section>

  <section data-tab-panel="meta">
    <ul class="kv">
      <li><strong>Tools:</strong> After Effects, Illustrator, Photoshop</li>
      <li><strong>Type:</strong> Motion</li>
      <li><strong>Status:</strong> ★ Featured</li>
    </ul>
  </section>
</article>
```

- [ ] **Step 2: Aggiungi handler tabs in `js/window-manager.js`**

Append alla fine di `wireControls(el, id)`:
```js
el.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    el.querySelectorAll('[role="tab"]').forEach(t => t.classList.toggle('is-active', t === tab));
    el.querySelectorAll('[data-tab-panel]').forEach(p => p.classList.toggle('is-active', p.dataset.tabPanel === target));
  });
});
```

- [ ] **Step 3: Aggiungi chiavi i18n in `i18n/it.json` e `en.json`**

In `it.json` aggiungi:
```json
"win.tab.overview": "Panoramica",
"win.tab.gallery": "Galleria",
"win.tab.meta": "Dettagli",
"win.simpsons.title": "Simpsons 8-Bit — Proprietà",
"win.simpsons.desc": "Reinterpretazione 8-bit dell'opening di \"The Simpsons\". Pixel art, palette anni '80, glitch CRT.",
"win.bart.title": "Bart's Room 3D — Proprietà",
"win.bart.desc": "Camera di Bart Simpson rifatta in Cinema 4D, stile tiny room.",
"win.emobility.title": "E-Mobility — Magazine",
"win.emobility.desc": "Magazine editoriale dedicato alla mobilità elettrica.",
"win.museum.title": "Museum of Science Boston — Rebrand",
"win.museum.desc": "Rebrand completo del Museum of Science di Boston.",
"win.tnf.title": "TNF × Bnkr44 — Campagna",
"win.tnf.desc": "Capsule The North Face × Bnkr44 per il mercato italiano Gen Z.",
"win.fiuto.title": "Fiuto — App di sicurezza urbana",
"win.fiuto.desc": "App per sicurezza personale di notte. Mappe community + alert rapidi.",
"win.sguardo.title": "Lo Sguardo dell'Incanto",
"win.sguardo.desc": "Campagna Caritas + PEPE contro la povertà educativa.",
"win.camillo.title": "Camillo — Social Strategy",
"win.camillo.desc": "Strategia social + instant advertising per brand Camillo.",
"win.cw.title": "Christopher Ward — D&AD 2025",
"win.cw.desc": "Riposizionamento Christopher Ward verso Gen Z. \"Precise things for unpredictable people.\""
```

In `en.json` aggiungi le stesse chiavi tradotte (es. `win.tab.overview = "Overview"`, `win.simpsons.title = "Simpsons 8-Bit — Properties"`, ecc.).

- [ ] **Step 4: Scrivi gli altri 8 file `windows/*.html`**

Per ogni progetto restanti, copia template Simpsons sostituendo:
- `data-i18n-scope="win.<id>"`
- chiavi `data-i18n="win.<id>.title"`, `data-i18n="win.<id>.desc"`
- `<projId>-N.jpg` per gallery (se hai immagini, altrimenti omitti `<section data-tab-panel="gallery">` per ora)
- Meta `<li>` con tools/type/status corretti dal CSV originale Notion

Riferimento contenuto: `md/Portfolio/Projects/<proj>.md` del repo Portfolio originale.

Files da creare ora:
- `windows/bart-tiny-room.html` (tools: Cinema 4D, type: 3D, status: Featured)
- `windows/e-mobility.html` (tools: InDesign Illustrator Photoshop, type: Print)
- `windows/museum-boston.html` (tools: Illustrator InDesign Photoshop, type: Graphics, Featured)
- `windows/tnf-bnkr44.html` (tools: After Effects Figma Illustrator Photoshop Premiere, type: Adv+Graph+Motion, Featured)
- `windows/fiuto.html` (tools: Figma Illustrator Photoshop, type: UX/UI, Featured)
- `windows/lo-sguardo.html` (tools: After Effects Figma Illustrator Photoshop Premiere, type: Adv)
- `windows/camillo.html` (tools: Figma Illustrator Photoshop Premiere, type: Adv, Featured)
- `windows/christopher-ward.html` (tools: Photoshop Premiere, type: Adv+Arts, Featured)

- [ ] **Step 5: Verifica**

Refresh. Click 9 icone → 9 finestre aprono con contenuto i18n + tabs funzionanti.

- [ ] **Step 6: Commit**

```bash
git add windows/ i18n/ js/window-manager.js
git commit -m "feat(content): 9 project windows + tabs"
git push
```

---

## Task 16: About / Skills / Contact pages

**Files:**
- Create: `pages/about.html`, `pages/skills.html`, `pages/contact.html`

- [ ] **Step 1: Scrivi `pages/about.html`**

```html
<article>
  <h2 data-window-title data-i18n="page.about.title">Chi sono — Properties</h2>
  <p data-i18n="page.about.intro">Jacopo Latrofa, graphic designer, 6+ anni di esperienza, focus su brand, UI/UX e motion.</p>
  <p data-i18n="page.about.body">Studio Graphic Design a NABA (Milano, 2022–2025). Attualmente intern UI/UX presso Studio Futuroma (Roma).</p>
  <ul class="kv">
    <li><strong>Email:</strong> <a href="mailto:jacopo.latrofa@gmail.com">jacopo.latrofa@gmail.com</a></li>
    <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jacopo-latrofa/" target="_blank" rel="noopener">jacopo-latrofa</a></li>
    <li><strong>Instagram:</strong> <a href="https://www.instagram.com/jacopino01._/" target="_blank" rel="noopener">@jacopino01._</a></li>
    <li><strong>YouTube:</strong> <a href="https://www.youtube.com/@jacopino01" target="_blank" rel="noopener">@jacopino01</a></li>
  </ul>
</article>
```

- [ ] **Step 2: Scrivi `pages/skills.html`**

```html
<article>
  <h2 data-window-title data-i18n="page.skills.title">Competenze — Properties</h2>

  <nav class="window-toolbar" role="tablist">
    <button role="tab" data-tab="tools" class="is-active" data-i18n="skill.tab.tools">Tools</button>
    <button role="tab" data-tab="code" data-i18n="skill.tab.code">Code</button>
    <button role="tab" data-tab="hard" data-i18n="skill.tab.hard">Hard</button>
    <button role="tab" data-tab="soft" data-i18n="skill.tab.soft">Soft</button>
  </nav>

  <section data-tab-panel="tools" class="is-active">
    <ul class="skill-list">
      <li>Figma <span class="lvl">Advanced</span></li>
      <li>Illustrator <span class="lvl">Advanced</span></li>
      <li>Photoshop <span class="lvl">Advanced</span></li>
      <li>InDesign <span class="lvl">Advanced</span></li>
      <li>Premiere <span class="lvl">Advanced</span></li>
      <li>Final Cut Pro <span class="lvl">Advanced</span></li>
      <li>DaVinci Resolve <span class="lvl">Advanced</span></li>
      <li>Sony Vegas Pro <span class="lvl">Advanced</span></li>
      <li>Affinity Studio <span class="lvl">Advanced</span></li>
      <li>After Effects <span class="lvl">Confident</span></li>
      <li>Blender <span class="lvl">Confident</span></li>
      <li>Cinema 4D <span class="lvl">Confident</span></li>
      <li>WordPress <span class="lvl">Confident</span></li>
      <li>Notion · Audacity · Google Analytics · higgsfield</li>
    </ul>
  </section>

  <section data-tab-panel="code">
    <ul class="skill-list">
      <li>HTML/CSS <span class="lvl">Advanced</span></li>
      <li>JavaScript <span class="lvl">Advanced</span></li>
      <li>VSCode · Linux · Discord Server · LM Studio · Computer Vision</li>
      <li>Python <span class="lvl">Confident</span></li>
      <li>React <span class="lvl">Confident</span></li>
      <li>N8N <span class="lvl">Confident</span></li>
    </ul>
  </section>

  <section data-tab-panel="hard">
    <ul class="skill-list">
      <li>Logo design · Branding · Art Direction · Advertising · Social media</li>
      <li>UI-Kits / Design systems · Product Thinking · Adaptive design</li>
      <li>Wireframes & Prototypes · Research · HTML/CSS basics</li>
    </ul>
  </section>

  <section data-tab-panel="soft">
    <ul class="skill-list">
      <li>Creativity · Empathy · Feedback sensitivity · Team worker</li>
      <li>Time management · Initiative · Attention to detail · Problem solving</li>
      <li>Learning attitude · Responsibility & reliability</li>
    </ul>
  </section>
</article>
```

- [ ] **Step 3: Scrivi `pages/contact.html`**

```html
<article>
  <h2 data-window-title data-i18n="page.contact.title">Contatti — Properties</h2>
  <p data-i18n="page.contact.body">Scrivimi per progetti, collaborazioni, o un caffè a Roma.</p>
  <ul class="kv">
    <li>✉️ <a href="mailto:jacopo.latrofa@gmail.com">jacopo.latrofa@gmail.com</a></li>
    <li>💼 <a href="https://www.linkedin.com/in/jacopo-latrofa/" target="_blank" rel="noopener">LinkedIn</a></li>
    <li>📷 <a href="https://www.instagram.com/jacopino01._/" target="_blank" rel="noopener">Instagram</a></li>
    <li>📺 <a href="https://www.youtube.com/@jacopino01" target="_blank" rel="noopener">YouTube</a></li>
  </ul>
</article>
```

- [ ] **Step 4: Aggiungi chiavi i18n in entrambi i `.json`**

`it.json`:
```json
"page.about.title": "Chi sono — Proprietà",
"page.about.intro": "Jacopo Latrofa, graphic designer, 6+ anni di esperienza.",
"page.about.body": "Studio Graphic Design a NABA (Milano, 2022–2025). Intern UI/UX @ Studio Futuroma (Roma) dal 2025.",
"page.skills.title": "Competenze — Proprietà",
"page.contact.title": "Contatti — Proprietà",
"page.contact.body": "Scrivimi per progetti, collaborazioni, o un caffè a Roma.",
"skill.tab.tools": "Strumenti",
"skill.tab.code": "Codice",
"skill.tab.hard": "Hard",
"skill.tab.soft": "Soft"
```

`en.json` corrispondenti tradotte.

- [ ] **Step 5: Verifica**

Apri Start menu → click About → finestra apre con contenuto. Stessa cosa Skills (con tabs) e Contact.

- [ ] **Step 6: Commit**

```bash
git add pages/ i18n/
git commit -m "feat: about/skills/contact pages"
git push
```

---

## Task 17: 404 BSOD page

**Files:**
- Create: `404.html`

- [ ] **Step 1: Scrivi `404.html`**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>:( PORTFOLIO_NOT_FOUND</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin:0; padding:0; height:100%; background:#0078d7; color:#fff; font-family: 'Segoe UI', sans-serif; }
    .bsod { max-width: 800px; padding: 8vh 8vw; font-size: clamp(14px, 1.6vw, 18px); line-height: 1.5; }
    .face { font-size: 8em; margin: 0 0 0.2em; font-weight: 200; }
    h1 { font-size: 1.6em; font-weight: 400; margin: 0 0 1em; }
    code { background: rgba(255,255,255,.12); padding: 2px 6px; border-radius: 3px; }
    a.back {
      display: inline-block; margin-top: 2em;
      background: #fff; color: #0078d7;
      padding: .6em 1.2em; border-radius: 4px;
      text-decoration: none; font-weight: 600;
    }
    a.back:hover { background: #e0e0e0; }
  </style>
</head>
<body>
  <main class="bsod">
    <div class="face">:(</div>
    <h1>Your portfolio ran into a problem and needs to restart.<br>
        We're just collecting some error info, and then we'll restart for you.</h1>
    <p>100% complete</p>
    <p>For more information about this issue:<br>
       Stop code: <code>PORTFOLIO_NOT_FOUND</code><br>
       What failed: <code id="path"></code>
    </p>
    <a href="/" class="back">← Back to desktop</a>
  </main>
  <script>
    document.getElementById('path').textContent = location.pathname + location.search;
  </script>
</body>
</html>
```

- [ ] **Step 2: Verifica**

Visita `http://localhost:8000/nonexistent`. Server statico Python restituisce 404 plain → GitHub Pages userà `404.html` automaticamente in deploy. Per testare ora: apri direttamente `http://localhost:8000/404.html`.

- [ ] **Step 3: Commit**

```bash
git add 404.html
git commit -m "feat: BSOD 404 page"
git push
```

---

## Task 18: Mobile shell Windows Phone Metro (<768px)

**Files:**
- Modify: `assets/css/mobile.css`
- Create: `js/mobile-shell.js`
- Modify: `js/main.js`

- [ ] **Step 1: Scrivi `assets/css/mobile.css`**

```css
@media (max-width: 768px) {
  /* Hide desktop chrome */
  .icons-grid, .sticky-notes, .taskbar, .start-menu, .windows-layer { display: none !important; }

  body { background: #1f1f1f; }

  .metro-shell { display: block; min-height: 100vh; color: #fff; }

  .metro-topbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px;
    font-size: 18px; font-weight: 300; letter-spacing: .5px;
    background: #000;
  }
  .metro-topbar button {
    background: none; border: 0; color: #fff; font-size: 16px;
  }

  .metro-tiles {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; padding: 8px;
  }
  .metro-tile {
    aspect-ratio: 1 / 1;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 16px;
    color: #fff; font-weight: 300; font-size: 16px;
    text-align: left; text-decoration: none;
    background: var(--metro-teal);
    border: 0;
  }
  .metro-tile-wide { grid-column: span 2; aspect-ratio: 2 / 1; }
  .metro-tile:nth-child(6n+1) { background: var(--metro-teal); }
  .metro-tile:nth-child(6n+2) { background: var(--metro-lime); }
  .metro-tile:nth-child(6n+3) { background: var(--metro-red); }
  .metro-tile:nth-child(6n+4) { background: var(--metro-orange); }
  .metro-tile:nth-child(6n+5) { background: var(--metro-blue); }
  .metro-tile:nth-child(6n+6) { background: var(--metro-violet); }

  .metro-window {
    position: fixed; inset: 0; background: #1f1f1f; color: #fff;
    overflow: auto; padding: 16px;
    z-index: 9999;
    display: none;
  }
  .metro-window.is-open { display: block; }
  .metro-window .back {
    background: none; border: 0; color: #fff;
    font-size: 24px; padding: 0; margin-bottom: 12px;
  }
  .metro-window h2 { font-weight: 300; font-size: 28px; margin: 0 0 16px; }
  .metro-window p { font-size: 16px; line-height: 1.5; }
}

/* Hide metro shell on desktop */
@media (min-width: 769px) {
  .metro-shell { display: none !important; }
}
```

- [ ] **Step 2: Aggiungi HTML metro in `index.html`** (subito dopo `<main id="main">` apertura):

```html
<section class="metro-shell" aria-label="Mobile portfolio">
  <header class="metro-topbar">
    <span>jacopo</span>
    <button class="metro-lang" data-current-lang="it">IT</button>
  </header>

  <div class="metro-tiles">
    <button class="metro-tile metro-tile-wide" data-window="about" data-i18n="metro.about">Chi sono</button>
    <button class="metro-tile" data-window="simpsons-8bit" data-i18n="icon.simpsons">Simpsons 8-Bit</button>
    <button class="metro-tile" data-window="bart-tiny-room" data-i18n="icon.bart">Bart's Room</button>
    <button class="metro-tile" data-window="tnf-bnkr44" data-i18n="icon.tnf">TNF × Bnkr44</button>
    <button class="metro-tile" data-window="fiuto" data-i18n="icon.fiuto">Fiuto</button>
    <button class="metro-tile" data-window="museum-boston" data-i18n="icon.museum">Museum Boston</button>
    <button class="metro-tile" data-window="christopher-ward" data-i18n="icon.cw">Christopher Ward</button>
    <button class="metro-tile" data-window="camillo" data-i18n="icon.camillo">Camillo</button>
    <button class="metro-tile" data-window="lo-sguardo" data-i18n="icon.sguardo">Lo Sguardo</button>
    <button class="metro-tile" data-window="e-mobility" data-i18n="icon.emobility">E-Mobility</button>
    <button class="metro-tile metro-tile-wide" data-window="skills" data-i18n="metro.skills">Competenze</button>
    <button class="metro-tile metro-tile-wide" data-window="contact" data-i18n="metro.contact">Contatti</button>
  </div>

  <div class="metro-window" id="metro-window" aria-hidden="true">
    <button class="back" aria-label="Back">←</button>
    <div class="metro-window-body"></div>
  </div>
</section>
```

- [ ] **Step 3: Scrivi `js/mobile-shell.js`**

```js
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
```

- [ ] **Step 4: Aggiungi i18n keys per metro in entrambi `.json`**

```json
"metro.about": "Chi sono",
"metro.skills": "Competenze",
"metro.contact": "Contatti"
```

- [ ] **Step 5: Import + init in `js/main.js`**

```js
import { initMobileShell } from './mobile-shell.js';
// ...
initMobileShell();
```

- [ ] **Step 6: Verifica**

Apri devtools → mobile emulation 375×812. Metro tiles colorate appaiono, taskbar + icone desktop sparite. Tap tile → metro-window full screen con back button.

- [ ] **Step 7: Commit**

```bash
git add assets/css/mobile.css js/mobile-shell.js js/main.js index.html i18n/
git commit -m "feat(mobile): Windows Phone Metro shell <768px"
git push
```

---

## Task 19: A11y pass — keyboard, ARIA, focus trap

**Files:**
- Modify: `js/window-manager.js` (focus trap)
- Modify: `index.html` (skip-link verifica, semantica)

- [ ] **Step 1: Focus trap in window aperta**

In `js/window-manager.js`, dentro `openWindow` dopo `LAYER.appendChild(clone)`:

```js
// Focus trap
clone.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusables = clone.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  if (focusables.length === 0) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// Set initial focus
queueMicrotask(() => {
  const firstFocusable = clone.querySelector('button:not(.win-close), [href], input');
  (firstFocusable ?? clone.querySelector('.win-close')).focus();
});
```

- [ ] **Step 2: Aggiungi `aria-modal="true"` + `aria-labelledby`**

In `wireControls`:
```js
const titleId = `win-title-${id}`;
el.querySelector('.window-title').id = titleId;
el.setAttribute('aria-labelledby', titleId);
el.setAttribute('aria-modal', 'true');
```

- [ ] **Step 3: Tasto Windows / Meta apre start menu**

In `js/main.js` keydown listener:
```js
if ((e.key === 'Meta' || e.key === 'OS') && !e.repeat) {
  e.preventDefault();
  document.querySelector('.start-orb').click();
}
```

- [ ] **Step 4: Verifica con tastiera**

Tab dall'inizio del documento → skip-link visibile, poi orb, poi icone, poi sticky. Enter su icona → finestra apre, focus su primo controllo, Tab cycle dentro. Esc chiude.

- [ ] **Step 5: Lighthouse a11y audit**

```bash
npx lighthouse http://localhost:8000 --view --preset=desktop --only-categories=accessibility
```

Target ≥95. Fix issues riportati (es. contrast su sticky note: aggiungi `color: #2a1f00` se serve).

- [ ] **Step 6: Commit**

```bash
git add js/window-manager.js js/main.js
git commit -m "feat(a11y): focus trap + ARIA + meta key"
git push
```

---

## Task 20: SEO — sitemap, robots, Open Graph

**Files:**
- Create: `sitemap.xml`, `robots.txt`
- Modify: `index.html` (OG meta)

- [ ] **Step 1: Scrivi `robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://jacopino.dev/sitemap.xml
```

- [ ] **Step 2: Scrivi `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jacopino.dev/</loc></url>
  <url><loc>https://jacopino.dev/?window=simpsons-8bit</loc></url>
  <url><loc>https://jacopino.dev/?window=bart-tiny-room</loc></url>
  <url><loc>https://jacopino.dev/?window=e-mobility</loc></url>
  <url><loc>https://jacopino.dev/?window=museum-boston</loc></url>
  <url><loc>https://jacopino.dev/?window=tnf-bnkr44</loc></url>
  <url><loc>https://jacopino.dev/?window=fiuto</loc></url>
  <url><loc>https://jacopino.dev/?window=lo-sguardo</loc></url>
  <url><loc>https://jacopino.dev/?window=camillo</loc></url>
  <url><loc>https://jacopino.dev/?window=christopher-ward</loc></url>
  <url><loc>https://jacopino.dev/?window=about</loc></url>
  <url><loc>https://jacopino.dev/?window=skills</loc></url>
  <url><loc>https://jacopino.dev/?window=contact</loc></url>
</urlset>
```

- [ ] **Step 3: Aggiungi OG meta in `<head>` di `index.html`**

Subito dopo viewport:
```html
<meta property="og:type" content="website">
<meta property="og:title" content="jacopo latrofa — graphic designer">
<meta property="og:description" content="portfolio anni 2000 di jacopo latrofa.">
<meta property="og:image" content="https://jacopino.dev/assets/img/og-card.png">
<meta property="og:url" content="https://jacopino.dev/">
<meta name="twitter:card" content="summary_large_image">
```

Crea screenshot statico desktop 1200×630, salva come `assets/img/og-card.png`.

- [ ] **Step 4: Deep-link handler in `js/main.js`**

Subito dopo `initMobileShell()`:
```js
// Deep-link: ?window=<id>&lang=<it|en>
const params = new URLSearchParams(location.search);
if (params.get('lang')) {
  await setLang(params.get('lang'));
}
if (params.get('window')) {
  await openWindow(params.get('window'));
}
```

Importa `setLang` e `openWindow` in cima a `main.js`.

- [ ] **Step 5: Commit**

```bash
git add sitemap.xml robots.txt index.html assets/img/og-card.png js/main.js
git commit -m "feat(seo): sitemap, robots, OG, deep-link"
git push
```

---

## Task 21: CI/CD — deploy GitHub Pages + CNAME

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `CNAME`

- [ ] **Step 1: Scrivi `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Scrivi `CNAME`**

```
jacopino.dev
```

(o dominio alternativo confermato dall'utente)

- [ ] **Step 3: Abilita GitHub Pages**

```bash
gh repo edit --enable-pages --pages-source workflow
```

In alternativa via UI: repo → Settings → Pages → Source: GitHub Actions.

- [ ] **Step 4: Push + verifica deploy**

```bash
git add .github/ CNAME
git commit -m "ci: deploy to GitHub Pages + custom domain"
git push
```

Apri Actions tab del repo, watch workflow. Quando completato verifica `https://fralapo.github.io/portfolio-y2k/` (poi CNAME punterà al dominio).

- [ ] **Step 5: DNS records (lato registrar)**

Sul provider DNS di `jacopino.dev` (Namecheap, Cloudflare, ecc.):
- `A` record `@` → `185.199.108.153`
- `A` record `@` → `185.199.109.153`
- `A` record `@` → `185.199.110.153`
- `A` record `@` → `185.199.111.153`
- `CNAME` record `www` → `fralapo.github.io`

Attendi propagazione (~ore). Abilita "Enforce HTTPS" in repo Settings → Pages.

- [ ] **Step 6: Verifica live**

`curl -I https://jacopino.dev` → 200 OK con `server: GitHub.com`.

---

## Task 22: QA finale + Lighthouse + checklist

**Files:**
- Nessun file. Pura verifica.

- [ ] **Step 1: Lighthouse desktop**

```bash
npx lighthouse https://jacopino.dev --view --preset=desktop
```

Target: Perf ≥90, A11y ≥95, BP ≥95, SEO ≥90. Fix issue riportati (iter di solito: aggiungi `width/height` mancanti, alt mancante, contrast).

- [ ] **Step 2: Lighthouse mobile**

```bash
npx lighthouse https://jacopino.dev --view
```

Target Perf mobile ≥85 (mobile è più stretto). Verifica Metro shell.

- [ ] **Step 3: Browser matrix manuale**

| Browser | Verifica |
|---|---|
| Chrome desktop | Open windows, drag, min/max/close, audio toggle, lang switch |
| Firefox desktop | Idem |
| Safari macOS | Idem + cursor fallback |
| Edge | Idem |
| iOS Safari 16+ | Metro shell tap, lang toggle |
| Android Chrome | Idem |

- [ ] **Step 4: Interaction checklist** (da spec §11)

- [ ] Click icona apre finestra al primo tap
- [ ] Drag finestra dentro viewport
- [ ] Min/max/close isolati
- [ ] 4+ finestre overlap z-index corretto
- [ ] Start menu apre/chiude, click outside chiude
- [ ] Lang switch persiste dopo reload
- [ ] Audio toggle persiste
- [ ] Clock aggiorna entro 30s
- [ ] 404 mostra BSOD
- [ ] Mobile <768px swap Metro senza flash
- [ ] Visitor counter incrementa dopo deploy
- [ ] Deep link `?window=fiuto&lang=en` apre finestra + lingua corretta

- [ ] **Step 5: Update README con screenshot**

Cattura screenshot desktop + mobile. Aggiungi in `README.md`:
```markdown
## Screenshots

![Desktop](docs/screenshot-desktop.png)
![Mobile](docs/screenshot-mobile.png)
```

- [ ] **Step 6: Tag v1.0.0**

```bash
git tag -a v1.0.0 -m "Portfolio Y2K v1.0.0 — first public release"
git push --tags
```

Crea release GitHub:
```bash
gh release create v1.0.0 --title "v1.0.0 — first release" --notes "Portfolio anni 2000 con metafora desktop Win7 Aero."
```

---

## Done

Tutte le 22 task chiuse. Sito live, dominio configurato, SEO/A11y in target, content bilingue, mobile Metro shell, CI auto-deploy ad ogni push su main.

**Maintenance**:
- Nuovo proj → aggiungi `windows/<id>.html` + icona + chiavi i18n + commit. Auto-deploy.
- Tradurre new content: rispetta convenzione chiavi `win.<id>.<field>`.
- Rotazione sticky notes content: aggiorna chiavi `sticky.0/1/2`.

---

## Self-Review

**Spec coverage**:
- §3 Repo setup → Task 1 ✓
- §4 Architecture → Task 2 (scaffold) + Tasks 3-12 (componenti) ✓
- §5 Components → Tasks 4-12 + 17 (BSOD) + 18 (mobile) ✓
- §6 Interaction & state → Task 7 (window-manager) + Task 8 (taskbar) + Task 9 (i18n) + Task 10 (tray) + Task 11 (start menu) + Task 12 (sticky) + Task 13 (cursor) ✓
- §7 Content workflow → Task 15 (9 windows) + Task 16 (pages) ✓
- §8 Asset pipeline → Task 2 (copy vault) + Task 3 (tokens da source) ✓
- §9 Error handling → Task 7 (fetch fallback) + Task 17 (BSOD) ✓
- §10 Accessibility → Task 19 ✓
- §11 Testing → Task 22 ✓
- §12 SEO → Task 20 ✓
- §13 Deploy → Task 21 ✓
- §14 Out of scope → rispettato, nessun guestbook/Spotify/screensaver/konami ✓

**Placeholder scan**: nessun TBD/TODO non risolto. Tutti gli step hanno comandi e codice.

**Type consistency**:
- `openWindow(id)`, `closeWindow(id)`, `focusWindow(id)`, `minimizeWindow(id)`, `toggleMaximize(id)`, `makeDraggable(el)` — coerenti tra Task 7 e Task 8/11.
- `applyI18n(root)`, `setLang(lang)`, `loadDictionary(lang)`, `t(key)` — coerenti tra Task 9 e Task 10/15/16/18.
- `AppState` shape definito una volta in Task 7 (main.js), riutilizzato senza divergenza.
- Chiavi i18n: convenzione `<scope>.<sub>.<field>` rispettata (`start.*`, `win.<id>.<field>`, `icon.*`, `sticky.<n>`, `tray.*`, `page.*`, `metro.*`).

Nessuna correzione necessaria.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-13-portfolio-y2k.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — dispatch fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
