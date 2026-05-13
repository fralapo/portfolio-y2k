# Portfolio Y2K — Design Spec

**Author**: Jacopo Latrofa
**Date**: 2026-05-13
**Status**: Draft pending user review

## 1. Goal

Costruire un nuovo sito portfolio personale in stile **anni 2000 / Frutiger Aero / Windows 7 desktop metaphor**, sostituendo il portfolio Notion attuale. Stack vanilla HTML/CSS/JS, deploy GitHub Pages con dominio custom. Sito bilingue IT/EN, responsive con skin Windows Phone Metro sotto i 768px.

## 2. Locked decisions

| Asse | Scelta |
|---|---|
| Direzione visiva | Windows 9x/7 Desktop OS metaphor |
| Skin | Windows 7 Aero (vetro, cielo Frutiger, Segoe UI) |
| Scope progetti | 9 tutti (catalogo Notion completo) |
| Lingua | Bilingue IT/EN switch (toggle in system tray) |
| Mobile | Skin Windows Phone Metro sotto 768px |
| Boot experience | Desktop diretto, zero scenografia |
| Features MVP | Start menu, taskbar clock real-time, system tray, finestre draggable + min/max/close, audio ambient toggle, custom cursor Aero, sticky notes, visitor counter (goatcounter), BSOD 404 |
| Hosting | GitHub Pages + custom domain |
| Stack | Vanilla HTML/CSS/JS, niente bundler, niente framework |
| Content workflow | Conversione manuale .md Notion → finestre HTML, riscritta in voice cheeky Y2K-light |
| Target Lighthouse | Performance ≥90, A11y ≥95, BP ≥95, SEO ≥90 |

## 3. Repository setup

- **Local path**: `C:\Users\latro\Documents\GitHub\portfolio-y2k`
- **Remote**: GitHub `jacopolatrofa/portfolio-y2k` (creazione via `gh repo create`, autenticato, visibilità da confermare)
- **Default branch**: `main`
- **CI**: GitHub Actions workflow `deploy.yml` build statico → GitHub Pages
- **Domain**: CNAME custom (default `jacopino.dev`, da confermare)

## 4. Architecture

### File tree

```
portfolio-y2k/
├── index.html                # desktop landing (single page)
├── 404.html                  # BSOD page
├── CNAME                     # custom domain
├── sitemap.xml
├── robots.txt
├── assets/
│   ├── css/
│   │   ├── tokens.css        # vars Aero (colors, gradients, blur)
│   │   ├── base.css          # reset + typography Segoe UI fallback
│   │   ├── desktop.css       # wallpaper, icons grid, taskbar
│   │   ├── windows.css       # window chrome (titlebar, controls, body)
│   │   ├── widgets.css       # sticky notes, system tray, start menu
│   │   ├── mobile.css        # Win Phone Metro skin <768px
│   │   └── cursors.css       # cursor:url() rules
│   ├── img/
│   │   ├── wallpaper/        # bliss-style Frutiger sky
│   │   ├── icons/            # icone proj 48px + 256px
│   │   ├── orbs/             # Aero orb assets riusati dal vault
│   │   └── chrome/           # titlebar gradients, glass panels
│   ├── cursors/              # .cur/.ani files
│   ├── audio/                # win7-startup.ogg (~50KB)
│   └── fonts/                # Segoe UI fallback self-host (Open Sans/Inter)
├── windows/                  # 9 progetti come HTML fragment
│   ├── simpsons-8bit.html
│   ├── bart-tiny-room.html
│   ├── e-mobility.html
│   ├── museum-boston.html
│   ├── tnf-bnkr44.html
│   ├── fiuto.html
│   ├── lo-sguardo.html
│   ├── camillo.html
│   └── christopher-ward.html
├── pages/                    # finestre non-proj
│   ├── about.html
│   ├── skills.html
│   └── contact.html
├── js/
│   ├── main.js               # bootstrap: i18n, audio, cursor
│   ├── window-manager.js     # drag, focus, min/max/close, z-index
│   ├── start-menu.js
│   ├── taskbar.js            # clock + open windows
│   ├── tray.js               # audio toggle + lang switch
│   ├── sticky-notes.js
│   └── i18n.js               # IT/EN dictionary + DOM swap
├── i18n/
│   ├── it.json
│   └── en.json
├── scripts/
│   └── optimize-images.sh    # una tantum locale (magick + pngquant)
├── .github/workflows/
│   └── deploy.yml
└── README.md
```

