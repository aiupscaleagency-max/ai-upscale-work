// Branschikon med emoji + färgkodning
export const branschConfig = {
  el: { emoji: "⚡", namn: "El", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  vvs: { emoji: "🔧", namn: "VVS", color: "bg-sky-100 text-sky-700 border-sky-200" },
  entreprenad: { emoji: "🏗️", namn: "Entreprenad", color: "bg-stone-200 text-stone-700 border-stone-300" },
  snickeri: { emoji: "🪚", namn: "Snickeri", color: "bg-orange-100 text-orange-800 border-orange-200" },
  maleri: { emoji: "🎨", namn: "Måleri", color: "bg-pink-100 text-pink-700 border-pink-200" },
  tak: { emoji: "🏠", namn: "Tak/Plåt", color: "bg-slate-200 text-slate-700 border-slate-300" },
  golv: { emoji: "◼️", namn: "Golv", color: "bg-neutral-200 text-neutral-700 border-neutral-300" },
};

export default function BranchIcon({ bransch, size = "md", showLabel = true }) {
  const cfg = branschConfig[bransch] || branschConfig.entreprenad;
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${cfg.color} ${sizes[size]}`}
    >
      <span>{cfg.emoji}</span>
      {showLabel && <span>{cfg.namn}</span>}
    </span>
  );
}
