import { useState, useMemo } from "react";
import {
  Building2, Flag, Filter, BookOpen, FileBarChart, Package,
  ChevronRight, LogIn, ShieldCheck, MapPin,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import BranchIcon, { branschConfig } from "../components/BranchIcon";
import KommunMap from "../components/KommunMap";
import ProjektDetaljModal from "../components/ProjektDetaljModal";
import Sidebar from "../components/Sidebar";
import { useToast } from "../components/Toast";
import {
  ProjektVy, DagbokVy, RapporterVy, FakturorVy as KommunFakturorLista,
  MaterialVy, AnstalldaVy, RuttplanVy,
} from "../components/SubVyer";
import LivePanel from "../components/LivePanel";
import { AnbudVy, FakturaGranskningVy, LeverantorsbetygVy } from "../components/KommunVyer";
import { projects } from "../data/projects";
import { livePositioner } from "../data/routes";
import { dagboksinlagg, rapporter } from "../data/diary";
import { materialförbrukning, materials } from "../data/materials";

// Kommunportal – read-only insyn för beställare
export default function KommunPortal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [filter, setFilter] = useState({ bransch: "alla", status: "alla", firma: "alla" });
  const [valdProjekt, setValdProjekt] = useState(null);
  const [aktivVy, setAktivVy] = useState("dashboard");

  // ALLA hooks innan villkorlig return (Rules of Hooks)
  const stockholmProjekt = useMemo(
    () => projects.filter((p) => p.kund.startsWith("Stockholms")),
    []
  );

  const filtrerade = useMemo(
    () =>
      stockholmProjekt.filter((p) => {
        if (filter.bransch !== "alla" && p.bransch !== filter.bransch) return false;
        if (filter.status !== "alla" && p.status !== filter.status) return false;
        if (filter.firma !== "alla" && p.firma !== filter.firma) return false;
        return true;
      }),
    [stockholmProjekt, filter]
  );

  const perBransch = useMemo(() => {
    const g = {};
    filtrerade.forEach((p) => {
      if (!g[p.bransch]) g[p.bransch] = [];
      g[p.bransch].push(p);
    });
    return g;
  }, [filtrerade]);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const firmor = [...new Set(stockholmProjekt.map((p) => p.firma))];
  const totBudget = filtrerade.reduce((s, p) => s + p.budget, 0);
  const totFakturerat = filtrerade.reduce((s, p) => s + p.fakturerat, 0);
  const aktivaFirmor = new Set(filtrerade.map((p) => p.firma)).size;
  const projNamn = new Set(filtrerade.map((p) => p.namn));
  const liveFörKommun = livePositioner.filter((l) => projNamn.has(l.aktuelltProjekt));

  function renderSubVy() {
    switch (aktivVy) {
      case "projekt": return <ProjektVy läge="kommun" onÖppna={setValdProjekt} />;
      case "dagbok": return <DagbokVy läge="kommun" />;
      case "rapporter": return <RapporterVy läge="kommun" />;
      case "fakturor": return <KommunFakturorLista />;
      case "material": return <MaterialVy läge="kommun" />;
      case "anstallda": return <AnstalldaVy läge="kommun" />;
      case "ruttplan": return <RuttplanVy />;
      case "anbud": return <AnbudVy />;
      case "granskning": return <FakturaGranskningVy />;
      case "betyg": return <LeverantorsbetygVy />;
      default: return null;
    }
  }

  return (
    <div className="flex flex-1">
      <Sidebar läge="kommun" aktiv={aktivVy} onByt={setAktivVy} />
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-6 py-6">
        {aktivVy !== "dashboard" ? (
          <>
            {renderSubVy()}
            {valdProjekt && <ProjektDetaljModal projekt={valdProjekt} onClose={() => setValdProjekt(null)} />}
          </>
        ) : (
        <>
      {/* Digital live-panel */}
      <LivePanel läge="kommun" />

      {/* Header */}
      <div className="bg-card rounded-2xl border border-stone-200 shadow-card p-5 md:p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">Inloggad beställare</div>
            <h1 className="text-xl md:text-2xl font-bold text-stone-900">Stockholms Kommun – Fastighetsförvaltningen</h1>
            <p className="text-sm text-stone-500 mt-1">Kontaktperson: Maria Holm · Senast uppdaterad nu</p>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck size={14} /> Full insyn aktiv
          </div>
        </div>

        {/* Sammanfattning */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-stone-200">
          <Stat label="Aktiva projekt" värde={filtrerade.length} />
          <Stat label="Engagerade firmor" värde={aktivaFirmor} />
          <Stat label="Total budget" värde={`${(totBudget / 1000000).toFixed(1)}M kr`} />
          <Stat label="Fakturerat" värde={`${(totFakturerat / 1000000).toFixed(1)}M kr`} suffix={`av ${(totBudget / 1000000).toFixed(1)}M`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Karta med live-positioner */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <h2 className="font-semibold text-stone-900">Projektkarta – live</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" />
                Hantverkare i fält
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                Projektplats
              </div>
            </div>
          </div>
          <KommunMap projekt={filtrerade} livePositioner={liveFörKommun} height={420} />
        </div>

        {/* Live-spårning lista */}
        <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" />
              <h2 className="font-semibold text-stone-900">Vem jobbar nu?</h2>
            </div>
            <span className="text-xs text-stone-500">{liveFörKommun.length} aktiva</span>
          </div>
          <div className="divide-y divide-stone-100 max-h-[420px] overflow-y-auto">
            {liveFörKommun.map((h) => (
              <div key={h.hantverkareId} className="p-3 hover:bg-stone-50 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {h.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="font-medium text-sm text-stone-900 truncate">{h.namn}</div>
                      <BranchIcon bransch={h.bransch} size="sm" showLabel={false} />
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">{h.firma}</div>
                    <div className="text-xs text-stone-700 mt-1 truncate">📍 {h.aktuellAktivitet}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">sedan {h.sedan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card rounded-xl border border-stone-200 shadow-card p-4 mb-6 flex items-center gap-3 flex-wrap">
        <Filter size={16} className="text-stone-500" />
        <FilterSelect label="Bransch" value={filter.bransch} onChange={(v) => setFilter({ ...filter, bransch: v })}
          options={[{ v: "alla", l: "Alla" }, ...Object.entries(branschConfig).map(([k, c]) => ({ v: k, l: `${c.emoji} ${c.namn}` }))]} />
        <FilterSelect label="Status" value={filter.status} onChange={(v) => setFilter({ ...filter, status: v })}
          options={[
            { v: "alla", l: "Alla" }, { v: "planerat", l: "Planerat" }, { v: "pagar", l: "Pågår" },
            { v: "besiktning", l: "Besiktning" }, { v: "klart", l: "Klart" },
          ]} />
        <FilterSelect label="Firma" value={filter.firma} onChange={(v) => setFilter({ ...filter, firma: v })}
          options={[{ v: "alla", l: "Alla" }, ...firmor.map((f) => ({ v: f, l: f }))]} />
        <div className="ml-auto text-sm text-stone-500">{filtrerade.length} av {stockholmProjekt.length} projekt</div>
      </div>

      {/* Projekt grupperade per bransch */}
      <div className="space-y-6">
        {Object.entries(perBransch).map(([bransch, lista]) => (
          <div key={bransch}>
            <div className="flex items-center gap-2 mb-3">
              <BranchIcon bransch={bransch} size="md" />
              <span className="text-sm text-stone-500">{lista.length} projekt</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lista.map((p) => <ProjektKort key={p.id} projekt={p} onÖppna={() => setValdProjekt(p)} />)}
            </div>
          </div>
        ))}
      </div>

      {valdProjekt && <ProjektDetaljModal projekt={valdProjekt} onClose={() => setValdProjekt(null)} />}
        </>
        )}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-stone-200 shadow-card-hover p-8 max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
          <Building2 size={28} />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 text-center">Kommunportalen</h1>
        <p className="text-stone-500 text-center mt-1.5 text-sm">
          Full insyn i alla dina pågående byggprojekt
        </p>
        <div className="space-y-2 mt-6 text-sm">
          <Bullet text="Realtidsspårning av hantverkare på plats" />
          <Bullet text="Dagboksinlägg från fältet – varje dag" />
          <Bullet text="Budget vs fakturerat – ingen överraskning" />
          <Bullet text="Materialförbrukning per projekt" />
          <Bullet text="Flagga avvikelser direkt" />
        </div>
        <button
          onClick={onLogin}
          className="w-full mt-6 bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <LogIn size={18} /> Logga in som Stockholms Kommun
        </button>
        <p className="text-xs text-stone-400 text-center mt-4">
          Demo-läge · Klicka för att gå in
        </p>
      </div>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">✓</div>
      <span className="text-stone-700">{text}</span>
    </div>
  );
}

function ProjektKort({ projekt, onÖppna }) {
  const toast = useToast();
  const dagbok = dagboksinlagg.filter((d) => d.projektId === projekt.id).sort((a, b) => b.datum.localeCompare(a.datum))[0];
  const rapport = rapporter.filter((r) => r.projektId === projekt.id).sort((a, b) => b.datum.localeCompare(a.datum))[0];
  const förbrukat = materialförbrukning.filter((f) => f.projektId === projekt.id);
  const materialKostnad = förbrukat.reduce((s, f) => {
    const m = materials.find((mm) => mm.id === f.materialId);
    return s + (m ? m.priser * f.antal : 0);
  }, 0);

  const procent = (projekt.fakturerat / projekt.budget) * 100;

  return (
    <div className="bg-card rounded-xl border border-stone-200 shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-stone-900">{projekt.namn}</h3>
          <StatusBadge status={projekt.status} />
        </div>
        <div className="text-sm text-stone-600 mb-1">🏢 {projekt.firma}</div>
        <div className="text-xs text-stone-500 mb-4">📍 {projekt.plats.adress}</div>

        {/* Status-timeline */}
        <Timeline timeline={projekt.timeline} />

        {/* Budget-progress */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-500 font-medium">Fakturerat</span>
            <span className="text-stone-700 font-semibold">
              {(projekt.fakturerat / 1000).toLocaleString("sv-SE")} / {(projekt.budget / 1000).toLocaleString("sv-SE")} tkr
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${procent > 90 ? "bg-red-500" : procent > 70 ? "bg-emerald-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, procent)}%` }}
            />
          </div>
          <div className="text-[11px] text-stone-400 mt-1">{procent.toFixed(0)}% av budget förbrukad</div>
        </div>

        {/* Senaste dagbok */}
        {dagbok && (
          <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
            <div className="text-[11px] uppercase font-semibold text-stone-500 mb-1 flex items-center gap-1.5">
              <BookOpen size={11} /> Senaste dagbok · {dagbok.datum}
            </div>
            <div className="text-sm font-medium text-stone-900">{dagbok.rubrik}</div>
            <div className="text-xs text-stone-600 mt-0.5 line-clamp-2">{dagbok.text}</div>
          </div>
        )}

        {/* Materialförbrukning */}
        {materialKostnad > 0 && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-stone-500 flex items-center gap-1.5"><Package size={12} /> Material</span>
            <span className="font-semibold text-stone-900">{Math.round(materialKostnad).toLocaleString("sv-SE")} kr</span>
          </div>
        )}

        {/* Senaste rapport */}
        {rapport && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-stone-500 flex items-center gap-1.5"><FileBarChart size={12} /> {rapport.typ}</span>
            <StatusBadge status={rapport.status} size="sm" />
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between">
        <button
          onClick={() => toast(`"${projekt.namn}" flaggat. Hantverksfirman och projektledaren har notifierats.`, "warn", 4000)}
          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5"
        >
          <Flag size={12} /> Flagga projekt
        </button>
        <button onClick={onÖppna} className="text-xs text-primary hover:text-primary-dark font-semibold flex items-center gap-1">
          Full transparens <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function Timeline({ timeline }) {
  const steg = [
    { key: "upphandlat", label: "Upphandlat" },
    { key: "planerat", label: "Planerat" },
    { key: "pagar", label: "Pågår" },
    { key: "besiktning", label: "Besiktning" },
    { key: "klart", label: "Klart" },
  ];
  return (
    <div className="flex items-center gap-1">
      {steg.map((s, i) => {
        const klar = timeline[s.key];
        return (
          <div key={s.key} className="flex-1 flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              klar ? "bg-emerald-500 text-white" : "bg-stone-200 text-stone-400"
            }`}>
              {klar ? "✓" : i + 1}
            </div>
            <div className={`text-[9px] mt-1 text-center font-medium ${klar ? "text-stone-700" : "text-stone-400"}`}>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-stone-500">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 hover:border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function Stat({ label, värde, suffix }) {
  return (
    <div>
      <div className="text-xs text-stone-500 font-medium uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold text-stone-900 mt-1">{värde}</div>
      {suffix && <div className="text-[11px] text-stone-400">{suffix}</div>}
    </div>
  );
}
