#!/bin/bash
# Deploy OpenClaw till Bluehost VPS (129.121.91.54)
# Migrerar state från Hostinger (76.13.149.231)
set -euo pipefail

BLUEHOST="root@129.121.91.54"
HOSTINGER="root@76.13.149.231"
SSH_KEY="$HOME/.ssh/claude_key"
LOCAL_DIR="$HOME/ai_upscale_work/openclaw-deploy"
REMOTE_DIR="/docker/openclaw"
STATE_DIR="/var/openclaw/state"

log() { echo "" ; echo "=== $1 ===" ; }

log "1/7 Installera Docker + tools på Bluehost"
ssh -i "$SSH_KEY" "$BLUEHOST" "
  command -v docker >/dev/null 2>&1 || {
    apt-get update -qq
    DEBIAN_FRONTEND=noninteractive apt-get install -y -qq docker.io docker-compose-plugin curl rsync >/dev/null
    systemctl enable --now docker
  }
  docker --version
  docker compose version | head -1
  mkdir -p $REMOTE_DIR $STATE_DIR /var/openclaw/monitor /var/log
  touch /var/log/openclaw-cron.log
"

log "2/7 Sync deploy-filer (Dockerfile + compose + scripts)"
rsync -avz -e "ssh -i $SSH_KEY" \
  --exclude='.env*' --exclude='deploy*.sh' \
  "$LOCAL_DIR/" "$BLUEHOST:$REMOTE_DIR/"

log "3/7 Bygg .env från lokala source-of-truth"
ANTHROPIC_KEY=$(grep "^ANTHROPIC_API_KEY=" "$HOME/ai_upscale_work/paperclip/thyroidai-company/.env.local" | cut -d= -f2- | tr -d '"')
GOOGLE_KEY=$(grep "^GOOGLE_AI_API_KEY=" "$HOME/ai_upscale_work/fluentic-ai/.env.local" | cut -d= -f2- | tr -d '"')
OPENROUTER_KEY=$(grep "^export OPENROUTER_API_KEY=" "$HOME/.zshrc" | cut -d= -f2- | tr -d '"')
TELEGRAM_TOKEN="8731406527:AAFNEdmXzK63nKSsxK8hQ584mz-xAOy2mto"
GATEWAY_TOKEN=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

ssh -i "$SSH_KEY" "$BLUEHOST" "cat > $REMOTE_DIR/.env <<EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
GOOGLE_AI_API_KEY=$GOOGLE_KEY
OPENROUTER_API_KEY=$OPENROUTER_KEY
TELEGRAM_BOT_TOKEN=$TELEGRAM_TOKEN
OPENCLAW_GATEWAY_TOKEN=$GATEWAY_TOKEN
EOF
chmod 600 $REMOTE_DIR/.env"

log "4/7 Tarball Hostinger-state och pusha till Bluehost (via Mac)"
ssh -i "$SSH_KEY" "$HOSTINGER" "cd /var/openclaw && tar czf /tmp/oc-state.tar.gz state" 2>&1
scp -i "$SSH_KEY" "$HOSTINGER:/tmp/oc-state.tar.gz" /tmp/oc-state.tar.gz
scp -i "$SSH_KEY" /tmp/oc-state.tar.gz "$BLUEHOST:/tmp/oc-state.tar.gz"
ssh -i "$SSH_KEY" "$BLUEHOST" "cd /var/openclaw && rm -rf state && tar xzf /tmp/oc-state.tar.gz && ls state/ | head -5"

log "5/7 Bygg och starta container"
ssh -i "$SSH_KEY" "$BLUEHOST" "cd $REMOTE_DIR && docker compose build 2>&1 | tail -5 && docker compose up -d 2>&1 | tail -5"

log "6/7 Vänta 15s för boot, verifiera"
sleep 15
ssh -i "$SSH_KEY" "$BLUEHOST" "
  docker ps --filter name=openclaw-gateway
  echo ''
  curl -s -o /dev/null -w 'Gateway HTTP: %{http_code}\n' http://127.0.0.1:18789/
  echo ''
  docker logs --tail 15 openclaw-gateway 2>&1 | grep -iE 'listening|model|telegram|error' | tail -10
"

log "7/7 Lägg scripts (cron) på host"
ssh -i "$SSH_KEY" "$BLUEHOST" "
  chmod +x $REMOTE_DIR/scripts/*.sh 2>/dev/null || true
  (crontab -l 2>/dev/null | grep -v openclaw; cat <<CRON
# OpenClaw scheduled jobs (Bluehost — added \$(date +%F))
30 7 * * * /docker/openclaw/scripts/daily-brief.sh
0 18 * * 0 /docker/openclaw/scripts/weekly-summary.sh
*/10 * * * * /docker/openclaw/scripts/health-monitor.sh
* * * * * /docker/openclaw/scripts/monitor-api.sh
CRON
) | crontab -
crontab -l | tail -5
"

echo ""
echo "✓ DEPLOY KLAR"
echo "  Container: openclaw-gateway @ 129.121.91.54"
echo "  Gateway: http://127.0.0.1:18789 (loopback)"
echo "  Gateway token finns i $REMOTE_DIR/.env"
echo "  State synced från Hostinger (samma skills, memory, auth)"
echo ""
echo "VIKTIGT — Telegram-bot pollar nu från BÅDE servrar."
echo "Stoppa Hostinger-pollingen efter verifiering:"
echo "  ssh -i ~/.ssh/claude_key root@76.13.149.231 'cd /docker/openclaw && docker compose down'"
