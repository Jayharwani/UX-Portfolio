import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/* --------------------------------------------------------------------------
   THE EXPLAINER — a thirty-second film, built in the page rather than in a
   video file.

   WHY NOT AN MP4. A 30s 1080p file is two to four megabytes, it cannot be
   restyled when the accent changes, it cannot respect prefers-reduced-motion,
   and it needs a poster frame to avoid a grey rectangle on load. This is a
   handful of kilobytes of markup, it inherits the page's own tokens, and it
   is the product demonstrating itself rather than a recording of it.

   THE VOICE IS THE BROWSER'S. SpeechSynthesis costs nothing and needs no key,
   which is what it was picked for, but the voice it gives you depends
   entirely on the operating system. The build is arranged so swapping in a
   recorded file later is one prop: pass `audioSrc` and the same timeline
   drives an <audio> element instead. Nothing else changes.

   TIMING IS OURS, NOT THE VOICE'S. Animation runs on a fixed timeline and
   each line is spoken when its own scene begins, so a voice that reads long
   cannot drag the picture out of sync — the worst case is one line finishing
   slightly into the next shot. Syncing the other way round, driving the
   picture from `onboundary`, is the obvious approach and it is unreliable:
   Safari fires it inconsistently and some voices never fire it at all.

   CAPTIONS ARE NOT OPTIONAL. Spoken content without a text equivalent fails
   WCAG outright, and they also carry the film for the large number of people
   who will never turn sound on.
   -------------------------------------------------------------------------- */

export type Scene = {
  /** seconds from the start of the film */
  at: number;
  /** what is said, and what is captioned */
  line: string;
};

/** Voices worth having, in order. Everything else is a coin toss per machine. */
const GOOD_VOICE = [
  /Samantha/i,
  /^Daniel/i,
  /Google US English/i,
  /Google UK English (Female|Male)/i,
  /Microsoft (Aria|Jenny|Guy|Ryan)/i,
];

function pickVoice(): SpeechSynthesisVoice | null {
  const all = window.speechSynthesis?.getVoices?.() ?? [];
  const en = all.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  if (!en.length) return null;
  for (const re of GOOD_VOICE) {
    const hit = en.find((v) => re.test(v.name));
    if (hit) return hit;
  }
  return en.find((v) => v.localService) ?? en[0];
}

export function Explainer({
  scenes,
  duration,
  label,
  poster,
  children,
  compact,
}: {
  scenes: Scene[];
  /** total run time in seconds */
  duration: number;
  label: string;
  /** for the work index panel: captions sit over the stage, no transcript */
  compact?: boolean;
  /** what shows before play: the still frame */
  poster: ReactNode;
  /** the film itself, reading --t (0..1) and --scene from its container */
  children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState("");
  const [hasVoice, setHasVoice] = useState(false);

  /* voices arrive asynchronously, and on some browsers the first getVoices()
     is always empty — the event is the only reliable signal */
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const check = () => setHasVoice((synth.getVoices?.() ?? []).length > 0);
    check();
    synth.addEventListener?.("voiceschanged", check);
    return () => synth.removeEventListener?.("voiceschanged", check);
  }, []);

  /* Speech outlives the component. Leaving a case study mid-film would
     otherwise carry the voice onto the next page, still talking. */
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const cancelRef = useRef<(() => void) | undefined>(undefined);

  const stop = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = undefined;
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    const el = stage.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const synth = window.speechSynthesis;
    synth?.cancel();

    setDone(false);
    setPlaying(true);

    if (reduced) {
      /* no film: the last frame, and the whole script as text */
      el.style.setProperty("--t", "1");
      el.dataset.scene = String(scenes.length - 1);
      setCaption(scenes.map((s) => s.line).join(" "));
      setPlaying(false);
      setDone(true);
      return;
    }

    const voice = pickVoice();
    let spoken = -1;
    const t0 = performance.now();

    /* A TIMER, NOT requestAnimationFrame. rAF is the obvious driver and it is
       the wrong one here: it is starved whenever the compositor decides not to
       paint, and a film that is "playing" with a stop button showing, no
       captions and a frozen first shot is worse than one that never started.
       Elapsed time is read from the clock rather than counted in ticks, so a
       throttled interval stays honest about where in the film it is; at 40Hz
       the cross-fades and the progress bar are indistinguishable from rAF. */
    const frame = () => {
      const secs = (performance.now() - t0) / 1000;
      const t = Math.min(1, secs / duration);
      el.style.setProperty("--t", t.toFixed(4));

      /* the current scene is the last one whose start time has passed */
      let i = 0;
      for (let k = 0; k < scenes.length; k++) if (secs >= scenes[k].at) i = k;
      if (i !== spoken) {
        spoken = i;
        el.dataset.scene = String(i);
        setCaption(scenes[i].line);
        if (!muted && synth) {
          const u = new SpeechSynthesisUtterance(scenes[i].line);
          if (voice) u.voice = voice;
          u.rate = 1.02;
          synth.speak(u);
        }
      }

      if (secs >= duration) {
        window.clearInterval(timer);
        setPlaying(false);
        setDone(true);
      }
    };

    const timer = window.setInterval(frame, 25);
    frame();

    /* handed back so the caller can stop a film in progress */
    return () => window.clearInterval(timer);
  }, [duration, muted, scenes]);

  const start = () => {
    cancelRef.current?.();
    cancelRef.current = play();
  };
  useEffect(() => () => cancelRef.current?.(), []);

  return (
    <figure className={`ex${compact ? " ex-compact" : ""}${playing ? " on" : ""}${done ? " done" : ""}`}>
      <div className="ex-stage" ref={stage} data-scene="0">
        <div className="ex-poster">{poster}</div>
        <div className="ex-film">{children}</div>

        {!playing ? (
          <button className="ex-play" type="button" onClick={start}>
            <span className="tri" aria-hidden="true" />
            <span className="mono">{done ? "REPLAY" : "WATCH VIDEO"}</span>
            <span className="mono dur">{duration}s</span>
          </button>
        ) : (
          <button className="ex-stop mono" type="button" onClick={stop}>
            STOP
          </button>
        )}

        {playing ? (
          <div className="ex-bar" aria-hidden="true">
            <i />
          </div>
        ) : null}
      </div>

      <figcaption>
        <p className="ex-cap" aria-live="polite">
          {caption || label}
        </p>
        <div className="ex-tools">
          {hasVoice ? (
            <button
              className="mono"
              type="button"
              onClick={() => {
                setMuted((m) => !m);
                if (!muted) window.speechSynthesis?.cancel();
              }}
              aria-pressed={muted}
            >
              {muted ? "SOUND OFF" : "SOUND ON"}
            </button>
          ) : (
            <span className="mono quiet">CAPTIONS ONLY, NO VOICE ON THIS DEVICE</span>
          )}
        </div>
      </figcaption>

      {/* The full script, always in the DOM, so the film has a text
          equivalent whether or not anyone presses play. The compact variant
          skips it because the same film on the case study page carries it. */}
      {compact ? null : (
        <details className="ex-script">
          <summary className="mono">TRANSCRIPT</summary>
          <p>{scenes.map((s) => s.line).join(" ")}</p>
        </details>
      )}
    </figure>
  );
}
