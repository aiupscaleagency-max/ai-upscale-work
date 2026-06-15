// HR-certifikat per anställd – ID06, heta arbeten, fallskydd osv
// Larmar när certifikat går ut inom 60 dagar
// Datum-referens: 2026-04-26
export const certifikat = [
  // Anders Lindqvist
  { anstalldId: 1, namn: "Anders Lindqvist", typ: "ID06", utgar: "2027-08-12", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 1, namn: "Anders Lindqvist", typ: "Behörig elinstallatör (BB1)", utgar: "2028-03-04", utgivare: "Elsäkerhetsverket" },
  { anstalldId: 1, namn: "Anders Lindqvist", typ: "Heta arbeten", utgar: "2026-05-22", utgivare: "Brandskyddsföreningen" },
  { anstalldId: 1, namn: "Anders Lindqvist", typ: "Liftutbildning", utgar: "2026-09-15", utgivare: "Liftutbildningsrådet" },

  // Mikael Berglund
  { anstalldId: 2, namn: "Mikael Berglund", typ: "ID06", utgar: "2027-02-18", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 2, namn: "Mikael Berglund", typ: "Branschcertifierad våtrum BBV", utgar: "2027-06-30", utgivare: "GVK" },
  { anstalldId: 2, namn: "Mikael Berglund", typ: "Heta arbeten", utgar: "2026-06-08", utgivare: "Brandskyddsföreningen" },
  { anstalldId: 2, namn: "Mikael Berglund", typ: "Asbestsanering", utgar: "2026-05-10", utgivare: "Arbetsmiljöverket" },

  // Johan Karlsson
  { anstalldId: 3, namn: "Johan Karlsson", typ: "ID06", utgar: "2028-01-22", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 3, namn: "Johan Karlsson", typ: "BAS-P / BAS-U", utgar: "2027-04-18", utgivare: "Arbetsmiljöverket" },
  { anstalldId: 3, namn: "Johan Karlsson", typ: "Fallskydd höjdarbete", utgar: "2026-04-30", utgivare: "Skyddsutbildning AB" },
  { anstalldId: 3, namn: "Johan Karlsson", typ: "Mobilkrandiplom", utgar: "2027-11-05", utgivare: "TYA" },

  // Sara Dalström
  { anstalldId: 4, namn: "Sara Dalström", typ: "ID06", utgar: "2027-09-14", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 4, namn: "Sara Dalström", typ: "Heta arbeten", utgar: "2027-01-20", utgivare: "Brandskyddsföreningen" },
  { anstalldId: 4, namn: "Sara Dalström", typ: "Yrkesbevis snickare", utgar: null, utgivare: "Sveriges Yrkesutbildning" },

  // Per Persson
  { anstalldId: 5, namn: "Per Persson", typ: "ID06", utgar: "2026-12-08", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 5, namn: "Per Persson", typ: "Måleribevis", utgar: null, utgivare: "Måleribranschen" },
  { anstalldId: 5, namn: "Per Persson", typ: "Ställningsbygg upp till 9m", utgar: "2026-05-30", utgivare: "STIB" },

  // Lars Nordström
  { anstalldId: 6, namn: "Lars Nordström", typ: "ID06", utgar: "2027-07-11", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 6, namn: "Lars Nordström", typ: "Plåtslagarbevis", utgar: null, utgivare: "Plåt & Vent" },
  { anstalldId: 6, namn: "Lars Nordström", typ: "Heta arbeten", utgar: "2026-06-18", utgivare: "Brandskyddsföreningen" },
  { anstalldId: 6, namn: "Lars Nordström", typ: "Fallskydd höjdarbete", utgar: "2026-08-25", utgivare: "Skyddsutbildning AB" },
  { anstalldId: 6, namn: "Lars Nordström", typ: "Takarbete med snörasrisk", utgar: "2027-02-04", utgivare: "TYA" },

  // Henrik Ekström
  { anstalldId: 7, namn: "Henrik Ekström", typ: "ID06", utgar: "2026-05-04", utgivare: "Sveriges Byggindustrier" },
  { anstalldId: 7, namn: "Henrik Ekström", typ: "GVK auktoriserad golvläggare", utgar: "2027-10-12", utgivare: "GVK" },
  { anstalldId: 7, namn: "Henrik Ekström", typ: "Heta arbeten", utgar: "2026-11-30", utgivare: "Brandskyddsföreningen" },
];

// Hjälpare: status baserat på utgångsdatum
export function certifikatStatus(utgar, idag = new Date("2026-04-26")) {
  if (!utgar) return { label: "Permanent", style: "ok", dagar: null };
  const slut = new Date(utgar);
  const dagar = Math.ceil((slut - idag) / 86400000);
  if (dagar < 0) return { label: "UTGÅNGEN", style: "kritisk", dagar };
  if (dagar < 30) return { label: `Går ut om ${dagar} dgr`, style: "kritisk", dagar };
  if (dagar < 60) return { label: `Går ut om ${dagar} dgr`, style: "varning", dagar };
  return { label: "Giltig", style: "ok", dagar };
}
