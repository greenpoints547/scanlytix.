// Illustrative slice drawing used until real scan data is connected.
export default function SliceArt({ r, scan = false }) {
  const hot = r.status === "Flagged";
  const s = (r.id * 47) % 60;
  const x = 180 + s * 1.5;
  const y = 140 + ((r.id * 31) % 80);
  return (
    <svg viewBox="0 0 400 330" role="img" aria-label={"Illustrative " + r.mod + " slice"}>
      <rect width="400" height="330" fill="#0F1C20" />
      {r.mod === "CT" ? (
        <g>
          <ellipse cx="200" cy="165" rx="170" ry="140" fill="#1E3238" stroke="#34505A" />
          <ellipse cx="135" cy="165" rx="62" ry="98" fill="#0F1C20" stroke="#63C9D6" strokeOpacity=".35" />
          <ellipse cx="265" cy="165" rx="62" ry="98" fill="#0F1C20" stroke="#63C9D6" strokeOpacity=".35" />
          <rect x="190" y="110" width="20" height="90" rx="8" fill="#34505A" />
        </g>
      ) : (
        <g>
          <ellipse cx="200" cy="170" rx="130" ry="150" fill="#2A444C" stroke="#63C9D6" strokeOpacity=".4" />
          <ellipse cx="200" cy="170" rx="104" ry="126" fill="#20343A" stroke="#34505A" />
          <path d="M200 60v220M130 120c30 20 110 20 140 0M125 210c35-20 115-20 150 0" stroke="#34505A" fill="none" strokeWidth="3" />
          <ellipse cx="200" cy="165" rx="20" ry="34" fill="#0F1C20" />
        </g>
      )}
      {hot && (
        <g>
          <circle cx={x} cy={y} r="20" fill="none" stroke="#63C9D6" strokeWidth="3" strokeDasharray="6 4" />
          <circle className="pulse" cx={x} cy={y} r="20" fill="none" stroke="#63C9D6" strokeWidth="2" />
          <circle cx={x} cy={y} r="6" fill="#63C9D6" />
          <text x={x > 220 ? x - 26 : x + 26} y={y - 24} textAnchor={x > 220 ? "end" : "start"} fill="#63C9D6" fontSize="13">
            {r.findings[0].name.slice(0, 24)} {r.findings[0].conf}%
          </text>
        </g>
      )}
      {scan && (
        <g>
          <rect className="sweep" x="0" y="-40" width="400" height="40" fill="url(#sg)" />
          <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#63C9D6" stopOpacity="0" /><stop offset="1" stopColor="#63C9D6" stopOpacity=".55" /></linearGradient></defs>
        </g>
      )}
      <text x="14" y="24" fill="#9DBAC2" fontSize="12">{r.mod} · {r.region} · illustrative, not real scan data</text>
    </svg>
  );
}
