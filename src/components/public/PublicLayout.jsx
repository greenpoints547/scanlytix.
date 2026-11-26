import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Send, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Logo, Aurora } from "../ui.jsx";
import { useApp } from "../../context/AppContext.jsx";
import Toast from "../Toast.jsx";
import Cursor from "../Cursor.jsx";

const LINKS = [["/", "Home"], ["/about", "About us"], ["/mission", "Mission"], ["/contact", "Contact us"]];
const dead = (e) => e.preventDefault();

export default function PublicLayout() {
  const { pathname } = useLocation();
  const { user, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [mail, setMail] = useState("");
  const bar = useRef(null);
  const head = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const p = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (head.current) head.current.classList.toggle("scrolled", h.scrollTop > 10);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  const auth = user
    ? <Link className="pbtn dark" to="/dashboard">Dashboard</Link>
    : <><Link className="pbtn dark" to="/login">Login</Link><Link className="pbtn out" to="/signup">Signup</Link></>;
  const subscribe = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(mail)) return toast("Enter a valid email address");
    toast("Thanks! Connect a backend to store subscriptions."); setMail("");
  };

  return (
    <div className="pub">
      <Aurora />
      <Cursor />
      <div className="sprog"><i ref={bar} /></div>
      <header className="pn glass" ref={head}>
        <Link to="/" className="pn-brand" aria-label="ScanLytix home"><Logo height={46} /><small className="pn-slogan">See Beyond Scans</small></Link>
        <nav className={"pn-links" + (open ? " open" : "")}>
          <button className="pn-close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={26} /></button>
          {LINKS.map(([to, l]) => <NavLink key={to} to={to} end>{l}</NavLink>)}
          <div className="pn-auth-m">{auth}</div>
          <small className="pn-tag">Your radiology assistant</small>
        </nav>
        <div className="pn-auth">{auth}</div>
        <button className="pn-menu" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={24} /></button>
      </header>

      <div key={pathname} className="pg"><Outlet /></div>

      <footer className="pf">
        <div className="pf-top">
          <div>
            <Logo height={64} light />
            <h2>Lets <span>Connect</span><br />there.</h2>
            <p className="pf-soc-l">Social Handles</p>
            <div className="pf-social">{[Facebook, Instagram, Linkedin, Twitter].map((I, i) => <a key={i} href="#" aria-label="Social link" onClick={dead}><I size={18} /></a>)}</div>
          </div>
          <div className="pf-cols">
            <div><Link to="/about">About</Link><a href="#" onClick={dead}>Features</a><a href="#" onClick={dead}>Pricing</a></div>
            <div><a href="#" onClick={dead}>Documentation</a><a href="#" onClick={dead}>FAQ</a><Link to="/contact">Support</Link></div>
            <div><Link to="/contact">Contact</Link><a href="#" onClick={dead}>Blog</a></div>
          </div>
        </div>
        <form className="pf-news" onSubmit={subscribe}>
          <span>Get the Latest Information</span>
          <div><input aria-label="Email address" placeholder="Email Address" value={mail} onChange={(e) => setMail(e.target.value)} /><button aria-label="Subscribe"><Send size={18} /></button></div>
        </form>
        <div className="pf-bot">
          <span>© 2026 ScanLytix. All rights reserved.</span>
          <span><a href="#" onClick={dead}>Privacy Policy</a> &nbsp;&nbsp; <a href="#" onClick={dead}>Terms of Service</a></span>
        </div>
      </footer>
      <Toast />
    </div>
  );
}
