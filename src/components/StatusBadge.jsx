export default function StatusBadge({ status }) {
  const map = {
    "Healthy":        "bg-green-100 text-green-800",
    "Black Sigatoka": "bg-amber-100 text-amber-800",
    "Resolved":       "bg-gray-200 text-gray-600",
    "Notified":       "bg-blue-100 text-blue-700",
    "No Alert":       "bg-gray-100 text-gray-500",
    "Sent":           "bg-blue-100 text-blue-700",
    "Read":           "bg-purple-100 text-purple-700",
    "Active":         "bg-green-100 text-green-800",
    "Inactive":       "bg-gray-200 text-gray-500",
    "UAV Alert":      "bg-amber-100 text-amber-800",
    "Manual":         "bg-blue-100 text-blue-700",
  };
  const cls = map[status] || "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}