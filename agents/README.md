# agents/ — agenter i egna mappar

Varje agent bor i **sin egen mapp**: `agent.md` (definitionen) + `used-by.md` (vilka projekt + vilken context den drar).
Källa för definitionerna: `~/.claude/agents/`.

| Mapp | Roll |
|---|---|
| `code-reviewer-aios/` | Code review (Next.js/TS/Docker/Supabase) |
| `content-writer/` | LinkedIn, podcast, copy, kurs-material |
| `deploy-agent/` | Vercel + Docker + Hostinger deploys |
| `finance-bookkeeper/` | Stripe, MRR, fakturor, kostnader |
| `ops-daily/` | Dagliga rutiner, briefs, mail-triage |
| `sales-prospector/` | LinkedIn-research, lead scoring, outreach |

**Vilket projekt använder vilken agent?** → se [REGISTRY.md](../REGISTRY.md).
