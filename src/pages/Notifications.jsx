import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { notifications as initialNotifications, farmers } from "../data/mockData";
import { Send, X, Bell, RefreshCw, CheckCheck } from "lucide-react";

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [notifList, setNotifList] = useState(initialNotifications);
  const [form, setForm] = useState({ recipient: "All Farmers", gps: "", message: "" });

  const filters = ["All", "Sent", "Read", "Resolved"];

  const filtered = filter === "All"
    ? notifList
    : notifList.filter((n) => n.status === filter);

  function handleResend(id) {
    setNotifList(notifList.map((n) =>
      n.id === id ? { ...n, status: "Sent" } : n
    ));
  }

  function handleResolve(id) {
    setNotifList(notifList.map((n) =>
      n.id === id ? { ...n, status: "Resolved", type: "Resolved" } : n
    ));
  }

  function handleSend() {
    if (!form.message) return;
    const newNotif = {
      id: notifList.length + 1,
      datetime: new Date().toLocaleString("en-PH", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
      type: "Manual",
      farmer: form.recipient,
      coords: form.gps || "—",
      message: form.message,
      status: "Sent",
    };
    setNotifList([newNotif, ...notifList]);
    setForm({ recipient: "All Farmers", gps: "", message: "" });
    setShowModal(false);
  }

  return (
    <div className="space-y-5">
      {/* Filter + Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-forest text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {f === "All"
                  ? notifList.length
                  : notifList.filter((n) => n.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber hover:bg-yellow-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Send size={15} />
          Send New Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bell size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No notifications found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-medium">
              <tr>
                {["Date/Time", "Type", "Farmer", "Coordinates", "Message", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{n.datetime}</td>
                  <td className="px-4 py-3"><StatusBadge status={n.type} /></td>
                  <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">{n.farmer}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{n.coords}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{n.message}</td>
                  <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {n.status !== "Resolved" && (
                        <>
                          <button
                            onClick={() => handleResend(n.id)}
                            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                            title="Resend"
                          >
                            <RefreshCw size={12} />
                            Resend
                          </button>
                          <button
                            onClick={() => handleResolve(n.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors"
                            title="Mark Resolved"
                          >
                            <CheckCheck size={12} />
                            Resolve
                          </button>
                        </>
                      )}
                      {n.status === "Resolved" && (
                        <span className="text-xs text-gray-300 italic">No actions</span>
                      )}
                    </div>
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
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Farm context */}
              <div className="bg-forest-muted border border-forest/20 rounded-lg px-3 py-2.5 flex items-center gap-2">
                <Bell size={13} className="text-forest shrink-0" />
                <p className="text-xs text-forest font-medium">
                  Talakag Banana Farm — Manual Notification
                </p>
              </div>

              {/* Recipient */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Recipient</label>
                <select
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                >
                  <option>All Farmers</option>
                  {farmers.map((f) => (
                    <option key={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* GPS Zone */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  GPS Zone <span className="text-gray-300">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8.4542° N, 124.6319° E"
                  value={form.gps}
                  onChange={(e) => setForm({ ...form, gps: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 font-mono"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Message</label>
                <textarea
                  rows={3}
                  placeholder="Type your notification message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!form.message}
                className="flex-1 py-2 rounded-lg bg-forest hover:bg-forest-light disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
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