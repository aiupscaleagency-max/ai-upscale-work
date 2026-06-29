# MASTER-PROMPT — AI Call Center OS (White-Label)
### Start-to-End build-spec för Claude Code + Gemini Enterprise / Code Assist

> **Till AI-agenten som bygger:** Läs HELA detta dokument innan du skriver en rad kod. Det finns en befintlig grund (`agent-os`) som du ska bygga VIDARE på — inte ersätta. Fråga vid oklarhet, gissa aldrig. Svara/kommentera på svenska. Arbeta kirurgiskt (Karpathy-principer): inga tysta antaganden, ingen överkomplikation, små verifierbara steg.

---

## 0. UPPDRAGET I EN MENING
Bygg ett **white-label AI Call Center Operating System** ovanpå befintliga `agent-os` (JARVIS-dashboard) + Google Cloud-infra, där en call-center-ägare ser sina AI-agenter ringa **live**, kan klicka in och **lyssna på varje samtal**, hanterar **leads/pipeline/kalender/CRM**, och **skapar + orkestrerar nya agenter** direkt i appen — säljbart som white-label till andra call-centers.

---

## 1. KONTEXT & BEFINTLIG GRUND (bygg vidare, RIV INTE)

**Repo:** `aiupscaleagency-max/agent-os` (master) · speglat i `ai-upscale-work` (submodul).
**App:** `agent-os/index.html` — single-file dashboard, vanilla HTML/CSS/JS, JARVIS/Iron-Man HUD-estetik (`#00c8ff` cyan, `#020810` mörk bg, Orbitron-font).

**Redan byggt (ÅTERANVÄND — bygg inte om):**
| Modul | Status |
|---|---|
| CHAT ARENA — agenter pratar med varandra | ✅ |
| AURA (Agent Hub) — generativ AI, röst in/ut, moln+lokal | ✅ |
| `aura-proxy.js` — håller nycklar hemliga (lokal + Cloud Run) | ✅ |
| Content Studio (Flow/Veo + Omni-video) | ✅ |
| Skills Studio (112 skills, 40 agenter, 44 kommandon från `inventory.json`) | ✅ |
| CRM (leads/pipeline/stats, localStorage) | ✅ MVP — ska uppgraderas till Supabase + dialer |
| Agent Studio (skapa agent, /issue) | ✅ MVP — ska bli full Orchestration Builder |
| Visualisering (Knowledge Graph, Memory Galaxy) | ✅ |

**Läs även:** `SYSTEM_STATE.md` (delad arkitektur), `GCP_STATUS.md`, `inventory.json`, `GEMINI-HANDOFF-GOOGLE-CLOUD.md`.

---

## 2. TECH STACK (exakt vad som används — avvik inte utan att fråga)

| Lager | Verktyg |
|---|---|
| Frontend | Vanilla HTML/CSS/JS (`agent-os`), hostas på **Firebase Hosting** |
| Backend / agenter | **Cloud Run** (Docker), **ADK** (Agent Development Kit, agent-starter-pack) |
| Realtids röst/video | **Vertex AI — Gemini Live API** (Cyber Guardian = orkestrator) |
| Telefoni / dialer | **Twilio** (Voice, nummer, SIP) + Gemini Live för AI-samtal |
| Databas | **Supabase** (EU North, primär) — agent-os CRM migreras hit från localStorage |
| Hemligheter | **Secret Manager** (ALLA nycklar — aldrig i frontend/git) |
| Schemaläggning | **Cloud Scheduler** + **Cloud Tasks** (async jobb) |
| Bild/video | **Imagen** + **Gemini Omni** |
| Auth | **Firebase Auth** (multi-tenant inloggning) |
| Projekt-ID | `cyber-guardian-32596` · region **`europe-north1`** |

**Säkerhetsregel (absolut):** API-nycklar bor ENDAST i Secret Manager (moln) eller `.zshenv`/`.env.local` (lokalt). ALDRIG i en fil som checkas in eller i frontend-JS. Frontend pratar alltid med Cloud Run-proxy, aldrig direkt med Google/Twilio-API:er.

---

## 3. DESIGN-SYSTEM (white-label-bart från dag 1)

**Bas-estetik (AI Upscale default-tema):** Iron-Man/JARVIS HUD — mörk navy, cyan glow, Orbitron + Share Tech Mono, hexagon-mönster, mjuka animationer, "levande" känsla.

**KRITISKT — allt ska vara TEMA-bart via CSS-variabler** (för white-label):
```css
:root{
  --brand-primary: #00c8ff;   /* kundens accentfärg */
  --brand-bg: #020810;
  --brand-logo: url(...);      /* kundens logga */
  --brand-name: "AI Upscale";  /* byts per kund */
  --brand-font: 'Orbitron';
}
```
- En `theme.json` per tenant → laddas vid start → byter färg/logga/namn/font.
- INGEN hårdkodad färg/logga/namn i komponenter — allt via variabler.
- Stöd för "light corporate"-tema också (vissa call-centers vill inte ha sci-fi).

