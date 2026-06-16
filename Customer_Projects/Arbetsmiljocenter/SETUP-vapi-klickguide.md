# Klickguide — Vapi setup (parallelltest mot Retell)

> Samma agent som i Retell, men i Vapi. Använd SAMMA system-prompt från `retell-agent-config.md`.
> Skillnad mot Retell: i Vapi väljer du transcriber (öron), model (hjärna) och voice (röst) var för sig.

## Steg 1 — Konto
1. Gå till vapi.ai → Sign up. Du får gratis-krediter (~$10).

## Steg 2 — Skapa Assistant
1. Dashboard → **Assistants** → **Create Assistant** → börja från blank/template.
2. **Model (hjärna):** GPT-4o (eller Gemini 2.5 Flash).
3. **System Prompt:** klistra in samma prompt som i `retell-agent-config.md`.
4. **First Message:** "Hej, det är Sofia från Arbetsmiljöcenter. Har du 30 sekunder så jag får förklara varför jag ringer?"

## Steg 3 — Svenska på rätt ställen (VIKTIGT)
1. **Transcriber (öron/STT):** välj Deepgram (nova-2) eller Google → sätt **language = sv (Swedish)**.
2. **Voice (röst/TTS):** välj provider med bra svenska — testa **ElevenLabs (Flash v2.5)**, **Azure (sv-SE neural)** och **Cartesia**. Lyssna, välj naturligast.
   - OBS: ElevenLabs i Vapi körs under Vapis betalning = kommersiellt OK (till skillnad från eget gratis-konto).

## Steg 4 — Inställningar
- Voicemail detection: PÅ
- Max call duration: 5 min
- Interruption: medium-hög (cold calls = folk avbryter)

## Steg 5 — Telefonnummer
1. **Phone Numbers** → köp ett nummer i Vapi (eller importera Twilio-nummer).
2. Knyt till din Assistant för outbound.
3. ⚠️ INTE e-SIM — det är ett VoIP-nummer inne i Vapi.

## Steg 6 — Testa mot din egen telefon
1. **Outbound call** → ditt mobilnummer → agenten ringer dig.
2. Fyll i jämförelse-protokollet (`JAMFOR-demo.md`) medan du lyssnar.

## Skillnader mot Retell att hålla koll på
| | Retell | Vapi |
|---|---|---|
| Svenska | Mer "bara välj sv-SE" | Sätt sv på BÅDE transcriber och voice |
| Pillande | Mindre | Mer (fler rattar) |
| Plattformsavgift | Nej | Ja (liten) |
