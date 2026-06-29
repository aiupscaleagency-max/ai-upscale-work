# MASTER-PROMPT — AI Call Center OS (White-Label)
### Start-to-End build-spec för Claude Code + Gemini Enterprise / Code Assist

> **Till AI-agenten som bygger:** Läs HELA detta dokument innan du skriver en rad kod. Det finns en befintlig grund (`agent-os`) som du ska bygga VIDARE på — inte ersätta. Fråga vid oklarhet, gissa aldrig. Svara/kommentera på svenska. Arbeta kirurgiskt (Karpathy-principer): inga tysta antaganden, ingen överkomplikation, små verifierbara steg.

---

## 0. UPPDRAGET I EN MENING
Bygg ett **white-label AI Call Center Operating System** ovanpå befintliga `agent-os` (JARVIS-dashboard) + Google Cloud-infra, där en call-center-ägare ser sina AI-agenter ringa **live**, kan klicka in och **lyssna på varje samtal**, hanterar **leads/pipeline/kalender/CRM**, och **skapar + orkestrerar nya agenter** direkt i appen — säljbart som white-label till andra call-centers.

## 0b. VAD VI BYGGER NU = ADMIN-PORTALEN (master)
Detta bygge är **Mikes ADMIN/master-portal** — full kontroll, ser ALLA moduler, hanterar alla tenants, övervakar allt. **Kund-portalen** (white-label till call-centers) blir **samma kodbas** men **bantad** (färre moduler synliga, bara egen data, begränsad roll) — den tas fram SENARE när admin-portalen är helt klar. Bygg därför allt så att moduler/vyer kan **döljas per roll/tenant** (toggles), inte rivas. Två nivåer:
- **SUPER-ADMIN (Mike):** ser allt, alla tenants, alla agenter, all data, alla moduler.
- **TENANT (kund, senare):** bantad vy — bara sin egen data + de moduler vi slår på för dem.

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
| Skills Studio (agent-/skill-katalog från `inventory.json`) | ✅ — gör företags-agnostisk (ta bort personliga/Mike-specifika skills för kund-bygget) |
| CRM (leads/pipeline/stats, localStorage) | ✅ MVP — ska uppgraderas till Firestore + dialer |
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
| Telefoni / dialer | **Pluggbar telefoni: Twilio / Vonage / Telnyx** (en `telephony`-adapter, välj provider per tenant så marginal på samtal/SMS kan tas ut) + Google telephony-tjänster där det passar. Gemini Live driver AI-samtalen. **INTE Agora, INTE Retell.** |
| Databas | **Firestore** (Google-native, region `europe-north1`) — agent-os CRM migreras hit från localStorage. (Ingen Supabase i denna white-label-produkt.) |
| Hemligheter | **Secret Manager** (ALLA nycklar — aldrig i frontend/git) |
| Schemaläggning | **Cloud Scheduler** + **Cloud Tasks** (async jobb) |
| Bild/video | **Imagen** + **Gemini Omni** |
| Kontor / kalender / mail | **Google Workspace** (Calendar, Gmail, Drive) |
| Auth | **Firebase Auth** (multi-tenant inloggning) |
| Kunskapsgraf | **Graphify** + **Obsidian** + **Cloud Console Graph View** (se sektion 11) |
| Projekt-ID | `cyber-guardian-32596` · region **`europe-north1`** |

**Telefoni-princip:** bygg en **abstrakt `telephony`-adapter** (samma interna API) med implementationer för Twilio, Vonage och Telnyx. Tenant väljer provider i sina inställningar. Inga provider-specifika antaganden i UI:t. Detta gör att du kan lägga på marginal per samtal/SMS senare.

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
- Migrera från localStorage → **Firestore** (synk mobil/web/flera enheter, realtid).
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
- **`tenantId`** på ALLA dataposter (Firestore Security Rules — isolera per tenant).
- **Modul-toggles:** admin kan slå PÅ/AV moduler per tenant (vissa kunder vill inte ha CHAT ARENA/Content Studio — dölj utan att riva kod). En `modules.json` per tenant.
- **Tema per tenant** (sektion 3) — logga, färg, namn, domän.
- **Roller:** **Super-Admin (Mike — ser allt över alla tenants)** / Ägare / Golvchef (övervakar live) / Agent-hanterare / Säljare. Olika vyer per roll.
- **Admin vs Kund:** NU bygger vi Super-Admin-portalen (allt synligt). Kund-portalen = samma kod, moduler dolda via `modules.json` + roll. Bygg så inget behöver rivas — bara döljas.
- **Onboarding-flöde:** ny tenant → välj tema → koppla Twilio-nummer → importera leads → skapa agenter → live.
- **Billing-hook:** per-seat eller per-minut/-meddelande (förbered abstrakt, aktivera senare — Google-native eller pluggbar provider. Ingen Stripe-låsning).

