#!/bin/bash
# Deploy OpenClaw till 76.13.149.231 (ThyroidAI-VPS)
# Kör från Mac: bash ~/ai_upscale_work/openclaw-deploy/deploy.sh

set -euo pipefail

SERVER="root@76.13.149.231"
SSH_KEY="$HOME/.ssh/claude_key"
LOCAL_DIR="$HOME/ai_upscale_work/openclaw-deploy"
REMOTE_DIR="/docker/openclaw"
STATE_DIR="/var/openclaw/state"

echo "=== 1. Skapa remote dirs ==="
ssh -i "$SSH_KEY" "$SERVER" "mkdir -p $REMOTE_DIR $STATE_DIR"

echo "=== 2. Sync deploy-filer (Dockerfile + compose) ==="
rsync -avz -e "ssh -i $SSH_KEY" \
  --exclude='.env*' \
  --exclude='deploy.sh' \
  "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

echo "=== 3. Bygg .env på servern från Mac-state ==="
ANTHROPIC_KEY=$(grep "^ANTHROPIC_API_KEY=" "$HOME/ai_upscale_work/paperclip/thyroidai-company/.env.local" | cut -d= -f2- | tr -d '"')
GOOGLE_KEY=$(grep "^GOOGLE_AI_API_KEY=" "$HOME/ai_upscale_work/fluentic-ai/.env.local" | cut -d= -f2- | tr -d '"')
OPENROUTER_KEY=$(grep "^export OPENROUTER_API_KEY=" "$HOME/.zshrc" | cut -d= -f2- | tr -d '"')
TELEGRAM_TOKEN="8731406527:AAFNEdmXzK63nKSsxK8hQ584mz-xAOy2mto"
GATEWAY_TOKEN=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

ssh -i "$SSH_KEY" "$SERVER" "cat > $REMOTE_DIR/.env <<EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
GOOGLE_AI_API_KEY=$GOOGLE_KEY
OPENROUTER_API_KEY=$OPENROUTER_KEY
TELEGRAM_BOT_TOKEN=$TELEGRAM_TOKEN
OPENCLAW_GATEWAY_TOKEN=$GATEWAY_TOKEN
EOF
chmod 600 $REMOTE_DIR/.env"

echo "=== 4. Sync OpenClaw-state Mac → server (skills + memory + workspace) ==="
rsync -avz -e "ssh -i $SSH_KEY" \
  --exclude='*.sqlite' \
  --exclude='*.log' \
  --exclude='sessions.json' \
  --exclude='auth-state.json' \
  "$HOME/.openclaw/" "$SERVER:$STATE_DIR/"

echo "=== 5. Bygg och starta container ==="
ssh -i "$SSH_KEY" "$SERVER" "cd $REMOTE_DIR && docker compose build && docker compose up -d"

echo "=== 6. Vänta 15s, sen verifiera ==="
sleep 15
ssh -i "$SSH_KEY" "$SERVER" "docker ps --filter name=openclaw-gateway && docker logs --tail 30 openclaw-gateway"

echo "=== 7. Healthcheck ==="
ssh -i "$SSH_KEY" "$SERVER" "curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:18789/"

echo ""
echo "✓ Deploy klar."
echo "  - Container: openclaw-gateway"
echo "  - State: $STATE_DIR (persistent)"
echo "  - Config: $REMOTE_DIR"
echo "  - Gateway token sparad i $REMOTE_DIR/.env"
echo ""
echo "Nästa: stäng lokal Mac-gateway → bara servern pollar Telegram"
echo "  launchctl bootout gui/\$UID ~/Library/LaunchAgents/ai.openclaw.gateway.plist"
