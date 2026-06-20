# ECC-utvärdering (affaan-m/ECC v2.0.0)

> **Klonad:** 2026-06-18 → `~/ai_upscale_work/_reference/ECC/`
> **Vad det är:** "Everything Claude Code" — harness-native operator system. Funkar i Claude Code, Codex, Cursor, Gemini, Zed m.fl.
> **Status hos oss:** Endast klonat för utvärdering. Inget installerat. Dina egna skills/agenter/kommandon är orörda.

---

## Vad ECC innehåller

| Resurs | Antal | Mappar |
|---|---|---|
| **Agenter** | 67 | `_reference/ECC/agents/` |
| **Skills** | 271 | `_reference/ECC/skills/` |
| **Kommandon** | 92 | `_reference/ECC/commands/` |
| **Contexts** | 3 | `_reference/ECC/contexts/` |
| Hooks, rules, MCP-configs, scaffolds | — | egna mappar |
| npm-paket | `ecc-universal`, `ecc-agentshield` | plugin-slug `ecc@ecc` |

Byggt över 10+ månaders daglig produktion. Kärnprinciper: Agent-First, Test-Driven (80%+ coverage), Security-First, Immutability, Plan-Before-Execute.

---

## Vad vi REDAN har (lånat tidigare)
Vi tog ECC:s **mappstruktur** redan (`contexts/`, `agents/`, `REGISTRY.md`-länkning). Det var inspirationen i `REGISTRY.md:5`. Den biten är klar.

## Vad som är värt att plocka IN (kandidater)

| Från ECC | Varför för Mike |
|---|---|
| **security-reviewer** + `ecc-agentshield` | Säkerhetsscanning före commits — viktigt när du flyttar till Google Cloud + hanterar patientdata (ThyroidAI/Supabase) |
| **planner / architect / spec-miner** | Bättre planering av stora bygg (AIOS-flytt, nya kund-leveranser) |
| **Hooks-systemet** | Automatiska kvalitetskontroller (matchar din "Judge Agent"-vision) |
| **Cross-harness** | ECC funkar även i Gemini → relevant nu när du kör Gemini i Cloud Shell |

## Vad vi INTE behöver
- Hela 271-skills-biblioteket på en gång = för mycket (ADHD-overload + långsammare). Plocka selektivt.
- C/C++/Java/Go-specifika agenter — du kör Next.js/TS/Python, inte de språken.

---

## Rekommendation

**Installera INTE allt.** Två vägar framåt (ditt val senare):

1. **Selektivt (rekommenderat):** Kopiera in 4–6 ECC-agenter som faktiskt löser dina problem (security-reviewer, planner, architect) → lägg i `~/.claude/agents/`. Lågt underhåll, hög nytta.
2. **Plugin (`ecc@ecc`):** Installera hela ECC som plugin om du vill ha allt tillgängligt. Risk: tyngre, mer brus, måste hållas uppdaterat.

**Nästa konkreta steg:** Bygg klart inventeringen (vår generator) FÖRST så vi ser exakt vad du redan har — sen avgör vi vilka ECC-bitar som tillför något du saknar.
