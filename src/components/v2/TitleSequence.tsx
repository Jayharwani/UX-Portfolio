import { useEffect, useState } from "react";

/* --------------------------------------------------------------------------
   TITLE SEQUENCE — SPEC §4, BUILD step 2.

   A hairline scales out from the centre, then two half-height bars slide off
   the top and bottom. Everything it owns is removed from the DOM at 2.7s.

   IT UNMOUNTS ON A TIMER, NOT ON AN ANIMATION EVENT. `animationend` needs a
   frame to have been produced; a document that mounts hidden produces none,
   and the bars would sit over the page forever. setTimeout fires either way,
   which is the only reason this is safe to put in front of the content.

   Skipped entirely under reduced motion, per SPEC §4 — not shortened. Two
   black bars sliding apart IS the sequence, so the honest reduced version is
   no sequence.
   -------------------------------------------------------------------------- */

const END_MS = 2700;

export function TitleSequence() {
  const [gone, setGone] = useState(
    () =>
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (gone) return;
    const t = window.setTimeout(() => setGone(true), END_MS);
    return () => window.clearTimeout(t);
  }, [gone]);

  if (gone) return null;

  return (
    <>
      <div className="bar t" aria-hidden="true" />
      <div className="bar b" aria-hidden="true" />
      <div className="slit" aria-hidden="true" />
    </>
  );
}
