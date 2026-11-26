import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import Reveal from "../../components/Reveal.jsx";

const TOPICS = ["Patient report question", "Radiologist access", "Technical support", "Partnership", "Other"];

export default function Contact() {
  const { toast } = useApp();
  const [f, setF] = useState({ name: "", email: "", topic: TOPICS[0], msg: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !/\S+@\S+\.\S+/.test(f.email) || !f.msg.trim()) return toast("Please fill in all fields with a valid email");
    toast("Message ready to send. Connect a backend to deliver it.");
    setF({ name: "", email: "", topic: TOPICS[0], msg: "" });
  };

  return (
    <main className="p-page" style={{ paddingTop: 40 }}>
      <div className="p-wrap p-contact">
        <Reveal className="c-dark">
          <small>CONTACT DETAILS</small>
          <h2>The right message should reach the right reviewer.</h2>
          <p>For urgent symptoms or emergencies, contact local emergency services immediately. ScanLytix is not a replacement for direct medical care.</p>
          {[[Mail, "EMAIL", "contact@scanlytix.example"], [Phone, "PHONE", "+92 300 0000000"], [MapPin, "LOCATION", "Lahore, Pakistan"]].map(([Icon, k, v]) => (
            <div className="c-tile" key={k}><span><Icon size={24} /></span><div><small>{k}</small><b>{v}</b></div></div>
          ))}
        </Reveal>
        <Reveal as="form" className="c-form" delay={150} onSubmit={submit} noValidate>
          <small className="acc">SEND A MESSAGE</small>
          <h2>Tell us what you need.</h2>
          <div className="c-row">
            <div><label htmlFor="cname">Full name</label><input id="cname" className="pin" placeholder="Enter your name" value={f.name} onChange={set("name")} /></div>
            <div><label htmlFor="cmail">Email</label><input id="cmail" className="pin" type="email" placeholder="you@example.com" value={f.email} onChange={set("email")} /></div>
          </div>
          <label htmlFor="ctopic">Topic</label>
          <select id="ctopic" className="pin" value={f.topic} onChange={set("topic")}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
          <label htmlFor="cmsg">Message</label>
          <textarea id="cmsg" className="pin" rows="5" placeholder="Write your message here..." value={f.msg} onChange={set("msg")} />
          <button className="pbtn block" type="submit">Submit message <Send size={18} /></button>
        </Reveal>
      </div>
    </main>
  );
}
