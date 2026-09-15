import { useMemo } from "react";
import rawPreviews from "./previews.tsx?raw";

/* ──────────────────────────────────────────────────────────────────────────
   "This is not a screenshot."

   The previews are live React components and nothing on the page said so —
   which threw away the single most persuasive thing this portfolio has. A
   founder reading four captioned images learns nothing a PDF could not tell
   them. A founder who can flip the frame over and read the component that is
   running on the other side has their question answered without a claim being
   made.

   THE SOURCE IS IMPORTED RAW, not pasted. `previews.tsx?raw` hands Vite the
   actual file contents at build time and the function is sliced out of it by
   name, so what is displayed is by construction the code that renders the
   thing you were just watching. A copied snippet would start lying the first
   time either side was edited; this one cannot.

   The highlighter is deliberately small: comments, strings, keywords, JSX
   tags and numbers. Five token types, matching the five type sizes elsewhere.
   It builds React nodes rather than HTML strings — no dangerouslySetInnerHTML
   anywhere near a file that is being displayed verbatim.
   ────────────────────────────────────────────────────────────────────────── */

/** Slice one function out of the raw module by walking its braces — the same
    approach used to extract these components in the first place, so the two
    stay consistent. */
export function sourceOf(fnName: string): string {
  const at = rawPreviews.indexOf(`export function ${fnName}`);
  if (at < 0) return "";
  const bodyOpen = rawPreviews.indexOf(") {", at);
  if (bodyOpen < 0) return "";
  let i = bodyOpen + 2;
  let depth = 0;
  for (; i < rawPreviews.length; i++) {
    const c = rawPreviews[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return rawPreviews.slice(at, i + 1);
    }
  }
  return "";
}

const KEYWORDS = new Set([
  "import", "export", "function", "const", "let", "return", "if", "else",
  "for", "of", "in", "new", "true", "false", "null", "undefined", "typeof",
  "default", "from", "await", "async",
]);

/* one pass, ordered so the greedy things win: comments, then strings, then
   words and numbers. Anything unmatched falls through as plain text. */
const TOKEN = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

export function Highlight({ code }: { code: string }) {
  const nodes = useMemo(() => {
    const out: React.ReactNode[] = [];
    let last = 0;
    let key = 0;
    let m: RegExpExecArray | null;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code))) {
      if (m.index > last) out.push(code.slice(last, m.index));
      const [full, comment, str, num, word] = m;
      if (comment) out.push(<span key={key++} className="tok tok--c">{full}</span>);
      else if (str) out.push(<span key={key++} className="tok tok--s">{full}</span>);
      else if (num) out.push(<span key={key++} className="tok tok--n">{full}</span>);
      else if (word && KEYWORDS.has(word)) out.push(<span key={key++} className="tok tok--k">{full}</span>);
      else out.push(full);
      last = m.index + full.length;
    }
    if (last < code.length) out.push(code.slice(last));
    return out;
  }, [code]);

  return <code className="src__code">{nodes}</code>;
}

/** Line count, for the caption. Cheap enough to do inline but it reads better
    named, and the caption is making a factual claim about the file. */
export function lineCount(code: string) {
  return code ? code.split("\n").length : 0;
}
