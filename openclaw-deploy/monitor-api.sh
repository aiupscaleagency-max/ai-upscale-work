#!/bin/bash
# Monitor JSON-endpoint för Mike's egen monitor/CRM
# Levererar live OpenClaw-status som JSON
# Körs via cron varje minut → uppdaterar /var/openclaw/monitor/status.json
# Mike's monitor pollar https://dashboard.aiupscale.agency/api/openclaw/status.json

set -e
OUT=/var/openclaw/monitor/status.json
TMP=$(mktemp)

# Samla data från OpenClaw
HEALTH_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -m 5 http://127.0.0.1:18789/ || echo "0")
CONTAINER_STATUS=$(docker ps --filter name=openclaw-gateway --format "{{.Status}}" || echo "unknown")
MEMORY_FILES=$(docker exec openclaw-gateway sh -c "ls /root/.openclaw/workspace/memory/*.md 2>/dev/null | wc -l" || echo "0")
SKILLS_COUNT=$(docker exec openclaw-gateway sh -c "ls /root/.openclaw/workspace/skills/ 2>/dev/null | wc -l" || echo "0")
SESSIONS=$(docker exec openclaw-gateway sh -c "wc -l < /root/.openclaw/agents/main/sessions/sessions.json 2>/dev/null || echo 0")
DEFAULT_MODEL=$(docker exec openclaw-gateway sh -c "node -e 'console.log(require(\"/root/.openclaw/openclaw.json\").agents?.defaults?.model?.primary || \"unknown\")'" 2>/dev/null || echo "unknown")
GATEWAY_TOKEN=$(grep "^OPENCLAW_GATEWAY_TOKEN=" /docker/openclaw/.env | cut -d= -f2-)
UPTIME=$(uptime -p 2>/dev/null || echo "unknown")
RAM_USED=$(free -m | awk '/^Mem:/ {print $3}')
RAM_TOTAL=$(free -m | awk '/^Mem:/ {print $2}')
DISK_USED=$(df -BG / | awk 'NR==2 {print $3}' | tr -d 'G')
DISK_TOTAL=$(df -BG / | awk 'NR==2 {print $2}' | tr -d 'G')
CRON_LAST=$(tail -1 /var/log/openclaw-cron.log 2>/dev/null | head -c 200)

# Bygg JSON
cat > "$TMP" <<JSON
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "1.0",
  "server": {
    "host": "76.13.149.231",
    "uptime": "$UPTIME",
    "ram_used_mb": $RAM_USED,
    "ram_total_mb": $RAM_TOTAL,
    "disk_used_gb": $DISK_USED,
    "disk_total_gb": $DISK_TOTAL
  },
  "openclaw": {
    "gateway_http_status": $HEALTH_HTTP,
    "container_status": "$CONTAINER_STATUS",
    "default_model": "$DEFAULT_MODEL",
    "memory_files": $MEMORY_FILES,
    "skills_count": $SKILLS_COUNT,
    "active_sessions": $SESSIONS,
    "dashboard_url": "https://dashboard.aiupscale.agency"
  },
  "channels": {
    "telegram": {
      "bot": "LuengoAI_bot",
      "chat_id": 1928144865,
      "mode": "polling"
    }
  },
  "cron_jobs": {
    "daily_brief": "30 7 * * * Europe/Stockholm",
    "weekly_summary": "0 18 * * 0 Europe/Stockholm",
    "health_check": "*/10 * * * *",
    "last_run": "$CRON_LAST"
  }
}
JSON

mkdir -p $(dirname "$OUT")
mv "$TMP" "$OUT"
chmod 644 "$OUT"
