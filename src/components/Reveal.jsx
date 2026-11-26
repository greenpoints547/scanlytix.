import { useEffect, useRef, useState } from "react";

// Fades and slides its content in the first time it scrolls into view.
export default function Reveal({ as: Tag = "div", delay = 0, y = 28, className = "", style, children, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={"rv " + (on ? "in " : "") + className} style={{ ...style, transitionDelay: delay + "ms", "--y": y + "px" }} {...rest}>
      {children}
    </Tag>
  );
}
