// Kommun-specifika sub-vyer: Anbud, Faktura-granskning, Leverantörsbetyg
import { useState } from "react";
import {
  FileSearch, ClipboardCheck, Star, Plus, Check, X, Award, Filter,
  AlertTriangle, ChevronDown, MessageSquare, ThumbsUp, ThumbsDown,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import BranchIcon from "./BranchIcon";
import { useToast } from "./Toast";
import { anbudsforfragningar } from "../data/anbud";
import { leverantorsbetyg } from "../data/betyg";
import { fakturaGranskning } from "../data/granskning";
import { invoices } from "../data/invoices";

const fmt = (n) => n.toLocaleString("sv-SE", { maximumFractionDigits: 0 });

// === ANBUD-VYN ===
export function AnbudVy() {
  const toast = useToast();
  const [valt, setValt] = useState(null);
  const [filter, setFilter] = useState("alla");
  const lista = filter === "alla" ? anbudsforfragningar : anbudsforfragningar.filter((a) => a.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Anbudsförfrågningar</h2>
          <p className="text-xs text-stone-500 mt-0.5">{anbudsforfragningar.length} upphandlingar – publicera, jämför anbud, tilldela</p>
        </div>
        <button
          onClick={() => toast("Nytt upphandlingsformulär öppnat", "success")}
          className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:bg-primary-dark"
        >
          <Plus size={16} /> Ny upphandling
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {["alla", "utkast", "publicerad", "utvardering", "tilldelad", "avslutad"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === f ? "bg-primary text-white border-primary" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            {f === "alla" ? "Alla" : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {lista.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border border-stone-200 hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-4 cursor-pointer" onClick={() => setValt(valt === u.id ? null : u.id)}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <BranchIcon bransch={u.bransch} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-primary">{u.nr}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        u.status === "tilldelad" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        u.status === "utvardering" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        u.status === "publicerad" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-stone-100 text-stone-600 border-stone-200"
                      }`}>{u.status}</span>
                    </div>
                    <h3 className="font-bold text-stone-900 mt-0.5">{u.rubrik}</h3>
                    <p className="text-xs text-stone-500 mt-1">{u.beskrivning}</p>
                    <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-3 flex-wrap font-mono">
                      <span>📅 Publicerad: {u.publicerad}</span>
                      <span>⏰ Deadline: {u.deadline}</span>
                      <span>💰 Värde: {fmt(u.uppskattatVarde)} kr</span>
                      <span>📋 {u.tilldelningskriterier}</span>
                    </div>
                    {u.tilldeladTill && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <Award size={12} /> Tilldelad: {u.tilldeladTill}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-stone-900 font-mono tabular">{u.inkomnaAnbud.length}</div>
                  <div className="text-[11px] text-stone-500 uppercase font-semibold tracking-wide">anbud</div>
                  <ChevronDown size={16} className={`text-stone-400 mt-1 inline-block transition-transform ${valt === u.id ? "rotate-180" : ""}`} />
                </div>
              </div>
            </div>

            {valt === u.id && u.inkomnaAnbud.length > 0 && (
              <div className="border-t border-stone-200 bg-stone-50/40 p-4">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Inkomna anbud – jämförelse</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-[10px] uppercase text-stone-500 font-semibold">
                      <tr>
                        <th className="text-left px-3 py-2">Firma</th>
                        <th className="text-right px-3 py-2">Belopp</th>
                        <th className="text-left px-3 py-2 hidden md:table-cell">Tid</th>
                        <th className="text-left px-3 py-2 hidden md:table-cell">Garanti</th>
                        <th className="text-right px-3 py-2">Betyg</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {u.inkomnaAnbud.sort((a, b) => a.belopp - b.belopp).map((a, i) => {
                        const tilldelad = u.tilldeladTill === a.firma;
                        const lägst = i === 0;
                        return (
                          <tr key={i} className={`bg-white ${tilldelad ? "ring-2 ring-emerald-400" : ""}`}>
                            <td className="px-3 py-2 font-semibold text-stone-900">
                              {a.firma}
                              {a.kommentar && <div className="text-[10px] text-stone-500 font-normal mt-0.5">{a.kommentar}</div>}
                            </td>
                            <td className={`px-3 py-2 text-right font-mono tabular font-bold ${lägst ? "text-emerald-700" : "text-stone-900"}`}>
                              {fmt(a.belopp)} kr
                              {lägst && <div className="text-[9px] text-emerald-600 uppercase">Lägst</div>}
                            </td>
                            <td className="px-3 py-2 text-stone-700 hidden md:table-cell">{a.tid}</td>
                            <td className="px-3 py-2 text-stone-700 hidden md:table-cell">{a.garantier}</td>
                            <td className="px-3 py-2 text-right">
                              <span className="inline-flex items-center gap-0.5 font-mono font-bold text-stone-900">
                                <Star size={11} className="text-amber-500" fill="currentColor" /> {a.betyg}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              {!tilldelad && u.status === "utvardering" && (
                                <button
                                  onClick={() => toast(`${a.firma} tilldelas upphandlingen`, "success")}
                                  className="text-[11px] bg-emerald-600 text-white font-semibold px-2.5 py-1 rounded hover:bg-emerald-700 flex items-center gap-1"
                                >
                                  <Check size={11} /> Tilldela
                                </button>
                              )}
                              {tilldelad && <span className="text-[10px] text-emerald-700 font-bold uppercase">✓ Tilldelad</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// === FAKTURA-GRANSKNING ===
export function FakturaGranskningVy() {
  const toast = useToast();
  const [filter, setFilter] = useState("alla");
  const data = filter === "alla" ? fakturaGranskning : fakturaGranskning.filter((g) => g.status === filter);

  function godkanna(g) { toast(`Faktura ${g.fakturaId} godkänd för betalning`, "success"); }
  function returnera(g) { toast(`Faktura ${g.fakturaId} returneras till entreprenören`, "warn"); }
  function kommentera(g) { toast(`Kommentar tillagd på ${g.fakturaId}`, "info"); }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Granska & godkänn fakturor</h2>
        <p className="text-xs text-stone-500 mt-0.5">Bocka av kontroller, kommentera, godkänn för betalning eller returnera</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Att granska" värde={fakturaGranskning.filter((g) => g.status === "ny" || g.status === "granskas").length} accent="amber" />
        <Stat label="Godkända" värde={fakturaGranskning.filter((g) => g.status === "godkand").length} accent="green" />
        <Stat label="Returnerade" värde={fakturaGranskning.filter((g) => g.status === "retur").length} accent="red" />
        <Stat label="Betalade" värde={fakturaGranskning.filter((g) => g.status === "betalad").length} accent="primary" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {["alla", "granskas", "godkand", "retur", "betalad"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === f ? "bg-primary text-white border-primary" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            {f === "alla" ? "Alla" : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {data.map((g) => {
          const inv = invoices.find((i) => i.id === g.fakturaId);
          if (!inv) return null;
          const netto = inv.rader.reduce((s, r) => s + r.antal * r.aPris, 0);
          const tot = netto * (1 + inv.moms / 100);
          return (
            <div key={g.fakturaId} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-primary">{g.fakturaId}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        g.status === "godkand" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        g.status === "betalad" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        g.status === "retur" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>{g.status === "granskas" ? "Granskas" : g.status === "godkand" ? "Godkänd" : g.status === "retur" ? "Returnerad" : "Betalad"}</span>
                    </div>
                    <h4 className="font-bold text-stone-900">{inv.projekt}</h4>
                    <p className="text-xs text-stone-500">{inv.kund}</p>
                    <div className="text-[11px] text-stone-400 mt-1 font-mono">
                      Inkommen: {g.inkommen} · Granskare: {g.granskareInitialer} · Deadline: {g.deadlineGranskning}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-stone-900 font-mono tabular">{fmt(tot)} kr</div>
                    <div className="text-[11px] text-stone-500 uppercase">inkl moms</div>
                  </div>
                </div>

                {/* Kontrollchecklista */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { key: "mängderOK", label: "Mängder OK" },
                    { key: "prisOK", label: "Pris enligt avtal" },
                    { key: "projektkonto", label: "Projektkonto rätt" },
                    { key: "attest", label: "Attest klar" },
                  ].map((k) => (
                    <div key={k.key} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${
                      g.kontroller[k.key]
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-stone-50 text-stone-500 border-stone-200"
                    }`}>
                      {g.kontroller[k.key] ? <Check size={12} /> : <X size={12} />}
                      <span className="font-medium">{k.label}</span>
                    </div>
                  ))}
                </div>

                {/* Kommentarer */}
                {g.kommentarer.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {g.kommentarer.map((k, i) => (
                      <div key={i} className="bg-stone-50 rounded-lg p-2.5 text-xs">
                        <div className="font-semibold text-stone-700 mb-0.5 flex items-center gap-1.5">
                          <MessageSquare size={11} /> {k.från}
                          <span className="text-[10px] text-stone-400 font-normal font-mono">{k.datum}</span>
                        </div>
                        <p className="text-stone-700">{k.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(g.status === "granskas" || g.status === "ny") && (
                <div className="border-t border-stone-200 bg-stone-50/60 px-4 py-2.5 flex items-center justify-end gap-2 flex-wrap">
                  <button onClick={() => kommentera(g)} className="text-xs bg-white border border-stone-300 text-stone-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-stone-100 flex items-center gap-1.5">
                    <MessageSquare size={12} /> Kommentera
                  </button>
                  <button onClick={() => returnera(g)} className="text-xs bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-700 flex items-center gap-1.5">
                    <ThumbsDown size={12} /> Returnera
                  </button>
                  <button onClick={() => godkanna(g)} className="text-xs bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 flex items-center gap-1.5">
                    <ThumbsUp size={12} /> Godkänn
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === LEVERANTÖRSBETYG ===
export function LeverantorsbetygVy() {
  const toast = useToast();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Leverantörsbetyg</h2>
        <p className="text-xs text-stone-500 mt-0.5">Sätt 1–5 stjärnor när projekt är klart. Visas vid nästa upphandling.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Bedömda firmor" värde={leverantorsbetyg.length} accent="primary" />
        <Stat label="Genomsnitt" värde={(leverantorsbetyg.reduce((s, b) => s + b.snittBetyg, 0) / leverantorsbetyg.length).toFixed(1)} suffix="/5" accent="green" />
        <Stat label="Rekommenderade" värde={leverantorsbetyg.filter((b) => b.rekommenderas).length} accent="green" />
        <Stat label="Ej rekommenderade" värde={leverantorsbetyg.filter((b) => !b.rekommenderas).length} accent="red" />
      </div>

      <div className="space-y-3">
        {leverantorsbetyg.sort((a, b) => b.snittBetyg - a.snittBetyg).map((b) => (
          <div key={b.firma} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <BranchIcon bransch={b.bransch} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900">{b.firma}</h3>
                    <div className="text-xs text-stone-500 mt-0.5">{b.antalProjekt} avslutade projekt</div>
                    <div className="flex items-center gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} className={s <= Math.round(b.snittBetyg) ? "text-amber-500" : "text-stone-200"} fill="currentColor" />
                      ))}
                      <span className="ml-1.5 text-lg font-bold text-stone-900 font-mono">{b.snittBetyg.toFixed(1)}</span>
                    </div>
                    {b.senasteKommentar && (
                      <p className="text-xs text-stone-600 mt-2 italic">"{b.senasteKommentar}"</p>
                    )}
                    <div className="text-[11px] text-stone-400 mt-1 font-mono">
                      Senast: {b.senaste.projekt} ({b.senaste.datum})
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {b.rekommenderas ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1.5 rounded-full">
                      <ThumbsUp size={11} /> Rekommenderas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-2.5 py-1.5 rounded-full">
                      <ThumbsDown size={11} /> Avråder
                    </span>
                  )}
                  <button
                    onClick={() => toast(`Granskar fullständigt betyg för ${b.firma}`, "info")}
                    className="block mt-2 text-xs text-primary font-semibold hover:text-primary-dark"
                  >
                    Sätt nytt betyg →
                  </button>
                </div>
              </div>

              {/* Kriterienedbrytning */}
              <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
                {b.omdomen.map((o, i) => (
                  <div key={i} className="bg-stone-50 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wide">{o.kriterium}</div>
                    <div className="text-lg font-bold text-stone-900 font-mono mt-0.5 flex items-center justify-center gap-1">
                      {o.betyg.toFixed(1)} <Star size={10} className="text-amber-500" fill="currentColor" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, värde, suffix, accent }) {
  const accents = {
    primary: "bg-emerald-50 border-emerald-200 text-emerald-800",
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div className={`rounded-xl border p-3 ${accents[accent] || "bg-white border-stone-200 text-stone-900"}`}>
      <div className="text-[10px] uppercase font-semibold tracking-wide opacity-70">{label}</div>
      <div className="text-xl font-bold mt-0.5 font-mono tabular">{värde}{suffix && <span className="text-sm opacity-60">{suffix}</span>}</div>
    </div>
  );
}
