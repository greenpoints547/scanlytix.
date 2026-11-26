import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UploadCloud, CheckCircle2, ShieldCheck, Sparkles, FileText, AlertTriangle, Check, Loader2, Eye, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { CATS, analyzeScan, reasoning, today } from "../../lib/analysis.js";
import { fmtDate } from "../../lib/format.js";
import PageHead from "../../components/portal/PageHead.jsx";
import { Gauge } from "../../components/ui.jsx";
import BodyMap from "../../components/BodyMap.jsx";
import SliceArt from "../../components/SliceArt.jsx";

const SYMS = ["Cough", "Shortness of breath", "Chest pain", "Fever", "Tiredness", "Weight loss"];
const MSG = [[0, "Securely preparing your scan…"], [20, "Cleaning and aligning the image…"], [45, "Looking at the lungs for nodules…"], [70, "Checking for infection and inflammation…"], [90, "Writing your report…"]];
const slice = { id: 3, mod: "CT", region: "Chest", status: "Clear", findings: [{ name: "", conf: 0 }] };

function Wizard({ step }) {
  const items = ["Upload", "Analyze", "Review", "Report"];
  return (
    <ol className="wz glass" aria-label="Progress">
      {items.map((t, i) => (
        <li key={t} className={i < step ? "done" : i === step ? "cur" : ""}><span>{i < step ? <Check size={16} /> : i + 1}</span>{t}</li>
      ))}
    </ol>
  );
}

