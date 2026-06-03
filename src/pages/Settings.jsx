import { useState } from "react";
import { User, Bell, Radio, Users, FileText, Shield } from "lucide-react";

const menu = [
  { id: "profile",       icon: <User size={16} />,      label: "Profile" },
  { id: "notifications", icon: <Bell size={16} />,      label: "Notification Preferences" },
  { id: "uav",           icon: <Radio size={16} />,     label: "UAV Integration" },
  { id: "farmers",       icon: <Users size={16} />,     label: "Farmer Management" },
  { id: "logs",          icon: <FileText size={16} />,  label: "System Logs" },
  { id: "security",      icon: <Shield size={16} />,    label: "Account & Security" },
];

function Toggle({ label, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-charcoal">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors relative ${on ? "bg-forest" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState("profile");

  return (
    <div className="flex gap-5">
      {/* Settings Menu */}
      <div className="w-52 shrink-0 bg-white border border-gray-200 rounded-xl p-2 h-fit">
        {menu.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active === m.id ? "bg-forest text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
        {active === "profile" && (
          <div className="space-y-5 max-w-md">
            <h3 className="font-semibold text-base text-charcoal">Profile</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center text-white font-bold text-xl">TC</div>
              <button className="text-sm text-forest font-medium hover:underline">Upload Avatar</button>
            </div>
            {[
              { label: "Full Name", value: "Tiffanie Claire A. Cupal" },
              { label: "Email",     value: "tiffa.cupal@bananaguard.ai" },
              { label: "Role",      value: "Admin" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input defaultValue={f.value} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
              </div>
            ))}
            <button className="bg-forest hover:bg-forest-light text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        )}

        {active === "notifications" && (
          <div className="max-w-md space-y-2">
            <h3 className="font-semibold text-base text-charcoal mb-4">Notification Preferences</h3>
            <Toggle label="Auto-notify farmers on Black Sigatoka detection" defaultChecked={true} />
            <Toggle label="Send SMS alongside app push" />
            <div className="py-3 border-b border-gray-100">
              <p className="text-sm text-charcoal mb-2">Alert threshold confidence %</p>
              <input type="range" min={50} max={100} defaultValue={80} className="w-full" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>50%</span><span>100%</span></div>
            </div>
            <div className="py-3">
              <p className="text-sm text-charcoal mb-2">Notification cooldown (hours)</p>
              <input type="range" min={1} max={24} defaultValue={6} className="w-full" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1h</span><span>24h</span></div>
            </div>
          </div>
        )}

        {active === "uav" && (
          <div className="max-w-md space-y-4">
            <h3 className="font-semibold text-base text-charcoal mb-4">UAV Integration</h3>
            {[
              { label: "UAV Source / Device Name", placeholder: "e.g. DJI Phantom 4" },
              { label: "API Key", placeholder: "Enter API key..." },
              { label: "Scan Frequency (minutes)", placeholder: "e.g. 30" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Coordinate Format</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20">
                <option>Decimal Degrees (DD)</option>
                <option>Degrees Minutes Seconds (DMS)</option>
              </select>
            </div>
            <button className="bg-forest hover:bg-forest-light text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              Save Integration
            </button>
          </div>
        )}

        {active === "security" && (
          <div className="max-w-md space-y-4">
            <h3 className="font-semibold text-base text-charcoal mb-4">Account & Security</h3>
            {[
              { label: "Current Password", type: "password" },
              { label: "New Password",     type: "password" },
              { label: "Confirm Password", type: "password" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input type={f.type} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
              </div>
            ))}
            <button className="bg-forest hover:bg-forest-light text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              Update Password
            </button>
            <div className="pt-2">
              <Toggle label="Two-Factor Authentication" />
            </div>
          </div>
        )}

        {["farmers", "logs"].includes(active) && (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Coming soon...
          </div>
        )}
      </div>
    </div>
  );
}