# AI-TOOLS PLAYBOOK — InVideo.ai, Fal.ai, ElevenLabs

Färdiga prompts du klistrar in. Inga "skriv en bra prompt"-gissningar.

---

## 1. INVIDEO.AI — Generera explainer från text-prompt

**Vad InVideo.ai gör:** Du matar in en text-beskrivning, AI genererar full video med stock footage + voiceover + captions.

**Bäst för:** Explainer-versionen (60–90s) eller TikTok-content du INTE vill spela in själv.

### PROMPT 1: Hero/Explainer-video (60s, engelska)

Klistra in detta i InVideo.ai's "Generate AI Video" → "From script":

```
Create a 60-second explainer video for ThyroidAI — an AI-powered thyroid health app.

TONE: Personal, empathetic, anti-corporate. NO hype. NO "buy now." Family-driven storytelling.

VOICE: Calm, warm, professional female voiceover (like a caring doctor's friend). Use English.

PACING: Start slow and dramatic. Energy lifts at 0:15. Slow down again at 0:50 for emotional family beat. Calm and clear at end.

VISUAL STYLE: Dark, premium medical aesthetic. Cyan accents. Show real patient pain (woman tired at desk, doctor rushing). Then show clean app UI screens (dashboard, AI chat, lab results). End on logo + URL.

SCRIPT:
[0:00–0:05] "Take the pill. See you in six months." [Show stressed woman looking at lab paper]
[0:05–0:15] "Brain fog. Fatigue. Weight you can't lose. A doctor who has eight minutes." [Show woman struggling at work, looking exhausted]
[0:15–0:25] "What if seven specialists answered — instantly?" [Energetic transition. Show grid of 7 AI doctor avatars]
[0:25–0:35] "Upload your labs. AI reads everything." [Show drag-drop upload UI]
[0:35–0:45] "Get a real answer. With PubMed citations. In seconds." [Show analysis screen with citations]
[0:45–0:55] "Ask anything — twenty-four-seven." [Show chat interface streaming response]
[0:55–1:05] "I built this for my mom. So she'd never feel ignored again." [Slow shot of family photo, soft music swell]
[1:05–1:20] "thyroidaiclinic.com. Three dollars a month. Cancel anytime. Code FIRST100 for twenty percent off." [Logo + URL on screen]

CAPTIONS: Always on. Inter Bold. White on dark with cyan accents on key words.

MUSIC: Cinematic soft piano with gentle swell at 0:55 (family beat). Lo-fi medical/healing genre. Volume 15% under voice.

OUTPUT: 1080x1080 (square) for hero use.
```

### PROMPT 2: TikTok/Reels-version (45s, vertikal)

```
Create a 45-second vertical TikTok video for ThyroidAI — an AI-powered thyroid health app for people whose doctors dismissed them.

FORMAT: 1080x1920 vertical
TONE: Raw, anti-corporate, family-driven. Speaks directly to women aged 25-50 with Hashimoto's or hypothyroidism.

HOOK (0:00-0:03): Big bold text overlay: "Your doctor said 'normal.' But you don't feel normal." — show woman's face, exhausted
PAIN (0:03-0:12): Quick cuts of brain fog, weight gain, fatigue, depression. Voiceover: "Brain fog. Fatigue. 8 kg gained. Doctor: 'Take the pill, see you in 6 months.'"
SOLUTION (0:12-0:20): Visual transition. App UI appears. Voiceover: "What if seven specialists answered — 24/7 — in your pocket?"
PROOF (0:20-0:35): Quick cuts of: lab upload UI, AI chat streaming, analysis page with PubMed citations, activity feed showing "Dr. Maria analyzing trauma patterns"
EMOTIONAL (0:35-0:42): Slow shot. "Built for my mom. She was over-medicated for 12 years."
CTA (0:42-0:45): Logo + URL. "thyroidaiclinic.com. From $3/month."

VOICEOVER: Warm female, casual, NOT polished. Like a friend telling you about something that helped them.
MUSIC: Lo-fi, slightly emotional. Build energy at 0:12. Pull back at 0:35.
CAPTIONS: Bold, large, white with cyan key words. Always visible.
```

---

## 2. FAL.AI — Bilder, video, lip-sync