export default function UploadFlow() {
  const { id } = useParams();
  const nav = useNavigate();
  const { scans, addScan, updateScan, toast } = useApp();
  const scan = id ? scans.find((s) => s.id === +id) : null;
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(0);
  const [hot, setHot] = useState(false);
  const [syms, setSyms] = useState([]);
  const [extra, setExtra] = useState("");
  const [more, setMore] = useState(false);
  const input = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearInterval(timer.current), []);

  if (id && !scan) return (<div><PageHead title="Scan not found" /><div className="glass empty">This scan does not exist. <Link className="ul" to="/scans">Go to My Scans</Link></div></div>);

  const pick = (f) => {
    if (!f) return;
    if (!(/\.(dcm|nii|nii\.gz|png|jpe?g)$/i.test(f.name) || f.type.startsWith("image/"))) return toast("Unsupported file. Use DICOM, NIfTI, JPEG or PNG.");
    const s = { id: Date.now(), file: f.name, date: today(), region: "Chest", stage: "uploaded", symptoms: [] };
    addScan(s); toast("Scan uploaded"); nav("/scans/" + s.id);
  };
  const toggle = (x) => setSyms((a) => (a.includes(x) ? a.filter((y) => y !== x) : [...a, x]));
  const start = async () => {
    setBusy(true); setProg(4);
    timer.current = setInterval(() => setProg((p) => Math.min(p + 3, 95)), 100);
    try {
      const result = await analyzeScan({ file: scan.file });
      const symptoms = [...syms, ...extra.split(",").map((x) => x.trim()).filter(Boolean)];
      setProg(100);
      updateScan(scan.id, { stage: "analyzed", result, symptoms });
      toast("Analysis complete");
    } catch (e) { toast("Analysis failed. Check the backend connection."); }
    finally { clearInterval(timer.current); setBusy(false); setProg(0); }
  };

  const stage = scan ? scan.stage : "choose";
  const step = stage === "choose" ? 0 : stage === "uploaded" ? 1 : stage === "reported" ? 3 : 2;
  const head = <PageHead title={stage === "choose" ? "Upload your CT scan" : stage === "uploaded" ? "Ready to analyze" : "Your result"} sub={stage === "choose" ? "Three easy steps. No medical knowledge needed." : "Follow the steps at the top. We guide you along the way."} />;

  // 1) choose a file ----------------------------------------------------------
  if (stage === "choose")
    return (
      <div>{head}<Wizard step={0} />
        <div className="up-grid">
          <div className="glass bay-card">
            <div className={"bay" + (hot ? " hot" : "")} tabIndex="0" role="button" aria-label="Choose a CT scan file" onClick={() => input.current.click()} onKeyDown={(e) => e.key === "Enter" && input.current.click()}
              onDragOver={(e) => { e.preventDefault(); setHot(true); }} onDragLeave={() => setHot(false)} onDrop={(e) => { e.preventDefault(); setHot(false); pick(e.dataTransfer.files[0]); }}>
              <i className="bay-r r1" /><i className="bay-r r2" /><i className="bay-r r3" />
              <span className="bay-ic"><UploadCloud size={46} /></span>
              <h2>Drop your CT scan here</h2>
              <p>or <b>click to browse</b> your files</p>
              <small>DICOM, NIfTI, JPEG or PNG</small>
            </div>
            <input ref={input} type="file" accept=".dcm,.nii,.gz,image/*" hidden onChange={(e) => pick(e.target.files[0])} />
            <p className="bay-note"><ShieldCheck size={18} /> Remove names and ID numbers from your scan if you can. In this demo your file stays in your browser.</p>
          </div>
          <div className="up-side">
            <div className="glass"><h3>What happens next</h3>
              <ol className="steps3"><li><span>1</span><div><b>Upload</b><small>Pick the scan file from your computer or phone.</small></div></li><li><span>2</span><div><b>AI checks it</b><small>Takes a few minutes. You see progress live.</small></div></li><li><span>3</span><div><b>Read and share</b><small>Get a plain-language result and ask a radiologist to review.</small></div></li></ol></div>
            <div className="glass"><button className="acc-btn" aria-expanded={more} onClick={() => setMore(!more)}><b>What is a CT scan?</b><ChevronDown size={18} className={more ? "flip" : ""} /></button>
              {more && <p className="mu" style={{ marginTop: 10 }}>A CT scan uses X-rays from many angles to build detailed pictures of the inside of the body. Radiographers take the scan. The AI then looks for nodules, infection and inflammation in the lungs.</p>}</div>
          </div>
        </div>
      </div>
    );

  // 2) ready / analyzing ------------------------------------------------------
  if (stage === "uploaded")
    return (
      <div>{head}<Wizard step={1} />
        {busy ? (
          <div className="analyzing glass">
            <div className="an-vis">
              <svg viewBox="0 0 120 120" className="an-ring"><circle cx="60" cy="60" r="54" fill="none" stroke="var(--track)" strokeWidth="6" /><circle cx="60" cy="60" r="54" fill="none" stroke="url(#anr)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(prog / 100) * 339} 339`} transform="rotate(-90 60 60)" /><defs><linearGradient id="anr"><stop offset="0" stopColor="#63C9D6" /><stop offset="1" stopColor="#1E7F8C" /></linearGradient></defs></svg>
              <div className="an-slice"><SliceArt r={slice} scan /></div>
            </div>
            <h2><span>{prog}</span>%</h2>
            <p className="an-msg" key={[...MSG].reverse().find(([t]) => prog >= t)[1]}>{[...MSG].reverse().find(([t]) => prog >= t)[1]}</p>
            <small className="mu">Please keep this page open. It usually takes about a minute.</small>
          </div>
        ) : (
          <div className="ready glass">
            <div className="rd-file"><CheckCircle2 size={26} /><div><b>{scan.file}</b><small>Uploaded {fmtDate(scan.date)}</small></div></div>
            <h3>Any symptoms? <span className="mu">(optional)</span></h3>
            <p className="mu small">Tap what applies. This helps the radiologist later.</p>
            <div className="chips big">{SYMS.map((x) => <button key={x} className={"chip" + (syms.includes(x) ? " on" : "")} aria-pressed={syms.includes(x)} onClick={() => toggle(x)}>{syms.includes(x) && <Check size={14} />} {x}</button>)}</div>
            <input className="rd-in" aria-label="Other symptoms" placeholder="Anything else? Separate with commas" value={extra} onChange={(e) => setExtra(e.target.value)} />
            <button className="btn lg glow block" onClick={start}><Sparkles size={22} /> Analyze my scan</button>
            <small className="mu">The AI gives an early look. It does not replace a doctor.</small>
          </div>
        )}
      </div>
    );

  // 3) result -----------------------------------------------------------------
  const r = scan.result, info = reasoning(r), flagged = r.flagged;
  const requestReview = () => { updateScan(scan.id, { stage: "requested", requestedAt: today() }); toast("Request sent to a radiologist"); };
  return (
    <div>{head}<Wizard step={step} />
      <div className="res-grid">
        <div className="glass res-vis">
          <div className="card-h"><h3>Where we looked</h3><span className="badge soft">Lungs</span></div>
          <BodyMap size="sm" active="lungs" chips={false} flagged={flagged} />
          <div className="gauges">{CATS.map(([k, n]) => <Gauge key={k} value={r.scores[k]} label={n} size={118} />)}</div>
        </div>
        <div className="res-r">
          <div className={"verdict glass " + (flagged ? "warn" : "ok")}>
            <span className="vd-ic">{flagged ? <AlertTriangle size={34} /> : <CheckCircle2 size={34} />}</span>
            <div>
              <small>In simple words</small>
              <h2>{flagged ? "A doctor should take a look" : "No concerns found"}</h2>
              <p>{flagged ? `The AI noticed something worth checking: ${r.top.name} (${r.top.conf}% match). This is not a diagnosis.` : "The AI did not see signs that need a specialist right now."}</p>
            </div>
          </div>
          <div className="glass">
            <h3>What you can do</h3>
            <ul className="todo">
              {flagged ? (<><li><Check size={17} />Ask a radiologist for a detailed review.</li><li><Check size={17} />Share the report with your doctor.</li><li className="urgent"><AlertTriangle size={17} />If you feel worse or struggle to breathe, get medical care right away.</li></>)
                : (<><li><Check size={17} />Keep your regular check-ups.</li><li><Check size={17} />Talk to your doctor if symptoms continue.</li></>)}
            </ul>
            {scan.symptoms.length > 0 && <p className="mu small" style={{ marginTop: 10 }}>You told us: {scan.symptoms.join(", ")}.</p>}
            <div className="acts" style={{ marginTop: 16 }}>
              {scan.stage === "analyzed" && <button className="btn lg glow" onClick={requestReview}><Eye size={20} /> Ask a radiologist to review</button>}
              {scan.stage === "requested" && <button className="btn lg" disabled><Loader2 className="spin" size={20} /> Review requested</button>}
              {scan.stage === "reported" && <Link className="btn lg glow" to={"/reports/" + scan.id}><FileText size={20} /> Open radiologist report</Link>}
              <Link className="btn out" to="/upload">Upload another</Link>
            </div>
          </div>
          <div className="glass">
            <button className="acc-btn" aria-expanded={more} onClick={() => setMore(!more)}><b>Technical details</b><ChevronDown size={18} className={more ? "flip" : ""} /></button>
            {more && (<div className="tech"><p><b>File:</b> {scan.file}</p>{info.assessment.map((t) => <p key={t}>{t}</p>)}<p><b>AI confidence:</b> {r.confidence}%</p></div>)}
          </div>
          <p className="disc"><AlertTriangle size={18} /> AI results are informational only and do not replace a professional medical diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
