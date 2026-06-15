import { useState, useMemo } from "react";
import { Plus, Trash2, FileText, Eye, X, Send, Save, Download, Search, Printer } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/Toast";
import { invoices as initialInvoices } from "../data/invoices";

const enheter = ["st", "tim", "m", "m²", "m³", "kg", "l", "paket", "dag"];

// Faktura & Offert-vy
export default function FakturaVy() {
  const [tab, setTab] = useState("lista");
  const [valdFaktura, setValdFaktura] = useState(null);
  const [sök, setSök] = useState("");
  const [invoices, setInvoices] = useState(initialInvoices);

  const filtrerade = useMemo(() => {
    if (!sök) return invoices;
    const s = sök.toLowerCase();
    return invoices.filter((f) =>
      f.id.toLowerCase().includes(s) || f.kund.toLowerCase().includes(s) || f.projekt.toLowerCase().includes(s)
    );
  }, [sök, invoices]);

  return (
    <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-6 py-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Fakturor & Offerter</h1>
          <p className="text-stone-500 mt-1">Skapa, skicka och spåra fakturor med ROT/RUT-stöd</p>
        </div>
        <div className="flex bg-white rounded-xl border border-stone-200 p-1 shadow-card">
          <TabBtn active={tab === "lista"} onClick={() => setTab("lista")}>Fakturalista</TabBtn>
          <TabBtn active={tab === "ny"} onClick={() => setTab("ny")}>+ Skapa ny</TabBtn>
        </div>
      </div>

      {tab === "lista" ? (
        <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-200 flex items-center gap-3">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Sök på fakturanummer, kund eller projekt..."
              value={sök}
              onChange={(e) => setSök(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-xs uppercase text-stone-500 tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Faktura</th>
                  <th className="text-left px-4 py-3 font-semibold">Kund</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Projekt</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Datum</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Belopp</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtrerade.map((f) => {
                  const t = beräknaTotal(f);
                  return (
                    <tr key={f.id} onClick={() => setValdFaktura(f)} className="hover:bg-stone-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-bold text-primary">{f.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-900">{f.kund}</div>
                        <div className="text-xs text-stone-500 mt-0.5">Org.nr: {f.orgnr}</div>
                      </td>
                      <td className="px-4 py-3 text-stone-700 hidden md:table-cell">{f.projekt}</td>
                      <td className="px-4 py-3 text-stone-500 hidden lg:table-cell text-xs">{f.datum}</td>
                      <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                      <td className="px-4 py-3 text-right font-semibold text-stone-900 whitespace-nowrap">
                        {t.attBetala.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Eye size={16} className="text-stone-400 inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <NyFakturaForm
          onSparat={(ny) => { setInvoices((arr) => [ny, ...arr]); setTab("lista"); }}
          onSkickat={(ny) => { setInvoices((arr) => [ny, ...arr]); setTab("lista"); }}
        />
      )}

      {valdFaktura && (
        <FakturaDetalj
          faktura={valdFaktura}
          onClose={() => setValdFaktura(null)}
          onUppdatera={(ny) => {
            setInvoices((arr) => arr.map((f) => (f.id === ny.id ? ny : f)));
            setValdFaktura(ny);
          }}
        />
      )}
    </main>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active ? "bg-primary text-white shadow-sm" : "text-stone-600 hover:bg-stone-100"
      }`}
    >
      {children}
    </button>
  );
}

// Beräkna fakturatotaler
function beräknaTotal(faktura) {
  const netto = faktura.rader.reduce((s, r) => s + (Number(r.antal) || 0) * (Number(r.aPris) || 0), 0);
  const moms = netto * (faktura.moms / 100);
  const brutto = netto + moms;
  let avdrag = 0;
  if (faktura.rotRut === "rot") avdrag = netto * 0.3;
  if (faktura.rotRut === "rut") avdrag = netto * 0.5;
  // ROT/RUT räknas på arbetskostnad – för demo förenklat på netto
  const attBetala = brutto - avdrag;
  return { netto, moms, brutto, avdrag, attBetala };
}

function NyFakturaForm({ onSparat, onSkickat }) {
  const toast = useToast();
  const [faktura, setFaktura] = useState({
    kund: "",
    orgnr: "",
    adress: "",
    epost: "",
    projekt: "",
    moms: 25,
    rotRut: "ingen",
    rader: [{ beskrivning: "", antal: 1, enhet: "tim", aPris: 0 }],
  });
  const [pdfÖppen, setPdfÖppen] = useState(false);

  function byggFaktura(status) {
    const idag = new Date().toISOString().slice(0, 10);
    const nrLista = initialInvoices.map((i) => parseInt(i.id.replace(/\D/g, ""), 10)).filter(Boolean);
    const nyttNr = (Math.max(0, ...nrLista) + 1).toString().padStart(7, "0").slice(-4);
    return {
      ...faktura,
      id: `F-2026-${nyttNr}`,
      datum: idag,
      förfallodatum: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      status,
    };
  }

  function spara() {
    if (!faktura.kund) return toast("Fyll i kundens företagsnamn först", "warn");
    onSparat?.(byggFaktura("utkast"));
    toast(`Utkast sparat för ${faktura.kund}`, "success");
  }

  function skicka() {
    if (!faktura.kund || !faktura.epost) return toast("Fyll i kund + e-post innan du skickar", "warn");
    onSkickat?.(byggFaktura("skickad"));
    toast(`Faktura skickad till ${faktura.epost}`, "success");
  }

  const t = beräknaTotal(faktura);

  function uppdateraRad(i, fält, värde) {
    const rader = [...faktura.rader];
    rader[i] = { ...rader[i], [fält]: värde };
    setFaktura({ ...faktura, rader });
  }
  function läggTillRad() {
    setFaktura({ ...faktura, rader: [...faktura.rader, { beskrivning: "", antal: 1, enhet: "tim", aPris: 0 }] });
  }
  function taBortRad(i) {
    setFaktura({ ...faktura, rader: faktura.rader.filter((_, ix) => ix !== i) });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-2 space-y-4">
        {/* Kundinfo */}
        <Card title="Kunduppgifter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Företagsnamn" value={faktura.kund} onChange={(v) => setFaktura({ ...faktura, kund: v })} placeholder="Stockholms Kommun" />
            <Input label="Org.nr / Pers.nr" value={faktura.orgnr} onChange={(v) => setFaktura({ ...faktura, orgnr: v })} placeholder="556xxx-xxxx" />
            <Input label="Adress" value={faktura.adress} onChange={(v) => setFaktura({ ...faktura, adress: v })} placeholder="Hantverkargatan 3, Stockholm" />
            <Input label="E-post" value={faktura.epost} onChange={(v) => setFaktura({ ...faktura, epost: v })} placeholder="faktura@kund.se" />
            <div className="md:col-span-2">
              <Input label="Projekt" value={faktura.projekt} onChange={(v) => setFaktura({ ...faktura, projekt: v })} placeholder="t.ex. Elrenovering Skarpnäcks skola" />
            </div>
          </div>
        </Card>

        {/* Fakturarader */}
        <Card title="Fakturarader">
          <div className="space-y-2">
            {faktura.rader.map((r, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-stone-50/60 border border-stone-100">
                <div className="col-span-12 md:col-span-5">
                  <Input small label={i === 0 ? "Beskrivning" : null} value={r.beskrivning} onChange={(v) => uppdateraRad(i, "beskrivning", v)} placeholder="t.ex. Arbete elinstallation" />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <Input small label={i === 0 ? "Antal" : null} type="number" value={r.antal} onChange={(v) => uppdateraRad(i, "antal", v)} />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <Select small label={i === 0 ? "Enhet" : null} value={r.enhet} onChange={(v) => uppdateraRad(i, "enhet", v)}
                    options={enheter.map((e) => ({ v: e, l: e }))} />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input small label={i === 0 ? "À-pris" : null} type="number" value={r.aPris} onChange={(v) => uppdateraRad(i, "aPris", v)} />
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <button type="button" onClick={() => taBortRad(i)} className="w-9 h-9 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={läggTillRad} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
            <Plus size={16} /> Lägg till rad
          </button>
        </Card>

        {/* Moms + ROT/RUT */}
        <Card title="Moms & avdrag">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2 block">Moms</span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 6, 12, 25].map((m) => (
                  <button key={m} type="button" onClick={() => setFaktura({ ...faktura, moms: m })}
                    className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      faktura.moms === m ? "bg-primary text-white border-primary" : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}>{m}%</button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-2 block">ROT/RUT-avdrag</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "ingen", l: "Inget" },
                  { v: "rot", l: "ROT 30%" },
                  { v: "rut", l: "RUT 50%" },
                ].map((o) => (
                  <button key={o.v} type="button" onClick={() => setFaktura({ ...faktura, rotRut: o.v })}
                    className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      faktura.rotRut === o.v ? "bg-primary text-white border-primary" : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}>{o.l}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Summering – sticky sidebar */}
      <div className="lg:sticky lg:top-20 self-start space-y-3">
        <Card title="Summering">
          <Row label="Netto" värde={t.netto} />
          <Row label={`Moms (${faktura.moms}%)`} värde={t.moms} muted />
          <Row label="Brutto" värde={t.brutto} bold />
          {faktura.rotRut !== "ingen" && (
            <Row label={faktura.rotRut === "rot" ? "ROT-avdrag (30%)" : "RUT-avdrag (50%)"} värde={-t.avdrag} green />
          )}
          <div className="border-t-2 border-stone-200 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-stone-900">Att betala</span>
            <span className="text-2xl font-bold text-primary">{t.attBetala.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</span>
          </div>
        </Card>

        <div className="space-y-2">
          <button onClick={() => setPdfÖppen(true)} className="w-full bg-stone-900 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors">
            <Eye size={16} /> PDF-förhandsvisning
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={spara}
              className="bg-white border border-stone-300 text-stone-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
            >
              <Save size={16} /> Spara utkast
            </button>
            <button
              onClick={skicka}
              className="bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <Send size={16} /> Skicka
            </button>
          </div>
        </div>
      </div>

      {pdfÖppen && <PdfModal faktura={faktura} onClose={() => setPdfÖppen(false)} />}
    </div>
  );
}

function FakturaDetalj({ faktura, onClose, onUppdatera }) {
  const [pdf, setPdf] = useState(false);
  const toast = useToast();
  const t = beräknaTotal(faktura);

  function markeraBetald() {
    onUppdatera?.({ ...faktura, status: "betald" });
    toast(`${faktura.id} markerad som betald`, "success");
  }
  function skickaPåminnelse() {
    toast(`Påminnelse skickad till ${faktura.epost}`, "success");
  }
  function laddaNer() {
    toast(`PDF för ${faktura.id} laddas ner`, "success");
    setTimeout(() => window.print(), 300);
  }
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-mono text-sm font-bold text-primary">{faktura.id}</div>
              <h2 className="font-bold text-stone-900 text-lg">{faktura.kund}</h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={faktura.status} />
              <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-stone-100 flex items-center justify-center"><X size={18} /></button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              <Info label="Org.nr" v={faktura.orgnr} />
              <Info label="Datum" v={faktura.datum} />
              <Info label="Adress" v={faktura.adress} />
              <Info label="Förfallodatum" v={faktura.förfallodatum} />
              <Info label="E-post" v={faktura.epost} />
              <Info label="Projekt" v={faktura.projekt} />
            </div>

            <table className="w-full text-sm mb-5 border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold">Beskrivning</th>
                  <th className="text-right px-3 py-2 font-semibold">Antal</th>
                  <th className="text-right px-3 py-2 font-semibold">À-pris</th>
                  <th className="text-right px-3 py-2 font-semibold">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {faktura.rader.map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-stone-900">{r.beskrivning}</td>
                    <td className="px-3 py-2 text-right text-stone-700">{r.antal} {r.enhet}</td>
                    <td className="px-3 py-2 text-right text-stone-700">{r.aPris.toLocaleString("sv-SE")} kr</td>
                    <td className="px-3 py-2 text-right font-semibold text-stone-900">{(r.antal * r.aPris).toLocaleString("sv-SE")} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-1.5 max-w-xs ml-auto">
              <Row label="Netto" värde={t.netto} />
              <Row label={`Moms (${faktura.moms}%)`} värde={t.moms} muted />
              {faktura.rotRut !== "ingen" && <Row label={faktura.rotRut === "rot" ? "ROT-avdrag" : "RUT-avdrag"} värde={-t.avdrag} green />}
              <div className="border-t-2 border-stone-200 pt-2 mt-2 flex items-center justify-between">
                <span className="font-bold text-stone-900">Att betala</span>
                <span className="text-xl font-bold text-primary">{t.attBetala.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 flex-wrap">
            {faktura.status === "skickad" && (
              <button
                onClick={markeraBetald}
                className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors text-sm"
              >
                ✓ Markera betald
              </button>
            )}
            {faktura.status === "forfallen" && (
              <button
                onClick={skickaPåminnelse}
                className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors text-sm"
              >
                <Send size={14} /> Skicka påminnelse
              </button>
            )}
            <button onClick={() => setPdf(true)} className="bg-stone-900 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-stone-800 transition-colors text-sm">
              <Eye size={14} /> Visa PDF
            </button>
            <button onClick={laddaNer} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors text-sm">
              <Download size={14} /> Ladda ner
            </button>
          </div>
        </div>
      </div>
      {pdf && <PdfModal faktura={faktura} onClose={() => setPdf(false)} />}
    </>
  );
}

function PdfModal({ faktura, onClose }) {
  const t = beräknaTotal(faktura);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/70 backdrop-blur p-4" onClick={onClose}>
      <div className="bg-stone-100 rounded-xl max-w-3xl w-full max-h-[95vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-3 bg-stone-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium"><FileText size={16} /> PDF-förhandsvisning</div>
          <button onClick={onClose} className="w-8 h-8 rounded hover:bg-stone-700 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="overflow-y-auto max-h-[calc(95vh-50px)] p-6 md:p-10 bg-stone-100">
          {/* Faux PDF-papper */}
          <div className="bg-white shadow-2xl mx-auto max-w-[680px] aspect-[1/1.414] p-10">
            <div className="flex items-start justify-between mb-8 pb-6 border-b-4 border-primary">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary text-white font-bold flex items-center justify-center">B</div>
                  <div>
                    <div className="font-bold text-xl text-stone-900">ByggFlow</div>
                    <div className="text-[10px] text-stone-500 -mt-1">by AI Upscale Agency</div>
                  </div>
                </div>
                <div className="text-xs text-stone-600 mt-3">
                  Lindqvist El AB · Org.nr 556812-3401<br />
                  Industrivägen 12 · 169 36 Solna<br />
                  faktura@lindqvistel.se · 08-123 45 67
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-stone-900">FAKTURA</div>
                <div className="text-sm font-mono font-semibold text-primary mt-1">{faktura.id || "F-2026-XXXX"}</div>
                <div className="text-xs text-stone-500 mt-2">Datum: {faktura.datum || new Date().toISOString().slice(0, 10)}</div>
                <div className="text-xs text-stone-500">Förfallodatum: {faktura.förfallodatum || "30 dagar"}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
              <div>
                <div className="text-stone-400 uppercase font-semibold tracking-wide mb-1">Faktureras till</div>
                <div className="text-stone-900 font-bold">{faktura.kund || "Kundnamn"}</div>
                <div className="text-stone-600">{faktura.orgnr}</div>
                <div className="text-stone-600">{faktura.adress}</div>
                <div className="text-stone-600">{faktura.epost}</div>
              </div>
              <div>
                <div className="text-stone-400 uppercase font-semibold tracking-wide mb-1">Projekt</div>
                <div className="text-stone-900 font-bold">{faktura.projekt || "—"}</div>
              </div>
            </div>

            <table className="w-full text-xs mb-6">
              <thead className="border-b-2 border-stone-300">
                <tr className="text-stone-600">
                  <th className="text-left py-2 font-semibold">Beskrivning</th>
                  <th className="text-right py-2 font-semibold">Antal</th>
                  <th className="text-right py-2 font-semibold">À-pris</th>
                  <th className="text-right py-2 font-semibold">Summa</th>
                </tr>
              </thead>
              <tbody>
                {faktura.rader.map((r, i) => (
                  <tr key={i} className="border-b border-stone-100">
                    <td className="py-2 text-stone-900">{r.beskrivning || "—"}</td>
                    <td className="py-2 text-right text-stone-700">{r.antal} {r.enhet}</td>
                    <td className="py-2 text-right text-stone-700">{Number(r.aPris).toLocaleString("sv-SE")} kr</td>
                    <td className="py-2 text-right font-semibold text-stone-900">{(r.antal * r.aPris).toLocaleString("sv-SE")} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto max-w-[260px] text-xs space-y-1.5">
              <div className="flex justify-between"><span className="text-stone-600">Netto</span><span>{t.netto.toLocaleString("sv-SE")} kr</span></div>
              <div className="flex justify-between"><span className="text-stone-600">Moms ({faktura.moms}%)</span><span>{t.moms.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</span></div>
              {faktura.rotRut !== "ingen" && (
                <div className="flex justify-between text-emerald-700"><span>{faktura.rotRut === "rot" ? "ROT-avdrag" : "RUT-avdrag"}</span><span>−{t.avdrag.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</span></div>
              )}
              <div className="flex justify-between border-t-2 border-stone-300 pt-2 font-bold text-base">
                <span className="text-stone-900">Att betala</span>
                <span className="text-primary">{t.attBetala.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr</span>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-stone-200 text-[10px] text-stone-400 text-center">
              Bankgiro: 5555-1234 · IBAN: SE45 5000 0000 0583 9825 7466 · Innehar F-skattsedel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-card rounded-xl border border-stone-200 shadow-card p-5">
      {title && <h3 className="font-semibold text-stone-900 mb-3">{title}</h3>}
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", small = false }) {
  return (
    <label className="block">
      {label && <span className={`${small ? "text-[10px]" : "text-xs"} font-semibold text-stone-700 uppercase tracking-wide mb-1.5 block`}>{label}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      />
    </label>
  );
}

function Select({ label, value, onChange, options, small = false }) {
  return (
    <label className="block">
      {label && <span className={`${small ? "text-[10px]" : "text-xs"} font-semibold text-stone-700 uppercase tracking-wide mb-1.5 block`}>{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
}

function Row({ label, värde, muted, bold, green }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`${muted ? "text-stone-500" : "text-stone-700"} ${bold ? "font-semibold" : ""}`}>{label}</span>
      <span className={`${green ? "text-emerald-600" : muted ? "text-stone-500" : "text-stone-900"} ${bold ? "font-bold" : "font-medium"}`}>
        {värde.toLocaleString("sv-SE", { maximumFractionDigits: 0 })} kr
      </span>
    </div>
  );
}

function Info({ label, v }) {
  return (
    <div>
      <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wide">{label}</div>
      <div className="text-stone-900 font-medium">{v}</div>
    </div>
  );
}
