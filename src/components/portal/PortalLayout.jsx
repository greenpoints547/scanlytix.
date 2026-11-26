import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopNav, { BottomTabs } from "./TopNav.jsx";
import GuideFab from "./GuideFab.jsx";
import Toast from "../Toast.jsx";
import { Aurora } from "../ui.jsx";

export default function PortalLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="app">
      <Aurora />
      <TopNav />
      <main className="app-main"><div key={pathname} className="pg"><Outlet /></div></main>
      <BottomTabs />
      <GuideFab />
      <Toast />
    </div>
  );
}
