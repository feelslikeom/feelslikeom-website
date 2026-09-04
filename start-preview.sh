#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/website"

if [ ! -d node_modules ]; then
  npm install
fi

npm run dev
