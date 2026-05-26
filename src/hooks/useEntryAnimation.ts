import { useEffect, useState } from "react";

export function useEntryAnimation(durationMs = 1600): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setProgress(ease);
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);

  return progress;
}
