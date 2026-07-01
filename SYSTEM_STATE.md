# SYSTEM_STATE — delad hjärna för ALLA agenter

> **Syfte:** Single source of truth om AIOS:s nuvarande arkitektur. Läses av ALLA agenter (Claude, Gemini, OpenClaw, Hermes, AURA). Uppdatera vid varje större ändring.
> **Senast uppdaterad:** 2026-06-21
> **Ägare:** Mikael Luengo · AI Upscale Agency

---

## Vad AIOS är nu
`agent-os` ("JARVIS Agentic OS") = Mikes andra hjärna + huvudkontor i en app. Single-file dashboard (vanilla HTML/JS), repo `aiupscaleagency-max/agent-os`, speglat i `ai-upscale-work` (submodul).

## Sidor i OS:et
| Sida | Funktion |
|---|---|
| Agent Hub | 🌸 **AURA** (generativ AI, alla agenter eller enskild) — skriva + prata (röst in/ut) |
| CHAT ARENA | Alla agenter pratar med Mike OCH varandra i en tråd (diskussions-läge) |
| Content Studio | **Flow** (Veo-video) + **Omni** (Gemini Omni-video) |
| Skills Studio | 112 skills + 40 agenter (inkl RUFLO) + 44 kommandon (från `inventory.json`) |
| CRM | Leads, pipeline, stats |
| Agent Studio | Skapa agenter, `/issue`, **🖥️ Terminal Bridge** (kör gcloud/git/gh/npm säkert) |
| Visualisering | Knowledge Graph, Master Brain, Memory Galaxy |

## Terminal Bridge (`cli-bridge.js`, port 8790)
Säker CLI-exekvering från agent-os — svar på "kan agenten köra gcloud/CLI-kommandon åt mig". Ersätter behovet av ett separat Python-orkestrator-system (STT/TTS + brain + CLI-wrapper) — allt byggs in i befintlig AURA/agent-os istället.
- Allowlist: `gcloud`, `git`, `gh`, `npm`, `ls`. Allt annat avvisas.
- Ingen shell-tolkning (execFile med argv-array) — shell-metatecken (`;&|` osv) blockeras = ingen injection.
- Riskfyllda kommandon (delete/remove/destroy/rm/disable/purge/revoke) kräver explicit bekräftelse i UI:t innan körning.
- Loggar allt lokalt (`cli-bridge.log`, gitignored).
- UI: Agent Studio → Terminal Bridge-panel (snabbknappar + fritt fält + confirm-modal).

## AURA (kärn-AI)
- Persona: "kvinnan" — andra hjärna + HQ. Talar svenska, ADHD-anpassat.
- Backend: `agent-os/aura-proxy.js` (håller Gemini-nyckel hemlig). Lokalt port 8788 ELLER Cloud Run.
- Frontend ringer: lokal proxy `/aura {prompt}→text`, eller moln `/chat {message}→reply` (via `aura-config.js`).
- Förmågor: skriva ✅, prata ✅, videosamtal 🟣 (Fas 3, kräver Gemini Live + avatar).

## GCP-projekt-karta (flera projekt, avsiktligt)
| Projekt-ID | Namn | Konto | Syfte |
|---|---|---|---|
| **`caller-aios`** | Caller-AIOS | `Mikael@aiupscale.agency` | **Call-Center OS** (CALLCENTER-OS-MASTERPROMPT.md, Fas A-F) |
| `cyber-guardian-32596` | Cyber Guardian | `aiupscaleagency@gmail.com` | AURA/agent-os-experiment (Cloud Run, Firebase) — kräver `gcloud auth login --account=aiupscaleagency@gmail.com` för att synas lokalt på Macen |
| `abstract-tract-480217-q6` | biz-aiupscale-API | `Mikael@aiupscale.agency` | AURA ADK live-agent (adk_live, agent-starter-pack) |
| `gen-lang-client-0597537679` | ThyroidAI Clinic - New Design | — | ThyroidAI |
| `extreme-surge-487813-v9` | n8n-integration | — | Automation |

**Byt aktivt projekt/konto innan CLI-kommandon:** `gcloud config set account <konto>` + `gcloud config set project <id>`. Terminal Bridge kör alltid mot vad `gcloud` för tillfället pekar på — kolla FÖRST med `gcloud config list`.

## Moln-infrastruktur (Google Cloud, projekt `cyber-guardian-32596`)
| Resurs | Status |
|---|---|
| Cloud Run: **Cyber Guardian** (AURA-hjärna) | ⚠️ deployad, `/chat` svarar 404 utifrån — EJ verifierad live |
| `aura` (ADK live voice/video-agent) | Kör lokalt i Cloud Shell |
| Secret Manager | Google AI, Anthropic, Twilio, Hostinger, Supabase |
| Firebase Hosting | Config klar (`firebase.json`, `.firebaserc`) — deploy pågår → `cyber-guardian-32596.web.app` |
| DB | **Supabase** (EU North) behålls som primär — ingen migrering |

## 3-fas-vision
1. **FAS 1 (KLAR):** CHAT ARENA — agenter pratar ihop.
2. **FAS 2:** Verktygs-spegling — Google-verktyg (Flow/Omni/AI Studio) INNE i systemet.
3. **FAS 3:** Generativ AI-avatar — videosamtal med AURA ("kvinnan").

## Öppna punkter (TODO för agenter)
- [ ] Verifiera Cloud Run `/chat` (riktigt curl → 200, redeploy, rätt endpoint)
- [ ] Skapa `aura-config.js` med X-API-KEY → koppla moln-AURA
- [ ] Pusha `GCP_STATUS.md` från Cloud Shell till GitHub
- [ ] Rotera läckta nycklar (Gemini/Anthropic/Twilio — exponerade i chatt)
- [ ] Flytta ThyroidAI från Hostinger → Cloud Run (spar 500 kr/mån) — FÖRSIKTIGT (live + Stripe)
- [ ] Generera AURA-avatar (`AURA-AVATAR-PROMPT.md`)

## Viktiga regler (gäller alla agenter)
- Nycklar BARA i Secret Manager (moln) + `.zshenv`/`.env.local` (lokalt). ALDRIG i en fil som checkas in.
- Svenska, ADHD-anpassat (max 5 punkter), plan → OK → kör.
- Behåll Mikes befintliga (RUFLO, egna skills/agenter) — lägg till, ta aldrig bort.
