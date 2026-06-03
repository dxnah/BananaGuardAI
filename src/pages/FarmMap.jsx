import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { farmers, detections } from "../data/mockData";

const markerColors = {
  notified: "#F4A522",
  resolved: "#9CA3AF",
  no_alert: "#1B4332",
  active:   "#F4A522",
};

export default function FarmMap() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-4">
      {/* Map Area */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="relative w-full h-[480px] bg-[#E9F5EE]">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1B4332" strokeWidth="0.3" strokeOpacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Farm polygons */}
            <polygon points="120,100 220,90 230,170 130,180" fill="#1B4332" fillOpacity="0.12" stroke="#1B4332" strokeWidth="1.5" />
            <polygon points="280,120 380,110 390,200 290,210" fill="#1B4332" fillOpacity="0.12" stroke="#1B4332" strokeWidth="1.5" />
            <polygon points="150,240 260,230 270,320 160,330" fill="#1B4332" fillOpacity="0.12" stroke="#1B4332" strokeWidth="1.5" />
            <polygon points="330,250 440,240 450,330 340,340" fill="#1B4332" fillOpacity="0.12" stroke="#1B4332" strokeWidth="1.5" />

            {/* Farm labels */}
            {[
              { x: 155, y: 138, name: "Caburatan" },
              { x: 320, y: 158, name: "Payot" },
              { x: 195, y: 278, name: "Soler" },
              { x: 370, y: 288, name: "Galinada" },
            ].map((l) => (
              <text key={l.name} x={l.x} y={l.y} fontSize="11" fill="#1B4332" fontWeight="500" textAnchor="middle">
                {l.name}
              </text>
            ))}
          </svg>

          {/* Clickable Markers */}
          {[
            { farmer: farmers[0], x: "23%", y: "28%" },
            { farmer: farmers[1], x: "53%", y: "32%" },
            { farmer: farmers[2], x: "30%", y: "62%" },
            { farmer: farmers[3], x: "63%", y: "65%" },
          ].map(({ farmer, x, y }) => (
            <button
              key={farmer.id}
              onClick={() => setSelected(farmer)}
              style={{ left: x, top: y, background: markerColors[farmer.status] }}
              className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
              title={farmer.name}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-6">
          <span className="text-xs font-medium text-gray-500">Legend:</span>
          {[
            { color: "#1B4332", label: "Healthy zone" },
            { color: "#F4A522", label: "Black Sigatoka detected" },
            { color: "#9CA3AF", label: "Resolved" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Panel */}
      {selected && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base text-charcoal">{selected.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{selected.coordinates}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Detection</p>
              <StatusBadge status={detections.find((d) => d.farmerId === selected.id)?.class || "Healthy"} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Alert</p>
              <p className="text-sm font-medium text-charcoal">{selected.lastAlert}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">App Status</p>
              <StatusBadge status={selected.appStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}