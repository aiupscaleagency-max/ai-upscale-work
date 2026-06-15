# AI Upscale Agency — Master 2.0
## Uppdaterad 2026-04-09 | Paperclip-era

---

## VISION & MÅL

**Mission:** 100% AI-agent-drivet företag. Inga anställda. 1 miljard SEK ARR.

### Milstolpar
| Datum | Mål |
|-------|-----|
| 1/6-2026 | Pensionera mamma |
| 2026 | 35 888 800 kr försäljning + 108 888 900 kr intäkter |
| 2026 | 15st high-ticket försäljningar VARJE DAG |
| 1/9-2027 | 1 MILJARD KR omsättning — rekord för 1-man business |
| 2027+ | 1000st AI Agenter & AIOS som jobbar 24/7 |

### Revenue-mål per produkt
| Produkt | Årsmål |
|---------|--------|
| AI Upscale AIOS (B2B) | Huvudintäkten — high-ticket workforce-paket |
| ThyroidAI Clinic (B2C) | 150 000 000 kr/år (alla 21 regioner) |
| CEO with ADHD (B2C) | 100 000 000 kr/år (kurs + AIOS-app) |

---

## FÖRETAGSSTRUKTUR

```
AI UPSCALE AGENCY (Holdingbolag)
│
├── AIOS — AI Upscale's eget AI Operating System
│   ├── B2B Workforce-paket (Starter / Growth / Full)
│   ├── Tripwire-agenter (1 490–2 490 kr)
│   ├── Paperclip-drivet orchestrering
│   └── Säljs via familiarity-loop + LinkedIn outreach
│
├── ThyroidAI (Dotterbolag — B2C hälso-app)
│   ├── 7 AI-specialistläkare för sköldkörtelsjuka
│   ├── B2C: 29–200 kr/mån | B2B: region-licenser
│   ├── Paperclip + Supabase + Gemini Live (röst)
│   ├── NotebookLM → patient-podcasts
│   └── Obsidian → medicinsk kunskapsbas
│
└── CEO with ADHD (Dotterbolag — B2C kurs + coaching)
    ├── 4 Tiers: Videokurs → Kurs+agent → Kurs+app → Kurs+app+coach
    ├── Paperclip-drivet coaching-system
    ├── NotebookLM → kurs-podcasts per modul
    ├── Obsidian → kursinnehåll & frameworks
    └── Cross-sell: kursköpare → AIOS-kunder
```

---

## TECH STACK 2.0 (Post n8n-era)

### Kärna
| Verktyg | Roll | Används av |
|---------|------|------------|
| **Paperclip** | Agent orchestrator — CEO-agent delegerar till team | ALLA tre |
| **Claude Code / API** | Frontier AI-hjärna (Opus 4.6) | ALLA tre |
| **Open Router** | Gratis/billiga LLMs för kundleverans (DeepSeek, Gemini) | ALLA tre |
| **Supabase + pgvector** | Databas, RAG, patient-data, användare | ThyroidAI + AIOS |
| **Obsidian** | Lokal kunskapsbas — struktur, SOPs, content | ALLA tre |
| **NotebookLM** | AI-analys av dokument + podcast-skapare | ThyroidAI + ADHD-kurs |

### Stödjande verktyg
| Verktyg | Roll |
|---------|------|
| **Stripe** | Betalning (alla produkter) |
| **HubSpot (free)** | CRM för B2B-leads |
| **Google Workspace** | Mail, Drive, Docs |
| **Google Drive** | Fillagring, kurs-material (CEO with ADHD) |
| **Hostinger** | Server (SSH: root@72.60.36.92) |
| **Antigravity** | Deployment |
| **Telegram** | Daglig brief, intern kommunikation |
| **Vercel** | Web deployment (hemsidor) |

### Vad som INTE längre är kärna
| Verktyg | Ny roll |
|---------|---------|
| **n8n** | Kvar för specifika automationer (webhooks, Telegram-brief) — INTE orchestrator |
| **Make.com** | Backup för enklare automationer |
| **Airtable** | Ersätts av Supabase där möjligt |

---

## AI UPSCALE — B2B WORKFORCE-PAKET

### Produkter
| Paket | Pris | Innehåll |
|-------|------|---------|
| Tripwire Agent | 1 490–2 490 kr | 1 skräddarsydd agent → upsell |
| Starter Workforce | ~14 900 kr/mån | Litet agent-team via Paperclip, gratis LLMs |
| Growth Workforce | ~34 900 kr/mån | Utökat team + custom skills + QA-agent |
| Full AI OS | ~69 900 kr/mån | Komplett Paperclip-företag med CEO-agent, routines, eval |

