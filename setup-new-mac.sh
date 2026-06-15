#!/usr/bin/env bash
# Setup-script för Mikes nya Mac
# Kör på nya datorn: bash setup-new-mac.sh
# Status: 2026-05-22

set -e  # Stoppa vid fel
trap 'echo "❌ Något gick fel på rad $LINENO. Stoppa och rapportera."' ERR

echo "🚀 AI Upscale — Setup nya Mac"
echo "================================"
echo ""

# --- 1. Homebrew ---
if ! command -v brew &>/dev/null; then
    echo "📦 Installerar Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Lägg till brew i PATH för Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew redan installerat"
fi

# --- 2. Grundverktyg ---
echo ""
echo "📦 Installerar grundverktyg..."
brew install git gh node@20 2>/dev/null || true

# --- 3. Apps (om de inte redan finns) ---
echo ""
echo "📦 Installerar appar (kan ta 5-15 min)..."
brew install --cask visual-studio-code claude warp 2>/dev/null || echo "Vissa kan redan vara installerade — OK"

# --- 4. Claude Code CLI ---
echo ""
echo "📦 Installerar Claude Code CLI..."
npm install -g @anthropic-ai/claude-code 2>/dev/null || echo "Claude Code redan installerat"

# --- 5. GitHub-inloggning ---
echo ""
echo "🔐 GitHub-inloggning"
echo "   Följ instruktionerna i terminalen..."
if ! gh auth status &>/dev/null; then
    gh auth login -h github.com -p https -w
else
    echo "✅ Redan inloggad på GitHub"
fi

# --- 6. Skapa mapp-struktur ---
echo ""
echo "📁 Skapar mappstruktur..."
mkdir -p ~/ai_upscale_work/Customer_Projects
cd ~/ai_upscale_work

# --- 7. Klona alla repos ---
echo ""
echo "📥 Klonar repos från GitHub..."

REPOS_ROOT=(
    "AIOS_Core"
    "the-engine"
    "fluentic-ai"
    "caso-chile-dashboard"
    "aiupscale-monitor"
    "ceo-with-adhd"
)

REPOS_CUSTOMER=(
    "ThyroidAI:ThyroidAI : Läkarteamet"
    "arbetsformedlingen-ai:Arbetsformedlingen"
    "mikael-trading-os:mikael-trading-os"
)

for repo in "${REPOS_ROOT[@]}"; do
    if [[ -d "$repo" ]]; then
        echo "  ⏭️  $repo redan klonat — hoppar över (kör 'git pull' manuellt om du vill uppdatera)"
    else
        echo "  📥 Klonar $repo..."
        gh repo clone "aiupscaleagency-max/$repo" "$repo" || echo "  ⚠️  Kunde inte klona $repo"
    fi
done

cd ~/ai_upscale_work/Customer_Projects
for entry in "${REPOS_CUSTOMER[@]}"; do
    repo="${entry%%:*}"
    folder="${entry##*:}"
    if [[ -d "$folder" ]]; then
        echo "  ⏭️  $folder redan klonat"
    else
        echo "  📥 Klonar $repo → $folder..."
        gh repo clone "aiupscaleagency-max/$repo" "$folder" || echo "  ⚠️  Kunde inte klona $repo"
    fi
done

# --- 8. Klart ---
echo ""
echo "================================"
echo "✅ KLART — Setup-bas är installerad"
echo "================================"
echo ""
echo "📋 NÄSTA STEG (manuellt):"
echo ""
echo "1. Öppna VS Code → logga in med GitHub → slå på Settings Sync"
echo "2. Öppna Claude Desktop → logga in med samma Anthropic-konto"
echo "3. Sätt upp .env-filer för varje projekt (Stripe-keys, Supabase-keys etc.)"
echo "   → Kopiera från primära datorn via AirDrop — finns INTE i GitHub"
echo "4. För Claude Code-skills + CLAUDE.md → vänta tills mike-dotclaude-repot är klart"
echo ""
echo "Kör 'cat ~/ai_upscale_work/CLAUDE.md' för projekt-kontext."
echo ""
