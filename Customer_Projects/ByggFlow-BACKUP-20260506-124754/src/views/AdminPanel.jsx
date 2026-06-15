import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, BookOpen, Receipt, TrendingUp, Package, Users, AlertTriangle, MapPin, Clock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import KpiCard from "../components/KpiCard";
import StatusBadge from "../components/StatusBadge";
import BranchIcon from "../components/BranchIcon";
import ProjektDetaljModal from "../components/ProjektDetaljModal";
import { useToast } from "../components/Toast";
import {
  ProjektVy, DagbokVy, RapporterVy, FakturorVy as KommunFakturorVy,
  MaterialVy, AnstalldaVy, RuttplanVy,
} from "../components/SubVyer";
import { NyttProjektFormulär, DagsrapportFormulär } from "../components/SnabbFormulär";
import LivePanel from "../components/LivePanel";
import { KoncernVy, LonsamhetVy, CertifikatVy } from "../components/AdminVyer";
import { projects } from "../data/projects";
import { invoices } from "../data/invoices";
import { materials } from "../data/materials";
import { livePositioner } from "../data/routes";
import { dagboksinlagg } from "../data/diary";

// Hjälpare: räkna fakturasumma med moms
function fakturaTotal(f) {
  const netto = f.rader.reduce((s, r) => s + r.antal * r.aPris, 0);
  return netto * (1 + f.moms / 100);
}

