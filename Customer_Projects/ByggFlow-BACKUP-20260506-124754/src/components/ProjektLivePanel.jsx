import { useState, useEffect } from "react";
import { Activity, TrendingUp, Clock, Zap, Wallet, Hourglass } from "lucide-react";
import { ataFörProjekt, ataSumma } from "../data/ata";

const fmt = (n) => n.toLocaleString("sv-SE", { maximumFractionDigits: 0 });

// Live-aktivitetspanel för ETT projekt – visas högst upp i ProjektDetaljModal
export default function ProjektLivePanel({
  projekt, arbetsTimmar, arbetsKostnad, materialKostnad,
  totFakturerat, ansvarig, inköpKostnad, marginalKr, marginalProc, läge,
}) {
  const [tick, setTick] = useState(0);
  const [klocka, setKlocka] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => { setTick((t) => t + 1); setKlocka(new Date()); }, 2000);
    return () => clearInterval(i);
  }, []);

  const kvar = projekt.budget - projekt.fakturerat;
  const procentKlart = (projekt.fakturerat / projekt.budget) * 100;
  const dagarKvar = Math.max(0, Math.floor((new Date(projekt.deadline) - klocka) / 86400000));
  const dagarSedan = Math.floor((klocka - new Date(projekt.startdatum)) / 86400000);
  const liveTick = Math.abs(Math.sin(tick * 0.5) * 100).toFixed(0);

  // ÄTA – Ändringar/Tillägg/Avgående för projektet
  const ataLista = ataFörProjekt(projekt.id);
  const ataNetto = ataSumma(projekt.id);
  const ataAntalForeslagna = ataLista.filter((a) => a.status === "foreslagen").length;
  const totalProjektVarde = projekt.budget + ataNetto;

  return (
    <div className="digital-panel scan-line rounded-xl border border-emerald-500/20 overflow-hidden mb-5 shadow-xl">
      <div className="px-5 py-2.5 border-b border-emerald-500/15 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-300">PROJEKT LIVE</span>
          </div>
          <span className="text-[10px] text-emerald-100/60 font-mono tabular">
            {klocka.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-emerald-300/70 font-bold flex items-center gap-1.5">
          <Activity size={10} className="text-emerald-400" /> Senast uppdaterad: nu
        </div>
      </div>

      {/* Stora siffror för projektet */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-emerald-500/10">
        <Cell label="Total budget" värde={fmt(projekt.budget)} unit="kr" icon={Wallet} accent="primary" />
        <Cell
          label="Fakturerat hittills"
          värde={fmt(projekt.fakturerat)}
          unit="kr"
          icon={TrendingUp}
          accent="green"
          subline={`${procentKlart.toFixed(0)}% av budget`}
          puls
        />
        <Cell label="Kvar att fakturera" värde={fmt(kvar)} unit="kr" icon={Hourglass} accent="cyan"
          subline={`${dagarKvar} dagar till deadline`} />
        {läge === "admin" ? (
          <Cell label="Marginal" värde={fmt(marginalKr)} unit="kr" icon={Zap} accent="primary"
            trend={`+${marginalProc.toFixed(0)}% av fakturerat`} puls />
        ) : (
          <Cell label="Beräknat slutbelopp" värde={fmt(projekt.budget)} unit="kr" icon={Zap} accent="primary"
            subline={`enligt avtal`} />
        )}
      </div>

      {/* Sub-stripa: timmar, material, takt, ROI */}
      <div className="grid grid-cols-2 md:grid-cols-5 border-t border-emerald-500/15">
        <SubCell label="Loggade timmar" värde={fmt(arbetsTimmar)} suffix="tim" />
        <SubCell label="Arbetskostnad" värde={fmt(arbetsKostnad)} suffix="kr" puls />
        <SubCell label="Material totalt" värde={fmt(materialKostnad)} suffix="kr" />
        <SubCell label="Pågått" värde={dagarSedan} suffix="dagar" />
        <SubCell label="Live-puls" värde={liveTick} suffix="händelser/min" puls />
      </div>

      {/* ÄTA-rad – Ändringar/Tillägg/Avgående */}
      <div className="border-t border-emerald-500/15 bg-emerald-500/5 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-300">ÄTA</span>
          </div>
          <span className="text-[11px] text-emerald-100/70 font-mono">
            {ataLista.length} poster · netto: <span className={`font-bold tabular ${ataNetto >= 0 ? "text-emerald-300" : "text-red-300"}`}>{ataNetto >= 0 ? "+" : ""}{fmt(ataNetto)} kr</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-emerald-100/60">
            Ny totalsumma: <span className="text-emerald-200 font-bold tabular">{fmt(totalProjektVarde)} kr</span>
          </span>
          {ataAntalForeslagna > 0 && (
            <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              {ataAntalForeslagna} väntar beslut
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Cell({ label, värde, unit, icon: Icon, accent, subline, trend, puls }) {
  const acc = {
    primary: "text-emerald-300",
    green: "text-emerald-200",
    cyan: "text-cyan-300",
  };
  const ringColor = {
    primary: "bg-emerald-500/15 text-emerald-300",
    green: "bg-emerald-500/15 text-emerald-200",
    cyan: "bg-cyan-500/15 text-cyan-300",
  };
  return (
    <div className="bg-panel p-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-100/50">{label}</span>
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${ringColor[accent]}`}>
          <Icon size={12} />
        </div>
      </div>
      <div className={`flex items-baseline gap-1 font-mono ${acc[accent]} ${puls ? "flicker" : ""}`}>
        <span className={`text-2xl md:text-3xl font-bold tabular ${accent === "primary" || accent === "green" ? "neon-text" : ""}`}>{värde}</span>
        {unit && <span className="text-xs opacity-70 font-semibold">{unit}</span>}
      </div>
      {subline && <div className="text-[10px] text-emerald-100/40 mt-1 font-mono">{subline}</div>}
      {trend && <div className="text-[10px] text-emerald-300 mt-1 font-mono font-semibold">▲ {trend}</div>}
    </div>
  );
}

function SubCell({ label, värde, suffix, puls }) {
  return (
    <div className="bg-panel-light/50 px-4 py-2.5 border-r border-emerald-500/10 last:border-r-0">
      <div className="text-[9px] uppercase tracking-wider text-emerald-100/50 font-semibold">{label}</div>
      <div className={`flex items-baseline gap-1 font-mono ${puls ? "flicker" : ""}`}>
        <span className="text-base font-bold text-emerald-100 tabular">{värde}</span>
        <span className="text-[10px] text-emerald-100/50">{suffix}</span>
      </div>
    </div>
  );
}
