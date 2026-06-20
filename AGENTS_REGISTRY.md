---
summary: Komplett karta över ALLA agenter, skills och multi-agent frameworks.
---

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

<!-- AUTO-GENERERAT:START -->
## 📦 KOMPLETT KATALOG (auto-genererad 2026-06-20)

> Genererad av `scripts/generate-inventory.js`. Maskinläsbar källa: `inventory.json`.

**Totalt:** 112 skills · 33 agenter · 44 kommandon

### Skills (112)

| Name | Source | Description |
|---|---|---|
| access | plugin:claude-plugins-official | Manage Discord channel access — approve pairings, edit allowlists, set DM/group policy. Use when the user asks to pair, approve someone, check who's allowed, or change policy for the Discord channel. |
| access | plugin:claude-plugins-official | Manage iMessage channel access — approve pairings, edit allowlists, set DM/group policy. Use when the user asks to pair, approve someone, check who's allowed, or change policy for the iMessage channel. |
| access | plugin:claude-plugins-official | Manage Telegram channel access — approve pairings, edit allowlists, set DM/group policy. Use when the user asks to pair, approve someone, check who's allowed, or change policy for the Telegram channel. |
| agent-development | plugin:claude-plugins-official | This skill should be used when the user asks to "create an agent", "add an agent", "write a subagent", "agent frontmatter", "when to use description", "agent examples", "agent tools", "agent colors", "autonomous agent", or needs guidance on agent structure, system prompts, triggering conditions, or agent development best practices for Claude Code plugins. |
| aiupscale-closer | egen | Closer-roll för Mike's B2B-sälj. Skickar offerter, hanterar invändningar, bokar call-to-close, och stänger high-ticket affärer på AIOS-paket (14 900–69 900 kr/mån + Tripwire). Aktiveras vid "skriv offert", "stäng affär", "hantera invändning", "skicka avtal", "follow-up close". |
| aiupscale-recruiter | egen | Recruiter-roll för Mike's AIOS. Värvar och bygger team av AI-agenter on demand baserat på uppgift. Aktiveras när Mike säger "rekrytera agent X", "skapa team för Y", "vem ska göra Z", eller liknande. Använder OpenClaw skill-creator för att spawna nya skills/agenter. |
| aiupscale-researcher | egen | Research-roll för Mike's AIOS. Gör djup prospect-research, marknadsanalys, content-research och konkurrentanalys via web_fetch, web_search, browser och Perplexity. Aktiveras vid "research X", "hitta info om Y", "kolla upp Z", "analysera marknaden", "konkurrent X". |
| aiupscale-sales | egen | Säljstrategi, outreach, pitch, pris och lead gen för AI Upscale Agency. Aktiveras när Mike jobbar med LinkedIn DMs, mail, offerter, demo-bokning eller nya leads. Följer familiarity-principen. |
| app-store-optimization | egen | App Store Optimization (ASO) toolkit for researching keywords, analyzing competitor rankings, generating metadata suggestions, and improving app visibility on Apple App Store and Google Play Store. Use when the user asks about ASO, app store rankings, app metadata, app titles and descriptions, app store listings, app visibility, or mobile app marketing on iOS or Android. Supports keyword research and scoring, competitor keyword analysis, metadata optimization, A/B test planning, launch checklists, and tracking ranking changes. |
| autoplan | egen | Auto-review pipeline — reads the full CEO, design, eng, and DX review skills from disk and runs them sequentially with auto-decisions using 6 decision principles. (gstack) |
| benchmark | egen | Performance regression detection using the browse daemon. (gstack) |
| benchmark-models | egen | Cross-model benchmark for gstack skills. (gstack) |
| browse | egen | Fast headless browser for QA testing and site dogfooding. (gstack) |
| build-mcp-app | plugin:claude-plugins-official | This skill should be used when the user wants to build an "MCP app", add "interactive UI" or "widgets" to an MCP server, "render components in chat", build "MCP UI resources", make a tool that shows a "form", "picker", "dashboard" or "confirmation dialog" inline in the conversation, or mentions "apps SDK" in the context of MCP. Use AFTER the build-mcp-server skill has settled the deployment model, or when the user already knows they want UI widgets. |
| build-mcp-server | plugin:claude-plugins-official | This skill should be used when the user asks to "build an MCP server", "create an MCP", "make an MCP integration", "wrap an API for Claude", "expose tools to Claude", "make an MCP app", or discusses building something with the Model Context Protocol. It is the entry point for MCP server development — it interrogates the user about their use case, determines the right deployment model (remote HTTP, MCPB, local stdio), picks a tool-design pattern, and hands off to specialized skills. |
| build-mcpb | plugin:claude-plugins-official | This skill should be used when the user wants to "package an MCP server", "bundle an MCP", "make an MCPB", "ship a local MCP server", "distribute a local MCP", discusses ".mcpb files", mentions bundling a Node or Python runtime with their MCP server, or needs an MCP server that interacts with the local filesystem, desktop apps, or OS and must be installable without the user having Node/Python set up. |
| canary | egen | Post-deploy canary monitoring. (gstack) |
| cardputer-buddy | plugin:claude-plugins-official | Iterate on the Cardputer-Adv MicroPython app bundle (Claude Buddy, Snake, Hello) after the device is already provisioned via m5-onboard. Use when the user wants to add a new app, push a single changed .py without re-flashing, watch device serial logs, or run a one-shot REPL command. Trigger on "add an app", "push to the cardputer", "tail the device", "run on the device", or follow-up work after /maker-setup. |
| careful | egen | Safety guardrails for destructive commands. (gstack) |
| ceo-advisor | egen | Executive leadership guidance for strategic decision-making, organizational development, and stakeholder management. Use when planning strategy, preparing board presentations, managing investors, developing organizational culture, making executive decisions, fundraising, or when user mentions CEO, strategic planning, board meetings, investor updates, organizational leadership, or executive strategy. |
| claude-automation-recommender | plugin:claude-plugins-official | Analyze a codebase and recommend Claude Code automations (hooks, subagents, skills, plugins, MCP servers). Use when user asks for automation recommendations, wants to optimize their Claude Code setup, mentions improving Claude Code workflows, asks how to first set up Claude Code for a project, or wants to know what Claude Code features they should use. |
| claude-md-improver | plugin:claude-plugins-official | Audit and improve CLAUDE.md files in repositories. Use when user asks to check, audit, update, improve, or fix CLAUDE.md files. Scans for all CLAUDE.md files, evaluates quality against templates, outputs quality report, then makes targeted updates. Also use when the user mentions "CLAUDE.md maintenance" or "project memory optimization". |
| codex | egen | OpenAI Codex CLI wrapper — three modes. (gstack) |
| cold-email | egen | When the user wants to write, improve, or build a sequence of B2B cold outreach emails to prospects who haven't asked to hear from them. Use when the user mentions 'cold email,' 'cold outreach,' 'prospecting emails,' 'SDR emails,' 'sales emails,' 'first touch email,' 'follow-up sequence,' or 'email prospecting.' Also use when they share an email draft that sounds too sales-y and needs to be humanized. Distinct from email-sequence (lifecycle/nurture to opted-in subscribers) — this is unsolicited outreach to new prospects. NOT for lifecycle emails, newsletters, or drip campaigns (use email-sequence). |
| command-development | plugin:claude-plugins-official | This skill should be used when the user asks to "create a slash command", "add a command", "write a custom command", "define command arguments", "use command frontmatter", "organize commands", "create command with file references", "interactive command", "use AskUserQuestion in command", or needs guidance on slash command structure, YAML frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development best practices for Claude Code. |
| configure | plugin:claude-plugins-official | Set up the Discord channel — save the bot token and review access policy. Use when the user pastes a Discord bot token, asks to configure Discord, asks "how do I set this up" or "who can reach me," or wants to check channel status. |
| configure | plugin:claude-plugins-official | Check iMessage channel setup and review access policy. Use when the user asks to configure iMessage, asks "how do I set this up" or "who can reach me," or wants to know why texts aren't reaching the assistant. |
| configure | plugin:claude-plugins-official | Set up the Telegram channel — save the bot token and review access policy. Use when the user pastes a Telegram bot token, asks to configure Telegram, asks "how do I set this up" or "who can reach me," or wants to check channel status. |
| content-humanizer | egen | Makes AI-generated content sound genuinely human — not just cleaned up, but alive. Use when content feels robotic, uses too many AI clichés, lacks personality, or reads like it was written by committee. Triggers: 'this sounds like AI', 'make it more human', 'add personality', 'it feels generic', 'sounds robotic', 'fix AI writing', 'inject our voice'. NOT for initial content creation (use content-production). NOT for SEO optimization (use content-production Mode 3). |
| context-restore | egen | Restore working context saved earlier by /context-save. (gstack) |
| context-save | egen | Save working context. (gstack) |
| cso | egen | Chief Security Officer mode. (gstack) |
| design-consultation | egen | Design consultation: understands your product, researches the landscape, proposes a complete design system (aesthetic, typography, color, layout, spacing, motion), and generates font+color preview... (gstack) |
| design-html | egen | Design finalization: generates production-quality Pretext-native HTML/CSS. (gstack) |
| design-review | egen | Designer's eye QA: finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns, and slow interactions — then fixes them. (gstack) |
| design-shotgun | egen | Design shotgun: generate multiple AI design variants, open a comparison board, collect structured feedback, and iterate. (gstack) |
| devex-review | egen | Live developer experience audit. (gstack) |
| diagram | egen | Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you can open (gstack) |
| document-generate | egen | Generate missing documentation from scratch for a feature, module, or entire project. (gstack) |
| document-release | egen | Post-ship documentation update. (gstack) |
| ecc-connections-optimizer | egen | Reorganize the user's X and LinkedIn network with review-first pruning, add/follow recommendations, and channel-specific warm outreach drafted in the user's real voice. Use when the user wants to clean up following lists, grow toward current priorities, or rebalance a social graph around higher-signal relationships. |
| ecc-context-budget | egen | Audits Claude Code context window consumption across agents, skills, MCP servers, and rules. Identifies bloat, redundant components, and produces prioritized token-savings recommendations. |
| ecc-knowledge-ops | egen | Knowledge base management, ingestion, sync, and retrieval across multiple storage layers (local files, MCP memory, vector stores, Git repos). Use when the user wants to save, organize, sync, deduplicate, or search across their knowledge systems. |
| ecc-token-budget-advisor | egen | >- |
| example-command | plugin:claude-plugins-official | An example user-invoked skill that demonstrates frontmatter options and the skills/<name>/SKILL.md layout |
| example-skill | plugin:claude-plugins-official | This skill should be used when the user asks to "demonstrate skills", "show skill format", "create a skill template", or discusses skill development patterns. Provides a reference template for creating Claude Code plugin skills. |
| freeze | egen | Restrict file edits to a specific directory for the session. (gstack) |
| frontend-design | plugin:claude-plugins-official | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults. |
| graphify | egen | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ exists, where the question should be treated as a graphify query first. Turns any input (code, docs, papers, images, videos) into a persistent knowledge graph with god nodes, community detection, and query/path/explain tools. |
| gstack | egen | Fast headless browser for QA testing and site dogfooding. (gstack) |
| gstack | egen | Fast headless browser for QA testing and site dogfooding. (gstack) |
| gstack-upgrade | egen | Upgrade gstack to the latest version. |
| guard | egen | Full safety mode: destructive command warnings + directory-scoped edits. (gstack) |
| health | egen | Code quality dashboard. (gstack) |
| hook-development | plugin:claude-plugins-official | This skill should be used when the user asks to "create a hook", "add a PreToolUse/PostToolUse/Stop hook", "validate tool use", "implement prompt-based hooks", "use ${CLAUDE_PLUGIN_ROOT}", "set up event-driven automation", "block dangerous commands", or mentions hook events (PreToolUse, PostToolUse, Stop, SubagentStop, SessionStart, SessionEnd, UserPromptSubmit, PreCompact, Notification). Provides comprehensive guidance for creating and implementing Claude Code plugin hooks with focus on advanced prompt-based hooks API. |
| investigate | egen | Systematic debugging with root cause investigation. (gstack) |
| ios-clean | egen | Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack) |
| ios-design-review | egen | Visual design audit for iOS apps on real hardware. (gstack) |
| ios-fix | egen | Autonomous iOS bug fixer. (gstack) |
| ios-qa | egen | Live-device iOS QA for SwiftUI apps. (gstack) |
| ios-sync | egen | Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack) |
| karpathy-ai-upscale | egen | Karpathy-principer anpassade för AI Upscale Agency + Mike. Aktiveras automatiskt vid kodning, refactoring, eller code review för att minska vanliga LLM-misstag som överkomplikation, tysta antaganden och icke-kirurgiska ändringar. |
| land-and-deploy | egen | Land and deploy workflow. (gstack) |
| landing-report | egen | Read-only queue dashboard for workspace-aware ship. (gstack) |
| learn | egen | Manage project learnings. |
| llm-council | egen | Run any question, idea, or decision through a council of 5 AI advisors who independently analyze it, peer-review each other anonymously, and synthesize a final verdict. Based on Karpathy's LLM Council methodology. MANDATORY TRIGGERS: 'council this', 'run the council', 'war room this', 'pressure-test this', 'stress-test this', 'debate this'. STRONG TRIGGERS (use when combined with a real decision or tradeoff): 'should I X or Y', 'which option', 'what would you do', 'is this the right move', 'validate this', 'get multiple perspectives', 'I can't decide', 'I'm torn between'. Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff (e.g. 'should I use markdown' is not a council question). DO trigger when the user presents a genuine decision with stakes, multiple options, and context that suggests they want it pressure-tested from multiple angles. |
| m5-onboard | plugin:claude-plugins-official | End-to-end onboarding for a freshly-plugged-in M5Stack ESP32 device (Cardputer, Cardputer-Adv, Core, CoreS3, Stick) — detect on USB, flash UIFlow 2.0 firmware, and install the Claude Buddy MicroPython app bundle. Use whenever the user plugs in or wants to flash/provision/reset an M5Stack or ESP32 board, or says "m5-onboard go". |
| make-pdf | egen | Turn any markdown file into a publication-quality PDF. (gstack) |
| math-olympiad | plugin:claude-plugins-official |  |
| mcp-integration | plugin:claude-plugins-official | This skill should be used when the user asks to "add MCP server", "integrate MCP", "configure MCP in plugin", "use .mcp.json", "set up Model Context Protocol", "connect external service", mentions "${CLAUDE_PLUGIN_ROOT} with MCP", or discusses MCP server types (SSE, stdio, HTTP, WebSocket). Provides comprehensive guidance for integrating Model Context Protocol servers into Claude Code plugins for external tool and service integration. |
| mike-adhd-shield | egen | Skyddar Mikes fokus och energi. Aktiveras AUTOMATISKT när task-listor, planer eller dokument blir för långa (>5 punkter), när det finns för många parallella spår, eller när Mike visar tecken på överbelastning ("hjälp", "för mycket", "kan inte fokusera", "vart börjar jag"). Skär ner till max 3-5 saker, skyddar dopamin-rytmen. |
| mike-aios-master | egen | Master-kontext om Mike, AI Upscale Agency. Lean version optimerad för Ollama gemma4 16K context. Aktiveras automatiskt i ai_upscale_work/. |
| mike-content-voice | egen | Mikes röst- och tonalitetsregler för ALLT innehåll — LinkedIn-inlägg, podcast-script, kurs-material, säljbrev, hemsidor. Aktiveras AUTOMATISKT vid content-skapande. Förbjudna fraser, hooks som funkar, struktur-regler, ADHD-anpassning. Säkrar att inget content låter som AI. |
| mike-context-refresh | egen | Vid sessionsstart eller när Mike säger "vad är status", "refresh", "vad finns", "uppdatera kontext", "var är jag" — kör en levande kontext-uppdatering. Läser git log (senaste 7 dagar), kollar projekt-status, varnar för stale memory (>14 dagar). Säkrar att Claude inte refererar gammal info. |
| mike-deploy-process | egen | Hela deploy-flödet för Mikes projekt (ThyroidAI, Fluentic, AIOS_Core, landing pages). Aktiveras AUTOMATISKT när Mike säger "deploy", "deploya", "publicera", "ship", "release", "rollback". Kör pre-flight checklist, deploy, smoke tests, log och notifiering. Aldrig deploy utan checklist. |
| mike-llm-routing | egen | När Mike eller Claude står inför ett LLM-val (Claude, Gemini, Perplexity, OpenAI) — visar exakt pris per uppgift, rekommendation och motivering INNAN val. Aktiveras vid "vilken LLM", "byt modell", "kan vi använda X", "kostnad för Y", eller när nytt agent-anrop ska göras. |
| mike-onboarding-b2b | egen | Hela onboarding-flödet för ny B2B-kund (Tripwire/Starter/Growth/Full AI OS). Aktiveras vid "ny kund", "signed", "stängde X", "onboarding för Y", "kick-off". Standardiserar varje onboarding så Mike aldrig glömmer ett steg — kontrakt → setup → kick-off → leverans → reporting. |
| mike-pipeline-health | egen | Hälsoanalys av Mikes sales pipeline. Aktiveras vid "pipeline", "leads", "sales-status", "hur går säljet", "vart är vi mot MRR-målet", "vem är nästa att stänga". Identifierar flaskhalsar, varma leads, dunstande prospects och rekommenderar konkret nästa steg. |
| mike-roi-gate | egen | När Mike eller Claude föreslår en ny idé, feature, projekt, verktyg eller process — kör 80/20 + ROI-check FÖRE Mike investerar tid. Aktiveras vid "ska jag bygga X", "vad tycker du om Y", "borde vi köra Z", "ny idé", "nytt verktyg". Skyddar Mikes mest värdefulla resurs: tid. |
| office-hours | egen | YC Office Hours — two modes. (gstack) |
| open-gstack-browser | egen | Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in. |
| open-gstack-browser | egen | Launch GStack Browser — AI-controlled Chromium with the sidebar extension baked in. |
| pair-agent | egen | Pair a remote AI agent with your browser. (gstack) |
| plan-ceo-review | egen | CEO/founder-mode plan review. (gstack) |
| plan-design-review | egen | Designer's eye plan review — interactive, like CEO and Eng review. (gstack) |
| plan-devex-review | egen | Interactive developer experience plan review. (gstack) |
| plan-eng-review | egen | Eng manager-mode plan review. (gstack) |
| plan-tune | egen | Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack) |
| playground | plugin:claude-plugins-official | Creates interactive HTML playgrounds — self-contained single-file explorers that let users configure something visually through controls, see a live preview, and copy out a prompt. Use when the user asks to make a playground, explorer, or interactive tool for a topic. |
| plugin-settings | plugin:claude-plugins-official | This skill should be used when the user asks about "plugin settings", "store plugin configuration", "user-configurable plugin", ".local.md files", "plugin state files", "read YAML frontmatter", "per-project plugin settings", or wants to make plugin behavior configurable. Documents the .claude/plugin-name.local.md pattern for storing plugin-specific configuration with YAML frontmatter and markdown content. |
| plugin-structure | plugin:claude-plugins-official | This skill should be used when the user asks to "create a plugin", "scaffold a plugin", "understand plugin structure", "organize plugin components", "set up plugin.json", "use ${CLAUDE_PLUGIN_ROOT}", "add commands/agents/skills/hooks", "configure auto-discovery", or needs guidance on plugin directory layout, manifest configuration, component organization, file naming conventions, or Claude Code plugin architecture best practices. |
| podcast-create | egen | Skapa podcast-avsnitt automatiskt via NotebookLM (notebooklm-py CLI). Aktiveras när Mike säger "skapa podcast om X", "make podcast about X", "nytt podcast-avsnitt", eller liknande. Bygger script via Gemini, genererar audio, sparar lokalt, ger Spotify-redo MP3. |
| qa | egen | Systematically QA test a web application and fix bugs found. (gstack) |
| qa-only | egen | Report-only QA testing. (gstack) |
| remotion | egen | Skapa videos programmatiskt med Remotion + React. Aktiveras när Mike vill skapa, rendera, validera eller extrahera frames från video — speciellt för ThyroidAI launch-video, YouTube 4 Kids, content-templates, eller andra projekt. Triggers - "skapa video", "rendera video", "remotion", "thyroidai video", "youtube video", "extract frames", "validate video", "video script + remotion". Använder Mikes lokala Remotion-projekt på Desktop. |
| retro | egen | Weekly engineering retrospective. (gstack) |
| review | egen | Pre-landing PR review. (gstack) |
| scrape | egen | Pull data from a web page. (gstack) |
| session-report | plugin:claude-plugins-official | Generate an explorable HTML report of Claude Code session usage (tokens, cache, subagents, skills, expensive prompts) from ~/.claude/projects transcripts. |
| setup-browser-cookies | egen | Import cookies from your real Chromium browser into the headless browse session. (gstack) |
| setup-deploy | egen | Configure deployment settings for /land-and-deploy. |
| setup-gbrain | egen | Set up gbrain for this coding agent: install the CLI, initialize a local PGLite or Supabase brain, register MCP, capture per-remote trust policy. (gstack) |
| ship | egen | Ship workflow: detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR. (gstack) |
| skill-creator | plugin:claude-plugins-official | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. |
| skill-development | plugin:claude-plugins-official | This skill should be used when the user wants to "create a skill", "add a skill to plugin", "write a new skill", "improve skill description", "organize skill content", or needs guidance on skill structure, progressive disclosure, or skill development best practices for Claude Code plugins. |
| skillify | egen | Codify the most recent successful /scrape flow into a permanent browser-skill on disk. (gstack) |
| social-media-manager | egen | When the user wants to develop social media strategy, plan content calendars, manage community engagement, or grow their social presence across platforms. Also use when the user mentions 'social media strategy,' 'social calendar,' 'community management,' 'social media plan,' 'grow followers,' 'engagement rate,' 'social media audit,' or 'which platforms should I use.' For writing individual social posts, see social-content. For analyzing social performance data, see social-media-analyzer. |
| spec | egen | Turn vague intent into a precise, executable spec in five phases. (gstack) |
| sync-gbrain | egen | Keep gbrain current with this repo's code and refresh agent search guidance in CLAUDE.md. Wraps the gstack-gbrain-sync orchestrator with state (gstack) |
| unfreeze | egen | Clear the freeze boundary set by /freeze, allowing edits to all directories again. (gstack) |
| video-content-strategist | egen | Use when planning video content strategy, writing video scripts, optimizing YouTube channels, building short-form video pipelines (Reels, TikTok, Shorts), or repurposing long-form content into video. Triggers: 'start a YouTube channel', 'video content strategy', 'write a video script', 'repurpose into video', 'YouTube SEO', 'short-form video'. NOT for written blog content (use content-production). NOT for social captions without video (use social-media-manager). |
| writing-hookify-rules | plugin:claude-plugins-official | This skill should be used when the user asks to "create a hookify rule", "write a hook rule", "configure hookify", "add a hookify rule", or needs guidance on hookify rule syntax and patterns. |

