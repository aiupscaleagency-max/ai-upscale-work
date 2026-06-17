# 02 — Video Spec (teknisk mall)

> Varje video använder EXAKT denna mall. Det enda som ändras mellan videor är **flip-typen (A/B)** och manuset.

---

## 1. ⭐ Flip-mekaniken (din kärnidé — vår signatur)

**Regel: Avatar och bakgrund är ALLTID motsatt stil. Växla A → B → A → B genom hela serien.**

| Typ | Dr. Vee (PiP) | Bakgrundsscen | Används |
|---|---|---|---|
| **Typ A** | **Realistisk** (foto/AI-video av riktig läkare) | **Animerad** (tecknad klinik, TSH-skurken, motion graphics) | Udda videor (#01, #03, #05…) |
| **Typ B** | **Animerad** (tecknad Dr. Vee) | **Realistisk** (riktigt stock-footage: trött person, väntrum, labb) | Jämna videor (#02, #04, #06…) |

- **Samma karaktärsdesign** i båda (se `01_CHARACTERS.md`) — bara renderingsstilen skiljer.
- Flippen i sig blir igenkänningssignalen: *"åh, det är det där läkar-kontot där stilen alltid byts."*
- **Aldrig** blanda två stilar på avataren i samma video.

---

## 2. Layout (samma varje video)

```
┌─────────────────────────┐  9:16 (1080×1920)
│                         │
│     BAKGRUNDSSCEN       │  ← Typ A: animerad / Typ B: realistisk
│   (illustrerar skämtet) │
│                         │
│   [ CAPTIONS mitten ]   │  ← bold, samma font, nyckelord i korall
│                         │
│              ┌────────┐ │
│              │Dr. Vee │ │  ← PiP: nedre HÖGER hörn
│              │  🦋    │ │     ~32% bredd, rundad ruta, TEAL ram
│              └────────┘ │
└─────────────────────────┘
```

| Element | Spec |
|---|---|
| **Format** | 9:16, 1080×1920, <60s (sikta 18–35s) |
| **PiP-position** | Nedre höger, ~30–35% av bredden, **konsekvent varje video** |
| **PiP-ram** | Rundad rektangel eller cirkel, **teal kant** (2–4px) |
| **Captions** | Alltid på. Centrerade ~60% höjd. Bold sans (t.ex. Montserrat/TikTok-default). Nyckelord highlightas i **korall**. |
| **Disclaimer** | Liten rad sista 2s: *"Educational. Not medical advice."* |

---

## 3. Intro / Outro (samma stinger varje gång = brand)

| Del | Spec | Längd |
|---|---|---|
| **Intro-stinger** | 🦋 fjäril "fladdrar in" + ljud-signatur (samma 0.5s sound) | 0.5s |
| **Outro-card** | Teal kort: **ThyroidAI**-logo + 🦋 + CTA-text + "Link in bio" | 2–3s |
| **Musik** | Samma vibe varje video (torr/lekfull lo-fi eller deadpan-beat). Lås 1–2 spår. | hela |

---

## 4. Filnamn / namnkonvention

```
TAI_[pillar]_[typ]_[nr]_[slug].mp4

Exempel:
TAI_P1_A_01_labs-are-normal.mp4
TAI_P2_B_02_lazy-symptoms.mp4
```

| Del | Värden |
|---|---|
| `pillar` | P1 / P2 / P3 / P4 |
| `typ` | A (real avatar) / B (anim avatar) |
| `nr` | löpnummer 01, 02… |
| `slug` | kort engelsk beskrivning |

---

## 5. Per-video checklista (innan posting)

- [ ] Rätt flip-typ (A/B) enligt löpnummer
- [ ] Dr. Vee signatur intakt (röda glasögon + 🦋 + teal scrubs)
- [ ] PiP nedre höger, teal ram
- [ ] Hook i första frame
- [ ] Captions på, nyckelord i korall
- [ ] CTA + 🦋 i outro-card
- [ ] Disclaimer-rad sista 2s
- [ ] Spice-nivå inom regel (max 1/5 på 🌶️3)
- [ ] Postas på TikTok/Reels/FB/Shorts — **aldrig LinkedIn**
