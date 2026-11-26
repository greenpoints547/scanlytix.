import { useId, useRef } from "react";

export const ORGANS = [
  { key: "trachea", name: "Trachea", live: false, hint: "Airway narrowing and blockage", side: "l", top: "13%" },
  { key: "lungs", name: "Lungs", live: true, hint: "Nodules, infection and inflammation", side: "l", top: "36%" },
  { key: "esophagus", name: "Esophagus", live: false, hint: "Wall thickening and narrowing", side: "r", top: "20%" },
  { key: "heart", name: "Heart", live: false, hint: "Size and shape changes", side: "r", top: "46%" },
];

// Holographic chest organs. Lungs are live; trachea, esophagus and heart are coming soon.
export default function BodyMap({ active = "lungs", onSelect, flagged = false, chips = true, size = "md" }) {
  const uid = useId().replace(/:/g, "");
  const box = useRef(null);
  const move = (e) => {
    const r = box.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    box.current.style.setProperty("--ry", x * 14 + "deg");
    box.current.style.setProperty("--rx", -y * 10 + "deg");
  };
  const leave = () => { box.current.style.setProperty("--ry", "0deg"); box.current.style.setProperty("--rx", "0deg"); };
  const pick = (k) => onSelect && onSelect(k);
  const org = (k) => ({ className: "organ" + (active === k ? " on" : "") + (flagged && k === "lungs" && active === "lungs" ? " hot" : ""), onClick: () => pick(k), tabIndex: -1 });

  return (
    <div className={"bm " + size} ref={box} onMouseMove={move} onMouseLeave={leave}>
      <div className="bm-orbit o1" /><div className="bm-orbit o2" /><div className="bm-orbit o3" />
      <svg className="bm-svg" viewBox="0 0 400 560" role="img" aria-label="Body map showing soft tissue organs">
        <defs>
          <linearGradient id={uid + "b"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#63C9D6" stopOpacity=".55" /><stop offset=".7" stopColor="#BFEAF2" stopOpacity=".28" /><stop offset="1" stopColor="#BFEAF2" stopOpacity="0" /></linearGradient>
          <linearGradient id={uid + "o"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#63C9D6" stopOpacity=".95" /><stop offset="1" stopColor="#1E7F8C" stopOpacity=".85" /></linearGradient>
          <linearGradient id={uid + "s"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#63C9D6" stopOpacity="0" /><stop offset="1" stopColor="#63C9D6" stopOpacity=".6" /></linearGradient>
          <filter id={uid + "g"} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <clipPath id={uid + "c"}>
            <ellipse cx="200" cy="64" rx="34" ry="42" /><rect x="186" y="98" width="28" height="34" />
            <path d="M118 150 Q152 124 188 122 L212 122 Q248 124 282 150 Q304 162 306 212 L302 332 Q298 372 282 404 L274 540 L126 540 L118 404 Q102 372 98 332 L94 212 Q96 162 118 150Z" />
            <path d="M108 164 Q78 192 72 264 L60 352 Q56 376 72 378 Q88 378 92 354 L112 262Z" /><path d="M292 164 Q322 192 328 264 L340 352 Q344 376 328 378 Q312 378 308 354 L288 262Z" />
          </clipPath>
          <pattern id={uid + "p"} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#63C9D6" strokeOpacity=".25" strokeWidth=".7" /></pattern>
        </defs>

        <g className="bm-body">
          <g clipPath={`url(#${uid}c)`}>
            <rect width="400" height="560" fill={`url(#${uid}b)`} />
            <rect width="400" height="560" fill={`url(#${uid}p)`} />
            <g className="beam"><rect x="0" y="-60" width="400" height="60" fill={`url(#${uid}s)`} /><rect x="0" y="-2" width="400" height="3" fill="#63C9D6" /></g>
          </g>
          <g fill="none" stroke="#63C9D6" strokeWidth="1.6" strokeOpacity=".85">
            <ellipse cx="200" cy="64" rx="34" ry="42" /><path d="M186 104 V132 M214 104 V132" />
            <path d="M118 150 Q152 124 188 122 L212 122 Q248 124 282 150 Q304 162 306 212 L302 332 Q298 372 282 404 L274 540 M126 540 L118 404 Q102 372 98 332 L94 212 Q96 162 118 150" />
            <path d="M108 164 Q78 192 72 264 L60 352 Q56 376 72 378 Q88 378 92 354 L112 262 M292 164 Q322 192 328 264 L340 352 Q344 376 328 378 Q312 378 308 354 L288 262" />
          </g>
        </g>

        <g filter={`url(#${uid}g)`}>
          <g {...org("esophagus")}><path d="M197 112 L205 112 L206 200 Q208 262 204 302 Q202 324 207 340 L199 340 Q195 322 197 302 Q200 262 198 200Z" /></g>
          <g {...org("lungs")}>
            <path d="M176 170 Q142 176 140 242 Q140 296 164 304 Q186 308 192 282 L194 192 Q190 170 176 170Z" fill={`url(#${uid}o)`} />
            <path d="M224 170 Q258 176 260 242 Q260 296 236 304 Q214 308 208 282 L206 192 Q210 170 224 170Z" fill={`url(#${uid}o)`} />
            <path d="M200 160 V220 M200 220 L182 250 M200 220 L218 250" stroke="#EAF7FB" strokeOpacity=".7" strokeWidth="2.2" fill="none" />
          </g>
          <g {...org("trachea")}><path d="M192 106 V164 Q200 172 208 164 V106 Q200 100 192 106Z" /></g>
        </g>
        <g {...org("heart")}><path className="heart" d="M200 250 q-16 -14 -22 4 q-4 16 22 30 q26 -14 22 -30 q-6 -18 -22 -4z" /></g>
        {flagged && active === "lungs" && (<g><circle className="hotspot" cx="232" cy="262" r="16" fill="none" stroke="#F5A524" strokeWidth="3" /><circle cx="232" cy="262" r="6" fill="#F5A524" /></g>)}
      </svg>
      {chips && ORGANS.map((o) => (
        <button key={o.key} className={`bm-chip ${o.side}` + (active === o.key ? " on" : "") + (o.live ? "" : " soon")} style={{ top: o.top }} onClick={() => pick(o.key)} aria-pressed={active === o.key}>
          <i /><span><b>{o.name}</b><small>{o.live ? "Live now" : "Coming soon"}</small></span>
        </button>
      ))}
    </div>
  );
}
