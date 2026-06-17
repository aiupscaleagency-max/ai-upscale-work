#!/usr/bin/env python3
"""
AI Upscale Brain — Memory Galaxy v4
Komplett arkitektur: hub → kluster → projekt → memory/agents/skills.
Kors-kopplingar baserade på delad tech, agents och kundtyp.
"""

import os, re, json
from pathlib import Path

VAULT     = Path.home() / "ai_upscale_work/Obsidian-Vaults/AI-Upscale-Brain"
OUTPUT    = Path.home() / "ai_upscale_work/brain-graph.html"
TMP       = Path.home() / "ai_upscale_work/.brain-graph.tmp"
SKIP_DIRS = {"99-graphify-dump", ".obsidian", ".trash"}

# ─── PROJEKTMETADATA ──────────────────────────────────────────────────────────
# Källa till sanning för alla projekt, kunder och interna verktyg.
# links_to = explicita kross-kopplingar (gemensamma nämnare).
PROJECT_META = {
    "thyroidai": {
        "name": "ThyroidAI",
        "type": "B2C",
        "segment": "hälsa",
        "status": "LIVE",
        "tech": ["next.js", "supabase", "stripe", "docker", "gemini", "capacitor"],
        "agents": ["ai-doktor", "voice-agent", "gemini-live"],
        "goal": "150 MSEK/år · 21 regioner",
        "links_to": ["fluentic-ai", "ceo-with-adhd"],  # B2C + voice/AI
    },
    "ceo-with-adhd": {
        "name": "CEO with ADHD",
        "type": "B2C",
        "segment": "utbildning",
        "status": "Klar — saknar video",
        "tech": ["next.js", "supabase", "stripe", "video-content", "capacitor"],
        "agents": ["content-agent", "coaching-bot"],
        "goal": "100 MSEK/år",
        "links_to": ["thyroidai", "fluentic-ai"],
    },
    "fluentic-ai": {
        "name": "Fluentic AI",
        "type": "B2C",
        "segment": "språk",
        "status": "Igång",
        "tech": ["next.js", "supabase", "stripe", "gemini", "voice-agent", "capacitor"],
        "agents": ["voice-agent", "ai-tutor", "gemini-live"],
        "goal": "Mikes eget projekt",
        "links_to": ["thyroidai", "ceo-with-adhd"],
    },
    "byggflow": {
        "name": "ByggFlow",
        "type": "B2B",
        "segment": "hantverkare",
        "status": "I princip klar",
        "tech": ["next.js", "supabase", "stripe", "aios", "openclaw"],
        "agents": ["aios-agent", "cold-calling", "aiupscale-sales"],
        "goal": "69 900 kr + prenumeration",
        "links_to": ["infrea-insight", "aios-core", "af-sius"],
    },
    "infrea-insight": {
        "name": "Infrea-Insight",
        "type": "B2B",
        "segment": "hantverkare/kommuner",
        "status": "I princip klar",
        "tech": ["next.js", "supabase", "stripe", "aios", "openclaw"],
        "agents": ["aios-agent", "cold-calling", "aiupscale-sales"],
        "goal": "69 900 kr+ prenumeration",
        "links_to": ["byggflow", "aios-core", "af-sius"],
    },
    "af-sius": {
        "name": "AF-SIUS",
        "type": "B2B",
        "segment": "rekrytering",
        "status": "Snart klar",
        "tech": ["next.js", "supabase", "aios", "openclaw"],
        "agents": ["ai-recruiter", "cold-calling", "aiupscale-recruiter"],
        "goal": "150 000 kr + prenumeration",
        "links_to": ["byggflow", "infrea-insight", "aios-core"],
    },
    "ze-parts": {
        "name": "Ze-Parts",
        "type": "B2B",
        "segment": "e-handel",
        "status": "Snart klar",
        "tech": ["next.js", "supabase", "aios", "stripe"],
        "agents": ["aios-agent", "aiupscale-sales"],
        "goal": "Potentiell kund",
        "links_to": ["aios-core", "byggflow"],
    },
    "aios-core": {
        "name": "AIOS Core",
        "type": "Platform",
        "segment": "AIOS-plattform",
        "status": "Pågår",
        "tech": ["next.js", "supabase", "stripe", "openclaw", "aios", "docker"],
        "agents": ["aios-agent", "openclaw", "ruflo"],
        "goal": "Underliggande plattform för alla B2B",
        "links_to": ["byggflow", "infrea-insight", "af-sius", "ze-parts", "aiupscale-monitor"],
    },
    "aios-core-landing": {
        "name": "AIOS Landing",
        "type": "Marketing",
        "segment": "landningssida",
        "status": "Live?",
        "tech": ["next.js", "vercel"],
        "agents": [],
        "goal": "Lead gen för AIOS",
        "links_to": ["aios-core"],
    },
    "aiupscale-monitor": {
        "name": "Monitor",
        "type": "Internal",
        "segment": "monitoring",
        "status": "Intern",
        "tech": ["next.js", "supabase", "aios"],
        "agents": ["aios-agent"],
        "goal": "Intern systemövervakning",
        "links_to": ["aios-core"],
    },
    "graphify-mall-ai-os": {
        "name": "Graphify Mall",
        "type": "Internal",
        "segment": "visualisering",
        "status": "Intern",
        "tech": ["python", "d3.js"],
        "agents": ["graphify"],
        "goal": "Mall för AI OS-visualisering",
        "links_to": [],
    },
    "mikael-trading-os": {
        "name": "Trading OS",
        "type": "Pausad",
        "segment": "trading",
        "status": "PAUSAD",
        "tech": ["python"],
        "agents": [],
        "goal": "Pausad — använder en killes system",
        "links_to": [],
    },
    "caso-chile-dashboard": {
        "name": "Caso Chile",
        "type": "Internal",
        "segment": "dashboard",
        "status": "Intern",
        "tech": ["next.js", "supabase"],
        "agents": [],
        "goal": "Intern dashboard",
        "links_to": [],
    },
}

