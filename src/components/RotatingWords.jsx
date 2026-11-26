import { useEffect, useState } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// Cycles through a list of words with a small slide-and-fade animation.
export default function RotatingWords({ words, ms = 2600 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), ms);
    return () => clearInterval(t);
  }, [words.length, ms]);
  return <span key={i} className="rw grad">{words[i]}</span>;
}
