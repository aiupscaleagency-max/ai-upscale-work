// Sub-vyer som visas av Sidebar i Admin OCH Kommunportal
// Skicka in `läge` = "admin" | "kommun" för att styra vad som visas
import { useState } from "react";
import {
  Briefcase, BookOpen, FileBarChart, Receipt, Package, Users, MapPin,
  Camera, Cloud, AlertTriangle, Phone, Mail, Plus,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import BranchIcon from "./BranchIcon";
import RouteMap from "./RouteMap";
import { useToast } from "./Toast";
import { projects } from "../data/projects";
import { anstallda } from "../data/companies";
import { dagboksinlagg, rapporter } from "../data/diary";
import { invoices } from "../data/invoices";
import { materials, materialförbrukning } from "../data/materials";
import { dagensRutt, livePositioner } from "../data/routes";

// === PROJEKT-VYN ===
export function ProjektVy({ läge, onÖppna, onNyttProjekt }) {
  const lista = läge === "kommun"
    ? projects.filter((p) => p.kund.startsWith("Stockholms"))
    : projects;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">Alla projekt ({lista.length})</h2>
        {läge === "admin" && onNyttProjekt && (
          <button
            onClick={onNyttProjekt}
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-primary-dark"
          >
            <Plus size={16} /> Nytt projekt
          </button>
        )}
      </div>
      <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Projekt</th>
              <th className="text-left px-4 py-3 font-semibold">Bransch</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Firma</th>
              <th className="text-right px-4 py-3 font-semibold">Budget</th>
              <th className="text-right px-4 py-3 font-semibold">Fakturerat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {lista.map((p) => (
              <tr key={p.id} onClick={() => onÖppna(p)} className="hover:bg-emerald-50/50 cursor-pointer transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-900">{p.namn}</div>
                  <div className="text-xs text-stone-500">{p.plats.adress}</div>
                </td>
                <td className="px-4 py-3"><BranchIcon bransch={p.bransch} size="sm" /></td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-stone-700 hidden md:table-cell">{p.firma}</td>
                <td className="px-4 py-3 text-right font-medium text-stone-900 whitespace-nowrap">
                  {(p.budget / 1000).toLocaleString("sv-SE")} tkr
                </td>
                <td className="px-4 py-3 text-right text-stone-700 whitespace-nowrap">
                  {(p.fakturerat / 1000).toLocaleString("sv-SE")} tkr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === DAGBOK-VYN ===
export function DagbokVy({ läge, onNyDagbok }) {
  const lista = läge === "kommun"
    ? dagboksinlagg.filter((d) => {
        const proj = projects.find((p) => p.id === d.projektId);
        return proj && proj.kund.startsWith("Stockholms");
      })
    : dagboksinlagg;
  const sorterad = [...lista].sort((a, b) => `${b.datum} ${b.tid}`.localeCompare(`${a.datum} ${a.tid}`));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">Dagbok – alla inlägg ({sorterad.length})</h2>
        {läge === "admin" && onNyDagbok && (
          <button
            onClick={onNyDagbok}
            className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-primary-dark"
          >
            <Plus size={16} /> Snabb dagsrapport
          </button>
        )}
      </div>
      <div className="space-y-3">
        {sorterad.map((d) => {
          const proj = projects.find((p) => p.id === d.projektId);
          return (
            <div key={d.id} className="bg-card rounded-xl border border-stone-200 shadow-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold flex items-center justify-center">
                    {d.hantverkare.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">{d.hantverkare}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-2">
                      <span>{d.datum} kl {d.tid}</span><span>·</span>
                      <span className="flex items-center gap-1"><Cloud size={10} /> {d.väder}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {proj && <BranchIcon bransch={proj.bransch} size="sm" showLabel={false} />}
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">{d.timmar} tim</span>
                </div>
              </div>
              {proj && <div className="text-xs text-primary font-medium mb-1">{proj.namn}</div>}
              <h4 className="font-semibold text-stone-900 mb-1.5">{d.rubrik}</h4>
              <p className="text-sm text-stone-700 leading-relaxed">{d.text}</p>
              {d.bilder > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
                  <Camera size={12} /> {d.bilder} bifogade foton
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === RAPPORTER-VYN ===
export function RapporterVy({ läge }) {
  const toast = useToast();
  const lista = läge === "kommun"
    ? rapporter.filter((r) => {
        const proj = projects.find((p) => p.id === r.projektId);
        return proj && proj.kund.startsWith("Stockholms");
      })
    : rapporter;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-900">Rapporter ({lista.length})</h2>
      <div className="space-y-3">
        {lista.map((r) => {
          const proj = projects.find((p) => p.id === r.projektId);
          return (
            <div key={r.id} className="bg-card rounded-xl border border-stone-200 shadow-card p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileBarChart size={20} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-stone-900">{r.typ}</div>
                  {proj && <div className="text-xs text-stone-500 truncate">{proj.namn}</div>}
                  <div className="text-xs text-stone-400">Datum: {r.datum}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={r.status} />
                <button
                  onClick={() => toast(`Öppnar "${r.typ}" – fullständig rapport`, "info")}
                  className="text-xs text-primary font-semibold px-3 py-1.5 rounded hover:bg-primary/10"
                >
                  Visa →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === FAKTUROR-VYN (för Kommun – ser ALLA fakturor som ställts till kommunen) ===
export function FakturorVy() {
  const toast = useToast();
  const lista = invoices.filter((f) => f.kund.startsWith("Stockholms"));
  const total = lista.reduce((s, f) => {
    const netto = f.rader.reduce((ss, r) => ss + r.antal * r.aPris, 0);
    return s + netto * (1 + f.moms / 100);
  }, 0);
  const obetalt = lista.filter((f) => f.status === "skickad" || f.status === "forfallen").reduce((s, f) => {
    const netto = f.rader.reduce((ss, r) => ss + r.antal * r.aPris, 0);
    return s + netto * (1 + f.moms / 100);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">Fakturor till kommunen ({lista.length})</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl border border-stone-200 shadow-card p-4">
          <div className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Totalt fakturerat</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">{total.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</div>
        </div>
        <div className="bg-card rounded-xl border border-emerald-200 shadow-card p-4">
          <div className="text-xs uppercase text-stone-500 font-semibold tracking-wide">Att godkänna/betala</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{obetalt.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</div>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Faktura</th>
              <th className="text-left px-4 py-3 font-semibold">Projekt</th>
              <th className="text-left px-4 py-3 font-semibold">Datum</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Belopp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {lista.map((f) => {
              const netto = f.rader.reduce((s, r) => s + r.antal * r.aPris, 0);
              const tot = netto * (1 + f.moms / 100);
              return (
                <tr key={f.id} onClick={() => toast(`Öppnar ${f.id}`, "info")} className="hover:bg-emerald-50/50 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{f.id}</td>
                  <td className="px-4 py-3 text-stone-700">{f.projekt}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{f.datum}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                    {tot.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
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

// === MATERIAL-VYN ===
export function MaterialVy({ läge }) {
  const toast = useToast();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-900">Material – lager & förbrukning</h2>

      <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <div className="px-5 py-3 border-b border-stone-200 font-semibold text-stone-900">Lager ({materials.length} artiklar)</div>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-2.5 font-semibold">Material</th>
              <th className="text-left px-4 py-2.5 font-semibold">Bransch</th>
              <th className="text-right px-4 py-2.5 font-semibold">Lager</th>
              <th className="text-right px-4 py-2.5 font-semibold">À-pris</th>
              <th className="text-left px-4 py-2.5 font-semibold">Status</th>
              {läge === "admin" && <th className="px-4 py-2.5"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5 font-medium text-stone-900">{m.namn}</td>
                <td className="px-4 py-2.5"><BranchIcon bransch={m.bransch} size="sm" showLabel={false} /></td>
                <td className="px-4 py-2.5 text-right text-stone-700">{m.lager} {m.enhet}</td>
                <td className="px-4 py-2.5 text-right text-stone-700">{m.priser} kr</td>
                <td className="px-4 py-2.5"><StatusBadge status={m.status} size="sm" /></td>
                {läge === "admin" && (
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => toast(`Beställning skickad: ${m.namn}`, "success")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark"
                    >
                      Beställ
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <div className="px-5 py-3 border-b border-stone-200 font-semibold text-stone-900">Senaste förbrukning</div>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-2.5 font-semibold">Material</th>
              <th className="text-left px-4 py-2.5 font-semibold">Projekt</th>
              <th className="text-left px-4 py-2.5 font-semibold">Av</th>
              <th className="text-left px-4 py-2.5 font-semibold">Datum</th>
              <th className="text-right px-4 py-2.5 font-semibold">Antal</th>
              <th className="text-right px-4 py-2.5 font-semibold">Värde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {materialförbrukning.map((f, i) => {
              const m = materials.find((mm) => mm.id === f.materialId);
              const proj = projects.find((p) => p.id === f.projektId);
              if (!m) return null;
              return (
                <tr key={i} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5 font-medium text-stone-900">{m.namn}</td>
                  <td className="px-4 py-2.5 text-stone-700 text-xs">{proj?.namn || "-"}</td>
                  <td className="px-4 py-2.5 text-stone-600">{f.anvandare}</td>
                  <td className="px-4 py-2.5 text-stone-500 text-xs">{f.datum}</td>
                  <td className="px-4 py-2.5 text-right">{f.antal} {m.enhet}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{(m.priser * f.antal).toLocaleString("sv-SE")} kr</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === ANSTÄLLDA-VYN (visar timkostnader för admin, anonymiserat för kommun) ===
export function AnstalldaVy({ läge }) {
  const toast = useToast();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-900">
        {läge === "admin" ? "Anställda – timkostnader & status" : "Hantverkare i fält"}
      </h2>
      {läge === "admin" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
          <AlertTriangle size={14} />
          <span><strong>Admin-vy:</strong> visar både inköpskostnad (vad ni betalar) och utfakturerat pris (vad kund debiteras). Marginal beräknas automatiskt.</span>
        </div>
      )}
      <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Anställd</th>
              <th className="text-left px-4 py-3 font-semibold">Roll</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Kontakt</th>
              {läge === "admin" && <th className="text-right px-4 py-3 font-semibold">Inköp/tim</th>}
              <th className="text-right px-4 py-3 font-semibold">Debiterat/tim</th>
              {läge === "admin" && <th className="text-right px-4 py-3 font-semibold">Marginal</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {anstallda.map((a) => {
              const marginal = a.timkostnadKommun - a.timkostnadAdmin;
              const procent = (marginal / a.timkostnadKommun) * 100;
              return (
                <tr key={a.id} onClick={() => toast(`${a.namn} – ring ${a.telefon}`, "info")} className="hover:bg-emerald-50/50 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold flex items-center justify-center">
                        {a.avatar}
                      </div>
                      <div className="font-medium text-stone-900">{a.namn}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{a.roll}</td>
                  <td className="px-4 py-3 text-stone-500 text-xs hidden md:table-cell">
                    <div className="flex items-center gap-1"><Phone size={11} /> {a.telefon}</div>
                  </td>
                  {läge === "admin" && (
                    <td className="px-4 py-3 text-right text-stone-700 whitespace-nowrap">{a.timkostnadAdmin} kr</td>
                  )}
                  <td className="px-4 py-3 text-right font-semibold text-stone-900 whitespace-nowrap">{a.timkostnadKommun} kr</td>
                  {läge === "admin" && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="text-emerald-700 font-semibold">+{marginal} kr</span>
                      <span className="text-xs text-stone-400 ml-1">({procent.toFixed(0)}%)</span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === RUTTPLAN-VYN ===
export function RuttplanVy() {
  const aktiva = livePositioner;
  const stoppFörKarta = projects.filter((p) => p.status === "pagar").map((p, i) => ({
    id: p.id,
    ordning: i + 1,
    kund: p.firma,
    uppdrag: p.namn,
    adress: p.plats.adress,
    plats: p.plats,
    bransch: p.bransch,
    status: "kommande",
    prioritet: "normal",
    uppskattadTid: 60,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-stone-900">Ruttplan – alla pågående jobb</h2>
      <RouteMap stopp={stoppFörKarta} depot={dagensRutt.startposition} height={420} visaRutt={false} />
      <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-200 font-semibold text-stone-900">
          Live-positioner ({aktiva.length} hantverkare i fält)
        </div>
        <div className="divide-y divide-stone-100">
          {aktiva.map((h) => (
            <div key={h.hantverkareId} className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold flex items-center justify-center shrink-0">
                {h.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="font-semibold text-stone-900">{h.namn}</div>
                    <div className="text-xs text-stone-500">{h.firma}</div>
                  </div>
                  <StatusBadge status={h.status} size="sm" />
                </div>
                <div className="text-sm text-stone-700 mt-1.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" /> {h.aktuellAktivitet}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">{h.aktuelltProjekt}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">sedan {h.sedan} · {h.senasteUppdatering}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
