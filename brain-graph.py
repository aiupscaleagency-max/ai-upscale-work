#!/usr/bin/env python3
"""
AI Upscale Brain — Memory Galaxy v5
Korrekt symlink-traversering: memory + skills inkluderas.
Alla noder länkas till AI Upscale Brain-hubben.
"""
import os, re, json
from pathlib import Path

VAULT     = Path.home() / "ai_upscale_work/Obsidian-Vaults/AI-Upscale-Brain"
OUTPUT    = Path.home() / "ai_upscale_work/brain-graph.html"
TMP       = Path.home() / "ai_upscale_work/.brain-graph.tmp"

# 08-memory-backup är en temporär kopia — ska ALDRIG scannas
SKIP_DIRS = {"99-graphify-dump", ".obsidian", ".trash", "08-memory-backup"}

# ─── PROJEKTMETADATA ──────────────────────────────────────────────────────────
PROJECT_META = {
    "thyroidai":          {"name":"ThyroidAI",       "type":"B2C",      "segment":"hälsa",            "status":"LIVE",             "goal":"150 MSEK/år", "tech":["next.js","supabase","stripe","docker","gemini","capacitor"], "agents":["ai-doktor","voice-agent"],              "links_to":["fluentic-ai","ceo-with-adhd"]},
    "ceo-with-adhd":      {"name":"CEO with ADHD",   "type":"B2C",      "segment":"utbildning",       "status":"Klar — saknar video","goal":"100 MSEK/år","tech":["next.js","supabase","stripe","video-content"],             "agents":["content-agent","coaching-bot"],          "links_to":["thyroidai","fluentic-ai"]},
    "fluentic-ai":        {"name":"Fluentic AI",     "type":"B2C",      "segment":"språk",            "status":"Igång",            "goal":"Mikes projekt","tech":["next.js","supabase","stripe","gemini","voice-agent"],       "agents":["voice-agent","ai-tutor"],               "links_to":["thyroidai","ceo-with-adhd"]},
    "byggflow":           {"name":"ByggFlow",         "type":"B2B",      "segment":"hantverkare",      "status":"I princip klar",   "goal":"69 900 kr+",  "tech":["next.js","supabase","stripe","aios","openclaw"],             "agents":["aios-agent","cold-calling"],             "links_to":["infrea-insight","aios-core","af-sius"]},
    "infrea-insight":     {"name":"Infrea-Insight",   "type":"B2B",      "segment":"hantv./kommuner",  "status":"I princip klar",   "goal":"69 900 kr+",  "tech":["next.js","supabase","stripe","aios","openclaw"],             "agents":["aios-agent","cold-calling"],             "links_to":["byggflow","aios-core","af-sius"]},
    "af-sius":            {"name":"AF-SIUS",           "type":"B2B",      "segment":"rekrytering",      "status":"Snart klar",       "goal":"150 000 kr+", "tech":["next.js","supabase","aios","openclaw"],                     "agents":["ai-recruiter","cold-calling"],           "links_to":["byggflow","infrea-insight","aios-core"]},
    "ze-parts":           {"name":"Ze-Parts",          "type":"B2B",      "segment":"e-handel",         "status":"Snart klar",       "goal":"Pot. kund",   "tech":["next.js","supabase","aios","stripe"],                       "agents":["aios-agent"],                           "links_to":["aios-core","byggflow"]},
    "aios-core":          {"name":"AIOS Core",         "type":"Platform", "segment":"AIOS-plattform",   "status":"Pågår",            "goal":"B2B-platform","tech":["next.js","supabase","stripe","openclaw","aios","docker"],   "agents":["aios-agent","openclaw","ruflo"],         "links_to":["byggflow","infrea-insight","af-sius","ze-parts","aiupscale-monitor"]},
    "aios-core-landing":  {"name":"AIOS Landing",      "type":"Marketing","segment":"landningssida",    "status":"Live?",            "goal":"Lead gen",    "tech":["next.js","vercel"],                                         "agents":[],                                       "links_to":["aios-core"]},
    "aiupscale-monitor":  {"name":"Monitor",           "type":"Internal", "segment":"monitoring",       "status":"Intern",           "goal":"Intern",      "tech":["next.js","supabase","aios"],                                "agents":["aios-agent"],                           "links_to":["aios-core"]},
    "graphify-mall-ai-os":{"name":"Graphify Mall",     "type":"Internal", "segment":"visualisering",    "status":"Intern",           "goal":"Mall",        "tech":["python","d3.js"],                                           "agents":["graphify"],                             "links_to":[]},
    "mikael-trading-os":  {"name":"Trading OS",        "type":"Pausad",   "segment":"trading",          "status":"PAUSAD",           "goal":"Pausad",      "tech":["python"],                                                   "agents":[],                                       "links_to":[]},
    "caso-chile-dashboard":{"name":"Caso Chile",       "type":"Internal", "segment":"dashboard",        "status":"Intern",           "goal":"Intern",      "tech":["next.js","supabase"],                                       "agents":[],                                       "links_to":[]},
}

