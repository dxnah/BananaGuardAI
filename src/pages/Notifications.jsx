import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { notifications, farmers } from "../data/mockData";
import { Send, X } from "lucide-react";

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const filters = ["All", "Sent", "Read", "Resolved"];
  const filtered = filter === "All" ? notifications : notifications.filter((n) => n.status === filter);

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
                filter === f ? "bg-forest text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
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
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-500 hover:underline">Resend</button>
                    <button className="text-xs text-gray-400 hover:underline">Resolve</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Send Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-base text-charcoal">Send New Notification</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Recipient</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20">
                  <option>All Farmers</option>
                  {farmers.map((f) => <option key={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">GPS Zone</label>
                <input type="text" placeholder="e.g. 8.4542° N, 124.6319° E" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Message</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none" placeholder="Type your notification message..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => { alert("Notification sent!"); setShowModal(false); }} className="flex-1 px-4 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}