# SESSION HANDOVER — fortsätt i VS Code (Claude Code v2.1.172)

> **Datum:** 2026-06-11 kväll
> **Föregående session:** Claude desktop/web (v1.12603.1)
> **Nästa session:** VS Code → Claude Code v2.1.172 → Opus 4.7 1M context
> **Användning:** Klistra in denna fil som första prompt i nya sessionen, ELLER säg "läs SESSION_HANDOVER_2026-06-11.md"

---

## 🎯 Vad vi bygger

**Mikes 2nd + 3rd brain** — single source of truth där:
- All data (kod, sälj, agenter, kunder, strategi) är på EN plats
- Graphify + Obsidian samarbetar (inte bara dumpar in noter)
- Memory-filer från `~/.claude/projects/.../memory/` är integrerade
- Mikes agenter (OpenClaw + Claude-skills) kan PLUGGA IN i 2nd brain
- 3rd brain = agenter som agerar autonomt på 2nd brain (sälj, leverans, content)

## ✅ Vad som är klart (KÖR INTE OM)

| Klart | Status |
|---|---|
| Graphify körd på hela ai_upscale_work | ✅ 7373 nodes, 10088 edges, 987 communities |
| GRAPH_REPORT.md + cluster-only kört | ✅ Communities har riktiga namn |
| Obsidian-vault skapat | ✅ `~/Obsidian-Vaults/AI-Upscale-Brain/` |
| PROJECTS_REGISTRY.md skapat | ✅ Komplett lista över 21 projekt + 10 GitHub-repos |
| Memory-pekare i ~/.claude/projects/.../memory/projects_registry.md | ✅ |
| MEMORY.md uppdaterad med pekare | ✅ |
| OpenRouter-key identifierad i ~/.zshrc | 🔴 SKA REVOKAS (gammal från Paperclip-tiden) |

## 🚧 Vad som ÅTERSTÅR (det riktiga jobbet)

### Spår A — Äkta Graphify+Obsidian-samarbete
Just nu dumpar Graphify 5150 flata noter i vaultets root. Det är inte ett samarbete.
**Mål:** Strukturerade mappar per domän, wiki-länkar fungerar, Dataview-queries över allt.

### Spår B — Integrera ALL memory
- Migrera `~/.claude/projects/-Users-mikaelluengojohansson-ai-upscale-work/memory/*.md` → `08-memory/`
- Migrera `~/ai_upscale_work/knowledge/*.md` → `01-strategy/`
- Migrera `~/ai_upscale_work/AGENTS_REGISTRY.md` → `03-agents/`
- Migrera `~/.claude/CLAUDE.md` + `~/ai_upscale_work/CLAUDE.md` → `01-strategy/`

### Spår C — Obsidian setup-perfekt för Mike
- Lager 1: Core settings (Wikilinks ON, ny-note → inbox)
- Lager 2: Plugins (Dataview, Templater, Excalidraw, Iconize, Calendar)
- Lager 3: Hotkeys (Cmd+Shift+N daily, Cmd+P quick switch)
- Lager 4: Templates (daily-brief, new-project, new-client, weekly-review)
- Lager 5: Daily notes-system

### Spår D — Mike's regel: agenter ska VALIDERA innan bygge
- Före varje icke-trivial implementation: kör `llm-council` eller `plan-eng-review`
- Sparar tokens genom att fånga fel tidigt
- Använd `karpathy-ai-upscale` skill (auto-aktiveras vid kodning)

### Spår E — Säkra de 7 projekt UTAN GitHub-backup
- AIOS_Core_landing, ByggFlow, Infrea-Insight, ze-parts, Graphify-Mall-AI-OS, agent-os
- Pusha till `aiupscaleagency-max/` som privata repos

## 🌙 Natt-plan (medan Mike sover)

Starta dessa i parallella Agent View-sessions i VS Code:

