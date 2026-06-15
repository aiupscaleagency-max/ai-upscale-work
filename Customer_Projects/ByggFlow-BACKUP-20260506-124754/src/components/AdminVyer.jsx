// Admin-specifika sub-vyer: Koncern, Lönsamhet, HR-certifikat
import { useState } from "react";
import {
  Building, TrendingUp, TrendingDown, Award, AlertTriangle, ChevronDown,
  Shield, Calendar, BadgeCheck, BadgeAlert, BadgeX, Filter,
} from "lucide-react";
import { useToast } from "./Toast";
import { koncernstruktur } from "../data/koncern";
import { certifikat, certifikatStatus } from "../data/certifikat";
import { projects } from "../data/projects";
import { invoices } from "../data/invoices";
import { anstallda } from "../data/companies";

const fmt = (n) => n.toLocaleString("sv-SE", { maximumFractionDigits: 0 });
const fmtMkr = (n) => `${(n / 1000000).toFixed(1)}M`;

// === KONCERNSTRUKTUR ===
export function KoncernVy() {
  const toast = useToast();
  const [öppna, setÖppna] = useState({});
  const moder = koncernstruktur.moderbolag;
  const totalOms = koncernstruktur.dotterbolag.reduce((s, d) => s + d.omsattning, 0);
  const totalAnst = koncernstruktur.dotterbolag.reduce((s, d) => s + d.anstallda, 0);
  const totalProj = koncernstruktur.dotterbolag.reduce((s, d) => s + d.projekt, 0);
  const snittMarginal = (koncernstruktur.dotterbolag.reduce((s, d) => s + d.marginal, 0) / koncernstruktur.dotterbolag.length).toFixed(1);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Koncernstruktur</h2>
        <p className="text-xs text-stone-500 mt-0.5">Konsoliderad ekonomi: moderbolag → dotterbolag → avdelningar</p>
      </div>

      {/* Moderbolag-kort */}
      <div className="digital-panel rounded-xl border border-emerald-500/20 overflow-hidden p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-300 mb-1">MODERBOLAG</div>
            <h3 className="text-2xl font-bold text-emerald-100">{moder.namn}</h3>
            <div className="text-xs text-emerald-100/60 mt-1 font-mono">Org.nr: {moder.orgnr} · VD: {moder.vd}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold neon-text font-mono tabular">{fmtMkr(totalOms)} kr</div>
            <div className="text-[10px] text-emerald-100/60 uppercase tracking-wide font-semibold">Konsoliderad oms.</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-500/15">
          <KoncernStat label="Dotterbolag" värde={koncernstruktur.dotterbolag.length} />
          <KoncernStat label="Anställda totalt" värde={totalAnst} />
          <KoncernStat label="Aktiva projekt" värde={totalProj} />
          <KoncernStat label="Snittmarginal" värde={`${snittMarginal}%`} accent="green" />
        </div>
      </div>

      {/* Dotterbolag-rader */}
      <div className="space-y-2">
        {koncernstruktur.dotterbolag.sort((a, b) => b.omsattning - a.omsattning).map((d) => {
          const aktiv = öppna[d.id];
          return (
            <div key={d.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="p-4 cursor-pointer hover:bg-stone-50" onClick={() => setÖppna({ ...öppna, [d.id]: !aktiv })}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Building size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900">{d.namn}</div>
                      <div className="text-xs text-stone-500">{d.ort} · VD: {d.vd} · {d.anstallda} anst · {d.projekt} aktiva projekt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-right">
                      <div className="text-lg font-bold text-stone-900 font-mono tabular">{fmtMkr(d.omsattning)} kr</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 justify-end">
                        <span className="text-emerald-600 font-semibold">{d.trend}</span>
                        <span>· marginal {d.marginal}%</span>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`text-stone-400 transition-transform ${aktiv ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </div>
              {aktiv && (
                <div className="border-t border-stone-200 bg-stone-50/40 p-4">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Avdelningar</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {d.avdelningar.map((a, i) => (
                      <div key={i} className="bg-white rounded-lg border border-stone-200 p-3">
                        <div className="font-semibold text-stone-900 text-sm">{a.namn}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{a.anstallda} anställda</div>
                        <div className="text-base font-bold text-emerald-700 font-mono tabular mt-1">{fmtMkr(a.omsattning)} kr</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button onClick={() => toast(`Öppnar fullständig P&L för ${d.namn}`, "info")} className="text-xs bg-stone-900 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-stone-800">
                      Fullständig P&L →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// === LÖNSAMHET PER KUND/PROJEKT/ANSTÄLLD ===
export function LonsamhetVy() {
  const [vy, setVy] = useState("projekt");

  // Per projekt – sortera efter marginal
  const projektMarg = projects.map((p) => {
    const ans = anstallda.find((a) => a.namn === p.ansvarig);
    const ratio = ans ? ans.timkostnadAdmin / ans.timkostnadKommun : 0.55;
    const inköp = p.fakturerat * ratio;
    const marg = p.fakturerat - inköp;
    const margProc = p.fakturerat > 0 ? (marg / p.fakturerat) * 100 : 0;
    return { ...p, inköp, marg, margProc };
  }).sort((a, b) => b.marg - a.marg);

  // Per kund (gruppera projekt på kund)
  const kunder = {};
  projektMarg.forEach((p) => {
    if (!kunder[p.kund]) kunder[p.kund] = { kund: p.kund, fakturerat: 0, inköp: 0, projekt: 0 };
    kunder[p.kund].fakturerat += p.fakturerat;
    kunder[p.kund].inköp += p.inköp;
    kunder[p.kund].projekt += 1;
  });
  const kundLista = Object.values(kunder).map((k) => ({
    ...k, marg: k.fakturerat - k.inköp,
    margProc: k.fakturerat > 0 ? ((k.fakturerat - k.inköp) / k.fakturerat) * 100 : 0,
  })).sort((a, b) => b.marg - a.marg);

  // Per anställd
  const anställdaMarg = anstallda.map((a) => {
    const projektMedAns = projektMarg.filter((p) => p.ansvarig === a.namn);
    const totFakt = projektMedAns.reduce((s, p) => s + p.fakturerat, 0);
    const totMarg = projektMedAns.reduce((s, p) => s + p.marg, 0);
    return { ...a, antalProjekt: projektMedAns.length, totFakt, totMarg, margProc: totFakt > 0 ? (totMarg / totFakt) * 100 : 0 };
  }).sort((a, b) => b.totMarg - a.totMarg);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Lönsamhet</h2>
        <p className="text-xs text-stone-500 mt-0.5">Ranking per projekt, kund eller anställd – identifiera de bästa och de dåliga</p>
      </div>

      <div className="flex bg-white rounded-xl border border-stone-200 p-1 inline-flex">
        {[
          { id: "projekt", label: "Per projekt" },
          { id: "kund", label: "Per kund" },
          { id: "anstalld", label: "Per anställd" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setVy(v.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              vy === v.id ? "bg-primary text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">#</th>
              <th className="text-left px-4 py-3 font-semibold">{vy === "projekt" ? "Projekt" : vy === "kund" ? "Kund" : "Anställd"}</th>
              <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">{vy === "anstalld" ? "Projekt" : vy === "kund" ? "Antal" : "Status"}</th>
              <th className="text-right px-4 py-3 font-semibold">Fakturerat</th>
              <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">Inköp</th>
              <th className="text-right px-4 py-3 font-semibold">Marginal</th>
              <th className="text-right px-4 py-3 font-semibold">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {vy === "projekt" && projektMarg.map((p, i) => (
              <tr key={p.id} className="hover:bg-emerald-50/40">
                <td className="px-4 py-3 font-mono font-bold text-stone-400 tabular">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-900">{p.namn}</div>
                  <div className="text-xs text-stone-500">{p.firma}</div>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">{p.status}</td>
                <td className="px-4 py-3 text-right font-mono tabular">{fmt(p.fakturerat)}</td>
                <td className="px-4 py-3 text-right text-stone-500 hidden md:table-cell font-mono tabular">{fmt(p.inköp)}</td>
                <td className={`px-4 py-3 text-right font-bold font-mono tabular ${p.marg >= 0 ? "text-emerald-700" : "text-red-600"}`}>{fmt(p.marg)}</td>
                <td className={`px-4 py-3 text-right font-bold ${p.margProc >= 20 ? "text-emerald-700" : p.margProc >= 10 ? "text-amber-700" : "text-red-700"}`}>
                  {p.margProc.toFixed(0)}%
                </td>
              </tr>
            ))}
            {vy === "kund" && kundLista.map((k, i) => (
              <tr key={k.kund} className="hover:bg-emerald-50/40">
                <td className="px-4 py-3 font-mono font-bold text-stone-400 tabular">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-stone-900">{k.kund}</td>
                <td className="px-4 py-3 text-right hidden md:table-cell">{k.projekt} projekt</td>
                <td className="px-4 py-3 text-right font-mono tabular">{fmt(k.fakturerat)}</td>
                <td className="px-4 py-3 text-right text-stone-500 hidden md:table-cell font-mono tabular">{fmt(k.inköp)}</td>
                <td className={`px-4 py-3 text-right font-bold font-mono tabular ${k.marg >= 0 ? "text-emerald-700" : "text-red-600"}`}>{fmt(k.marg)}</td>
                <td className={`px-4 py-3 text-right font-bold ${k.margProc >= 20 ? "text-emerald-700" : k.margProc >= 10 ? "text-amber-700" : "text-red-700"}`}>
                  {k.margProc.toFixed(0)}%
                </td>
              </tr>
            ))}
            {vy === "anstalld" && anställdaMarg.map((a, i) => (
              <tr key={a.id} className="hover:bg-emerald-50/40">
                <td className="px-4 py-3 font-mono font-bold text-stone-400 tabular">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-[10px] font-bold flex items-center justify-center">
                      {a.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900">{a.namn}</div>
                      <div className="text-xs text-stone-500">{a.roll}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">{a.antalProjekt}</td>
                <td className="px-4 py-3 text-right font-mono tabular">{fmt(a.totFakt)}</td>
                <td className="px-4 py-3 text-right text-stone-500 hidden md:table-cell font-mono tabular">-</td>
                <td className={`px-4 py-3 text-right font-bold font-mono tabular ${a.totMarg >= 0 ? "text-emerald-700" : "text-red-600"}`}>{fmt(a.totMarg)}</td>
                <td className={`px-4 py-3 text-right font-bold ${a.margProc >= 20 ? "text-emerald-700" : a.margProc >= 10 ? "text-amber-700" : "text-red-700"}`}>
                  {a.margProc.toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === HR-CERTIFIKAT med utgångsvarning ===
export function CertifikatVy() {
  const toast = useToast();
  const [filter, setFilter] = useState("alla");

  const taggade = certifikat.map((c) => ({ ...c, status: certifikatStatus(c.utgar) }));
  const lista = filter === "alla" ? taggade : taggade.filter((c) => c.status.style === filter);

  const sammanf = {
    kritisk: taggade.filter((c) => c.status.style === "kritisk").length,
    varning: taggade.filter((c) => c.status.style === "varning").length,
    ok: taggade.filter((c) => c.status.style === "ok").length,
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-stone-900">HR & Certifikat</h2>
        <p className="text-xs text-stone-500 mt-0.5">ID06, heta arbeten, fallskydd – varning när de går ut</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <CertifikatStat label="Kritiskt – går ut snart" värde={sammanf.kritisk} icon={BadgeX} accent="red" />
        <CertifikatStat label="Varning – inom 60 dgr" värde={sammanf.varning} icon={BadgeAlert} accent="amber" />
        <CertifikatStat label="Giltiga" värde={sammanf.ok} icon={BadgeCheck} accent="green" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Filter:</span>
        {[
          { id: "alla", label: "Alla" },
          { id: "kritisk", label: `🔴 Kritiska (${sammanf.kritisk})` },
          { id: "varning", label: `🟡 Varningar (${sammanf.varning})` },
          { id: "ok", label: `🟢 Giltiga (${sammanf.ok})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === f.id ? "bg-primary text-white border-primary" : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Anställd</th>
              <th className="text-left px-4 py-3 font-semibold">Certifikat</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Utgivare</th>
              <th className="text-left px-4 py-3 font-semibold">Utgår</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {lista.sort((a, b) => (a.status.dagar ?? 9999) - (b.status.dagar ?? 9999)).map((c, i) => {
              const styleMap = {
                kritisk: "bg-red-50 text-red-700 border-red-200",
                varning: "bg-amber-50 text-amber-700 border-amber-200",
                ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
              };
              return (
                <tr key={i} className={`hover:bg-stone-50 ${c.status.style === "kritisk" ? "bg-red-50/30" : ""}`}>
                  <td className="px-4 py-3 font-medium text-stone-900">{c.namn}</td>
                  <td className="px-4 py-3 text-stone-700 font-medium">
                    <Shield size={12} className="inline mr-1.5 text-stone-400" />
                    {c.typ}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-500 hidden md:table-cell">{c.utgivare}</td>
                  <td className="px-4 py-3 text-stone-700 font-mono text-xs tabular">{c.utgar || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${styleMap[c.status.style]}`}>
                      {c.status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.status.style !== "ok" && (
                      <button
                        onClick={() => toast(`Påminnelse skickad till ${c.namn} om förnyelse av "${c.typ}"`, "success")}
                        className="text-[11px] bg-primary text-white font-semibold px-2.5 py-1 rounded hover:bg-primary-dark"
                      >
                        Skicka påminnelse
                      </button>
                    )}
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

function KoncernStat({ label, värde, accent }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-semibold text-emerald-100/50 tracking-wide">{label}</div>
      <div className={`text-xl font-bold mt-0.5 font-mono tabular ${accent === "green" ? "neon-text" : "text-emerald-100"}`}>{värde}</div>
    </div>
  );
}

function CertifikatStat({ label, värde, icon: Icon, accent }) {
  const styles = {
    red: { bg: "bg-red-50 border-red-200", iconBg: "bg-red-100 text-red-700", text: "text-red-800" },
    amber: { bg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100 text-amber-700", text: "text-amber-800" },
    green: { bg: "bg-emerald-50 border-emerald-200", iconBg: "bg-emerald-100 text-emerald-700", text: "text-emerald-800" },
  };
  const s = styles[accent];
  return (
    <div className={`rounded-xl border ${s.bg} p-4 flex items-center gap-3`}>
      <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center`}>
        <Icon size={22} />
      </div>
      <div>
        <div className={`text-[10px] uppercase font-semibold tracking-wide ${s.text} opacity-80`}>{label}</div>
        <div className={`text-2xl font-bold font-mono tabular ${s.text}`}>{värde}</div>
      </div>
    </div>
  );
}
