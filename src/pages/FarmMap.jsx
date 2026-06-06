import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { farmers, detections } from "../data/mockData";
import { MapPin, Calendar, Plane, User, X, AlertTriangle, ShieldCheck } from "lucide-react";

const markerPositions = [
  { farmer: 0, x: "23%", y: "30%" },
  { farmer: 1, x: "55%", y: "22%" },
  { farmer: 2, x: "30%", y: "62%" },
  { farmer: 3, x: "65%", y: "58%" },
];

const zoneColors = {
  notified: { fill: "#FEF3DC", stroke: "#F4A522" },
  resolved: { fill: "#F3F4F6", stroke: "#9CA3AF" },
  no_alert: { fill: "#E9F5EE", stroke: "#1B4332" },
  active:   { fill: "#FEF3DC", stroke: "#F4A522" },
};

export default function FarmMap() {
  const [selected, setSelected] = useState(null);

  const selectedDetection = selected
    ? detections.find((d) => d.farmerId === selected.id)
    : null;

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-forest" />
          <span className="text-sm font-medium text-charcoal">Talakag Banana Farm</span>
          <span className="text-xs text-gray-400">— Talakag, Bukidnon, Philippines</span>
        </div>
        <div className="flex items-center gap-2">
          <Plane size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">UAV Coverage: 10.0 ha</span>
        </div>
      </div>

      {/* Map + Side Panel */}
      <div className="flex gap-4">
        {/* Map */}
        <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all ${selected ? "flex-1" : "w-full"}`}>
          <div className="relative w-full h-[500px] bg-[#E9F5EE] overflow-hidden">

            {/* Aerial background image */}
            <img
              src="/src/assets/farm-aerial.png"
              alt="Aerial view of Talakag Banana Farm"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              onError={(e) => { e.target.style.display = "none"; }}
            />

            {/* Grid + Polygons SVG */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1B4332" strokeWidth="0.3" strokeOpacity="0.25" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Farm polygons */}
              {[
                { points: "80,80 200,70 210,160 90,170",     i: 0 },
                { points: "280,60 420,55 425,150 285,155",   i: 1 },
                { points: "100,240 240,235 245,340 105,345", i: 2 },
                { points: "310,230 460,225 465,330 315,335", i: 3 },
              ].map(({ points, i }) => {
                const f = farmers[i];
                const colors = zoneColors[f.status];
                return (
                  <polygon
                    key={i}
                    points={points}
                    fill={colors.fill}
                    fillOpacity="0.75"
                    stroke={colors.stroke}
                    strokeWidth="2"
                  />
                );
              })}

              {/* Zone labels */}
              {[
                { x: 145, y: 123, i: 0, label: "Caburatan" },
                { x: 352, y: 105, i: 1, label: "Payot" },
                { x: 172, y: 290, i: 2, label: "Soler" },
                { x: 388, y: 280, i: 3, label: "Galinada" },
              ].map(({ x, y, i, label }) => (
                <text
                  key={i}
                  x={x} y={y}
                  fontSize="11"
                  fill="#1B4332"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {label}
                </text>
              ))}

              {/* Coordinate labels */}
              <text x="8" y="492" fontSize="9" fill="#1B4332" fillOpacity="0.5">8.44°N</text>
              <text x="8" y="12"  fontSize="9" fill="#1B4332" fillOpacity="0.5">8.47°N</text>
            </svg>

            {/* Clickable Markers */}
            {markerPositions.map(({ farmer: fi, x, y }) => {
              const f = farmers[fi];
              const isSelected = selected?.id === f.id;
              const color = zoneColors[f.status].stroke;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelected(isSelected ? null : f)}
                  style={{ left: x, top: y, background: color }}
                  className={`absolute w-5 h-5 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 ${
                    isSelected ? "scale-150 ring-2 ring-offset-1 ring-forest" : ""
                  }`}
                  title={f.name}
                />
              );
            })}

            {/* Image credit */}
            <div className="absolute bottom-2 right-2 bg-black/30 text-white text-[9px] px-2 py-0.5 rounded">
              Placeholder Image
            </div>
          </div>

          {/* Legend */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-6 flex-wrap">
            <span className="text-xs font-medium text-gray-400">Legend:</span>
            {[
              { color: "#1B4332", label: "Healthy zone" },
              { color: "#F4A522", label: "Black Sigatoka detected" },
              { color: "#9CA3AF", label: "Resolved" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ background: l.color }}
                />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        {selected && (
          <div className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden h-fit">
            {/* Panel Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-forest-muted">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-forest" />
                <span className="text-sm font-semibold text-forest">Zone Details</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 hover:bg-forest/10 rounded-lg transition-colors"
              >
                <X size={15} className="text-forest" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Farmer info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-white font-semibold text-xs shrink-0">
                  {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{selected.name}</p>
                  <p className="text-xs text-gray-400">{selected.area} ha assigned zone</p>
                </div>
              </div>

              {/* Detection thumbnail */}
              <div className={`w-full h-28 rounded-lg flex flex-col items-center justify-center gap-1.5 ${
                selectedDetection?.class === "Black Sigatoka" ? "bg-amber-50" : "bg-forest-muted"
              }`}>
                {selectedDetection?.class === "Black Sigatoka" ? (
                  <>
                    <AlertTriangle size={28} className="text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">Disease Detected</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={28} className="text-forest" />
                    <span className="text-xs font-medium text-forest">Zone is Healthy</span>
                  </>
                )}
                <span className="text-[10px] text-gray-400">UAV Scan Thumbnail</span>
              </div>

              {/* Details */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">GPS Coordinates</p>
                    <p className="text-xs font-mono text-charcoal">{selected.coordinates}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Last UAV Scan</p>
                    <p className="text-xs text-charcoal">{selectedDetection?.datetime || "No scan yet"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Notification Status</p>
                    <div className="mt-0.5">
                      <StatusBadge status={
                        selected.status === "notified" ? "Notified" :
                        selected.status === "resolved" ? "Resolved" : "No Alert"
                      } />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Plane size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Detection Class</p>
                    <div className="mt-0.5">
                      <StatusBadge status={selectedDetection?.class || "Healthy"} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence bar */}
              {selectedDetection && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Confidence Score</span>
                    <span className="text-xs font-semibold text-charcoal">{selectedDetection.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        selectedDetection.class === "Black Sigatoka" ? "bg-amber" : "bg-forest"
                      }`}
                      style={{ width: `${selectedDetection.confidence}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}