**UX-krav:** snabbt (lazy-load tunga moduler), responsivt (desktop + surfplatta för golvchefer), tillgängligt, ADHD-vänligt (tydlig hierarki, inte rörigt).

---

## 4. MODULER — DETALJERAD KRAVSPEC

### 4.1 📞 DIALER (kärnan)
- Power/predictive dialer: ringer listor automatiskt via **Twilio**.
- AI-agent (Gemini Live) tar samtalet — naturlig röst, svenska + fler språk.
- Manuell + auto-läge: agent ringer själv, eller människa kan ta över ("barge-in").
- Realtids-transkribering av varje samtal (Gemini Live STT).
- Samtalskontroller: ring, lägg på, paus, överför, mute, spela in.
- Resultat-taggar per samtal (intresserad/uppföljning/nej/voicemail) → skrivs till CRM.
- **Compliance:** inspelnings-samtycke (GDPR), ring-tider per region, DNC-lista (Do Not Call), opt-out.

### 4.2 👁️ LIVE AGENT-ÖVERVAKNING (huvud-wow-funktionen)
- **Live-vägg:** rutnät med alla agenter som jobbar NU — kort per agent.
- Per agent-kort visar: namn, status (ringer/pratar/paus/idle), nuvarande kontakt, samtalslängd, live-sentiment, kö-längd.
- **Klicka en agent → "gå in" i samtalet:**
  - Lyssna live (whisper/listen-in på Twilio-streamen).
  - Se live-transkribering rulla i realtid.
  - "Whisper" (prata bara till agenten) eller "barge-in" (gå med i samtalet).
  - AI-coach-förslag i sidopanel (nästa bästa replik).
- Realtids-statistik överst: samtal/timme, connect-rate, snitt-samtalstid, konverteringar idag.
- Animerade "levande" indikatorer (pulserande när agent pratar) — JARVIS-känsla.
- Teknik: WebSocket från Cloud Run → frontend för live-status; Twilio Media Streams för audio.

### 4.3 💼 CRM (uppgradera befintlig)
- Migrera från localStorage → **Supabase** (synk mobil/web/flera enheter).
- Kontakt-poster: namn, företag, telefon, email, status, taggar, samtalshistorik, inspelningar, anteckningar, nästa steg.
- Koppling dialer ↔ CRM: varje samtal loggas automatiskt på kontakten.
- Import/export (CSV, API). Sök, filter, segment.
- Aktivitets-timeline per kontakt (samtal, mail, SMS, statusbyten).

### 4.4 📊 PIPELINE
- Kanban: Ny → Kontaktad → Demo → Offert → Stängd/Förlorad (konfigurerbara steg per tenant).
- Drag-and-drop, värde per affär (kr), viktad prognos, konverteringsgrad per steg.
- Diagram: pipeline-värde över tid, win-rate, agent-leaderboard.
- Koppling till dialer: flytta lead → trigga automatiskt nästa samtal/uppföljning.

### 4.5 📅 KALENDER
- Boka uppföljningar/demos direkt från samtal → synk **Google Calendar** (deras Workspace).
- Agent-scheman (när ringer vilken AI-agent), ring-fönster per kampanj.
- Påminnelser (Cloud Scheduler) → auto-uppföljning.
- Vy: dag/vecka/månad + agent-beläggning.

### 4.6 🤖 AGENT CREATION (uppgradera Agent Studio)
- Skapa AI-agent i appen: namn, röst (Gemini Live-voice), språk, persona/system-prompt, kunskapsbas, mål-script.
- Välj LLM per agent (Gemini / Claude / DeepSeek) + fallback.
- Koppla agent → kampanj + telefonnummer + ringlista.
- Testa agent i sandbox (prata med den) innan den går live.
- Versionshantering av prompts (rulla tillbaka om en version presterar sämre).

### 4.7 🧩 ORCHESTRATION BUILDER (bygg arbetsflöden visuellt)
- Visuell flow-builder: dra in agenter, villkor, åtgärder → bygg samtalsflöden + multi-agent-kedjor.
- T.ex.: AURA tar inkommande → kvalificerar → kopplar till säljagent → bokar i kalender → skapar lead i CRM.
- Triggers: inkommande samtal, ny lead, schemalagt, webhook.
- Återanvänd CHAT ARENA-motorn (agent-till-agent) + ADK för exekvering.
- "Issue"-kommando: ge ett mål → agenter planerar + agerar (befintligt, vidareutveckla).

