# 03 — Production Pipeline

> Två vägar: **Snabb** (kom igång idag) och **Skalbar** (Remotion — konsekvent mall, återanvänds 100ggr). Börja snabbt, flytta till skalbart när formatet sitter.

---

## Verktygskedjan (vad gör vad)

| Steg | Snabb väg | Skalbar väg | Notis |
|---|---|---|---|
| **1. Avatar (talande Dr. Vee)** | HeyGen / D-ID (real + animerad talking-head) | Samma | Lås EN referensbild per stil (`01_CHARACTERS.md`) |
| **2. Röst** | **ElevenLabs** (du använder redan) | ElevenLabs | Lås EN röst för Dr. Vee — torr, lugn, sarkasm |
| **3. Bakgrundsscen** | Animerad: AI-bild→video (Kling/Runway/Sora) · Realistisk: stock (Pexels/Storyblocks) | Samma | Typ A = anim bg, Typ B = real bg |
| **4. Captions** | CapCut auto-captions / Captions.ai | Remotion (kod-genererade) | Nyckelord i korall |
| **5. Komposit (PiP+intro+outro)** | **CapCut** (mall sparas, återanvänds) | **Remotion** (`remotion`-skill) | PiP nedre höger, teal ram |
| **6. Export** | 1080×1920 mp4 | Samma | Filnamn enl. `02_VIDEO_SPEC.md` |

---

## Snabb väg (rekommenderad start — idag)

1. **Generera Dr. Vee** i HeyGen (skapa både en realistisk + en animerad avatar från låsta prompts).
2. **Röst i ElevenLabs** → klistra manus-VO → exportera.
3. Mata VO till HeyGen-avataren → talande PiP-klipp (transparent/grön bakgrund).
4. **Bakgrund:** animerad scen (Typ A) eller stock-footage (Typ B).
5. **CapCut:** spara en **mall** med PiP-ruta (nedre höger, teal ram), intro-stinger, outro-card, caption-stil. → Återanvänd för varje video, byt bara innehåll.
6. Exportera → posta.

> **80/20:** CapCut-mallen är nyckeln. Bygg den EN gång perfekt → varje ny video tar minuter, inte timmar.

---

## Skalbar väg (när formatet sitter — Remotion)

Använd `remotion`-skillen. Remotion komponerar ramen i kod → 100% konsekvent PiP/captions/intro/outro/färg, varje gång, automatiskt.

**Vad Remotion äger:**
- Fast PiP-ruta (nedre höger, teal ram) — pixelidentisk varje video
- Intro-stinger (🦋) + outro-card (ThyroidAI + CTA) som återanvändbara komponenter
- Caption-rendering med korall-highlight
- Disclaimer-rad

**Vad som matas in per video:** avatar-klipp (HeyGen), bakgrund (anim/real), VO-timing, caption-text, flip-typ A/B.

> Trigga med: *"remotion: bygg ThyroidAI short-mall"* när du vill ha den kodbaserade mallen.

---

## ⚠️ LLM/verktygs-kostnad — bekräfta innან byte
Per Mikes regel: fråga + visa pris innan vi låser betalverktyg (HeyGen-plan, Kling/Runway-credits, Storyblocks). Ingen prenumeration startas utan ditt OK.

---

## Batch-rytm (ADHD-vänligt)

| Dag | Gör |
|---|---|
| **Setup (en gång)** | Lås avatarer + röst + CapCut/Remotion-mall |
| **Inspelningsdag (1x/vecka)** | Spela in 5–8 manus i rad (samma flow) |
| **Resten av veckan** | Posta 1/dag, staggered över TikTok/Reels/FB/Shorts |
