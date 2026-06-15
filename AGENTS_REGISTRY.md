# AGENTS & SKILLS REGISTRY — AI Upscale Agency

> **Senast uppdaterad:** 2026-06-04
> **Syfte:** Komplett karta över ALLA agenter, skills och multi-agent frameworks.
> **Regel:** Varje nytt projekt → lägg till här direkt.

---

## SNABBVAL: Vilket ramverk för vad?

| Situation | Använd |
|---|---|
| Stor strategisk beslut (pris, pivot, launch) | `/llm-council` — 5 advisors + peer review |
| Kod → review, refactor, agent-build | `karpathy-ai-upscale` (auto) |
| Multi-agent swarm, parallella tasks | `ruflo` — 60+ agents, 26 CLI-kommandon |
| Enstaka OpenClaw-skill (voice, image, kurs) | `openclaw-deploy/skills/` |
| LinkedIn B2B outreach | `aiupscale-sales` + `aiupscale-closer` |
| Content (humaniserat) | `mike-content-voice` + `content-humanizer` |
| Video-skapande | `video-content-strategist` + `remotion` |

---

## 1. CLAUDE CODE SKILLS (`~/.claude/skills/`)

### 1a. Mike-specifika skills (auto-aktiverade)

| Skill | Trigger | Funktion |
|---|---|---|
| `mike-aios-master` | Auto | Kontext om Mike, AIOS, alla projekt |
| `mike-adhd-shield` | Auto vid >5 punkter | Klipper ner svar för ADHD |
| `mike-roi-gate` | "ska jag bygga X" / ny idé | 80/20-check mot Nordstjärna |
| `mike-content-voice` | Content-skapande | Mikes röst, inte AI-känsla |
| `mike-deploy-process` | "deploy"/"ship"/"release" | Pre-flight checklist |
| `mike-llm-routing` | "vilken LLM"/"byt modell" | Prismatris, routing-beslut |
| `mike-onboarding-b2b` | Ny B2B-kund onboarding | Onboarding-flow |
| `mike-pipeline-health` | Pipeline-koll | Status på alla leads |
| `mike-context-refresh` | Tapp av kontext | Återställer session-minne |

### 1b. Multi-Agent Frameworks

| Skill | Källa | Funktion |
|---|---|---|
| `ruflo` | Ruflo v3.5 (ex-Claude Flow) | 60+ agents, 26 CLI-cmds, 5 agent-roller (architect/coder/reviewer/security/tester), swarm-mode |
| `llm-council` | Karpathy + aiwithremy | 5 advisors + peer review + chairman-syntes. Triggers: "council this", "war room this", "pressure-test this" |
| `karpathy-ai-upscale` | Karpathy-principer | Kirurgisk kodning, inga tysta antaganden. Auto vid all kodning |
| `pair-agent` | Gstack | Parprogrammering med sub-agent |

### 1c. Sälj & Business

| Skill | Funktion |
|---|---|
| `aiupscale-sales` | LinkedIn outreach, familiarity-loop |
| `aiupscale-closer` | Offerter, invändningar, close |
| `aiupscale-researcher` | Lead-research, ICP-analys |
| `aiupscale-recruiter` | Rekrytering |
| `cold-email` | Instantly B2B outreach |
| `mike-onboarding-b2b` | Kund-onboarding |
| `ceo-advisor` | Solo CEO sparring |

### 1d. Content & Media

| Skill | Funktion |
|---|---|
| `content-humanizer` | Tar bort AI-känsla från allt content |
| `mike-content-voice` | Mikes röst och ton |
| `video-content-strategist` | Video-strategi, script, YT, short-form |
| `remotion` | Programmatisk video (ThyroidAI, YT 4 Kids) |
| `social-media-manager` | FB, TikTok, social strategi |
| `podcast-create` | Podcast-script + produktion |
| `linkedin-post` | LinkedIn-inlägg (B2B only) |

### 1e. Kodning & Deploy

| Skill | Funktion |
|---|---|
| `ship` | Ship-flow (test → build → deploy) |
| `setup-deploy` | Deploy-setup för nya projekt |
| `mike-deploy-process` | Pre-flight checklist vid deploy |
| `land-and-deploy` | Landing page → deploy |
| `qa` / `qa-only` | QA-tester |
| `code-review` / `review` | Kod-review (low/medium/high/ultra) |
| `simplify` | Refactor → simplify |
| `guard` | Säkerhetsgranskning |
| `canary` | Canary deploy |
| `freeze` / `unfreeze` | Feature freeze |

### 1f. Planering & Struktur

| Skill | Funktion |
|---|---|
| `autoplan` | Auto-generera plan |
| `plan-eng-review` | Engineer review av plan |
| `plan-ceo-review` | CEO review av plan |
| `plan-devex-review` | DevEx review |
| `plan-design-review` | Design review av plan |
| `plan-tune` | Finjustera plan |
| `retro` | Sprint retrospective |
| `sprint` | Sprint-planering |
| `office-hours` | Open questions / brainstorm |

### 1g. Dagliga rutiner

| Skill | Trigger | Funktion |
|---|---|---|
| `daglig-brief` | Morgon | Dagens brief, prioriteringar |
| `eod-brief` | Kväll | End-of-day review |
| `weekly-review` | Vecka | Veckoöversikt |
| `status` | "status" | Snabb status på aktiva projekt |
| `pipeline` | "pipeline" | Leads + deals |
| `health` | "health" | System-hälsa |

