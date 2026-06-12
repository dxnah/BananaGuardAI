import { useState, useEffect } from "react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import AlertModal from "../components/AlertModal";
import { getDashboardSummary, getFarmers, getDetections } from "../services/api";
import {
  ScanLine, MapPin, AlertTriangle, Bell,
  Plane, Megaphone, FileDown, Leaf
} from "lucide-react";

export default function Dashboard() {
  const [modalDetection, setModalDetection] = useState(null);
  const [summary, setSummary]   = useState(null);
  const [farmers, setFarmers]   = useState([]);
  const [detections, setDetections] = useState([]);

  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch(console.error);
    getFarmers().then(setFarmers).catch(console.error);
    getDetections().then(setDetections).catch(console.error);
  }, []);

  const latest = detections[0] || null;

  const statusLabel = {
    notified: "Notified",
    resolved: "Resolved",
    no_alert: "No Alert",
    active:   "Notified",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-forest text-white rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Welcome back, Admin!</h2>
          <p className="text-white/60 text-sm mt-1">{today}</p>
        </div>
        <span className="bg-amber text-white text-sm font-medium px-4 py-1.5 rounded-full">
          {summary?.active_detections ?? 0} Active Alerts
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="UAV Scans Today"
          value={summary?.scans_today ?? "—"}
          icon={<ScanLine size={18} />}
          sub="Scans recorded today"
        />
        <MetricCard
          label="Total Farmers"
          value={summary?.total_farmers ?? "—"}
          icon={<MapPin size={18} />}
          sub="Registered farmers"
        />
        <MetricCard
          label="Black Sigatoka"
          value={summary?.active_detections ?? "—"}
          icon={<AlertTriangle size={18} />}
          sub="Active detections"
        />
        <MetricCard
          label="Pending Alerts"
          value={summary?.farmers_notified ?? "—"}
          icon={<Bell size={18} />}
          sub="Unacknowledged alerts"
        />
      </div>

      {/* Detection Feed + Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Latest Detection */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-base mb-4 text-charcoal">Latest UAV Detection</h3>
          {latest ? (
            <div className="flex gap-4">
              <div className={`w-28 h-20 rounded-lg flex flex-col items-center justify-center gap-1 shrink-0 ${
                latest.detected_class === "Black Sigatoka" ? "bg-amber-50" : "bg-forest-muted"
              }`}>
                {latest.detected_class === "Black Sigatoka" ? (
                  <>
                    <AlertTriangle size={24} className="text-amber-500" />
                    <span className="text-[10px] text-amber-600 font-medium">Disease</span>
                  </>
                ) : (
                  <>
                    <Leaf size={24} className="text-forest opacity-60" />
                    <span className="text-[10px] text-forest font-medium">Healthy</span>
                  </>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={latest.detected_class} />
                  <span className="text-xs text-gray-400">
                    {latest.tier2_confidence
                      ? `${(latest.tier2_confidence * 100).toFixed(0)}% confidence`
                      : "—"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-charcoal">Detection ID:</span> #{latest.detection_id}
                </p>
                {latest.recommendation && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-charcoal">Note:</span> {latest.recommendation}
                  </p>
                )}
                {latest.detected_class === "Black Sigatoka" && (
                  <button
                    onClick={() => setModalDetection(latest)}
                    className="mt-1 bg-amber hover:bg-yellow-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Bell size={12} />
                    Send Alert
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No detections yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-base mb-4 text-charcoal">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: <Plane size={16} />,     label: "Run New UAV Scan" },
              { icon: <Megaphone size={16} />, label: "Send Manual Notification" },
              { icon: <FileDown size={16} />,  label: "Export Report" },
            ].map((a) => (
              <button
                key={a.label}
                className="w-full text-left text-sm px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-forest-muted hover:border-forest/30 transition-all font-medium text-charcoal flex items-center gap-3"
              >
                <span className="text-forest">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Farmer Status Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-base text-charcoal">Farmer Status</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
            <tr>
              {["Farmer Name", "Farm Name", "Location", "Registered"].map((h) => (
                <th key={h} className="text-left px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {farmers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400 text-xs">
                  No farmers registered yet.
                </td>
              </tr>
            ) : (
              farmers.map((f) => (
                <tr key={f.user_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-charcoal">{f.username}</td>
                  <td className="px-5 py-3 text-gray-500">{f.farm_name || "—"}</td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{f.location || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalDetection && (
        <AlertModal
          detection={modalDetection}
          onClose={() => setModalDetection(null)}
          onSend={() => alert("Notifications sent!")}
        />
      )}
    </div>
  );
}