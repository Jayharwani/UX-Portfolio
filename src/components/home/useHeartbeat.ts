import { useEffect, useState } from "react";

/* A counter that ticks every `period` ms while `enabled`, and stops dead
   otherwise. Callers use it as a React key to replay a subtree.

   setInterval, not requestAnimationFrame. This is a schedule, not an
   animation: it wants to fire at 6.2 seconds regardless of how many frames
   happened in between, and rAF would silently stop scheduling in exactly the
   situations where the interval is still correct. The animation it restarts
   is the component's own.

   It resets to 0 whenever it is disabled, so a card scrolled away and back
   begins its story again rather than resuming someone else's middle. */
export function useHeartbeat(enabled: boolean, period: number) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setBeat(0);
      return;
    }
    const id = window.setInterval(() => setBeat((b) => b + 1), period);
    return () => window.clearInterval(id);
  }, [enabled, period]);

  return beat;
}
