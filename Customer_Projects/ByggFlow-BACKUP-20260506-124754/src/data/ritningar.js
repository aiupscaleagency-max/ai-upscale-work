// Ritningar + AMA-koder + mängdberäkning per projekt
// AMA = Allmän Material- och Arbetsbeskrivning (svensk byggstandard)

export const ritningar = [
  // Projekt 1 – Skarpnäcks skola
  { id: 1, projektId: 1, nr: "E-40-1-001", typ: "El", rubrik: "Belysningsplan vån 1", revision: "C", datum: "2026-03-12", filstorlek: "2.4 MB" },
  { id: 2, projektId: 1, nr: "E-40-1-002", typ: "El", rubrik: "Kraftplan vån 1", revision: "B", datum: "2026-03-12", filstorlek: "1.8 MB" },
  { id: 3, projektId: 1, nr: "E-40-2-001", typ: "El", rubrik: "Belysningsplan vån 2", revision: "C", datum: "2026-03-12", filstorlek: "2.6 MB" },
  { id: 4, projektId: 1, nr: "E-50-001", typ: "El", rubrik: "Centralinstallation hus B", revision: "D", datum: "2026-04-05", filstorlek: "1.2 MB" },

  // Projekt 2 – Stamrenovering
  { id: 5, projektId: 2, nr: "V-10-001", typ: "VVS", rubrik: "Stamarrangemang badrum typ A", revision: "B", datum: "2026-01-15", filstorlek: "3.1 MB" },
  { id: 6, projektId: 2, nr: "V-20-001", typ: "VVS", rubrik: "Avloppsplan källare", revision: "A", datum: "2026-01-15", filstorlek: "2.8 MB" },
  { id: 7, projektId: 2, nr: "V-30-001", typ: "VVS", rubrik: "Tappvattensystem hela huset", revision: "C", datum: "2026-02-20", filstorlek: "4.2 MB" },

  // Projekt 4 – Tillbyggnad Biblioteket
  { id: 8, projektId: 4, nr: "A-10-001", typ: "Arkitekt", rubrik: "Plan källare", revision: "B", datum: "2026-01-05", filstorlek: "5.6 MB" },
  { id: 9, projektId: 4, nr: "A-10-002", typ: "Arkitekt", rubrik: "Plan vån 1", revision: "B", datum: "2026-01-05", filstorlek: "5.8 MB" },
  { id: 10, projektId: 4, nr: "A-10-003", typ: "Arkitekt", rubrik: "Plan vån 2", revision: "A", datum: "2026-01-05", filstorlek: "5.5 MB" },
  { id: 11, projektId: 4, nr: "A-30-001", typ: "Arkitekt", rubrik: "Fasadritning öst", revision: "C", datum: "2026-04-12", filstorlek: "7.2 MB" },
  { id: 12, projektId: 4, nr: "K-10-001", typ: "Konstruktion", rubrik: "Bjälklagsplan", revision: "B", datum: "2026-01-22", filstorlek: "4.8 MB" },
  { id: 13, projektId: 4, nr: "K-20-001", typ: "Konstruktion", rubrik: "Stomritning vägg öst", revision: "A", datum: "2026-02-15", filstorlek: "3.9 MB" },

  // Projekt 7 – Takrenovering
  { id: 14, projektId: 7, nr: "TAK-001", typ: "Tak", rubrik: "Takplan + lutningar", revision: "B", datum: "2026-02-10", filstorlek: "3.4 MB" },
  { id: 15, projektId: 7, nr: "TAK-002", typ: "Tak", rubrik: "Detaljer takfot + nock", revision: "A", datum: "2026-02-10", filstorlek: "1.9 MB" },

  // Projekt 12 – Idrottshallen
  { id: 16, projektId: 12, nr: "A-PLAN", typ: "Arkitekt", rubrik: "Helplan idrottshall", revision: "C", datum: "2026-03-01", filstorlek: "8.1 MB" },
  { id: 17, projektId: 12, nr: "A-AKUSTIK", typ: "Akustik", rubrik: "Akustikplan med absorbenter", revision: "A", datum: "2026-04-05", filstorlek: "2.3 MB" },
];