### Hur leveransen fungerar (Paperclip-modellen)
1. **Kund-onboarding** — Mike sätter upp Paperclip-company för kunden
2. **CEO-agent** konfigureras med kundens mål, brand guide, värderingar
3. **Agenter hyrs in** baserat på kundens behov (marknadsförare, säljare, utvecklare, QA)
4. **Skills installeras** — anpassade till kundens nisch
5. **Routines sätts upp** — dagliga/veckovisa automatiserade tasks
6. **LLM-routing** — gratis modeller för execution, Claude för strategi
7. **Kunden ser dashboard** — budget, tasks, resultat

### ICP
- VD / COO / Grundare
- 5–50 anställda
- SaaS / Konsult / Rekrytering / Fastighet / Byråer
- Sverige + Norge
- Mål: 15 kunder på 90 dagar

### Säljstrategi — Familiarity-loop
```
Like → Comment → Connect → DM → Call → Offert <4h → Onboarding
```
- Kalla mail: 2–3% konvertering
- Efter familiarity: 15–30% konvertering
- Cross-sell från CEO with ADHD-kursköpare till AIOS

---

## THYROIDAI — DOTTERBOLAG

### Översikt
- **URL:** https://thyroid.aiupscale.agency
- **Produkt:** AI-drivet specialistteam (7 agenter) för sköldkörtelsjuka
- **Marknad:** 600 000+ diagnostiserade i Sverige, 1,5M i Norden
- **Status:** Live med betatestare, Stripe live, Gemini Live pågående

### Tech stack
| Verktyg | Roll |
|---------|------|
| Paperclip | Orchestrerar 7 specialist-agenter |
| Supabase (EU North) | Patient-data, RAG, pgvector |
| Claude Opus 4.6 | Medicinsk analys (Dr. Sofia, Dr. Maria, Jurist Eva, Dr. Patel) |
| DeepSeek R1 (free) | Coach Anna — verktyg/frameworks |
| Gemini 2.0 Flash | Dr. Juan — nutrition/recept + Gemini Live röst |
| NotebookLM | Patient-podcasts ("Förstå din sköldkörtel") |
| Obsidian | Medicinsk kunskapsbas, PubMed-sammanfattningar |
| Next.js 16 | Webb-app |
| Stripe | Betalning (29–200 kr/mån) |

### Prissättning B2C
| Tier | Pris |
|------|------|
| Grundare | 29 kr/mån |
| Supporter | 50 kr/mån |
| Pionjär | 100 kr/mån |
| Visionär | 200 kr/mån |

### Prissättning B2B
| Modell | Uppskattning |
|--------|-------------|
| Per region | 5–15 kr/invånare/år |
| Per patient | 50–120 kr/patient/mån |
| White label | Projektpris + löpande |

### 7 Specialist-agenter
1. Dr. Sofia Reyes — Sköldkörtelläkare (Lead)
2. Dr. Maria Lindström — Traumapsykolog
3. Vägledare Amara — Andlig & existentiell
4. Coach Anna Bergström — Mental coach
5. Dr. Juan Castillo — Nutritionsläkare
6. Jurist Eva Lindgren — Patienträttigheter
7. Dr. Arjun Patel — Medicinsk forskare

### Betatestare
- Mikes mamma (Apple) — Patient #1
- Mikes syster (Android)
- Mikes bror
- Broders sambos bästa vän (remarkabel läkning)

---

## CEO WITH ADHD — DOTTERBOLAG

### Översikt
- **Produkt:** Kurs + coaching-system för högpresterande entreprenörer med ADHD
- **Status:** PDF + verktyg klart. Video EJ inspelad.
- **Målgrupp:** Entreprenörer/coacher med ADHD, kurssäljare, coacher
- **Material:** Google Drive (befintligt), ska struktureras i Obsidian

### 4 Tiers
| Tier | Innehåll | Prismodell |
|------|---------|-----------|
| Tier 1 | Videokurs | Engångsköp / prenumeration |
| Tier 2 | Kurs + coaching-agent (Telegram/WhatsApp) | Prenumeration |
| Tier 3 | Kurs + app/verktyg | Prenumeration |
| Tier 4 | Kurs + app + coach i appen | Premium prenumeration |

### Tech stack
| Verktyg | Roll |
|---------|------|
| Paperclip | Coaching-agent orchestrering |
| Claude API | AI-coach hjärna |
| NotebookLM | Kurs-podcasts per modul, sammanfattningar |
| Obsidian | Kursinnehåll, frameworks, ADHD-verktyg |
| Google Drive | Befintligt material (PDF, dokument) |
| Stripe | Betalning |

