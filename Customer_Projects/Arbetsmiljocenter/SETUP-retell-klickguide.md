# Klickguide — Retell setup (ring så snabbt som möjligt)

> Mål: agent som ringer DIN telefon i veckan, gratis. Följ stegen uppifrån och ner.

## Steg 1 — Skapa konto (du gör nu)
1. Gå till retellai.com → Sign up. Inget kort krävs. Du får $10 krediter (~60–90 min).

## Steg 2 — Skapa agenten
1. Dashboard → **Create Agent** → välj "Single Prompt Agent".
2. **LLM:** GPT-4o (eller Gemini 2.5 Flash).
3. **Language:** Swedish (sv-SE).
4. **Voice:** lyssna på de svenska rösterna → välj den mest naturliga.
5. **Agent Prompt:** klistra in system-prompten från `retell-agent-config.md`.
6. Inställningar enligt tabellen i samma fil (voicemail detection PÅ, max 5 min, interruption medium-hög).

## Steg 3 — Skaffa telefonnummer
1. Dashboard → **Phone Numbers** → köp ett svenskt nummer (eller koppla Twilio-nummer).
2. Knyt numret till agenten (outbound).

## Steg 4 — Testa mot din egen telefon
1. **Test Call** → ange ditt eget mobilnummer → agenten ringer dig.
2. Lyssna: låter svenskan naturlig? Avbryter den rätt? Följer den manuset?
3. Skicka mig feedback → jag justerar prompten direkt.

## Steg 5 — Skarpa testsamtal (några stycken på gratiskrediter)
1. Ring 5–10 riktiga företag för att se svarsfrekvens + invändningar.
2. När det sitter → **du ringer chefen och kör en live-demo.**

## Steg 6 — När chefen säger ja (skarp drift)
- Vi flyttar betalning till Arbetsmiljöcenters konto/kort (de tar all drift).
- Då skalar vi till 100–150 samtal/dag + flera agenter + kunskaps-vault.

---

## Vad jag (Claude) gör parallellt
- ✅ Säljmanus klart (`saljmanus.md`)
- ✅ Agent-config + system-prompt klart (`retell-agent-config.md`)
- ⏳ Justerar prompten efter ditt första testsamtal
- ⏳ Förbereder kunskaps-vault + skalning till Spår 2 (self-host) när dealen är spikad

## Vad jag behöver från dig
1. Säg till när kontot är skapat.
2. Skicka feedback efter första testsamtalet (lät rösten bra? följde den manuset?).
3. Bekräfta: ska agenten säga direkt att den är AI, eller bara om någon frågar?
