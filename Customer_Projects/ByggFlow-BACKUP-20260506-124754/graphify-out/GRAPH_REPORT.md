# Graph Report - ByggFlow-BACKUP-20260506-124754  (2026-05-20)

## Corpus Check
- 45 files · ~34,372 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 220 nodes · 421 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]

## God Nodes (most connected - your core abstractions)
1. `useToast()` - 31 edges
2. `🚀 ByggFlow — Lanseringspaket` - 10 edges
3. `projects` - 8 edges
4. `invoices` - 8 edges
5. `🎬 DEMO-VIDEOSKRIPT (3 min — kör i denna ordning)` - 7 edges
6. `branschConfig` - 6 edges
7. `useSpeechRecognition()` - 6 edges
8. `ProjektDetaljModal()` - 6 edges
9. `materials` - 6 edges
10. `dagboksinlagg` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AdminPanel()` --calls--> `useToast()`  [EXTRACTED]
  src/views/AdminPanel.jsx → src/components/Toast.jsx
- `ProjektKort()` --calls--> `useToast()`  [EXTRACTED]
  src/views/KommunPortal.jsx → src/components/Toast.jsx
- `RapporterVy()` --calls--> `useToast()`  [EXTRACTED]
  src/components/SubVyer.jsx → src/components/Toast.jsx
- `FakturorVy()` --calls--> `useToast()`  [EXTRACTED]
  src/components/SubVyer.jsx → src/components/Toast.jsx
- `MaterialVy()` --calls--> `useToast()`  [EXTRACTED]
  src/components/SubVyer.jsx → src/components/Toast.jsx

## Communities (14 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (18): Chatbot(), SNABB_FRÅGOR, useSpeechRecognition(), AnbudVy(), FakturaGranskningVy(), LeverantorsbetygVy(), vyer, DagsrapportFormulär() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): menyAdmin, menyKommun, AnstalldaVy(), DagbokVy(), FakturorVy(), MaterialVy(), ProjektVy(), RapporterVy() (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (13): ProjektDetaljModal(), fmt(), ProjektLivePanel(), ataFörProjekt(), ataPoster, ataStatusLabels, ataSumma(), ataTyper (+5 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): Admin-panel (hantverksfirma), Akt 1 — Hantverkar-vy mobil (30 sek), Akt 2 — Admin Dashboard (40 sek), Akt 3 — Koncernstruktur (20 sek), Akt 4 — Kommunportalen (50 sek) **← VIKTIGAST**, Alternativ A: demo.aiupscale.agency (rekommenderas), Alternativ B: aiupscale.agency (root), ✅ APP STATUS: KLAR FÖR DEMO (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (11): branschConfig, Directions(), depotIcon, fallback(), formatDistance(), formatDuration(), formatETA(), getDirections() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (7): config, invoices, beräknaTotal(), enheter, FakturaDetalj(), NyFakturaForm(), PdfModal()

### Community 6 - "Community 6"
Cohesion: 0.21
Nodes (7): CertifikatVy(), fmtMkr(), KoncernVy(), LonsamhetVy(), certifikat, certifikatStatus(), koncernstruktur

### Community 7 - "Community 7"
Cohesion: 0.23
Nodes (7): fmtKr(), fmtMkr(), LivePanel(), ataTotalt(), anstallda, beställare, companies

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **38 isolated node(s):** `config`, `ToastContext`, `depotIcon`, `SNABB_FRÅGOR`, `menyAdmin` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useToast()` connect `Community 0` to `Community 1`, `Community 2`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `invoices` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `config`, `ToastContext`, `depotIcon` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._