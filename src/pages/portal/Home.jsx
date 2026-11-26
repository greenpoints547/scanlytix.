import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, Hourglass, FileCheck2, Layers, ArrowRight, Search, Sparkles, Upload, ScanLine, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { STAGE, scanLabel } from "../../lib/analysis.js";
import { fmtDate, firstName } from "../../lib/format.js";
import { StatusBadge, Gauge } from "../../components/ui.jsx";
import BodyMap, { ORGANS } from "../../components/BodyMap.jsx";
import Reveal from "../../components/Reveal.jsx";
import CountUp from "../../components/CountUp.jsx";

const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const ICON = { uploaded: Upload, analyzed: Sparkles, requested: Hourglass, reported: FileCheck2 };

function nextStep(scans) {
  const by = (st) => scans.filter((s) => s.stage === st).sort((a, b) => b.id - a.id)[0];
  const u = by("uploaded"), a = by("analyzed"), r = by("reported"), q = by("requested");
  if (u) return { Icon: ScanLine, title: "Analyze your scan", text: `${u.file} is uploaded. Start the AI analysis to see your result.`, to: "/scans/" + u.id, cta: "Analyze now" };
  if (a) return { Icon: Sparkles, title: "Your AI result is ready", text: "Read it in simple words, then ask a radiologist for a detailed review.", to: "/scans/" + a.id, cta: "See result" };
  if (r) return { Icon: FileCheck2, title: "A report is ready", text: "A radiologist report is waiting for you.", to: "/reports/" + r.id, cta: "Open report" };
  if (q) return { Icon: Hourglass, title: "Review in progress", text: "A radiologist is reviewing your scan. We will notify you here.", to: "/requests", cta: "See requests" };
  return { Icon: UploadCloud, title: "Start with your first scan", text: "Upload a CT scan and get an easy-to-read result in minutes.", to: "/upload", cta: "Upload a scan" };
}

export default function Home() {
  const { scans, user, toast } = useApp();
  const nav = useNavigate();
  const [organ, setOrgan] = useState("lungs");
  const [q, setQ] = useState("");
  const [f, setF] = useState("All");
  const pending = scans.filter((s) => s.stage === "requested").length;
  const done = scans.filter((s) => s.stage === "reported").length;
  const ns = nextStep(scans);
  const latest = scans.filter((s) => s.result).sort((a, b) => b.id - a.id)[0];
  const org = ORGANS.find((o) => o.key === organ);
  const rows = scans.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .filter((s) => (f === "All" || STAGE[s.stage].status === f) && (scanLabel(s) + s.file).toLowerCase().includes(q.toLowerCase()));
  const open = (s) => nav(s.stage === "reported" ? "/reports/" + s.id : "/scans/" + s.id);
  const pick = (k) => { setOrgan(k); const o = ORGANS.find((x) => x.key === k); if (!o.live) toast(`${o.name} analysis is coming soon. Lungs are live today.`); };

  return (
    <div className="dh-wrap">
      <div className="dh">
        <div className="dh-l">
          <Reveal>
            <p className="eyebrow">{greet()}</p>
            <h1 className="hello">Hello, {firstName(user.name)}</h1>
            <p className="lead">Your CT scans, explained in simple words.</p>
            <Link className="btn lg glow" to="/upload"><UploadCloud size={22} /> Upload a CT scan</Link>
          </Reveal>
          <div className="ms-grid">
            {[[Hourglass, "Waiting for review", pending, "/requests"], [FileCheck2, "Reports ready", done, "/reports"], [Layers, "Total scans", scans.length, "/scans"]].map(([Icon, l, v, to], i) => (
              <Reveal as={Link} to={to} className="ms glass lift" key={l} delay={120 + i * 90}><Icon size={20} /><b><CountUp value={v} /></b><span>{l}</span></Reveal>
            ))}
          </div>
          <Reveal className="next glass" delay={300}>
            <span className="next-ic"><ns.Icon size={24} /></span>
            <div><small>Your next step</small><h3>{ns.title}</h3><p>{ns.text}</p></div>
            <Link className="btn sm" to={ns.to}>{ns.cta} <ArrowRight size={15} /></Link>
          </Reveal>
        </div>

        <div className="dh-c">
          <BodyMap active={organ} onSelect={pick} flagged={!!(latest && latest.result.flagged)} />
          <div className="bm-info glass">
            <b>{org.name}</b><span className={"badge " + (org.live ? "ok" : "soon")}>{org.live ? "Live now" : "Coming soon"}</span>
            <p>{org.hint}. {org.live ? "Upload a CT scan to check this organ." : "We are working on this one."}</p>
          </div>
        </div>

        <div className="dh-r">
          <Reveal className="latest glass" delay={150}>
            <div className="card-h"><h3>Latest AI result</h3>{latest && <StatusBadge stage={latest.stage} />}</div>
            {latest ? (<>
              <Gauge value={latest.result.top.conf} label={latest.result.flagged ? latest.result.top.name : "No concern"} size={150} />
              <p className="mu small">{scanLabel(latest)} · {fmtDate(latest.date)}</p>
              <button className="btn out sm" onClick={() => open(latest)}>View details <ArrowRight size={14} /></button>
            </>) : <p className="mu">No results yet. Upload a scan to see your first one.</p>}
          </Reveal>
          <Reveal className="tip glass" delay={260}>
            <CheckCircle2 size={22} /><div><b>Tip</b><p>Results are decision support only. Always talk to a doctor about your health.</p></div>
          </Reveal>
        </div>
      </div>

      <section className="act glass">
        <div className="act-h">
          <div><h2>Recent activity</h2><p className="mu">Everything you have done, newest first.</p></div>
          <div className="act-f">
            <label className="search"><Search size={17} /><input aria-label="Search by scan" placeholder="Search scans" value={q} onChange={(e) => setQ(e.target.value)} /></label>
            <div className="chips">{["All", "Pending", "Completed", "In Progress", "Analyzed"].map((x) => <button key={x} className={"chip" + (f === x ? " on" : "")} onClick={() => setF(x)}>{x}</button>)}</div>
          </div>
        </div>
        <ul className="act-l">
          {rows.length ? rows.map((s, i) => {
            const Icon = ICON[s.stage];
            return (
              <li key={s.id} className="act-row" style={{ animationDelay: i * 50 + "ms" }}>
                <span className={"act-ic " + STAGE[s.stage].tone}><Icon size={18} /></span>
                <div className="act-t"><b>{STAGE[s.stage].activity}</b><small>{scanLabel(s)} · {s.file}</small></div>
                <span className="act-d">{fmtDate(s.date)}</span>
                <StatusBadge stage={s.stage} />
                <button className="btn sm out" onClick={() => open(s)}>View</button>
              </li>
            );
          }) : <li className="empty">Nothing here yet. <Link className="ul" to="/upload">Upload a scan</Link>.</li>}
        </ul>
      </section>
    </div>
  );
}
