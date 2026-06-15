import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, MicOff, Sparkles, BookOpen, FileText, Package, Users } from "lucide-react";
import { useToast } from "./Toast";

// Globalt event för att öppna dagbok-modal med förifylld text
export const ÖPPNA_DAGBOK_EVENT = "byggflow:öppna-dagbok";

// AI-agent svar – mockad men smart per fråga (regelbaserad)
const SNABB_FRÅGOR = [
  { ikon: BookOpen, text: "Skriv/prata in dagbok", action: "voice-dagbok" },
  { ikon: FileText, text: "Hur ligger jag till på budget?", action: "fråga", text2: "Hur ligger projekten till mot budget?" },
  { ikon: Package, text: "Vilket material måste beställas?", action: "fråga", text2: "Vilket material måste beställas?" },
  { ikon: Users, text: "Vem är på plats just nu?", action: "fråga", text2: "Vem är på plats just nu?" },
];

// Smart AI-svar (regelbaserad – simulerar agent)
function aiSvar(input) {
  const t = input.toLowerCase();
  if (t.includes("budget") || t.includes("ekonomi") || t.includes("kostnad")) {
    return {
      text: "📊 Här är läget på dina projekt:\n\n• Total portfölj: 279,35 M kr\n• Fakturerat hittills: 93,75 M kr (34%)\n• Bruttomarginal: 42,74 M kr (+46%)\n• 2 ÄTA väntar beslut hos beställare (1,265 Mkr)\n\n3 projekt är över 80% av budget – Stamrenovering Kv. Björken är 45% klart men har 11,2 M kr i godkända ÄTA.",
      länk: "/",
    };
  }
  if (t.includes("material") || t.includes("beställ") || t.includes("lager")) {
    return {
      text: "📦 4 artiklar under lagernivå:\n\n• Kopparrör 15mm: 80m kvar (gräns 100m)\n• Alcro Bestå Tak vit: 8 st\n• Plåtskruv 4.8x35: 45 ask\n• Gipsskiva 13mm: 25 st\n\nSka jag lägga beställning på alla 4? Total kostnad ~28 400 kr.",
      länk: "/",
    };
  }
  if (t.includes("fält") || t.includes("plats") || t.includes("vem") || t.includes("hantverkare")) {
    return {
      text: "👷 7 hantverkare i fält just nu:\n\n• Anders Lindqvist – Skarpnäcks skola (sedan 10:42)\n• Mikael Berglund – Kv. Björken (sedan 08:15)\n• Johan Karlsson – Biblioteket Täby (sedan 07:00)\n• Sara Dalström – Stadsbiblioteket\n• Per Persson – Södermalm 12 (besiktning)\n• Lars Nordström – Slussen etapp 3\n• Henrik Ekström – Kulturhuset (på väg)",
      länk: "/",
    };
  }
  if (t.includes("dagbok") || t.includes("rapport") || t.includes("dagsrapport")) {
    return {
      text: "📓 Vill du skriva en dagsrapport? Jag öppnar formuläret åt dig — tryck på mikrofonen och prata in det du gjort idag, så fyller jag i automatiskt.",
      action: "öppna-dagbok",
    };
  }
  if (t.includes("faktura") || t.includes("rot") || t.includes("rut")) {
    return {
      text: "🧾 Du har 9 öppna fakturor:\n\n• 1 förfallen: F-2026-0136 Restaurang Köket (7 310 kr)\n• 5 skickade: totalt 1,1 M kr\n• 3 utkast\n\nVill du att jag skickar betalningspåminnelse på den förfallna?",
      länk: "/faktura",
    };
  }
  if (t.includes("äta") || t.includes("ändring") || t.includes("tillägg")) {
    return {
      text: "⚡ ÄTA-läget:\n\n• 16 godkända: +9,35 M kr\n• 2 föreslagna väntar beslut: 1,265 M kr\n  - ÄTA-004 Laddstolpar Skarpnäcks skola (285 000 kr)\n  - ÄTA-003 Tegelfasad Biblioteket Täby (980 000 kr)\n\nFlagga → Visa ÄTA-fliken på respektive projekt.",
      länk: "/",
    };
  }
  if (t.includes("certifikat") || t.includes("id06") || t.includes("heta arbeten")) {
    return {
      text: "🛡️ 4 certifikat går ut snart:\n\n🔴 Kritiskt:\n• Johan Karlsson – Fallskydd höjdarbete (4 dgr)\n• Henrik Ekström – ID06 (8 dgr)\n• Mikael Berglund – Asbestsanering (14 dgr)\n• Anders Lindqvist – Heta arbeten (26 dgr)\n\nSka jag skicka påminnelser till alla 4?",
      länk: "/",
    };
  }
  if (t.includes("hej") || t.includes("hallå") || t.includes("tjena")) {
    return { text: "Hej Mike! 👋 Jag är ByggFlow AI-agenten. Vad kan jag hjälpa dig med? Du kan be mig:\n\n• Skriva dagbok genom att prata\n• Visa hur projekten ligger till\n• Lägga beställningar på material\n• Skicka påminnelser om certifikat\n• Sammanfatta dagens händelser" };
  }
  // Default
  return {
    text: `Jag förstår – "${input}". I full version kopplar jag till Claude-API och kan svara på allt om dina projekt. För demon kan du fråga om:\n\n• Budget & ekonomi\n• Material & lager\n• Hantverkare i fält\n• Dagbok & rapporter\n• Fakturor\n• ÄTA-poster\n• HR-certifikat`,
  };
}

