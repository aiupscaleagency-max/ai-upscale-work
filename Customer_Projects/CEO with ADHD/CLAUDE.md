# CEO with ADHD — CLAUDE.md

> **Typ:** Mikes eget dotterbolag (B2C kurs + coaching)
> **Global kontext:** `~/.claude/CLAUDE.md` + `~/ai_upscale_work/CLAUDE.md`
> **Agent-registry:** `~/ai_upscale_work/AGENTS_REGISTRY.md`
> **App-kod:** `~/ai_upscale_work/ceo-with-adhd/` (Next.js-appen)

## Vad detta projekt är

CEO with ADHD är en kurs + coaching-app i 4 tiers för neurodivergenta entrepreneurs. PDF-material och verktyg är KLARA. Video är EJ inspelad — det är flaskhalsen. Mål: 100 MSEK/år.

## Skills — alltid aktiva

| Skill | När |
|---|---|
| `karpathy-ai-upscale` | Auto — all kodning |
| `mike-aios-master` | Auto — Mikes kontext |
| `llm-council` | "council this" / kurs-strategi |
| `content-humanizer` | Allt kurs-content — aldrig AI-känsla |
| `mike-content-voice` | Mikes röst i kursmaterial |
| `video-content-strategist` | Video-script, module-struktur |
| `remotion` | Programmatisk video |
| `podcast-create` | Podcast-avsnitt |

## OpenClaw runtime skills

| Skill | Funktion |
|---|---|
| `course-episode-pipeline` | Producerar kurs-episoder automatiskt |
| `voice-via-elevenlabs` | Voiceover för video |
| `image-via-imagen` | Bilder till kursmaterial |

## Projekt-specifika regler

- Content ska ALDRIG låta som AI — kör alltid `content-humanizer`
- Mikes personliga ADHD-erfarenhet är källan — inte generisk info
- Video är den enda flaskhalsen just nu — prioritera det
- 4 tiers: Videokurs → Workbook → Coaching → App

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
