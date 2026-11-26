import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import PublicLayout from "./components/public/PublicLayout.jsx";
import PortalLayout from "./components/portal/PortalLayout.jsx";
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Mission from "./pages/public/Mission.jsx";
import Contact from "./pages/public/Contact.jsx";
import AuthPage from "./pages/public/AuthPage.jsx";
import Dashboard from "./pages/portal/Home.jsx";
import UploadFlow from "./pages/portal/UploadFlow.jsx";
import Scans from "./pages/portal/Scans.jsx";
import Requests from "./pages/portal/Requests.jsx";
import Reports from "./pages/portal/Reports.jsx";
import ReportDetail from "./pages/portal/ReportDetail.jsx";
import Settings from "./pages/portal/Settings.jsx";

// Only signed-in users can open the portal pages.
function Protected({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route element={<Protected><PortalLayout /></Protected>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadFlow />} />
        <Route path="/scans" element={<Scans />} />
        <Route path="/scans/:id" element={<UploadFlow />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/reports/:id" element={<Protected><ReportDetail /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
