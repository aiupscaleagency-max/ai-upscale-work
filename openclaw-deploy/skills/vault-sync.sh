#!/bin/bash
# Synkar VAULT-minne till OpenClaw på VPS
# Körs automatiskt av Claude Code Stop-hook

VAULT="$HOME/ai_upscale_work/VAULT"
CLAUDE_MEM="$HOME/.claude/projects/-Users-mikaelluengojohansson-ai-upscale-work/memory"
BLUEHOST="root@129.121.91.54"
HOSTINGER="root@76.13.149.231"
SSH_KEY="$HOME/.ssh/claude_key"
REMOTE_STATE="/var/openclaw/state"

# Synka Claude memory → VAULT
cp -r "$CLAUDE_MEM/"*.md "$VAULT/memory/" 2>/dev/null

# Bygg en komprimerad kontext-fil för OpenClaw
cat > "$VAULT/memory/AGENT_OS_CONTEXT.md" << EOF
# Agent OS Kontext — $(date "+%Y-%m-%d %H:%M")
> Automatiskt genererad av vault-sync.sh. Injiceras i OpenClaw vid session-start.

## Mike (ägare)
- Grundare, AI Upscale Agency, Göteborg
- Neurodivergent, ADHD — korta svar, listor, tabeller
- Mail: aiupscaleagency@gmail.com

## Nordstjärna
- Pensionera mamma innan 11/6-2026
- 1 MILJARD KR ARR senast 1/9-2027

## Aktiv sprint
- ThyroidAI: 100+ betalande + 500 FB-likes
- Dag 8+: Byggflow + Infrea-Insight

## Priser (aldrig under)
- AIOS: 50 000 kr + månadsavgift
- Byggflow/Infrea: 69 900 kr + månadsavgift
- AF-SIUS: 150 000 kr + månadsavgift

## Kanaler
- LinkedIn: BARA B2B
- ThyroidAI: FB + TikTok + DM (aldrig LinkedIn)

## Senaste memory ($(ls -t $CLAUDE_MEM/*.md 2>/dev/null | head -3 | xargs -I{} basename {}))
$(for f in $(ls -t $CLAUDE_MEM/*.md 2>/dev/null | head -3); do echo "- $(basename $f)"; head -2 $f | tail -1; done)
EOF

echo "[$(date '+%H:%M')] VAULT/memory/AGENT_OS_CONTEXT.md uppdaterad"

# Pusha till aktiv VPS (försök Bluehost först, fall tillbaka på Hostinger)
push_to_vps() {
  local HOST=$1
  local NAME=$2
  if ssh -i "$SSH_KEY" -o ConnectTimeout=5 -o BatchMode=yes "$HOST" "echo ok" &>/dev/null; then
    rsync -az -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
      "$VAULT/memory/" \
      "$HOST:$REMOTE_STATE/memory/" 2>/dev/null \
      && echo "[$(date '+%H:%M')] ✓ VAULT synkad till $NAME ($HOST)" \
      || echo "[$(date '+%H:%M')] ⚠ rsync misslyckades mot $NAME"
  else
    echo "[$(date '+%H:%M')] ⚠ $NAME ($HOST) ej nåbar — skippar"
  fi
}

push_to_vps "$BLUEHOST" "Bluehost"
push_to_vps "$HOSTINGER" "Hostinger"

echo "[$(date '+%H:%M')] Vault-sync klar"
