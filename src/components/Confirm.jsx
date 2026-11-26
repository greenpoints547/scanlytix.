import { useState } from "react";

// Two-step button: first click asks to confirm, second click runs the action.
export default function Confirm({ label, onYes, className = "btn out sm" }) {
  const [asking, setAsking] = useState(false);
  if (asking)
    return (
      <span className="acts">
        <button className="btn sm" onClick={() => { setAsking(false); onYes(); }}>Confirm</button>
        <button className="btn out sm" onClick={() => setAsking(false)}>Cancel</button>
      </span>
    );
  return <button className={className} onClick={() => setAsking(true)}>{label}</button>;
}
