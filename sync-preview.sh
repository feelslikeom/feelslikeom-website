#!/usr/bin/env bash
set -e

# Keep this Codespace aligned with the latest website version on GitHub,
# then make sure the Astro preview is running on the Codespaces-forwarded port.

git merge --abort >/dev/null 2>&1 || true
git rebase --abort >/dev/null 2>&1 || true
git fetch origin
git reset --hard origin/main
git clean -fd

cd website

if [ ! -d node_modules ]; then
  npm install
fi

pkill -f "astro dev" >/dev/null 2>&1 || true
nohup npm run dev > /tmp/feelslikeom-preview.log 2>&1 &

echo ""
echo "✓ Codespace is synced to the latest Feels Like Om website."
echo "✓ Website preview is starting on port 4321."
echo "✓ Open the PORTS tab in Codespaces and click the forwarded URL for port 4321."
echo ""
echo "If the port does not appear, run: bash start-preview.sh"