// Web Speech API hook – för voice input
export function useSpeechRecognition() {
  const [lyssnar, setLyssnar] = useState(false);
  const [text, setText] = useState("");
  const [stöds, setStöds] = useState(true);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStöds(false); return; }
    const rec = new SR();
    rec.lang = "sv-SE";
    rec.continuous = true;
    rec.interimResults = true;
    let finalTextRef = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTextRef += t + " ";
        else interim += t;
      }
      setText(finalTextRef + interim);
    };
    rec.onend = () => setLyssnar(false);
    rec.onerror = () => setLyssnar(false);
    recRef.current = rec;
    return () => rec.stop();
  }, []);

  function start() { if (recRef.current) { setText(""); recRef.current.start(); setLyssnar(true); } }
  function stopp() { if (recRef.current) { recRef.current.stop(); setLyssnar(false); } }
  function nollställ() { setText(""); }

  return { lyssnar, text, stöds, start, stopp, nollställ, setText };
}

// Flytande chattbubbla – nedre högra hörnet
export default function Chatbot() {
  const toast = useToast();
  const [öppen, setÖppen] = useState(false);
  const [meddelanden, setMeddelanden] = useState([
    { från: "ai", text: "Hej Mike! 👋 Jag är ByggFlow AI-agent. Fråga mig om projekt, ekonomi, material, eller säg 'skriv dagbok' så hjälper jag dig.", tid: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [skriver, setSkriver] = useState(false);
  const scrollRef = useRef(null);
  const speech = useSpeechRecognition();

  // Synka transkriberad text till input-fältet
  useEffect(() => {
    if (speech.text) setInput(speech.text);
  }, [speech.text]);

  // Auto-scroll till senaste meddelandet
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [meddelanden, skriver]);

  async function skicka(text = input) {
    if (!text.trim()) return;
    const userMsg = { från: "user", text: text.trim(), tid: new Date() };
    setMeddelanden((m) => [...m, userMsg]);
    setInput("");
    speech.nollställ();
    setSkriver(true);

    // Simulera "AI tänker"
    await new Promise((r) => setTimeout(r, 700));
    const svar = aiSvar(text);
    setSkriver(false);
    setMeddelanden((m) => [...m, { från: "ai", text: svar.text, tid: new Date(), action: svar.action, länk: svar.länk }]);

    // Trigga öppna-dagbok-event om AI bestämde sig för det
    if (svar.action === "öppna-dagbok") {
      setTimeout(() => window.dispatchEvent(new CustomEvent(ÖPPNA_DAGBOK_EVENT)), 600);
    }
  }

  function snabbFråga(q) {
    if (q.action === "voice-dagbok") {
      window.dispatchEvent(new CustomEvent(ÖPPNA_DAGBOK_EVENT, { detail: { röstläge: true } }));
      setÖppen(false);
      toast("Öppnar dagboken med röstläge", "success");
    } else {
      skicka(q.text2);
    }
  }

  function röstToggle() {
    if (!speech.stöds) return toast("Talinmatning stöds ej i denna webbläsare. Använd Chrome eller Safari.", "warn");
    if (speech.lyssnar) speech.stopp();
    else speech.start();
  }

  return (
    <>
      {/* Flytande knapp */}
      {!öppen && (
        <button
          onClick={() => setÖppen(true)}
          className="fixed bottom-5 right-5 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-glow flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 live-dot border-2 border-white" />
          <span className="absolute right-full mr-3 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI-agent · prata med eller skriv
          </span>
        </button>
      )}

      {/* Chattfönstret */}
      {öppen && (
        <div className="fixed bottom-5 right-5 z-[90] w-[calc(100%-2.5rem)] sm:w-96 max-w-md flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden" style={{ height: "calc(100vh - 6rem)", maxHeight: "640px" }}>
          {/* Header */}
          <div className="digital-panel px-4 py-3 flex items-center justify-between border-b border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 live-dot border-2 border-panel" />
              </div>
              <div>
                <div className="font-bold text-emerald-100 text-sm">ByggFlow AI</div>
                <div className="text-[10px] text-emerald-300 font-mono uppercase tracking-wide">● Online · sv-SE</div>
              </div>
            </div>
            <button onClick={() => setÖppen(false)} className="w-8 h-8 rounded-lg hover:bg-emerald-500/20 text-emerald-100 flex items-center justify-center">
              <X size={16} />
            </button>
          </div>

          {/* Meddelanden */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/40">
            {meddelanden.map((m, i) => (
              <div key={i} className={`flex ${m.från === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.från === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-white border border-stone-200 text-stone-900 rounded-bl-sm shadow-sm"
                }`}>
                  <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                  {m.länk && (
                    <a href={m.länk} className="mt-2 inline-block text-xs text-primary font-semibold hover:underline">
                      → Öppna i appen
                    </a>
                  )}
                </div>
              </div>
            ))}
            {skriver && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Snabbfrågor – visas bara om bara välkomstmeddelandet är där */}
            {meddelanden.length === 1 && !skriver && (
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">Snabbåtgärder</div>
                {SNABB_FRÅGOR.map((q, i) => {
                  const Icon = q.ikon;
                  return (
                    <button
                      key={i}
                      onClick={() => snabbFråga(q)}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <Icon size={13} className="text-primary shrink-0" />
                      {q.text}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-stone-200 bg-white">
            {speech.lyssnar && (
              <div className="mb-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-red-500 live-dot" />
                <span className="font-semibold">Lyssnar...</span> säg vad du vill fråga eller dikitera
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                onClick={röstToggle}
                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  speech.lyssnar
                    ? "bg-red-500 text-white shadow-md animate-pulse"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
                title="Tala in"
              >
                {speech.lyssnar ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); skicka(); }
                }}
                placeholder="Skriv eller tryck mikrofonen…"
                rows="1"
                className="flex-1 resize-none px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none max-h-24"
              />
              <button
                onClick={() => skicka()}
                disabled={!input.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-[10px] text-stone-400 mt-1.5 text-center">
              {speech.stöds ? "🎙️ Tryck mikrofonen för att tala in på svenska" : "Talinmatning kräver Chrome eller Safari"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
