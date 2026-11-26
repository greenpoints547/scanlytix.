import { Sparkles, HeartPulse, UserCheck, Globe, Lock } from "lucide-react";
import Reveal from "../../components/Reveal.jsx";

const CARDS = [
  [HeartPulse, "Explainable AI interface", "Translating raw model outputs into highlighted regions, confidence scores and plain clinical language."],
  [UserCheck, "Clinician in the loop", "Every result is decision support. A qualified professional reviews before any clinical action."],
  [Globe, "Access for every region", "Bringing quality diagnostic support to places with few radiologists and long waiting times."],
  [Lock, "Privacy by design", "Patient data is handled with care, with secure transfer and storage as core requirements."],
];

export default function Mission() {
  return (
    <main className="p-page">
            <div className="p-wrap p-two" style={{ position: "relative", alignItems: "center" }}>
        <Reveal>
          <span className="tagp sm"><Sparkles size={18} /> OUR MISSION</span>
          <h1 className="p-h1">Make imaging support <span className="grad">faster, safer,</span> and clearer</h1>
          <p className="p-para">Our mission is to bridge AI capability with clinical responsibility, helping radiologists work faster while giving patients clearer answers and quicker care.</p>
        </Reveal>
        <div className="p-stack">
          {CARDS.map(([Icon, t, d], i) => (
            <Reveal className="p-soft row" key={t} delay={i * 110}><span className="wf-ic soft"><Icon size={30} /></span><div><h3>{t}</h3><p>{d}</p></div></Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
