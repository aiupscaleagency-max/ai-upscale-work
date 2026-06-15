# ThyroidAI — Multi-LLM Routing Strategy

## Systemöversikt
Varje agent väljer själv rätt LLM baserat på uppgifttyp:
- **Claude Opus 4.6** — Djup analys, forskning, strategi, juridik
- **DeepSeek R1 (Free)** — Verktygsutformning, execution, ramverk
- **Gemini 2.0 Flash** — Recept, innehållsgenerering, Google-integrationer

## Agenternas standardval

| Agent | Preferred LLM | Varför | Kan escalate till |
|-------|---------------|--------|-------------------|
| Dr. Sofia Reyes (Läkare) | Claude | Medicinsk analys + forskning | Redan Claude |
| Dr. Maria Lindström (Psykolog) | Claude | Djup psykologisk analys + KBT | Redan Claude |
| Vägledare Amara (Andlig) | Claude | Existentiell djup, meningsskapande | Redan Claude |
| Coach Anna Bergström | DeepSeek | Verktyg, ramverk, träning | Claude (om behövligt) |
| Dr. Juan Castillo (Nutrient) | Gemini | Recept, innehåll, Google-search | Claude (om komplicerat) |
| Jurist Eva Lindgren | Claude | Juridisk precision, lagkännedom | Redan Claude |
| Dr. Arjun Patel (Forskning) | Claude | Forsningsanalys, källkritik | Redan Claude |

## Escalation-logik
**Scenarion när agent uppeskalerar från sitt default:**

### DeepSeek → Claude
- Patientfråga kräver djup medicinsk analys (inte bara verktyg/ramverk)
- Komplicerad juridisk aspekt nämns
- Traumasymtom detekteras

### Gemini → Claude
- Nutritionsfråga kombineras med komplext medicinskt problem
- Juridiska eller psykologiska aspekter framkommer
- Patient behöver clinical decision support

## Implementering i Paperclips

### I agentdefinitionen (.md-fil)
```yaml
---
id: mental_coach
name: Coach Anna Bergström
preferredLLM: deepseek
llmReason: Execution av verktyg + frameworks — kostnadsoptimerad
model: deepseek-r1:free  # Default modell
---
```

### I systemprompten för agenten
Lägg till denna instruktion i varje agents Task Description:

```
MODELLVAL:
- Din standardmodell är [PREFERRED_LLM]
- Du kan alltid escalate till Claude om uppgiften är för komplex
- Escalate om du märker: djup medicinsk analys behövs, juridik, trauma, eller omöjlig uppgift
- Systemet klassificerar uppgiften automatiskt och väljer rätt modell
```

## Kostnadseffektivitet
- **Free tier:** DeepSeek R1 (CoE ca 0 SEK per request)
- **Mid-tier:** Gemini 2.0 Flash (CoE ca 0,5 SEK per request)
- **Premium:** Claude Opus 4.6 (CoE ca 5 SEK per request)

**Budget:** 5000 SEK/mån = ~1000 Claude-anrop + unlimited DeepSeek+Gemini

## Monitoring & Logging
Alla LLM-val loggas för cost-tracking:
```json
{
  "timestamp": "2026-03-31T14:30:00Z",
  "agentId": "mental_coach",
  "model": "deepseek-r1:free",
  "taskType": "execution",
  "escalated": false,
  "costEstimate": "free"
}
```

**Dashboard:** Mike kan se vilket LLM varje agent använder och spara kostnader.

---

## Integration med ThyroidAI-appen

Samma routing-logik finns i:
- `lib/llm/agent-router.ts` — väljer rätt modell för Next.js-appen
- `constants/agents.ts` — agent-konfiguration med preferredLLM

**Resultat:** Konsistent LLM-val både i app och i PaperClips.
