#!/usr/bin/env bash
set -e

# Keep this Codespace aligned with the latest website version on GitHub.
# Preserve the locally uploaded Flagship hero image while syncing code.

HERO_PATH="website/public/flagship-hero.jpg"
HERO_BACKUP="/tmp/flagship-hero-preview.jpg"

if [ -f "$HERO_PATH" ]; then
  cp "$HERO_PATH" "$HERO_BACKUP"
fi

git merge --abort >/dev/null 2>&1 || true
git rebase --abort >/dev/null 2>&1 || true
git fetch origin
git reset --hard origin/main
git clean -fd

if [ -f "$HERO_BACKUP" ]; then
  cp "$HERO_BACKUP" "$HERO_PATH"
fi

echo ""
echo "✓ Codespace is synced to the latest Feels Like Om website."
echo "✓ Your local Flagship hero image has been preserved."
echo "✓ Just refresh your preview."
