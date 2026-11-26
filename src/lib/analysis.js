// Scan data model, simulated analysis, and report text.
// To connect your real Flask model, replace analyzeScan() below.

export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const today = () => new Date().toISOString().slice(0, 10);
export const pad = (n, l = 5) => String(n % 100000).padStart(l, "0");

export const CATS = [["nodule", "Lung nodule"], ["infection", "Infection"], ["inflammation", "Inflammation"]];
export const STEPS = ["Preprocessing image", "Segmenting lung region", "Classifying findings", "Building report"];

// stage -> what the activity table shows
export const STAGE = {
  uploaded: { activity: "Scan Uploaded", status: "In Progress", tone: "blue" },
  analyzed: { activity: "AI Analysis Complete", status: "Analyzed", tone: "teal" },
  requested: { activity: "Request Sent", status: "Pending", tone: "amber" },
  reported: { activity: "Report Received", status: "Completed", tone: "green" },
};
export const scanLabel = (s) => `CT Scan - ${s.region}`;

function build(scores) {
  const entries = CATS.map(([k, n]) => ({ key: k, name: n, conf: scores[k] }));
  const top = entries.reduce((a, b) => (b.conf > a.conf ? b : a));
  const flagged = top.conf >= 50;
  return { scores, flagged, top, confidence: flagged ? top.conf : rnd(86, 97) };
}

// Simulated model output. Replace with your real model response.
export function makeResult() {
  if (Math.random() < 0.6) {
    const keys = ["nodule", "infection", "inflammation"];
    const main = keys[rnd(0, 2)];
    const s = {};
    keys.forEach((k) => (s[k] = k === main ? rnd(70, 92) : rnd(8, 62)));
    return build(s);
  }
  return build({ nodule: rnd(0, 6), infection: rnd(0, 5), inflammation: rnd(0, 8) });
}

/**
 * Analyse a scan. Currently simulated.
 * To use your Flask backend, replace the body with something like:
 *
 *   const body = new FormData();
 *   body.append("file", file);
 *   const res = await fetch("http://localhost:5000/api/analyze", { method: "POST", body });
 *   const j = await res.json(); // { nodule: 18, infection: 82, inflammation: 71 }
 *   return build(j);
 */
export async function analyzeScan() {
  await new Promise((r) => setTimeout(r, 3300));
  return makeResult();
}

export function reasoning(r) {
  if (!r.flagged)
    return {
      assessment: [
        "The scan shows no immediate signs of abnormalities that would require a specialist’s review.",
        "Low scores across all categories suggest no significant findings in this analysis.",
      ],
      advice: ["Get adequate rest and stay hydrated.", "Contact your doctor if symptoms persist or get worse."],
    };
  const k = r.top.key;
  const text =
    k === "nodule"
      ? "A possible nodule or lesion was detected in the right upper lung region. A detailed radiologist review is recommended to characterise it and rule out other pulmonary conditions."
      : "Abnormal opacity and slight inflammation detected in the right lower lung lobe. Findings may indicate early infection or localized fluid buildup. A detailed radiologist review is recommended to rule out pneumonia or other pulmonary conditions.";
  return { assessment: [text], advice: [] };
}

const sc = (nodule, infection, inflammation) => build({ nodule, infection, inflammation });
export const seedScans = [
  { id: 101, file: "scan_file_chest.dcm", date: "2026-11-15", region: "Chest", stage: "requested", symptoms: ["Occasional shortness of breath", "Persistent cough for the past 3 weeks", "Mild chest pain during deep breathing"], result: sc(18, 82, 71) },
  { id: 102, file: "scan_file_lungs.dcm", date: "2026-11-15", region: "Lungs", stage: "requested", symptoms: [], result: sc(64, 22, 12) },
  { id: 103, file: "scan_file_chest_2.dcm", date: "2026-11-10", region: "Chest", stage: "reported", symptoms: ["Persistent cough"], result: sc(74, 12, 9) },
  { id: 104, file: "scan_file_chest_3.dcm", date: "2026-11-16", region: "Chest", stage: "uploaded", symptoms: [] },
  { id: 105, file: "scan_file_chest_4.dcm", date: "2026-11-17", region: "Chest", stage: "uploaded", symptoms: [] },
];
