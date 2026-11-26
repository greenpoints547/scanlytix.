import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Cpu, Eye, FileText, UserRound, Stethoscope, ScanSearch, Clock, HeartPulse, Building2, CheckCircle2 } from "lucide-react";
import BodyMap from "../../components/BodyMap.jsx";
import Reveal from "../../components/Reveal.jsx";
import RotatingWords from "../../components/RotatingWords.jsx";
import { TAGLINE, ENABLE_MRI } from "../../config.js";

const WORDS = ["in minutes", "in plain words", "with confidence", "on any device"];
const WHO = {
  Patients: { Icon: UserRound, lead: "Upload your scan, get a result in everyday words, and send it to a radiologist whenever you want a second opinion.", pts: ["Three simple steps, no medical terms", "Clear results with easy colour-coded scores", "Reports you can print or share with your doctor"] },
  Doctors: { Icon: Stethoscope, lead: "A fast AI second look on chest CT scans, with a score for every finding.", pts: ["Scores for nodules, infection and inflammation", "Symptoms from the patient travel with the scan", "Request a radiologist review in one tap"] },
  Radiologists: { Icon: ScanSearch, lead: "Spend your time on the cases that need an expert eye.", pts: ["AI pre-screening highlights scans that may need attention", "Structured, ready-to-edit reports", "Every AI score is shown so you can check it"] },
};
const STEPS = [
  [Upload, "Upload", `Add your ${ENABLE_MRI ? "CT or MRI" : "CT"} scan. DICOM, NIfTI, JPEG and PNG work.`],
  [Cpu, "AI analysis", "Deep learning scores the scan and marks anything unusual."],
  [Eye, "Review", "Read the result in simple words, or ask a radiologist to check it."],
  [FileText, "Report", "Download a clear, structured report to share."],
];
const BENEFITS = [
  [Clock, "Save hours of work", "Automatic preprocessing and scoring leave more time for decisions that matter.", "wide"],
  [ScanSearch, "Detect disease earlier", "Subtle nodules and infection patterns flagged sooner, each with a score.", ""],
  [HeartPulse, "Improve outcomes", "Faster, clearer reports help patients reach the right care sooner.", ""],
  [Building2, "Reduce workload", "Streamlined reporting eases pressure on busy teams and shortens waiting lists.", "wide"],
];

export default function Home() {
  const [organ, setOrgan] = useState("lungs");
  const [who, setWho] = useState("Patients");
  const W = WHO[who];

  return (
    <main className="lp">
      <section className="hx">
        <div className="hx-in">
          <div className="hx-l">
            <Reveal as="h1" delay={100}>Upload a scan.<br />Understand it <RotatingWords words={WORDS} />.</Reveal>
            <Reveal as="p" delay={200}>{TAGLINE}. Built for patients, doctors and radiologists, so everyone gets faster, clearer answers.</Reveal>
            <Reveal className="hx-cta" delay={300}>
              <Link className="pbtn glow lg" to="/signup">Get started free <ArrowRight size={20} /></Link>
              <a className="pbtn out lg" href="#how">See how it works</a>
            </Reveal>
            <Reveal className="hx-trust" delay={400}><span><CheckCircle2 size={16} /> No jargon</span><span><CheckCircle2 size={16} /> Radiologist review</span><span><CheckCircle2 size={16} /> Works on phone and desktop</span></Reveal>
          </div>
          <Reveal className="hx-r" delay={200}>
            <BodyMap active={organ} onSelect={setOrgan} flagged />
          </Reveal>
        </div>
      </section>

      <section className="sec" id="who">
        <Reveal className="sec-h"><span className="tagp sm">MADE FOR EVERYONE</span><h2>One place, three ways to use it</h2><p>Pick who you are and see what ScanLytix does for you.</p></Reveal>
        <Reveal className="who glass" delay={100}>
          <div className="who-tabs" role="tablist">{Object.entries(WHO).map(([k, v]) => <button key={k} role="tab" aria-selected={who === k} className={who === k ? "on" : ""} onClick={() => setWho(k)}><v.Icon size={18} /> {k}</button>)}</div>
          <div className="who-body" key={who}>
            <span className="who-ic"><W.Icon size={44} /></span>
            <div><p className="who-lead">{W.lead}</p><ul>{W.pts.map((p) => <li key={p}><CheckCircle2 size={20} /> {p}</li>)}</ul><Link className="btn" to="/signup">Join as {who.replace(/s$/, "").toLowerCase() === "doctor" ? "a doctor" : who === "Patients" ? "a patient" : "a radiologist"} <ArrowRight size={16} /></Link></div>
          </div>
        </Reveal>
      </section>

      <section className="sec how" id="how">
        <Reveal className="sec-h"><span className="tagp sm">HOW IT WORKS</span><h2>From scan to report in four steps</h2><p>Fast, accurate and easy to follow.</p></Reveal>
        <Reveal className="tl">
          <i className="tl-line" />
          {STEPS.map(([Icon, t, d], i) => (
            <div className="tl-n glass lift" key={t} style={{ "--i": i }}><span className="tl-num">{i + 1}</span><span className="tl-ic"><Icon size={30} /></span><h3>{t}</h3><p>{d}</p></div>
          ))}
        </Reveal>
      </section>

      <section className="sec" id="mission">
        <Reveal className="mission glass">
          <div className="ms-orb" aria-hidden="true"><i /><i /><i /></div>
          <span className="tagp sm">OUR MISSION</span>
          <p className="ms-big">To put clear, AI-assisted answers in the hands of <b>patients</b> and <b>radiologists</b>, so every scan is understood sooner across the soft tissue organs where early detection matters most.</p>
          <Link className="btn" to="/mission">Read our mission <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      <section className="sec">
        <Reveal className="sec-h"><span className="tagp sm">WHY IT MATTERS</span><h2>Healthcare, reimagined</h2><p>Imagine a world where waiting for a critical report is no longer the norm.</p></Reveal>
        <div className="bento">
          {BENEFITS.map(([Icon, t, d, cls], i) => (
            <Reveal className={"bn glass lift " + cls} key={t} delay={(i % 2) * 120}><span className="bn-ic"><Icon size={28} /></span><h3>{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="cta2">
        <Reveal className="cta2-in">
          <div className="cta2-orb" aria-hidden="true" />
          <h2>See <span>beyond</span> every scan.</h2>
          <p>Join patients and clinicians building faster, clearer and more accessible diagnosis.</p>
          <Link className="pbtn white lg" to="/signup">Join ScanLytix <ArrowRight size={20} /></Link>
        </Reveal>
      </section>
    </main>
  );
}