### Agenter (33)

| Name | Source | Description |
|---|---|---|
| agent-creator | plugin:claude-plugins-official | \| |
| agent-sdk-verifier-py | plugin:claude-plugins-official | Use this agent to verify that a Python Agent SDK application is properly configured, follows SDK best practices and documentation recommendations, and is ready for deployment or testing. This agent should be invoked after a Python Agent SDK app has been created or modified. |
| agent-sdk-verifier-ts | plugin:claude-plugins-official | Use this agent to verify that a TypeScript Agent SDK application is properly configured, follows SDK best practices and documentation recommendations, and is ready for deployment or testing. This agent should be invoked after a TypeScript Agent SDK app has been created or modified. |
| architecture-critic | plugin:claude-plugins-official | Reviews proposed target architectures and transformed code against modern best practice. Adversarial — looks for over-engineering, missed requirements, and simpler alternatives. |
| business-rules-extractor | plugin:claude-plugins-official | Mines domain logic, calculations, validations, and policies from legacy code into testable Given/When/Then specifications. Use when you need to separate "what the business requires" from "how the old code happened to implement it. |
| code-architect | plugin:claude-plugins-official | Designs feature architectures by analyzing existing codebase patterns and conventions, then providing comprehensive implementation blueprints with specific files to create/modify, component designs, data flows, and build sequences |
| code-explorer | plugin:claude-plugins-official | Deeply analyzes existing codebase features by tracing execution paths, mapping architecture layers, understanding patterns and abstractions, and documenting dependencies to inform new development |
| code-reviewer | plugin:claude-plugins-official | Reviews code for bugs, logic errors, security vulnerabilities, code quality issues, and adherence to project conventions, using confidence-based filtering to report only high-priority issues that truly matter |
| code-reviewer | plugin:claude-plugins-official | Use this agent when you need to review code for adherence to project guidelines, style guides, and best practices. This agent should be used proactively after writing or modifying code, especially before committing changes or creating pull requests. It will check for style violations, potential issues, and ensure code follows the established patterns in CLAUDE.md. Also the agent needs to know which files to focus on for the review. In most cases this will be recently completed work which is unstaged in git (can be retrieved by running git diff). However there can be cases where this is different, make sure to specify this as the agent input when calling the agent. Typical triggers include the user asking for a review of a feature they just implemented, the assistant proactively reviewing its own newly-written code before declaring a task done, and a final pre-PR check before opening a pull request. See "When to invoke" in the agent body for worked scenarios. |
| code-reviewer-aios | egen | Code review för Mikes stack (Next.js 15, TypeScript, Docker, Supabase, Capacitor). Använd FÖRE commit/PR av icke-triviala ändringar i AIOS_Core, ThyroidAI, Fluentic eller andra TS-projekt. |
| code-simplifier | plugin:claude-plugins-official | Simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality. Focuses on recently modified code unless instructed otherwise. |
| code-simplifier | plugin:claude-plugins-official | \| |
| comment-analyzer | plugin:claude-plugins-official | Use this agent when you need to analyze code comments for accuracy, completeness, and long-term maintainability. This includes (1) after generating large documentation comments or docstrings, (2) before finalizing a pull request that adds or modifies comments, (3) when reviewing existing comments for potential technical debt or comment rot, and (4) when you need to verify that comments accurately reflect the code they describe. See "When to invoke" in the agent body for worked scenarios. |
| content-writer | egen | LinkedIn-inlägg, podcast-script, copy, SEO-text och thought leadership för AI Upscale Agency. Använd när Mike vill skapa innehåll — inlägg, kurs-material, säljbrev, case studies, eller content till YouTube/podcast. |
| conversation-analyzer | plugin:claude-plugins-official | Use this agent when analyzing conversation transcripts to find behaviors worth preventing with hooks. Typical triggers include the /hookify command being invoked without arguments, or the user explicitly asking to look back at the current conversation and surface mistakes that should be prevented in the future. See "When to invoke" in the agent body for worked scenarios. |
| deploy-agent | egen | Vercel + Docker + Hostinger deploys för Mikes projekt. Använd för att deploya ThyroidAI (Docker→VPS), Fluentic/landing pages (Vercel), eller köra smoke tests efter deploy. |
| ecc-architect | egen | Software architecture specialist for system design, scalability, and technical decision-making. Use PROACTIVELY when planning new features, refactoring large systems, or making architectural decisions. |
| ecc-planner | egen | Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks. |
| ecc-security-reviewer | egen | Security vulnerability detection and remediation specialist. Use PROACTIVELY after writing code that handles user input, authentication, API endpoints, or sensitive data. Flags secrets, SSRF, injection, unsafe crypto, and OWASP Top 10 vulnerabilities. |
| ecc-tdd-guide | egen | Test-Driven Development specialist enforcing write-tests-first methodology. Use PROACTIVELY when writing new features, fixing bugs, or refactoring code. Ensures 80%+ test coverage. |
| finance-bookkeeper | egen | Stripe-rapporter, MRR-tracking, fakturor, kostnadsöverblick, ekonomi-frågor. Använd för månatlig finance-brief, MRR-rapport, fakturahantering, eller kostnadsanalys (AI-API, Vercel, Hostinger, etc). |
| legacy-analyst | plugin:claude-plugins-official | Deep-reads legacy codebases (COBOL, Java, .NET, Node, anything) to build structural and behavioral understanding. Use for discovery, dependency mapping, dead-code detection, and "what does this system actually do" questions. |
| ops-daily | egen | Dagliga rutiner — kalender, mail-triage, briefs, fokus-planering. Använd för morning brief, end-of-day review, mail-zero, eller vecko-review mot Nordstjärnan. |
| plugin-validator | plugin:claude-plugins-official | \| |
| pr-test-analyzer | plugin:claude-plugins-official | Use this agent when you need to review a pull request for test coverage quality and completeness. This agent should be invoked after a PR is created or updated to ensure tests adequately cover new functionality and edge cases. Typical triggers include the user asking whether tests on a freshly-created PR are thorough, an updated PR adding new logic that needs coverage analysis, and a final pre-merge double-check before marking a PR ready. See "When to invoke" in the agent body for worked scenarios. |
| sales-prospector | egen | LinkedIn-research + lead scoring + outreach-kö. Använd för att hitta VD/COO/Grundare på ICP-företag (5-50 anst, SaaS/konsult/rekrytering/fastighet/byråer, Sverige+Norge), scora leads, och bygga familiarity-loop-listor (Like → Comment → Connect → DM → Call). |
| scaffolder | plugin:claude-plugins-official | Scaffolds one service of a reimagined system from the approved architecture and spec — project skeleton, domain model, API stubs, executable acceptance tests. Write access is scoped to its own service directory under modernized/. |
| security-auditor | plugin:claude-plugins-official | Adversarial security reviewer — OWASP Top 10, CWE, dependency CVEs, secrets, injection. Use for security debt scanning and pre-modernization hardening. |
| silent-failure-hunter | plugin:claude-plugins-official | Use this agent when reviewing code changes in a pull request to identify silent failures, inadequate error handling, and inappropriate fallback behavior. This agent should be invoked proactively after completing a logical chunk of work that involves error handling, catch blocks, fallback logic, or any code that could potentially suppress errors. Examples:\n\n<example>\nContext: Daisy has just finished implementing a new feature that fetches data from an API with fallback behavior.\nDaisy: "I've added error handling to the API client. Can you review it?"\nAssistant: "Let me use the silent-failure-hunter agent to thoroughly examine the error handling in your changes."\n<Task tool invocation to launch silent-failure-hunter agent>\n</example>\n\n<example>\nContext: Daisy has created a PR with changes that include try-catch blocks.\nDaisy: "Please review PR #1234"\nAssistant: "I'll use the silent-failure-hunter agent to check for any silent failures or inadequate error handling in this PR."\n<Task tool invocation to launch silent-failure-hunter agent>\n</example>\n\n<example>\nContext: Daisy has just refactored error handling code.\nDaisy: "I've updated the error handling in the authentication module"\nAssistant: "Let me proactively use the silent-failure-hunter agent to ensure the error handling changes don't introduce silent failures."\n<Task tool invocation to launch silent-failure-hunter agent>\n</example> |
| skill-reviewer | plugin:claude-plugins-official | \| |
| test-engineer | plugin:claude-plugins-official | Writes characterization, contract, and equivalence tests that pin down legacy behavior so transformation can be proven correct. Use before any rewrite. |
| type-design-analyzer | plugin:claude-plugins-official | Use this agent when you need expert analysis of type design in your codebase. Specifically use it (1) when introducing a new type to ensure it follows best practices for encapsulation and invariant expression, (2) during pull request creation to review all types being added, and (3) when refactoring existing types to improve their design quality. The agent will provide both qualitative feedback and quantitative ratings on encapsulation, invariant expression, usefulness, and enforcement. See "When to invoke" in the agent body for worked scenarios. |
| version-delta-analyst | plugin:claude-plugins-official | Identifies the breaking changes between two versions of the SAME stack (e.g. .NET Framework 4.8 → .NET 8, Java 8 → 17/21, Spring Boot 2 → 3) that actually bite a given codebase, and drives the ecosystem's migration tooling. Use for same-stack uplifts, where code is preserved and tweaked — not rewritten from intent. (Note: some "same-stack" bumps are really rewrites — Python 2 → 3 with pervasive str/bytes, AngularJS → Angular — where minimal-diff fails; flag those for /modernize-transform.) |

