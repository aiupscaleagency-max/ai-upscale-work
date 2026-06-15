# Content & Media Team — Master Blueprint
## Uppdaterad 2026-04-20

---

## SYFTE

Ett centralt Content & Media Team i Paperclip som servar ALLA företag och kunder.
Teamet skapas som eget företag i Paperclip med specialiserade agenter.

---

## KLIENTER (företag/projekt som servas)

### Egna företag
| Klient | Typ | Content-behov |
|--------|-----|---------------|
| **AI Upscale Agency** | B2B byrå | LinkedIn, case studies, demos, thought leadership |
| **ThyroidAI** | B2C hälso-app | Patientutbildning, podcasts, sociala medier, blog |
| **CEO with ADHD** | B2C kurs | Kursvideos, reels, podcasts, annonser |

### Kunder
| Klient | Typ | Content-behov |
|--------|-----|---------------|
| **Cluee News** (247K YT subs) | YouTube-nyhetskanal | 20-40 min nyhetsvideos (segment-baserat), thumbnails, shorts |
| **Cali Kingz Coffee** (Thailand) | Lokal coffee shop | Instagram/TikTok reels, produktbilder, stories, menydesign |

### Framtida kunder
Teamet ska vara generiskt nog att onboarda nya kunder med minimal setup.

---

## AGENTER I TEAMET

| Agent | Roll | Uppgifter |
|-------|------|-----------|
| **Content Strategist** | Planerar | Content-kalender, ämnesval, kanalstrategi per klient |
| **Copywriter** | Skriver | Scripts, captions, blogginlägg, ad copy, SEO-texter |
| **Image Creator** | Skapar bilder | Thumbnails, sociala medier-bilder, produktbilder, banners |
| **Video Producer** | Skapar video | Korta reels (15-60s), segment-videos (3-5 min), sammanklippning |
| **Social Media Manager** | Publicerar | Schemaläggning, hashtags, engagement-svar, analytics |

---

## VERKTYG & MODELLER

### Text (gratis)
| Verktyg | Användning | Kostnad |
|---------|-----------|---------|
| Gemini 2.5 Flash | Copy, scripts, captions, blog | **Gratis** |
| Gemini 2.5 Pro | Längre/komplexa scripts, strategi | **Gratis** (free tier) |

### Bild
| Verktyg | Användning | Kostnad | API |
|---------|-----------|---------|-----|
| **Imagen 3** (Google) | Alla typer av bilder | Gratis (free tier) | Google AI Studio |
| **Flux 1.1 Pro** (Replicate) | Högkvalitets thumbnails, produktbilder | ~$0.003/bild | Replicate API |
| **SDXL / Flux Schnell** | Snabba drafts, variationer | ~$0.001/bild | Replicate/Together |

### Video
| Verktyg | Användning | Kostnad | Begränsning |
|---------|-----------|---------|-------------|
| **Veo 2** (Google) | Korta klipp 5-15s | Gratis i AI Studio | Max ~15s per generation |
| **Kling 2.0** | Reels, produktvideos 5-60s | $0.05-0.20/video | Via API |
| **Minimax Video** | Längre segment 15-60s | $0.10-0.50/video | Via Replicate |
| **Runway Gen-3** | Premiumkvalitet | $0.50+/video | Dyrt men bäst kvalitet |

### Ljud/Podcast
| Verktyg | Användning | Kostnad |
|---------|-----------|---------|
| **NotebookLM** | Podcast-generering | Gratis (manuellt) |
| **ElevenLabs** | Voiceover för videos | $5/mån starter |
| **Google TTS** | Enkel voiceover | Gratis (free tier) |

---

## VIDEOFORMAT & STRATEGI

### Korta videos (15-60s) — Reels/Shorts/TikTok
- Genereras direkt med Veo 2 eller Kling
- En prompt → en video
- Bäst för: Cali Kingz, CEO with ADHD tips, ThyroidAI snabbtips

### Medellånga videos (1-5 min) — YouTube/LinkedIn
- 2-3 segment genererade + sammanklippta
- Script → segment-prompts → generera → klipp ihop
- Bäst för: AI Upscale demos, ThyroidAI utbildning

### Långa videos (20-40 min) — YouTube/Podcast
- **Segment-baserad approach:** 8-12 segment x 3-5 min
- Varje segment genereras separat med eget script
- Agenten klipper ihop med FFmpeg eller liknande
- Mellanslag/transitions genereras med Veo 2
- **Workflow:** Research → Script (12 sektioner) → Voiceover → B-roll per sektion → Klipp ihop
- Bäst för: Cluee News nyhetsvideo, CEO with ADHD kursmoduler

---

## CONTENT-PLAN PER KLIENT

### AI Upscale Agency
| Kanal | Frekvens | Format |
|-------|----------|--------|
| LinkedIn | 5x/vecka | Text + bild (thought leadership, case studies) |
| YouTube | 1x/vecka | Demo-video 3-5 min |
| Blog | 2x/mån | SEO-artikel + infographic |

### ThyroidAI
| Kanal | Frekvens | Format |
|-------|----------|--------|
| Instagram | 3x/vecka | Reels (tips), carousel (fakta) |
| YouTube | 1x/vecka | Utbildningsvideo 5-10 min |
| Blog | 2x/mån | Patientguide + podcast-episod |
| Podcast | 1x/vecka | NotebookLM-genererad 15-20 min |

