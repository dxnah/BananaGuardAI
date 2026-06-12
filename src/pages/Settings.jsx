import { useState } from "react";
import {
  User, Bell, Radio, Users, FileText, Shield,
  Save, Clock, AlertTriangle, CheckCircle, XCircle, LogOut
} from "lucide-react";
import { updateProfile, changePassword } from "../services/api";

const menu = [
  { id: "profile",       icon: <User size={16} />,      label: "Profile" },
  { id: "notifications", icon: <Bell size={16} />,      label: "Notification Settings" },
  { id: "uav",           icon: <Radio size={16} />,     label: "UAV Integration" },
  { id: "farmers",       icon: <Users size={16} />,     label: "Farmer Management" },
  { id: "logs",          icon: <FileText size={16} />,  label: "System Logs" },
  { id: "security",      icon: <Shield size={16} />,    label: "Account & Security" },
];

const systemLogs = [
  { id: 1, type: "success", icon: <CheckCircle size={14} />, message: "UAV scan completed successfully — 4 zones covered", time: "Jun 3, 2026 07:42 AM" },
  { id: 2, type: "warning", icon: <AlertTriangle size={14} />, message: "Black Sigatoka detected at 8.4542° N, 124.6319° E", time: "Jun 3, 2026 07:43 AM" },
  { id: 3, type: "success", icon: <CheckCircle size={14} />, message: "Notification sent to Dinah V. Caburatan", time: "Jun 3, 2026 07:45 AM" },
  { id: 4, type: "success", icon: <CheckCircle size={14} />, message: "UAV scan completed — Zone 2 healthy", time: "Jun 3, 2026 08:15 AM" },
  { id: 5, type: "error",   icon: <XCircle size={14} />,     message: "Failed to connect UAV feed — retrying...", time: "Jun 2, 2026 06:10 AM" },
  { id: 6, type: "success", icon: <CheckCircle size={14} />, message: "UAV feed reconnected successfully", time: "Jun 2, 2026 06:12 AM" },
  { id: 7, type: "warning", icon: <AlertTriangle size={14} />, message: "Black Sigatoka detected at 8.4478° N, 124.6355° E", time: "Jun 2, 2026 06:30 AM" },
  { id: 8, type: "success", icon: <CheckCircle size={14} />, message: "Notification sent to Florie Jayne A. Soler", time: "Jun 2, 2026 06:32 AM" },
];

