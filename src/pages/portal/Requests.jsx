import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { scanLabel, today } from "../../lib/analysis.js";
import { fmtDate } from "../../lib/format.js";
import PageHead from "../../components/portal/PageHead.jsx";
import { StatusBadge } from "../../components/ui.jsx";
import Reveal from "../../components/Reveal.jsx";

const TRACK = ["Request sent", "In review", "Report ready"];

export default function Requests() {
  const { scans, updateScan, toast } = useApp();
  const nav = useNavigate();
  const rows = scans.filter((s) => s.stage === "requested" || s.stage === "reported").sort((a, b) => b.id - a.id);
  const reply = (s) => { updateScan(s.id, { stage: "reported", reportedAt: today() }); toast("Demo: radiologist report received"); };
  return (
    <div>
      <PageHead title="Requests" sub="Scans you sent to a radiologist, and how far each one has come." />
      <div className="note glass" style={{ marginBottom: 18 }}>Demo mode: a real radiologist is not connected yet. Use “Simulate reply” to see a finished review.</div>
      {rows.length ? (
        <div className="stack">
          {rows.map((s, i) => {
            const at = s.stage === "reported" ? 3 : 2;
            return (
              <Reveal className="req glass" key={s.id} delay={i * 80}>
                <div className="req-h"><div><h3>{scanLabel(s)}</h3><p className="mu small">{s.file} · Sent {fmtDate(s.requestedAt || s.date)}</p></div><StatusBadge stage={s.stage} /></div>
                <ol className="track">{TRACK.map((t, k) => <li key={t} className={k < at - (s.stage === "reported" ? 0 : 1) ? "done" : k === at - 1 ? "cur" : ""}><span>{k < at - 1 || s.stage === "reported" ? <Check size={14} /> : k + 1}</span>{t}</li>)}</ol>
                <div className="acts">
                  {s.stage === "requested" ? (<><button className="btn sm out" onClick={() => nav("/scans/" + s.id)}>View result</button><button className="btn sm" onClick={() => reply(s)}>Simulate reply</button></>) : <button className="btn sm" onClick={() => nav("/reports/" + s.id)}>Open report</button>}
                </div>
              </Reveal>
            );
          })}
        </div>
      ) : <div className="glass empty">No requests yet. Analyze a scan, then choose “Ask a radiologist to review”. <Link className="ul" to="/upload">Upload a scan</Link></div>}
    </div>
  );
}
