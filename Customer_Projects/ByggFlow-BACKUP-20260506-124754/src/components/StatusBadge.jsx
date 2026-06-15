// Statusbadge med färgkodning för projekt, fakturor och hantverkare
const config = {
  // Projekt
  planerat: { label: "Planerat", style: "bg-blue-50 text-blue-700 border-blue-200" },
  pagar: { label: "Pågår", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  besiktning: { label: "Besiktning", style: "bg-purple-50 text-purple-700 border-purple-200" },
  klart: { label: "Klart", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  // Faktura
  utkast: { label: "Utkast", style: "bg-stone-100 text-stone-600 border-stone-200" },
  skickad: { label: "Skickad", style: "bg-blue-50 text-blue-700 border-blue-200" },
  betald: { label: "Betald", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  forfallen: { label: "Förfallen", style: "bg-red-50 text-red-700 border-red-200" },
  // Hantverkare-status
  pa_vag: { label: "På väg", style: "bg-blue-50 text-blue-700 border-blue-200" },
  pa_plats: { label: "På plats", style: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  rast: { label: "Rast", style: "bg-stone-100 text-stone-600 border-stone-200" },
  klar: { label: "Klar", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  kommande: { label: "Kommande", style: "bg-stone-100 text-stone-600 border-stone-200" },
  // Prioritet
  brådskande: { label: "Brådskande", style: "bg-red-50 text-red-700 border-red-200" },
  normal: { label: "Normal", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  // Material
  ok: { label: "OK", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  lag: { label: "Låg", style: "bg-red-50 text-red-700 border-red-200" },
  slut: { label: "Slut", style: "bg-red-100 text-red-800 border-red-300" },
  // Rapporter
  godkänd: { label: "Godkänd", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  öppen: { label: "Öppen", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  schemalagd: { label: "Schemalagd", style: "bg-blue-50 text-blue-700 border-blue-200" },
};

export default function StatusBadge({ status, size = "md" }) {
  const cfg = config[status] || { label: status, style: "bg-stone-100 text-stone-600 border-stone-200" };
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${cfg.style} ${sizes[size]}`}>
      {cfg.label}
    </span>
  );
}
