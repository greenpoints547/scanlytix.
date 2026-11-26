import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Share2, ArrowLeft, AlertTriangle, CheckCircle2, Home } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { reasoning, pad, scanLabel } from "../../lib/analysis.js";
import { fmtDate } from "../../lib/format.js";
import { Logo, Aurora } from "../../components/ui.jsx";
import HeaderTools from "../../components/portal/HeaderTools.jsx";
import Toast from "../../components/Toast.jsx";

// Radiologist report page. Text is generated from the AI scores for the demo.
export default function ReportDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { scans, user, toast } = useApp();
  const s = scans.find((x) => x.id === +id);

  const bar = (
    <header className="rp-bar no-print"><Link to="/dashboard"><Logo height={46} /></Link><Link className="rp-home" to="/dashboard"><Home size={18} /> Home</Link><div className="rp-grow" /><HeaderTools /></header>
  );
  if (!s || s.stage !== "reported" || !s.result)
    return (<div className="rp"><Aurora />{bar}<div className="rp-in"><div className="glass empty">This report is not available yet. <Link className="ul" to="/reports">Back to Reports</Link></div></div><Toast /></div>);

  const r = s.result, info = reasoning(r);
  const pid = "PID-" + pad((user.email || "x").split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7), 5);
  const sc = r.scores;
  const sug = r.flagged
    ? ["Consultation with a specialist (pulmonology or oncology) about the flagged finding.", "Consider follow-up imaging according to clinical guidelines.", "Clinical correlation with symptoms and laboratory results."]
    : ["No specialist referral is suggested by this analysis.", "Routine follow-up as clinically indicated."];
  const share = async () => {
    const t = `ScanLytix report #RPT-${pad(s.id)} · ${scanLabel(s)} · ${fmtDate(s.date)} · ${r.flagged ? "Review recommended" : "No review needed"}`;
    try { await navigator.clipboard.writeText(t); toast("Summary copied"); } catch (e) { toast("Copy not available in this browser"); }
  };
  const L = ({ k, v }) => <div className="rp-f"><small>{k}</small><b>{v || "Not provided"}</b></div>;

  return (
    <div className="rp">
      <Aurora />{bar}
      <div className="rp-in pg">
        <h1>Radiologist Report</h1>
        <p className="mu rp-sub">Detailed radiological findings and impressions for your scan. Demo report: figures are simulated.</p>
        <div className="rp-grid">
          <div className="rp-col">
            <div className="glass"><h3 className="rp-h">Patient Information</h3>
              <div className="rp-2"><L k="Patient Name:" v={user.name} /><L k="Patient ID:" v={pid} /><L k="Location:" v={user.location} /><L k="Contact Info" v={user.contact} /><L k="Age/Sex" v={[user.age, user.sex].filter(Boolean).join(" / ")} /><L k="Registration date:" v={fmtDate(user.created)} /></div></div>
            <div className="glass"><h3 className="rp-h">Impressions</h3>
              <div className={"rp-crit " + (r.flagged ? "bad" : "ok")}>{r.flagged ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}<div><b>{r.flagged ? "Critical Findings" : "No Critical Findings"}</b><p>{r.flagged ? "The findings warrant further clinical correlation and evaluation by a specialist." : "No findings that require urgent attention were flagged in this analysis."}</p></div></div>
              <ul className="rp-ul"><li>{r.flagged ? `${r.top.name} flagged with ${r.top.conf}% AI confidence.` : `AI confidence in a normal study: ${r.confidence}%.`}</li><li>Category scores: nodule {sc.nodule}%, infection {sc.infection}%, inflammation {sc.inflammation}%.</li></ul></div>
            <div className="glass rp-sig"><div><b>Dr. Demo Radiologist</b><small className="mu">Board Certified Radiologist (demo)</small></div><i>Digital Signature</i></div>
          </div>
          <div className="rp-col">
            <div className="rp-2 rp-top">
              <div className="glass"><h3 className="rp-h">Clinical History</h3><p>{s.symptoms.length ? `Patient-reported: ${s.symptoms.join("; ")}.` : "No symptoms were reported with this scan."} The AI analysis was completed on {fmtDate(s.date)}.</p></div>
              <div className="glass rp-meta"><span><small>Report ID:</small> #RPT-{pad(s.id)}</span><span><small>Date:</small> {s.reportedAt || s.date}</span><span><small>Case no:</small> #CASE-{pad(s.id * 7)}</span></div>
            </div>
            <div className="glass"><h3 className="rp-h">Detailed Findings</h3>
              <p>The {scanLabel(s)} ({s.file}) was analyzed by the AI system. {r.flagged ? `${r.top.name} was the highest-scoring category.` : "No category exceeded the review threshold."}</p>
              {info.assessment.map((t) => <p key={t} style={{ marginTop: 12 }}>{t}</p>)}</div>
            <div className="rp-2 rp-top">
              <div className="glass"><h3 className="rp-h">Radiologist Suggestions</h3>{sug.map((t) => <p key={t} style={{ marginBottom: 12 }}>{t}</p>)}</div>
              <div className="glass"><h3 className="rp-h">Quick Actions</h3><div className="rp-qa no-print"><button className="btn block" onClick={() => window.print()}><Download size={18} /> Download PDF</button><button className="btn block" onClick={share}><Share2 size={18} /> Share</button><button className="btn block" onClick={() => nav("/dashboard")}><ArrowLeft size={18} /> Back to Dashboard</button></div></div>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}
