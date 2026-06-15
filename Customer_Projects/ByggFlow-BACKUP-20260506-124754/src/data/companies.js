// Hantverksfirmor – kunder till ByggFlow
export const companies = [
  { id: 1, namn: "Lindqvist El AB", bransch: "el", ort: "Solna", orgnr: "556812-3401", anstallda: 8 },
  { id: 2, namn: "Berglund VVS & Rör", bransch: "vvs", ort: "Sundbyberg", orgnr: "556734-2210", anstallda: 6 },
  { id: 3, namn: "Karlsson Bygg & Entreprenad", bransch: "entreprenad", ort: "Täby", orgnr: "556901-7733", anstallda: 14 },
  { id: 4, namn: "Dalström Snickeri", bransch: "snickeri", ort: "Nacka", orgnr: "556445-2289", anstallda: 5 },
  { id: 5, namn: "Persson Måleri & Fasad", bransch: "maleri", ort: "Järfälla", orgnr: "556233-8812", anstallda: 7 },
  { id: 6, namn: "Nordström Tak & Plåt", bransch: "tak", ort: "Huddinge", orgnr: "556677-1144", anstallda: 9 },
  { id: 7, namn: "Ekström Golvläggning", bransch: "golv", ort: "Sollentuna", orgnr: "556122-4456", anstallda: 4 },
];

// Beställare/kommuner
export const beställare = [
  { id: 1, namn: "Stockholms Kommun - Fastighetsförvaltningen", typ: "kommun", kontakt: "Maria Holm" },
  { id: 2, namn: "Göteborgs Stad - Lokalförvaltningen", typ: "kommun", kontakt: "Erik Sandberg" },
  { id: 3, namn: "Uppsala Kommun - Tekniska kontoret", typ: "kommun", kontakt: "Linda Forsberg" },
];

// Anställda i fält (för spårning)
// timkostnadAdmin = vad firman betalar (lön + sociala avgifter)
// timkostnadKommun = vad kommunen/kund debiteras (utfakturerat pris)
export const anstallda = [
  { id: 1, namn: "Anders Lindqvist", firmaId: 1, roll: "Elektriker", telefon: "070-123 45 67", avatar: "AL", timkostnadAdmin: 385, timkostnadKommun: 695 },
  { id: 2, namn: "Mikael Berglund", firmaId: 2, roll: "VVS-montör", telefon: "070-234 56 78", avatar: "MB", timkostnadAdmin: 410, timkostnadKommun: 745 },
  { id: 3, namn: "Johan Karlsson", firmaId: 3, roll: "Byggledare", telefon: "070-345 67 89", avatar: "JK", timkostnadAdmin: 445, timkostnadKommun: 825 },
  { id: 4, namn: "Sara Dalström", firmaId: 4, roll: "Snickare", telefon: "070-456 78 90", avatar: "SD", timkostnadAdmin: 365, timkostnadKommun: 665 },
  { id: 5, namn: "Per Persson", firmaId: 5, roll: "Målare", telefon: "070-567 89 01", avatar: "PP", timkostnadAdmin: 350, timkostnadKommun: 645 },
  { id: 6, namn: "Lars Nordström", firmaId: 6, roll: "Plåtslagare", telefon: "070-678 90 12", avatar: "LN", timkostnadAdmin: 395, timkostnadKommun: 725 },
  { id: 7, namn: "Henrik Ekström", firmaId: 7, roll: "Golvläggare", telefon: "070-789 01 23", avatar: "HE", timkostnadAdmin: 360, timkostnadKommun: 655 },
];