---

## 6. DATAMODELL (Firestore — minimum)
Collections: `tenants` · `users` (roll, tenantId) · `agents` (persona, llm, voice, kampanj) · `contacts` (lead-data) · `calls` (agent, kontakt, längd, inspelning-URL, transkript, resultat, sentiment, telephony-provider) · `pipeline_deals` (steg, värde, kontakt) · `campaigns` (ringlista, schema, agent) · `calendar_events` · `activities` (timeline). Allt med `tenantId` + Firestore Security Rules som isolerar per tenant.

---

## 7. ICKE-FUNKTIONELLA KRAV
- **Säkerhet:** Secret Manager för nycklar, Firestore Security Rules per tenant, inspelnings-samtycke, GDPR (all data i `europe-north1`), audit-logg.
- **Prestanda:** lazy-load moduler, WebSocket bara för live-vyn, paginering, Cloud Run scale-to-zero, max-instances-tak (kostnad).
- **Skalbarhet:** byggt för 100+ tenants × många agenter. Inget hårdkodat singel-tenant-antagande.
- **Observability:** Cloud Logging, fel-rapportering, kostnadstak per tenant.
- **Tillförlitlighet:** error handling i ALLA agent-flöden (aldrig tyst krasch), retry på samtal/jobb.

---

## 8. BYGG-ORDNING (faser — leverera verifierbart per steg)
1. **Fas A — Fundament:** multi-tenant + tema-system + Firestore-schema + auth + flytta CRM från localStorage.
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
- **Gemini Enterprise / Code Assist (Cloud Shell):** GCP-infra — Cloud Run-deploys, Secret Manager, telefoni-adapter (Twilio/Vonage/Telnyx), Vertex AI/Gemini Live, **Firestore**, Cloud Scheduler, Google Workspace. Äger backend + moln.
- **Claude Code (lokalt):** frontend `agent-os` (alla moduler/UI/design/tema), agent-os ↔ Cloud Run-koppling, white-label-system. Äger frontend + UX.
- **Regel mellan er:** `git pull` FÖRST före varje redigering. Dela katalog-filer (`SYSTEM_STATE.md`, `inventory.json`) ägs av frontend-sidan. Skriv aldrig över varandras filer — pulla, redigera, pusha.

---

## 11. KUNSKAPSSTRUKTUR — Graphify + Obsidian + Graph View (gäller HELA bygget)

Allt vi bygger ska struktureras så att både människor och agenter snabbt förstår systemet och sparar tokens.

**Regler för varje ny modul/fil:**
1. **Graphify:** kör/uppdatera knowledge graph (`graphify-out/`) efter varje större modul → noder + relationer för kod & moduler. Agenter navigerar grafen istället för att läsa hela filer.
2. **Obsidian:** varje modul får en not i vaulten (`Obsidian-Vaults/AI-Upscale-Brain/`) med `summary:` i frontmatter + `[[länkar]]` till relaterade moduler. Kör `scripts/add-summaries.js` så allt har summary (70–90 % token-besparing).
3. **`summary:`-fält obligatoriskt** på alla noter/registry-poster → agenter läser en rad, inte hela filen.

**Toggle Graph View (i appen + Cloud Console):**
- Lägg en **"Graph View"-toggle** i OS:et (knapp) som visar systemet som interaktiv graf — moduler, agenter, tenants, dataflöden — likt **Google Cloud Console Graph View**.
- Samma data ska kunna visas på **alla plattformar:** i appen (3D/2D-graf), i Obsidian (native graph), i Cloud Console (resurs-graf), i Graphify (`graph.html`).
- Toggle = användaren slår på/av graf-vyn över valfri vy (live-väggen, pipeline, agent-flöden) för maximal överblick.
- Återanvänd befintlig graf-grund (`brain-graph.html`, `graphify-out/graph.html`, planerad AIOS Constellation).

**Mål:** en konsekvent kunskapsgraf som speglas i app + Obsidian + Cloud Console + Graphify — så att vilken agent eller människa som helst ser hela systemet på sekunder.

---

*Skriven av Claude för Mike Luengo · AI Upscale Agency · 2026-06-30. Mål: white-label AI Call Center OS säljbart till call-centers. Telefoni: Twilio/Vonage/Telnyx (pluggbar) + Gemini + Google Workspace + Google Cloud. Databas: Firestore. INTE Agora/Retell/Supabase/Stripe/Hostinger. Bygg vidare på befintliga agent-os, riv inget, fråga vid oklarhet.*
