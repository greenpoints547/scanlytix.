import { Link, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { scanLabel, pad } from "../../lib/analysis.js";
import { fmtDate } from "../../lib/format.js";
import PageHead from "../../components/portal/PageHead.jsx";
import Reveal from "../../components/Reveal.jsx";

export default function Reports() {
  const { scans } = useApp();
  const nav = useNavigate();
  const done = scans.filter((s) => s.stage === "reported").sort((a, b) => b.id - a.id);
  return (
    <div>
      <PageHead title="Reports" sub="Radiologist reports that are ready to read, print or share." />
      {done.length ? (
        <div className="grid3">
          {done.map((s, i) => (
            <Reveal className="rep-card glass lift" key={s.id} delay={(i % 3) * 90}>
              <span className="sc-ic big"><FileText size={26} /></span>
              <h3>Report #RPT-{pad(s.id)}</h3>
              <p className="mu">{scanLabel(s)} · {fmtDate(s.reportedAt || s.date)}</p>
              <p className="mu small">{s.file}</p>
              <button className="btn" onClick={() => nav("/reports/" + s.id)}>Open report</button>
            </Reveal>
          ))}
        </div>
      ) : <div className="glass empty">No reports yet. Ask a radiologist to review an analyzed scan from <Link className="ul" to="/upload">Upload</Link>.</div>}
    </div>
  );
}
