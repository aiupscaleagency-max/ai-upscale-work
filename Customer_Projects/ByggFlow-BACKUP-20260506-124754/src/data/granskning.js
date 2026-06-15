// Faktura-granskning – kommunens flöde innan betalning godkänns
// Status: ny | granskas | godkand | retur | betalad
export const fakturaGranskning = [
  {
    fakturaId: "F-2026-0142", granskareInitialer: "MH", inkommen: "2026-04-22",
    status: "granskas", deadlineGranskning: "2026-05-06",
    kommentarer: [
      { från: "Maria Holm (Fastighet)", text: "Behöver bekräftelse på att alla 24 elcentraler är monterade enligt ÄTA-002", datum: "2026-04-23 14:20" },
    ],
    kontroller: { mängderOK: true, prisOK: false, projektkonto: true, attest: false },
  },
  {
    fakturaId: "F-2026-0141", granskareInitialer: "MH", inkommen: "2026-04-20",
    status: "godkand", deadlineGranskning: "2026-05-04", godkandDatum: "2026-04-24",
    kommentarer: [
      { från: "Maria Holm (Fastighet)", text: "Godkänd för betalning – mängder och pris stämmer mot kontrakt", datum: "2026-04-24 09:15" },
    ],
    kontroller: { mängderOK: true, prisOK: true, projektkonto: true, attest: true },
  },
  {
    fakturaId: "F-2026-0139", granskareInitialer: "EK", inkommen: "2026-04-15",
    status: "retur", deadlineGranskning: "2026-04-29",
    kommentarer: [
      { från: "Erik Karlén (Ekonomi)", text: "Returneras: Antalet timmar (88h) verkar högt mot dagboksinlägg som visar ca 70h. Begär förtydligande.", datum: "2026-04-22 11:40" },
      { från: "Karlsson Bygg & Entreprenad", text: "Förtydligande på väg – inkluderar 18h övertid lö 18/4 (akut beställning)", datum: "2026-04-23 08:30" },
    ],
    kontroller: { mängderOK: false, prisOK: true, projektkonto: true, attest: false },
  },
  {
    fakturaId: "F-2026-0137", granskareInitialer: "MH", inkommen: "2026-04-08",
    status: "betalad", deadlineGranskning: "2026-04-22", godkandDatum: "2026-04-15", betaladDatum: "2026-04-25",
    kommentarer: [
      { från: "Maria Holm (Fastighet)", text: "Allt OK", datum: "2026-04-15 13:00" },
    ],
    kontroller: { mängderOK: true, prisOK: true, projektkonto: true, attest: true },
  },
];
