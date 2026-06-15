#!/bin/bash
# The Loop — Layer 7 i Agent OS
# Sparar agent-outputs till VAULT så varje ny session startar smartare

VAULT="$HOME/ai_upscale_work/VAULT"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

cmd="$1"
shift

case "$cmd" in
  save)
    # Användning: loop.sh save <typ> <fil> [agent]
    TYP="${1:-research}"
    FIL="$2"
    AGENT="${3:-okänd}"
    DEST="$VAULT/outputs/$TYP"
    mkdir -p "$DEST"
    FILENAME="$(date +%Y%m%d_%H%M%S)_${AGENT}.md"
    if [ -f "$FIL" ]; then
      cp "$FIL" "$DEST/$FILENAME"
      echo "[$TIMESTAMP] $AGENT → $TYP/$FILENAME" >> "$VAULT/sessions/loop.log"
      echo "✓ Sparad: $DEST/$FILENAME"
    else
      # Läs från stdin om ingen fil
      cat > "$DEST/$FILENAME"
      echo "[$TIMESTAMP] $AGENT → $TYP/$FILENAME (stdin)" >> "$VAULT/sessions/loop.log"
      echo "✓ Sparad: $DEST/$FILENAME"
    fi
    ;;

  log)
    # Logga ett beslut/lärdom till CONTEXT.md
    ENTRY="$1"
    AGENT="${2:-okänd}"
    echo "" >> "$VAULT/memory/CONTEXT.md"
    echo "- [$TIMESTAMP] **$AGENT:** $ENTRY" >> "$VAULT/memory/CONTEXT.md"
    echo "✓ Loggat i CONTEXT.md"
    ;;

  context)
    # Hämta kontext för en ny session
    echo "=== VAULT KONTEXT ==="
    cat "$VAULT/memory/CONTEXT.md"
    echo ""
    echo "=== SENASTE OUTPUTS ==="
    find "$VAULT/outputs" -name "*.md" -newer "$VAULT/memory/CONTEXT.md" 2>/dev/null | head -5 | while read f; do
      echo "--- $f ---"
      head -5 "$f"
    done
    ;;

  status)
    # Visa VAULT-status
    echo "=== VAULT STATUS ==="
    echo "Memory-filer: $(find $VAULT/memory -name '*.md' | wc -l)"
    echo "Output-filer: $(find $VAULT/outputs -name '*.md' | wc -l)"
    echo "Sessions:     $(wc -l < $VAULT/sessions/loop.log 2>/dev/null || echo 0)"
    echo ""
    echo "Senaste aktivitet:"
    tail -5 "$VAULT/sessions/loop.log" 2>/dev/null || echo "Ingen aktivitet ännu"
    ;;

  sync)
    # Synka Claude Code memory → VAULT → OpenClaw VPS
    CLAUDE_MEM="$HOME/.claude/projects/-Users-mikaelluengojohansson-ai-upscale-work/memory"
    if [ -d "$CLAUDE_MEM" ]; then
      cp -r "$CLAUDE_MEM/"*.md "$VAULT/memory/" 2>/dev/null
      echo "✓ Claude memory synkad till VAULT"
    fi
    # Pusha till OpenClaw VPS (async, blockerar inte)
    bash "$HOME/ai_upscale_work/openclaw-deploy/skills/vault-sync.sh" &
    echo "✓ Vault-sync till OpenClaw VPS startad (bakgrund)"
    ;;

  *)
    echo "Användning: loop.sh <save|log|context|status|sync>"
    echo ""
    echo "  save <typ> <fil> [agent]  — Spara output till VAULT"
    echo "  log <text> [agent]        — Logga beslut/lärdom"
    echo "  context                   — Visa kontext för ny session"
    echo "  status                    — VAULT-statistik"
    echo "  sync                      — Synka Claude memory → VAULT"
    ;;
esac
