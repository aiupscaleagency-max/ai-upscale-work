---
name: gemini-live
description: Gemini 2.0 Flash Live — realtids röst/video-konsultation med agenter
version: 1.0.0
---

# Gemini Live Skill

## Vad det gör
Aktiverar realtids röst- och videosamtal mellan patient och AI-agent via Gemini 2.0 Flash Live.

## Teknisk setup
- **Modell:** gemini-2.0-flash-live-001
- **WebSocket-path:** /ws/live/{agentId}
- **Röstmappning:** Se agent-konfigurationer (varje agent har unik röst)
- **After-analysis:** Claude claude-opus-4-6 analyserar transkriptionen efter sessionen

## Röster per agent
| Agent | Gemini Voice |
|-------|-------------|
| Dr. Sofia Reyes | Charon |
| Dr. Maria Lindström | Kore |
| Vägledare Amara | Aoede |
| Coach Anna Bergström | Puck |
| Dr. Juan Castillo | Lyra |
| Jurist Eva Lindgren | Leda |
| Dr. Arjun Patel | Fenrir |

## Miljövariabler
```
GOOGLE_AI_API_KEY=   # Från Google AI Studio
```

## Aktivering
Agenten aktiverar denna skill när patient klickar "Starta Live-samtal" i appen.
