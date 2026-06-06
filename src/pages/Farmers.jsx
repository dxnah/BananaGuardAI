import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { farmers as initialFarmers } from "../data/mockData";
import { UserPlus, Eye, Pencil, Trash2, X, MapPin, Phone, Calendar } from "lucide-react";

const emptyForm = {
  name: "",
  coordinates: "",
  area: "",
  appStatus: "Active",
};

export default function Farmers() {
  const [farmerList, setFarmerList] = useState(initialFarmers);
  const [viewFarmer, setViewFarmer] = useState(null);
  const [editFarmer, setEditFarmer] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const statusLabel = {
    notified: "Notified",
    resolved: "Resolved",
    no_alert: "No Alert",
    active:   "Notified",
  };

  function handleAdd() {
    const newFarmer = {
      id: farmerList.length + 1,
      ...form,
      area: parseFloat(form.area) || 0,
      status: "no_alert",
      lastAlert: "—",
    };
    setFarmerList([...farmerList, newFarmer]);
    setShowAdd(false);
    setForm(emptyForm);
  }

  function handleEdit() {
    setFarmerList(farmerList.map((f) =>
      f.id === editFarmer.id
        ? { ...f, ...form, area: parseFloat(form.area) || f.area }
        : f
    ));
    setEditFarmer(null);
    setForm(emptyForm);
  }

  function handleDelete(id) {
    setFarmerList(farmerList.filter((f) => f.id !== id));
  }

  function openEdit(f) {
    setEditFarmer(f);
    setForm({
      name: f.name,
      coordinates: f.coordinates,
      area: f.area.toString(),
      appStatus: f.appStatus,
    });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{farmerList.length} registered farmers</p>
        <button
          onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-forest hover:bg-forest-light text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
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
            {farmerList.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white font-semibold text-xs shrink-0">
                      {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="font-medium text-charcoal">{f.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{f.coordinates}</td>
                <td className="px-5 py-3 text-gray-600">{f.area} ha</td>
                <td className="px-5 py-3"><StatusBadge status={f.appStatus} /></td>
                <td className="px-5 py-3 text-gray-500">{f.lastAlert}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewFarmer(f)}
                      className="p-1.5 hover:bg-forest-muted rounded-lg transition-colors text-forest"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEdit(f)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-500"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewFarmer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-base text-charcoal">Farmer Profile</h2>
              <button onClick={() => setViewFarmer(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center text-white font-bold text-lg">
                  {viewFarmer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-base">{viewFarmer.name}</p>
                  <StatusBadge status={viewFarmer.appStatus} />
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Coordinates</p>
                  </div>
                  <p className="text-xs font-mono text-charcoal">{viewFarmer.coordinates}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Farm Area</p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">{viewFarmer.area} ha</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Last Alert Sent</p>
                  </div>
                  <p className="text-sm font-medium text-charcoal">{viewFarmer.lastAlert}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Phone size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Notification Status</p>
                  </div>
                  <StatusBadge status={statusLabel[viewFarmer.status]} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setViewFarmer(null)}
                className="w-full py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-base text-charcoal">Add New Farmer</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Full Name",        key: "name",        placeholder: "e.g. Juan D. Cruz" },
                { label: "GPS Coordinates",  key: "coordinates", placeholder: "e.g. 8.4542° N, 124.6319° E" },
                { label: "Farm Area (ha)",   key: "area",        placeholder: "e.g. 2.5" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">App Status</label>
                <select
                  value={form.appStatus}
                  onChange={(e) => setForm({ ...form, appStatus: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors"
              >
                Add Farmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editFarmer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-base text-charcoal">Edit Farmer</h2>
              <button onClick={() => setEditFarmer(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Full Name",       key: "name",        placeholder: "Full name" },
                { label: "GPS Coordinates", key: "coordinates", placeholder: "GPS coordinates" },
                { label: "Farm Area (ha)",  key: "area",        placeholder: "Area in hectares" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">App Status</label>
                <select
                  value={form.appStatus}
                  onChange={(e) => setForm({ ...form, appStatus: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setEditFarmer(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}