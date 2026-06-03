export default function MetricCard({ label, value, icon, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className="w-9 h-9 bg-forest-muted rounded-lg flex items-center justify-center text-forest">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-semibold text-charcoal">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}