# Kunder/leads som finns i memory men INTE i 04-projects
# Läggs till som virtuella noder (category=customer)
CUSTOMER_NODES = {
    "__arbetsmiljocenter": {
        "id": "__arbetsmiljocenter",
        "title": "Arbetsmiljöcenter",
        "category": "customer",
        "type": "Kund (bekräftad)",
        "segment": "cold-calling",
        "status": "DEAL BEKRÄFTAD",
        "goal": "Cold Calling Agents (Spår 1: Retell, Spår 2: Agora+Gemini)",
        "links_to_slugs": ["aios-core", "af-sius"],
    },
    "__cluee": {
        "id": "__cluee",
        "title": "Cluee (247K YT)",
        "category": "customer",
        "type": "Potentiell kund",
        "segment": "video/nyheter",
        "status": "Pitch pågår",
        "goal": "AI nyhetsvideos 20–40 min + shorts",
        "links_to_slugs": ["aios-core"],
    },
}

# ─── Kategori-tinter ──────────────────────────────────────────────────────────
CATEGORY_TINT = {
    "hub":      (255, 240, 150),  # guld
    "b2c":      (100, 255, 180),  # grön-cyan
    "b2b":      (120, 180, 255),  # blå
    "platform": (200, 150, 255),  # lila
    "customer": (255, 160,  80),  # orange
    "internal": (160, 160, 180),  # grå-blå
    "paused":   ( 80,  80,  90),  # mörk grå
    "strategy": (180, 210, 255),
    "agent":    (255, 200, 120),
    "memory":   (200, 160, 255),
    "feedback": (120, 220, 255),
    "default":  (170, 170, 190),
}

TYPE_CATEGORY = {
    "B2C": "b2c", "B2B": "b2b", "Platform": "platform",
    "Marketing": "b2b", "Internal": "internal", "Pausad": "paused",
    "Kund (bekräftad)": "customer", "Potentiell kund": "customer",
}

# ─── HJÄLPFUNKTIONER ─────────────────────────────────────────────────────────
GENERIC_TITLES = {
    "react + vite", "getting started", "next.js", "readme",
    "untitled", "create next app", "vite", "index"
}

def read(fp):
    try: return fp.read_text(encoding="utf-8")
    except: return ""

def extract_fm_name(content):
    m = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m: return ""
    nm = re.search(r'^name:\s*(.+)', m.group(1), re.MULTILINE)
    return nm.group(1).strip() if nm else ""

def extract_tags(content):
    m = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m: return []
    tm = re.search(r'tags:\s*\[([^\]]+)\]', m.group(1))
    return [t.strip() for t in tm.group(1).split(",")] if tm else []

def smart_title(content, fp):
    fm = extract_fm_name(content)
    if fm: return fm
    m = re.search(r'^#\s+(.+)', content, re.MULTILINE)
    if m and m.group(1).strip().lower() not in GENERIC_TITLES:
        return m.group(1).strip()
    if "04-projects" in fp.parts:
        idx = list(fp.parts).index("04-projects")
        if idx + 1 < len(fp.parts):
            slug = fp.parts[idx + 1]
            meta = PROJECT_META.get(slug)
            name = meta["name"] if meta else slug.replace("-", " ").title()
            return name + (" — CLAUDE" if fp.name == "CLAUDE.md" else "")
    parent = fp.parent.name
    if parent not in (".", "AI-Upscale-Brain"):
        nice = parent.replace("-", " ").replace("_", " ").title()
        return nice + (" — CLAUDE" if fp.stem.upper() == "CLAUDE" else "")
    return fp.stem.replace("-", " ").replace("_", " ").title()

