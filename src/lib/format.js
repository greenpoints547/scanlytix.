export const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
export const two = (n) => String(n).padStart(2, "0");
export const firstName = (n) => (n || "").split(" ")[0] || "there";
