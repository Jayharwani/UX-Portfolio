"""Lift the four mockup markup strings out of reference/index.html.

Extracted rather than retyped: reference/index.html is the visual source of
truth per CLAUDE.md, and 2 KB of hand-copied markup is 2 KB of opportunity to
introduce a difference nobody would ever find.

Run:  python scripts/extract-mockups.py
"""

import io
import json
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

SRC = "reference/index.html"
OUT = "src/data/mockups.ts"

html = io.open(SRC, encoding="utf-8").read()
js = "\n".join(re.findall(r"<script[^>]*>(.*?)</script>", html, re.S))

start = js.index("var M={")
i = js.index("{", start)
depth = 0
j = i
while j < len(js):
    if js[j] == "{":
        depth += 1
    elif js[j] == "}":
        depth -= 1
        if depth == 0:
            break
    j += 1
block = js[i : j + 1]

# key:'...' where the value may contain escaped quotes
BS = chr(92)
pattern = r"(\w+)\s*:\s*'((?:[^'" + BS + BS + r"]|" + BS + BS + r".)*)'"
entries = re.findall(pattern, block)
assert len(entries) == 4, "expected 4 mockups, found %d" % len(entries)

HEAD = """/* --------------------------------------------------------------------------
   MOCKUP MARKUP

   Lifted verbatim from reference/index.html by scripts/extract-mockups.py.
   The reference is the visual source of truth, so these are extracted rather
   than retyped and cannot drift from the thing they were checked against.

   They are strings because they are injected, and they are injected because
   each animation is a CSS keyframe tied to an `.on` class: replaying one
   means re-creating its nodes. In React that is a key change rather than an
   innerHTML assignment, but the markup still has to arrive as markup.

   Static, authored here, and never touched by anything a visitor can type,
   which is the only reason dangerouslySetInnerHTML is defensible.
   -------------------------------------------------------------------------- */

export type MockupKey = "headroom" | "signal" | "chrono" | "bumper";

export const MOCKUPS: Record<MockupKey, string> = {
"""

body = "".join("  %s:\n    %s,\n" % (k, json.dumps(v)) for k, v in entries)
io.open(OUT, "w", encoding="utf-8", newline="\n").write(HEAD + body + "};\n")

print("wrote " + OUT)
for k, v in entries:
    print("  %-9s %5d chars" % (k, len(v)))