function Toggle({ label, description, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-gray-100 last:border-0 gap-4">
      <div>
        <p className="text-sm text-charcoal font-medium">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 mt-0.5 ${on ? "bg-forest" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SliderField({ label, description, min, max, defaultValue, unit }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="py-3.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-charcoal font-medium">{label}</p>
        <span className="text-sm font-semibold text-forest">{val}{unit}</span>
      </div>
      {description && <p className="text-xs text-gray-400 mb-2">{description}</p>}
      <input type="range" min={min} max={max} value={val}
        onChange={(e) => setVal(e.target.value)} className="w-full accent-forest" />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function StatusMsg({ msg }) {
  if (!msg) return null;
  const isError = msg.startsWith("✗");
  return (
    <p className={`text-xs mt-1 font-medium ${isError ? "text-red-500" : "text-green-600"}`}>
      {msg}
    </p>
  );
}

export default function Settings({ admin, onLogout, onAdminUpdate }) {
  const [active, setActive] = useState("profile");

  // Profile form state
  const [fullName, setFullName]   = useState(admin?.full_name  || "");
  const [username, setUsername]   = useState(admin?.username   || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const displayName = admin?.full_name || admin?.username || "—";
  const initials    = getInitials(displayName);
  const lastLogin   = admin?.last_login
    ? new Date(admin.last_login).toLocaleString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "Never";
  const createdAt = admin?.created_at
    ? new Date(admin.created_at).toLocaleDateString("en-PH", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  async function handleSaveProfile() {
    setProfileLoading(true);
    setProfileMsg("");
    try {
      const updated = await updateProfile({
        full_name: fullName || null,
        username:  username || undefined,
      });
      onAdminUpdate(updated);
      setProfileMsg("✓ Profile saved successfully");
    } catch (err) {
      setProfileMsg("✗ " + (err.response?.data?.detail || "Failed to save"));
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleChangePassword() {
    setPasswordLoading(true);
    setPasswordMsg("");
    try {
      await changePassword({
        current_password: currentPw,
        new_password:     newPw,
        confirm_password: confirmPw,
      });
      setPasswordMsg("✓ Password updated successfully");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      setPasswordMsg("✗ " + (err.response?.data?.detail || "Failed to update password"));
    } finally {
      setPasswordLoading(false);
    }
  }

  const logColors = {
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    error:   "text-red-500 bg-red-50",
  };

  return (
    <div className="flex gap-5">
      {/* Menu */}
      <div className="w-56 shrink-0 bg-white border border-gray-200 rounded-xl p-2 h-fit">
        {menu.map((m) => (
          <button key={m.id} onClick={() => setActive(m.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active === m.id ? "bg-forest text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m.icon}{m.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">

        {/* ── Profile ── */}
        {active === "profile" && (
          <div className="space-y-5 max-w-md">
            <h3 className="font-semibold text-base text-charcoal">Profile</h3>

            {/* Avatar + meta */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-forest flex items-center justify-center text-white font-bold text-xl">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">{displayName}</p>
                <p className="text-xs text-gray-400 mt-0.5">Admin · Joined {createdAt}</p>
                <p className="text-xs text-gray-400">Last login: {lastLogin}</p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Tiffanie Claire A. Cupal"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>

            {/* Role (read-only) */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Role</label>
              <input value="Admin" readOnly
                className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>

            <StatusMsg msg={profileMsg} />

            <button
              onClick={handleSaveProfile}
              disabled={profileLoading}
              className="flex items-center gap-2 bg-forest hover:bg-forest-light disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              <Save size={15} />
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* ── Notifications ── */}
        {active === "notifications" && (
          <div className="max-w-md space-y-1">
            <h3 className="font-semibold text-base text-charcoal mb-4">Notification Settings</h3>
            <Toggle label="Auto-notify farmers on Black Sigatoka detection" description="Sends push notification immediately after UAV detects disease" defaultChecked={true} />
            <Toggle label="Send SMS alongside app push" description="Requires valid mobile numbers on farmer profiles" />
            <Toggle label="Daily scan summary report" description="Sends a summary of all UAV scans at end of day" defaultChecked={true} />
            <SliderField label="Alert threshold confidence %" description="Only trigger alerts when detection confidence meets this threshold" min={50} max={100} defaultValue={80} unit="%" />
            <SliderField label="Notification cooldown" description="Minimum hours between repeat alerts for the same zone" min={1} max={24} defaultValue={6} unit="h" />
          </div>
        )}

        {/* ── UAV ── */}
        {active === "uav" && (
          <div className="max-w-md space-y-4">
            <h3 className="font-semibold text-base text-charcoal mb-4">UAV Integration</h3>
            {[
              { label: "UAV Device Name", value: "DJI Phantom 4 Pro" },
              { label: "API Key",         value: "••••••••••••••••" },
              { label: "Scan Frequency (min)", value: "30" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input defaultValue={f.value} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
              </div>
            ))}
            <div className="flex items-center gap-3 bg-forest-muted border border-forest/20 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="text-forest shrink-0" />
              <p className="text-xs text-forest font-medium">UAV feed connected — last ping 2 min ago</p>
            </div>
            <button className="flex items-center gap-2 bg-forest hover:bg-forest-light text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              <Save size={15} />Save Integration
            </button>
          </div>
        )}

        {/* ── Farmer Management ── */}
        {active === "farmers" && (
          <div className="max-w-md space-y-4">
            <h3 className="font-semibold text-base text-charcoal mb-4">Farmer Management</h3>
            <div className="space-y-1">
              <Toggle label="Allow farmers to mark alerts as resolved" description="Farmers can update their zone status via mobile app" defaultChecked={true} />
              <Toggle label="Require farmer confirmation on notifications" description="Track whether farmers have read their alerts" defaultChecked={true} />
              <Toggle label="Auto-deactivate inactive farmer accounts" description="Deactivate accounts with no activity for 30 days" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Default Farm Zone Area (ha)</label>
              <input type="number" defaultValue="2.5" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
            </div>
            <button className="flex items-center gap-2 bg-forest hover:bg-forest-light text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              <Save size={15} />Save Preferences
            </button>
          </div>
        )}

        {/* ── System Logs ── */}
        {active === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-charcoal">System Logs</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={13} /><span>Last updated: Jun 3, 2026 08:15 AM</span>
              </div>
            </div>
            <div className="space-y-2">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className={`p-1.5 rounded-lg shrink-0 ${logColors[log.type]}`}>{log.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal">{log.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Account & Security ── */}
        {active === "security" && (
          <div className="max-w-md space-y-4">
            <h3 className="font-semibold text-base text-charcoal mb-4">Account & Security</h3>

            {/* Change Password */}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Current Password</label>
              <input type="password" value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">New Password</label>
              <input type="password" value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Confirm New Password</label>
              <input type="password" value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
            </div>

            <StatusMsg msg={passwordMsg} />

            <button
              onClick={handleChangePassword}
              disabled={passwordLoading}
              className="flex items-center gap-2 bg-forest hover:bg-forest-light disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              <Save size={15} />
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>

            <div className="pt-2 border-t border-gray-100 space-y-1">
              <Toggle label="Two-Factor Authentication" description="Adds an extra layer of security to your account" />
              <div className="py-3.5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-charcoal font-medium">Session Timeout</p>
                    <p className="text-xs text-gray-400 mt-0.5">Auto logout after inactivity</p>
                  </div>
                  <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-400 mb-1">
                  Signed in as <span className="font-medium text-charcoal">{admin?.username}</span>
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Last login: <span className="font-medium text-charcoal">{lastLogin}</span>
                </p>
                <button onClick={onLogout}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-red-200"
                >
                  <LogOut size={15} />Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}