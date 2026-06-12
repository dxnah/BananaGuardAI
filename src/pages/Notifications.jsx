import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
import { getAlerts, createAlert, acknowledgeAlert, getFarmers } from "../services/api";
import { Send, X, Bell, RefreshCw, CheckCheck } from "lucide-react";

export default function Notifications() {
  const [filter, setFilter]     = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [notifList, setNotifList] = useState([]);
  const [farmers, setFarmers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ recipient: "", gps: "", message: "" });

  const filters = ["All", "Sent", "Read", "Resolved"];

  useEffect(() => {
    Promise.all([getAlerts(), getFarmers()])
      .then(([alerts, farmerData]) => {
        setNotifList(alerts);
        setFarmers(farmerData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All"
    ? notifList
    : notifList.filter((n) => (n.acknowledged ? "Resolved" : "Sent") === filter);

  async function handleAcknowledge(alert_id) {
    try {
      const updated = await acknowledgeAlert(alert_id);
      setNotifList(notifList.map((n) => n.alert_id === alert_id ? updated : n));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSend() {
    if (!form.message) return;
    try {
      const recipientFarmer = farmers.find((f) => f.username === form.recipient);
      const newAlert = await createAlert({
        user_id:       recipientFarmer?.user_id || null,
        alert_message: form.message,
      });
      setNotifList([newAlert, ...notifList]);
      setForm({ recipient: "", gps: "", message: "" });
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to send notification");
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-PH", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="space-y-5">
      {/* Filter + Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-forest text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {f === "All"
                  ? notifList.length
                  : notifList.filter((n) => (n.acknowledged ? "Resolved" : "Sent") === f).length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber hover:bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Send size={15} />
          Send New Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No notifications found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
              <tr>
                {["Date/Time", "Farmer ID", "Message", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((n) => (
                <tr key={n.alert_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(n.alert_sent_at)}
                  </td>
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {n.user_id ? `Farmer #${n.user_id}` : "All Farmers"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                    {n.alert_message || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={n.acknowledged ? "Resolved" : "Sent"} />
                  </td>
                  <td className="px-4 py-3">
                    {!n.acknowledged && (
                      <button onClick={() => handleAcknowledge(n.alert_id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors">
                        <CheckCheck size={12} />
                        Resolve
                      </button>
                    )}
                    {n.acknowledged && (
                      <span className="text-xs text-gray-300 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Send Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-base text-charcoal">Send New Notification</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="bg-forest-muted border border-forest/20 rounded-lg px-3 py-2.5 flex items-center gap-2">
                <Bell size={13} className="text-forest shrink-0" />
                <p className="text-xs text-forest font-medium">Talakag Banana Farm — Manual Notification</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Recipient</label>
                <select value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20">
                  <option value="">All Farmers</option>
                  {farmers.map((f) => (
                    <option key={f.user_id} value={f.username}>{f.username}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Message</label>
                <textarea rows={3} placeholder="Type your notification message..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSend} disabled={!form.message}
                className="flex-1 py-2 rounded-lg bg-forest hover:bg-forest-light disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Send size={14} />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}