// ÄTA = Ändringar, Tilläggsarbeten, Avgående arbeten
// Branschstandard – tillkommer i princip alla byggprojekt
// Status: foreslagen | godkand | nekad | utford | fakturerad
export const ataPoster = [
  // Projekt 1 – Elrenovering Skarpnäcks skola
  { id: 1, projektId: 1, nr: "ÄTA-001", typ: "tillagg", rubrik: "Extra säkring belysningsgrupp källare", beskrivning: "Beställaren begär utökad belysning i källarförråd – 8 st extra LED-armaturer + ny grupp", belopp: 145000, timmar: 32, datum: "2026-03-12", status: "godkand", framstalld: "Anders Lindqvist", ama: "EBB.51 / SEC.2244" },
  { id: 2, projektId: 1, nr: "ÄTA-002", typ: "tillagg", rubrik: "Jordfelsbrytare alla våtrum", beskrivning: "Krav från elbesiktning – 30mA RCD i samtliga våtrum (12 st)", belopp: 89500, timmar: 24, datum: "2026-04-02", status: "fakturerad", framstalld: "Anders Lindqvist", ama: "SBJ.32" },
  { id: 3, projektId: 1, nr: "ÄTA-003", typ: "andring", rubrik: "Ändrad placering elcentral hus C", beskrivning: "Hyresgästen vill flytta elcentralen till annan vägg – kabelförlängning krävs", belopp: 64000, timmar: 18, datum: "2026-04-18", status: "godkand", framstalld: "Anders Lindqvist", ama: "EBB.4112" },
  { id: 4, projektId: 1, nr: "ÄTA-004", typ: "tillagg", rubrik: "Laddstolpar parkering 4st", beskrivning: "Beställaren begär 4 st 22kW laddstolpar enligt nya elbilskravet", belopp: 285000, timmar: 56, datum: "2026-04-22", status: "foreslagen", framstalld: "Anders Lindqvist", ama: "SED.213" },

  // Projekt 2 – Stamrenovering Kv. Björken
  { id: 5, projektId: 2, nr: "ÄTA-001", typ: "tillagg", rubrik: "Asbest påträffat våning 1", beskrivning: "Asbest i golvmattor – sanering krävs av certifierad firma", belopp: 480000, timmar: 0, datum: "2026-02-14", status: "fakturerad", framstalld: "Mikael Berglund", ama: "BBC.42 / Saneringsanvisning" },
  { id: 6, projektId: 2, nr: "ÄTA-002", typ: "tillagg", rubrik: "Komfortgolvvärme i 12 badrum", beskrivning: "Tillval från lägenhetsinnehavare – elgolvvärme inkl tilluftsdon", belopp: 312000, timmar: 96, datum: "2026-03-08", status: "godkand", framstalld: "Mikael Berglund", ama: "PJ.21" },
  { id: 7, projektId: 2, nr: "ÄTA-003", typ: "tillagg", rubrik: "FTX-aggregat trapphus B", beskrivning: "Beställaren utökar uppdraget med ventilationsbyte trapphus B (ej i ursprunglig handling)", belopp: 1850000, timmar: 320, datum: "2026-04-10", status: "godkand", framstalld: "Mikael Berglund", ama: "QGB.12" },
  { id: 8, projektId: 2, nr: "ÄTA-004", typ: "andring", rubrik: "Bytt leverantör WC-stol", beskrivning: "Gustavsberg ersätter IFÖ enligt beställarens önskemål – +890 kr/st", belopp: 80100, timmar: 0, datum: "2026-04-15", status: "godkand", framstalld: "Mikael Berglund", ama: "PNS.512" },
  { id: 9, projektId: 2, nr: "ÄTA-005", typ: "avgaende", rubrik: "Ej byte av handfat (behålles)", beskrivning: "Befintliga handfat behålls i 45 lgh – avgår från ursprungsbudget", belopp: -198000, timmar: -48, datum: "2026-04-20", status: "godkand", framstalld: "Mikael Berglund", ama: "PNS.521" },

  // Projekt 4 – Tillbyggnad Biblioteket
  { id: 10, projektId: 4, nr: "ÄTA-001", typ: "tillagg", rubrik: "Förstärkt grundläggning lera", beskrivning: "Geoteknisk undersökning visar lera ned till 8 m – pålning + förstärkt platta krävs", belopp: 2400000, timmar: 480, datum: "2026-02-05", status: "fakturerad", framstalld: "Johan Karlsson", ama: "CBC.21" },
  { id: 11, projektId: 4, nr: "ÄTA-002", typ: "tillagg", rubrik: "Solceller på tak (450 m²)", beskrivning: "Beställaren utökar med solcellsanläggning 96 kWp", belopp: 1850000, timmar: 320, datum: "2026-03-22", status: "godkand", framstalld: "Johan Karlsson", ama: "SED.6" },
  { id: 12, projektId: 4, nr: "ÄTA-003", typ: "tillagg", rubrik: "Kulturskydd – fasad i tegel istället för puts", beskrivning: "Stadsantikvarien kräver tegelfasad – tilläggskostnad material + arbetstid", belopp: 980000, timmar: 280, datum: "2026-04-12", status: "foreslagen", framstalld: "Johan Karlsson", ama: "ESE.111" },

  // Projekt 7 – Takrenovering Ålstens IP
  { id: 13, projektId: 7, nr: "ÄTA-001", typ: "tillagg", rubrik: "Råspont måste bytas (ruttet)", beskrivning: "Vid demontering visade sig 40% av råsponten vara rutten – byte krävs", belopp: 540000, timmar: 180, datum: "2026-03-05", status: "fakturerad", framstalld: "Lars Nordström", ama: "JTB.5" },
  { id: 14, projektId: 7, nr: "ÄTA-002", typ: "tillagg", rubrik: "Snörasskydd hela taket", beskrivning: "Beställaren beställer snörasskydd och takstegar enligt ny BBR", belopp: 168000, timmar: 64, datum: "2026-04-01", status: "godkand", framstalld: "Lars Nordström", ama: "PSC.211" },

  // Projekt 10 – Plåtarbeten Slussen
  { id: 15, projektId: 10, nr: "ÄTA-001", typ: "tillagg", rubrik: "Korrosionsskydd extra på undersida", beskrivning: "Pga miljökrav i hamnnära läge – extra dubbelgaranti zinkprimer", belopp: 220000, timmar: 80, datum: "2026-02-20", status: "godkand", framstalld: "Lars Nordström", ama: "BSF.34" },
  { id: 16, projektId: 10, nr: "ÄTA-002", typ: "tillagg", rubrik: "Hängrännor av koppar", beskrivning: "Stadsantikvarie kräver koppar istället för aluminium", belopp: 145000, timmar: 24, datum: "2026-03-15", status: "godkand", framstalld: "Lars Nordström", ama: "JTC.231" },

  // Projekt 12 – Ombyggnad Idrottshallen
  { id: 17, projektId: 12, nr: "ÄTA-001", typ: "tillagg", rubrik: "Akustikåtgärder enligt mätning", beskrivning: "Akustikmätning visar efterklangstid > krav – tilläggsabsorbenter krävs (480 m²)", belopp: 720000, timmar: 96, datum: "2026-04-05", status: "godkand", framstalld: "Johan Karlsson", ama: "QSE.12" },
  { id: 18, projektId: 12, nr: "ÄTA-002", typ: "tillagg", rubrik: "LED-belysning sportgolv (DALI)", beskrivning: "Uppgradering från fluorescerande till DALI-styrd LED – sänker driftkostnad", belopp: 485000, timmar: 120, datum: "2026-04-18", status: "godkand", framstalld: "Johan Karlsson", ama: "SED.5113" },
];

