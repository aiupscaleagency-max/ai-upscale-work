# Röst-klon i ElevenLabs → använd i Vapi + Retell

> Mål: en klonad, mänsklig svensk röst som låter naturlig i båda plattformarna.

## Steg 1 — Konto + plan
1. elevenlabs.io → skaffa minst **Starter (~$5/mån)**. Fri plan tillåter EJ kloning/kommersiellt.

## Steg 2 — Spela in klon-sample (VIKTIGAST)
1. **Spela in PÅ SVENSKA** — inte engelska (annars bryter rösten).
2. 1–5 min ren inspelning, ingen bakgrund, naturlig säljton (som om du ringer ett företag).
3. ElevenLabs → Voices → **Add Voice → Instant Voice Cloning** → ladda upp → namnge → spara.
4. Kopiera **Voice ID** (behövs för Retell).

## Steg 3 — Inställning i ElevenLabs
- Modell: **Flash v2.5** (låg latens, bäst för telefonsamtal).
- Språk: svenska.

## Steg 4a — Koppla i Vapi
1. Vapi → **Integrations** → klistra in din ElevenLabs **API-nyckel** → Save.
2. Voice library syncas → välj din klonade röst i assistenten.

## Steg 4b — Koppla i Retell
1. Retell → voice selector → **Add custom voice**.
2. Klistra in din ElevenLabs **Voice ID** (eller ladda upp ljudet direkt).

## Steg 5 — Testa i JAMFOR-demo.md
- Ring din egen telefon i båda → betygsätt naturlighet, brytning, latens.

## Demo vs drift
- **Demo till Glenn:** din egen klonade röst = starkt "wow".
- **Skarp drift (150 samtal/dag):** överväg neutral säljröst — du vill inte vara rösten på alla samtal.