```bash
# Terminal 1 — Spår B (memory-migration)
cd ~/Obsidian-Vaults/AI-Upscale-Brain
claude
# Prompt: "Läs ~/ai_upscale_work/SESSION_HANDOVER_2026-06-11.md. Implementera Spår B:
# migrera alla memory-filer, knowledge/, AGENTS_REGISTRY till rätt mappar i vaultet.
# Bevara wiki-länkar. Skapa index per mapp."

# Terminal 2 — Spår A (Graphify+Obsidian sammarbete)
cd ~/ai_upscale_work
claude
# Prompt: "Läs SESSION_HANDOVER_2026-06-11.md. Implementera Spår A:
# omstrukturera vaultet så Graphify-noter (5150 st) ligger i 99-graphify-dump/
# istället för flata i root. Bygg Dataview-index per kategori."

# Terminal 3 — Spår E (GitHub-backup)
claude
# Prompt: "Läs SESSION_HANDOVER_2026-06-11.md. Implementera Spår E:
# pusha de 7 projekten utan backup till aiupscaleagency-max/ som privata repos.
# Använd gh repo create."

# Terminal 4 — Spår C (Obsidian-setup)
# DETTA gör Mike SJÄLV imorgon (kräver klick i Obsidian-GUI)
```

## 🔑 Viktiga konventioner (gäller alltid)

1. **Svenska** för all kommunikation och kod-kommentarer
2. **Max 5 punkter per svar** (ADHD-anpassning)
3. **Plan först → vänta på OK → kör** (Plan Mode för icke-triviala saker)
4. **ALLTID git commit + push** efter ändringar
5. **Fråga ALLTID innan LLM-byte** (visa exakta priser)
6. **Aldrig destruktiva commands** utan bekräftelse
7. **80/20 + ROI-gate** före nya idéer
8. **Karpathy-principer** vid kodning (kirurgiska ändringar, inga tysta antaganden)
9. **Mike's röst i content** (mike-content-voice skill)
10. **agenter ska validera innan bygge** (llm-council, plan-eng-review)

## 📁 Mappstruktur som ska finnas i ~/Obsidian-Vaults/AI-Upscale-Brain/

```
AI-Upscale-Brain/
├── 00-INDEX.md                    ← startpunkt, dataview-queries
├── 00-inbox/                      ← nya noter landar här
├── 01-strategy/                   ← vision, Nordstjärnan, knowledge/
├── 02-sales/                      ← familiarity, scripts, ICP, mallar
├── 03-agents/                     ← agent-prompter, registry, evals
├── 04-projects/                   ← PROJECTS_REGISTRY.md ligger HÄR
│   ├── thyroidai/
│   ├── fluentic-ai/
│   ├── aios-core/
│   └── ... per projekt
├── 05-clients/                    ← per kund-mapp
├── 06-processes/                  ← SOPs, deploy, onboarding
├── 07-content/                    ← voice, mallar, examples
├── 08-memory/                     ← kopia av ~/.claude/.../memory/
├── 09-finance/                    ← Stripe-data, MRR (auto via skill)
├── 10-personal/                   ← Mike's egna noter
└── 99-graphify-dump/              ← 5150 flata noter (Graphify-output)
    └── _COMMUNITY_*/              ← 987 communities som under-mappar
```

## 💰 Kostnadsläge

- Total kostnad hittills för Graphify: ~$0.17 (Gemini Flash)
- Per `--update` framöver: ~$0.05
- Per `cluster-only`: ~$0.02
- **Daglig drift med natt-update: ~$0.10/månad**

## ⚠️ Kritiska minnen (läs ~/.claude/projects/.../memory/MEMORY.md)

- LinkedIn = bara B2B. ThyroidAI = FB+TikTok+DM (aldrig blanda)
- Pris-golv: aldrig under 9 900 / 59 900 hantverk / 50 000 AIOS / 69 900 Byggflow / 150 000 AF-SIUS
- Färre stora kunder > många små
- Mike = Opus 4.7 frontier. OpenClaw-agenter = gratis Claude vid skala
- Lyssna FÖRST på problemet innan teknisk fix
- Video är tvärgående flaskhals för ALLA projekt

## 🎯 Nästa session börjar med

```
Läs SESSION_HANDOVER_2026-06-11.md.
Säg vad som är klart, vad återstår, och föreslå vilket spår vi börjar med ikväll.
```

---

**Sista uppdatering i föregående session:** efter cluster-only + Obsidian öppnad.
**Nästa milstolpe:** komplett 2nd brain klart innan ThyroidAI-sprint-slut.
