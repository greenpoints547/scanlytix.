import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { Logo } from "../../components/ui.jsx";
import { TAGLINE } from "../../config.js";
import BodyMap from "../../components/BodyMap.jsx";
import { Aurora } from "../../components/ui.jsx";
import Cursor from "../../components/Cursor.jsx";
import { ENABLE_MRI } from "../../config.js";

const demo = ENABLE_MRI
  ? { id: 7, mod: "MRI", region: "Brain", status: "Flagged", findings: [{ name: "Signal abnormality", conf: 88 }] }
  : { id: 7, mod: "CT", region: "Chest", status: "Flagged", findings: [{ name: "Lung nodule", conf: 88 }] };
const ROLES = ["Radiologist", "Doctor", "Student", "Patient"];

// Demo authentication: no real account is created. Replace login() with a call to your backend.
export default function AuthPage({ mode }) {
  const { login, toast } = useApp();
  const nav = useNavigate();
  const signup = mode === "signup";
  const [f, setF] = useState({ name: "", email: "", password: "", role: ROLES[0] });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (signup && !f.name.trim()) return setErr("Please enter your name.");
    if (!/\S+@\S+\.\S+/.test(f.email)) return setErr("Please enter a valid email address.");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    const name = signup ? f.name.trim() : f.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    login({ name, email: f.email, role: signup ? f.role : "Radiologist" });
    toast(signup ? "Account created (demo)" : "Signed in (demo)");
    nav("/dashboard");
  };

  return (
    <div className="auth">
      <Cursor />
      <div className="auth-art">
        <Aurora />
        <Link to="/" className="auth-logo"><Logo height={70} /></Link>
        <div className="auth-viz"><BodyMap size="sm" chips={false} flagged /></div>
        <p>{TAGLINE}.</p>
      </div>
      <div className="auth-form pg">
        <form onSubmit={submit} noValidate>
          <h1>{signup ? "Create your account" : "Welcome back!"}</h1>
          <p className="mu">{signup ? "Enter your details to get started" : "Please enter your details to sign in"}</p>
          {err && <div className="auth-err" role="alert">{err}</div>}
          {signup && <><label htmlFor="an">Full name</label><input id="an" className="pin" value={f.name} onChange={set("name")} /></>}
          <label htmlFor="ae">Email ID</label>
          <input id="ae" className="pin" type="email" placeholder="example@mail.com" value={f.email} onChange={set("email")} />
          <label htmlFor="ap">Password</label>
          <div className="pw">
            <input id="ap" className="pin" type={show ? "text" : "password"} value={f.password} onChange={set("password")} />
            <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>
          {signup ? (
            <><label htmlFor="ar">I am a</label><select id="ar" className="pin" value={f.role} onChange={set("role")}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></>
          ) : (
            <div className="auth-opts"><label className="chk"><input type="checkbox" /> Remember me</label><a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a></div>
          )}
          <button className="pbtn block" type="submit" style={{ marginTop: 22 }}>{signup ? "Create account" : "Sign In"}</button>
          <div className="auth-or"><span>{signup ? "Already have an account?" : "New to ScanLytix?"}</span></div>
          <Link className="pbtn out block" to={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link>
          <p className="mu" style={{ fontSize: 12, marginTop: 18, textAlign: "center" }}>Demo mode: any valid email and a 6+ character password will sign you in.</p>
        </form>
      </div>
    </div>
  );
}
