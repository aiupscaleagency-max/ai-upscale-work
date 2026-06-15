---
name: daily-audit
description: Daglig kostnads + produktions-audit. Aktiveras automatiskt via cron 07:30 OCH on-demand när Mike säger "audit", "vad gjorde du igår", "kostnad", "spend", "produktionsrapport". Visar vad agenten gjort, kostnad, fel-rate.
---

# Daily Audit Skill

## När aktiveras
- Automatiskt 07:30 dagligen via cron
- On-demand: "audit", "vad gjorde du igår", "spend", "kostnad", "produktionsrapport"

## Vad audit:en innehåller

### 📊 Kostnad senaste 24h
- Per provider (Google, OpenRouter, ElevenLabs)
- Per modell (gemini-flash, deepseek, sonnet, etc.)
- Total spend vs budget ($5/dag limit)
- Trend: jämför med igår + förra veckan

### 🦞 Agent-aktivitet
- Antal user-meddelanden mottagna (Telegram)
- Antal agent-svar levererade
- Genomsnittlig svarstid
- Multi-step tasks (TaskFlow): vad körde, vad lyckades, vad failade

### 🎬 Content-produktion
- Skapade kursavsnitt senaste 24h
- Bilder genererade
- Voice-narration minuter
- Video-klipp renderade

### ⚠️ Fel + varningar
- LLM timeouts
- Rate-limit hits
- Failed retries
- Konfig-error

### 💡 Möjligheter (proaktiv)
- "Du har 3 LinkedIn-leads som väntat svar i 48h+"
- "ThyroidAI har 5 nya signups senaste veckan — affiliate-payout planerad?"
- "Avsnitt 4 av kursen är klart sedan 12h, ej granskat ännu"

## Output-format (Telegram)

```
☀️ DAGLIG BRIEF — 2026-05-25 07:30

💰 KOSTNAD (igår)
• Google Flash: $0.02 (15 calls)
• DeepSeek paid: $0.08 (3 scripts)
• ElevenLabs: $0.30 (1 avsnitt narration)
• Total: $0.40 / $5 budget (8%)

🦞 AKTIVITET
• 12 Q&A via Telegram (snitt 2.1s svar)
• 1 kursavsnitt producerat (#3, ADHD-prioriteringar)
• 0 fel

🎬 CONTENT
• 1 video (10:12 min, 1080p)
• 14 bilder genererade
• 14 MP3-narrations

⚠️ INGA FEL

💡 MÖJLIGHETER
• 3 LinkedIn-leads väntar svar (Cluee, hantverkarfirma)
• Avsnitt #2 ej granskat sedan 36h — vill du jag skickar för review?

📅 IDAG: avsnitt #4 (förslag: "tidshantering med ADHD")
```

## Data-källor
- `/var/log/openclaw-cron.log` — cron-aktivitet
- `/var/openclaw/state/agents/main/sessions/sessions.json` — Telegram-sessions
- `/data/content/course/episode-*/audit.log` — content-produktion
- OpenRouter dashboard API (om key + auth)
- ElevenLabs API `/user` endpoint för usage

## Vid fel
- Om data-källor saknas: visa "ingen data ännu, kommer fyllas i från och med idag"
- Om kostnader > 80% av budget: röd-flagga
- Om fel-rate > 10%: röd-flagga + suggest debug
