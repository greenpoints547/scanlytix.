import { useEffect, useRef } from "react";
import { reducedMotion } from "../hooks/useReducedMotion.js";

// A small dot that follows the mouse, with a softer ring that trails it and grows over links and buttons.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || reducedMotion()) return undefined;
    let x = -100, y = -100, rx = -100, ry = -100, raf;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const hit = e.target.closest && e.target.closest("a, button, input, select, textarea, [role=button]");
      ring.current.classList.toggle("big", !!hit);
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (<><div ref={ring} className="cur-ring" /><div ref={dot} className="cur-dot" /></>);
}
