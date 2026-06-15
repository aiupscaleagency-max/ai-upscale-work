// KPI-kort för Admin-dashboard
export default function KpiCard({ label, värde, suffix, icon: Icon, trend, accent = "primary" }) {
  const accents = {
    primary: "bg-emerald-50 text-primary",
    blue: "bg-sky-50 text-sky-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    stone: "bg-stone-100 text-stone-600",
  };
  return (
    <div className="bg-card rounded-xl border border-stone-200 shadow-card p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accents[accent]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-stone-900">{värde}</span>
        {suffix && <span className="text-sm text-stone-500 font-medium">{suffix}</span>}
      </div>
      {trend && (
        <div className={`text-xs mt-2 font-medium ${trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
