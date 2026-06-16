# GLENNS DEMO — snabbaste vägen att ringa hans mobil

> Mål: agenten ringer **Glenns mobil**, han pratar med den på svenska. Via Agora Agent Studio (ingen kod).
> Tidsåtgång: ~30–60 min om kontona finns.

---

## ⚠️ Läs först (ärlig flaskhals)
Agoras utgående telefoni (PSTN) är **beta** → kan kräva att du **mejlar Agora Support** för att aktivera.
Om det inte hinner aktiveras till imorgon: **Vapi eller Retell ger utgående samtal direkt** (ingen beta) —
fallback för att ändå nå Glenn. Samma svenska prompt nedan funkar där också.

---

## Steg 1 — Twilio (numret + linjen)
1. twilio.com → skapa konto.
2. **Phone Numbers → Buy a number** → köp ett nummer (svenskt om möjligt).
3. **Elastic SIP Trunking → Trunks → Create** → notera **Termination SIP URI** (t.ex. `xxx.pstn.twilio.com`).
4. Under Termination → skapa **Credential List** (användarnamn + lösenord).
5. Koppla numret till trunken.

## Steg 2 — Agora: koppla numret
**Console → Phone Numbers → Add Phone Number:**
| Fält | Värde |
|---|---|
| Phone Number | Ditt Twilio-nummer (+46…) |
| Vendor | SIP Trunk |
| SIP Trunk Address | Twilio Termination SIP URI |
| Username / Password | Från Credential List |
| Transport Protocol | TLS |

## Steg 3 — Agora: bygg agenten (Agent Studio)
Öppna din agent (eller skapa ny) → fliken **Prompt**:
- **System Prompt:** klistra in hela prompten från `agent-prompt-svenska.md`.
- **Greeting Message:** se samma fil.
- Fliken **Models:** LLM = Gemini · TTS = **ElevenLabs svensk röst** (mest mänsklig) · STT = Deepgram/Google **språk: sv**.
- **Publish Agent** (uppe till höger) — agenten måste vara publicerad för att ta samtal.

## Steg 4 — Ring Glenn
**Campaign** (eller outbound-test):
1. Skapa en lista med EN rad = Glenns mobilnummer (+46…).
2. Koppla din publicerade agent + Twilio-numret.
3. Starta → agenten ringer Glenn.

> Testa FÖRST mot din egen mobil innan du ringer Glenn.

---

## Röst — snabbt vs wow
- **Snabbast:** ElevenLabs färdig svensk röst (ingen kloning, låter redan mänsklig).
- **Wow (om tid):** klona din röst, se `../ROST-klon-elevenlabs.md`. Spela in samplet PÅ SVENSKA.

## Nycklar du behöver
- Agora App ID + App Certificate
- Gemini API-nyckel (Google AI Studio)
- ElevenLabs API-nyckel (+ ev. klonad Voice ID)
- Twilio konto (nummer + SIP-trunk)