def get_category(fp, tags, slug=None):
    if "hub" in tags or "index" in tags or fp.name == "00-INDEX.md":
        return "hub"
    if "04-projects" in fp.parts and slug:
        meta = PROJECT_META.get(slug, {})
        t = meta.get("type", "")
        return TYPE_CATEGORY.get(t, "project")
    if "01-strategy" in fp.parts: return "strategy"
    if "03-agents"   in fp.parts: return "agent"
    if "08-memory"   in fp.parts:
        return "feedback" if fp.stem.startswith("feedback_") else "memory"
    return "default"

def extract_wikilinks(content):
    return [r.strip() for r in re.findall(r'\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]', content) if r.strip()]

def resolve_link(link, all_files):
    ll = link.lower()
    for fid, fp in all_files.items():
        rel = str(fp.relative_to(VAULT)).replace(os.sep, "/")
        if ll in (rel.rsplit(".", 1)[0].lower(), fp.stem.lower(), rel.lower()):
            return fid
    for fid, fp in all_files.items():
        if fp.stem.lower() == ll.split("/")[-1]:
            return fid
    return None

def project_readme_id(slug, all_files):
    for fid, fp in all_files.items():
        if "04-projects" in fp.parts:
            idx = list(fp.parts).index("04-projects")
            if idx + 1 < len(fp.parts) and fp.parts[idx + 1] == slug and fp.name == "README.md":
                return fid
    return None

def project_slug_from_path(fp):
    if "04-projects" not in fp.parts: return None
    idx = list(fp.parts).index("04-projects")
    return fp.parts[idx + 1] if idx + 1 < len(fp.parts) else None

def memory_slug(stem):
    # project_thyroidai.md → "thyroidai"
    for slug in PROJECT_META:
        if slug.replace("-", "_") in stem:
            return slug
    return ""

