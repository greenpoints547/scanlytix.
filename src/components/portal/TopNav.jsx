import { useLayoutEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, UploadCloud, FolderOpen, MessageCircleQuestion, ClipboardPlus } from "lucide-react";
import { Logo } from "../ui.jsx";
import HeaderTools from "./HeaderTools.jsx";

export const NAV = [["/dashboard", "Home", Home], ["/upload", "Upload", UploadCloud], ["/scans", "My Scans", FolderOpen], ["/requests", "Requests", MessageCircleQuestion], ["/reports", "Reports", ClipboardPlus]];
// The upload flow also covers a single scan page (/scans/:id).
export const isOn = (to, p) => (to === "/upload" ? p === "/upload" || p.startsWith("/scans/") : to === "/scans" ? p === "/scans" : to === "/reports" ? p.startsWith("/reports") : p === to);

export default function TopNav() {
  const { pathname } = useLocation();
  const nav = useRef(null);
  // slide the highlight bubble under the active tab
  useLayoutEffect(() => {
    const el = nav.current && nav.current.querySelector(".on");
    if (el) { nav.current.style.setProperty("--x", el.offsetLeft + "px"); nav.current.style.setProperty("--w", el.offsetWidth + "px"); nav.current.classList.add("tn-ready"); }
    else nav.current && nav.current.classList.remove("tn-ready");
  }, [pathname]);

  return (
    <header className="tn">
      <div className="tn-in glass">
        <NavLink to="/dashboard" className="tn-logo" aria-label="ScanLytix home"><Logo height={44} /></NavLink>
        <nav className="tn-nav" ref={nav} aria-label="Main">
          <i className="tn-ind" />
          {NAV.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className={"tn-link" + (isOn(to, pathname) ? " on" : "")}><Icon size={19} /><span>{label}</span></NavLink>
          ))}
        </nav>
        <HeaderTools />
      </div>
    </header>
  );
}

export function BottomTabs() {
  const { pathname } = useLocation();
  return (
    <nav className="bt glass" aria-label="Main">
      {NAV.map(([to, label, Icon]) => <NavLink key={to} to={to} className={"bt-link" + (isOn(to, pathname) ? " on" : "")}><Icon size={22} /><span>{label}</span></NavLink>)}
    </nav>
  );
}
