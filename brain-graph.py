#!/usr/bin/env python3
"""
AI Upscale Brain — Memory Galaxy v3
Stjärnor i rymden. Ljusare = nyare. Auto-uppdateras via brain-server.py.
"""

import os
import re
import json
import time
from pathlib import Path

VAULT = Path.home() / "ai_upscale_work/Obsidian-Vaults/AI-Upscale-Brain"
OUTPUT = Path.home() / "ai_upscale_work/brain-graph.html"
SKIP_DIRS = {"99-graphify-dump", ".obsidian", ".trash"}

GENERIC_TITLES = {
    "react + vite", "getting started", "next.js", "readme", "untitled",
    "create next app", "vite", "index"
}

PROJECT_NAMES = {
    "thyroidai": "ThyroidAI", "byggflow": "ByggFlow",
    "infrea-insight": "Infrea-Insight", "af-sius": "AF-SIUS",
    "fluentic-ai": "Fluentic AI", "ceo-with-adhd": "CEO with ADHD",
    "aios-core": "AIOS Core", "aios-core-landing": "AIOS Landing",
    "ze-parts": "Ze-Parts", "graphify-mall-ai-os": "Graphify Mall",
    "aiupscale-monitor": "Monitor", "caso-chile-dashboard": "Caso Chile",
    "mikael-trading-os": "Trading OS",
}

CATEGORY_TINT = {
    "hub":      (255, 240, 180),
    "strategy": (180, 210, 255),
    "project":  (180, 255, 220),
    "agent":    (255, 200, 150),
    "memory":   (210, 180, 255),
    "feedback": (150, 230, 255),
    "default":  (200, 200, 220),
}

def get_category(fp, tags):
    if "hub" in tags or "index" in tags or fp.name == "00-INDEX.md":
        return "hub"
    parts = fp.parts
    if "01-strategy" in parts: return "strategy"
    if "04-projects" in parts: return "project"
    if "03-agents"   in parts: return "agent"
    if "08-memory"   in parts:
        return "feedback" if fp.stem.startswith("feedback_") else "memory"
    return "default"

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
    parts = fp.parts
    if "04-projects" in parts:
        idx = list(parts).index("04-projects")
        if idx + 1 < len(parts):
            slug = parts[idx + 1]
            name = PROJECT_NAMES.get(slug, slug.replace("-", " ").title())
            return name + (" — CLAUDE" if fp.name == "CLAUDE.md" else "")
    parent = fp.parent.name
    if parent not in (".", "AI-Upscale-Brain"):
        nice = parent.replace("-", " ").replace("_", " ").title()
        return nice + (" — CLAUDE" if fp.stem.upper() == "CLAUDE" else "")
    return fp.stem.replace("-", " ").replace("_", " ").title()

def extract_wikilinks(content):
    return [r.strip() for r in re.findall(r'\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]', content) if r.strip()]

def resolve_link(link, all_files):
    link_lower = link.lower()
    for fid, fp in all_files.items():
        rel = str(fp.relative_to(VAULT)).replace(os.sep, "/")
        if link_lower in (rel.rsplit(".", 1)[0].lower(), fp.stem.lower(), rel.lower()):
            return fid
    for fid, fp in all_files.items():
        if fp.stem.lower() == link_lower.split("/")[-1]:
            return fid
    return None

def memory_slug(stem):
    for slug in PROJECT_NAMES:
        if slug.replace("-", "_") in stem:
            return slug
    return ""

