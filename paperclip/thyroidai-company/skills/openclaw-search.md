---
name: openclaw-search
description: OpenClaw webbsökning — låter agenter söka på nätet för aktuell information
version: 1.0.0
---

# OpenClaw Search Skill

## Vad det gör
Ger agenterna förmåga att söka på webben och hämta aktuell information: nya läkemedel, kliniska studier, FK-regler, och mer.

## Användningsfall för ThyroidAI
- **Dr. Arjun Patel:** Söker PubMed och medicinska journaler
- **Jurist Eva Lindgren:** Kontrollerar aktuella FK-regler och lagstiftning
- **Dr. Sofia Reyes:** Verifierar aktuella riktlinjer från Läkemedelsverket

## Aktivering
```yaml
agent_can_use: [medical_researcher, insurance_lawyer, thyroid_doctor]
rate_limit: 100 searches/day
```