### Principles

- Single page `index.html` carica il desktop. Le finestre sono fragment HTML caricati via `fetch()` su click icona, iniettati in `<div class="window-body">`.
- CSS modulari per concern, linkati da `index.html`. Totale CSS minificato < 50KB.
- JS ES modules nativi (`<script type="module">`). Niente jQuery, niente framework.
- Asset Frutiger Aero copiati da `a/frutiger-aero-vault/raw/assets/` e refs builder.
- Niente backend. Stato persistente in `localStorage` (lang, audio).

## 5. Component inventory

### Desktop chrome

- `<body>` = desktop. Wallpaper full-bleed Frutiger sky con orb fluttuanti.
- `.icons-grid` top-left: 9 icone progetti allineate verticalmente, label con text-shadow per leggibilità su qualsiasi wallpaper.
- `.sticky-notes` 3 post-it gialli sparsi `position:absolute` con `transform:rotate()` randomico.
- `.taskbar` fixed bottom: start orb, task buttons, tray (speaker, flag IT/EN, wifi decor), clock.

### Window template

```
.window
├── .window-titlebar           gradient blu Aero, drag handle
│   ├── .window-icon            16px
│   ├── .window-title           "<Proj> — Properties"
│   └── .window-controls        [_] [▢] [×]
├── .window-body
│   ├── .window-toolbar         tabs "Overview · Gallery · Meta"
│   └── .window-content         scrollable
└── .window-statusbar           "Ready" + fake file size
```

Stati: `.is-focused`, `.is-minimized`, `.is-maximized`.

### Start menu

Pannello apre cliccando orb. Header avatar + nome. Voci: Projects, Skills, About, Contact, Search input (filtra icone), Shut Down (apre BSOD scherzoso o redirect LinkedIn).

### Sticky notes (3, contenuto i18n)

1. "📌 attualmente @ Studio Futuroma (Roma)" / "currently @ Studio Futuroma (Rome)"
2. "📌 disponibile da maggio 2026" / "available from may 2026"
3. "📌 scrivimi! ✉️" / "drop a line! ✉️"

Draggable (riusa stesso JS finestre), non chiudibili.

### Mobile shell (<768px) — Win Phone Metro

- Layer alternativo, swap via `@media`.
- Top bar 44px: nome + IT/EN toggle.
- Tile grid 2-col, palette Metro (`#00aba9`, `#a4c400`, `#e51400`, `#f0a30a`, `#1ba1e2`, `#aa00ff` a rotazione).
- 9 tile proj + 1 tile About/Skills + 1 tile Contact.
- Tap tile → finestra full-screen senza chrome desktop, back button bottom-left.
- Niente drag, taskbar, start menu, cursor custom, audio toggle, sticky notes.

### 404 BSOD

Pagina full-screen blu `#0000aa` Win7 style:

```
:( Your portfolio ran into a problem and needs to restart.
We're just collecting some error info, and then we'll restart for you.

100% complete

For more information about this issue: PAGE_NOT_FOUND_0x0000404
Stop code: PORTFOLIO_NOT_FOUND
What failed: jacopino.dev/<requested-path>

[← Back to desktop]
```

## 6. Interaction & state

### Global state (memory + localStorage)

```js
window.AppState = {
  lang: 'it' | 'en',                  // persisted
  audio: 'on' | 'off',                // persisted
  openWindows: Map<id, WindowInstance>,
  focusedWindowId: string | null,
  zIndexCounter: 100,
  startMenuOpen: boolean,
}
```

### Window lifecycle