def slug_to_readme(slug, all_files):
    for fid, fp in all_files.items():
        parts = fp.parts
        if "04-projects" in parts:
            idx = list(parts).index("04-projects")
            if idx + 1 < len(parts) and parts[idx + 1] == slug and fp.name == "README.md":
                return fid
    return None

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

    nodes = {}
    for fid, fp in all_files.items():
        try: content = fp.read_text(encoding="utf-8")
        except: content = ""
        tags    = extract_tags(content)
        title   = smart_title(content, fp)
        cat     = get_category(fp, tags)
        links   = extract_wikilinks(content)
        words   = len(content.split())
        recency = (mtimes[fid] - tmin) / trange  # 0.0 → 1.0
        r, g, b = CATEGORY_TINT.get(cat, (200, 200, 220))
        nodes[fid] = {
            "id": fid, "title": title, "category": cat,
            "r": r, "g": g, "b": b,
            "recency": round(recency, 3),
            "words": words,
            "links_raw": links,
            "path": str(fp.relative_to(VAULT)),
        }

    edges, seen = [], set()
    for fid, node in nodes.items():
        for raw in node["links_raw"]:
            tid = resolve_link(raw, all_files)
            if tid and tid != fid:
                key = tuple(sorted([fid, tid]))
                if key not in seen:
                    seen.add(key); edges.append({"source": fid, "target": tid})

    for fid, fp in all_files.items():
        if "08-memory" not in fp.parts: continue
        slug = memory_slug(fp.stem)
        if not slug: continue
        pfid = slug_to_readme(slug, all_files)
        if pfid:
            key = tuple(sorted([fid, pfid]))
            if key not in seen:
                seen.add(key); edges.append({"source": fid, "target": pfid})

    hub_ids = [fid for fid, n in nodes.items() if n["category"] == "hub"]
    proj_ids = [fid for fid, fp in all_files.items()
                if "04-projects" in fp.parts and fp.name == "README.md"]
    for hid in hub_ids:
        for pid in proj_ids:
            key = tuple(sorted([hid, pid]))
            if key not in seen:
                seen.add(key); edges.append({"source": hid, "target": pid})

    # Räkna kopplingar per nod (för stjärnstorlek)
    degree = {}
    for e in edges:
        degree[e["source"]] = degree.get(e["source"], 0) + 1
        degree[e["target"]] = degree.get(e["target"], 0) + 1
    for n in nodes.values():
        n["degree"] = degree.get(n["id"], 0)
        del n["links_raw"]

    return list(nodes.values()), edges

