// Koncernstruktur för stora byggbolag – moderbolag → dotterbolag → avdelningar
// Används i Admin-panelen för konsoliderad ekonomi
export const koncernstruktur = {
  moderbolag: {
    namn: "AI Upscale Bygg Holding AB",
    orgnr: "559123-4567",
    vd: "Mikael Luengo",
    omsattning: 487500000,
    anstallda: 312,
  },
  dotterbolag: [
    {
      id: 1, namn: "Lindqvist El AB", bransch: "el", ort: "Solna",
      omsattning: 68500000, marginal: 18.4, anstallda: 42, projekt: 23,
      vd: "Anders Lindqvist", trend: "+12%",
      avdelningar: [
        { namn: "Installation", anstallda: 28, omsattning: 42500000 },
        { namn: "Service", anstallda: 9, omsattning: 14800000 },
        { namn: "Smart hem & laddstolpar", anstallda: 5, omsattning: 11200000 },
      ],
    },
    {
      id: 2, namn: "Berglund VVS & Rör", bransch: "vvs", ort: "Sundbyberg",
      omsattning: 95800000, marginal: 21.2, anstallda: 56, projekt: 18,
      vd: "Mikael Berglund", trend: "+8%",
      avdelningar: [
        { namn: "Stamrenovering", anstallda: 32, omsattning: 58200000 },
        { namn: "Ny installation", anstallda: 15, omsattning: 24400000 },
        { namn: "Service & jour", anstallda: 9, omsattning: 13200000 },
      ],
    },
    {
      id: 3, namn: "Karlsson Bygg & Entreprenad", bransch: "entreprenad", ort: "Täby",
      omsattning: 184500000, marginal: 14.8, anstallda: 124, projekt: 14,
      vd: "Johan Karlsson", trend: "+22%",
      avdelningar: [
        { namn: "Husbyggnad", anstallda: 78, omsattning: 124500000 },
        { namn: "Anläggning", anstallda: 28, omsattning: 38800000 },
        { namn: "Renovering", anstallda: 18, omsattning: 21200000 },
      ],
    },
    {
      id: 4, namn: "Dalström Snickeri", bransch: "snickeri", ort: "Nacka",
      omsattning: 24800000, marginal: 23.6, anstallda: 18, projekt: 9,
      vd: "Sara Dalström", trend: "+15%",
      avdelningar: [
        { namn: "Inredning", anstallda: 11, omsattning: 16800000 },
        { namn: "Specialsnickeri", anstallda: 7, omsattning: 8000000 },
      ],
    },
    {
      id: 5, namn: "Persson Måleri & Fasad", bransch: "maleri", ort: "Järfälla",
      omsattning: 38200000, marginal: 16.5, anstallda: 28, projekt: 12,
      vd: "Per Persson", trend: "+5%",
      avdelningar: [
        { namn: "Fasad", anstallda: 15, omsattning: 22800000 },
        { namn: "Invändigt", anstallda: 13, omsattning: 15400000 },
      ],
    },
    {
      id: 6, namn: "Nordström Tak & Plåt", bransch: "tak", ort: "Huddinge",
      omsattning: 56400000, marginal: 19.8, anstallda: 32, projekt: 11,
      vd: "Lars Nordström", trend: "+18%",
      avdelningar: [
        { namn: "Tak", anstallda: 22, omsattning: 38900000 },
        { namn: "Plåt & fasad", anstallda: 10, omsattning: 17500000 },
      ],
    },
    {
      id: 7, namn: "Ekström Golvläggning", bransch: "golv", ort: "Sollentuna",
      omsattning: 19300000, marginal: 17.2, anstallda: 12, projekt: 8,
      vd: "Henrik Ekström", trend: "+9%",
      avdelningar: [
        { namn: "Trä & parkett", anstallda: 7, omsattning: 11500000 },
        { namn: "Plast & linoleum", anstallda: 5, omsattning: 7800000 },
      ],
    },
  ],
};
