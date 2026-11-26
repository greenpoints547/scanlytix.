import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { STAGE, scanLabel } from "../../lib/analysis.js";
import { Avatar } from "../ui.jsx";

// Theme button, notification bell and profile menu shown at the top right of every portal page.
export default function HeaderTools() {
  const { scans, user, logout, theme, setTheme } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const events = scans.slice().sort((a, b) => b.id - a.id).slice(0, 5);
  const count = scans.length;
  const dark = theme === "dark";
  const go = (s) => { setOpen(null); nav(s.stage === "reported" ? "/reports/" + s.id : "/scans/" + s.id); };

  return (
    <div className="pt-tools" ref={ref}>
      <button className="pt-icon" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title="Theme" onClick={() => setTheme(dark ? "light" : "dark")}>
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="pt-pop">
        <button className="pt-icon" aria-label="Notifications" aria-expanded={open === "bell"} onClick={() => setOpen(open === "bell" ? null : "bell")}>
          <Bell size={20} />{count > 0 && <i className="pt-badge">{count >= 5 ? "5+" : count}</i>}
        </button>
        {open === "bell" && (
          <div className="pt-menu">
            <h3>Notifications</h3>
            {events.length ? events.map((s) => (
              <button key={s.id} className="pt-mi" onClick={() => go(s)}>
                <span><b>{STAGE[s.stage].activity}</b><small>{scanLabel(s)} · {s.file}</small></span>
              </button>
            )) : <p className="mu" style={{ padding: 12 }}>You are all caught up.</p>}
          </div>
        )}
      </div>
      <div className="pt-pop">
        <button className="pt-user" aria-expanded={open === "user"} onClick={() => setOpen(open === "user" ? null : "user")}>
          <Avatar name={user.name} size={38} /><ChevronDown size={16} />
        </button>
        {open === "user" && (
          <div className="pt-menu small">
            <div style={{ padding: "8px 12px" }}><b>{user.name}</b><div className="mu" style={{ fontSize: 13 }}>{user.email}</div></div>
            <button className="pt-mi" onClick={() => { setOpen(null); nav("/settings"); }}><Settings size={17} /> Settings</button>
            <button className="pt-mi" onClick={() => { logout(); nav("/"); }}><LogOut size={17} /> Log out</button>
          </div>
        )}
      </div>
    </div>
  );
}