### 4.8 BEHÅLL (befintligt): CHAT ARENA, AURA, Content Studio, Skills Studio, Visualisering.

---

## 5. WHITE-LABEL / MULTI-TENANT (säljbart)

- **Multi-tenant från grunden:** varje call-center = en tenant (eget tema, egen data, egna agenter, egna nummer).
- **`tenantId`** på ALLA dataposter (Supabase row-level security per tenant).
- **Modul-toggles:** admin kan slå PÅ/AV moduler per tenant (vissa kunder vill inte ha CHAT ARENA/Content Studio — dölj utan att riva kod). En `modules.json` per tenant.
- **Tema per tenant** (sektion 3) — logga, färg, namn, domän.
- **Roller:** Ägare / Golvchef (övervakar live) / Agent-hanterare / Säljare. Olika vyer per roll.
- **Onboarding-flöde:** ny tenant → välj tema → koppla Twilio-nummer → importera leads → skapa agenter → live.
- **Billing-hook:** per-seat eller per-minut (förbered, men aktivera senare).

---

## 6. DATAMODELL (Supabase — minimum)
`tenants` · `users` (roll, tenantId) · `agents` (persona, llm, voice, kampanj) · `contacts` (lead-data) · `calls` (agent, kontakt, längd, inspelning-URL, transkript, resultat, sentiment) · `pipeline_deals` (steg, värde, kontakt) · `campaigns` (ringlista, schema, agent) · `calendar_events` · `activities` (timeline). Allt med `tenant_id` + RLS.

---

## 7. ICKE-FUNKTIONELLA KRAV
- **Säkerhet:** Secret Manager för nycklar, RLS per tenant, inspelnings-samtycke, GDPR (EU-data), audit-logg.
- **Prestanda:** lazy-load moduler, WebSocket bara för live-vyn, paginering, Cloud Run scale-to-zero, max-instances-tak (kostnad).
- **Skalbarhet:** byggt för 100+ tenants × många agenter. Inget hårdkodat singel-tenant-antagande.
- **Observability:** Cloud Logging, fel-rapportering, kostnadstak per tenant.
- **Tillförlitlighet:** error handling i ALLA agent-flöden (aldrig tyst krasch), retry på samtal/jobb.

---

## 8. BYGG-ORDNING (faser — leverera verifierbart per steg)
1. **Fas A — Fundament:** multi-tenant + tema-system + Supabase-schema + auth + flytta CRM från localStorage.
2. **Fas B — Dialer + CRM-koppling:** Twilio-integration via Cloud Run, AI-samtal (Gemini Live), samtal loggas i CRM.
3. **Fas C — Live-övervakning:** live-vägg, klicka-in, lyssna, transkript, statistik (WOW-funktionen).
4. **Fas D — Pipeline + Kalender:** kanban + Google Calendar-synk + auto-uppföljning.
5. **Fas E — Agent Creation + Orchestration Builder:** skapa agenter + visuella flöden.
6. **Fas F — White-label-polish:** modul-toggles, onboarding, roller, billing-hook → redo att sälja.

Verifiera varje fas (kör, testa i browser, visa bevis) INNAN nästa. Commit + push per fas.

---

## 9. ACCEPTANSKRITERIER (klart = detta funkar)
- [ ] En call-center-ägare loggar in → ser sina agenter ringa LIVE → klickar in → hör samtalet + ser transkript live.
- [ ] Lead rings av AI → resultat loggas automatiskt i CRM → flyttas i pipeline → uppföljning bokas i kalender.
- [ ] Ägaren skapar en ny AI-agent i appen, testar den, sätter den live på en kampanj — utan kod.
- [ ] Allt fungerar för 2 olika tenants med olika tema/logga, utan att de ser varandras data.
- [ ] Inga nycklar i frontend/git. Appen är snabb även med många agenter.

---

## 10. ROLLER: vem gör vad
- **Gemini Enterprise / Code Assist (Cloud Shell):** GCP-infra — Cloud Run-deploys, Secret Manager, Twilio-koppling, Vertex AI/Gemini Live, Supabase, Cloud Scheduler. Äger backend + moln.
- **Claude Code (lokalt):** frontend `agent-os` (alla moduler/UI/design/tema), agent-os ↔ Cloud Run-koppling, white-label-system. Äger frontend + UX.
- **Regel mellan er:** `git pull` FÖRST före varje redigering. Dela katalog-filer (`SYSTEM_STATE.md`, `inventory.json`) ägs av frontend-sidan. Skriv aldrig över varandras filer — pulla, redigera, pusha.

---

*Skriven av Claude för Mike Luengo · AI Upscale Agency · 2026-06-21. Mål: white-label AI Call Center OS säljbart till call-centers. Bygg vidare på befintliga agent-os, riv inget, fråga vid oklarhet.*
