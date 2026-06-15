---
name: voice-via-elevenlabs
description: Genererar voice/narration via ElevenLabs API. Aktiveras när Mike säger "narra texten", "skapa voice för X", "läs upp", "generera röst", "TTS för Y", "voice over för kursvideo", eller liknande. Sparar MP3 och returnerar path.
---

# Voice via ElevenLabs (Mike's konto)

## När aktiveras
- "narra denna text..."
- "skapa voice för X"
- "TTS för Y"
- "läs upp..."
- "voice over för kursvideo"

## Förkrav
- `ELEVENLABS_API_KEY` i container-env (Mike måste lägga in)
- Voice-ID från Mike's konto (default = Adam multilingual, men Mike kan tränat custom voice)

## Hur skill:en jobbar

1. **Tolka prompten:** Plocka text + ev. voice-style (energisk / lugn / professionell)
2. **Välj voice-ID:**
   - Default: `pNInz6obpgDQGcFmaJgB` (Adam multilingual v2 — bra på svenska)
   - Mike's custom voice om tränat (kolla ELEVENLABS_VOICE_ID env)
3. **Anropa ElevenLabs API:**
   ```bash
   curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
     -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{
       "text": "DIN_TEXT_HÄR",
       "model_id": "eleven_multilingual_v2",
       "voice_settings": {
         "stability": 0.5,
         "similarity_boost": 0.75,
         "style": 0.3,
         "use_speaker_boost": true
       }
     }' \
     --output /data/content/audio/[timestamp]-[slug].mp3
   ```
4. **Spara MP3** till `/data/content/audio/`
5. **Returnera path** + filstorlek + uppskattad längd

## Voice settings per use-case

| Use case | Stability | Similarity | Style |
|----------|-----------|------------|-------|
| Kurs-narration (lugnt, klart) | 0.6 | 0.75 | 0.2 |
| Marketing-energisk | 0.4 | 0.85 | 0.7 |
| ThyroidAI (medicinskt, trovärdigt) | 0.7 | 0.8 | 0.1 |
| YouTube 4 Kids (varmt, lekfullt) | 0.5 | 0.75 | 0.5 |

## Output-format
```
✅ Voice genererad
📁 /data/content/audio/2026-05-24-script-intro.mp3
🎙️ Voice: Adam multilingual
⏱️ ~ 45 sekunder
📊 Storlek: 720 KB
```

## Tecken-budget (free tier: 10k/mån)
- Spåra usage i `/data/content/audio/elevenlabs-usage.log`
- Varna Mike vid 80% av månadskvot
- Vid 100%: säg till Mike "free-tier slut, behöver uppgradera Starter $5/mån"

## Vid fel
- 401 → API-key saknas/fel, säg till Mike
- 429 → rate limit, vänta
- 422 → text för lång (max 5000 tecken/request), dela upp
