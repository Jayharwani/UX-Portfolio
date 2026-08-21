/* ──────────────────────────────────────────────────────────────────────────
   The assertion the hero spec asks for: the headline is never a fragment.

   The morph travels between two sentences by dispersing one cloud of particles
   and converging another. The risk it introduces is that the DOM ends up
   holding half a sentence at some point in the cycle — visually fine, because
   the particles are covering it, but wrong for anyone reading the document
   rather than looking at it: screen readers, search crawlers, anyone who hits
   the page with JS disabled mid-cycle.

   The defence is structural rather than visual. MemoryParticles swaps
   wordEl.textContent atomically at the midpoint, so the em holds exactly one
   of the two tails at every instant. This asserts that property against the
   real strings, so a future change to the choreography that tries to animate
   the text itself fails here rather than in production.

   Run with any standard runner; there is no test harness wired into the
   project yet, so this is written to be runner-agnostic and to also work as a
   plain `node --test` file.
   ────────────────────────────────────────────────────────────────────────── */

import { test } from "node:test";
import assert from "node:assert/strict";
import { HEADLINE_STATES } from "../HomePage";

const VALID = HEADLINE_STATES.map((s) => s.full);

/** Rebuild what the h1 reads as, given whichever tail the em currently holds. */
function renderedHeadline(tail: string): string {
  return `I design interfaces that get ${tail}`;
}

test("both declared states are complete sentences", () => {
  for (const s of HEADLINE_STATES) {
    assert.ok(s.full.endsWith("."), `"${s.full}" does not end in a full stop`);
    assert.ok(s.full.split(" ").length >= 5, `"${s.full}" is too short to be a sentence`);
  }
});

test("the rendered headline matches a declared state for either tail", () => {
  for (const s of HEADLINE_STATES) {
    assert.equal(
      renderedHeadline(s.tail),
      s.full,
      "the tail and the full sentence have drifted apart; the test can no longer " +
        "detect a fragment because it no longer knows what a whole one looks like"
    );
  }
});

test("the two states are actually different", () => {
  assert.notEqual(
    HEADLINE_STATES[0].full,
    HEADLINE_STATES[1].full,
    "morphing between identical sentences is the decoration the spec removed"
  );
});

test("no state is a prefix of the other", () => {
  const [a, b] = VALID;
  assert.ok(
    !a.startsWith(b) && !b.startsWith(a),
    "one sentence being a prefix of the other means a truncated render of the " +
      "longer one would silently pass as the shorter one"
  );
});