# ─── SCANNA VAULT ─────────────────────────────────────────────────────────────
def scan_vault():
    all_files = {}
    for md in VAULT.rglob("*.md"):
        if any(s in md.parts for s in SKIP_DIRS):
            continue
        all_files[str(md.relative_to(VAULT))] = md

    # Recency-normalisering
    mtimes = {}
    for fid, fp in all_files.items():
        try: mtimes[fid] = fp.stat().st_mtime
        except: mtimes[fid] = 0
    tmin = min(mtimes.values()) if mtimes else 0
    tmax = max(mtimes.values()) if mtimes else 1
    trange = max(tmax - tmin, 1)

    # ── Bygg noder ──────────────────────────────────────────────────────────
    nodes = {}
    for fid, fp in all_files.items():
        content = read(fp)
        tags    = extract_tags(content)
        slug    = project_slug_from_path(fp)
        title   = smart_title(content, fp)
        cat     = get_category(fp, tags, slug)
        links   = extract_wikilinks(content)
        recency = (mtimes[fid] - tmin) / trange
        r, g, b = CATEGORY_TINT.get(cat, (170, 170, 190))
        meta    = PROJECT_META.get(slug, {}) if slug else {}
        nodes[fid] = {
            "id": fid, "title": title, "category": cat,
            "r": r, "g": g, "b": b,
            "recency": round(recency, 3),
            "words": len(content.split()),
            "links_raw": links,
            "path": str(fp.relative_to(VAULT)),
            "slug": slug or "",
            "meta_type":    meta.get("type", ""),
            "meta_status":  meta.get("status", ""),
            "meta_goal":    meta.get("goal", ""),
            "meta_segment": meta.get("segment", ""),
            "meta_tech":    ", ".join(meta.get("tech", [])),
            "meta_agents":  ", ".join(meta.get("agents", [])),
        }

    # ── Lägg till virtuella kundnoder ────────────────────────────────────────
    now_ts = max(mtimes.values()) if mtimes else 0
    for cid, cmeta in CUSTOMER_NODES.items():
        r, g, b = CATEGORY_TINT["customer"]
        nodes[cid] = {
            "id": cid, "title": cmeta["title"], "category": "customer",
            "r": r, "g": g, "b": b,
            "recency": 0.85,  # kunder visas ljust — aktuella
            "words": 0, "links_raw": [],
            "path": "(virtuell kundnod)",
            "slug": cid,
            "meta_type":    cmeta.get("type", ""),
            "meta_status":  cmeta.get("status", ""),
            "meta_goal":    cmeta.get("goal", ""),
            "meta_segment": cmeta.get("segment", ""),
            "meta_tech": "", "meta_agents": "",
        }

    # ── Bygg kanter ──────────────────────────────────────────────────────────
    edges, seen = [], set()

    def add_edge(src, tgt, etype="default"):
        if not src or not tgt or src == tgt: return
        key = tuple(sorted([src, tgt]))
        if key not in seen:
            seen.add(key)
            edges.append({"source": src, "target": tgt, "etype": etype})

    # 1. Wiki-länkarna i filerna
    for fid, node in nodes.items():
        for raw in node.get("links_raw", []):
            tid = resolve_link(raw, all_files)
            if tid: add_edge(fid, tid, "wiki")

    # 2. Memory → Projekt-koppling via filnamn
    for fid, fp in all_files.items():
        if "08-memory" not in fp.parts: continue
        slug = memory_slug(fp.stem)
        if not slug: continue
        pfid = project_readme_id(slug, all_files)
        if pfid: add_edge(fid, pfid, "memory")

    # 3. Hub → alla projekt-README
    hub_ids  = [fid for fid, n in nodes.items() if n["category"] == "hub"]
    proj_ids = [project_readme_id(sl, all_files) for sl in PROJECT_META]
    proj_ids = [p for p in proj_ids if p]
    cust_ids = list(CUSTOMER_NODES.keys())
    for hid in hub_ids:
        for pid in proj_ids + cust_ids:
            add_edge(hid, pid, "hub")

    # 4. Kors-kopplingar projekt ↔ projekt (från links_to)
    for slug, meta in PROJECT_META.items():
        src = project_readme_id(slug, all_files)
        if not src: continue
        for target_slug in meta.get("links_to", []):
            tgt = project_readme_id(target_slug, all_files)
            if tgt: add_edge(src, tgt, "cross")

    # 5. Kundnoder → relaterade projekt
    for cid, cmeta in CUSTOMER_NODES.items():
        for target_slug in cmeta.get("links_to_slugs", []):
            tgt = project_readme_id(target_slug, all_files)
            if tgt: add_edge(cid, tgt, "cross")

    # ── Degree per nod ───────────────────────────────────────────────────────
    degree = {}
    for e in edges:
        degree[e["source"]] = degree.get(e["source"], 0) + 1
        degree[e["target"]] = degree.get(e["target"], 0) + 1
    for n in nodes.values():
        n["degree"] = degree.get(n["id"], 0)
        n.pop("links_raw", None)

    return list(nodes.values()), edges


