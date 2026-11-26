import { useEffect, useState } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Counts a number up from zero. Handles values like "90%" by keeping the prefix and suffix.
export default function CountUp({ value, duration = 1100 }) {
  const str = String(value);
  const m = str.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = m ? parseFloat(m[2]) : 0;
  const [n, setN] = useState(reducedMotion() ? target : 0);

  useEffect(() => {
    if (!m || reducedMotion()) { setN(target); return undefined; }
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]); // eslint-disable-line

  if (!m) return <>{str}</>;
  return <>{m[1]}{Math.round(n)}{m[3]}</>;
}