### CEO with ADHD
| Kanal | Frekvens | Format |
|-------|----------|--------|
| Instagram/TikTok | 5x/vecka | Reels (tips, motivation) |
| YouTube | 2x/mån | Kursmodul 20-30 min |
| LinkedIn | 3x/vecka | Text + bild (ADHD CEO-tips) |
| Podcast | 1x/vecka | NotebookLM 15-20 min |

### Cluee News (KUND)
| Kanal | Frekvens | Format |
|-------|----------|--------|
| YouTube | 3-5x/vecka | Nyhetsvideo 20-40 min (segment-baserad) |
| YouTube Shorts | Dagligen | Highlights från lång video 30-60s |
| Thumbnails | Per video | AI-genererad med Flux/Imagen |

### Cali Kingz Coffee (KUND)
| Kanal | Frekvens | Format |
|-------|----------|--------|
| Instagram | 5x/vecka | Produktbilder, stories, reels |
| TikTok | 3x/vecka | Kort video (kaffe-process, stämning) |
| Google Maps | 1x/mån | Uppdatera bilder, erbjudanden |

---

## PAPERCLIP-SETUP

**Företagsnamn:** `Content & Media Factory`
**Typ:** Internt servicebolag — servar alla andra företag
**Agenter:** 5 (Content Strategist, Copywriter, Image Creator, Video Producer, Social Media Manager)
**LLM:** Gemini 2.5 Flash (gratis) för alla agenter
**Bild-API:** Imagen 3 (gratis) + Flux (backup)
**Video-API:** Veo 2 (gratis) + Kling (betalt vid behov)

---

## BILD-INSTRUKTIONER
> Mike tar fram specifika instruktioner per klient.
> Placeholder — fylls i när instruktionerna är klara.

### Generella riktlinjer
- Konsistent stil per klient (brand kit)
- Thumbnails: ansiktsuttryck + stor text + kontrasterande färger
- Produktbilder: clean, ljus, professionell
- Social media: kvadratiskt (1080x1080) eller 9:16 (1080x1920)

---

## VIDEO-INSTRUKTIONER
> Mike tar fram specifika instruktioner per klient.
> Placeholder — fylls i när instruktionerna är klara.

### Generella riktlinjer
- Reels/Shorts: hook inom 1s, snabb takt, textöverlägg
- Långa videos: intro → segment → outro, konsistent ton
- Cluee News: nyhetsankare-stil, professionell, segment-klippning
- Cali Kingz: warm, cozy, kaffe-estetik, lofi-vibe

---

## KOSTNADSKALKYL (per månad)

| Post | Kostnad |
|------|---------|
| Text (Gemini Flash) | **Gratis** |
| Bilder (~500/mån via Imagen) | **Gratis** (free tier) |
| Bilder (Flux backup ~100/mån) | ~$0.30 |
| Video kort (~60/mån via Veo 2) | **Gratis** |
| Video medel/lång (~20/mån via Kling) | ~$4-10 |
| Voiceover (Google TTS) | **Gratis** |
| **TOTAL** | **~$5-15/mån** |

> Runway/ElevenLabs kan adderas om kvaliteten inte räcker, men börja gratis.

---

## PAPERCLIP IDs

| Resurs | UUID |
|--------|------|
| Company: Content & Media Factory | `f2305b69-1ed7-43e5-adff-d27c19d256fb` |
| Agent: Content Strategist (lead) | `b69dc626-7a75-4867-bebc-3669d3fce3f7` |
| Agent: Copywriter | `2753aaaa-154b-4f5e-b509-a2c188455d1f` |
| Agent: Image Creator | `3fcfbc18-54c2-43df-ab17-0eff432bf647` |
| Agent: Video Producer | `8ca44b0e-a8da-4f18-8f63-15bb41e12394` |
| Agent: Social Media Manager | `77a4bd66-80a0-4058-bcb7-a779986f3020` |
| Project: ThyroidAI Content | `e2dc8651-f93b-45b6-832d-72e857466cc7` |

---

## ROUTINES (ThyroidAI — aktiva i Paperclip)

| Rutin | Agent | Cron | Schema |
|-------|-------|------|--------|
| Instagram Reel | Video Producer | `0 8 * * 1,3,5` | Mån/Ons/Fre 08:00 |
| Blog Research | Copywriter | `0 9 1,15 * *` | 1:a & 15:e varje mån 09:00 |
| YouTube Utbildningsvideo | Video Producer | `0 7 * * 2` | Tisdagar 07:00 |
| Podcast Episod | Copywriter | `0 7 * * 4` | Torsdagar 07:00 |
| Social Media Publicering | Social Media Manager | `0 10 * * *` | Varje dag 10:00 |
| Content Kalender | Content Strategist | `0 18 * * 0` | Sondagar 18:00 |

---

## NÄSTA STEG

1. [x] Skapa "Content & Media Factory" som foretag i Paperclip
2. [x] Satt upp 5 agenter med Gemini 2.5 Flash
3. [x] Skapat ThyroidAI Content-projekt med 6 schemalagda rutiner
4. [ ] Koppla Imagen 3 API (Google AI Studio nyckel redan konfigurerad)
5. [ ] Testa Veo 2 API for kort video-generering
6. [ ] Mike: ta fram bild-instruktioner per klient
7. [ ] Mike: ta fram video-instruktioner per klient
8. [ ] Bygg segment-pipeline for Cluee News 20-40 min videos
9. [ ] Onboarda Cali Kingz Coffee med brand kit
10. [ ] Skapa projekt for ovriga klienter (AI Upscale, CEO ADHD, Cluee News, Cali Kingz)
