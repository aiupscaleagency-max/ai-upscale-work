---
name: course-episode-pipeline
description: Producerar ett komplett kursavsnitt (10 min video) för CEO with ADHD-kursen. Aktiveras när Mike säger "skapa kursavsnitt om X", "producera avsnitt N", "build episode X", "kurs-video om Y", eller liknande. Multi-step TaskFlow som överlever restarts.
---

# Course Episode Pipeline (CEO with ADHD)

## När aktiveras
- "skapa kursavsnitt om X"
- "producera avsnitt N"
- "build episode about X"
- "kurs-video om Y"

## Pipeline-flöde (8 steg, ~30-60 min per avsnitt)

### Input
- **Ämne** (obligatoriskt) — t.ex. "ADHD och prioriteringar"
- **Avsnittsnummer** (valfritt — default: nästa lediga)
- **Längd-mål** (valfritt — default: 10 min)
- **Outline** (valfritt — om saknas, agenten outlinar själv)

### Steg 1: Script-writing (~3 min)
- Modell: `openrouter/deepseek/deepseek-chat-v3.1` (paid, ~$0.05)
- Skriv 10-min script på svenska, hooks varje 90 sek (ADHD-anpassat)
- Struktur: Hook → Problem → Lösning → Verktyg → CTA
- Mike's "content voice" (aktivera `mike-content-voice` skill — inget AI-sound)
- Output: `/data/content/course/episode-N/script.md`

### Steg 2: Storyboard (~5 min)
- Modell: `google/gemini-2.5-flash` (gratis)
- Dela script i 10-15 scener (~40-60 sek var)
- För varje scen: bild-prompt + scene-beskrivning + voice-segment
- Output: `/data/content/course/episode-N/storyboard.json`

### Steg 3: Bilder (~10 min)
- Skill: `image-via-imagen`
- 10-15 nyckelbilder (16:9), professional cinematic stil
- Style-prompt: "professional course thumbnail, modern minimalist, warm tones, soft lighting"
- Output: `/data/content/course/episode-N/images/scene-N.png`

### Steg 4: Voice-narration (~5 min)
- Skill: `voice-via-elevenlabs`
- Voice-settings: kurs-narration (stability 0.6, similarity 0.75)
- Dela script per scen → en MP3 per scen
- Output: `/data/content/course/episode-N/audio/scene-N.mp3`

### Steg 5: Video-clips (valfritt — om Veo aktiv) (~10 min)
- Skill: `video-via-veo` ELLER skip om gratis tier slut
- B-roll-clips för 3-5 nyckelscener
- Output: `/data/content/course/episode-N/clips/`

### Steg 6: Musik intro/outro (~2 min, manuell tills MusicFX-skill byggs)
- Använd royalty-free från Mike's bibliotek tills MusicFX-skill är klar
- Fallback: skip om inte tillgängligt

### Steg 7: Assembly via Remotion (~5 min)
- Skill: `remotion`
- Input: storyboard.json + bilder + audio + (clips)
- Render: 1080p MP4, h264, 10 min
- Output: `/data/content/course/episode-N/final.mp4`

### Steg 8: Notifiering (~10 sek)
- Telegram-meddelande till Mike med:
  - Avsnittsnummer + ämne
  - Preview thumbnail (första bilden)
  - Path till MP4
  - Stats: tid, kostnad, ev. fel
  - Action-knappar: "godkänn", "redigera", "regenerera"

## State-tracking (TaskFlow)
- State sparas i `/data/content/course/episode-N/state.json`
- Vid steg-fail: retry max 3 gånger, exponential backoff
- Vid steg N completed: state.json uppdateras → om gateway restartar, kan pipeline fortsätta från sista lyckade steg

## Output-struktur
```
/data/content/course/episode-N/
├── state.json           ← TaskFlow state
├── script.md            ← Steg 1
├── storyboard.json      ← Steg 2
├── images/              ← Steg 3
│   ├── scene-01.png
│   └── ...
├── audio/               ← Steg 4
│   ├── scene-01.mp3
│   └── ...
├── clips/               ← Steg 5 (optional)
├── final.mp4            ← Steg 7
└── audit.log            ← Komplett kostnad + tider
```

## Per-avsnitt-budget (uppskattat)
- Script (DeepSeek paid): $0.05
- Storyboard (Gemini gratis): $0
- Bilder (Imagen 3 gratis): $0
- Voice (ElevenLabs paid): $0.30 (eller $0 free-tier för första 5)
- Video clips (Veo gratis): $0
- Assembly (lokal Remotion): $0
- **Total: ~$0.35/avsnitt** = **~$10.50 för alla 30 avsnitt**

## Vid avbrott
- Mike kan när som helst skicka "stoppa avsnitt N" → graceful pause
- "fortsätt avsnitt N" → resume från sista state
- "regenerera steg X för avsnitt N" → bara om-kör det steget