CUSTOMER_NODES = {
    "__arbetsmiljocenter": {"title":"Arbetsmiljöcenter","type":"Kund","segment":"cold-calling","status":"DEAL BEKRÄFTAD","goal":"Cold Call Agents (Retell + Agora+Gemini)","links_to_slugs":["aios-core","af-sius"]},
    "__cluee":             {"title":"Cluee (247K YT)",  "type":"Lead","segment":"video/nyheter", "status":"Pitch pågår",     "goal":"AI nyhetsvideos + shorts",               "links_to_slugs":["aios-core"]},
}

CATEGORY_TINT = {
    "hub":      (255, 240, 140),
    "b2c":      ( 80, 255, 170),
    "b2b":      (100, 170, 255),
    "platform": (200, 140, 255),
    "customer": (255, 155,  60),
    "internal": (140, 140, 165),
    "paused":   ( 70,  70,  80),
    "marketing":(200, 230, 255),
    "strategy": (170, 200, 255),
    "agent":    (255, 195, 110),
    "skill":    (140, 230, 255),
    "memory":   (195, 155, 255),
    "feedback": (110, 215, 255),
    "default":  (160, 160, 180),
}

TYPE_CAT = {
    "B2C":"b2c","B2B":"b2b","Platform":"platform","Marketing":"marketing",
    "Internal":"internal","Pausad":"paused","Kund":"customer","Lead":"customer",
}

GENERIC_H1 = {
    "react + vite","getting started","next.js","readme","untitled",
    "create next app","vite","index","overview","welcome"
}

# ─── FILSINSAMLING — hanterar symlinks explicit ───────────────────────────────
def collect_files():
    """rglob följer inte symlinks utanför vault-trädet. Gör det explicit."""
    files = {}

    # 1. Vanliga vault-filer (exkl. symlink-mappar)
    for md in VAULT.rglob("*.md"):
        if any(s in md.parts for s in SKIP_DIRS):
            continue
        # Hoppa över saker inuti symlink-mappar (hanteras nedanför)
        rel = md.relative_to(VAULT)
        if rel.parts[0] in ("08-memory",) and md.is_symlink():
            continue
        fid = str(rel)
        files[fid] = md

    # 2. 08-memory (symlink → Claude's memory — 34 filer)
    mem = VAULT / "08-memory"
    if mem.exists():
        for md in mem.glob("*.md"):
            if any(s in md.name for s in (".bak",)):
                continue
            fid = "08-memory/" + md.name
            files[fid] = md

    # 3. 03-agents/skills/_source (symlink → ~/.claude/skills/ — 80 SKILL.md)
    skills = VAULT / "03-agents/skills/_source"
    if skills.exists():
        for md in skills.glob("*/SKILL.md"):
            fid = "03-agents/skills/_source/" + md.parent.name + "/SKILL.md"
            files[fid] = md

    return files

# ─── HJÄLPFUNKTIONER ─────────────────────────────────────────────────────────
def read(fp):
    try: return fp.read_text(encoding="utf-8", errors="replace")
    except: return ""

def fm_field(content, field):
    m = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m: return ""
    nm = re.search(rf'^{field}:\s*(.+)', m.group(1), re.MULTILINE)
    return nm.group(1).strip().strip('"') if nm else ""

def extract_tags(content):
    m = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m: return []
    tm = re.search(r'tags:\s*\[([^\]]+)\]', m.group(1))
    return [t.strip() for t in tm.group(1).split(",")] if tm else []

def project_slug(fp):
    if "04-projects" not in fp.parts: return None
    idx = list(fp.parts).index("04-projects")
    return fp.parts[idx+1] if idx+1 < len(fp.parts) else None

def smart_title(content, fp):
    name = fm_field(content, "name")
    if name: return name
    h1 = re.search(r'^#\s+(.+)', content, re.MULTILINE)
    if h1 and h1.group(1).strip().lower() not in GENERIC_H1:
        return h1.group(1).strip()
    slug = project_slug(fp)
    if slug:
        meta = PROJECT_META.get(slug, {})
        n = meta.get("name") or slug.replace("-"," ").title()
        return n + (" — CLAUDE" if fp.name=="CLAUDE.md" else "")
    # Skills: använd mappnamnet
    if "_source" in fp.parts:
        return fp.parent.name.replace("-"," ").replace("_"," ").title()
    parent = fp.parent.name
    if parent not in (".", "AI-Upscale-Brain"):
        return parent.replace("-"," ").replace("_"," ").title() + \
               (" — CLAUDE" if fp.stem.upper()=="CLAUDE" else "")
    return fp.stem.replace("-"," ").replace("_"," ").title()