def build_html(nodes, edges):
    graph_data = json.dumps({"nodes": nodes, "links": edges}, ensure_ascii=False)
    n_nodes = len(nodes)
    n_edges = len(edges)

    return f"""<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>AI Upscale Brain — Memory Galaxy</title>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ background:#020208; color:#e2e8f0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; overflow:hidden; height:100vh; }}
#canvas {{ width:100vw; height:100vh; }}

/* HUD */
#hud {{ position:fixed; top:16px; left:16px; z-index:10; display:flex; flex-direction:column; gap:8px; }}
#brand {{ font-size:11px; color:#4a5568; letter-spacing:2px; text-transform:uppercase; }}
#galaxy-title {{ font-size:22px; font-weight:700; color:#fff; text-shadow:0 0 30px rgba(200,180,255,0.5); }}
#galaxy-sub {{ font-size:11px; color:#4a5568; margin-top:2px; }}
#counter {{ font-size:11px; color:#6b7280; margin-top:4px; }}
#search {{
  background:rgba(10,10,25,0.8); border:1px solid #1a1a3a;
  border-radius:6px; color:#e2e8f0; padding:5px 10px;
  font-size:11px; width:200px; outline:none; margin-top:4px;
}}
#search:focus {{ border-color:rgba(180,160,255,0.5); }}
#legend {{ margin-top:6px; display:flex; flex-direction:column; gap:3px; }}
.leg {{ font-size:10px; color:#4a5568; display:flex; align-items:center; gap:5px; }}
.leg-dot {{ width:6px; height:6px; border-radius:50%; }}

/* Info-panel */
#panel {{
  position:fixed; right:0; top:0; bottom:0; width:270px;
  background:rgba(5,5,15,0.95); border-left:1px solid #0f0f2a;
  padding:20px 14px; transform:translateX(100%);
  transition:transform 0.2s ease; z-index:20; overflow-y:auto;
}}
#panel.open {{ transform:translateX(0); }}
#panel-title {{ font-size:15px; font-weight:700; margin-bottom:4px; }}
#panel-cat {{ font-size:10px; color:#6b7280; margin-bottom:4px; }}
#panel-recency {{ font-size:10px; margin-bottom:10px; }}
#panel-path {{ font-size:9px; color:#374151; word-break:break-all; margin-bottom:12px; }}
#panel-links h3 {{ font-size:9px; color:#4b5563; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }}
.plink {{ font-size:10px; color:#6b7280; padding:3px 0 3px 7px; cursor:pointer; border-left:1px solid transparent; }}
.plink:hover {{ color:#e2e8f0; }}
#close-btn {{ position:absolute; top:10px; right:10px; background:none; border:none; color:#374151; font-size:16px; cursor:pointer; }}
#close-btn:hover {{ color:#e2e8f0; }}

/* Live-indikator */
#live {{ position:fixed; bottom:16px; right:16px; font-size:10px; color:#374151; display:flex; align-items:center; gap:5px; }}
#live-dot {{ width:5px; height:5px; border-radius:50%; background:#10b981; animation:blink 2s ease-in-out infinite; }}
@keyframes blink {{ 0%,100% {{ opacity:0.3; }} 50% {{ opacity:1; }} }}
</style>
</head>
<body>
<svg id="canvas">
  <defs>
    <filter id="glow-sm"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-md"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glow-lg"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
</svg>

<div id="hud">
  <div id="brand">LOCAL · STUDIO</div>
  <div>
    <div id="galaxy-title">Memory</div>
    <div id="galaxy-sub">AI Upscale Brain — Obsidian Vault</div>
  </div>
  <div id="counter">{n_nodes} stjärnor · {n_edges} kopplingar</div>
  <input id="search" type="text" placeholder="Sök stjärna..." autocomplete="off"/>
  <div id="legend">
    <div class="leg"><span class="leg-dot" style="background:rgb(255,240,180)"></span>hub</div>
    <div class="leg"><span class="leg-dot" style="background:rgb(180,255,220)"></span>projekt</div>
    <div class="leg"><span class="leg-dot" style="background:rgb(210,180,255)"></span>memory</div>
    <div class="leg"><span class="leg-dot" style="background:rgb(150,230,255)"></span>feedback</div>
    <div class="leg"><span class="leg-dot" style="background:rgb(255,200,150)"></span>agent</div>
    <div class="leg"><span class="leg-dot" style="background:rgb(180,210,255)"></span>strategi</div>
    <div class="leg" style="margin-top:4px;color:#374151">ljusare = nyligen rörd</div>
  </div>
</div>

<div id="panel">
  <button id="close-btn" onclick="closePanel()">✕</button>
  <div id="panel-title"></div>
  <div id="panel-cat"></div>
  <div id="panel-recency"></div>
  <div id="panel-path"></div>
  <div id="panel-links"></div>
</div>

<div id="live"><div id="live-dot"></div><span id="live-text">Ansluten</span></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const DATA = {graph_data};
const W = () => window.innerWidth, H = () => window.innerHeight;

// Adjacency
const adj = {{}};
DATA.links.forEach(l => {{
  if (!adj[l.source]) adj[l.source] = [];
  if (!adj[l.target]) adj[l.target] = [];
  adj[l.source].push(l.target);
  adj[l.target].push(l.source);
}});

// Nodstorlek: baserat på degree + recency
function starRadius(d) {{
  const base = d.category === "hub" ? 6 : 2;
  return base + d.degree * 0.6 + d.recency * 4;
}}

// Stjärnfärg: tint + ljusstyrka baserat på recency
function starColor(d, alpha) {{
  const brightness = 0.25 + d.recency * 0.75;
  const r = Math.round(d.r * brightness);
  const g = Math.round(d.g * brightness);
  const b = Math.round(d.b * brightness);
  return alpha !== undefined
    ? `rgba(${{r}},${{g}},${{b}},${{alpha}})`
    : `rgb(${{r}},${{g}},${{b}})`;
}}

function glowFilter(d) {{
  if (d.category === "hub") return "url(#glow-lg)";
  if (d.recency > 0.7 || d.degree > 3) return "url(#glow-md)";
  return "url(#glow-sm)";
}}

const svg = d3.select("#canvas");
const g   = svg.append("g");
svg.call(d3.zoom().scaleExtent([0.05, 6]).on("zoom", e => g.attr("transform", e.transform)));

// Sprida ut noder initialt som en galax
DATA.nodes.forEach(n => {{
  const angle = Math.random() * 2 * Math.PI;
  const dist  = 50 + Math.random() * Math.min(W(), H()) * 0.45;
  n.x = W()/2 + Math.cos(angle) * dist;
  n.y = H()/2 + Math.sin(angle) * dist;
}});

const sim = d3.forceSimulation(DATA.nodes)
  .force("link", d3.forceLink(DATA.links).id(d => d.id).distance(d => {{
    const sc = d.source.category || "", tc = d.target.category || "";
    if (sc === "hub" || tc === "hub") return 180;
    return 100;
  }}).strength(0.3))
  .force("charge", d3.forceManyBody().strength(-300).distanceMax(400))
  .force("center", d3.forceCenter(W()/2, H()/2).strength(0.04))
  .force("collide", d3.forceCollide(d => starRadius(d) + 10))
  .alphaDecay(0.015);

// Kopplingar
const link = g.append("g").selectAll("line")
  .data(DATA.links).join("line")
  .attr("stroke", "rgba(255,255,255,0.06)")
  .attr("stroke-width", 0.5);

// Stjärnor
const node = g.append("g").selectAll(".star")
  .data(DATA.nodes).join("g").attr("class", "star")
  .call(d3.drag()
    .on("start", (e,d) => {{ if (!e.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; }})
    .on("drag",  (e,d) => {{ d.fx=e.x; d.fy=e.y; }})
    .on("end",   (e,d) => {{ if (!e.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }})
  )
  .on("click", (e,d) => {{ e.stopPropagation(); selectStar(d); }});

node.append("circle")
  .attr("r", d => starRadius(d))
  .attr("fill", d => starColor(d))
  .attr("filter", d => glowFilter(d))
  .style("cursor", "pointer");

// Labels — bara för hub + högre degree
node.append("text")
  .attr("dy", d => starRadius(d) + 11)
  .attr("text-anchor", "middle")
  .attr("fill", d => starColor(d, 0.8))
  .attr("font-size", d => d.category === "hub" ? "11px" : "9px")
  .style("pointer-events", "none")
  .style("text-shadow", "0 0 8px #000, 0 0 4px #000")
  .text(d => {{
    if (d.category === "hub" || d.degree >= 4 || d.recency > 0.8) {{
      return d.title.length > 22 ? d.title.slice(0,20) + "…" : d.title;
    }}
    return "";
  }});

sim.on("tick", () => {{
  link.attr("x1", d=>d.source.x).attr("y1", d=>d.source.y)
      .attr("x2", d=>d.target.x).attr("y2", d=>d.target.y);
  node.attr("transform", d=>`translate(${{d.x}},${{d.y}})`);
}});

// --- Interaktion ---
let orbitRing = null;

function selectStar(d) {{
  const hl = new Set([d.id, ...(adj[d.id]||[])]);

  // Orbit-ring
  if (orbitRing) orbitRing.remove();
  orbitRing = g.append("circle")
    .attr("cx", d.x).attr("cy", d.y)
    .attr("r", starRadius(d) + 18)
    .attr("fill", "none")
    .attr("stroke", starColor(d, 0.4))
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4 3");

  link.attr("stroke", l => {{
    const s = l.source.id||l.source, t = l.target.id||l.target;
    return hl.has(s)&&hl.has(t) ? starColor(d, 0.5) : "rgba(255,255,255,0.03)";
  }}).attr("stroke-width", l => {{
    const s = l.source.id||l.source, t = l.target.id||l.target;
    return hl.has(s)&&hl.has(t) ? 1 : 0.5;
  }});
  node.select("circle").attr("opacity", n => hl.has(n.id) ? 1 : 0.15);
  node.select("text").attr("opacity", n => hl.has(n.id) ? 1 : 0.05);

  const panel = document.getElementById("panel");
  panel.classList.add("open");
  document.getElementById("panel-title").textContent = d.title;
  document.getElementById("panel-title").style.color = starColor(d);
  document.getElementById("panel-cat").textContent = d.category;
  const pct = Math.round(d.recency * 100);
  document.getElementById("panel-recency").innerHTML =
    `<span style="color:${{starColor(d)}}">★</span> Aktualitet: ${{pct}}% (ljusare = nyare)`;
  document.getElementById("panel-path").textContent = d.path;

  const nbrs = adj[d.id]||[];
  document.getElementById("panel-links").innerHTML = nbrs.length
    ? `<h3>Kopplingar (${{nbrs.length}})</h3>` + nbrs.map(nid => {{
        const nd = DATA.nodes.find(n=>n.id===nid);
        return nd ? `<div class="plink" style="border-left-color:${{starColor(nd)}}" onclick="selectById('${{nid}}')">${{nd.title}}</div>` : "";
      }}).join("")
    : `<span style="font-size:10px;color:#374151">Inga kopplingar</span>`;
}}

function closePanel() {{
  if (orbitRing) {{ orbitRing.remove(); orbitRing=null; }}
  document.getElementById("panel").classList.remove("open");
  link.attr("stroke","rgba(255,255,255,0.06)").attr("stroke-width",0.5);
  node.select("circle").attr("opacity",1);
  node.select("text").attr("opacity",1);
}}

function selectById(id) {{
  const nd = DATA.nodes.find(n=>n.id===id);
  if (nd) selectStar(nd);
}}

svg.on("click", closePanel);

// --- Sök ---
document.getElementById("search").addEventListener("input", function() {{
  const q = this.value.toLowerCase().trim();
  node.select("circle").attr("opacity", d => !q || d.title.toLowerCase().includes(q) ? 1 : 0.08);
  node.select("text").attr("opacity", d => !q || d.title.toLowerCase().includes(q) ? 1 : 0.02);
  if (!q) link.attr("stroke","rgba(255,255,255,0.06)");
}});

window.addEventListener("resize", () =>
  sim.force("center", d3.forceCenter(W()/2,H()/2)).alpha(0.1).restart()
);

// --- Auto-reload via HEAD-polling (fungerar med python -m http.server) ---
let _lastMod = null;
async function pollForUpdates() {{
  try {{
    const res = await fetch(window.location.href, {{method:'HEAD', cache:'no-store'}});
    const lm  = res.headers.get('Last-Modified') || res.headers.get('ETag') || '';
    if (_lastMod === null) {{ _lastMod = lm; }}
    else if (lm !== _lastMod) {{ window.location.reload(); return; }}
    document.getElementById("live-dot").style.background = "#10b981";
    document.getElementById("live-text").textContent = "Live";
  }} catch(e) {{
    document.getElementById("live-dot").style.background = "#6b7280";
    document.getElementById("live-text").textContent = "Offline";
  }}
}}
pollForUpdates();
setInterval(pollForUpdates, 15000);
</script>
</body>
</html>"""

def main():
    print("Skannar vault...")
    nodes, edges = scan_vault()
    print(f"  {len(nodes)} stjärnor · {len(edges)} kopplingar")
    html = build_html(nodes, edges)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Klar → {OUTPUT}")

if __name__ == "__main__":
    main()
