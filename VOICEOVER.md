# VOICEOVER.md — recording the case study films

The Bumper explainer plays with the browser's own synthesised voice, which
costs nothing, needs no account, and sounds like what it is. Replacing it
takes one prop.

---

## 1. The script

Thirty seconds, five lines. Written to be read aloud rather than read: short
clauses, numbers spelled the way a person says them, no sentence that needs a
comma to survive.

| # | Starts at | Line |
|---|---|---|
| 1 | 0s | One-click checkouts are built to beat your judgement. |
| 2 | 7s | The impulse window is under thirty seconds. |
| 3 | 13s | Bumper spends those thirty seconds differently. It blurs the urgency and shows what the money could fund instead. |
| 4 | 21s | Not a number. A trip. |
| 5 | 25s | Seventy-three percent chose the goal. It is live on the Chrome Web Store. |

Read straight through at a normal pace, leaving a beat between lines. Aim for
about thirty seconds total. Do not perform it; the copy is dry on purpose.

## 2. Recording it

**Your own voice is the recommendation.** It is free, it carries no licence
restriction, and for a portfolio arguing that one person designs and ships,
a founder hearing that person is worth more than a stock avatar reading at
them. A phone in a quiet room, about a foot from your mouth, is enough.

**If you would rather synthesise it:** TTSMaker and Luvvoice both run in the
browser with no account and no card, and export MP3. Check their terms for
commercial use before shipping, because a portfolio soliciting work counts as
commercial. ElevenLabs sounds better and its free tier explicitly excludes
commercial use, so that one needs the paid plan to be used here honestly.

Export as MP3, mono is fine, 128kbps is plenty for speech.

## 3. Dropping it in

1. Put the file at `public/film/bumper.mp3`.
2. In `src/components/case/BumperFilm.tsx`, add one prop:

```tsx
<Explainer
  audioSrc="/film/bumper.mp3"
  compact={compact}
  scenes={SCENES}
  ...
```

That is the whole change. **The recording then becomes the clock**: the
picture follows `audio.currentTime` rather than a timer, so the film cannot
drift from the voice however long the read actually runs, and the browser
voice is never used. If the file fails to load the film falls back to the
wall clock and still plays, because a missing asset must not leave it frozen
on its first shot.

## 4. If the timings do not match your read

Adjust the `at` values in `SCENES` to where each line actually begins in your
recording, and set `duration` to its real length. Nothing else moves.

## 5. If you go with a produced video instead

An MP4 replaces the whole component rather than feeding it. That is a small
addition, not a rewrite: a styled `<video>` with the same chrome, the same
two placements, and a `<track kind="captions">` carrying the lines above.
Say the word when there is a file.

Whatever produces it, check for a watermark before shipping. Every free tier
of every AI avatar tool applies one, and a watermarked video on a portfolio
about craft costs more than it earns.