def get_category(fp, tags, slug=None):
    if "hub" in tags or fp.name=="00-INDEX.md": return "hub"
    if slug and "04-projects" in fp.parts:
        t = PROJECT_META.get(slug,{}).get("type","")
        return TYPE_CAT.get(t,"project")
    if "01-strategy" in fp.parts: return "strategy"
    if "_source" in fp.parts: return "skill"
    if "03-agents" in fp.parts: return "agent"
    if "08-memory" in fp.parts:
        return "feedback" if fp.stem.startswith("feedback_") else "memory"
    return "default"

def extract_wikilinks(content):
    return [r.strip() for r in re.findall(r'\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]', content)]

def resolve_link(link, all_files):
    ll = link.lower()
    for fid, fp in all_files.items():
        rel = str(fp.relative_to(VAULT)).replace(os.sep,"/") if VAULT in fp.parents else fid
        if ll in (rel.rsplit(".",1)[0].lower(), fp.stem.lower(), rel.lower()):
            return fid
    for fid, fp in all_files.items():
        if fp.stem.lower() == ll.split("/")[-1]:
            return fid
    return None

def readme_id(slug, all_files):
    for fid, fp in all_files.items():
        if "04-projects" in fp.parts:
            idx = list(fp.parts).index("04-projects")
            if idx+1 < len(fp.parts) and fp.parts[idx+1]==slug and fp.name=="README.md":
                return fid
    return None

def memory_project_slug(stem):
    for slug in PROJECT_META:
        if slug.replace("-","_") in stem:
            return slug
    return ""

# ─── SCAN ────────────────────────────────────────────────────────────────────
def scan():
    all_files = collect_files()

    # Recency
    mtimes = {}
    for fid, fp in all_files.items():
        try: mtimes[fid] = fp.stat().st_mtime
        except: mtimes[fid] = 0
    tmin = min(mtimes.values()) if mtimes else 0
    tmax = max(mtimes.values()) if mtimes else 1
    tr   = max(tmax-tmin, 1)

    nodes = {}

    # ── Vault-noder ──────────────────────────────────────────────────────────
    for fid, fp in all_files.items():
        content = read(fp)
        tags  = extract_tags(content)
        slug  = project_slug(fp)
        title = smart_title(content, fp)
        cat   = get_category(fp, tags, slug)
        rec   = (mtimes[fid]-tmin)/tr
        r,g,b = CATEGORY_TINT.get(cat, (160,160,180))
        meta  = PROJECT_META.get(slug,{}) if slug else {}
        nodes[fid] = {
            "id":fid, "title":title, "category":cat,
            "r":r,"g":g,"b":b,
            "recency":round(rec,3), "words":len(content.split()),
            "links_raw":extract_wikilinks(content),
            "path":fid, "slug":slug or "",
            "meta_type":    meta.get("type",""),
            "meta_status":  meta.get("status",""),
            "meta_goal":    meta.get("goal",""),
            "meta_segment": meta.get("segment",""),
            "meta_tech":    ", ".join(meta.get("tech",[])),
            "meta_agents":  ", ".join(meta.get("agents",[])),
        }

    # ── Kundnoder (virtuella) ─────────────────────────────────────────────────
    for cid, cm in CUSTOMER_NODES.items():
        r,g,b = CATEGORY_TINT["customer"]
        nodes[cid] = {
            "id":cid,"title":cm["title"],"category":"customer",
            "r":r,"g":g,"b":b,"recency":0.9,"words":0,
            "links_raw":[],"path":"(kund)","slug":cid,
            "meta_type":cm.get("type",""),"meta_status":cm.get("status",""),
            "meta_goal":cm.get("goal",""),"meta_segment":cm.get("segment",""),
            "meta_tech":"","meta_agents":"",
        }

    # ── Kanter ───────────────────────────────────────────────────────────────
    edges, seen = [], set()

    def add(src, tgt, etype="default"):
        if not src or not tgt or src==tgt: return
        key = tuple(sorted([src,tgt]))
        if key not in seen:
            seen.add(key)
            edges.append({"source":src,"target":tgt,"etype":etype})

    # 1. Wiki-länkarna i filerna
    for fid, node in nodes.items():
        for raw in node.get("links_raw",[]):
            tid = resolve_link(raw, all_files)
            if tid: add(fid, tid, "wiki")

    # 2. Hitta hub-nod
    hub_ids = [fid for fid,n in nodes.items() if n["category"]=="hub"]

    # 3. Alla projekt-README + kundnoder → hub
    proj_readmes = [readme_id(sl, all_files) for sl in PROJECT_META]
    proj_readmes = [p for p in proj_readmes if p]
    cust_ids     = list(CUSTOMER_NODES.keys())

    for hid in hub_ids:
        for pid in proj_readmes + cust_ids:
            add(hid, pid, "hub")

    # 4. ALL memory + feedback → hub
    for fid, n in nodes.items():
        if n["category"] in ("memory","feedback"):
            for hid in hub_ids:
                add(fid, hid, "hub")

    # 5. ALL skills → agents-index-nod (om den finns), annars → hub
    agent_index = next((fid for fid,fp in all_files.items()
                        if "03-agents" in fp.parts and fp.name=="INDEX.md"), None)
    for fid, n in nodes.items():
        if n["category"]=="skill":
            if agent_index: add(fid, agent_index, "agent")
            else:
                for hid in hub_ids: add(fid, hid, "hub")

    # Agents-index → hub
    if agent_index:
        for hid in hub_ids:
            add(agent_index, hid, "hub")

    # 6. Memory → specifika projekt (via filnamn)
    for fid, fp in all_files.items():
        if "08-memory" not in str(fid): continue
        sl = memory_project_slug(fp.stem)
        if not sl: continue
        pfid = readme_id(sl, all_files)
        if pfid: add(fid, pfid, "memory")

    # 7. Korskopp. projekt ↔ projekt
    for slug, meta in PROJECT_META.items():
        src = readme_id(slug, all_files)
        if not src: continue
        for ts in meta.get("links_to",[]):
            tgt = readme_id(ts, all_files)
            if tgt: add(src, tgt, "cross")

    # 8. Kundnoder → deras projekt
    for cid, cm in CUSTOMER_NODES.items():
        for ts in cm.get("links_to_slugs",[]):
            tgt = readme_id(ts, all_files)
            if tgt: add(cid, tgt, "cross")

    # Degree
    deg = {}
    for e in edges:
        deg[e["source"]] = deg.get(e["source"],0)+1
        deg[e["target"]] = deg.get(e["target"],0)+1
    for n in nodes.values():
        n["degree"] = deg.get(n["id"],0)
        n.pop("links_raw",None)

    return list(nodes.values()), edges

