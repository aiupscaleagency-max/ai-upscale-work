import {
  LayoutDashboard, Briefcase, BookOpen, FileBarChart, Receipt,
  Package, Users, MapPin, Plus, Building, TrendingUp, Shield,
  FileSearch, ClipboardCheck, Star,
} from "lucide-react";

// Sidebar för Admin OCH Kommunportal – delad styrning av aktiv sub-vy
const menyAdmin = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, sektion: "ÖVERSIKT" },
  { id: "projekt", label: "Projekt", icon: Briefcase, sektion: "ÖVERSIKT" },
  { id: "dagbok", label: "Dagbok", icon: BookOpen, sektion: "ÖVERSIKT" },
  { id: "rapporter", label: "Rapporter", icon: FileBarChart, sektion: "ÖVERSIKT" },
  { id: "fakturor", label: "Fakturor", icon: Receipt, sektion: "ÖVERSIKT" },
  { id: "material", label: "Material", icon: Package, sektion: "ÖVERSIKT" },
  { id: "anstallda", label: "Anställda", icon: Users, sektion: "ÖVERSIKT" },
  { id: "ruttplan", label: "Ruttplan", icon: MapPin, sektion: "ÖVERSIKT" },
  // Koncern-funktioner
  { id: "koncern", label: "Koncernstruktur", icon: Building, sektion: "KONCERN" },
  { id: "lonsamhet", label: "Lönsamhet", icon: TrendingUp, sektion: "KONCERN" },
  { id: "certifikat", label: "HR & Certifikat", icon: Shield, sektion: "KONCERN" },
];

const menyKommun = [
  { id: "dashboard", label: "Översikt", icon: LayoutDashboard, sektion: "INSYN" },
  { id: "projekt", label: "Projekt", icon: Briefcase, sektion: "INSYN" },
  { id: "dagbok", label: "Dagbok", icon: BookOpen, sektion: "INSYN" },
  { id: "rapporter", label: "Rapporter", icon: FileBarChart, sektion: "INSYN" },
  { id: "fakturor", label: "Fakturor", icon: Receipt, sektion: "INSYN" },
  { id: "material", label: "Material", icon: Package, sektion: "INSYN" },
  { id: "anstallda", label: "Hantverkare", icon: Users, sektion: "INSYN" },
  { id: "ruttplan", label: "Karta", icon: MapPin, sektion: "INSYN" },
  // Beställar-funktioner
  { id: "anbud", label: "Anbudsförfrågningar", icon: FileSearch, sektion: "BESTÄLLARE" },
  { id: "granskning", label: "Granska fakturor", icon: ClipboardCheck, sektion: "BESTÄLLARE" },
  { id: "betyg", label: "Leverantörsbetyg", icon: Star, sektion: "BESTÄLLARE" },
];

export default function Sidebar({ läge = "admin", aktiv, onByt, onSnabbåtgärd }) {
  const meny = läge === "admin" ? menyAdmin : menyKommun;
  const färgKlass = läge === "kommun" ? "bg-blue-100 text-blue-700" : "bg-primary/10 text-primary-dark";

  // Gruppera per sektion
  const sektioner = {};
  meny.forEach((m) => {
    if (!sektioner[m.sektion]) sektioner[m.sektion] = [];
    sektioner[m.sektion].push(m);
  });

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-stone-200 py-4 px-3 shrink-0 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
      {Object.entries(sektioner).map(([sektion, poster]) => (
        <div key={sektion} className="mb-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-3 mb-1.5">
            {sektion}
          </div>
          <nav className="flex flex-col gap-0.5">
            {poster.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => onByt(m.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    aktiv === m.id ? färgKlass : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Icon size={16} />
                  {m.label}
                </button>
              );
            })}
          </nav>
        </div>
      ))}

      {läge === "admin" && onSnabbåtgärd && (
        <div className="mt-1 pt-3 border-t border-stone-200">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-3 mb-1.5">
            SNABB-ÅTGÄRDER
          </div>
          <button
            onClick={() => onSnabbåtgärd("nyttProjekt")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 text-left"
          >
            <Plus size={14} /> Nytt projekt
          </button>
          <button
            onClick={() => onSnabbåtgärd("dagsrapport")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 text-left"
          >
            <Plus size={14} /> Dagsrapport
          </button>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-stone-200 px-3">
        <div className="text-xs text-stone-500 mb-1">Demo-läge</div>
        <div className="text-xs text-stone-400">All data är fiktiv</div>
      </div>
    </aside>
  );
}
