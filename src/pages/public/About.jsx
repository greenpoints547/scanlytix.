import { Sparkles, ScanLine, Brain, FileText } from "lucide-react";
import SliceArt from "../../components/SliceArt.jsx";
import Reveal from "../../components/Reveal.jsx";
import { ENABLE_MRI } from "../../config.js";

const demo = { id: 5, mod: "CT", region: "Chest", status: "Flagged", findings: [{ name: "Lung nodule", conf: 91 }] };

export default function About() {
  return (
    <main className="p-page">
            <div className="p-wrap p-two" style={{ position: "relative", alignItems: "center" }}>
        <Reveal>
          <span className="tagp sm"><Sparkles size={18} /> ABOUT SCANLYTIX</span>
          <h1 className="p-h1">Built for safer <span className="grad">medical imaging</span> workflows</h1>
          <p className="p-para">ScanLytix is an AI-assisted imaging platform for students, clinicians and radiology teams who need faster scan review and clearer reporting. It starts with lung CT, covering cancer nodules and infections, and is designed to grow into {ENABLE_MRI ? "MRI and other organs" : "more organs and imaging types"}.</p>
        </Reveal>
        <Reveal className="p-showcase" delay={150}>
          <div className="p-showcase-in">
            <SliceArt r={demo} scan />
            <div className="p-bar"><span><i className="dotp" /> AI MODALITY: CT SCAN</span><b>91% Confidence</b></div>
          </div>
          <div className="p-mini">
            <div><ScanLine size={22} /><b>Lung CT</b><small>Nodules and infections</small></div>
            {ENABLE_MRI && <div><Brain size={22} /><b>MRI preview</b><small>Brain, spine, knee</small></div>}
            {!ENABLE_MRI && <div><Sparkles size={22} /><b>More organs</b><small>Planned next</small></div>}
            <div><FileText size={22} /><b>Reports</b><small>Ready in minutes</small></div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