export default function AdminPanel() {
  const [valdProjekt, setValdProjekt] = useState(null);
  const [aktivVy, setAktivVy] = useState("dashboard");
  const [snabbForm, setSnabbForm] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // KPI-beräkningar från mockdata
  const aktivaProjekt = projects.filter((p) => p.status !== "klart").length;
  const dagboksIdag = dagboksinlagg.filter((d) => d.datum === "2026-04-26").length;
  const öppnaFakturor = invoices.filter((f) => ["skickad", "utkast", "forfallen"].includes(f.status)).length;
  const intäkterMånad = invoices
    .filter((f) => f.status === "betald" && f.datum.startsWith("2026-04"))
    .reduce((s, f) => s + fakturaTotal(f), 0);
  const lågtMaterial = materials.filter((m) => m.status === "lag").length;
  const ifält = livePositioner.length;

  // Faktura-summering
  const fakturaSummering = {
    utkast: invoices.filter((f) => f.status === "utkast"),
    skickad: invoices.filter((f) => f.status === "skickad"),
    betald: invoices.filter((f) => f.status === "betald"),
    forfallen: invoices.filter((f) => f.status === "forfallen"),
  };
  const totaltAttBetala = [...fakturaSummering.skickad, ...fakturaSummering.forfallen]
    .reduce((s, f) => s + fakturaTotal(f), 0);

  // Renderar vald sub-vy istället för Dashboard
  function renderSubVy() {
    switch (aktivVy) {
      case "projekt": return <ProjektVy läge="admin" onÖppna={setValdProjekt} onNyttProjekt={() => setSnabbForm("nyttProjekt")} />;
      case "dagbok": return <DagbokVy läge="admin" onNyDagbok={() => setSnabbForm("dagsrapport")} />;
      case "rapporter": return <RapporterVy läge="admin" />;
      case "fakturor": return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Fakturor</h2>
            <button onClick={() => navigate("/faktura")} className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark">Öppna full Faktura-vy →</button>
          </div>
          <p className="text-sm text-stone-500">Fakturahantering med skapa/skicka/PDF finns i Faktura-vyn.</p>
        </div>
      );
      case "material": return <MaterialVy läge="admin" />;
      case "anstallda": return <AnstalldaVy läge="admin" />;
      case "ruttplan": return <RuttplanVy />;
      case "koncern": return <KoncernVy />;
      case "lonsamhet": return <LonsamhetVy />;
      case "certifikat": return <CertifikatVy />;
      default: return null;
    }
  }

  return (
    <div className="flex flex-1">
      <Sidebar
        läge="admin"
        aktiv={aktivVy}
        onByt={setAktivVy}
        onSnabbåtgärd={(typ) => setSnabbForm(typ)}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {aktivVy !== "dashboard" ? (
          renderSubVy()
        ) : (
        <>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-stone-500 mt-1">Live-aktivitetspanel – alla projekt, fakturor och fältarbete i realtid</p>
        </div>

        {/* Digital live-panel */}
        <LivePanel läge="admin" />

        {/* KPI-kort */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
          <KpiCard label="Aktiva projekt" värde={aktivaProjekt} icon={Briefcase} accent="primary" trend="+2 denna vecka" />
          <KpiCard label="Dagbok idag" värde={dagboksIdag} icon={BookOpen} accent="blue" />
          <KpiCard label="Öppna fakturor" värde={öppnaFakturor} icon={Receipt} accent="purple" />
          <KpiCard label="Intäkter april" värde={Math.round(intäkterMånad / 1000)} suffix="tkr" icon={TrendingUp} accent="green" trend="+18%" />
          <KpiCard label="Material låg" värde={lågtMaterial} icon={Package} accent="red" />
          <KpiCard label="I fält nu" värde={ifält} icon={Users} accent="stone" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Projekttabell – 2/3 bredd */}
          <div id="projekttabell" className="lg:col-span-2 bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden scroll-mt-20">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-semibold text-stone-900">Aktiva projekt</h2>
              <button
                onClick={() => navigate("/kommun")}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                Visa alla i Kommunportalen →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-stone-500 tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Projekt</th>
                    <th className="text-left px-4 py-3 font-semibold">Bransch</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Ansvarig</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Deadline</th>
                    <th className="text-right px-4 py-3 font-semibold">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {projects.slice(0, 10).map((p) => (
                    <tr key={p.id} onClick={() => setValdProjekt(p)} className="hover:bg-emerald-50/50 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-900">{p.namn}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{p.firma}</div>
                      </td>
                      <td className="px-4 py-3"><BranchIcon bransch={p.bransch} size="sm" /></td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-stone-700 hidden md:table-cell">{p.ansvarig}</td>
                      <td className="px-4 py-3 text-stone-500 hidden lg:table-cell text-xs">{p.deadline}</td>
                      <td className="px-4 py-3 text-right font-medium text-stone-900 whitespace-nowrap">
                        {(p.budget / 1000).toLocaleString("sv-SE")} tkr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Höger kolumn: Live-fältarbete + Material-alarm */}
          <div className="space-y-4 md:space-y-6">
            {/* Live-spårning av fältarbetare */}
            <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" />
                  <h2 className="font-semibold text-stone-900">Live i fält</h2>
                </div>
                <span className="text-xs text-stone-500">{ifält} aktiva</span>
              </div>
              <div className="divide-y divide-stone-100 max-h-[420px] overflow-y-auto">
                {livePositioner.map((h) => {
                  const proj = projects.find((p) => p.namn === h.aktuelltProjekt);
                  return (
                  <div
                    key={h.hantverkareId}
                    onClick={() => proj && setValdProjekt(proj)}
                    className="p-3 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {h.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-sm text-stone-900 truncate">{h.namn}</div>
                          <StatusBadge status={h.status} size="sm" />
                        </div>
                        <div className="text-xs text-stone-500 truncate">{h.aktuelltProjekt}</div>
                        <div className="text-xs text-stone-700 mt-1 flex items-center gap-1">
                          <MapPin size={11} className="text-primary shrink-0" />
                          <span className="truncate">{h.aktuellAktivitet}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          sedan {h.sedan} · {h.senasteUppdatering}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Faktura-summering + Material-alarm */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Faktura-summering */}
          <div className="bg-card rounded-xl border border-stone-200 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-stone-900">Fakturor – översikt</h2>
              <Receipt size={18} className="text-stone-400" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <FakturaMini label="Utkast" antal={fakturaSummering.utkast.length} color="bg-stone-100 text-stone-700" />
              <FakturaMini label="Skickade" antal={fakturaSummering.skickad.length} color="bg-blue-50 text-blue-700" />
              <FakturaMini label="Betalda" antal={fakturaSummering.betald.length} color="bg-emerald-50 text-emerald-700" />
              <FakturaMini label="Förfallna" antal={fakturaSummering.forfallen.length} color="bg-red-50 text-red-700" />
            </div>
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-sm text-stone-600">Totalt att betala (skickade + förfallna)</span>
              <span className="text-lg font-bold text-stone-900">
                {totaltAttBetala.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
              </span>
            </div>
          </div>

          {/* Material-alarm */}
          <div id="material-alarm" className="bg-card rounded-xl border border-red-200 shadow-card overflow-hidden scroll-mt-20">
            <div className="px-5 py-4 border-b border-red-100 bg-red-50/40 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" />
              <h2 className="font-semibold text-stone-900">{lågtMaterial} artiklar under lagernivå</h2>
            </div>
            <div className="divide-y divide-stone-100">
              {materials.filter((m) => m.status === "lag").map((m) => (
                <div key={m.id} className="px-5 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <BranchIcon bransch={m.bransch} size="sm" showLabel={false} />
                    <div>
                      <div className="text-sm font-medium text-stone-900">{m.namn}</div>
                      <div className="text-xs text-stone-500">
                        {m.lager} {m.enhet} kvar (gräns: {m.lagernivå})
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toast(`Beställning skickad: ${m.namn} – leverans inom 2 arbetsdagar`, "success")}
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                  >
                    Beställ
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {valdProjekt && <ProjektDetaljModal projekt={valdProjekt} onClose={() => setValdProjekt(null)} läge="admin" />}
      {snabbForm === "nyttProjekt" && <NyttProjektFormulär onClose={() => setSnabbForm(null)} />}
      {snabbForm === "dagsrapport" && <DagsrapportFormulär onClose={() => setSnabbForm(null)} />}
    </div>
  );
}

function FakturaMini({ label, antal, color }) {
  return (
    <div className={`rounded-lg p-3 ${color}`}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1">{antal}</div>
    </div>
  );
}