### Kommandon (44)

| Name | Source | Summary |
|---|---|---|
| cancel-ralph | plugin:claude-plugins-official |  |
| clean_gone | plugin:claude-plugins-official |  |
| code-review | plugin:claude-plugins-official |  |
| cold-dm | egen | Skriv kallt LinkedIn-DM efter familiarity-loop (Like + Comment + Connect). |
| commit | plugin:claude-plugins-official |  |
| commit-push-pr | plugin:claude-plugins-official |  |
| configure | plugin:claude-plugins-official |  |
| create-docker-mcp-tunnel | plugin:claude-plugins-official |  |
| create-plugin | plugin:claude-plugins-official |  |
| daglig-brief | egen | Ge mig en daglig brief baserad på mina projekt i CLAUDE.md. |
| deploy-thyroid | egen | Deploya ThyroidAI till Hostinger VPS (76.13.149.231). |
| eod-brief | egen | End-of-day brief för Mike. Max 10 rader. |
| example-command | plugin:claude-plugins-official |  |
| feature-dev | plugin:claude-plugins-official |  |
| follow-up | egen | Skapa follow-up efter call eller DM-konversation. |
| help | plugin:claude-plugins-official |  |
| help | plugin:claude-plugins-official |  |
| hookify | plugin:claude-plugins-official |  |
| linkedin-post | egen | Skapa LinkedIn-inlägg för Mike Luengo Johansson (grundare AI Upscale Agency). |
| list | plugin:claude-plugins-official |  |
| maker-setup | plugin:claude-plugins-official |  |
| modernize-assess | plugin:claude-plugins-official |  |
| modernize-brief | plugin:claude-plugins-official |  |
| modernize-extract-rules | plugin:claude-plugins-official |  |
| modernize-harden | plugin:claude-plugins-official |  |
| modernize-map | plugin:claude-plugins-official |  |
| modernize-preflight | plugin:claude-plugins-official |  |
| modernize-reimagine | plugin:claude-plugins-official |  |
| modernize-status | plugin:claude-plugins-official |  |
| modernize-transform | plugin:claude-plugins-official |  |
| modernize-uplift | plugin:claude-plugins-official |  |
| new-sdk-app | plugin:claude-plugins-official |  |
| offert | egen | Generera kundoffert för AI Upscale Agency. |
| outreach | egen | Hjälp mig med LinkedIn outreach baserat på familiarity-principen. |
| pipeline | egen | Sammanställ sales pipeline för AI Upscale Agency. |
| podcast | egen | Skapa podcast-avsnitt via NotebookLM (delegera till skill `podcast-create`). |
| ralph-loop | plugin:claude-plugins-official |  |
| refresh | egen | Uppdatera memory mot aktuell verklighet. Aktivera skill `mike-context-refresh` o |
| research-prospect | egen | Djupresearch ett prospect (företag eller person) för säljpipeline. |
| review-pr | plugin:claude-plugins-official |  |
| revise-claude-md | plugin:claude-plugins-official |  |
| sprint | egen | ADHD-vänlig sprint-plan. Bryt ner ett mål i max 5 konkreta tasks. |
| status | egen | Visa fullständig översikt av Mikes Claude-setup. Aktivera skill `mike-context-re |
| weekly-review | egen | Vecko-review mot Nordstjärnan. Söndag kväll-ritual. |

<!-- AUTO-GENERERAT:SLUT -->

---

## 7. REGLER FÖR DETTA REGISTRY

1. **Nytt projekt → lägg till agenter/skills här direkt**
2. **Ny skill installerad → lägg till i sektion 1 eller 2**
3. **Skill borttagen → markera som `[DEPRECATED]`**
4. **MEMORY.md** ska ha en pointer hit
5. **Kör `/graphify` efter stora ändringar**
