import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import AlertModal from "../components/AlertModal";
import { detections } from "../data/mockData";
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
  const [filter, setFilter] = useState("All");
  const [modalDetection, setModalDetection] = useState(null);
  const [date, setDate] = useState("");
  const [farm, setFarm] = useState("All Farm Areas");

  const filters = ["All", "Black Sigatoka", "Healthy"];

  const filtered = filter === "All"
    ? detections
    : detections.filter((d) => d.class === filter);

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Status:</span>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-forest text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>

        {/* Farm area */}
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <select
            value={farm}
            onChange={(e) => setFarm(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/20"
          >
            <option>All Farm Areas</option>
            <option>Caburatan Zone</option>
            <option>Payot Zone</option>
            <option>Soler Zone</option>
            <option>Galinada Zone</option>
          </select>
        </div>

        {/* Results count */}
        <div className="ml-auto">
          <span className="text-xs text-gray-400">{filtered.length} results</span>
        </div>
      </div>

      {/* Detection Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
          >
            {/* Thumbnail */}
            <DetectionThumbnail cls={d.class} />

            {/* Details */}
            <div className="mt-4 space-y-2">
              {/* Badge + Confidence */}
              <div className="flex items-center justify-between">
                <StatusBadge status={d.class} />
                <span className="text-xs font-semibold text-gray-500">
                  {d.confidence}% confidence
                </span>
              </div>

              {/* GPS */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={13} className="text-gray-400 shrink-0" />
                <span className="font-mono">{d.gps}</span>
              </div>

              {/* Date/Time */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={13} className="text-gray-400 shrink-0" />
                <span>{d.datetime}</span>
              </div>

              {/* UAV source */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Plane size={13} className="shrink-0" />
                <span>Source: UAV Drone Scan — Talakag Banana Farm</span>
              </div>
            </div>

            {/* Black Sigatoka — alert button */}
            {d.class === "Black Sigatoka" && (
              <button
                onClick={() => setModalDetection(d)}
                className="mt-4 w-full bg-amber hover:bg-yellow-500 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle size={15} />
                Alert Farmers in Area
              </button>
            )}

            {/* Healthy — no action */}
            {d.class === "Healthy" && (
              <div className="mt-4 w-full bg-forest-muted text-forest text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                <ShieldCheck size={15} />
                No Action Required
              </div>
            )}
          </div>
        ))}
      </div>

      {modalDetection && (
        <AlertModal
          detection={modalDetection}
          onClose={() => setModalDetection(null)}
          onSend={() => alert("Notifications sent to farmers!")}
        />
      )}
    </div>
  );
}