# Hermes + Vapi — Setup-guide för Cold Calling-test (Arbetsmiljöcenter)

> **Källa:** David Ondrej-videon (Hermes + Vapi + MCP) + pawel-cell use-cases + Vapi MCP-docs.
> **Mål just nu:** Få igång ett TEST så chefen ser det och betalar för verktyg/e-sim. Sen skala + återsälj.
> **Bygger på:** `saljmanus.md`, `retell-agent-config.md`, `openclaw-hermes-agent-prompt.md`.

---

## 1. Arkitekturen (vad det faktiskt är)

| Del | Roll |
|---|---|
| **Hermes** | Hjärnan/orkestratorn. ~82 skills. Skapar Vapi-assistenter, ringer, cron-jobbar, bygger SQLite lead-DB, DM:ar dig. |
| **Vapi** | Telefonen. Nummer, röst (TTS), transkribering (ASR), "orchestrator" (avbrott, turtagning, brusreducering). |
| **Vapi MCP** | Limmet. 1 install → Hermes styr Vapi i klartext ("ring den här", "skapa en assistent för X"). |
| **"Ask Hermes"-tool** | Omvänt: live-assistenten kan fråga din Hermes mitt i ett samtal + pinga dig på Telegram när en lead är het. |

**Kärnan:** Vapi gör samtal *konfigurerbara*, Hermes gör dem *autonoma*. Kostnad i videon: **~$0.05–0.10/min**.

---

## 2. Setup-steg (test-först, ~30–45 min)

1. **Installera Hermes LOKALT** (one-liner från Hermes-repot). ⚠️ INTE på ThyroidAI-VPS:en (76.13.149.231) — skydda prod, kör lokalt för testet.
2. `hermes setup` → provider **OpenRouter** → ladda **$5–10** → välj modell för hjärnan (Opus). Spamma enter genom resten (defaults är bra).
3. **Vapi-konto** → skapa **private/server-side API-nyckel**.
4. **Ge Hermes Vapi MCP:** säg "Set up this new MCP" + klistra MCP-URL:en → Hermes konfigurerar sig själv → klistra private key (helst via `hermes config set vapi api key`, inte i chatten).
5. **Restart Hermes** → "vilka MCP-servrar ser du?" → bekräfta Vapi finns.
6. **Köp ett SVENSKT nummer i Vapi** (för svensk caller-ID). 10 gratis US-nummer finns men du vill svenskt för svenska företag.
7. **Skapa assistenten från ditt manus:** "Skapa en Vapi-assistent för Arbetsmiljöcenter cold calling på svenska, använd detta system-prompt: [klistra `retell-agent-config.md` system-prompten]."
8. **Testa 1 samtal till dig själv** → finjustera: modell (GPT-5.x för bättre svenska + voicemail-igenkänning), röst (testa svenska röster), hastighet ~1.0, regel "lägg på vid röstbrevlåda".
9. **Visa chefen → få betalt.** Sen skala med cron-jobb (throttlat, se compliance).

---

## 3. Svenska-specifika justeringar (videon hoppar över dessa)

| Område | Vad du måste göra |
|---|---|
| **Röst + ASR** | Testa svensk TTS + svensk transkribering FÖRE demon. Detta är största kvalitetsrisken. (Retell har inbyggd svenska — snabbare just för demon.) |
| **Compliance** | NIX-Företag-koll, GDPR, EU AI Act-transparens. Videons "cron var 10:e min ring random företag" funkar INTE rakt av i Sverige — throttla + spärrlista. |
| **Modellval** | Hermes valde GPT-4o (svagt) i videon och fastnade i 8-min röstbrevlåda. Sätt GPT-5.x direkt. |
| **Infra** | Kör Hermes lokalt eller separat — aldrig på ThyroidAI-prod-VPS:en (Paperclip-lärdomen: RAM-tungt kan sänka appen). |

---

## 4. Vapi vs Retell — skärpt verdict (med full bild)

| | Vapi | Retell |
|---|---|---|
| MCP / Hermes-orkestrering | ✅ Native — Hermes skapar/styr/cron-jobbar allt | Mer stängt |
| Matchar din resale-produkt | ✅ Exakt David Ondrej-mönstret + 80 mallar | Nej |
| Tid till svensk demo | Montering + testa svensk röst | ⚡ Config klar + inbyggd svenska |
| Kostnad | ~$0.05–0.10/min, komponerbart | Per minut, allt-i-ett |

**Rekommendation:** Bygg den skalbara/säljbara produkten på **Vapi + Hermes**. Om chefsdemon är BRÅTTOM denna vecka och svensk röst strular i Vapi → kör själva demon på **Retell** (din config + inbyggd svenska = live på ~1 dag), flytta sen till Vapi. Samtalsmanuset är samma — du låser dig inte.

---

## 5. Risker (håll koll)
- **Kostnadskontroll:** sätt limit i både OpenRouter ($50) och Vapi.
- **Svensk röstkvalitet:** testa innan du visar chefen.
- **Voicemail-loop:** regel "lägg på vid röstbrevlåda" + GPT-5.x.
- **API-nyckel-hygien:** `hermes config set`, inte klistra i chatt (videon erkänner detta).
- **Sverige ≠ USA-demon:** B2B cold calling är OK men med spärrlista + GDPR + AI Act.

---

## 6. Det du gör FÖRST
Installera Hermes lokalt + koppla Vapi MCP (steg 1–5) = ~30 min. Sen ETT testsamtal till din egen telefon. Visa att det funkar → resten är finjustering.
