# REGISTRY — kartan över context, agenter & projekt

> **Senast uppdaterad:** 2026-06-16
> **Syfte:** Single source of truth för länkningen. Varje **context** och **agent** bor i sin egen mapp och länkas härifrån till de **projekt** som använder den.
> **Inspiration:** affaan-m/ecc (agent harness operating system)
> **Princip:** Ändra en context på ETT ställe (`contexts/<namn>/`) → den gäller i alla länkade projekt.

---

## Hur det hänger ihop

```
contexts/<namn>/context.md     ← innehållet (med used_by-frontmatter)
agents/<namn>/agent.md         ← agent-definitionen
agents/<namn>/used-by.md       ← vilka projekt + vilken context den drar
REGISTRY.md (denna fil)        ← kartan i båda riktningar
projects (submoduler)          ← se PROJECTS_REGISTRY.md
```

---

## A) Context → projekt (vem använder vad)

| Context (`contexts/`) | Används av projekt |
|---|---|
| [vision-goals](contexts/vision-goals/context.md) | ALLA |
| [adhd-rules](contexts/adhd-rules/context.md) | ALLA |
| [core-principles](contexts/core-principles/context.md) | ALLA |
| [brand-voice](contexts/brand-voice/context.md) | ThyroidAI, CEO-with-ADHD, YouTube-4-Kids, Fluentic-AI, content-templates |
| [sales-playbook](contexts/sales-playbook/context.md) | ByggFlow, Infrea-Insight, AF-SIUS, ze-parts, AIOS_Core |
| [pricing-floors](contexts/pricing-floors/context.md) | ByggFlow, Infrea-Insight, AF-SIUS, ze-parts, AIOS_Core, ThyroidAI |
| [tech-stack](contexts/tech-stack/context.md) | ThyroidAI, AIOS_Core, Fluentic-AI, ByggFlow, Infrea-Insight, AF-SIUS, ze-parts, CEO-with-ADHD |
| [thyroid-medical](contexts/thyroid-medical/context.md) | ThyroidAI |
| [video-production](contexts/video-production/context.md) | ThyroidAI, CEO-with-ADHD, YouTube-4-Kids, content-templates, Fluentic-AI |

## B) Agent → projekt

| Agent (`agents/`) | Används av projekt | Drar context |
|---|---|---|
| [code-reviewer-aios](agents/code-reviewer-aios/) | AIOS_Core, ThyroidAI, Fluentic-AI, ByggFlow, Infrea-Insight, AF-SIUS | tech-stack |
| [content-writer](agents/content-writer/) | ThyroidAI, CEO-with-ADHD, YouTube-4-Kids, content-templates | brand-voice, video-production |
| [deploy-agent](agents/deploy-agent/) | ThyroidAI, Fluentic-AI, AIOS_Core, AIOS_Core_landing | tech-stack |
| [finance-bookkeeper](agents/finance-bookkeeper/) | ThyroidAI, ALLA | pricing-floors |
| [ops-daily](agents/ops-daily/) | ALLA | adhd-rules, vision-goals |
| [sales-prospector](agents/sales-prospector/) | ByggFlow, Infrea-Insight, AF-SIUS, ze-parts | sales-playbook, pricing-floors |

---

## C) Projekt → context & agenter (omvänt — vad varje projekt drar)

| Projekt | Context | Agenter |
|---|---|---|
| **ThyroidAI** | vision-goals, adhd-rules, core-principles, brand-voice, pricing-floors, tech-stack, thyroid-medical, video-production | code-reviewer-aios, content-writer, deploy-agent, finance-bookkeeper |
| **AIOS_Core** | vision-goals, adhd-rules, core-principles, sales-playbook, pricing-floors, tech-stack | code-reviewer-aios, deploy-agent |
| **ByggFlow** | vision-goals, adhd-rules, core-principles, sales-playbook, pricing-floors, tech-stack | code-reviewer-aios, sales-prospector |
| **Infrea-Insight** | vision-goals, adhd-rules, core-principles, sales-playbook, pricing-floors, tech-stack | code-reviewer-aios, sales-prospector |
| **AF-SIUS** | vision-goals, adhd-rules, core-principles, sales-playbook, pricing-floors, tech-stack | code-reviewer-aios, sales-prospector |
| **ze-parts** | vision-goals, adhd-rules, core-principles, sales-playbook, pricing-floors, tech-stack | sales-prospector |
| **Fluentic-AI** | vision-goals, adhd-rules, core-principles, brand-voice, tech-stack, video-production | code-reviewer-aios, deploy-agent |
| **CEO-with-ADHD** | vision-goals, adhd-rules, core-principles, brand-voice, tech-stack, video-production | content-writer |
| **YouTube-4-Kids** | vision-goals, adhd-rules, core-principles, brand-voice, video-production | content-writer |

---

## Så lägger du till nytt

1. **Ny context:** skapa `contexts/<namn>/context.md` med `used_by:`-frontmatter → lägg rad i tabell A + C.
2. **Ny agent:** skapa `agents/<namn>/agent.md` + `used-by.md` → lägg rad i tabell B + C.
3. **Nytt projekt:** lägg till som submodul (se PROJECTS_REGISTRY.md) → lägg rad i tabell C med vilka context/agenter det drar.

> Projekt-mappning & GitHub-status: se [PROJECTS_REGISTRY.md](PROJECTS_REGISTRY.md).