// AMA-mängdberäkning – kopplar AMA-kod till mängd + à-pris
// Detta är vad beställaren kan räkna på ("har vi rätt mängder & priser?")
export const amaMangder = [
  // Projekt 1 – El
  { projektId: 1, ama: "EBB.51", beskrivning: "LED-armatur infälld 30W", enhet: "st", mangd: 84, aPris: 1290, leverantor: "Glamox" },
  { projektId: 1, ama: "EBB.4112", beskrivning: "Kabel YKY 3x2.5", enhet: "m", mangd: 4800, aPris: 12, leverantor: "Nexans" },
  { projektId: 1, ama: "SBJ.32", beskrivning: "Jordfelsbrytare 30mA", enhet: "st", mangd: 12, aPris: 850, leverantor: "ABB" },
  { projektId: 1, ama: "SEC.2244", beskrivning: "Säkring automat 16A C", enhet: "st", mangd: 360, aPris: 18, leverantor: "Hager" },
  { projektId: 1, ama: "SED.213", beskrivning: "Laddstolpe 22kW", enhet: "st", mangd: 4, aPris: 28500, leverantor: "Easee" },

  // Projekt 2 – VVS
  { projektId: 2, ama: "PJ.21", beskrivning: "Kopparrör 15mm", enhet: "m", mangd: 1850, aPris: 45, leverantor: "Cupori" },
  { projektId: 2, ama: "PJ.22", beskrivning: "PEX-rör 16mm", enhet: "m", mangd: 2400, aPris: 22, leverantor: "Uponor" },
  { projektId: 2, ama: "PNS.512", beskrivning: "WC-stol Gustavsberg Estetic", enhet: "st", mangd: 90, aPris: 4290, leverantor: "Gustavsberg" },
  { projektId: 2, ama: "PNS.521", beskrivning: "Handfat IFÖ Spira", enhet: "st", mangd: 90, aPris: 1890, leverantor: "IFÖ" },
  { projektId: 2, ama: "QGB.12", beskrivning: "FTX-aggregat 1500 m³/h", enhet: "st", mangd: 4, aPris: 145000, leverantor: "Swegon" },

  // Projekt 4 – Bygg/Konstruktion
  { projektId: 4, ama: "CBC.21", beskrivning: "Betongpåle Ø350 längd 8m", enhet: "st", mangd: 124, aPris: 14500, leverantor: "Skanska Foundations" },
  { projektId: 4, ama: "ESE.111", beskrivning: "Tegel 250x120x65 fasad", enhet: "tusen", mangd: 84, aPris: 12800, leverantor: "Wienerberger" },
  { projektId: 4, ama: "SED.6", beskrivning: "Solpanel 410W mono", enhet: "st", mangd: 234, aPris: 2890, leverantor: "JinkoSolar" },
  { projektId: 4, ama: "QSB.21", beskrivning: "Limträbalk GL30c 200x500", enhet: "m", mangd: 480, aPris: 1850, leverantor: "Setra" },
  { projektId: 4, ama: "JTB.5", beskrivning: "Råspont 23mm gran", enhet: "m²", mangd: 1240, aPris: 245, leverantor: "Moelven" },

  // Projekt 7 – Tak
  { projektId: 7, ama: "JTB.5", beskrivning: "Råspont 23mm gran", enhet: "m²", mangd: 11500, aPris: 245, leverantor: "Moelven" },
  { projektId: 7, ama: "JTC.231", beskrivning: "Bandtäckning plåt 0.6 förzinkad", enhet: "m²", mangd: 12000, aPris: 685, leverantor: "Plannja" },
  { projektId: 7, ama: "PSC.211", beskrivning: "Snörasskydd 1m galvaniserad", enhet: "st", mangd: 320, aPris: 425, leverantor: "Lindab" },

  // Projekt 12 – Idrottshall
  { projektId: 12, ama: "QSE.12", beskrivning: "Akustikabsorbent 1200x600", enhet: "st", mangd: 480, aPris: 1485, leverantor: "Ecophon" },
  { projektId: 12, ama: "SED.5113", beskrivning: "LED-armatur 200W IP65 sport", enhet: "st", mangd: 64, aPris: 7560, leverantor: "Fagerhult" },
  { projektId: 12, ama: "PSC.1", beskrivning: "Sportgolv träelastiskt 22mm", enhet: "m²", mangd: 3200, aPris: 1890, leverantor: "Junckers" },
];

export function ritningarFörProjekt(projektId) {
  return ritningar.filter((r) => r.projektId === projektId);
}

export function amaFörProjekt(projektId) {
  return amaMangder.filter((m) => m.projektId === projektId);
}

export function amaTotalsumma(projektId) {
  return amaFörProjekt(projektId).reduce((s, m) => s + m.mangd * m.aPris, 0);
}