### Cross-sell strategi
```
Kursköpare (ADHD) → Upptäcker AIOS → Blir B2B-kund hos AI Upscale
```
- Högpresterande med ADHD = ofta entreprenörer/VDs
- Naturlig upsell: "Du behöver inte micromanaga — vi sätter upp AIOS åt dig"
- Kursens Tier 3–4 visar redan vad AIOS kan göra

### Nästa steg
- [ ] Skapa Obsidian vault med kursinnehåll från Google Drive
- [ ] Strukturera moduler i Obsidian
- [ ] Skapa NotebookLM-projekt per modul → podcast-avsnitt
- [ ] Spela in videokurs (Tier 1)
- [ ] Bygga coaching-agent i Paperclip (Tier 2)

---

## OBSIDIAN & NOTEBOOKLM — STRATEGI

### Obsidian (din hjärna — input & struktur)
```
Obsidian Vault: ~/ai_upscale_work/obsidian/
├── AI-Upscale/          — SOPs, kundmallar, agent-templates, säljscripts
├── ThyroidAI/           — PubMed-forskning, medicinsk kunskap, protokoll
├── CEO-with-ADHD/       — Kursmoduler, frameworks, verktyg, studentcase
└── Personligt/          — Mål, manifestationer, lärdomar, reflektioner
```

### NotebookLM (din röst — output & podcast)
| Projekt | Input | Output |
|---------|-------|--------|
| ThyroidAI Podcast | Medicinsk forskning, patientberättelser | "Förstå din sköldkörtel"-poddserie |
| CEO with ADHD Podcast | Kursmoduler, ADHD-forskning | Podcast per modul + bonus-avsnitt |
| AI Upscale Thought Leadership | Case studies, branschanalys | Thought leadership för LinkedIn |

### Automation (Paperclip → NotebookLM)
```
Paperclip research-agent → samlar data → skriver manus/talking points
→ Mike laddar in i NotebookLM → genererar Audio Overview (podcast)
→ Publiceras via Paperclip content-agent
```

---

## DOMÄNER & WEBBAR

| Domän | Används för |
|-------|------------|
| www.aiupscaleagency.com | AI Upscale huvudsida |
| aiupscale.agency | Alternativ domän / subdomäner |
| thyroid.aiupscale.agency | ThyroidAI app |
| TBD | CEO with ADHD kurs-sida |

---

## MAPPSTRUKTUR (uppdaterad)

```
~/ai_upscale_work/                    — HUVUDMAPP (AI Upscale Agency)
├── Master2.0.md                      — DENNA FIL — master-referens
├── CLAUDE.md                         — Claude Code instruktioner (ska uppdateras)
├── AIOS_Core/                        — AI Upscale's egna AIOS (uppdateras till Paperclip)
├── paperclip/
│   ├── thyroidai-company/            — ThyroidAI Paperclip-setup
│   ├── adhd-company/                 — CEO with ADHD Paperclip-setup (TBD)
│   └── aiupscale-company/            — AI Upscale egen Paperclip-setup (TBD)
├── Customer_Projects/
│   ├── ThyroidAI : Läkarteamet/      — ThyroidAI app-kod + master-doc
│   └── nexus-clone/                  — AI Upscale webbsida
├── obsidian/                         — Obsidian vault (TBD)
│   ├── AI-Upscale/
│   ├── ThyroidAI/
│   ├── CEO-with-ADHD/
│   └── Personligt/
├── knowledge/                        — Strategisk data
└── Free Claude - OLIKA LLM.../      — OpenRouter-konfiguration
```

---

## SYSTEMROLLER (för Claude)
- [STRATEG] — Affärsstrategi, positionering, prissättning
- [KODARE] — App-utveckling, Paperclip-config, integrations
- [SÄLJCOACH] — LinkedIn outreach, familiarity-loop, scripts
- [CONTENT] — Kurs-content, podcasts, thought leadership
- [PLANERARE] — Milstolpar, roadmaps, sprintar
- [SOP-SKRIVARE] — Processer, templates, automationer

---

## HUR CLAUDE JOBBAR MED MIKE
1. ALLTID planera → vänta på OK → sedan kör
2. Kommentera ALL kod på svenska
3. Error handling i ALLA workflows
4. Max 5 punkter per svar (ADHD-anpassat)
5. Prioritera: ROI > Momentum > Perfektion
6. Fråga hellre än att gissa
7. ALLTID git commit + push efter ändringar
