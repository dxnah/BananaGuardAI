import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import AlertModal from "../components/AlertModal";
import { detections } from "../data/mockData";

export default function UAVDetections() {
  const [filter, setFilter] = useState("All");
  const [modalDetection, setModalDetection] = useState(null);

  const filters = ["All", "Black Sigatoka", "Healthy"];
  const filtered = filter === "All" ? detections : detections.filter((d) => d.class === filter);

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-sm text-gray-500 font-medium">Filter:</span>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-forest text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="date"
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20">
            <option>All Farm Areas</option>
            <option>Caburatan Farm</option>
            <option>Payot Farm</option>
            <option>Soler Farm</option>
            <option>Galinada Farm</option>
          </select>
        </div>
      </div>

      {/* Detection Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex gap-4">
              <div className="w-24 h-20 bg-forest-muted rounded-lg flex items-center justify-center text-3xl shrink-0">
                🍌
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={d.class} />
                  <span className="text-xs text-gray-400">{d.confidence}% confidence</span>
                </div>
                <p className="text-xs text-gray-500 font-mono">{d.gps}</p>
                <p className="text-xs text-gray-400">{d.datetime}</p>
              </div>
            </div>
            {d.class === "Black Sigatoka" && (
              <button
                onClick={() => setModalDetection(d)}
                className="mt-4 w-full bg-amber hover:bg-yellow-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Alert Farmers in Area
              </button>
            )}
          </div>
        ))}
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