// ÄTA-typer för UI
export const ataTyper = {
  tillagg: { label: "Tillägg", färg: "bg-emerald-100 text-emerald-700 border-emerald-200", emoji: "➕" },
  andring: { label: "Ändring", färg: "bg-blue-100 text-blue-700 border-blue-200", emoji: "↔" },
  avgaende: { label: "Avgående", färg: "bg-stone-200 text-stone-700 border-stone-300", emoji: "➖" },
};

export const ataStatusLabels = {
  foreslagen: "Föreslagen",
  godkand: "Godkänd",
  nekad: "Nekad",
  utford: "Utförd",
  fakturerad: "Fakturerad",
};

// Hjälpare: hämta alla ÄTA för ett projekt
export function ataFörProjekt(projektId) {
  return ataPoster.filter((a) => a.projektId === projektId);
}

// Hjälpare: räkna total ÄTA-summa för ett projekt (ej nekade)
export function ataSumma(projektId) {
  return ataPoster
    .filter((a) => a.projektId === projektId && a.status !== "nekad" && a.status !== "foreslagen")
    .reduce((s, a) => s + a.belopp, 0);
}

// Hjälpare: räkna alla ÄTA totalt (för LivePanel)
export function ataTotalt(projekten = null) {
  const lista = projekten
    ? ataPoster.filter((a) => projekten.some((p) => p.id === a.projektId))
    : ataPoster;
  const godkanda = lista.filter((a) => ["godkand", "utford", "fakturerad"].includes(a.status));
  const foreslagna = lista.filter((a) => a.status === "foreslagen");
  return {
    antalGodkanda: godkanda.length,
    summaGodkanda: godkanda.reduce((s, a) => s + a.belopp, 0),
    antalForeslagna: foreslagna.length,
    summaForeslagna: foreslagna.reduce((s, a) => s + a.belopp, 0),
    totalt: lista.length,
  };
}
