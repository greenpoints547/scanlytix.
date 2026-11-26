import { createContext, useContext, useEffect, useState } from "react";
import { seedScans, today } from "../lib/analysis.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const read = (k, fallback) => {
  try { const j = localStorage.getItem(k); if (j) return JSON.parse(j); } catch (e) {}
  return fallback;
};
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

export function AppProvider({ children }) {
  const [scans, setScans] = useState(() => read("scanlytix-scans", seedScans));
  const [user, setUser] = useState(() => read("scanlytix-user", null));
  const [theme, setTheme] = useState(() => localStorage.getItem("scanlytix-theme") || "light");
  const [msg, setMsg] = useState("");

  useEffect(() => write("scanlytix-scans", scans), [scans]);
  useEffect(() => { if (user) write("scanlytix-user", user); }, [user]);

  // "system" is resolved to light or dark.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    };
    apply();
    try { localStorage.setItem("scanlytix-theme", theme); } catch (e) {}
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(""), 2400);
    return () => clearTimeout(t);
  }, [msg]);

  // Demo authentication. Replace with a real call to your backend later.
  const login = (u) => {
    const profile = { age: "", sex: "", location: "", contact: "", created: today(), ...u };
    setUser(profile);
    write("scanlytix-user", profile);
  };
  const logout = () => { setUser(null); try { localStorage.removeItem("scanlytix-user"); } catch (e) {} };
  const addScan = (s) => setScans((x) => [...x, s]);
  const updateScan = (id, patch) => setScans((x) => x.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeScan = (id) => setScans((x) => x.filter((s) => s.id !== id));
  const resetDemo = () => setScans(seedScans);

  return (
    <Ctx.Provider value={{ scans, addScan, updateScan, removeScan, resetDemo, user, setUser, login, logout, theme, setTheme, msg, toast: setMsg }}>
      {children}
    </Ctx.Provider>
  );
}
