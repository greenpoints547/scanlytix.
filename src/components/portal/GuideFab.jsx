import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, X, UploadCloud, Sparkles, FileText } from "lucide-react";

// A small helper for first-time users: three simple steps and a link to support.
export default function GuideFab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="gf">
      {open && (
        <div className="gf-pop glass" role="dialog" aria-label="Quick guide">
          <button className="gf-x" aria-label="Close guide" onClick={() => setOpen(false)}><X size={18} /></button>
          <h3>New here? It takes 3 steps</h3>
          <ol>
            <li><span><UploadCloud size={18} /></span><div><b>Upload</b><small>Add your CT scan file.</small></div></li>
            <li><span><Sparkles size={18} /></span><div><b>Analyze</b><small>The AI checks it in a few minutes.</small></div></li>
            <li><span><FileText size={18} /></span><div><b>Get your report</b><small>Send it to a radiologist if you want.</small></div></li>
          </ol>
          <Link className="btn sm" to="/upload" onClick={() => setOpen(false)}>Start now</Link>{" "}
          <Link className="gf-help" to="/contact">Need help?</Link>
        </div>
      )}
      <button className="gf-btn" aria-expanded={open} aria-label="Open quick guide" onClick={() => setOpen(!open)}><HelpCircle size={24} /></button>
    </div>
  );
}