# ─── HTML ─────────────────────────────────────────────────────────────────────
def build_html(nodes, edges):
    data = json.dumps({"nodes":nodes,"links":edges}, ensure_ascii=False)
    nn, ne = len(nodes), len(edges)
    proj_c  = sum(1 for n in nodes if n["category"] in ("b2c","b2b","platform","customer","marketing"))
    skill_c = sum(1 for n in nodes if n["category"]=="skill")
    mem_c   = sum(1 for n in nodes if n["category"] in ("memory","feedback"))
    cross_c = sum(1 for e in edges if e["etype"]=="cross")

    return f"""<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>AI Upscale Brain — Memory Galaxy</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:#010106;color:#e2e8f0;
     font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
     overflow:hidden;height:100vh}}
#canvas{{width:100vw;height:100vh}}

#hud{{position:fixed;top:16px;left:16px;z-index:10;
      display:flex;flex-direction:column;gap:5px;pointer-events:none}}
#brand{{font-size:9px;color:#252535;letter-spacing:2px;text-transform:uppercase}}
#gtitle{{font-size:21px;font-weight:700;color:#fff;
         text-shadow:0 0 40px rgba(200,180,255,.6)}}
#gsub{{font-size:9px;color:#2a2a42;margin-top:1px}}
#stats{{font-size:9px;color:#3a3a55;margin-top:3px;line-height:1.7}}
#search{{pointer-events:all;background:rgba(8,8,22,.9);
         border:1px solid #151530;border-radius:6px;color:#e2e8f0;
         padding:5px 10px;font-size:11px;width:200px;outline:none;margin-top:5px}}
#search:focus{{border-color:rgba(160,140,255,.5)}}

#filters{{pointer-events:all;display:flex;gap:3px;flex-wrap:wrap;margin-top:5px}}
.fbtn{{font-size:9px;padding:2px 7px;border-radius:10px;cursor:pointer;
       border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02);
       color:#505070;transition:all .15s}}
.fbtn:hover,.fbtn.active{{color:#fff;border-color:rgba(255,255,255,.25);
                          background:rgba(255,255,255,.06)}}

#legend{{margin-top:7px;display:flex;flex-direction:column;gap:2px}}
.leg{{font-size:9px;color:#303048;display:flex;align-items:center;gap:5px}}
.dot{{width:5px;height:5px;border-radius:50%;flex-shrink:0}}
.line{{width:16px;height:1px;flex-shrink:0}}
.sep{{border-top:1px solid #0a0a18;padding-top:3px;margin-top:2px}}

#panel{{position:fixed;right:0;top:0;bottom:0;width:275px;
        background:rgba(3,3,12,.97);border-left:1px solid #080818;
        padding:18px 14px;transform:translateX(100%);
        transition:transform .2s ease;z-index:20;overflow-y:auto}}
#panel.open{{transform:translateX(0)}}
#pbadge{{display:inline-block;font-size:9px;padding:2px 8px;
         border-radius:10px;margin-bottom:7px;font-weight:600;
         letter-spacing:.5px;text-transform:uppercase}}
#ptitle{{font-size:15px;font-weight:700;margin-bottom:2px}}
#pstatus{{font-size:10px;color:#555575;margin-bottom:6px}}
#pgoal{{font-size:11px;margin-bottom:8px}}
.pmeta{{font-size:9px;color:#404060;margin-bottom:3px;line-height:1.5}}
.pmeta strong{{color:#606080}}
hr.pdiv{{border:none;border-top:1px solid #0c0c20;margin:9px 0}}
#plinks h3{{font-size:8px;color:#2a2a40;text-transform:uppercase;
            letter-spacing:1px;margin-bottom:5px}}
.plink{{font-size:9px;color:#505075;padding:2px 0 2px 7px;
        cursor:pointer;border-left:1px solid transparent;transition:color .1s}}
.plink:hover{{color:#e2e8f0}}
#xbtn{{position:absolute;top:10px;right:10px;background:none;
       border:none;color:#2a2a40;font-size:15px;cursor:pointer}}
#xbtn:hover{{color:#e2e8f0}}

#live{{position:fixed;bottom:12px;right:12px;font-size:9px;
       color:#252535;display:flex;align-items:center;gap:4px}}
#ldot{{width:4px;height:4px;border-radius:50%;background:#10b981;
       animation:blink 2s ease-in-out infinite}}
@keyframes blink{{0%,100%{{opacity:.25}}50%{{opacity:1}}}}
</style>
</head>
<body>
<svg id="canvas">
  <defs>
    <filter id="glow-xs"><feGaussianBlur stdDeviation="1.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-sm"><feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-md"><feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-lg"><feGaussianBlur stdDeviation="12" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
</svg>

<div id="hud">
  <div id="brand">AI UPSCALE AGENCY · STUDIO</div>
  <div><div id="gtitle">Memory Galaxy</div>
       <div id="gsub">AI Upscale Brain — Arkitekturöversikt</div></div>
  <div id="stats">
    {nn} noder · {ne} kopplingar<br>
    {proj_c} projekt/kunder · {skill_c} skills · {mem_c} memory · {cross_c} korskopp.
  </div>
  <input id="search" type="text" placeholder="Sök nod…" autocomplete="off"/>
  <div id="filters">
    <button class="fbtn active" data-cat="all">Alla</button>
    <button class="fbtn" data-cat="b2c">B2C</button>
    <button class="fbtn" data-cat="b2b">B2B</button>
    <button class="fbtn" data-cat="platform">Platform</button>
    <button class="fbtn" data-cat="customer">Kunder</button>
    <button class="fbtn" data-cat="skill">Skills</button>
    <button class="fbtn" data-cat="memory">Memory</button>
    <button class="fbtn" data-cat="feedback">Feedback</button>
  </div>
  <div id="legend">
    <div class="leg sep"><span class="dot" style="background:rgb(255,240,140)"></span>Hub — AI Upscale Brain</div>
    <div class="leg"><span class="dot" style="background:rgb(80,255,170)"></span>B2C projekt</div>
    <div class="leg"><span class="dot" style="background:rgb(100,170,255)"></span>B2B / AIOS</div>
    <div class="leg"><span class="dot" style="background:rgb(200,140,255)"></span>Platform (AIOS Core)</div>
    <div class="leg"><span class="dot" style="background:rgb(255,155,60)"></span>Kunder & leads</div>
    <div class="leg"><span class="dot" style="background:rgb(140,230,255)"></span>Skills (80 st)</div>
    <div class="leg"><span class="dot" style="background:rgb(195,155,255)"></span>Memory</div>
    <div class="leg"><span class="dot" style="background:rgb(110,215,255)"></span>Feedback/regler</div>
    <div class="leg sep"><span class="line" style="background:rgba(255,240,100,.35)"></span>Hub → projekt/memory</div>
    <div class="leg"><span class="line" style="background:rgba(255,140,40,.55)"></span>Korskopp. (delad tech)</div>
    <div class="leg"><span class="line" style="background:rgba(180,100,255,.35)"></span>Memory → projekt</div>
    <div class="leg sep" style="color:#1a1a28">⬤ ljusare = senast rörd</div>
  </div>
</div>

<div id="panel">
  <button id="xbtn" onclick="closePanel()">✕</button>
  <div id="pbadge"></div>
  <div id="ptitle"></div>
  <div id="pstatus"></div>
  <div id="pgoal"></div>
  <div id="pmeta"></div>
  <hr class="pdiv"/>
  <div id="plinks"></div>
</div>

<div id="live"><div id="ldot"></div><span id="ltxt">Live</span></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const DATA = {data};
const W=()=>window.innerWidth, H=()=>window.innerHeight;

const adj={{}};
DATA.links.forEach(l=>{{
  const s=l.source.id||l.source, t=l.target.id||l.target;
  (adj[s]||(adj[s]=[])).push(t);
  (adj[t]||(adj[t]=[])).push(s);
}});

const IS_PROJ = new Set(["b2c","b2b","platform","customer","marketing"]);

function radius(d){{
  if(d.category==="hub") return 9;
  if(IS_PROJ.has(d.category)) return 4+d.degree*.4+d.recency*3;
  if(d.category==="agent") return 5+d.degree*.3;
  return 2+d.recency*2+d.degree*.2;
}}

function color(d,a){{
  const br=0.22+d.recency*0.78;
  const r=Math.round(d.r*br),g=Math.round(d.g*br),b=Math.round(d.b*br);
  return a!==undefined?`rgba(${{r}},${{g}},${{b}},${{a}})`:`rgb(${{r}},${{g}},${{b}})`;
}}

function glow(d){{
  if(d.category==="hub") return "url(#glow-lg)";
  if(IS_PROJ.has(d.category)||d.category==="agent") return "url(#glow-md)";
  if(d.recency>0.75||d.degree>4) return "url(#glow-sm)";
  return "url(#glow-xs)";
}}

function ecolor(l){{
  switch(l.etype){{
    case"hub":    return "rgba(255,240,100,.12)";
    case"cross":  return "rgba(255,140,40,.4)";
    case"memory": return "rgba(180,100,255,.28)";
    case"agent":  return "rgba(140,230,255,.18)";
    case"wiki":   return "rgba(255,255,255,.07)";
    default:      return "rgba(255,255,255,.05)";
  }}
}}
function ewidth(l){{
  return l.etype==="cross"?1.3:l.etype==="hub"?0.7:0.5;
}}

const svg=d3.select("#canvas");
const g=svg.append("g");
svg.call(d3.zoom().scaleExtent([0.03,10]).on("zoom",e=>g.attr("transform",e.transform)));

// Initial layout: hub center, projekt innerring, resten ytterring
DATA.nodes.forEach(n=>{{
  if(n.category==="hub"){{n.x=W()/2;n.y=H()/2;n.fx=W()/2;n.fy=H()/2;return;}}
  const isproj=IS_PROJ.has(n.category)||n.category==="agent";
  const r=isproj?160+Math.random()*100:250+Math.random()*300;
  const a=Math.random()*2*Math.PI;
  n.x=W()/2+Math.cos(a)*r; n.y=H()/2+Math.sin(a)*r;
}});

const sim=d3.forceSimulation(DATA.nodes)
  .force("link",d3.forceLink(DATA.links).id(d=>d.id)
    .distance(l=>{{
      const sc=l.source.category||"",tc=l.target.category||"";
      if(sc==="hub"||tc==="hub") return IS_PROJ.has(sc)||IS_PROJ.has(tc)?180:280;
      if(l.etype==="cross") return 150;
      if(l.etype==="agent") return 80;
      if(l.etype==="memory") return 120;
      return 70;
    }}).strength(l=>l.etype==="cross"?0.45:l.etype==="hub"?0.2:0.25))
  .force("charge",d3.forceManyBody()
    .strength(d=>d.category==="hub"?-1200:
              IS_PROJ.has(d.category)?-400:
              d.category==="skill"?-80:-150)
    .distanceMax(600))
  .force("collide",d3.forceCollide(d=>radius(d)+5).strength(0.7))
  .force("center",d3.forceCenter(W()/2,H()/2).strength(0.01))
  .alphaDecay(0.01);

// Frigör hubben efter 2s (för att layouten ska stabiliseras runt den)
setTimeout(()=>{{
  DATA.nodes.forEach(n=>{{if(n.category==="hub"){{n.fx=null;n.fy=null;}}}});
  sim.alpha(0.1).restart();
}},2000);

const link=g.append("g").selectAll("line")
  .data(DATA.links).join("line")
  .attr("stroke",ecolor).attr("stroke-width",ewidth);

const node=g.append("g").selectAll(".star")
  .data(DATA.nodes).join("g").attr("class","star")
  .call(d3.drag()
    .on("start",(e,d)=>{{if(!e.active)sim.alphaTarget(.25).restart();d.fx=d.x;d.fy=d.y;}})
    .on("drag", (e,d)=>{{d.fx=e.x;d.fy=e.y;}})
    .on("end",  (e,d)=>{{if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null;}}))
  .on("click",(e,d)=>{{e.stopPropagation();selectStar(d);}});

node.append("circle")
  .attr("r",radius).attr("fill",color).attr("filter",glow)
  .style("cursor","pointer");

node.append("text")
  .attr("dy",d=>radius(d)+10)
  .attr("text-anchor","middle")
  .attr("fill",d=>color(d,d.category==="hub"?1:0.85))
  .attr("font-size",d=>{{
    if(d.category==="hub") return "12px";
    if(IS_PROJ.has(d.category)||d.category==="agent") return "10px";
    return "8px";
  }})
  .attr("font-weight",d=>d.category==="hub"||IS_PROJ.has(d.category)?"600":"400")
  .style("pointer-events","none")
  .style("text-shadow","0 0 6px #000,0 0 3px #000")
  .text(d=>{{
    const show=d.category==="hub"||IS_PROJ.has(d.category)||
               d.category==="agent"||d.degree>=5||d.recency>0.85;
    if(!show) return "";
    return d.title.length>24?d.title.slice(0,22)+"…":d.title;
  }});

sim.on("tick",()=>{{
  link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
      .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
  node.attr("transform",d=>`translate(${{d.x}},${{d.y}})`);
}});

// ── Interaktion ──────────────────────────────────────────────────────────────
let ring=null;
const BADGE={{
  hub:"rgba(255,240,100,.12)",b2c:"rgba(80,255,170,.12)",
  b2b:"rgba(100,170,255,.12)",platform:"rgba(200,140,255,.12)",
  customer:"rgba(255,155,60,.12)",internal:"rgba(140,140,165,.1)",
  skill:"rgba(140,230,255,.1)",memory:"rgba(195,155,255,.1)",
  feedback:"rgba(110,215,255,.1)",agent:"rgba(255,195,110,.1)",
}};

function selectStar(d){{
  const hl=new Set([d.id,...(adj[d.id]||[])]);
  if(ring)ring.remove();
  ring=g.append("circle").attr("cx",d.x).attr("cy",d.y)
    .attr("r",radius(d)+18).attr("fill","none")
    .attr("stroke",color(d,.35)).attr("stroke-width",1)
    .attr("stroke-dasharray","4 3");

  link.attr("stroke",l=>{{
    const s=l.source.id||l.source,t=l.target.id||l.target;
    return hl.has(s)&&hl.has(t)?ecolor(l).replace(/[\d.]+\)$/,"0.75)"):
           "rgba(255,255,255,.015)";
  }}).attr("stroke-width",l=>{{
    const s=l.source.id||l.source,t=l.target.id||l.target;
    return hl.has(s)&&hl.has(t)?ewidth(l)*2:0.4;
  }});
  node.select("circle").attr("opacity",n=>hl.has(n.id)?1:0.08);
  node.select("text").attr("opacity",n=>hl.has(n.id)?1:0.02);

  document.getElementById("panel").classList.add("open");
  const col=color(d);
  const badge=document.getElementById("pbadge");
  badge.textContent=d.meta_type||d.category;
  badge.style.background=BADGE[d.category]||"rgba(255,255,255,.07)";
  badge.style.color=col;
  badge.style.border=`1px solid ${{col.replace("rgb","rgba").replace(")",",0.3)")}}`;
  document.getElementById("ptitle").textContent=d.title;
  document.getElementById("ptitle").style.color=col;
  document.getElementById("pstatus").textContent=d.meta_status||"";
  document.getElementById("pgoal").innerHTML=
    d.meta_goal?`<span style="color:${{col}}">◎</span> ${{d.meta_goal}}`:"";
  let m="";
  if(d.meta_segment) m+=`<div class="pmeta"><strong>Segment:</strong> ${{d.meta_segment}}</div>`;
  if(d.meta_tech)    m+=`<div class="pmeta"><strong>Tech:</strong> ${{d.meta_tech}}</div>`;
  if(d.meta_agents)  m+=`<div class="pmeta"><strong>Agents:</strong> ${{d.meta_agents}}</div>`;
  m+=`<div class="pmeta"><strong>Aktualitet:</strong> ${{Math.round(d.recency*100)}}% · ${{d.degree}} kopplingar</div>`;
  document.getElementById("pmeta").innerHTML=m;
  const nb=adj[d.id]||[];
  document.getElementById("plinks").innerHTML=nb.length
    ?`<h3>Kopplingar (${{nb.length}})</h3>`+nb.map(nid=>{{
        const nd=DATA.nodes.find(n=>n.id===nid);
        return nd?`<div class="plink" style="border-left-color:${{color(nd)}}"
          onclick="selectById('${{nid}}')">${{nd.title}}</div>`:"";
      }}).join("")
    :`<div style="font-size:9px;color:#1a1a28">Inga kopplingar</div>`;
}}

function closePanel(){{
  if(ring){{ring.remove();ring=null;}}
  document.getElementById("panel").classList.remove("open");
  link.attr("stroke",ecolor).attr("stroke-width",ewidth);
  node.select("circle").attr("opacity",1);
  node.select("text").attr("opacity",1);
}}
function selectById(id){{const nd=DATA.nodes.find(n=>n.id===id);if(nd)selectStar(nd);}}
svg.on("click",closePanel);

// ── Sök ─────────────────────────────────────────────────────────────────────
document.getElementById("search").addEventListener("input",function(){{
  const q=this.value.toLowerCase().trim();
  if(!q){{
    node.select("circle").attr("opacity",1);
    node.select("text").attr("opacity",1);
    link.attr("stroke",ecolor).attr("stroke-width",ewidth);
    return;
  }}
  node.select("circle").attr("opacity",d=>d.title.toLowerCase().includes(q)?1:0.05);
  node.select("text").attr("opacity",d=>d.title.toLowerCase().includes(q)?1:0.02);
}});

// ── Filter ───────────────────────────────────────────────────────────────────
document.querySelectorAll(".fbtn").forEach(btn=>{{
  btn.addEventListener("click",function(){{
    document.querySelectorAll(".fbtn").forEach(b=>b.classList.remove("active"));
    this.classList.add("active");
    const cat=this.dataset.cat;
    if(cat==="all"){{
      node.select("circle").attr("opacity",1);
      node.select("text").attr("opacity",1);
      link.attr("stroke",ecolor).attr("stroke-width",ewidth).attr("opacity",1);
      return;
    }}
    const vis=new Set(DATA.nodes.filter(n=>n.category===cat).map(n=>n.id));
    vis.forEach(id=>(adj[id]||[]).forEach(nb=>vis.add(nb)));
    node.select("circle").attr("opacity",n=>vis.has(n.id)?1:0.05);
    node.select("text").attr("opacity",n=>vis.has(n.id)?1:0.02);
    link.attr("opacity",l=>{{
      const s=l.source.id||l.source,t=l.target.id||l.target;
      return vis.has(s)&&vis.has(t)?1:0.03;
    }});
  }});
}});

window.addEventListener("resize",()=>
  sim.force("center",d3.forceCenter(W()/2,H()/2)).alpha(.1).restart()
);

// ── Auto-reload ──────────────────────────────────────────────────────────────
let _lm=null;
async function poll(){{
  try{{
    const r=await fetch(window.location.href,{{method:"HEAD",cache:"no-store"}});
    const lm=r.headers.get("Last-Modified")||r.headers.get("ETag")||"";
    if(_lm===null){{_lm=lm;}}
    else if(lm!==_lm){{window.location.reload();return;}}
    document.getElementById("ldot").style.background="#10b981";
    document.getElementById("ltxt").textContent="Live";
  }}catch{{
    document.getElementById("ldot").style.background="#6b7280";
    document.getElementById("ltxt").textContent="Offline";
  }}
}}
poll(); setInterval(poll,15000);
</script>
</body>
</html>"""

def main():
    print("Skannar vault (inkl. symlink-mappar)…")
    nodes, edges = scan()
    proj  = sum(1 for n in nodes if n["category"] in ("b2c","b2b","platform","customer","marketing"))
    skill = sum(1 for n in nodes if n["category"]=="skill")
    mem   = sum(1 for n in nodes if n["category"] in ("memory","feedback"))
    cross = sum(1 for e in edges if e["etype"]=="cross")
    print(f"  {len(nodes)} noder · {len(edges)} kopplingar")
    print(f"  → {proj} projekt/kunder · {skill} skills · {mem} memory · {cross} korskopp.")
    html = build_html(nodes, edges)
    TMP.write_text(html, encoding="utf-8")
    TMP.rename(OUTPUT)
    print(f"Klar → {OUTPUT}")

if __name__ == "__main__":
    main()