### 1h. Gstack (Garry Tan / YC)

| Skill | Funktion |
|---|---|
| `gstack` | Kör Gstack-workflow |
| `gstack-upgrade` | Uppgradera Gstack |
| `graphify` | Knowledge graph från valfri input |
| `investigate` | Deep investigation av problem |
| `benchmark` / `benchmark-models` | LLM benchmark |
| `learn` | Lär sig från konversation |
| `scrape` | Webb-scraping |
| `browse` | Headless browser QA |
| `context-save` / `context-restore` | Spara/återställa kontext |

---

## 2. RUFLO AGENTS (`~/.claude/skills/ruflo/agents/`)

Ruflo v3.5 — 60+ agents, 5 kärnroller för multi-agent swarms:

| Agent-roll | Fil | Funktion |
|---|---|---|
| Architect | `architect.yaml` | System-design, arkitektur-beslut |
| Coder | `coder.yaml` | Implementation, kod-skrivning |
| Reviewer | `reviewer.yaml` | Code review, quality gate |
| Security Architect | `security-architect.yaml` | Säkerhetsgranskning |
| Tester | `tester.yaml` | Test-skrivning och QA |

**Ruflo CLI-kommandon (26 st):** Se `~/.claude/skills/ruflo/` för komplett lista.

---

## 3. OPENCLAW SKILLS (`~/ai_upscale_work/openclaw-deploy/skills/`)

OpenClaw-specifika runtime-skills:

| Skill | Funktion |
|---|---|
| `course-episode-pipeline` | Kurs-episod pipeline (CEO with ADHD) |
| `voice-via-elevenlabs` | Text-to-speech via ElevenLabs |
| `daily-audit` | Daglig audit av system |
| `image-via-imagen` | Bildgenerering via Google Imagen |

---

## 4. AGENTER PER PROJEKT

### 4a. ThyroidAI (`Customer_Projects/ThyroidAI : Läkarteamet/`)

**Läkar-agenter (Ai Specialist Läkar-agents):**

| Agent | Roll |
|---|---|
| Sofia Reyes | Specialist-läkare (spanska) |
| Eva Lindgren | Specialist-läkare (svenska) |
| Amara | Specialist-läkare (engelska/afrikansk marknad) |
| Maria Lindström | Specialist-läkare (svenska) |
| Juan Castillo | Specialist-läkare (spanska) |
| Arjun Patel | Specialist-läkare (engelska/asiatisk marknad) |
| Anna Bergström | Specialist-läkare (svenska) |

**Skills för ThyroidAI:**
- `openclaw-search` — sök i medicinsk databas
- `gemini-live` — Gemini Live voice integration

**Workflows:**
- `mama-healing-workflow.json` — Mama Healing flow
- `mama-healing-v2-workflow.json` — v2 med förbättringar

---

### 4b. AF-SIUS (`Customer_Projects/Arbetsformedlingen/`)

**Agenter:**

| Agent | Roll |
|---|---|
| `master-orchestrator` | Orkestrerar alla AF-agenter |
| `jobbmatcharen` | Matchar jobb mot profil |
| `cv-brevskrivaren` | Skriver CV + personligt brev |
| `profilbyggaren` | Bygger jobbsökar-profil |
| `intervjucoachen` | Intervju-träning |
| `kompetensutvecklaren` | Identifierar kompetensgap |
| `uppfoljningsagenten` | Follow-up och support |
| `krisagenten` | Kris-support (mental hälsa) |

**Skills för AF-SIUS:**
- `crisis-detection` — Detekterar kris-signaler
- `supabase-rag` — RAG mot Supabase
- `gemini-live-voice` — Röst-interface
- `cv-generator` — CV-generering
- `platsbanken-search` — Söker Platsbanken API

---

### 4c. AIOS Core (`AIOS_Core/`)

Se `AIOS_Core/frontend/AGENTS.md` för komplett lista.

---

### 4d. The Engine (`the-engine/`)

Se `the-engine/AGENTS.md` för komplett lista.

---

## 5. LLM COUNCIL — KARPATHY MULTI-AGENT

**Källor:**
- Original: https://github.com/karpathy/llm-council (Python, multi-model)
- Claude-adaptation: https://github.com/aiwithremy/claude-skills-llm-council
- Installerad skill: `~/.claude/skills/llm-council/SKILL.md`

**De 5 advisorerna:**

| Advisor | Tänkstil |
|---|---|
| The Contrarian | Hittar vad som kan gå fel |
| The First Principles Thinker | Ifrågasätter antaganden |
| The Expansionist | Hittar förbisedd upside |
| The Outsider | Noll-kontext, fångar blind spots |
| The Executor | Vad gör man måndag morgon? |

**Triggers:** `council this` · `war room this` · `pressure-test this` · `stress-test this` · `debate this`

---

## 6. GRAPHIFY-INTEGRATION

Kör `/graphify` för att generera knowledge graph från detta registry.
Output hamnar i `graphify-out/` och håller Graphify uppdaterat om alla agenter.

---

## 7. REGLER FÖR DETTA REGISTRY

1. **Nytt projekt → lägg till agenter/skills här direkt**
2. **Ny skill installerad → lägg till i sektion 1 eller 2**
3. **Skill borttagen → markera som `[DEPRECATED]`**
4. **MEMORY.md** ska ha en pointer hit
5. **Kör `/graphify` efter stora ändringar**
