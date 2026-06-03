import { useState } from "react";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import AlertModal from "../components/AlertModal";
import { farmers, detections } from "../data/mockData";
import {
  ScanLine, MapPin, AlertTriangle, Bell,
  Plane, Megaphone, FileDown, Leaf
} from "lucide-react";

export default function Dashboard() {
  const [modalDetection, setModalDetection] = useState(null);
  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const latest = detections[0];

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
          <h2 className="text-xl font-semibold">Welcome back, Tiffanie! 👋</h2>
          <p className="text-white/60 text-sm mt-1">{today}</p>
        </div>
        <span className="bg-amber text-white text-sm font-medium px-4 py-1.5 rounded-full">
          2 Active Alerts
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="UAV Scans Today"
          value="12"
          icon={<ScanLine size={18} />}
          sub="+3 from yesterday"
        />
        <MetricCard
          label="Area Monitored"
          value="10.0"
          icon={<MapPin size={18} />}
          sub="Across 4 farms"
        />
        <MetricCard
          label="Black Sigatoka"
          value="2"
          icon={<AlertTriangle size={18} />}
          sub="Active detections"
        />
        <MetricCard
          label="Farmers Notified"
          value="2"
          icon={<Bell size={18} />}
          sub="This week"
        />
      </div>

      {/* Detection Feed + Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Latest Detection */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-base mb-4 text-charcoal">Latest UAV Detection</h3>
          <div className="flex gap-4">
            {/* Thumbnail placeholder */}
            <div className="w-28 h-20 bg-forest-muted rounded-lg flex items-center justify-center shrink-0">
              <Leaf size={32} className="text-forest opacity-50" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={latest.class} />
                <span className="text-xs text-gray-400">{latest.confidence}% confidence</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-charcoal">GPS:</span> {latest.gps}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-charcoal">Time:</span> {latest.datetime}
              </p>
              <button
                onClick={() => setModalDetection(latest)}
                className="mt-1 bg-amber hover:bg-yellow-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-base mb-4 text-charcoal">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: <Plane size={16} />,      label: "Run New UAV Scan" },
              { icon: <Megaphone size={16} />,  label: "Send Manual Notification" },
              { icon: <FileDown size={16} />,   label: "Export Report" },
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
              {["Farmer Name", "Farm Coordinates", "Last Notified", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {farmers.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-charcoal">{f.name}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{f.coordinates}</td>
                <td className="px-5 py-3 text-gray-500">{f.lastAlert}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={statusLabel[f.status]} />
                </td>
              </tr>
            ))}
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