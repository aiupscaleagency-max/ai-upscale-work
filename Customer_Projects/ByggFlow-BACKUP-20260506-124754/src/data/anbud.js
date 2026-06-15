// Anbudsförfrågningar (upphandlingar) – kommunens vy
// Status: utkast | publicerad | utvardering | tilldelad | avslutad
export const anbudsforfragningar = [
  {
    id: 1, nr: "UPH-2026-014", rubrik: "Renovering Eklunda förskola", bransch: "entreprenad",
    publicerad: "2026-04-10", deadline: "2026-05-15", uppskattatVarde: 12500000, status: "utvardering",
    beskrivning: "Total invändig renovering av Eklunda förskola, ca 1 800 m² + utemiljö",
    tilldelningskriterier: "Pris 60% / Kvalitet 25% / Miljö 15%",
    inkomnaAnbud: [
      { firma: "Karlsson Bygg & Entreprenad", belopp: 11800000, tid: "8 mån", garantier: "5 år", betyg: 4.6, kommentar: "Erfaren av skolor, har gjort 14 liknande" },
      { firma: "NCC Bygg AB", belopp: 13200000, tid: "7 mån", garantier: "5 år", betyg: 4.2, kommentar: "Större organisation, högre pris" },
      { firma: "Peab Stockholm", belopp: 12950000, tid: "9 mån", garantier: "5 år", betyg: 4.4, kommentar: "Standardanbud" },
      { firma: "Skanska Sverige AB", belopp: 14100000, tid: "6 mån", garantier: "10 år", betyg: 4.8, kommentar: "Snabbast leverans, dyrast" },
    ],
  },
  {
    id: 2, nr: "UPH-2026-015", rubrik: "Belysning Hagaparken etapp 2", bransch: "el",
    publicerad: "2026-04-18", deadline: "2026-05-25", uppskattatVarde: 4200000, status: "publicerad",
    beskrivning: "65 st smarta LED-armaturer + DALI-styrning + jordkabel ca 800 m",
    tilldelningskriterier: "Pris 70% / Energi 30%",
    inkomnaAnbud: [],
  },
  {
    id: 3, nr: "UPH-2026-013", rubrik: "Stamrenovering Rosengård kvarteret", bransch: "vvs",
    publicerad: "2026-03-20", deadline: "2026-04-20", uppskattatVarde: 38500000, status: "tilldelad",
    beskrivning: "240 lgh stamrenovering inkl badrumsrenovering",
    tilldelningskriterier: "Pris 50% / Kvalitet 30% / Tid 20%",
    tilldeladTill: "Berglund VVS & Rör",
    inkomnaAnbud: [
      { firma: "Berglund VVS & Rör", belopp: 36800000, tid: "14 mån", garantier: "5 år", betyg: 4.7, kommentar: "✓ TILLDELAD – bästa kombination pris/kvalitet" },
      { firma: "Bravida AB", belopp: 39500000, tid: "12 mån", garantier: "5 år", betyg: 4.3 },
      { firma: "Caverion Sverige", belopp: 41200000, tid: "13 mån", garantier: "10 år", betyg: 4.6 },
    ],
  },
  {
    id: 4, nr: "UPH-2026-016", rubrik: "Fasadrenovering Stadshuset", bransch: "maleri",
    publicerad: "2026-04-22", deadline: "2026-06-01", uppskattatVarde: 8900000, status: "utkast",
    beskrivning: "Putslagning + målning fasad ca 4 200 m². Kulturskydd – samråd med stadsantikvarie krävs",
    tilldelningskriterier: "Pris 40% / Kvalitet 40% / Referenser 20%",
    inkomnaAnbud: [],
  },
  {
    id: 5, nr: "UPH-2026-012", rubrik: "Takrenovering Liljeholms IP", bransch: "tak",
    publicerad: "2026-02-15", deadline: "2026-03-15", uppskattatVarde: 14200000, status: "avslutad",
    beskrivning: "Total takbyte 12 000 m² inkl plåt + isolering",
    tilldeladTill: "Nordström Tak & Plåt",
    inkomnaAnbud: [
      { firma: "Nordström Tak & Plåt", belopp: 13400000, tid: "5 mån", garantier: "10 år", betyg: 4.7, kommentar: "✓ TILLDELAD" },
    ],
  },
];