```
[click icon] → fetch(/windows/<id>.html) → instantiate <div.window> da template
            → cascading offset (top+30, left+30 per ognuna)
            → focus + bringToFront + apply data-i18n keys
[drag titlebar] → pointer events (clamp dentro viewport)
[focus] → mousedown qualsiasi punto → zIndex = ++counter
[minimize] → display:none → entry in taskbar
[maximize] → toggle full viewport
[close] → unmount + delete da Map + rimuovi taskbar btn
```

### Drag handler

Vanilla pointer events (`pointerdown`/`pointermove`/`pointerup` + `setPointerCapture`). Niente jQuery. Clamp titlebar sempre dentro viewport.

### i18n flow

- `i18n/<lang>.json` flat dot-notation chiavi (`start.projects`, `win.<projId>.<field>`, `sticky.<n>`, `meta.*`).
- Markup usa `<elem data-i18n="key.path">fallback</elem>`.
- `i18n.js` al `DOMContentLoaded` legge `AppState.lang`, fetch dictionary, sostituisce tutti i `[data-i18n]`.
- Toggle flag tray → swap lang → re-apply DOM corrente → salva localStorage.
- Live region `aria-live="polite"` annuncia "Language changed".

### Audio toggle

- `<audio loop src="/assets/audio/win7-startup.ogg" preload="auto">` volume 0.3.
- Default OFF (autoplay policy).
- Click 🔊 tray → toggle play/pause + swap icon + salva localStorage.

### Clock

`setInterval` 30s, formato `HH:MM`, tooltip data completa.

### Visitor counter

goatcounter.com (free, no cookie). Script async tag + custom div che mostra count via API.

### Custom cursor

CSS `cursor: url('.cur'), default;` su `body`, override per `a`/`button` (link cursor) e `.is-loading` (wait).

## 7. Content workflow

Per ognuno dei 9 progetti:

1. Read `md/Portfolio/Projects/<proj>.md` originale (Notion export)
2. Estrai: titolo, anno, tools, description, gallery, team
3. Riscrivi in voice cheeky Y2K-light, bilingue (IT primaria, EN traduzione)
4. Inserisci in template `windows/<id>.html` con tab Overview/Gallery/Meta
5. Aggiungi chiavi i18n in `it.json` + `en.json`
6. Aggiungi icona desktop in `index.html`

Stima: ~45 min/proj × 9 = ~7h totali.

## 8. Asset pipeline

### Riuso dal vault esistente

| Sorgente | Riuso |
|---|---|
| `a/frutiger-aero-vault/raw/assets/` | wallpaper, orb, glass icons |
| `a/frutiger-aero-site-builder/assets/css/aero-tokens.css` | rebrand → `tokens.css` |
| `references/02-design-tokens.css` | merge in tokens.css |
| `references/03-glossy-buttons.md` | window controls |
| `references/04-glass-panels.md` | start menu + tray |
| `references/05-aurora-backgrounds.md` | wallpaper |
| `references/06-skeumorphic-orbs.md` | start orb |
| `references/08-quality-checklist.md` | QA gate |
| `references/09-anti-ai-pitfalls.md` | guida slop |

### Asset da produrre

| Asset | Spec |
|---|---|
| Wallpaper desktop | 1920×1080 JPG <200KB |
| Icone proj 48×48 | 9 PNG glass overlay |
| Icone proj 256×256 | 9 PNG hi-res per finestra |
| Start orb 64×64 | PNG transparent |
| System tray icons 16×16 | speaker, flag IT, flag EN, wifi |
| Cursori `.cur`/`.ani` | normal, link, wait |
| Audio ambient | `win7-startup.ogg` ≤80KB |
| Favicon | 32×32 + apple-touch 180×180 |

### Performance budget

| Asset | Budget |
|---|---|
| HTML index | < 30KB |
| CSS totale | < 50KB minified |
| JS totale | < 40KB minified |
| Wallpaper | < 200KB JPEG |
| Icone proj × 9 | < 500KB totale |
| Audio | < 80KB OGG |
| **Initial total** | **< 900KB** |
| Finestra singola (lazy) | < 150KB |

Target LCP < 1.5s.

## 9. Error handling

