import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { farmers } from "../data/mockData";
import { UserPlus, Eye, Pencil, Trash2, X } from "lucide-react";

export default function Farmers() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{farmers.length} registered farmers</p>
        <button className="flex items-center gap-2 bg-forest hover:bg-forest-light text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <UserPlus size={16} />
          Add Farmer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
            <tr>
              {["Farmer Name", "Farm Coordinates", "Area (ha)", "App Status", "Last Alert Sent", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {farmers.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-charcoal">{f.name}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{f.coordinates}</td>
                <td className="px-5 py-3 text-gray-600">{f.area} ha</td>
                <td className="px-5 py-3"><StatusBadge status={f.appStatus} /></td>
                <td className="px-5 py-3 text-gray-500">{f.lastAlert}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelected(f)} className="p-1.5 hover:bg-forest-muted rounded-lg transition-colors text-forest">
                      <Eye size={15} />
                    </button>
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-500">
                      <Pencil size={15} />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-base text-charcoal">Farmer Profile</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center text-white font-semibold">
                  {selected.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-semibold text-charcoal">{selected.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{selected.coordinates}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Farm Area", value: `${selected.area} ha` },
                  { label: "App Status", value: <StatusBadge status={selected.appStatus} /> },
                  { label: "Last Alert Sent", value: selected.lastAlert },
                  { label: "Current Status", value: <StatusBadge status={selected.status === "no_alert" ? "No Alert" : selected.status === "resolved" ? "Resolved" : "Notified"} /> },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <div className="text-sm font-medium text-charcoal">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}