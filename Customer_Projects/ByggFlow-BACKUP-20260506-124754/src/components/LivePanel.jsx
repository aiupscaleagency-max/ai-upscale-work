import { useState, useEffect } from "react";
import {
  Activity, TrendingUp, Users, Clock, Zap, DollarSign,
  Wifi, ChevronUp, ChevronDown,
} from "lucide-react";
import { projects } from "../data/projects";
import { invoices } from "../data/invoices";
import { livePositioner } from "../data/routes";
import { dagboksinlagg } from "../data/diary";
import { anstallda } from "../data/companies";
import { ataTotalt } from "../data/ata";

// Hjälpare
const fmtKr = (n) => n.toLocaleString("sv-SE", { maximumFractionDigits: 0 });
const fmtMkr = (n) => `${(n / 1000000).toFixed(2)} M`;
function fakturaTotal(f) {
  const netto = f.rader.reduce((s, r) => s + r.antal * r.aPris, 0);
  return netto * (1 + f.moms / 100);
}

// Digital live-panel – visas överst i Dashboard
// `läge` = "admin" (visar marginal/inköp) eller "kommun" (döljer marginal)
export default function LivePanel({ läge = "admin" }) {
  const [tick, setTick] = useState(0);
  const [klocka, setKlocka] = useState(new Date());

  // Live-puls var 2:a sekund för "live"-känsla
  useEffect(() => {
    const i = setInterval(() => {
      setTick((t) => t + 1);
      setKlocka(new Date());
    }, 2000);
    return () => clearInterval(i);
  }, []);

  // Beräkna ALLA siffror live
  const aktiva = projects.filter((p) => p.status !== "klart");
  const totalPortfölj = aktiva.reduce((s, p) => s + p.budget, 0);
  const totalFakturerat = aktiva.reduce((s, p) => s + p.fakturerat, 0);
  const totalKvar = totalPortfölj - totalFakturerat;
  const månadsIntäkt = invoices
    .filter((f) => f.status === "betald" && f.datum.startsWith("2026-04"))
    .reduce((s, f) => s + fakturaTotal(f), 0);
  const obetalt = invoices
    .filter((f) => f.status === "skickad" || f.status === "forfallen")
    .reduce((s, f) => s + fakturaTotal(f), 0);

  // Inköpskostnad (admin only) – approximera 50% av fakturerat (lön + material)
  const inköpsKostnad = aktiva.reduce((s, p) => {
    const ans = anstallda.find((a) => a.namn === p.ansvarig);
    if (!ans) return s + p.fakturerat * 0.55;
    const ratio = ans.timkostnadAdmin / ans.timkostnadKommun;
    return s + p.fakturerat * ratio;
  }, 0);
  const marginal = totalFakturerat - inköpsKostnad;
  const marginalProc = totalFakturerat > 0 ? (marginal / totalFakturerat) * 100 : 0;

  // Live-aktivitet
  const aktivaIFält = livePositioner.length;
  const totalArbetstimmarIdag = aktivaIFält * 6.5; // simulerat snitt
  const dagsRapporter = dagboksinlagg.filter((d) => d.datum === "2026-04-26").length;

  // ÄTA – Ändringar/Tillägg/Avgående (filtrera på relevanta projekt om kommun)
  const ataData = ataTotalt(läge === "kommun" ? aktiva.filter((p) => p.kund.startsWith("Stockholms")) : null);

  // Simulerad realtids-tickers (upp/ner)
  const ticker = (Math.sin(tick * 0.7) * 1000).toFixed(0);
  const fakturaIdag = 187000 + Number(ticker);

  return (
    <div className="digital-panel scan-line rounded-2xl border border-emerald-500/20 overflow-hidden mb-6 shadow-2xl">
      {/* Header med live-status */}
      <div className="px-5 py-3 border-b border-emerald-500/15 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-emerald-300">LIVE</span>
          </div>
          <div className="text-xs text-emerald-100/60 font-mono tabular">
            {klocka.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[10px] text-emerald-300/60">
            <Wifi size={10} className="text-emerald-400" />
            <span className="font-mono">CONNECTED · {aktivaIFält} NODES</span>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-emerald-300/70 font-bold flex items-center gap-1.5">
          <Activity size={11} className="text-emerald-400" />
          AKTIVITETSPANEL
        </div>
      </div>

      {/* Stora siffror */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-emerald-500/10">
        <BigNumber
          label="Total projektportfölj"
          värde={fmtMkr(totalPortfölj)}
          unit="kr"
          icon={DollarSign}
          accent="primary"
          subline={`${aktiva.length} aktiva projekt`}
        />
        <BigNumber
          label="Fakturerat hittills"
          värde={fmtMkr(totalFakturerat)}
          unit="kr"
          icon={TrendingUp}
          accent="green"
          trend={`${((totalFakturerat / totalPortfölj) * 100).toFixed(0)}% av portföljen`}
        />
        <BigNumber
          label="Kvar att fakturera"
          värde={fmtMkr(totalKvar)}
          unit="kr"
          icon={Clock}
          accent="cyan"
          subline="enligt avtalad budget"
        />
        {läge === "admin" ? (
          <BigNumber
            label="Bruttomarginal (live)"
            värde={fmtMkr(marginal)}
            unit="kr"
            icon={Zap}
            accent="primary"
            trend={`+${marginalProc.toFixed(0)}% av fakturerat`}
            puls
          />
        ) : (
          <BigNumber
            label="Att godkänna"
            värde={fmtKr(obetalt)}
            unit="kr"
            icon={Zap}
            accent="amber"
            subline="väntar på betalning"
          />
        )}
      </div>

      {/* Sub-stripa: live-aktivitet */}
      <div className="grid grid-cols-2 md:grid-cols-5 border-t border-emerald-500/15">
        <SubMetric label="I fält just nu" värde={aktivaIFält} suffix="hantverkare" icon={Users} />
        <SubMetric label="Loggade timmar idag" värde={totalArbetstimmarIdag.toFixed(0)} suffix="tim" icon={Clock} />
        <SubMetric label="Dagsrapporter" värde={dagsRapporter} suffix="inskickade" icon={Activity} />
        <SubMetric
          label="Fakturerat idag"
          värde={fmtKr(fakturaIdag)}
          suffix="kr"
          icon={TrendingUp}
          puls
          trend={Number(ticker) >= 0}
        />
        <SubMetric
          label={`ÄTA godkänt (${ataData.antalGodkanda})`}
          värde={fmtMkr(ataData.summaGodkanda)}
          suffix="kr"
          icon={Zap}
          puls
        />
      </div>

      {/* ÄTA-rad om det finns föreslagna att hantera */}
      {ataData.antalForeslagna > 0 && (
        <div className="border-t border-amber-500/30 bg-amber-500/5 px-5 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 live-dot" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300">
              VÄNTAR PÅ BESLUT
            </span>
            <span className="text-xs text-amber-100/80 font-mono">
              {ataData.antalForeslagna} föreslagna ÄTA · {fmtKr(ataData.summaForeslagna)} kr i utestående beslut
            </span>
          </div>
          <span className="text-[10px] text-amber-100/60 font-mono">→ Granska i projektvyn</span>
        </div>
      )}
    </div>
  );
}

function BigNumber({ label, värde, unit, icon: Icon, accent = "primary", subline, trend, puls }) {
  const accents = {
    primary: "text-emerald-300",
    green: "text-emerald-200",
    cyan: "text-cyan-300",
    amber: "text-amber-300",
  };
  const ringColors = {
    primary: "bg-emerald-500/15 text-emerald-300",
    green: "bg-emerald-500/15 text-emerald-200",
    cyan: "bg-cyan-500/15 text-cyan-300",
    amber: "bg-amber-500/15 text-amber-300",
  };
  return (
    <div className="bg-panel p-5 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-emerald-100/50">{label}</span>
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${ringColors[accent]}`}>
          <Icon size={13} />
        </div>
      </div>
      <div className={`flex items-baseline gap-1.5 font-mono ${accents[accent]} ${puls ? "flicker" : ""}`}>
        <span className={`text-3xl md:text-4xl font-bold tabular ${accent === "primary" || accent === "green" ? "neon-text" : ""}`}>
          {värde}
        </span>
        {unit && <span className="text-sm opacity-70 font-semibold">{unit}</span>}
      </div>
      {subline && <div className="text-[11px] text-emerald-100/40 mt-1.5 font-mono">{subline}</div>}
      {trend && <div className="text-[11px] text-emerald-300 mt-1.5 font-mono font-semibold">▲ {trend}</div>}
    </div>
  );
}

function SubMetric({ label, värde, suffix, icon: Icon, puls, trend }) {
  return (
    <div className="bg-panel-light/50 px-5 py-3 flex items-center gap-3 border-r border-emerald-500/10 last:border-r-0">
      <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-300 flex items-center justify-center shrink-0">
        <Icon size={13} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-emerald-100/50 font-semibold">{label}</div>
        <div className={`flex items-baseline gap-1 font-mono ${puls ? "flicker" : ""}`}>
          <span className="text-lg font-bold text-emerald-100 tabular">{värde}</span>
          <span className="text-[11px] text-emerald-100/50">{suffix}</span>
          {trend !== undefined && (
            trend ? <ChevronUp size={11} className="text-emerald-400" /> : <ChevronDown size={11} className="text-red-400" />
          )}
        </div>
      </div>
    </div>
  );
}
