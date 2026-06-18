# gemini-voice-bridge

Twilio ↔ Gemini Live API-relä — Plan B om Agoras inbyggda Gemini-stöd (se längst ner) inte
räcker till. Bygger en egen telefonbrygga så agenten kan prata SVENSKA oavsett plattform.

## Vad den gör
1. Twilio öppnar en bidirektionell Media Stream (`<Connect><Stream>`) mot servern via WebSocket
   när ett samtal kopplas upp (inkommande eller utgående).
2. Servern konverterar ljudet: Twilio skickar 8kHz mulaw → blir 16kHz PCM16 → till Gemini Live.
   Gemini svarar med 24kHz PCM16 → blir 8kHz mulaw → tillbaka till Twilio.
3. System-prompten läses direkt från
   `../Customer_Projects/Arbetsmiljocenter/Fast Agent Setup - GLENNS DEMO/glenn-meta-sell-agent-prompt-svenska.md`
   vid serverstart — ändra prompten DÄR, inte i koden.
4. Eftersom Mike ringer Glenn (utgående samtal) säger agenten ingenting förrän Twilio-strömmen
   startar — då triggar servern automatiskt hälsningsfrasen.

## Steg för steg

1. **Installera**
   ```
   cd gemini-voice-bridge
   npm install
   ```
2. **Fyll i .env** (kopiera `.env.example` → `.env`, aldrig commitas)
   - `GOOGLE_API_KEY` — från https://aistudio.google.com/apikey
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` — från Twilio-konsolen
   - `TARGET_PHONE_NUMBER` — Glenns nummer (eller din egen mobil för test FÖRST)
   - `PUBLIC_BASE_URL` — publik HTTPS-adress Twilio ska nå servern på
3. **Starta:** `npm start`
4. **Gör servern publikt nåbar**
   - Snabbtest: `ngrok http 8080` → klistra https-url:en in i `PUBLIC_BASE_URL`, starta om.
   - Produktion: kör som ny process/container på befintliga Hostinger VPS-en (76.13.149.231)
     bakom samma nginx/Caddy som redan terminerar TLS för ThyroidAI — ingen ny VPS behövs.
5. **Testa mot egen mobil FÖRST** (husregel, se `GLENN-DEMO-steg.md`):
   `npm run call -- +46DITT-EGET-NUMMER`
6. **Ring Glenn:** `npm run call -- +46GLENNS-NUMMER`

## Felsökning
- **Knaprigt ljud** → `resampleLinear` i `server.js` är enkel linjär interpolation, inte
  studio-kvalitet. Byt till ett riktigt resampling-bibliotek om det stör.
- **Modellen svarar på engelska** → `gemini-live-2.5-flash` respekterar
  `speechConfig.languageCode=sv-SE` explicit. Native-audio-modeller (t.ex.
  `gemini-live-2.5-flash-native-audio`) låter mer naturliga men väljer språk automatiskt utan
  explicit språkfält — byt bara om ni testat att den håller sig på svenska hela samtalet.
- **Fel modellnamn** → Gemini Live API är i preview, namn ändras. Kolla
  https://ai.google.dev/gemini-api/docs/models om `ai.live.connect` kastar fel.

## Enklare alternativ — Agora har redan inbyggt Gemini Live-stöd
Innan ni bygger ut det här: Agoras Conversational AI Engine har en inbyggd "MLLM"-integration
för Google Gemini Live (https://docs.agora.io/en/conversational-ai/models/mllm/gemini) — det
ersätter hela ASR→LLM→TTS-kedjan med ett enda anrop till Gemini, och språket styrs av samma
`speech_config.language_code`. Om den vägen ger svenska rakt i Agora-gränssnittet ni redan
använder slipper ni helt den här Twilio-servern. Se chattloggen/projektnoteringen för
avstämning av vilken väg som valdes.
