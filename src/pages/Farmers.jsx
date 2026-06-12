import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
import { getFarmers, createFarmer, updateFarmer, deleteFarmer } from "../services/api";
import { UserPlus, Eye, Pencil, Trash2, X, MapPin, Phone, Calendar } from "lucide-react";

const emptyForm = { username: "", farm_name: "", location: "" };

export default function Farmers() {
  const [farmerList, setFarmerList] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [viewFarmer, setViewFarmer] = useState(null);
  const [editFarmer, setEditFarmer] = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [form, setForm]             = useState(emptyForm);

  useEffect(() => {
    getFarmers()
      .then(setFarmerList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!form.username) return;
    try {
      const newFarmer = await createFarmer({
        username:  form.username,
        farm_name: form.farm_name || null,
        location:  form.location  || null,
      });
      setFarmerList([...farmerList, newFarmer]);
      setShowAdd(false);
      setForm(emptyForm);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add farmer");
    }
  }

  async function handleEdit() {
    try {
      const updated = await updateFarmer(editFarmer.user_id, {
        username:  form.username  || undefined,
        farm_name: form.farm_name || null,
        location:  form.location  || null,
      });
      setFarmerList(farmerList.map((f) => f.user_id === updated.user_id ? updated : f));
      setEditFarmer(null);
      setForm(emptyForm);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update farmer");
    }
  }

  async function handleDelete(user_id) {
    if (!confirm("Delete this farmer?")) return;
    try {
      await deleteFarmer(user_id);
      setFarmerList(farmerList.filter((f) => f.user_id !== user_id));
    } catch (err) {
      alert("Failed to delete farmer");
    }
  }

  function openEdit(f) {
    setEditFarmer(f);
    setForm({ username: f.username, farm_name: f.farm_name || "", location: f.location || "" });
  }

  function getInitials(name = "") {
    return name.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
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
              {["Farmer Name", "Farm Name", "Location", "Registered", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">Loading...</td></tr>
            ) : farmerList.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-xs">No farmers registered yet.</td></tr>
            ) : farmerList.map((f) => (
              <tr key={f.user_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white font-semibold text-xs shrink-0">
                      {getInitials(f.username)}
                    </div>
                    <span className="font-medium text-charcoal capitalize">{f.username}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{f.farm_name || "—"}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{f.location || "—"}</td>
                <td className="px-5 py-3 text-gray-500">
                  {f.created_at ? new Date(f.created_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewFarmer(f)} className="p-1.5 hover:bg-forest-muted rounded-lg transition-colors text-forest" title="View">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => openEdit(f)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-500" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(f.user_id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400" title="Delete">
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
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-forest flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(viewFarmer.username)}
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-base capitalize">{viewFarmer.username}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Farmer</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Location</p>
                  </div>
                  <p className="text-xs font-mono text-charcoal">{viewFarmer.location || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Farm Name</p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">{viewFarmer.farm_name || "—"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Registered</p>
                  </div>
                  <p className="text-sm font-medium text-charcoal">
                    {viewFarmer.created_at ? new Date(viewFarmer.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setViewFarmer(null)} className="w-full py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
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
                { label: "Username",   key: "username",  placeholder: "e.g. juan_cruz" },
                { label: "Farm Name",  key: "farm_name", placeholder: "e.g. Cruz Banana Farm" },
                { label: "Location",   key: "location",  placeholder: "e.g. 8.4542° N, 124.6319° E" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors">Add Farmer</button>
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
                { label: "Username",  key: "username",  placeholder: "Username" },
                { label: "Farm Name", key: "farm_name", placeholder: "Farm name" },
                { label: "Location",  key: "location",  placeholder: "GPS or address" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setEditFarmer(null)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleEdit} className="flex-1 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}