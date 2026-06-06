import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ScanLine, Map, Users,
  Bell, Settings
} from "lucide-react";

const links = [
  { to: "/",              icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/detections",    icon: <ScanLine size={18} />,        label: "UAV Detections" },
  { to: "/map",           icon: <Map size={18} />,             label: "Farm Map" },
  { to: "/farmers",       icon: <Users size={18} />,           label: "Farmers" },
  { to: "/notifications", icon: <Bell size={18} />,            label: "Notifications" },
  { to: "/settings",      icon: <Settings size={18} />,        label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-forest flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0">
            BG
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">BananaGuard AI</p>
            <p className="text-white/50 text-xs">Talakag Banana Farm</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`
            }
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center text-white font-semibold text-xs shrink-0">
            TC
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-medium truncate">Tiffanie Claire A. Cupal</p>
            <p className="text-white/50 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}