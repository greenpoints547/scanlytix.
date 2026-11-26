import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import logoLight from "../assets/logo-light.png";
import mark from "../assets/logo-mark.png";
import CountUp from "./CountUp.jsx";
import { STAGE } from "../lib/analysis.js";

// The logo sits directly on the page, no box. A light version is used on dark backgrounds.
export function Logo({ height = 46, light = false }) {
  const st = { height, width: "auto" };
  return (
    <span className="logo" style={{ height }}>
      <img className={light ? "lg-x" : "lg-l"} src={light ? logoLight : logo} alt="ScanLytix" style={st} />
      {!light && <img className="lg-d" src={logoLight} alt="" aria-hidden="true" style={st} />}
    </span>
  );
}
export const LogoMark = ({ height = 40 }) => <img src={mark} alt="" aria-hidden="true" style={{ height, width: "auto" }} />;

const initials = (n) => (n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
export function Avatar({ name, size = 40 }) {
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>{initials(name)}</span>;
}

export function StatusBadge({ stage }) {
  const s = STAGE[stage];
  return <span className={"sbadge " + s.tone}>{s.status}</span>;
}

const level = (v) => (v < 20 ? "Low" : v < 50 ? "Medium" : "High");

// Animated three-quarter gauge. Teal when low, amber when high.
export function Gauge({ value, label, size = 140 }) {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 120); return () => clearTimeout(t); }, [value]);
  const r = 42, c = 2 * Math.PI * r, arc = 0.75 * c;
  const hot = value >= 50;
  const id = "g" + label.replace(/\W/g, "") + size;
  return (
    <div className="gauge">
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value} percent, ${level(value)}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={hot ? "#F5A524" : "#63C9D6"} /><stop offset="1" stopColor={hot ? "#E0683A" : "#1E7F8C"} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--track)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${arc} ${c}`} transform="rotate(135 50 50)" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${Math.max(0.1, (arc * v) / 100)} ${c}`} style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.7,.2,1)" }} transform="rotate(135 50 50)" />
        <text x="50" y="52" textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--tx)" fontFamily="Sora, Poppins, sans-serif"><CountUp value={value + "%"} /></text>
        <text x="50" y="66" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={hot ? "#E0683A" : "var(--mu)"}>{level(value)}</text>
      </svg>
      <b>{label}</b>
    </div>
  );
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}

// Soft moving colour blobs behind every page.
export function Aurora() {
  return <div className="aurora" aria-hidden="true"><i className="a1" /><i className="a2" /><i className="a3" /></div>;
}
