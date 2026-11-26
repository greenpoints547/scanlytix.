import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, ScanLine } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { STAGE, scanLabel } from "../../lib/analysis.js";
import { fmtDate } from "../../lib/format.js";
import PageHead from "../../components/portal/PageHead.jsx";
import { StatusBadge, Gauge } from "../../components/ui.jsx";
import Confirm from "../../components/Confirm.jsx";
import Reveal from "../../components/Reveal.jsx";

export default function Scans() {
  const { scans, removeScan, toast } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState("All");
  const rows = scans.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).filter((s) => f === "All" || STAGE[s.stage].status === f);
  const open = (s) => nav(s.stage === "reported" ? "/reports/" + s.id : "/scans/" + s.id);
  return (
    <div>
      <PageHead title="My Scans" sub="Every scan you have uploaded and where it stands."><Link className="btn" to="/upload"><UploadCloud size={18} /> Upload new scan</Link></PageHead>
      <div className="chips" style={{ marginBottom: 18 }}>{["All", "In Progress", "Analyzed", "Pending", "Completed"].map((x) => <button key={x} className={"chip" + (f === x ? " on" : "")} onClick={() => setF(x)}>{x}</button>)}</div>
      {rows.length ? (
        <div className="grid3">
          {rows.map((s, i) => (
            <Reveal className="scan-card glass lift" key={s.id} delay={(i % 3) * 80}>
              <div className="sc-top"><span className="sc-ic"><ScanLine size={22} /></span><StatusBadge stage={s.stage} /></div>
              <h3>{scanLabel(s)}</h3>
              <p className="mu small">{s.file}<br />{fmtDate(s.date)}</p>
              {s.result ? <div className="sc-res"><Gauge value={s.result.top.conf} label={s.result.flagged ? s.result.top.name : "No concern"} size={96} /></div> : <p className="sc-none">Not analyzed yet</p>}
              <div className="acts"><button className="btn sm" onClick={() => open(s)}>{s.stage === "uploaded" ? "Analyze" : "View"}</button><Confirm label="Remove" onYes={() => { removeScan(s.id); toast("Scan removed"); }} /></div>
            </Reveal>
          ))}
        </div>
      ) : <div className="glass empty">No scans in this view. <Link className="ul" to="/upload">Upload one</Link>.</div>}
    </div>
  );
}
