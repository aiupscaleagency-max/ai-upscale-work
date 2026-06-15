# Graph Report - paperclip  (2026-05-13)

## Corpus Check
- 14 files · ~4,618 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 125 nodes · 112 edges · 14 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `ThyroidAI — Alla 7 agenter (sammanfattning för Paperclip)` - 10 edges
2. `Varje agent väljer själv rätt LLM baserat på uppgiftstyp` - 10 edges
3. `ThyroidAI — AI-läkarteam` - 8 edges
4. `ThyroidAI — Multi-LLM Routing Strategy` - 8 edges
5. `Dr. Sofia Reyes — Sköldkörtelläkare` - 7 edges
6. `Dr. Maria Lindström — Traumapsykolog` - 6 edges
7. `Gemini Live Skill` - 6 edges
8. `Dr. Juan Castillo — Nutritionsläkare` - 5 edges
9. `Dr. Arjun Patel — Medicinsk Forskare` - 5 edges
10. `Coach Anna Bergström — Mental Coach` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (14 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (15): Agenternas standardval, code:yaml (---), code:block2 (MODELLVAL:), code:json ({), DeepSeek → Claude, Escalation-logik, Gemini → Claude, I agentdefinitionen (.md-fil) (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (12): agent, agentRows, agents, app, cachedAgents, __dirname, getAgents(), icons (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (13): AGENT 1 — CEO (du), AGENT 2 — Dr. Sofia Reyes, AGENT 3 — Dr. Maria Lindström, AGENT 4 — Vägledare Amara, AGENT 5 — Coach Anna Bergström, AGENT 6 — Dr. Juan Castillo, AGENT 7 — Jurist Eva Lindgren, AGENT 8 — Dr. Arjun Patel (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (10): Agent 1: Dr. Sofia Reyes (thyroid_doctor), Agent 2: Dr. Maria Lindström (trauma_psychologist), Agent 3: Vägledare Amara (spiritual_guide), Agent 4: Coach Anna Bergström (mental_coach), Agent 5: Dr. Juan Castillo (nutritionist), Agent 6: Jurist Eva Lindgren (insurance_lawyer), Agent 7: Dr. Arjun Patel (medical_researcher), Agentsamarbeten (koordinationskedja) (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (8): Budget, Företagsidentitet, Hemligheter (synliga BARA för Mike i Paperclip-dashboarden), KPIs, Mål, Team (7 specialister), ThyroidAI — AI-läkarteam, Vad patienter SER i appen

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (8): code:yaml (schedule: "*/30 * * * *"  # Var 30:e minut), Dr. Sofia Reyes — Sköldkörtelläkare, Heartbeat (automatisk aktivitet), Kompetenser, Patientsynlighet, Samarbete, Uppdrag, Verktyg

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (7): code:yaml (schedule: "0 9,18 * * *"  # Kl 09:00 och 18:00), Dr. Maria Lindström — Traumapsykolog, Heartbeat, Kompetenser, Samarbete, Uppdrag, Verktyg

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (7): Aktivering, code:block1 (GOOGLE_AI_API_KEY=   # Från Google AI Studio), Gemini Live Skill, Miljövariabler, Röster per agent, Teknisk setup, Vad det gör

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (6): code:yaml (schedule: "0 6 * * *"  # Varje morgon kl 06:00), Dr. Arjun Patel — Medicinsk Forskare, Heartbeat, Kompetenser, Uppdrag, Verktyg

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (6): Coach Anna Bergström — Mental Coach, code:yaml (schedule: "0 8 * * 1"  # Varje måndag kl 08:00), Heartbeat, Kompetenser, Uppdrag, Verktyg

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (5): Dr. Juan Castillo — Nutritionsläkare, Kompetenser, Samarbete, Uppdrag, Verktyg

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (5): Aktivering, Användningsfall för ThyroidAI, code:yaml (agent_can_use: [medical_researcher, insurance_lawyer, thyroi), OpenClaw Search Skill, Vad det gör

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (4): Jurist Eva Lindgren — Försäkringsjurist, Kompetenser, Uppdrag, Verktyg

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (4): Kompetenser, Uppdrag, Verktyg, Vägledare Amara — Andlig & Existentiell Vägledare

## Knowledge Gaps
- **84 isolated node(s):** `__dirname`, `app`, `cachedAgents`, `agents`, `agent` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `__dirname`, `app`, `cachedAgents` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._