# ─── BYGG HTML ───────────────────────────────────────────────────────────────
def build_html(nodes, edges):
    data = json.dumps({"nodes": nodes, "links": edges}, ensure_ascii=False)
    nn, ne = len(nodes), len(edges)

    return f"""<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>AI Upscale Brain — Memory Galaxy</title>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ background:#020208; color:#e2e8f0;
       font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
       overflow:hidden; height:100vh; }}
#canvas {{ width:100vw; height:100vh; }}

#hud {{ position:fixed; top:16px; left:16px; z-index:10;
        display:flex; flex-direction:column; gap:6px; pointer-events:none; }}
#brand {{ font-size:10px; color:#3a3a5a; letter-spacing:2px; text-transform:uppercase; }}
#galaxy-title {{ font-size:22px; font-weight:700; color:#fff;
                 text-shadow:0 0 30px rgba(200,180,255,.5); }}
#galaxy-sub {{ font-size:10px; color:#3a3a5a; margin-top:1px; }}
#counter {{ font-size:10px; color:#555570; margin-top:2px; }}
#search {{
  pointer-events:all;
  background:rgba(10,10,25,.85); border:1px solid #1a1a3a;
  border-radius:6px; color:#e2e8f0; padding:5px 10px;
  font-size:11px; width:200px; outline:none; margin-top:4px;
}}
#search:focus {{ border-color:rgba(180,160,255,.5); }}

#legend {{ margin-top:6px; display:flex; flex-direction:column; gap:3px; }}
.leg {{ font-size:9px; color:#4a5568; display:flex; align-items:center; gap:5px; }}
.leg-dot {{ width:6px; height:6px; border-radius:50%; flex-shrink:0; }}
.leg-line {{ width:18px; height:2px; flex-shrink:0; border-radius:1px; }}
.leg-sep {{ margin-top:3px; border-top:1px solid #0d0d20; padding-top:3px; }}

/* Filter-knappar */
#filters {{ pointer-events:all; display:flex; gap:4px; flex-wrap:wrap; margin-top:6px; }}
.fbtn {{
  font-size:9px; padding:3px 7px; border-radius:10px; cursor:pointer;
  border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03);
  color:#6b7280; transition:all .15s;
}}
.fbtn:hover {{ color:#e2e8f0; border-color:rgba(255,255,255,.2); }}
.fbtn.active {{ color:#fff; border-color:currentColor; }}

/* Panel */
#panel {{
  position:fixed; right:0; top:0; bottom:0; width:280px;
  background:rgba(4,4,14,.96); border-left:1px solid #0c0c22;
  padding:20px 16px; transform:translateX(100%);
  transition:transform .2s ease; z-index:20; overflow-y:auto;
}}
#panel.open {{ transform:translateX(0); }}
#panel-badge {{
  display:inline-block; font-size:9px; padding:2px 8px; border-radius:10px;
  margin-bottom:8px; font-weight:600; letter-spacing:.5px; text-transform:uppercase;
}}
#panel-title {{ font-size:16px; font-weight:700; margin-bottom:2px; }}
#panel-status {{ font-size:10px; color:#6b7280; margin-bottom:8px; }}
#panel-goal {{ font-size:11px; margin-bottom:10px; }}
.pmeta {{ font-size:10px; color:#6b7280; margin-bottom:4px; }}
.pmeta strong {{ color:#9ca3af; }}
#panel-divider {{ border:none; border-top:1px solid #0f0f22; margin:10px 0; }}
#panel-links h3 {{
  font-size:9px; color:#374151; text-transform:uppercase;
  letter-spacing:1px; margin-bottom:5px;
}}
.plink {{
  font-size:10px; color:#6b7280; padding:3px 0 3px 8px;
  cursor:pointer; border-left:1px solid transparent;
  transition:color .1s;
}}
.plink:hover {{ color:#e2e8f0; }}
#close-btn {{
  position:absolute; top:10px; right:10px;
  background:none; border:none; color:#374151; font-size:16px; cursor:pointer;
}}
#close-btn:hover {{ color:#e2e8f0; }}

/* Live */
#live {{ position:fixed; bottom:14px; right:14px; font-size:9px;
         color:#374151; display:flex; align-items:center; gap:4px; }}
#live-dot {{ width:5px; height:5px; border-radius:50%; background:#10b981;
              animation:blink 2s ease-in-out infinite; }}
@keyframes blink {{ 0%,100% {{ opacity:.3; }} 50% {{ opacity:1; }} }}
</style>
</head>
<body>
<svg id="canvas">
  <defs>
    <filter id="glow-sm"><feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-md"><feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-lg"><feGaussianBlur stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
</svg>

<div id="hud">
  <div id="brand">LOCAL · STUDIO</div>
  <div>
    <div id="galaxy-title">AI Upscale Brain</div>
    <div id="galaxy-sub">Memory Galaxy · Arkitekturöversikt</div>
  </div>
  <div id="counter">{nn} noder · {ne} kopplingar</div>
  <input id="search" type="text" placeholder="Sök nod…" autocomplete="off"/>
  <div id="filters">
    <button class="fbtn active" data-cat="all">Alla</button>
    <button class="fbtn" data-cat="b2c" style="color:rgb(100,255,180)">B2C</button>
    <button class="fbtn" data-cat="b2b" style="color:rgb(120,180,255)">B2B</button>
    <button class="fbtn" data-cat="platform" style="color:rgb(200,150,255)">Platform</button>
    <button class="fbtn" data-cat="customer" style="color:rgb(255,160,80)">Kunder</button>
    <button class="fbtn" data-cat="memory">Memory</button>
    <button class="fbtn" data-cat="agent">Agents</button>
  </div>
  <div id="legend">
    <div class="leg leg-sep">
      <span class="leg-dot" style="background:rgb(255,240,150)"></span>Hub — AI Upscale Brain
    </div>
    <div class="leg">
      <span class="leg-dot" style="background:rgb(100,255,180)"></span>B2C projekt
    </div>
    <div class="leg">
      <span class="leg-dot" style="background:rgb(120,180,255)"></span>B2B / AIOS
    </div>
    <div class="leg">
      <span class="leg-dot" style="background:rgb(200,150,255)"></span>Platform (AIOS Core)
    </div>
    <div class="leg">
      <span class="leg-dot" style="background:rgb(255,160,80)"></span>Kunder & leads
    </div>
    <div class="leg">
      <span class="leg-dot" style="background:rgb(200,160,255)"></span>Memory / kontext
    </div>
    <div class="leg">
      <span class="leg-dot" style="background:rgb(255,200,120)"></span>Agents / skills
    </div>
    <div class="leg leg-sep">
      <span class="leg-line" style="background:rgba(255,240,100,.5)"></span>Hub → projekt
    </div>
    <div class="leg">
      <span class="leg-line" style="background:rgba(255,150,50,.6)"></span>Korskopp. (delad tech/agent)
    </div>
    <div class="leg">
      <span class="leg-line" style="background:rgba(180,100,255,.4)"></span>Memory → projekt
    </div>
    <div class="leg" style="margin-top:3px;color:#2d2d40">⬤ ljusare = senast rörd</div>
  </div>
</div>

<div id="panel">
  <button id="close-btn" onclick="closePanel()">✕</button>
  <div id="panel-badge"></div>
  <div id="panel-title"></div>
  <div id="panel-status"></div>
  <div id="panel-goal"></div>
  <div id="panel-meta"></div>
  <hr id="panel-divider"/>
  <div id="panel-links"></div>
</div>

<div id="live"><div id="live-dot"></div><span id="live-text">Live</span></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const DATA = {data};
const W = () => window.innerWidth, H = () => window.innerHeight;

// Adjacency map
const adj = {{}};
DATA.links.forEach(l => {{
  const s = l.source.id||l.source, t = l.target.id||l.target;
  (adj[s]||(adj[s]=[])).push(t);
  (adj[t]||(adj[t]=[])).push(s);
}});

function starRadius(d) {{
  const hub = d.category === "hub" ? 8 : 0;
  const proj = ["b2c","b2b","platform","customer"].includes(d.category) ? 4 : 2;
  return hub || proj + d.degree * 0.5 + d.recency * 3.5;
}}

function starColor(d, alpha) {{
  const br = 0.28 + d.recency * 0.72;
  const r = Math.round(d.r * br), g = Math.round(d.g * br), b = Math.round(d.b * br);
  return alpha !== undefined ? `rgba(${{r}},${{g}},${{b}},${{alpha}})` : `rgb(${{r}},${{g}},${{b}})`;
}}

function glowFilter(d) {{
  if (d.category === "hub") return "url(#glow-lg)";
  if (["b2c","b2b","platform","customer"].includes(d.category)) return "url(#glow-md)";
  if (d.recency > 0.7 || d.degree > 3) return "url(#glow-md)";
  return "url(#glow-sm)";
}}

function edgeColor(l) {{
  switch(l.etype) {{
    case "hub":    return "rgba(255,240,100,.18)";
    case "cross":  return "rgba(255,150,50,.35)";
    case "memory": return "rgba(180,100,255,.3)";
    default:       return "rgba(255,255,255,.06)";
  }}
}}
function edgeWidth(l) {{
  return l.etype === "cross" ? 1.2 : l.etype === "hub" ? 0.8 : 0.5;
}}

const svg = d3.select("#canvas");
const g   = svg.append("g");
svg.call(d3.zoom().scaleExtent([0.04,8]).on("zoom", e => g.attr("transform", e.transform)));

// Initial positionering — projekt nära mitten, memory yttre ring
DATA.nodes.forEach(n => {{
  const isproj = ["b2c","b2b","platform","customer"].includes(n.category);
  const r = n.category==="hub" ? 0 :
            isproj ? 150 + Math.random()*120 :
            280 + Math.random()*220;
  const a = Math.random()*2*Math.PI;
  n.x = W()/2 + Math.cos(a)*r;
  n.y = H()/2 + Math.sin(a)*r;
}});

const sim = d3.forceSimulation(DATA.nodes)
  .force("link", d3.forceLink(DATA.links).id(d=>d.id)
    .distance(l => {{
      const sc = l.source.category||"", tc = l.target.category||"";
      if (sc==="hub"||tc==="hub") return 200;
      if (l.etype==="cross") return 140;
      return 90;
    }}).strength(l => l.etype==="cross" ? 0.4 : 0.25))
  .force("charge", d3.forceManyBody()
    .strength(d => d.category==="hub" ? -800 :
              ["b2c","b2b","platform","customer"].includes(d.category) ? -350 : -200)
    .distanceMax(500))
  .force("center", d3.forceCenter(W()/2, H()/2).strength(0.03))
  .force("collide", d3.forceCollide(d => starRadius(d)+8))
  .alphaDecay(0.012);

const link = g.append("g").selectAll("line")
  .data(DATA.links).join("line")
  .attr("stroke", edgeColor)
  .attr("stroke-width", edgeWidth);

const node = g.append("g").selectAll(".star")
  .data(DATA.nodes).join("g").attr("class","star")
  .call(d3.drag()
    .on("start",(e,d)=>{{ if(!e.active) sim.alphaTarget(.3).restart(); d.fx=d.x; d.fy=d.y; }})
    .on("drag", (e,d)=>{{ d.fx=e.x; d.fy=e.y; }})
    .on("end",  (e,d)=>{{ if(!e.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }}))
  .on("click",(e,d)=>{{ e.stopPropagation(); selectStar(d); }});

node.append("circle")
  .attr("r", starRadius)
  .attr("fill", d => starColor(d))
  .attr("filter", glowFilter)
  .style("cursor","pointer");

// Alltid label för hub + projekt-kluster; annars bara vid high recency/degree
node.append("text")
  .attr("dy", d => starRadius(d)+11)
  .attr("text-anchor","middle")
  .attr("fill", d => starColor(d, d.category==="hub"?1:0.85))
  .attr("font-size", d => {{
    if (d.category==="hub") return "12px";
    if (["b2c","b2b","platform","customer"].includes(d.category)) return "10px";
    return "8px";
  }})
  .attr("font-weight", d => ["hub","b2c","b2b","platform","customer"].includes(d.category) ? "600" : "400")
  .style("pointer-events","none")
  .style("text-shadow","0 0 8px #000,0 0 4px #000")
  .text(d => {{
    const show = d.category==="hub"
      || ["b2c","b2b","platform","customer"].includes(d.category)
      || d.degree>=4 || d.recency>0.8;
    if (!show) return "";
    return d.title.length>24 ? d.title.slice(0,22)+"…" : d.title;
  }});

sim.on("tick", ()=>{{
  link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
      .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
  node.attr("transform",d=>`translate(${{d.x}},${{d.y}})`);
}});

// ── Interaktion ───────────────────────────────────────────────────────────────
let orbitRing = null;

const BADGE_COLORS = {{
  "hub":"rgba(255,240,100,.15)", "b2c":"rgba(100,255,180,.15)",
  "b2b":"rgba(120,180,255,.15)", "platform":"rgba(200,150,255,.15)",
  "customer":"rgba(255,160,80,.15)", "internal":"rgba(160,160,180,.12)",
  "paused":"rgba(80,80,90,.15)", "memory":"rgba(200,160,255,.15)",
  "agent":"rgba(255,200,120,.15)", "feedback":"rgba(120,220,255,.15)",
}};

function selectStar(d) {{
  const hl = new Set([d.id, ...(adj[d.id]||[])]);
  if (orbitRing) orbitRing.remove();
  orbitRing = g.append("circle")
    .attr("cx",d.x).attr("cy",d.y).attr("r",starRadius(d)+20)
    .attr("fill","none").attr("stroke",starColor(d,.35))
    .attr("stroke-width",1).attr("stroke-dasharray","4 3");

  link
    .attr("stroke", l=>{{
      const s=l.source.id||l.source, t=l.target.id||l.target;
      return (hl.has(s)&&hl.has(t)) ? edgeColor(l).replace(/[\d.]+\)$/,"0.7)") : "rgba(255,255,255,.02)";
    }})
    .attr("stroke-width", l=>{{
      const s=l.source.id||l.source, t=l.target.id||l.target;
      return (hl.has(s)&&hl.has(t)) ? edgeWidth(l)*2 : 0.4;
    }});
  node.select("circle").attr("opacity", n=>hl.has(n.id)?1:0.1);
  node.select("text").attr("opacity", n=>hl.has(n.id)?1:0.04);

  // Panel
  document.getElementById("panel").classList.add("open");
  const col = starColor(d);

  const badge = document.getElementById("panel-badge");
  badge.textContent = d.meta_type || d.category;
  badge.style.background = BADGE_COLORS[d.category]||"rgba(255,255,255,.08)";
  badge.style.color = col;
  badge.style.border = `1px solid ${{col.replace("rgb","rgba").replace(")",",0.3)")}}`||"";

  document.getElementById("panel-title").textContent = d.title;
  document.getElementById("panel-title").style.color = col;
  document.getElementById("panel-status").textContent = d.meta_status || "";
  document.getElementById("panel-goal").innerHTML =
    d.meta_goal ? `<span style="color:${{col}}">◎</span> ${{d.meta_goal}}` : "";

  let meta = "";
  if (d.meta_segment) meta += `<div class="pmeta"><strong>Segment:</strong> ${{d.meta_segment}}</div>`;
  if (d.meta_tech)    meta += `<div class="pmeta"><strong>Tech:</strong> ${{d.meta_tech}}</div>`;
  if (d.meta_agents)  meta += `<div class="pmeta"><strong>Agents:</strong> ${{d.meta_agents}}</div>`;
  const pct = Math.round(d.recency*100);
  meta += `<div class="pmeta"><strong>Aktualitet:</strong> ${{pct}}% · ${{d.degree}} kopplingar</div>`;
  if (d.path !== "(virtuell kundnod)") meta += `<div class="pmeta" style="color:#1e1e35;font-size:8px">${{d.path}}</div>`;
  document.getElementById("panel-meta").innerHTML = meta;

  const nbrs = adj[d.id]||[];
  document.getElementById("panel-links").innerHTML = nbrs.length
    ? `<h3>Kopplingar (${{nbrs.length}})</h3>`
      + nbrs.map(nid=>{{
          const nd = DATA.nodes.find(n=>n.id===nid);
          return nd ? `<div class="plink" style="border-left-color:${{starColor(nd)}}"
            onclick="selectById('${{nid}}')">${{nd.title}}</div>` : "";
        }}).join("")
    : `<div style="font-size:9px;color:#1e1e35">Inga kopplingar</div>`;
}}

function closePanel() {{
  if (orbitRing) {{ orbitRing.remove(); orbitRing=null; }}
  document.getElementById("panel").classList.remove("open");
  link.attr("stroke",edgeColor).attr("stroke-width",edgeWidth);
  node.select("circle").attr("opacity",1);
  node.select("text").attr("opacity",1);
}}

function selectById(id) {{
  const nd = DATA.nodes.find(n=>n.id===id);
  if (nd) selectStar(nd);
}}
svg.on("click", closePanel);

// ── Sök ───────────────────────────────────────────────────────────────────────
document.getElementById("search").addEventListener("input", function(){{
  const q = this.value.toLowerCase().trim();
  node.select("circle").attr("opacity", d=>!q||d.title.toLowerCase().includes(q)?1:0.06);
  node.select("text").attr("opacity", d=>!q||d.title.toLowerCase().includes(q)?1:0.02);
  if (!q) link.attr("stroke",edgeColor).attr("stroke-width",edgeWidth);
}});

// ── Filter-knappar ───────────────────────────────────────────────────────────
document.querySelectorAll(".fbtn").forEach(btn=>{{
  btn.addEventListener("click", function(){{
    document.querySelectorAll(".fbtn").forEach(b=>b.classList.remove("active"));
    this.classList.add("active");
    const cat = this.dataset.cat;
    if (cat==="all") {{
      node.select("circle").attr("opacity",1);
      node.select("text").attr("opacity",1);
      link.attr("stroke",edgeColor).attr("stroke-width",edgeWidth).attr("opacity",1);
    }} else {{
      const visible = new Set(DATA.nodes.filter(n=>n.category===cat).map(n=>n.id));
      // Inkludera grannarna
      visible.forEach(id=>{{ (adj[id]||[]).forEach(nb=>visible.add(nb)); }});
      node.select("circle").attr("opacity",n=>visible.has(n.id)?1:0.06);
      node.select("text").attr("opacity",n=>visible.has(n.id)?1:0.02);
      link.attr("opacity",l=>{{
        const s=l.source.id||l.source, t=l.target.id||l.target;
        return visible.has(s)&&visible.has(t)?1:0.04;
      }});
    }}
  }});
}});

window.addEventListener("resize",()=>
  sim.force("center",d3.forceCenter(W()/2,H()/2)).alpha(.1).restart()
);

// ── Auto-reload ───────────────────────────────────────────────────────────────
let _lastMod = null;
async function pollForUpdates() {{
  try {{
    const res = await fetch(window.location.href,{{method:"HEAD",cache:"no-store"}});
    const lm = res.headers.get("Last-Modified")||res.headers.get("ETag")||"";
    if (_lastMod===null) {{ _lastMod=lm; }}
    else if (lm!==_lastMod) {{ window.location.reload(); return; }}
    document.getElementById("live-dot").style.background="#10b981";
    document.getElementById("live-text").textContent="Live";
  }} catch(e) {{
    document.getElementById("live-dot").style.background="#6b7280";
    document.getElementById("live-text").textContent="Offline";
  }}
}}
pollForUpdates();
setInterval(pollForUpdates,15000);
</script>
</body>
</html>"""


def main():
    print("Skannar vault + bygger arkitektur…")
    nodes, edges = scan_vault()
    proj_count = sum(1 for n in nodes if n["category"] in ("b2c","b2b","platform","customer"))
    cross_count = sum(1 for e in edges if e["etype"] == "cross")
    print(f"  {len(nodes)} noder · {len(edges)} kopplingar "
          f"(varav {proj_count} projekt/kunder, {cross_count} kors-kopplingar)")
    html = build_html(nodes, edges)
    TMP.write_text(html, encoding="utf-8")
    TMP.rename(OUTPUT)
    print(f"Klar → {OUTPUT}")

if __name__ == "__main__":
    main()
