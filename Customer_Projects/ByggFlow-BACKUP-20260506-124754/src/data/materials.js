// Materiallager – status: ok | lag (under lagernivå) | slut
export const materials = [
  { id: 1, namn: "Kabel YKY 3x2.5", bransch: "el", lager: 450, enhet: "m", priser: 12, lagernivå: 200, status: "ok" },
  { id: 2, namn: "Kopparrör 15mm", bransch: "vvs", lager: 80, enhet: "m", priser: 45, lagernivå: 100, status: "lag" },
  { id: 3, namn: "Reglar 45x95 C24", bransch: "snickeri", lager: 120, enhet: "st", priser: 38, lagernivå: 80, status: "ok" },
  { id: 4, namn: "Alcro Bestå Tak vit 10L", bransch: "maleri", lager: 8, enhet: "st", priser: 890, lagernivå: 12, status: "lag" },
  { id: 5, namn: "Golvspackel Ardex K301 25kg", bransch: "golv", lager: 15, enhet: "säck", priser: 340, lagernivå: 10, status: "ok" },
  { id: 6, namn: "Säkring 16A", bransch: "el", lager: 200, enhet: "st", priser: 18, lagernivå: 100, status: "ok" },
  { id: 7, namn: "Vattenrör PEX 16mm", bransch: "vvs", lager: 200, enhet: "m", priser: 22, lagernivå: 150, status: "ok" },
  { id: 8, namn: "Plåtskruv 4.8x35", bransch: "tak", lager: 45, enhet: "ask", priser: 89, lagernivå: 60, status: "lag" },
  { id: 9, namn: "Gipsskiva 13mm 1200x2500", bransch: "snickeri", lager: 25, enhet: "st", priser: 145, lagernivå: 40, status: "lag" },
  { id: 10, namn: "Trävitt utomhus 5L", bransch: "maleri", lager: 18, enhet: "st", priser: 720, lagernivå: 10, status: "ok" },
];

// Förbrukad material per projekt
export const materialförbrukning = [
  { projektId: 1, materialId: 1, antal: 320, datum: "2026-04-22", anvandare: "Anders Lindqvist" },
  { projektId: 1, materialId: 6, antal: 45, datum: "2026-04-22", anvandare: "Anders Lindqvist" },
  { projektId: 2, materialId: 2, antal: 60, datum: "2026-04-21", anvandare: "Mikael Berglund" },
  { projektId: 2, materialId: 7, antal: 120, datum: "2026-04-21", anvandare: "Mikael Berglund" },
  { projektId: 3, materialId: 4, antal: 6, datum: "2026-04-20", anvandare: "Per Persson" },
  { projektId: 4, materialId: 3, antal: 85, datum: "2026-04-23", anvandare: "Johan Karlsson" },
  { projektId: 6, materialId: 5, antal: 8, datum: "2026-04-22", anvandare: "Henrik Ekström" },
  { projektId: 7, materialId: 8, antal: 12, datum: "2026-04-23", anvandare: "Lars Nordström" },
];
