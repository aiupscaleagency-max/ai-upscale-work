# ThyroidAI — Master Plan för Lanserings­video

**Mål:** 4 färdiga videos från en enda inspelnings­session där du själv går igenom appen.

**Tid att producera:** 2–3 timmar inspelning + 4–6 timmar AI-bearbetning.

---

## DE 4 VIDEORNA

| # | Video | Längd | Var den används | Manus-fil |
|---|-------|-------|-----------------|-----------|
| 1 | **Lansering / Walkthrough** | 10–15 min | YouTube, hemsida, LinkedIn, sales calls | `01-MANUS-launch.md` |
| 2 | **Förklarings­video (kort)** | 60–90s | Annonser, TikTok, Reels, hero på hemsida | `02-MANUS-explainer.md` (klipps från #1) |
| 3 | **Personlig medlems­video** | 2–4 min | Mejl till medlemmar, Telegram, intern kommunikation | `03-MANUS-member.md` |
| 4 | **Add to Home Screen** | 45–60s | Onboarding, FAQ, support-mejl | `04-MANUS-home-screen.md` |

---

## FÖRE INSPELNING — Pre-flight checklist

### 1. Förbered demo-kontot (15 min)

Logga in på `app.thyroidaiclinic.com` med `demo.patient@thyroidaiclinic.com`. Gå igenom dessa **i ordning**:

- [ ] **Slutför onboarding** så popupen "Your team is still getting to know you" försvinner. Klicka:
  - 🍪 Complete onboarding → svara på alla 8 frågor (eller hoppa över med dummy-svar)
  - 🎯 Set your health goals → välj 2–3 mål (t.ex. "Optimize TSH", "Reduce fatigue")
  - ✨ Share your dream → skriv 1–2 meningar
- [ ] **Avfärda "Enable reminders"-bannern** → klicka "Not now" eller "Enable" (du vill att den försvinner)
- [ ] **Ladda upp 1 demo-blodprov** under `/dashboard/documents` så `/dashboard/analyses` har data att visa
  - Demo-PDF finns i mappen `FIKTIV PERSON - Thyroid AI - FIKTIVT SJUK/` i repot
- [ ] **Skicka 2–3 chat-meddelanden** så `/dashboard/chat` har historik:
  - "My TSH is high"
  - "What supplements should I take?"
  - "I'm struggling mentally"
- [ ] **Sätt språk till engelska** — klicka 🇬🇧 EN-flaggan uppe till höger
- [ ] **Stäng "Install ThyroidAI app"-popupen** uppe till höger (X)

### 2. Förbered Chrome (5 min)

- [ ] Öppna Chrome i **inkognito-läge** (cmd+shift+n) — slipper bookmarks-bar
- [ ] Tryck `cmd+0` för att resetta zoom till 100%
- [ ] Aktivera mörkt läge i appen om det inte redan är på
- [ ] **Göm bookmarks bar** (cmd+shift+B om den syns)
- [ ] Maximera fönstret — undvik att fönsterramen syns

### 3. Förbered macOS (5 min)

- [ ] Sätt på **Stör ej** (focus-läge → "Do Not Disturb")
- [ ] Stäng Slack, mejl, Discord — alla notiser
- [ ] Göm Dock (System Settings → Desktop & Dock → "Automatically hide")
- [ ] Göm menyrad (System Settings → Control Center → Menu Bar → "Always" hide)
- [ ] Cursor: överväg **Cursor Pro** eller **Mousecape** för större/snyggare cursor
- [ ] Rensa skrivbordet (cmd+F3 → eller flytta filer till en temp-mapp)

### 4. Inspelnings­verktyg (välj ETT)

| Verktyg | Pro | Con | Pris |
|---------|-----|-----|------|
| **Screen Studio** ⭐ rekommenderas | Auto-zoom på cursor, snyggast output | Mac-only | $89 engångs |
| **ScreenFlow** | Bra editor inbyggd | Lite klumpig UI | $169 |
| **OBS Studio** | Gratis, kraftfull | Brant inlärning | Gratis |
| **CleanShot X** | Snabb, snyggt cursor | Ingen auto-zoom | $29 |
| **QuickTime** | Inbyggt | Inga effekter | Gratis |

**Min rekommendation:** Screen Studio. Auto-zoom på där du klickar är 80% av varför premium-tutorials ser så snygga ut.

### 5. Mikrofon

- [ ] Använd **extern mic** om du har — AirPods Pro / Shure MV7 / iPhone (via continuity)
- [ ] **Testa nivå** först — spela in 30s, lyssna. Background noise = nej.
- [ ] **Sitt i tyst rum** — stäng dörrar, fönster, ventilation
- [ ] **Vatten i närheten** — torr mun = dålig audio

### 6. Inspelnings-settings

- **Resolution:** 1920×1080 (1080p) eller 2880×1800 om du har Retina och vill ha mer marginal för cropping
- **FPS:** 60 (smoothare scrolls)
- **Cursor:** Stor cursor med highlight-effekt vid klick (Screen Studio gör detta auto)
- **Audio:** 48kHz, AAC eller WAV

---

## INSPELNINGS-FLÖDET

Spela in **ALLT i en lång session** — du klipper sedan ut delar för olika videos.

**Tid:** Räkna med 45–60 min med 2–3 omtagningar.

**Total råmaterial:** ~25–35 min ofta, klipps ner till 10–15 min final.

### Workflow

1. **Öppna manus** (`01-MANUS-launch.md`) i ena hälften av skärmen, app i andra
2. **Klick Record** i Screen Studio
3. **Läs upp manuset** medan du gör handlingarna i appen — använd "talk-to-action"-stil:
   - "När jag klickar här..." [klick]
   - "Det här är vad min mamma aldrig fick..." [scroll]
4. **Pausa** mellan stora sektioner — gör det enkelt att klippa
5. **Tag om** om du säger fel — bara börja om från senaste pausen, du klipper sedan
6. **Spara råfilen** som `walkthrough-raw-2026-05-10.mp4` i `~/Desktop/thyroidai-video-assets/raw/`

---

## EFTER INSPELNING — Bearbetnings­pipeline

### Steg 1: Klipp ut delarna (30 min)

Använd Screen Studio / ScreenFlow / DaVinci Resolve (gratis):

- **MAIN CUT** → 10–15 min lansering / walkthrough
- **EXPLAINER CUT** → klipp ner MAIN till 60–90s (bara hooks + key features + CTA)
- **MEMBER CUT** → klipp ut 2–4 min av familje-storyn + dashboard-show
- **HOME SCREEN CUT** → klipp ut 45–60s tutorial-delen

### Steg 2: Lägg till AI-genererat material (1–2 h)

Använd verktygen i `05-AI-TOOLS-PLAYBOOK.md`:

- **Voiceover på spanska/engelska**: ElevenLabs voice clone av din röst → mata in transkriptet
- **B-roll** (stock-bilder/animationer): Fal.ai (image-to-video) eller InVideo.ai (stock)
- **Captions**: Auto-genererade i Screen Studio eller via OpusClip

### Steg 3: Slutexport

| Video | Resolution | Format |
|-------|-----------|--------|
| Launch (10–15 min) | 1920×1080 | MP4, H.264, ~10 Mbps |
| Explainer (60–90s) | 1920×1080 | MP4, H.264, ~12 Mbps |
| Member (2–4 min) | 1920×1080 | MP4, H.264, ~10 Mbps |
| Home screen (45–60s) | 1080×1920 (vertikal!) | MP4, H.264, ~12 Mbps |

### Steg 4: Distribution

- **Launch** → ladda upp till YouTube, embed på `thyroidaiclinic.com`, posta på LinkedIn
- **Explainer** → använd som hero-video på hemsidan, klipp till TikTok/Reels-version (1080×1920)
- **Member** → mejla till befintliga medlemmar, Telegram, in-app-meddelande
- **Home screen** → onboarding-flödet i appen, FAQ-sidan, support-mejl

---

## MANUSFILERNA (i samma mapp)

- [`01-MANUS-launch.md`](./01-MANUS-launch.md) — Lång walkthrough, 10–15 min
- [`02-MANUS-explainer.md`](./02-MANUS-explainer.md) — Kort 60–90s
- [`03-MANUS-member.md`](./03-MANUS-member.md) — Personlig till medlemmar
- [`04-MANUS-home-screen.md`](./04-MANUS-home-screen.md) — Tutorial 45–60s
- [`05-AI-TOOLS-PLAYBOOK.md`](./05-AI-TOOLS-PLAYBOOK.md) — Färdiga prompts till InVideo, Fal.ai, ElevenLabs

---

## MIKES PRINCIPER (gäller varje video)

1. **Familje-tonen genomsyrar allt** — "byggt för min mamma, inte för pengar, priset finns bara för att hålla AI:n igång"
2. **Aldrig "köp"** — alltid "kom in", "prova", "se själv"
3. **Aldrig hype** — alltid sanning. Säg vad appen INTE är (inte en läkare, inte en diagnos)
4. **Engelska först** — primär marknad är internationell. SV och ES är för specifika kanaler
5. **Hooks under 3 sekunder** — TikTok/Reels-publik scrollar förbi snabbare än det

---

## NÄSTA STEG

1. **Du:** Gå igenom pre-flight checklist (steg 1–6 ovan) — räkna 30 min
2. **Du:** Läs `01-MANUS-launch.md` 1–2 gånger så det sitter
3. **Du:** Spela in walkthrough-session — 45–60 min
4. **Du:** Skicka råfilen i Google Drive eller `~/Desktop/thyroidai-video-assets/raw/`
5. **Jag:** Tar över råfilen → klipper, lägger till captions/voiceover, exporterar 4 videos
