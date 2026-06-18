# HANDOFF → Gemini Infrastructure Manager (Google Cloud)

> **Avsändare:** Mikael Luengo (AI Upscale Agency)
> **Mål:** Ladda in HELA min arbetsmiljö (alla projekt, kontext, .md-filer, kunskapsgraf, registries) i Google Cloud så jag kan jobba mot den med mina GCP-verktyg (Vertex AI, Cloud Storage, Gemini).
> **Status:** Allt ligger redan samlat i ETT privat GitHub-repo med undermoduler. Du behöver bara klona + ingesta.

---

## 1. Vad du ska hämta

**Källa (single source of truth):**
```
https://github.com/aiupscaleagency-max/ai-upscale-work   (PRIVAT)
```

Repot innehåller:
- **15 projekt** som git-submoduler (ThyroidAI, Fluentic, ByggFlow, Infrea, AF-SIUS, CEO-with-ADHD, AIOS_Core m.fl.) — alla under kontot `aiupscaleagency-max`.
- **contexts/** — 9 återanvändbara kontext-moduler (.md)
- **agents/** — 6 agent-definitioner (.md)
- **REGISTRY.md / PROJECTS_REGISTRY.md / AGENTS_REGISTRY.md** — kartor över allt
- **graphify-out/** — kunskapsgraf (graph.json, GRAPH_REPORT.md, 231 filer)
- **brain-graph.html** + Obsidian-vault (submodul `ai-upscale-brain-vault`)
- Allt övrigt: content, leads, .md-dokumentation

> ⚠️ Secrets (`.env*`, nycklar) är medvetet **uteslutna** via `.gitignore` — de finns inte i repot och ska inte heller in i GCP-ingesten. Be Mikael om dem separat om någon tjänst kräver det.

---

## 2. Autentisering (Mikael fixar detta FÖRE du kör)

Repot + alla submoduler är **privata** under `aiupscaleagency-max`. Du behöver en **GitHub Personal Access Token (read-only)** med läsrättighet på kontots repos.

Mikael skapar en token här: GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained token**, scope: *Contents: Read-only* på alla `aiupscaleagency-max`-repos. Skickar dig den säkert (ej i klartext i delat dokument).

---

## 3. Klona ALLT (inkl. submoduler) — exakta kommandon

```bash
# Sätt token så att ÄVEN submodulerna autentiseras (de pekar på andra privata repos)
export GH_PAT="<MIKAELS_READONLY_TOKEN>"
git config --global url."https://${GH_PAT}@github.com/".insteadOf "https://github.com/"

# Klona umbrella + alla 15 submoduler i ett svep
git clone --recurse-submodules \
  https://github.com/aiupscaleagency-max/ai-upscale-work.git

cd ai-upscale-work
git submodule update --init --recursive   # säkerställer att allt hämtats
```

Resultat: hela trädet lokalt på din GCP-instans (Cloud Shell / Compute Engine VM).

---

## 4. Rekommenderad ingest i Google Cloud (välj efter Mikaels verktyg)

| Mål | Tjänst | Hur |
|---|---|---|
| **Rå lagring / backup** | Cloud Storage (GCS) | `gsutil -m rsync -r ./ai-upscale-work gs://<bucket>/ai-upscale-work` (exkludera `node_modules`, `.git`, `.next`) |
| **Sökbar kunskap (RAG)** | Vertex AI Search / RAG Engine | Indexera alla `.md` + `graphify-out/` som datakälla → Gemini kan svara mot hela företaget |
| **Agent-kontext** | Gemini (Vertex) | Mata in `REGISTRY.md` + `contexts/` som system-/grounding-kontext |

**Föreslagen exkludering vid sync** (spar plats, undvik skräp):
```
--exclude '.*\.git.*' --exclude '.*node_modules.*' --exclude '.*\.next.*' --exclude '.*\.tar\.gz$'
```

---

## 5. Uppdatering framåt (håll GCP i synk)
Repot uppdateras löpande. För att hämta senaste:
```bash
cd ai-upscale-work && git pull --recurse-submodules && git submodule update --remote
# kör sedan gsutil rsync / re-indexera Vertex på nytt
```
(Kan schemaläggas med Cloud Scheduler + en liten Cloud Run-job om Mikael vill auto-synk.)

---

## 6. ANDRA BUNTEN — Claude-config + alla skills (separat tarball)

Allt i `~/.claude` (global CLAUDE.md, alla 81 skills, agents, 35 memory-filer) är paketerat som en tarball — **utan secrets, node_modules eller darwin-binärer** (de funkar ändå inte på GCP Linux och är återinstallerbara).

**Bunt:** `claude-config-bundle.tar.gz` (~240 MB, 15 600 filer)

**Steg (Mikael laddar upp, agenten extraherar):**
```bash
# 1) Mikael laddar upp till GCS (engång)
gsutil cp ~/claude-config-bundle.tar.gz gs://<bucket>/

# 2) Agenten hämtar + packar upp på sin GCP-instans
gsutil cp gs://<bucket>/claude-config-bundle.tar.gz .
mkdir -p claude-config && tar -xzf claude-config-bundle.tar.gz -C claude-config
```

Innehåll: `claude-config/CLAUDE.md`, `claude-config/skills/*`, `claude-config/agents/*`, `claude-config/projects/.../memory/*`.

> ⚠️ Många skills (gstack, ruflo) är tredjeparts-verktyg — bra som referens/kontext, men för att FAKTISKT köra dem på GCP måste de återinstalleras på Linux (binärerna i bunten är borttagna med flit). Mikaels EGNA skills (graphify, content-humanizer, llm-council, mike-*, aiupscale-*) är ren källa och funkar som kontext direkt.