| Caso | Fallback |
|---|---|
| 404 URL inesistente | BSOD `404.html` full-screen |
| Fetch fragment finestra fallisce | Body: "⚠️ File not found" + bottone back |
| `i18n/<lang>.json` 404 | Fallback chiavi default EN inline via `data-i18n-fallback` |
| `localStorage` non disponibile | In-memory state, no persistence, nessun errore |
| Audio missing | Speaker icon disabilitato |
| `.cur` non supportato | CSS default cursor |
| Browser troppo vecchio (no matchMedia) | Mostra desktop layout |

Mai pagina bianca, mai console error non gestito.

## 10. Accessibility (WCAG 2.2 AA)

### Keyboard

- Icone desktop `<button>` con tabindex ordinato.
- Apertura via Enter/Space.
- `Esc` chiude finestra focus.
- `Alt+F4` intercettato (chiude finestra focus, non tab).
- Focus trap dentro finestra aperta.
- Skip-link "Salta al desktop" per screen reader.

### Screen reader

- `<main role="application" aria-label="Desktop portfolio">`.
- Finestre `<dialog role="dialog" aria-labelledby="win-title-<id>">`.
- Titlebar `<h2 id="win-title-<id>">`.
- Controls con `aria-label` localizzato.
- Sticky note `role="note"`.
- Live region `aria-live="polite"` per lang switch.

### Contrast

- Testo finestre minimo 7:1 (AAA dove possibile).
- Label icone desktop: text-shadow + background semitrasparente per leggibilità su wallpaper.

### Motion + data preferences

- `@media (prefers-reduced-motion)` disattiva animazioni (no aurora movimento, drag senza inerzia).
- `@media (prefers-reduced-data)` salta wallpaper hi-res, salta audio preload.

### Audio

Sempre off di default. Toggle ha `aria-pressed`.

## 11. Testing

Manual, niente test automatico (sito statico personale).

**Lighthouse target**: Performance ≥90, A11y ≥95, BP ≥95, SEO ≥90 (desktop).

**Browser matrix**: Chrome desktop, Firefox desktop, Safari macOS, Edge, iOS Safari 16+, Android Chrome.

**Viewport matrix**: 1920×1080, 1366×768, 768×1024 (breakpoint), 375×812.

**Interaction checklist**:

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

## 12. SEO

- `<title>` localizzato post-i18n init.
- `<meta name="description">` swap IT/EN.
- Open Graph card statica con screenshot desktop.
- `sitemap.xml` con tutte le finestre come URL deep-link.
- Deep-link `index.html?window=fiuto&lang=en` apre desktop con quella finestra già open + lingua scelta.

## 13. Deploy

GitHub Actions workflow:

```yaml
name: Deploy gh-pages
on: { push: { branches: [main] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions: { contents: read, pages: write, id-token: write }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: . }
      - uses: actions/deploy-pages@v4
```

CNAME punta a `jacopino.dev` (da confermare). DNS provider: configurazione fuori scope spec.

## 14. Out of scope (esplicito)

- Backend dinamico, database, auth.
- Guestbook con form server (non selezionato in feature picker).
- Now-Playing Spotify integration (non selezionato).
- Recycle Bin con proj scartati (non selezionato).
- Screensaver dopo idle (non selezionato).
- Konami code easter egg (non selezionato).
- Sistemi di analytics oltre goatcounter (no GA4).
- Test automatici Playwright/Vitest.
- PWA / service worker / offline mode.
- Dark mode toggle (Aero ha già palette unica luminosa).

## 15. Open decisions (da confermare prima di scrivere il plan)

- Nome repo: `portfolio-y2k` (proposto) — confermare o cambiare.
- Visibilità repo: public (proposto, coerente con portfolio pubblico) — confermare.
- Dominio: `jacopino.dev` (proposto) — confermare o sostituire.
- Lingua content di default al primo visit: `it` (proposto) o auto-detect `navigator.language`.
- Avatar nel start menu: foto personale o avatar pixel art Y2K stilizzato.

---

**Next step**: dopo review utente, invocare skill `writing-plans` per produrre piano di implementazione step-by-step con fasi commit-by-commit.