**Vad Fal.ai gör:** En sida-API för många AI-modeller (Flux, Stable Video Diffusion, Pika, Kling, lip-sync, etc.). Bra för specifika scener du behöver generera.

### USE CASE 1 — Generera "patient pain"-bilder (Flux 1.1 Pro)

Open `https://fal.ai/models/fal-ai/flux-pro/v1.1` och prompt:

```
Cinematic photo of a tired woman in her late 30s sitting at a kitchen table at dawn, holding a thyroid lab result paper with red highlighted "TSH 4.8". She's looking out the window with exhaustion. Soft warm sunrise light through curtain. Shallow depth of field. Photorealistic, medical documentary style, muted colors. NOT stock photo aesthetic.
```

Generera 4–6 varianter. Använd som B-roll i pain-sektionen.

### USE CASE 2 — Generera "Mike's mom" — anonymisk silhuett

```
Silhouette of a woman in her 60s sitting in a kitchen, soft backlight from window. Warm tones. Photorealistic but face is in shadow / not identifiable. Documentary photography style. 4K.
```

Använd för family-storyn där du säger "min mamma".

### USE CASE 3 — Image-to-video för app demo (Kling AI på Fal)

`https://fal.ai/models/fal-ai/kling-video/v1/standard/image-to-video`

Ladda upp en av app-screenshotsen (t.ex. `15-activity.png`) och prompt:

```
Subtle camera zoom-in on the activity feed. Status indicators pulse softly. UI feels alive but not animated. Cinematic, premium, slow movement. 5 seconds.
```

Output: Du får en 5-sek video där dashboard "lever" med subtila animationer. Använd som B-roll.

### USE CASE 4 — Lip-sync för voiceover på din egen video (Sync Labs)

`https://fal.ai/models/sync-labs/lipsync` eller `wav2lip`

Mata in:
- Din inspelade video (där du pratar)
- En MP3 med dubbat språk (t.ex. spanska från ElevenLabs voice clone)

Output: Din video men med läpparna synkade till spanska ljudet. Bra för internationella versioner utan att spela om.

---

## 3. ELEVENLABS — Voice clone + multi-language voiceover

**Vad det gör:** Klona din röst en gång, generera unlimited voiceover på alla språk.

### Steg 1 — Skapa voice clone

1. Logga in på `https://elevenlabs.io`
2. Välj "Voices" → "Add Voice" → "Instant Voice Cloning"
3. Ladda upp 30s–2 min ren ljud av dig som pratar (engelska, lugnt)
4. Namnge: "Mike — Founder Voice"
5. Klart. ~30 sek.

### Steg 2 — Generera voiceover

I "Speech Synthesis":
- **Voice:** Mike — Founder Voice
- **Model:** Eleven Multilingual v2 (stödjer 29 språk inkl. spanska, engelska, svenska)
- **Stability:** 50%
- **Similarity:** 75%
- **Style:** 30%
- **Speaker Boost:** ON

### Färdiga prompts du klistrar in

**Engelska — launch-video opening:**

```
My name is Mike. Three years ago I sat across from my mom in her kitchen, and she was crying. Not because of pain. Because nobody listened. She'd been told for twelve years: "Take the pill. See you in six months." Twelve years of fatigue, brain fog, weight she couldn't lose, depression nobody connected to her thyroid. Twelve years of being told her labs were "normal." So I built her a real care team.
```

**Spanska — samma sektion:**

```
Me llamo Mike. Hace tres años me senté frente a mi mamá en su cocina, y ella estaba llorando. No por dolor. Porque nadie la escuchaba. Durante doce años le dijeron: "Toma la pastilla. Nos vemos en seis meses." Doce años de fatiga, niebla mental, peso que no podía perder, depresión que nadie conectaba con su tiroides. Doce años de que le dijeran que sus análisis eran normales. Así que le construí un verdadero equipo de cuidado.
```

**Svenska — samma sektion:**

```
Jag heter Mike. För tre år sedan satt jag mittemot min mamma i hennes kök, och hon grät. Inte av smärta. För att ingen lyssnade. I tolv år hade hon fått höra: "Ta pillret. Vi ses om sex månader." Tolv år av utmattning, hjärndimma, vikt hon inte kunde tappa, depression som ingen kopplade till hennes sköldkörtel. Tolv år av att få höra att hennes prover var normala. Så jag byggde henne ett riktigt vårdteam.
```

