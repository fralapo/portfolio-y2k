<a id="readme-top"></a>

# portfolio-y2k

> Personal portfolio shaped like a Windows 7 desktop. Bilingual IT/EN. Vanilla HTML/CSS/JS, no build tools.

[![Deploy to GitHub Pages](https://github.com/fralapo/portfolio-y2k/actions/workflows/deploy.yml/badge.svg)](https://github.com/fralapo/portfolio-y2k/actions/workflows/deploy.yml)
[![GitHub last commit](https://img.shields.io/github/last-commit/fralapo/portfolio-y2k)](https://github.com/fralapo/portfolio-y2k/commits/main)
[![Pages](https://img.shields.io/website?down_color=red&down_message=offline&label=live&up_color=blue&up_message=fralapo.github.io%2Fportfolio--y2k&url=https%3A%2F%2Ffralapo.github.io%2Fportfolio-y2k%2F)](https://fralapo.github.io/portfolio-y2k/)
[![Repo size](https://img.shields.io/github/repo-size/fralapo/portfolio-y2k)](https://github.com/fralapo/portfolio-y2k)

🔗 **Live**: https://fralapo.github.io/portfolio-y2k/
🎯 **Custom domain target**: https://jacopino.dev *(CNAME committed, DNS not yet wired)*

## Table of contents

- [What it is](#what-it-is)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Repo layout](#repo-layout)
- [Adding a new project](#adding-a-new-project)
- [Customization](#customization)
- [Internationalization](#internationalization)
- [Mobile shell](#mobile-shell)
- [Sound effects](#sound-effects)
- [Third-party assets](#third-party-assets)
- [Status & known limitations](#status--known-limitations)
- [Project history & docs](#project-history--docs)
- [License](#license)

## What it is

I rebuilt my Notion portfolio as a fake Windows 7 desktop. You land on the Harmony wallpaper. Five info shortcuts and a `Progetti` folder live on the desktop. Inside `Progetti` you find eight category sub-folders (UX/UI, Motion, Graphics, Printing, Advertising, 3D Modeling, Arts, All) — each lists only the projects whose type matches, with category pills on every icon so you can see when a project belongs to multiple folders.

The chrome is Win7: Vista start orb opens a menu, taskbar shows a live clock and per-window buttons, system tray has an audio toggle, an IT/EN language flag, and a goatcounter visitor counter. Windows are draggable, minimizable, maximizable, closable. Authentic Win7 cursors and sound effects.

It is one HTML page that lazy-loads content fragments. There is no framework, no bundler, no `node_modules`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Quick start

```bash
git clone https://github.com/fralapo/portfolio-y2k.git
cd portfolio-y2k
python -m http.server 8000
```

Open <http://localhost:8000>. Hot reload not configured — refresh manually.

The Aero cursors render on Windows browsers only (Chrome / Edge / Firefox). Safari macOS falls back to the default pointer. Audio is muted by default; click the speaker icon in the system tray to enable, then UI interactions play Win7 SFX.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How it works

### Runtime model

`index.html` boots `js/main.js` which:

1. Initializes `window.AppState` — `lang`, `audio`, `openWindows` map, z-index counter
2. Loads the current-language dictionary from `i18n/<lang>.json`
3. Wires desktop icons (drag + click), taskbar, system tray, start menu, sticky notes, mobile shell
4. Resolves `?window=<id>&lang=<it|en>` URL params for deep links

Click an icon → `window-manager.js` fetches the fragment (tries `windows/`, then `pages/`, then `folders/`), clones `<template id="window-template">`, injects the fragment, wires controls, applies i18n, focuses, adds a taskbar button.

Folder windows are just regular windows that contain a `.folder-grid` of more `.icon[data-window]` buttons. Window-manager attaches click handlers to those on mount so nested icons open their targets.

### State

In-memory only. `lang` and `audio` are mirrored to `localStorage` so they survive a reload. Window positions and icon positions are session-only — reload always returns to the default layout.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repo layout

```
portfolio-y2k/
├── index.html                  # single page, all desktop chrome
├── 404.html                    # BSOD error page
├── CNAME                       # custom domain
├── sitemap.xml / robots.txt
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Aero color, gradient, blur, type tokens
│   │   ├── base.css            # reset + typography
│   │   ├── desktop.css         # wallpaper + icon grid
│   │   ├── windows.css         # window chrome, tabs, hero, badges
│   │   ├── widgets.css         # taskbar, tray, start menu, sticky
│   │   ├── cursors.css         # cursor:url() rules
│   │   └── mobile.css          # Win Phone Metro shell <768px
│   ├── img/
│   │   ├── icons/              # 29 SVG (project glyphs, folder, categories, etc.)
│   │   ├── orbs/               # start orb, favicon
│   │   └── wallpaper/          # win7-default.jpg + 5 alternates
│   ├── cursors/                # 13 .cur/.ani Win7 Aero
│   └── audio/                  # 18 Win7 .wav SFX
├── windows/                    # 9 project HTML fragments
├── folders/                    # 9 folder fragments (Progetti + 8 categories)
├── pages/                      # 5 static info pages (about, skills, contact, readme, cv)
├── i18n/
│   ├── it.json                 # 85 keys
│   └── en.json                 # 85 keys (parity verified)
├── js/                         # 10 ES modules
│   ├── main.js                 # bootstrap
│   ├── window-manager.js       # open / focus / drag / min / max / close
│   ├── desktop-icons.js        # drag + click, no persistence
│   ├── taskbar.js              # clock + window buttons
│   ├── tray.js                 # audio toggle, lang switch
│   ├── start-menu.js           # orb menu, search filter
│   ├── sticky-notes.js         # 3 draggable post-its
│   ├── mobile-shell.js         # Metro tile grid <768px
│   ├── i18n.js                 # dictionary loader + applyI18n
│   └── sfx.js                  # play(name, volume) — sound helper
├── docs/superpowers/
│   ├── specs/2026-05-13-portfolio-y2k-design.md
│   └── plans/2026-05-13-portfolio-y2k.md
├── .github/workflows/deploy.yml
├── ATTRIBUTIONS.md
└── README.md
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Adding a new project

1. Write `windows/<slug>.html` — copy any existing project for the template. Two tabs (Overview + Meta), `data-window-title`, tag pills.
2. Add an SVG to `assets/img/icons/<slug>.svg` (mine are ~1 KB, glyph + colored background).
3. Append i18n keys to `i18n/it.json` and `i18n/en.json`:
   - `win.<key>.title`
   - `win.<key>.desc`
4. Register the project in `folders/all.html` and the matching `folders/<category>.html` files. The pill on each icon shows all its types; the one matching the current folder gets `is-self` styling.
5. Optional: add an icon directly on the desktop in `index.html` with `data-window="<slug>" data-icon="<icon-key>"`. The icon lookup in `window-manager.js` reads `data-icon` from the desktop button.

Commit, push, GitHub Actions deploys in ~25 seconds.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Customization

### Switch wallpaper

Five alternates are bundled. Edit `assets/css/desktop.css`:

```css
.wallpaper {
  background-image: url('../img/wallpaper/win7-nature.jpg');
  /* options: win7-default | win7-architecture | win7-characters
              win7-landscapes | win7-nature | win7-scenes */
}
```

### Swap a sound effect

`js/sfx.js` exports `play(name, volume)`. The name matches a `.wav` file in `assets/audio/`. To wire a new event:

```js
import { play } from './sfx.js';
play('win7-balloon', 0.4);
```

Sounds are silent unless the user has clicked the tray speaker to enable audio (`AppState.audio === 'on'`).

### Set the live URL

Edit `CNAME` if your custom domain changes. The OG `og:image` and meta URLs in `index.html` and `sitemap.xml` reference `jacopino.dev` — update there too if you change domain.

### Reset icon layout

Already automatic — every reload returns to the default column-first layout.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Internationalization

Toggle via the IT/EN flag in the system tray. Preference saved in `localStorage` as `lang`.

Markup conventions:

```html
<span data-i18n="start.projects">Progetti</span>
<button data-i18n-aria="tray.audio.off" aria-label="Audio muto">🔇</button>
<input data-i18n-placeholder="start.search" placeholder="Cerca…">
```

Keys are flat dot-notation: `<scope>.<sub>.<field>`. Scopes in use: `meta`, `start`, `tray`, `sticky`, `icon`, `win`, `page`, `cv`, `skill.tab`, `metro`, `hero`, `about`, `footer`, `status`, `lang`.

To add a language, copy `i18n/it.json`, translate values, then add a third state in `js/tray.js` to the toggle handler.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Mobile shell

Below 768 px the desktop hides and `.metro-shell` takes over. Windows Phone–style 2-column tile grid, rotating Metro palette (teal / lime / red / orange / blue / violet). Tap a tile, full-screen content window with a back button.

Source: `index.html` (`<section class="metro-shell">`), `assets/css/mobile.css`, `js/mobile-shell.js`. The mobile shell reuses the same fragments from `windows/` and `pages/`, so adding a project automatically reaches mobile too.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Sound effects

| Trigger | Sound |
|---|---|
| Tray speaker on (first activation) | `win7-startup.wav` |
| Lang switch | `win7-notify.wav` |
| Window minimize | `win7-minimize.wav` |
| Window restore (from taskbar) | `win7-restore.wav` |
| Window close | `win7-recycle.wav` |
| Start menu → Spegni | `win7-logoff-sound.wav` (1.4 s) then redirect to 404 |
| 404 BSOD page load | `win7-critical-stop.wav` |

All gated by `AppState.audio === 'on'`. Silent by default.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Third-party assets

The Win7 cursors, sounds, wallpapers, and the authentic folder icon come from community archive repos. None of those upstream repos ship a LICENSE file; usage here is non-commercial personal portfolio.

| Source | Used for |
|---|---|
| [B00merang-Artwork/Windows-7](https://github.com/B00merang-Artwork/Windows-7) | Folder icon (`progetti.svg`), alternates in `win7-*.svg` |
| [bartekl1/windows-ui-assets](https://github.com/bartekl1/windows-ui-assets) | 13 Aero cursors, 6 wallpapers |
| [MCPlayer2015/all-windows-sounds](https://github.com/MCPlayer2015/all-windows-sounds) | 18 Win7 `.wav` effects |
| [visnalize/resources](https://github.com/visnalize/resources) | Referenced for raw `.ico` swaps, not bundled |

Full provenance in [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Status & known limitations

**Done**
- 9 project windows + 5 static pages + 9 folder fragments + i18n parity
- Win7 cursors, startup chime, 6 SFX wired (close / min / restore / lang / shutdown / BSOD)
- Mobile Metro shell <768px with shared content
- Deep links (`?window=<id>&lang=<it|en>`)
- goatcounter visitor counter

**Pending**
- Real avatar photo — placeholder `J` monogram in About hero. Drop a square JPG at `assets/img/jacopo.jpg` and edit `pages/about.html` line `<div class="hero-photo">J</div>` → `<img src="../assets/img/jacopo.jpg" alt="">`.
- Custom domain DNS — `CNAME` file points to `jacopino.dev` but the registrar still needs A records `185.199.108-111.153` and a `www` CNAME to `fralapo.github.io`. Then `gh api -X PUT repos/fralapo/portfolio-y2k/pages -f cname=jacopino.dev` and toggle Enforce HTTPS.
- OG card — `assets/img/og-card.png` is a flat steelblue placeholder. Swap with a real desktop screenshot 1200×630.
- License — see below.

**Known quirks**
- Custom cursors invisible on macOS Safari / Linux. CSS fallback (`default`, `pointer`, `wait`) takes over silently.
- BSOD 404 sound only plays when the page is reached via a click chain (Shutdown → redirect). Cold load to `/nonexistent` may be silenced by autoplay policy.
- TNF × Bnkr44 appears in three category folders (Advertising, Graphics, Motion) and Christopher Ward in two (Advertising, Arts). This is by design — projects can be multi-category. Opening the same project from any folder reuses the same window instance.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project history & docs

This project was built with [Claude Code](https://claude.com/claude-code) using the `superpowers` workflow:

1. Brainstorming → tracked in `docs/superpowers/specs/2026-05-13-portfolio-y2k-design.md` (final 15-section design spec, 600 lines)
2. Planning → `docs/superpowers/plans/2026-05-13-portfolio-y2k.md` (22 atomic tasks, 75 KB plan with complete code for every step)
3. Implementation → 22 commits on `main`, each a discrete task
4. Iteration → additional commits for folder structure, multi-category pills, Notion-parity skills, Win7 asset import

Pick up where the work left off: read the spec for context, then `git log` for the most recent decisions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Source code and project-specific artwork (project glyph SVGs, CSS modules, JS modules, content pages): no formal license file yet. Treat as **All rights reserved** until I add one — recommendation will be MIT.

Third-party Win7 visual and audio assets: see [ATTRIBUTIONS.md](ATTRIBUTIONS.md). Those repos ship no license; bundled here under non-commercial personal-portfolio use only. If you fork this project for any commercial purpose, replace the third-party assets first.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
