#!/usr/bin/env bash
#
# Subset Geist and Geist Mono to Latin and write them into public/fonts.
#
# Run once; commit the outputs. v5 self-hosts its type so the homepage makes no
# third-party request before LCP (HOMEPAGE_REDESIGN.md §11.1, §11.2).
#
# Three files, three jobs:
#   Geist SemiBold (static)  the hero and section display. Static on purpose:
#                            -webkit-text-stroke strokes every contour, and a
#                            variable instance can show its internal overlap
#                            lines under a stroke.
#   Geist Variable           everything else, 400 to 600.
#   GeistMono Medium (static) the spec layer, and the `.mono` rule the five case
#                            studies already use.
#
# pyftsubset is a console script that pip puts in Python's Scripts directory,
# which is not on PATH in Git Bash on Windows. The module entry point is the
# same program, so prefer the script and fall back to it.
set -euo pipefail

SRC=node_modules/geist/dist/fonts
OUT=public/fonts

if [ ! -d "$SRC" ]; then
  echo "geist is not installed. Run: npm i -D geist" >&2
  exit 1
fi

if command -v pyftsubset >/dev/null 2>&1; then
  sub() { pyftsubset "$@"; }
elif python -c "import fontTools" >/dev/null 2>&1; then
  sub() { python -m fontTools.subset "$@"; }
else
  echo "fonttools is missing. Run: pip install fonttools brotli" >&2
  exit 1
fi

# ASCII, plus the punctuation and arrows the copy and the spec chips use.
U="U+0020-007E,U+00A0,U+00A9,U+00AE,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2122,U+2190-2193,U+2197"
# tnum for the tabular figures in meta rows and counters; case for the arrows.
F="kern,liga,calt,tnum,case"

mkdir -p "$OUT"

one() { # <source file> <output name>
  sub "$1" --unicodes="$U" --layout-features="$F" --flavor=woff2 --output-file="$OUT/$2"
  printf '  %-34s %6s KB\n' "$2" "$(( ($(wc -c <"$OUT/$2") + 512) / 1024 ))"
}

# read through the file path, not the package name: geist's "exports" map does
# not expose ./package.json, so require('geist/package.json') throws
echo "Subsetting Geist $(node -p "require('./node_modules/geist/package.json').version") to Latin:"
one "$SRC/geist-sans/Geist-SemiBold.woff2"   Geist-SemiBold-latin.woff2
one "$SRC/geist-sans/Geist-Variable.woff2"   Geist-Variable-latin.woff2
one "$SRC/geist-mono/GeistMono-Medium.woff2" GeistMono-Medium-latin.woff2
printf '  %-34s %6s KB\n' "total" "$(( ($(cat "$OUT"/*.woff2 | wc -c) + 512) / 1024 ))"
