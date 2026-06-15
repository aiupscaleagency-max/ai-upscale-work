import { useState } from "react";
import {
  X, Receipt, BookOpen, Package, FileBarChart, MapPin, Calendar,
  HardHat, AlertCircle, ShieldCheck, Flag, FileText, Camera, Cloud,
  Zap, FileImage, Calculator, Download, Check, AlertTriangle, Plus, Minus,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import BranchIcon from "./BranchIcon";
import ProjektLivePanel from "./ProjektLivePanel";
import { useToast } from "./Toast";
import { invoices } from "../data/invoices";
import { dagboksinlagg, rapporter } from "../data/diary";
import { materialförbrukning, materials } from "../data/materials";
import { anstallda } from "../data/companies";
import { ataFörProjekt, ataTyper, ataStatusLabels } from "../data/ata";
import { ritningarFörProjekt, amaFörProjekt, amaTotalsumma } from "../data/ritningar";

// Beräkna fakturasumma exkl ROT/RUT (förenklad)
function fakturaBelopp(f) {
  const netto = f.rader.reduce((s, r) => s + r.antal * r.aPris, 0);
  return netto * (1 + f.moms / 100);
}

// FULL TRANSPARENS – man ser exakt vad varje krona går till
// `läge` = "kommun" (default, döljer marginal) eller "admin" (visar inköp + marginal)
export default function ProjektDetaljModal({ projekt, onClose, läge = "kommun" }) {
  const [tab, setTab] = useState("kostnader");
  const toast = useToast();

  // Hämta all data kopplad till projektet
  const projFakturor = invoices.filter((f) => f.projekt === projekt.namn);
  const projDagbok = dagboksinlagg
    .filter((d) => d.projektId === projekt.id)
    .sort((a, b) => `${b.datum} ${b.tid}`.localeCompare(`${a.datum} ${a.tid}`));
  const projMaterial = materialförbrukning.filter((m) => m.projektId === projekt.id);
  const projRapporter = rapporter.filter((r) => r.projektId === projekt.id);
  const projAta = ataFörProjekt(projekt.id);
  const projRitningar = ritningarFörProjekt(projekt.id);
  const projAma = amaFörProjekt(projekt.id);

  // Kostnadssammanställning
  const arbetsTimmar = projFakturor.reduce(
    (s, f) => s + f.rader.filter((r) => r.enhet === "tim").reduce((ss, r) => ss + r.antal, 0),
    0
  );
  const arbetsKostnad = projFakturor.reduce(
    (s, f) => s + f.rader.filter((r) => r.enhet === "tim").reduce((ss, r) => ss + r.antal * r.aPris, 0),
    0
  );
  const materialKostnadFakt = projFakturor.reduce(
    (s, f) => s + f.rader.filter((r) => r.enhet !== "tim").reduce((ss, r) => ss + r.antal * r.aPris, 0),
    0
  );
  const materialFörbrukatKostnad = projMaterial.reduce((s, m) => {
    const mat = materials.find((mm) => mm.id === m.materialId);
    return s + (mat ? mat.priser * m.antal : 0);
  }, 0);
  const totFakturerat = projFakturor.reduce((s, f) => s + fakturaBelopp(f), 0);
  const kvar = projekt.budget - projekt.fakturerat;
  const procentAvBudget = (projekt.fakturerat / projekt.budget) * 100;

  // Hämta hantverkare kopplad till projektet för timkostnad
  const ansvarig = anstallda.find((a) => a.namn === projekt.ansvarig);
  const inköpKostnad = ansvarig ? arbetsTimmar * ansvarig.timkostnadAdmin : 0;
  const marginalKr = arbetsKostnad - inköpKostnad;
  const marginalProc = arbetsKostnad > 0 ? (marginalKr / arbetsKostnad) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 md:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <BranchIcon bransch={projekt.bransch} size="md" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-stone-900 truncate">{projekt.namn}</h2>
              <div className="text-sm text-stone-600 mt-0.5">🏢 {projekt.firma} · 👤 {projekt.ansvarig}</div>
              <div className="text-xs text-stone-500 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={11} /> {projekt.plats.adress}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> Start: {projekt.startdatum}</span>
                <span className="flex items-center gap-1"><Calendar size={11} /> Deadline: {projekt.deadline}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={projekt.status} />
            <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-stone-100 flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sammanfattning */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/60 to-stone-50/60 border-b border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
          <SammanfattRuta label="Budget" värde={`${(projekt.budget / 1000).toLocaleString("sv-SE")} tkr`} />
          <SammanfattRuta label="Fakturerat" värde={`${(projekt.fakturerat / 1000).toLocaleString("sv-SE")} tkr`} suffix={`${procentAvBudget.toFixed(0)}%`} />
          <SammanfattRuta label="Kvar i budget" värde={`${(kvar / 1000).toLocaleString("sv-SE")} tkr`} positiv={kvar > 0} />
          <SammanfattRuta label="Arbetstid" värde={`${arbetsTimmar} tim`} />
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-stone-200 flex gap-1 shrink-0 overflow-x-auto">
          <ModalTab active={tab === "kostnader"} onClick={() => setTab("kostnader")} icon={Receipt}>
            Kostnader & Fakturor ({projFakturor.length})
          </ModalTab>
          <ModalTab active={tab === "ata"} onClick={() => setTab("ata")} icon={Zap}>
            ÄTA ({projAta.length})
          </ModalTab>
          <ModalTab active={tab === "ritningar"} onClick={() => setTab("ritningar")} icon={FileImage}>
            Ritningar ({projRitningar.length})
          </ModalTab>
          <ModalTab active={tab === "ama"} onClick={() => setTab("ama")} icon={Calculator}>
            AMA & Mängder ({projAma.length})
          </ModalTab>
          <ModalTab active={tab === "dagbok"} onClick={() => setTab("dagbok")} icon={BookOpen}>
            Dagbok ({projDagbok.length})
          </ModalTab>
          <ModalTab active={tab === "material"} onClick={() => setTab("material")} icon={Package}>
            Material ({projMaterial.length})
          </ModalTab>
          <ModalTab active={tab === "rapporter"} onClick={() => setTab("rapporter")} icon={FileBarChart}>
            Rapporter ({projRapporter.length})
          </ModalTab>
        </div>

        {/* Tab-innehåll */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "kostnader" && (
            <>
              <ProjektLivePanel
                projekt={projekt}
                arbetsTimmar={arbetsTimmar}
                arbetsKostnad={arbetsKostnad}
                materialKostnad={materialKostnadFakt + materialFörbrukatKostnad}
                totFakturerat={totFakturerat}
                ansvarig={ansvarig}
                inköpKostnad={inköpKostnad}
                marginalKr={marginalKr}
                marginalProc={marginalProc}
                läge={läge}
              />
              <KostnaderTab
                fakturor={projFakturor}
                arbetsKostnad={arbetsKostnad}
                arbetsTimmar={arbetsTimmar}
                materialKostnad={materialKostnadFakt}
                totFakturerat={totFakturerat}
                materialFörbrukatKostnad={materialFörbrukatKostnad}
                ansvarig={ansvarig}
                inköpKostnad={inköpKostnad}
                marginalKr={marginalKr}
                marginalProc={marginalProc}
                läge={läge}
              />
            </>
          )}
          {tab === "ata" && <AtaTab poster={projAta} projekt={projekt} läge={läge} toast={toast} />}
          {tab === "ritningar" && <RitningarTab ritningar={projRitningar} toast={toast} />}
          {tab === "ama" && <AmaTab poster={projAma} totalSumma={amaTotalsumma(projekt.id)} läge={läge} toast={toast} />}
          {tab === "dagbok" && <DagbokTab inlägg={projDagbok} />}
          {tab === "material" && <MaterialTab förbrukning={projMaterial} />}
          {tab === "rapporter" && <RapporterTab rapporter={projRapporter} toast={toast} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            Full insyn – all data uppdateras i realtid från fältet
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast(`Avvikelse flaggad för "${projekt.namn}". Beställaren och projektledaren har notifierats.`, "warn", 4000)}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <Flag size={12} /> Flagga avvikelse
            </button>
            <button
              onClick={() => {
                toast("PDF-rapport genererad – nedladdning startad", "success");
                setTimeout(() => window.print(), 300);
              }}
              className="text-xs bg-primary text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-1.5"
            >
              <FileText size={12} /> Exportera rapport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalTab({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
        active ? "border-primary text-primary" : "border-transparent text-stone-500 hover:text-stone-700"
      }`}
    >
      <Icon size={14} /> {children}
    </button>
  );
}

function SammanfattRuta({ label, värde, suffix, positiv }) {
  return (
    <div>
      <div className="text-[11px] uppercase font-semibold text-stone-500 tracking-wide">{label}</div>
      <div className={`text-lg font-bold mt-0.5 ${positiv ? "text-emerald-700" : "text-stone-900"}`}>
        {värde}
      </div>
      {suffix && <div className="text-[11px] text-stone-500">{suffix} av budget</div>}
    </div>
  );
}

function KostnaderTab({ fakturor, arbetsKostnad, arbetsTimmar, materialKostnad, totFakturerat, materialFörbrukatKostnad, ansvarig, inköpKostnad, marginalKr, marginalProc, läge }) {
  const debiteratPerTim = arbetsTimmar > 0 ? Math.round(arbetsKostnad / arbetsTimmar) : (ansvarig?.timkostnadKommun || 0);
  return (
    <div className="space-y-5">
      {/* Timkostnad-block – uppdateras live per arbetstimme */}
      {ansvarig && (
        <div className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-xl p-5 border border-emerald-200">
          <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
            <HardHat size={16} className="text-primary" /> Timkostnad
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-stone-200">
              <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wide">Loggade timmar</div>
              <div className="text-xl font-bold text-stone-900 mt-0.5">{arbetsTimmar} tim</div>
              <div className="text-[11px] text-stone-500">enligt tidrapport från fältet</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-stone-200">
              <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wide">Debiterat per timme</div>
              <div className="text-xl font-bold text-primary mt-0.5">{debiteratPerTim} kr</div>
              <div className="text-[11px] text-stone-500">vad {läge === "kommun" ? "ni betalar" : "kunden debiteras"}</div>
            </div>
            {läge === "admin" && (
              <div className="bg-white rounded-lg p-3 border border-stone-200">
                <div className="text-[10px] uppercase font-semibold text-stone-500 tracking-wide">Inköp per timme</div>
                <div className="text-xl font-bold text-stone-700 mt-0.5">{ansvarig.timkostnadAdmin} kr</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Marginal: +{marginalKr.toLocaleString("sv-SE")} kr ({marginalProc.toFixed(0)}%)
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 text-[11px] text-stone-500 flex items-center gap-1.5">
            <AlertCircle size={11} /> Uppdateras automatiskt varje gång hantverkare loggar tid eller skickar dagsrapport.
          </div>
        </div>
      )}

      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
        <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Receipt size={16} className="text-primary" /> Vad du betalar för
        </h3>
        <div className="space-y-2">
          <KostnadsRad ikon={<HardHat size={14} />} label={`Arbete (${arbetsTimmar} tim × ${debiteratPerTim} kr)`} värde={arbetsKostnad}
            beskrivning="Hantverkartid – debiteras enligt tidrapport från fältet" />
          <KostnadsRad ikon={<Package size={14} />} label="Material (fakturerat)" värde={materialKostnad}
            beskrivning="Material som specificerats på fakturor" />
          {materialFörbrukatKostnad > 0 && (
            <KostnadsRad ikon={<AlertCircle size={14} />}
              label="Material (registrerat i fält, ej ännu fakturerat)" värde={materialFörbrukatKostnad}
              beskrivning="Sparat i appen av hantverkare – kommer på nästa faktura" info />
          )}
          <div className="pt-3 mt-3 border-t-2 border-stone-300 flex items-center justify-between">
            <span className="font-bold text-stone-900">Totalt fakturerat (inkl moms)</span>
            <span className="text-2xl font-bold text-primary">
              {totFakturerat.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
            </span>
          </div>
        </div>
      </div>

      {fakturor.length === 0 ? (
        <div className="text-center py-12 text-stone-400">
          <Receipt size={32} className="mx-auto mb-2 opacity-50" />
          Inga fakturor utställda ännu för detta projekt
        </div>
      ) : (
        <div>
          <h3 className="font-bold text-stone-900 mb-3">Alla fakturor ({fakturor.length})</h3>
          <div className="space-y-3">
            {fakturor.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-4 py-3 bg-stone-50/60 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary">{f.id}</span>
                    <span className="text-xs text-stone-500">{f.datum}</span>
                    <StatusBadge status={f.status} size="sm" />
                  </div>
                  <span className="font-bold text-stone-900">
                    {fakturaBelopp(f).toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
                  </span>
                </div>
                <table className="w-full text-xs">
                  <thead className="text-[10px] uppercase text-stone-400">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold">Beskrivning</th>
                      <th className="text-right px-4 py-2 font-semibold">Antal</th>
                      <th className="text-right px-4 py-2 font-semibold">À-pris</th>
                      <th className="text-right px-4 py-2 font-semibold">Summa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {f.rader.map((r, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-stone-700">{r.beskrivning}</td>
                        <td className="px-4 py-2 text-right text-stone-500">{r.antal} {r.enhet}</td>
                        <td className="px-4 py-2 text-right text-stone-500">{r.aPris.toLocaleString("sv-SE")} kr</td>
                        <td className="px-4 py-2 text-right font-semibold text-stone-900">
                          {(r.antal * r.aPris).toLocaleString("sv-SE")} kr
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KostnadsRad({ ikon, label, värde, beskrivning, info }) {
  return (
    <div className={`flex items-start justify-between gap-3 p-3 rounded-lg ${info ? "bg-emerald-50 border border-emerald-200" : "bg-white border border-stone-100"}`}>
      <div className="flex items-start gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${info ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>
          {ikon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-stone-900">{label}</div>
          <div className="text-xs text-stone-500 mt-0.5">{beskrivning}</div>
        </div>
      </div>
      <span className="font-bold text-stone-900 whitespace-nowrap">
        {värde.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
      </span>
    </div>
  );
}

function DagbokTab({ inlägg }) {
  if (inlägg.length === 0)
    return <div className="text-center py-12 text-stone-400">
      <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
      Inga dagboksinlägg ännu för detta projekt
    </div>;
  return (
    <div className="space-y-4">
      {inlägg.map((d) => (
        <div key={d.id} className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold flex items-center justify-center">
                {d.hantverkare.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-stone-900 text-sm">{d.hantverkare}</div>
                <div className="text-[11px] text-stone-500 flex items-center gap-2">
                  <span>{d.datum} kl {d.tid}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Cloud size={10} /> {d.väder}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-stone-500 whitespace-nowrap bg-stone-100 px-2 py-1 rounded">
              {d.timmar} tim
            </span>
          </div>
          <h4 className="font-semibold text-stone-900 mb-1.5">{d.rubrik}</h4>
          <p className="text-sm text-stone-700 leading-relaxed">{d.text}</p>
          {d.bilder > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
              <Camera size={12} /> {d.bilder} bifogade foton
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MaterialTab({ förbrukning }) {
  if (förbrukning.length === 0)
    return <div className="text-center py-12 text-stone-400">
      <Package size={32} className="mx-auto mb-2 opacity-50" />
      Inget material registrerat ännu
    </div>;
  const total = förbrukning.reduce((s, m) => {
    const mat = materials.find((mm) => mm.id === m.materialId);
    return s + (mat ? mat.priser * m.antal : 0);
  }, 0);
  return (
    <div>
      <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-stone-500 uppercase font-semibold tracking-wide">Material förbrukat på projektet</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{total.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</div>
        </div>
        <Package size={32} className="text-primary opacity-60" />
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-2.5 font-semibold">Material</th>
              <th className="text-left px-4 py-2.5 font-semibold">Av</th>
              <th className="text-left px-4 py-2.5 font-semibold">Datum</th>
              <th className="text-right px-4 py-2.5 font-semibold">Antal</th>
              <th className="text-right px-4 py-2.5 font-semibold">À-pris</th>
              <th className="text-right px-4 py-2.5 font-semibold">Summa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {förbrukning.map((m, i) => {
              const mat = materials.find((mm) => mm.id === m.materialId);
              if (!mat) return null;
              return (
                <tr key={i} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5"><div className="font-medium text-stone-900">{mat.namn}</div></td>
                  <td className="px-4 py-2.5 text-stone-600">{m.anvandare}</td>
                  <td className="px-4 py-2.5 text-stone-500 text-xs">{m.datum}</td>
                  <td className="px-4 py-2.5 text-right text-stone-700">{m.antal} {mat.enhet}</td>
                  <td className="px-4 py-2.5 text-right text-stone-500">{mat.priser} kr</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-stone-900">
                    {(mat.priser * m.antal).toLocaleString("sv-SE")} kr
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RapporterTab({ rapporter: lista, toast }) {
  if (lista.length === 0)
    return <div className="text-center py-12 text-stone-400">
      <FileBarChart size={32} className="mx-auto mb-2 opacity-50" />
      Inga rapporter inlämnade ännu
    </div>;
  return (
    <div className="space-y-3">
      {lista.map((r) => (
        <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileBarChart size={18} />
            </div>
            <div>
              <div className="font-semibold text-stone-900">{r.typ}</div>
              <div className="text-xs text-stone-500">Datum: {r.datum}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={r.status} />
            <button
              onClick={() => toast(`Öppnar "${r.typ}" – innehåller fullständig rapport från ${r.datum}`, "info")}
              className="text-xs text-primary font-semibold hover:text-primary-dark px-2 py-1 rounded hover:bg-primary/10"
            >
              Visa →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// === ÄTA-TAB – Ändringar/Tillägg/Avgående arbeten ===
function AtaTab({ poster, projekt, läge, toast }) {
  const [filter, setFilter] = useState("alla");
  const filtrerade = filter === "alla" ? poster : poster.filter((a) => a.status === filter);

  // Summor
  const summor = {
    godkand: poster.filter((a) => ["godkand", "utford", "fakturerad"].includes(a.status)).reduce((s, a) => s + a.belopp, 0),
    foreslagen: poster.filter((a) => a.status === "foreslagen").reduce((s, a) => s + a.belopp, 0),
    nettoOmAlltGodkanns: poster.filter((a) => a.status !== "nekad").reduce((s, a) => s + a.belopp, 0),
  };
  const fmt = (n) => n.toLocaleString("sv-SE", { maximumFractionDigits: 0 });

  if (poster.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <Zap size={32} className="mx-auto mb-2 opacity-50" />
        Inga ÄTA-poster registrerade ännu för detta projekt
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ÄTA-summering */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <SummeringsKort label="Ursprunglig budget" värde={`${fmt(projekt.budget)} kr`} />
        <SummeringsKort label="ÄTA godkänt" värde={`${summor.godkand >= 0 ? "+" : ""}${fmt(summor.godkand)} kr`} accent="green" />
        <SummeringsKort label="ÄTA väntar beslut" värde={`${fmt(summor.foreslagen)} kr`} accent="amber" />
        <SummeringsKort label="Ny totalsumma" värde={`${fmt(projekt.budget + summor.nettoOmAlltGodkanns)} kr`} accent="primary" stor />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Filter:</span>
        {["alla", "foreslagen", "godkand", "fakturerad", "nekad"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            {f === "alla" ? "Alla" : ataStatusLabels[f]}
            <span className="ml-1.5 opacity-70">({f === "alla" ? poster.length : poster.filter((a) => a.status === f).length})</span>
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtrerade.map((a) => {
          const typCfg = ataTyper[a.typ];
          return (
            <div key={a.id} className="bg-white rounded-xl border border-stone-200 hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center text-lg ${typCfg.färg}`}>
                      {typCfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-mono text-xs font-bold text-primary">{a.nr}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${typCfg.färg}`}>{typCfg.label}</span>
                        <StatusBadge status={a.status === "fakturerad" ? "betald" : a.status === "godkand" ? "godkänd" : a.status === "foreslagen" ? "öppen" : a.status === "nekad" ? "forfallen" : "skickad"} size="sm" />
                      </div>
                      <h4 className="font-bold text-stone-900">{a.rubrik}</h4>
                      <p className="text-xs text-stone-600 mt-1">{a.beskrivning}</p>
                      <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-3 flex-wrap font-mono">
                        <span>📅 {a.datum}</span>
                        <span>👤 {a.framstalld}</span>
                        {a.timmar !== 0 && <span>⏱ {a.timmar > 0 ? "+" : ""}{a.timmar} tim</span>}
                        {a.ama && <span>📋 AMA: {a.ama}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold font-mono tabular ${a.belopp >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                      {a.belopp >= 0 ? "+" : ""}{fmt(a.belopp)} kr
                    </div>
                    {läge === "kommun" && a.status === "foreslagen" && (
                      <div className="flex gap-1.5 mt-2 justify-end">
                        <button
                          onClick={() => toast(`Godkänt: ${a.rubrik} (+${fmt(a.belopp)} kr läggs till budget)`, "success")}
                          className="text-xs bg-emerald-600 text-white font-semibold px-3 py-1 rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <Check size={11} /> Godkänn
                        </button>
                        <button
                          onClick={() => toast(`Nekad: ${a.rubrik}`, "warn")}
                          className="text-xs bg-white border border-stone-300 text-stone-700 font-semibold px-3 py-1 rounded-lg hover:bg-stone-50 flex items-center gap-1"
                        >
                          <X size={11} /> Neka
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === RITNINGAR-TAB ===
function RitningarTab({ ritningar, toast }) {
  if (ritningar.length === 0)
    return <div className="text-center py-12 text-stone-400">
      <FileImage size={32} className="mx-auto mb-2 opacity-50" />
      Inga ritningar uppladdade ännu för detta projekt
    </div>;

  // Gruppera per typ
  const perTyp = {};
  ritningar.forEach((r) => {
    if (!perTyp[r.typ]) perTyp[r.typ] = [];
    perTyp[r.typ].push(r);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-stone-900">Projektets ritningar</h3>
          <p className="text-xs text-stone-500 mt-0.5">{ritningar.length} ritningar i {Object.keys(perTyp).length} discipliner</p>
        </div>
        <button
          onClick={() => toast("Begäran skickad – arkitekten meddelas", "success")}
          className="text-xs bg-stone-900 text-white font-semibold px-3 py-2 rounded-lg hover:bg-stone-800 flex items-center gap-1.5"
        >
          <Plus size={12} /> Begär ritning
        </button>
      </div>

      {Object.entries(perTyp).map(([typ, lista]) => (
        <div key={typ}>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">{typ} ({lista.length})</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lista.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="shrink-0 w-12 h-16 bg-gradient-to-br from-stone-100 to-stone-200 rounded-md border border-stone-300 flex items-center justify-center">
                  <FileImage size={20} className="text-stone-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-primary font-bold">{r.nr}</div>
                  <div className="font-semibold text-stone-900 text-sm truncate">{r.rubrik}</div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5 font-mono">
                    <span>Rev. {r.revision}</span>
                    <span>·</span>
                    <span>{r.datum}</span>
                    <span>·</span>
                    <span>{r.filstorlek}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => toast(`Öppnar ${r.nr} i PDF-visare`, "info")}
                    className="text-[11px] bg-primary text-white font-semibold px-2.5 py-1 rounded hover:bg-primary-dark"
                  >
                    Öppna
                  </button>
                  <button
                    onClick={() => toast(`Laddar ner ${r.nr}.pdf`, "success")}
                    className="text-[11px] bg-white border border-stone-300 text-stone-700 font-semibold px-2.5 py-1 rounded hover:bg-stone-50 flex items-center gap-1"
                  >
                    <Download size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// === AMA & MÄNGDER-TAB – beställaren kan räkna på posterna ===
function AmaTab({ poster, totalSumma, läge, toast }) {
  // Lokal state för "räkna om"-funktionen
  const [override, setOverride] = useState({});
  const fmt = (n) => n.toLocaleString("sv-SE", { maximumFractionDigits: 0 });

  if (poster.length === 0)
    return <div className="text-center py-12 text-stone-400">
      <Calculator size={32} className="mx-auto mb-2 opacity-50" />
      Inga AMA-mängder registrerade för detta projekt ännu
    </div>;

  function justera(ama, fält, värde) {
    setOverride((o) => ({ ...o, [`${ama}-${fält}`]: värde }));
  }

  function radSumma(p) {
    const m = override[`${p.ama}-mangd`] !== undefined ? Number(override[`${p.ama}-mangd`]) : p.mangd;
    const a = override[`${p.ama}-aPris`] !== undefined ? Number(override[`${p.ama}-aPris`]) : p.aPris;
    return m * a;
  }

  const räknadSumma = poster.reduce((s, p) => s + radSumma(p), 0);
  const diff = räknadSumma - totalSumma;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2 text-xs">
        <AlertCircle size={14} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-900">Mängdberäkning enligt AMA:</strong>{" "}
          <span className="text-blue-800">
            Du kan justera mängd och à-pris i tabellen för att räkna ditt eget anbud.
            Originalvärden enligt entreprenörens kalkyl. Diff visas live.
          </span>
        </div>
      </div>

      {/* Summeringar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummeringsKort label="Entreprenörens summa" värde={`${fmt(totalSumma)} kr`} />
        <SummeringsKort label="Din kalkyl (live)" värde={`${fmt(räknadSumma)} kr`} accent="primary" stor />
        <SummeringsKort
          label="Skillnad"
          värde={`${diff >= 0 ? "+" : ""}${fmt(diff)} kr`}
          accent={diff >= 0 ? "amber" : "green"}
        />
      </div>

      {/* AMA-tabell */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-3 py-2.5 font-semibold">AMA</th>
              <th className="text-left px-3 py-2.5 font-semibold">Beskrivning</th>
              <th className="text-left px-3 py-2.5 font-semibold hidden md:table-cell">Leverantör</th>
              <th className="text-right px-3 py-2.5 font-semibold">Mängd</th>
              <th className="text-left px-3 py-2.5 font-semibold">Enhet</th>
              <th className="text-right px-3 py-2.5 font-semibold">À-pris</th>
              <th className="text-right px-3 py-2.5 font-semibold">Summa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {poster.map((p, i) => {
              const m = override[`${p.ama}-mangd`] !== undefined ? Number(override[`${p.ama}-mangd`]) : p.mangd;
              const a = override[`${p.ama}-aPris`] !== undefined ? Number(override[`${p.ama}-aPris`]) : p.aPris;
              const summa = m * a;
              const ändrad = override[`${p.ama}-mangd`] !== undefined || override[`${p.ama}-aPris`] !== undefined;
              return (
                <tr key={i} className={`hover:bg-stone-50 ${ändrad ? "bg-emerald-50/40" : ""}`}>
                  <td className="px-3 py-2 font-mono text-xs text-primary font-bold whitespace-nowrap">{p.ama}</td>
                  <td className="px-3 py-2 text-stone-900 font-medium">{p.beskrivning}</td>
                  <td className="px-3 py-2 text-xs text-stone-500 hidden md:table-cell">{p.leverantor}</td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number"
                      defaultValue={p.mangd}
                      onChange={(e) => justera(p.ama, "mangd", e.target.value)}
                      className="w-20 text-right bg-transparent border border-transparent hover:border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded px-1 py-0.5 outline-none text-sm font-mono tabular"
                    />
                  </td>
                  <td className="px-3 py-2 text-stone-500 text-xs">{p.enhet}</td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number"
                      defaultValue={p.aPris}
                      onChange={(e) => justera(p.ama, "aPris", e.target.value)}
                      className="w-20 text-right bg-transparent border border-transparent hover:border-stone-200 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded px-1 py-0.5 outline-none text-sm font-mono tabular"
                    />
                    <span className="text-[10px] text-stone-400 ml-0.5">kr</span>
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-stone-900 whitespace-nowrap font-mono tabular">{fmt(summa)} kr</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-emerald-50/60 border-t-2 border-emerald-200">
            <tr>
              <td colSpan={6} className="px-3 py-3 text-right font-bold text-stone-900">Totalt enligt din kalkyl</td>
              <td className="px-3 py-3 text-right text-lg font-bold text-emerald-700 font-mono tabular">{fmt(räknadSumma)} kr</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end gap-2 flex-wrap">
        <button
          onClick={() => { setOverride({}); toast("Värden återställda", "info"); }}
          className="text-sm bg-white border border-stone-300 text-stone-700 font-semibold px-4 py-2 rounded-lg hover:bg-stone-50"
        >
          Återställ
        </button>
        <button
          onClick={() => toast(`Kalkyl exporterad till Excel (${fmt(räknadSumma)} kr)`, "success")}
          className="text-sm bg-stone-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-stone-800 flex items-center gap-1.5"
        >
          <Download size={14} /> Exportera Excel
        </button>
        {läge === "kommun" && (
          <button
            onClick={() => toast(`Kommentarer skickade till entreprenören`, "success")}
            className="text-sm bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Skicka kommentarer
          </button>
        )}
      </div>
    </div>
  );
}

function SummeringsKort({ label, värde, accent, stor }) {
  const accents = {
    primary: "bg-emerald-50 border-emerald-200 text-emerald-800",
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
  };
  const klass = accent ? accents[accent] : "bg-white border-stone-200 text-stone-900";
  return (
    <div className={`rounded-xl border p-3 ${klass}`}>
      <div className="text-[10px] uppercase font-semibold tracking-wide opacity-70">{label}</div>
      <div className={`font-bold mt-1 font-mono tabular ${stor ? "text-2xl" : "text-lg"}`}>{värde}</div>
    </div>
  );
}