Använd för alla 4 manus i de andra filerna — bara att klistra in transkript-versionerna.

### Tips

- **Spara samma settings** för alla generationer i samma video — annars blir röstkaraktären inkonsekvent
- **Lägg till SSML-pauser** vid känslomässiga beats: `<break time="0.8s" />` mellan meningar för dramatisk effekt
- **Generera i 60–90 sek-stycken** — om du ger för lång text kan kvaliteten glida

---

## 4. OPUSCLIP — Auto-genererade clips från lång video

**Vad OpusClip gör:** Du laddar upp en 10–15 min video, AI klipper ut 20–40 vertikala TikTok-clips automatiskt med captions.

**Use case:** Mata in din inspelade Launch-video (från `01-MANUS-launch.md`) → få 30+ TikTok-versioner ut.

### Workflow

1. Logga in `https://www.opus.pro/`
2. Upload din rendered launch-video
3. Välj "ClipAnything" mode
4. Settings:
   - **Aspect ratio:** 9:16 vertical
   - **Captions:** ON, "Trendy" style
   - **Length:** 30–60s clips
   - **Number of clips:** 30
5. Klick "Get Clips" → vänta 5–10 min
6. Få 30+ clips med captions, redo att posta

OpusClip's "virality score" rankar dom — börja med top 5.

---

## 5. PIPELINE — så här kombinerar du allt

```
1. INSPELNING (du själv)
   ↓
   Råfilm: 25-30 min walkthrough på engelska
   ↓
2. GROVKLIPPNING (Screen Studio / DaVinci Resolve)
   ↓
   3 master-cuts: Launch (10-15 min), Member (2-4 min), Home Screen (45s)
   ↓
3. VOICEOVER på SV + ES (ElevenLabs voice clone)
   ↓
   3 versioner per master = 9 voiceover-spår
   ↓
4. SAMMANFOGNING (DaVinci Resolve)
   ↓
   9 färdiga MP4:er (3 videos × 3 språk)
   ↓
5. AUTO-CLIPS (OpusClip)
   ↓
   Mata in Launch-video → 30+ TikTok-clips med auto-captions
   ↓
6. AI-EXPLAINER (InVideo.ai) — parallellt
   ↓
   60s explainer som du INTE spelar in själv
   ↓
7. AI B-ROLL (Fal.ai) — parallellt
   ↓
   "Pain"-scenerier + "mom"-silhuett som inte finns i app
   ↓
8. DISTRIBUTION
   ↓
   YouTube: Launch-video (long form)
   Hemsidan: Explainer (square 1080x1080)
   TikTok/Reels: 30+ OpusClip-versioner + Reel manus
   Mejl: Member-video
   FAQ: Home Screen tutorial
```

---

## KOSTNADS­UPPSKATTNING

| Verktyg | Kostnad | Användning |
|---------|---------|-----------|
| Screen Studio | $89 engångs | Inspelning + grov-klippning |
| DaVinci Resolve | Gratis | Sammanfogning + finishing |
| ElevenLabs Pro | $22/mån | Voice clone + multi-language |
| InVideo.ai | $30/mån | AI-genererad explainer |
| Fal.ai | Pay-per-use ~$10–30 | B-roll + lip-sync |
| OpusClip | $19/mån (eller $99/år) | Auto-clips till TikTok |
| **Total** | ~$80–100 första månaden | Alla videos klara |

Eller: Skip InVideo + Fal.ai = ~$50/mån. Bara ElevenLabs + OpusClip + Screen Studio (engångs).

---

## NÄSTA STEG

1. **Du:** Spela in walkthrough enligt `01-MANUS-launch.md` (45–60 min sittning)
2. **Du:** Använd ElevenLabs för att klona din röst (5 min)
3. **Du:** Mata in transkripten → få SV + ES voiceover (10 min)
4. **Du:** Skicka råfilm + voiceovers till mig
5. **Jag:** Tar över i DaVinci Resolve, klipper 4 master-versioner, exporterar
6. **Du:** Ladda upp till OpusClip för auto-TikTok-versioner
7. **Vi:** Distribuerar enligt distributionsplanen
