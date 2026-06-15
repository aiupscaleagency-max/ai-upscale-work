import { useState, useEffect } from "react";
import {
  Navigation, Play, CheckCircle2, MapPin, Clock, Camera,
  BookOpen, Package, X, Plus, Minus, Cloud, Map as MapIcon,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import RouteMap from "../components/RouteMap";
import Directions from "../components/Directions";
import { useToast } from "../components/Toast";
import { useSpeechRecognition, ÖPPNA_DAGBOK_EVENT } from "../components/Chatbot";
import { Mic, MicOff } from "lucide-react";
import { dagensRutt } from "../data/routes";
import { projects } from "../data/projects";
import { materials } from "../data/materials";
import { openNavigation } from "../services/routing";

// Hantverkarvy – mobile-first, full GPS-spårning + dagbok + materiallogg
export default function HantverkarVy() {
  const toast = useToast();
  const [stopp, setStopp] = useState(dagensRutt.stopp);
  const [dagbokÖppen, setDagbokÖppen] = useState(false);
  const [dagbokRöstläge, setDagbokRöstläge] = useState(false);

  // Lyssna på event från chatten – öppna dagbok-modalen (ev med röstläge)
  useEffect(() => {
    function handler(e) {
      setDagbokRöstläge(!!e?.detail?.röstläge);
      setDagbokÖppen(true);
    }
    window.addEventListener(ÖPPNA_DAGBOK_EVENT, handler);
    return () => window.removeEventListener(ÖPPNA_DAGBOK_EVENT, handler);
  }, []);
  const [materialÖppen, setMaterialÖppen] = useState(false);
  const [visaKarta, setVisaKarta] = useState(true);
  const [visaDirections, setVisaDirections] = useState(false);
  const [pågåendeId, setPågåendeId] = useState(stopp.find((s) => s.status === "pagar")?.id);

  // Live-timer för pågående jobb
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    if (!pågåendeId) return;
    const i = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, [pågåendeId]);

  const klara = stopp.filter((s) => s.status === "klar").length;
  const aktuellt = stopp.find((s) => s.id === pågåendeId);
  // Nästa stopp efter det pågående (för vägbeskrivning)
  const nästaStopp = stopp.find((s) => s.status === "kommande");

  // Hjälpare: formatera tid mm:ss
  const fmtTimer = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  function startaJobb(id) {
    const s = stopp.find((x) => x.id === id);
    setStopp(stopp.map((s) =>
      s.id === id ? { ...s, status: "pagar", incheckad: nuTid() } : s
    ));
    setPågåendeId(id);
    setTimer(0);
    toast(`📍 Incheckad hos ${s.kund} – GPS-position skickad till admin`, "success");
  }

  function markeraKlar(id) {
    const s = stopp.find((x) => x.id === id);
    setStopp(stopp.map((s) =>
      s.id === id ? { ...s, status: "klar", utcheckad: nuTid() } : s
    ));
    if (pågåendeId === id) setPågåendeId(null);
    toast(`✓ ${s.kund} – jobbet markerat klart`, "success");
  }

  function nuTid() {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-32 pt-4 md:pt-6">
      {/* Header med hälsning */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-stone-500">God morgon</div>
          <h1 className="text-2xl font-bold text-stone-900">{dagensRutt.hantverkare}</h1>
          <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
            <Cloud size={12} /> Mulet, 8°C · {dagensRutt.datum}
          </div>
        </div>
        <button
          onClick={() => setVisaKarta(!visaKarta)}
          className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-stone-200 px-3 py-2 rounded-lg hover:bg-stone-50"
        >
          <MapIcon size={14} /> {visaKarta ? "Dölj karta" : "Visa karta"}
        </button>
      </div>

      {/* Karta över hela dagens rutt */}
      {visaKarta && (
        <div className="mb-4">
          <RouteMap
            stopp={stopp}
            depot={dagensRutt.startposition}
            livePosition={aktuellt ? { lat: aktuellt.plats.lat, lng: aktuellt.plats.lng, label: aktuellt.kund } : null}
            height={300}
          />
          <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
            <Legend färg="bg-stone-900" label="🏢 Kontor (start)" />
            <Legend färg="bg-primary" label="Pågår nu" puls />
            <Legend färg="bg-emerald-500" label="Klart" />
          </div>
        </div>
      )}

      {/* Progress + GPS-status */}
      <div className="bg-card rounded-xl border border-stone-200 shadow-card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-stone-900">Dagens framsteg</span>
          <span className="text-sm font-bold text-primary">{klara} av {stopp.length} klara</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
            style={{ width: `${(klara / stopp.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
            <span className="font-medium">GPS aktiv</span>
          </div>
          <span className="text-stone-500">Senaste position: för 12 sek sedan</span>
        </div>
      </div>

      {/* Aktuellt pågående jobb (höjs upp) */}
      {aktuellt && (
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-white/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" /> Pågår nu
            </span>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold tabular-nums">{fmtTimer(timer)}</div>
              <div className="text-xs opacity-80">Incheckad {aktuellt.incheckad}</div>
            </div>
          </div>
          <div className="font-bold text-lg">{aktuellt.uppdrag}</div>
          <div className="text-sm opacity-90 mt-1">{aktuellt.kund} · {aktuellt.projekt}</div>
          <div className="text-xs opacity-80 mt-2 flex items-center gap-1">
            <MapPin size={12} /> {aktuellt.adress}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => openNavigation(aktuellt.plats.lat, aktuellt.plats.lng, aktuellt.kund)}
              className="bg-white/15 backdrop-blur text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/25 transition-colors border border-white/20"
            >
              <Navigation size={16} /> Navigera
            </button>
            <button
              onClick={() => markeraKlar(aktuellt.id)}
              className="bg-white text-primary-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle2 size={16} /> Klar
            </button>
          </div>
        </div>
      )}

      {/* Vägbeskrivning till nästa stopp */}
      {nästaStopp && aktuellt && (
        <div className="mb-4">
          <button
            onClick={() => setVisaDirections(!visaDirections)}
            className="w-full bg-white border border-stone-200 px-4 py-3 rounded-xl flex items-center justify-between hover:bg-stone-50 transition-colors mb-2"
          >
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-primary" />
              <span className="text-sm font-semibold text-stone-900">
                Vägbeskrivning till nästa: {nästaStopp.kund}
              </span>
            </div>
            <span className="text-xs text-primary font-bold">{visaDirections ? "−" : "+"}</span>
          </button>
          {visaDirections && (
            <Directions
              from={aktuellt.plats}
              to={nästaStopp.plats}
              label={`${nästaStopp.kund} – ${nästaStopp.adress}`}
              kompakt
            />
          )}
        </div>
      )}

      {/* Lista med stopp */}
      <div className="space-y-3 mb-6">
        <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide px-1">Dagens ruttplan</h2>
        {stopp.map((s) => (
          <StoppKort
            key={s.id}
            stopp={s}
            isAktiv={s.id === pågåendeId}
            onStart={() => startaJobb(s.id)}
            onKlar={() => markeraKlar(s.id)}
          />
        ))}
      </div>

      {/* Sticky bottom-knappar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-3 shadow-lg z-30">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          <button
            onClick={() => setDagbokÖppen(true)}
            className="bg-stone-900 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
          >
            <BookOpen size={18} /> Dagbok
          </button>
          <button
            onClick={() => setMaterialÖppen(true)}
            className="bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <Package size={18} /> Material
          </button>
        </div>
      </div>

      {dagbokÖppen && <DagbokModal onClose={() => { setDagbokÖppen(false); setDagbokRöstläge(false); }} röstläge={dagbokRöstläge} />}
      {materialÖppen && <MaterialModal onClose={() => setMaterialÖppen(false)} />}
    </div>
  );
}

function StoppKort({ stopp, isAktiv, onStart, onKlar }) {
  const klar = stopp.status === "klar";
  return (
    <div className={`bg-card rounded-xl border p-4 transition-all ${
      isAktiv ? "border-primary shadow-card-hover" : klar ? "border-stone-200 opacity-60" : "border-stone-200 shadow-card hover:shadow-card-hover"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center shrink-0 ${
          klar ? "bg-emerald-100 text-emerald-700" : isAktiv ? "bg-primary text-white" : "bg-stone-100 text-stone-600"
        }`}>
          {klar ? "✓" : stopp.ordning}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-stone-900">{stopp.kund}</div>
            <StatusBadge status={stopp.prioritet} size="sm" />
          </div>
          <div className="text-sm text-stone-700 mt-0.5">{stopp.uppdrag}</div>
          <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1">
            <MapPin size={11} /> {stopp.adress}
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
            <span className="flex items-center gap-1"><Clock size={11} /> {stopp.uppskattadTid} min</span>
            {stopp.incheckad && <span>📍 In: {stopp.incheckad}</span>}
            {stopp.utcheckad && <span>🏁 Ut: {stopp.utcheckad}</span>}
          </div>

          {!klar && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openNavigation(stopp.plats.lat, stopp.plats.lng, stopp.kund)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-stone-100 text-stone-700 text-sm font-medium py-2.5 rounded-lg hover:bg-stone-200 transition-colors"
              >
                <Navigation size={14} /> Navigera
              </button>
              {!isAktiv ? (
                <button
                  onClick={onStart}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Play size={14} /> Starta
                </button>
              ) : (
                <button
                  onClick={onKlar}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle2 size={14} /> Klar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DagbokModal({ onClose, röstläge = false }) {
  const toast = useToast();
  const speech = useSpeechRecognition();
  const [form, setForm] = useState({
    projektId: projects[0].id,
    timmar: 1,
    väder: "Mulet, 8°C",
    rubrik: "",
    text: "",
  });
  const [foton, setFoton] = useState(0);
  const [sparat, setSparat] = useState(false);
  const [aktivtFält, setAktivtFält] = useState("text"); // text | rubrik

  // Synka transkriberad text till valt fält
  useEffect(() => {
    if (speech.text) setForm((f) => ({ ...f, [aktivtFält]: speech.text }));
  }, [speech.text]);

  // Auto-starta inspelning om röstläge triggrades från chatten
  useEffect(() => {
    if (röstläge && speech.stöds) {
      setTimeout(() => speech.start(), 300);
    }
  }, [röstläge]);

  function röstToggle(fält) {
    if (!speech.stöds) return toast("Talinmatning kräver Chrome eller Safari", "warn");
    setAktivtFält(fält);
    if (speech.lyssnar) speech.stopp();
    else { speech.nollställ(); speech.start(); }
  }

  function spara(e) {
    e.preventDefault();
    setSparat(true);
    setTimeout(onClose, 1200);
  }

  function läggTillFoto() {
    setFoton((n) => n + 1);
    toast("Foto bifogat – syns nu i Kommunportalen", "success", 2000);
  }

  return (
    <Modal onClose={onClose} title="Skriv dagbok">
      {sparat ? (
        <div className="text-center py-8">
          <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
          <div className="font-semibold text-stone-900">Dagboksinlägg sparat!</div>
          <div className="text-sm text-stone-500 mt-1">Beställaren kan nu se inlägget i sin portal</div>
        </div>
      ) : (
        <form onSubmit={spara} className="space-y-3">
          <Field label="Projekt">
            <select
              value={form.projektId}
              onChange={(e) => setForm({ ...form, projektId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.namn}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Timmar">
              <input type="number" min="0" step="0.5" value={form.timmar}
                onChange={(e) => setForm({ ...form, timmar: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </Field>
            <Field label="Väder">
              <input type="text" value={form.väder}
                onChange={(e) => setForm({ ...form, väder: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </Field>
          </div>
          <Field label="Rubrik">
            <div className="relative">
              <input type="text" placeholder="Kort sammanfattning..." value={form.rubrik}
                onChange={(e) => setForm({ ...form, rubrik: e.target.value })}
                className="w-full px-3 py-2.5 pr-12 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              <button type="button" onClick={() => röstToggle("rubrik")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  speech.lyssnar && aktivtFält === "rubrik"
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}>
                {speech.lyssnar && aktivtFält === "rubrik" ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            </div>
          </Field>
          <Field label="Anteckningar">
            <div className="relative">
              <button type="button" onClick={() => röstToggle("text")}
                className={`absolute right-2 top-2 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  speech.lyssnar && aktivtFält === "text"
                    ? "bg-red-500 text-white animate-pulse shadow-md"
                    : "bg-primary text-white hover:bg-primary-dark shadow-sm"
                }`}>
                {speech.lyssnar && aktivtFält === "text" ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              {speech.lyssnar && aktivtFält === "text" && (
                <div className="absolute top-12 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full live-dot">
                  ● SPELAR IN
                </div>
              )}
            <textarea rows="5" placeholder="Tryck mikrofonen och prata in det du gjort idag, eller skriv..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full px-3 py-2.5 pr-14 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
            </div>
          </Field>
          <button
            type="button"
            onClick={läggTillFoto}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-primary hover:text-primary transition-colors"
          >
            <Camera size={16} /> Lägg till foto {foton > 0 && <span className="text-primary font-bold">({foton})</span>}
          </button>
          <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors">
            Spara dagbok
          </button>
        </form>
      )}
    </Modal>
  );
}

function MaterialModal({ onClose }) {
  const toast = useToast();
  const [förbrukat, setFörbrukat] = useState({});

  function justera(id, delta) {
    setFörbrukat((f) => ({ ...f, [id]: Math.max(0, (f[id] || 0) + delta) }));
  }

  const totalt = Object.values(förbrukat).reduce((s, v) => s + v, 0);

  function logga() {
    if (totalt === 0) return toast("Inget material att logga ännu", "warn");
    toast(`${totalt} st material loggat – läggs på nästa faktura`, "success");
    onClose();
  }

  return (
    <Modal onClose={onClose} title="Förbrukat material">
      <div className="space-y-2 max-h-[60vh] overflow-y-auto -mx-1 px-1">
        {materials.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-stone-900 truncate">{m.namn}</div>
              <div className="text-xs text-stone-500">{m.priser} kr/{m.enhet} · {m.lager} {m.enhet} i lager</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => justera(m.id, -1)} className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600">
                <Minus size={14} />
              </button>
              <div className="w-10 text-center font-bold text-stone-900 tabular-nums">{förbrukat[m.id] || 0}</div>
              <button onClick={() => justera(m.id, 1)} className="w-8 h-8 rounded-lg bg-primary text-white hover:bg-primary-dark flex items-center justify-center">
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
        <span className="text-sm text-stone-600">Totalt förbrukat: <span className="font-bold text-stone-900">{totalt} st</span></span>
        <button onClick={logga} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors">
          Logga & stäng
        </button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-stone-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-bold text-stone-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function Legend({ färg, label, puls }) {
  return (
    <div className="flex items-center gap-1.5 text-stone-600">
      <span className={`w-2.5 h-2.5 rounded-full ${färg} ${puls ? "live-dot" : ""}`} />
      <span>{label}</span>
    </div>
  );
}
