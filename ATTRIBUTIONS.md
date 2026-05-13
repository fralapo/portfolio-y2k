# Attributions

This portfolio uses third-party assets for the authentic Windows 7 desktop feel.

## Windows 7 visual artwork

### B00merang-Artwork / Windows-7
- Source: https://github.com/B00merang-Artwork/Windows-7
- Repo description: "The original Win2-7 icon theme adjusted to work with GTK 3.18+"
- Files used:
  - `assets/img/icons/progetti.svg` (copy of `scalable/places/folder.svg` from the upstream repo)
  - `assets/img/icons/win7-folder.svg`, `win7-folder-open.svg`, `win7-computer.svg`, `win7-user-home.svg` (alternates available for future swaps)
- The upstream repo does not include an explicit LICENSE file. The Win2-7 icon theme tradition originates from community-maintained themes (see [Win2-7 icon theme history](https://github.com/B00merang-Artwork)). The included PNG glyphs are derivative artwork inspired by Microsoft's Windows 7 visual style.
- This project uses these assets in a non-commercial personal portfolio context, consistent with the spirit of the upstream theme project.

### bartekl1/windows-ui-assets
- Source: https://github.com/bartekl1/windows-ui-assets
- Repo description: "Unofficial collection of UI assets (wallpapers, icons, cursors, sounds) from various versions of Microsoft Windows (XP through 11)"
- Files used (copied from `Cursors/Windows 7/` and `Wallpapers/Windows 7/Desktop/Windows/`):
  - `assets/cursors/aero.cur` (was upstream `aero_arrow.cur`)
  - `assets/cursors/aero-link.cur` (was `aero_link.cur`)
  - `assets/cursors/aero-wait.ani` (was `aero_busy.ani`)
  - `assets/img/wallpaper/win7-default.jpg` (was `img0.jpg`)
- Upstream has no LICENSE file; assets are unofficial archival copies of Microsoft Windows 7 UI elements.

### MCPlayer2015/all-windows-sounds
- Source: https://github.com/MCPlayer2015/all-windows-sounds
- Repo description: "Every Windows sound Microsoft ever made"
- Files used (copied from `(2009) Windows 7/`):
  - `assets/audio/win7-startup.wav` (was `Startup.wav`)
- Upstream has no LICENSE file; assets are archival copies of Microsoft Windows sound effects.

## Other authentic Win7 icon sources (referenced, not bundled)

### visnalize/resources
- Source: https://github.com/visnalize/resources/tree/main/icons/win7
- Viewer: https://win7icons.visnalize.com/
- Contains original `.ico` files extracted from `Shell32.dll`, `imageres.dll`, etc. Not bundled in this repo but recommended for users who want to substitute fully authentic Microsoft icons (Internet Explorer, Recycle Bin, system tray, etc.).

## Removing these assets

If you fork this project for commercial use or want to avoid any IP ambiguity, replace `progetti.svg` and the `win7-*.svg` alternates with your own artwork. The rest of the icon set (`simpsons.svg`, `bart.svg`, `cat-*.svg`, etc.) is original to this project.

## License of original work

Original code, configuration, and project-specific artwork (the colored category icons, project glyphs, hero/sticky CSS, all JS modules) are © 2026 Jacopo Latrofa. License: [add your license of choice — MIT recommended for a personal portfolio source].
