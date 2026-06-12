import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
import AlertModal from "../components/AlertModal";
import { getDetections } from "../services/api";
import { Plane, Calendar, MapPin, ShieldCheck, AlertTriangle } from "lucide-react";

function DetectionThumbnail({ cls }) {
  return (
    <div className={`w-full h-36 rounded-lg flex flex-col items-center justify-center gap-2 ${
      cls === "Black Sigatoka" ? "bg-amber-50" : "bg-forest-muted"
    }`}>
      {cls === "Black Sigatoka" ? (
        <>
          <AlertTriangle size={32} className="text-amber-500" />
          <span className="text-xs font-medium text-amber-700">Disease Detected</span>
        </>
      ) : (
        <>
          <ShieldCheck size={32} className="text-forest" />
          <span className="text-xs font-medium text-forest">No Disease Found</span>
        </>
      )}
      <span className="text-[10px] text-gray-400">UAV Scan Image</span>
    </div>
  );
}

export default function UAVDetections() {
  const [detections, setDetections]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("All");
  const [modalDetection, setModalDetection] = useState(null);
  const [date, setDate]               = useState("");
  const [farm, setFarm]               = useState("All Farm Areas");

  const filters = ["All", "Black Sigatoka", "Healthy"];

  useEffect(() => {
    getDetections()
      .then(setDetections)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = detections.filter((d) => {
    if (filter !== "All" && d.detected_class !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? "bg-forest text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/20" />
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <select value={farm} onChange={(e) => setFarm(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/20">
            <option>All Farm Areas</option>
          </select>
        </div>

        <div className="ml-auto">
          <span className="text-xs text-gray-400">{filtered.length} results</span>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="text-center text-gray-400 text-sm py-12">Loading detections...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 text-gray-400">
          <ShieldCheck size={32} className="mb-2 opacity-30" />
          <p className="text-sm">No detections found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((d) => (
            <div key={d.detection_id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <DetectionThumbnail cls={d.detected_class} />

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <StatusBadge status={d.detected_class} />
                  <span className="text-xs font-semibold text-gray-500">
                    {d.tier2_confidence
                      ? `${(d.tier2_confidence * 100).toFixed(0)}% confidence`
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span className="font-mono">Detection #{d.detection_id}</span>
                </div>

                {d.recommendation && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={13} className="text-gray-400 shrink-0" />
                    <span>{d.recommendation}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Plane size={13} className="shrink-0" />
                  <span>Source: UAV Drone Scan — Talakag Banana Farm</span>
                </div>
              </div>

              {d.detected_class === "Black Sigatoka" && (
                <button onClick={() => setModalDetection(d)}
                  className="mt-4 w-full bg-amber hover:bg-yellow-500 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <AlertTriangle size={15} />
                  Alert Farmers in Area
                </button>
              )}

              {d.detected_class !== "Black Sigatoka" && (
                <div className="mt-4 w-full bg-forest-muted text-forest text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                  <ShieldCheck size={15} />
                  No Action Required
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalDetection && (
        <AlertModal
          detection={modalDetection}
          onClose={() => setModalDetection(null)}
          onSend={() => { alert("Notifications sent to farmers!"); setModalDetection(null); }}
        />
      )}
    </div>
  );
}