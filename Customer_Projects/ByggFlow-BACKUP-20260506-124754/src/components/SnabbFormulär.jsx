import { useState, useEffect } from "react";
import { X, CheckCircle2, Camera, Mic, MicOff } from "lucide-react";
import { useToast } from "./Toast";
import { useSpeechRecognition } from "./Chatbot";
import { projects } from "../data/projects";
import { branschConfig } from "./BranchIcon";

// Modal-wrapper
function Modal({ children, onClose, title, bredd = "max-w-md" }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-stone-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-t-2xl md:rounded-2xl w-full ${bredd} max-h-[90vh] overflow-hidden shadow-2xl flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between shrink-0">
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

// === NYTT PROJEKT ===
export function NyttProjektFormulär({ onClose }) {
  const toast = useToast();
  const [sparat, setSparat] = useState(false);
  const [form, setForm] = useState({
    namn: "",
    kund: "",
    bransch: "el",
    firma: "",
    ansvarig: "",
    deadline: "",
    budget: "",
    adress: "",
  });

  function spara(e) {
    e.preventDefault();
    if (!form.namn || !form.kund || !form.budget) {
      return toast("Fyll i namn, kund och budget", "warn");
    }
    setSparat(true);
    toast(`Projekt "${form.namn}" skapat – kund och firma har notifierats`, "success", 4000);
    setTimeout(onClose, 1300);
  }

  return (
    <Modal onClose={onClose} title="Nytt projekt" bredd="max-w-lg">
      {sparat ? (
        <div className="text-center py-10">
          <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-3" />
          <div className="font-bold text-lg text-stone-900">Projekt skapat!</div>
          <div className="text-sm text-stone-500 mt-1">{form.namn}</div>
        </div>
      ) : (
        <form onSubmit={spara} className="space-y-3">
          <Field label="Projektnamn *">
            <input
              type="text"
              value={form.namn}
              onChange={(e) => setForm({ ...form, namn: e.target.value })}
              placeholder="t.ex. Elrenovering Skarpnäcks skola"
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kund *">
              <input
                type="text"
                value={form.kund}
                onChange={(e) => setForm({ ...form, kund: e.target.value })}
                placeholder="Stockholms Kommun..."
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
            <Field label="Bransch">
              <select
                value={form.bransch}
                onChange={(e) => setForm({ ...form, bransch: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
              >
                {Object.entries(branschConfig).map(([k, c]) => (
                  <option key={k} value={k}>{c.emoji} {c.namn}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Firma">
              <input
                type="text"
                value={form.firma}
                onChange={(e) => setForm({ ...form, firma: e.target.value })}
                placeholder="t.ex. Lindqvist El AB"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
            <Field label="Ansvarig">
              <input
                type="text"
                value={form.ansvarig}
                onChange={(e) => setForm({ ...form, ansvarig: e.target.value })}
                placeholder="Anders Lindqvist"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Deadline">
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
            <Field label="Budget (kr) *">
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="450000"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
          </div>
          <Field label="Adress">
            <input
              type="text"
              value={form.adress}
              onChange={(e) => setForm({ ...form, adress: e.target.value })}
              placeholder="Pilvägen 21, Skarpnäck"
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2"
          >
            Skapa projekt
          </button>
        </form>
      )}
    </Modal>
  );
}

// === SNABB DAGSRAPPORT ===
export function DagsrapportFormulär({ onClose }) {
  const toast = useToast();
  const speech = useSpeechRecognition();
  const [sparat, setSparat] = useState(false);
  const [form, setForm] = useState({
    projektId: projects[0].id,
    timmar: 8,
    väder: "Mulet, 8°C",
    rubrik: "",
    text: "",
  });
  const [foton, setFoton] = useState(0);

  useEffect(() => {
    if (speech.text) setForm((f) => ({ ...f, text: speech.text }));
  }, [speech.text]);

  function röstToggle() {
    if (!speech.stöds) return toast("Talinmatning kräver Chrome eller Safari", "warn");
    if (speech.lyssnar) speech.stopp();
    else { speech.nollställ(); speech.start(); }
  }

  function spara(e) {
    e.preventDefault();
    if (!form.rubrik) return toast("Fyll i en rubrik", "warn");
    setSparat(true);
    toast(`Dagsrapport sparad – syns nu i Kommunportalen + admin`, "success", 4000);
    setTimeout(onClose, 1300);
  }

  return (
    <Modal onClose={onClose} title="Snabb dagsrapport" bredd="max-w-lg">
      {sparat ? (
        <div className="text-center py-10">
          <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-3" />
          <div className="font-bold text-lg text-stone-900">Dagsrapport sparad!</div>
          <div className="text-sm text-stone-500 mt-1">Beställaren ser den direkt i sin portal</div>
        </div>
      ) : (
        <form onSubmit={spara} className="space-y-3">
          <Field label="Projekt">
            <select
              value={form.projektId}
              onChange={(e) => setForm({ ...form, projektId: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.namn}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Timmar">
              <input
                type="number"
                step="0.5"
                value={form.timmar}
                onChange={(e) => setForm({ ...form, timmar: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
            <Field label="Väder">
              <input
                type="text"
                value={form.väder}
                onChange={(e) => setForm({ ...form, väder: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </Field>
          </div>
          <Field label="Rubrik *">
            <input
              type="text"
              value={form.rubrik}
              onChange={(e) => setForm({ ...form, rubrik: e.target.value })}
              placeholder="Vad gjordes idag?"
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </Field>
          <Field label="Beskrivning">
            <div className="relative">
              <button type="button" onClick={röstToggle}
                className={`absolute right-2 top-2 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  speech.lyssnar
                    ? "bg-red-500 text-white animate-pulse shadow-md"
                    : "bg-primary text-white hover:bg-primary-dark shadow-sm"
                }`}>
                {speech.lyssnar ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              {speech.lyssnar && (
                <div className="absolute top-12 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full live-dot">
                  ● SPELAR IN
                </div>
              )}
              <textarea
                rows="5"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Tryck mikrofonen och prata in, eller skriv detaljer, avvikelser, material..."
                className="w-full px-3 py-2.5 pr-14 rounded-lg border border-stone-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
            </div>
          </Field>
          <button
            type="button"
            onClick={() => { setFoton((n) => n + 1); toast("Foto bifogat", "success", 1500); }}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-stone-300 rounded-lg text-stone-500 hover:border-primary hover:text-primary transition-colors"
          >
            <Camera size={16} /> Lägg till foto {foton > 0 && <span className="text-primary font-bold">({foton})</span>}
          </button>
          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Spara dagsrapport
          </button>
        </form>
      )}
    </Modal>
  );
}
