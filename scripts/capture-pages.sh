#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8787}"
OUT_DIR="${OUT_DIR:-.tmp/screenshots}"
WIDTH="${WIDTH:-1440}"
HEIGHT="${HEIGHT:-1000}"

mkdir -p "$OUT_DIR"

capture() {
  local page="$1"
  local home="/tmp/taskdash-shot-${page}"
  local runtime="/tmp/taskdash-shot-runtime-${page}"
  HOME="$home" XDG_RUNTIME_DIR="$runtime" firefox --headless \
    --window-size="${WIDTH},${HEIGHT}" \
    --screenshot "${OUT_DIR}/${page}.png" \
    "${BASE_URL}/?shot=${page}#${page}"
}

capture overview
capture market
capture tasks
capture archive
capture focus
capture settings
