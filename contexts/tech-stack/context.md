---
context: tech-stack
titel: Aktiv tech stack + vad vi INTE använder
used_by: [ThyroidAI, AIOS_Core, Fluentic-AI, ByggFlow, Infrea-Insight, AF-SIUS, ze-parts, CEO-with-ADHD]
källa: ~/ai_upscale_work/CLAUDE.md + knowledge/04_tech_stack.md
uppdaterad: 2026-06-15
---

# Aktiv tech stack

## Kärna
| Verktyg | Roll |
|---|---|
| Claude Code (Opus, 1M context) | Bygger agenter, skills, infra, video |
| OpenClaw + Telegram-bot | Agent-runtime, multi-agent |
| Remotion | Programmatisk video |
| Instantly | Email outreach (B2B) |
| Gemini | YouTube + bild/video |

## Stödjande
| Verktyg | Roll |
|---|---|
| Stripe | Betalning (alla produkter) |
| Supabase + pgvector | DB, RAG, patient-data |
| Docker | ThyroidAI VPS-host |
| Hostinger VPS (76.13.149.231) | ThyroidAI Docker-host — 180 kr/mån |
| Vercel | Småappar |
| GitHub | Versionhantering |

## Vad vi INTE använder (föreslå ALDRIG utan explicit OK)
| Verktyg | Anledning |
|---|---|
| **Paperclip** | LLM-strul + RAM-tungt, avinstallerat |
| Make.com, Phantombuster, Fortnox, Airtable | Ersatta/onödiga |
| Cloudflare | Aldrig använt — DNS via Hostinger |

## Regler
- **På befintlig server > ny VPS** alltid (betalar redan Hostinger)
- **Fråga ALLTID innan LLM-byte** — visa exakta priser
- **ALLTID git commit + push** efter ändringar

Relaterat: [[core-principles]]. Agenter: [[deploy-agent]], [[code-reviewer-aios]].
