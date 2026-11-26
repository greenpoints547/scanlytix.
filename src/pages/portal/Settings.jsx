import { Sun, Moon, Monitor } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import PageHead from "../../components/portal/PageHead.jsx";
import Confirm from "../../components/Confirm.jsx";

const T = [["light", "Light", Sun], ["dark", "Dark", Moon], ["system", "Auto", Monitor]];

export default function Settings() {
  const { user, setUser, theme, setTheme, resetDemo, toast } = useApp();
  const set = (k) => (e) => setUser({ ...user, [k]: e.target.value });
  return (
    <div>
      <PageHead title="Settings" sub="Your profile, look and demo data." />
      <div className="set-grid">
        <div className="glass"><h3>Profile <span className="mu small">(shown on reports)</span></h3>
          <div className="form2">
            <div><label htmlFor="n">Full name</label><input id="n" value={user.name} onChange={set("name")} /></div>
            <div><label htmlFor="e">Email</label><input id="e" value={user.email} onChange={set("email")} /></div>
            <div><label htmlFor="a">Age</label><input id="a" type="number" min="0" max="120" value={user.age} onChange={set("age")} /></div>
            <div><label htmlFor="s">Sex</label><select id="s" value={user.sex} onChange={set("sex")}><option value="">Not set</option><option>Female</option><option>Male</option><option>Other</option></select></div>
            <div><label htmlFor="l">Location</label><input id="l" value={user.location} onChange={set("location")} /></div>
            <div><label htmlFor="c">Contact</label><input id="c" value={user.contact} onChange={set("contact")} /></div>
          </div></div>
        <div className="set-col">
          <div className="glass"><h3>Look</h3><div className="chips big">{T.map(([k, l, Icon]) => <button key={k} className={"chip" + (theme === k ? " on" : "")} aria-pressed={theme === k} onClick={() => setTheme(k)}><Icon size={16} /> {l}</button>)}</div></div>
          <div className="glass"><h3>Demo data</h3><p className="mu" style={{ margin: "6px 0 14px" }}>Scans are stored in this browser only. Resetting brings back the sample scans.</p><Confirm label="Reset demo data" onYes={() => { resetDemo(); toast("Demo data restored"); }} /></div>
        </div>
      </div>
    </div>
  );
}
