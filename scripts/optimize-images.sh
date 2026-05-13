#!/usr/bin/env bash
# One-shot image optimization. Run locally, requires ImageMagick + pngquant.
set -e
magick mogrify -resize '1920x1080>' -quality 82 assets/img/wallpaper/*.jpg 2>/dev/null || true
pngquant --skip-if-larger --quality 75-90 --ext .png --force assets/img/icons/*.png 2>/dev/null || true
echo "✓ Optimized"
