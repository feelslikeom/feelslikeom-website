#!/usr/bin/env bash
set -e

# Keep this Codespace aligned with the latest website version on GitHub.
# Safe for preview-only use: any local uncommitted edits are discarded.

git merge --abort >/dev/null 2>&1 || true
git rebase --abort >/dev/null 2>&1 || true
git fetch origin
git reset --hard origin/main
git clean -fd

echo ""
echo "✓ Codespace is synced to the latest Feels Like Om website."
echo "✓ Do not click Commit. Just refresh your preview."
