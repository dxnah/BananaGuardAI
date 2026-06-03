import { X } from "lucide-react";
import { farmers } from "../data/mockData";

export default function AlertModal({ detection, onClose, onSend }) {
  if (!detection) return null;

  const nearby = farmers.filter((f) => f.appStatus === "Active");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-base text-charcoal">Alert Farmers in Area</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Affected GPS Zone</p>
            <p className="text-sm font-mono text-charcoal bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              {detection.gps}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Farmers Within Range</p>
            <div className="space-y-2">
              {nearby.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2.5 bg-forest-muted rounded-lg">
                  <div className="w-7 h-7 bg-forest rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.coordinates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Notification Message Preview</p>
            <div className="text-sm text-gray-700 bg-amber-light border border-amber/30 rounded-lg px-3 py-2.5">
              ⚠️ Black Sigatoka detected at <strong>{detection.confidence}% confidence</strong> near your farm zone ({detection.gps}). Please inspect your crops immediately.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSend(); onClose(); }}
            className="flex-1 px-4 py-2 rounded-lg bg-forest text-white text-sm font-medium hover:bg-forest-light transition-colors"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}