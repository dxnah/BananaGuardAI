import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UAVDetections from "./pages/UAVDetections";
import FarmMap from "./pages/FarmMap";
import Farmers from "./pages/Farmers";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const pageTitles = {
  "/":              "Dashboard",
  "/detections":    "UAV Detections",
  "/map":           "Farm Map",
  "/farmers":       "Farmers",
  "/notifications": "Notifications",
  "/settings":      "Settings",
};

function Layout({ onLogout }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "BananaGuard AI";

  return (
    <div className="flex min-h-screen bg-offwhite">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <Navbar title={title} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/detections"    element={<UAVDetections />} />
            <Route path="/map"           element={<FarmMap />} />
            <Route path="/farmers"       element={<Farmers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings"      element={<Settings onLogout={onLogout} />} />
            <Route path="*"              element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Layout onLogout={() => setIsLoggedIn(false)} />
      )}
    </BrowserRouter>
  );
}