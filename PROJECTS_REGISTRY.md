# PROJECTS_REGISTRY — komplett karta över alla projekt

> **Senast verifierad:** 2026-06-11
> **Källa:** Auto-scannad från lokala git-remotes + GitHub API
> **Syfte:** Single source of truth för alla projekt — så vi aldrig behöver mappa om
> **Uppdatera:** kör `~/ai_upscale_work/scripts/refresh_registry.sh` (om finns) eller manuellt

---

## GitHub-konton

| Konto | Roll | Antal repos |
|---|---|---|
| **aiupscaleagency-max** | Mikes enda egna konto | 10+ (växer) |
| VoltAgent | Open-source klonat (inte Mike) | 1 (awesome-claude-design) |
| garrytan | Garry Tan's gstack-skills | 1 (gstack) |

**Det finns inga andra personliga GitHub-konton lokalt.** All Mikes kod ligger på `aiupscaleagency-max` eller är lokal-only.

---

## Aktiva projekt (17 st)

| # | Projekt | Lokal path | GitHub (aiupscaleagency-max/) | Status | Roll |
|---|---|---|---|---|---|
| 1 | **ThyroidAI : Läkarteamet** | `Customer_Projects/ThyroidAI : Läkarteamet/` | `ThyroidAI` | 🟢 LIVE | B2C Stripe, 7 läkar-agenter, Hostinger VPS |
| 2 | **ThyroidAI Marketing Video** | `Customer_Projects/ThyroidAI : Läkarteamet/ThyroidAI-Marketing-Video/` | (sub-projekt) | 🟡 PÅGÅR | Launch-video för ThyroidAI |
| 3 | **Fluentic-AI** | `fluentic-ai/` | `fluentic-ai` (public) | 🟡 PÅGÅR | Mikes språkapp (es/en/fr/ar) |
| 4 | **AIOS_Core** | `AIOS_Core/` | `AIOS_Core` | 🟡 PÅGÅR | Mikes egna AIOS |
| 5 | **AIOS_Core_landing** | `AIOS_Core_landing/` | `AIOS_Core_landing` | 🟡 LIVE? | Landningssida för AIOS |
| 6 | **ByggFlow** | `Customer_Projects/ByggFlow/` | `byggflow` | 🟢 KLAR | AIOS för hantverk |
| 7 | **Infrea-Insight** | `Customer_Projects/Infrea-Insight/` | `infrea-insight` | 🟢 KLAR | Uppgraderad Byggflow |
| 8 | **AF-SIUS** | `Customer_Projects/Af-SIUS/` | `arbetsformedlingen-ai` ⚠️ | 🟡 PÅGÅR | Egen produkt (Arbetsförmedlingen), intervju 10/6. **OBS: olika namn lokalt vs GitHub** |
| 9 | **ze-parts** | `Customer_Projects/ze-parts/` | `ze-parts` | 🟡 SNART KLAR | Potentiell kund |
| 10 | **CEO with ADHD** | `Customer_Projects/CEO with ADHD/ceo-with-adhd/` | `ceo-with-adhd` | 🟢 KLAR (saknar video) | Kurs + coaching-app, 4 tiers |
| 11 | **Graphify- Mall-AI-OS** | `Customer_Projects/Graphify- Mall-AI-OS/` | `graphify-mall-ai-os` | 🟡 MALL | Mall för AIOS-leveranser |
| 12 | **aiupscale-monitor** | `aiupscale-monitor/` | `aiupscale-monitor` | 🟡 INTERN | Monitor-system för Mike |
| 13 | **the-engine** | `aiupscale-monitor/the-engine/` | `the-engine` | 🟡 INTERN | Agentic OS (Mikes egen) |
| 14 | **caso-chile-dashboard** | `caso-chile-dashboard/` | `caso-chile-dashboard` | ⚪ PERSONLIGT | Eget bruk |
| 15 | **agent-os** | `agent-os/` | `agent-os` | 🟡 EXPERIMENT | Agent-system (git-only, ej package.json) |
| 16 | **awesome-claude-design** | `awesome-claude-design/` | (VoltAgent — ej Mikes) | ⚪ KLONAT | Design-bibliotek från VoltAgent |
| 17 | **cold-call-engine** | `cold-call-engine/` | `cold-call-engine` | 🟡 PÅGÅR | White-label AI cold-calling-motor (Agora + Gemini Live). Första tenant: Arbetsmiljöcenter (agentName "Mikael"). Saknar Agora-konto + Gemini API-nyckel innan live-test. |

## Pausade / skrotade (3 st)

| # | Projekt | Lokal path | GitHub | Status |
|---|---|---|---|---|
| 17 | **mikael-trading-os** | `Customer_Projects/mikael-trading-os/` | `mikael-trading-os` (public) | ⚫ PAUSAT — använder annans system |
| 18 | **Paperclips Orchestration System** | `Customer_Projects/Paperclips Orchestration System/` | ❌ SAKNAS | ⚫ SKROTAT |
| 19 | **paperclip/thyroidai-company** | `paperclip/thyroidai-company/` | `paperclip` | ⚫ SKROTAT |

## Backups (3 st — duplicerar aktiva)

| Path | Duplicerar | Behåll? |
|---|---|---|
| `Customer_Projects/ByggFlow-BACKUP-20260506-124754/` | ByggFlow | ⚪ kan tas bort efter GitHub-push |
| `fluentic-ai-backup-2026-05-06/` | fluentic-ai | ⚪ kan tas bort |
| `backups/landing-pages-20260505-021738/` | AIOS_Core_landing | ⚪ kan tas bort efter GitHub-push |

---

## ✅ STATUS: Alla aktiva projekt säkrade på GitHub (2026-06-21)

Samtliga 17 aktiva projekt har nu fungerande repos under `aiupscaleagency-max`.
- De flesta fanns redan (Cloud Shell såg dem ej pga auth — nu fixat med `gh auth login`).
- 2 nya skapade: **AIOS_Core_landing** + **cold-call-engine** (frikopplad från Agora).

```
✅ Alla 17 aktiva projekt — backade på GitHub
⚪ Paperclips Orchestration ← skrotat (skippa)
```

---

## Namn-mappningar (lokalt ↔ GitHub)

| Lokalt namn | GitHub-namn | Notering |
|---|---|---|
| `Af-SIUS` | `arbetsformedlingen-ai` | ⚠️ Olika namn — samma kod |
| `the-engine` (i `aiupscale-monitor/`) | `the-engine` | Sub-mapp lokalt, separat repo på GitHub |

---

## Verifiera-kommandon

```bash
# Lista alla lokala git-repos
find ~/ai_upscale_work -maxdepth 5 -name ".git" -type d 2>/dev/null | sed 's|/.git$||'

# Lista alla GitHub-repos
gh repo list aiupscaleagency-max --limit 100

# Hitta vilka som saknar GitHub-remote
find ~/ai_upscale_work -maxdepth 5 -name ".git" -type d 2>/dev/null | while read d; do
  cd "$(dirname "$d")"
  if ! git remote -v | grep -q github.com; then
    echo "NO REMOTE: $(pwd)"
  fi
done
```

---

## Källor

- Lokal scan: `find ~/ai_upscale_work -name ".git/config"` (2026-06-11)
- GitHub: `gh repo list aiupscaleagency-max --limit 100` (2026-06-11)
- Cross-koll AF-SIUS: `git remote -v` i `Customer_Projects/Af-SIUS/` (2026-06-11)
