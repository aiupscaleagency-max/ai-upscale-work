# 01 — Karaktärsbibel

> **Mål:** Samma karaktärer ska vara igenkännbara i BÅDE realistisk och animerad stil. Lås signatur-detaljerna nedan — ändra dem aldrig.

---

## ⭐ HUVUDKARAKTÄR — Dr. Vera Thorne ("Dr. Vee")

**Varför hon:** Publiken för sköldkörtelsjukdom är ~80–90% kvinnor (Hashimotos). En kvinnlig läkare i samma ålder = max igenkänning + förtroende + hon kan säga sanningar utan att kännas nedlåtande. Namnet: *Vera* (veritas = sanning), *Thorne* (tornen i sidan på lat sjukvård). Vass men varm.

**Persona:** Torr, lugn, dödskul. Höjer ett ögonbryn istället för rösten. Är på patientens sida, less på systemet. "I'm not mad. I'm just your thyroid's lawyer."

### 🔒 Låsta signatur-detaljer (samma i ALLA renderingar, båda stilar)

| Detalj | Spec |
|---|---|
| **Kön/ålder** | Kvinna, ser ut att vara ~40 |
| **Hår** | Mörkbrunt, låg stram knut, mittbena |
| **Glasögon** | **Röda/korall-bågade** (snabbaste igenkänningssignalen) |
| **Plagg** | Vit läkarrock över **teal/turkos scrubs** |
| **Signatur-accessoar** | **Liten guldfjäril-nål 🦋** på rockslaget (sköldkörtel-symbolen — alltid synlig) |
| **Uttryck** | Lugnt, vasst, ett höjt ögonbryn som standard |
| **Hudton/etnicitet** | Hålls konsekvent (se prompt — lås en gång) |

### Realistisk Dr. Vee — bild-prompt (lås seed/referensbild)
```
Photorealistic portrait of a 40-year-old female doctor, warm light-olive skin tone,
dark brown hair in a low neat bun with center part, coral-red rectangular glasses,
white medical coat over teal scrubs, small gold butterfly pin on the lapel,
calm dry confident expression with one slightly raised eyebrow, soft studio lighting,
plain neutral background, upper-body framing, 9:16 vertical. Consistent character.
```

### Animerad Dr. Vee — bild-prompt (samma karaktär, illustrerad)
```
Clean 2D flat-style cartoon illustration of the SAME character: 40-year-old female
doctor, light-olive skin, dark brown hair in a low bun with center part, coral-red
rectangular glasses, white coat over teal scrubs, small gold butterfly pin on lapel,
dry confident half-smile with one raised eyebrow, bold simple line art, modern flat
colors, soft shading, plain background, upper-body, 9:16 vertical. Consistent character.
```

> **Konsistens-tips:** Generera EN godkänd referensbild per stil. Återanvänd den som referens/seed i varje ny generering (image-to-image eller "character reference"). Spara båda i `/assets` (skapas vid produktion).

---

## 🎭 ÅTERKOMMANDE BIROLLER (bygger "världen")

### 1. "Dr. Brush-Off" (antagonisten)
Den stressade vårdcentralsläkaren som tittar på klockan. Säger alltid *"Your labs are normal, it's probably just stress."* Dyker upp i bakgrundsscenen (P1 + P3).
- **Look:** trött manlig läkare, skrynklig rock, kaffekopp, tittar på klockan, halvt ointresserad.

### 2. "Hashimoto Hannah" (publikens spegel — hjälten)
Everywoman-patienten. Trött, fryser i filt, tappar hår, hjärndimma, men "alla prover är normala". Tittaren känner igen SIG SJÄLV. Behandlas alltid med värme — aldrig måltavla för skämtet.
- **Look:** ~35, filt om axlarna, trött men sympatisk, termos med te.

### 3. "TSH" (maskot-skurken — endast animerad)
TSH personifierad som en liten självgod nummer-/labbvärde-figur som viftar bort allt annat ("everything's fine, I'm the only number that matters!"). Perfekt för P1-animationer. Komisk skurk man älskar att hata.
- **Look:** liten arrogant tecknad figur format som ett provrör/siffra med solglasögon.

---

## Färg- & stilkod (gäller bägge stilar)

| Element | Värde |
|---|---|
| Primär | **Teal/turkos** (sköldkörtel-fjärilen) `#1FB6B6`-ish |
| Accent/highlight | **Korall-röd** (matchar glasögonen) `#FF6B5C`-ish |
| Bas | Ren vit + mjuk grå |
| Signatur-motiv | 🦋 fjäril återkommer i intro, outro, nål, caption |
| Caption-highlight | Nyckelord i korall, resten vitt |
