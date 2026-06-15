# -*- coding: utf-8 -*-
"""
build_brain.py — Master Brain för AI Upscale Agency
Kör: python3 build_brain.py
Output: brain-out/brain.html
"""
import json, pathlib, math, re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
OUT  = HERE / "brain-out"
OUT.mkdir(exist_ok=True)

# ── Explicit projektlista med rätt sökväg, namn, kategori, färg ─────
# (path relativt ROOT, visningsnamn, kategori, hex-färg)
PROJECTS = [
    # === MIKES DOTTERBOLAG ===
    ("Customer_Projects/ThyroidAI : Läkarteamet", "ThyroidAI Clinic",      "Dotterbolag", "#3fb950"),
    ("Customer_Projects/CEO with ADHD",            "CEO with ADHD (kurs)",  "Dotterbolag", "#3fb950"),
    ("Customer_Projects/CEO with ADHD/ceo-with-adhd", "CEO with ADHD (app)","Dotterbolag", "#3fb950"),
    ("Customer_Projects/ByggFlow",                 "ByggFlow",              "Dotterbolag", "#3fb950"),
    ("Customer_Projects/Infrea-Insight",           "Infrea-Insight",        "Dotterbolag", "#3fb950"),
    ("fluentic-ai",                                "Fluentic AI",           "Dotterbolag", "#3fb950"),
    # === MIKE ÄGER / SÄLJER ===
    ("Customer_Projects/Af-SIUS",                  "AF-SIUS",               "Mike äger",   "#58a6ff"),
    # === KUNDER ===
    ("Customer_Projects/ze-parts",                 "Ze-Parts",              "Kund",        "#e3a008"),
    ("Customer_Projects/mikael-trading-os",        "Trading OS",            "Kund",        "#e3a008"),
    # === AIOS PLATTFORM ===
    ("AIOS_Core",                                  "AIOS Core",             "Plattform",   "#a371f7"),
    ("AIOS_Core_landing",                          "AIOS Landing",          "Plattform",   "#a371f7"),
    ("aiupscale-monitor/the-engine",               "The Engine",            "Plattform",   "#a371f7"),
    ("aiupscale-monitor",                          "AIOS Monitor",          "Plattform",   "#a371f7"),
    ("Customer_Projects/Graphify- Mall-AI-OS",     "Graphify Mall-AI-OS",   "Plattform",   "#a371f7"),
    ("Customer_Projects/Paperclips Orchestration System", "OpenClaw/Paperclip", "Plattform", "#a371f7"),
    ("paperclip",                                  "Paperclip (lokal)",     "Plattform",   "#a371f7"),
    # === ROOT (skills, agents, CLAUDE.md) ===
    ("",                                           "ai_upscale_work (root)","Plattform",   "#a371f7"),
    # === ÖVRIGT ===
    ("caso-chile-dashboard",                       "Caso Chile",            "Övrigt",      "#8b949e"),
]

# Kors-kopplingar (visas som extra kanter mellan projekt-noder)
CROSS_LINKS = [
    ("CEO with ADHD (kurs)",   "CEO with ADHD (app)",   "same_product"),
    ("ThyroidAI Clinic",       "CEO with ADHD (kurs)",  "same_owner"),
    ("ThyroidAI Clinic",       "Fluentic AI",           "same_owner"),
    ("ByggFlow",               "Infrea-Insight",        "same_product"),
    ("AIOS Core",              "ByggFlow",              "built_on"),
    ("AIOS Core",              "Infrea-Insight",        "built_on"),
    ("AIOS Core",              "AF-SIUS",               "built_on"),
    ("AIOS Core",              "Ze-Parts",              "built_on"),
    ("AIOS Core",              "Trading OS",            "built_on"),
    ("The Engine",             "AIOS Monitor",          "same_repo"),
    ("OpenClaw/Paperclip",     "The Engine",            "runtime"),
    ("ai_upscale_work (root)", "ThyroidAI Clinic",      "contains"),
    ("ai_upscale_work (root)", "AIOS Core",             "contains"),
    ("ai_upscale_work (root)", "AF-SIUS",               "contains"),
]

CAT_COLORS = {
    "Dotterbolag": "#3fb950",
    "Mike äger":   "#58a6ff",
    "Kund":        "#e3a008",
    "Plattform":   "#a371f7",
    "Övrigt":      "#8b949e",
}

# ── Bygg noder och kanter ────────────────────────────────────────────
all_nodes = []
all_links = []
seen_ids  = set()
proj_node_ids = {}   # display_name → node_id

# Central hub
HUB = "__hub__"
all_nodes.append({"id": HUB, "label": "AI Upscale Agency",
                  "type": "hub", "group": "HUB", "color": "#ffffff", "size": 30})
seen_ids.add(HUB)

# Kategori-noder (mellanring)
cat_ids = {}
for cat, col in CAT_COLORS.items():
    cid = f"__cat_{re.sub(r'[^a-z0-9]','_',cat.lower())}"
    all_nodes.append({"id": cid, "label": cat, "type": "category",
                      "group": cat, "color": col, "size": 17})
    all_links.append({"source": HUB, "target": cid, "w": 3.0, "rel": "category"})
    cat_ids[cat] = cid
    seen_ids.add(cid)

# Ladda varje projekt
loaded = 0
for rel_path, display_name, cat, color in PROJECTS:
    gj = ROOT / rel_path / "graphify-out" / "graph.json" if rel_path else ROOT / "graphify-out" / "graph.json"
    prefix = re.sub(r"[^a-z0-9]", "_", display_name.lower())[:20]
    phub   = f"{prefix}__p"

    # Projekt-nod skapas alltid
    all_nodes.append({"id": phub, "label": display_name, "type": "project",
                      "group": cat, "color": color, "size": 14})
    seen_ids.add(phub)
    proj_node_ids[display_name] = phub
    all_links.append({"source": cat_ids[cat], "target": phub, "w": 2.0, "rel": "contains"})

    if not gj.exists():
        print(f"  ⚠  {display_name}: ingen graph.json ({gj})")
        continue

    try:
        raw = json.loads(gj.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"  ⚠  {display_name}: {e}"); continue

    raw_nodes = raw.get("nodes", [])
    raw_links = raw.get("links", raw.get("edges", []))
    if not raw_nodes:
        print(f"  skip {display_name}: tom graf"); continue

    # Top 80 noder
    ranked  = sorted(raw_nodes, key=lambda n: n.get("degree", 0), reverse=True)[:80]
    kept    = {n["id"] for n in ranked}
    id_map  = {}

    for n in ranked:
        nid = f"{prefix}__{re.sub(r'[^a-z0-9]','_',n['id'])[:30]}"
        if nid in seen_ids: nid += "_x"
        id_map[n["id"]] = nid
        seen_ids.add(nid)
        deg = n.get("degree", 0)
        all_nodes.append({
            "id": nid, "label": n.get("label", n["id"])[:45],
            "type": "node", "group": cat, "color": color,
            "size": max(3, min(10, 3 + math.sqrt(deg) * 1.4)),
            "proj": display_name, "src": n.get("source_file", "")
        })

    # Projekt → top-5 god nodes
    for n in ranked[:5]:
        all_links.append({"source": phub, "target": id_map[n["id"]], "w": 1.8, "rel": "god_node"})

    # Interna kanter (max 180)
    lc = 0
    for lnk in raw_links:
        if lc >= 180: break
        s = lnk.get("source") or lnk.get("from", "")
        t = lnk.get("target") or lnk.get("to", "")
        if isinstance(s, dict): s = s.get("id", "")
        if isinstance(t, dict): t = t.get("id", "")
        if s in kept and t in kept and s in id_map and t in id_map:
            all_links.append({"source": id_map[s], "target": id_map[t],
                              "w": float(lnk.get("weight", lnk.get("confidence_score", 0.4))),
                              "rel": lnk.get("relation", "ref")})
            lc += 1

    loaded += 1
    print(f"  ✅ {display_name}: {len(ranked)} noder, {lc} kanter")

# Kors-kopplingar mellan projekt
for src_name, tgt_name, rel in CROSS_LINKS:
    s = proj_node_ids.get(src_name)
    t = proj_node_ids.get(tgt_name)
    if s and t:
        all_links.append({"source": s, "target": t, "w": 2.5, "rel": rel, "cross": True})

print(f"\nTotalt: {len(all_nodes)} noder, {len(all_links)} kanter ({loaded} projekt med data)")

# ── Spara JSON ─────────────────────────────────────────────────────
(OUT / "brain.json").write_text(
    json.dumps({"nodes": all_nodes, "links": all_links}, ensure_ascii=False, indent=2),
    encoding="utf-8")

# ── Bygg HTML ──────────────────────────────────────────────────────
n_n = len(all_nodes); n_l = len(all_links); today = __import__("datetime").date.today().isoformat()
nodes_js = json.dumps(all_nodes, ensure_ascii=False)
links_js = json.dumps(all_links, ensure_ascii=False)
cat_js   = json.dumps(CAT_COLORS, ensure_ascii=False)

html = f"""<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Upscale — Master Brain</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#080b10;color:#e6edf3;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden}}
#bar{{position:fixed;top:0;left:0;right:0;z-index:30;background:rgba(8,11,16,.9);
  backdrop-filter:blur(10px);border-bottom:1px solid #1a2030;padding:9px 16px;
  display:flex;align-items:center;gap:12px;flex-wrap:wrap}}
h1{{font-size:14px;font-weight:700}} h1 em{{color:#6e7681;font-style:normal;font-weight:400}}
.st{{font-size:11px;color:#6e7681}} .st b{{color:#c9d1d9}}
#srch{{background:#0d1117;border:1px solid #21262d;color:#e6edf3;padding:5px 10px;
  border-radius:6px;font-size:12px;width:160px;outline:none;margin-left:auto}}
#srch:focus{{border-color:#58a6ff}}
.pill{{background:#0d1117;border:1px solid #21262d;color:#8b949e;padding:3px 9px;
  border-radius:11px;font-size:11px;cursor:pointer;user-select:none;
  display:flex;align-items:center;gap:4px;white-space:nowrap}}
.pill.on{{color:#e6edf3;border-color:currentColor}}
.dot{{width:6px;height:6px;border-radius:50%;flex-shrink:0}}
svg{{position:fixed;top:0;left:0;width:100vw;height:100vh}}
.lbl{{pointer-events:none;font-size:9.5px;fill:#4a5568}}
.lbl.proj{{font-size:11.5px;fill:#c9d1d9;font-weight:600}}
.lbl.cat{{font-size:13px;fill:#e6edf3;font-weight:700}}
.lbl.hub{{font-size:16px;fill:#fff;font-weight:800}}
#panel{{position:fixed;right:16px;bottom:16px;background:#0d1117;border:1px solid #21262d;
  border-radius:10px;padding:13px 15px;min-width:210px;max-width:270px;font-size:12px;
  opacity:0;transition:opacity .15s;pointer-events:none;z-index:50}}
#panel strong{{display:block;font-size:13px;margin-bottom:4px;color:#e6edf3}}
#panel .m{{color:#8b949e;font-size:11px;line-height:1.7;margin-top:3px}}
#hint{{position:fixed;left:16px;bottom:12px;color:#2a3240;font-size:10px;z-index:5}}
</style>
</head>
<body>
<div id="bar">
  <h1>AI Upscale <em>— Master Brain</em></h1>
  <div class="st">Noder <b>{n_n}</b></div>
  <div class="st">Kopplingar <b>{n_l}</b></div>
  <div class="st">{today}</div>
  <input id="srch" placeholder="Sök nod...">
  <span class="pill on" data-g="all"><span class="dot" style="background:#e6edf3"></span>Alla</span>
</div>
<svg id="cv"></svg>
<div id="panel"></div>
<div id="hint">Scroll zoomar · Drag flyttar · Klick = info · Dubbelklick = lås</div>
<script>
const NODES={nodes_js};
const LINKS={links_js};
const CATC={cat_js};

// Pills
const bar=document.getElementById("bar");
Object.entries(CATC).forEach(([c,col])=>{{
  const p=document.createElement("span");
  p.className="pill on";p.dataset.g=c;
  p.innerHTML=`<span class="dot" style="background:${{col}}"></span>${{c}}`;
  bar.appendChild(p);
}});

const W=window.innerWidth,H=window.innerHeight;
const svg=d3.select("#cv");
const root=svg.append("g");
svg.call(d3.zoom().scaleExtent([0.02,15]).on("zoom",e=>root.attr("transform",e.transform)));

const sim=d3.forceSimulation(NODES)
  .force("link",d3.forceLink(LINKS).id(d=>d.id)
    .distance(l=>{{
      const st=typeof l.source==="object"?l.source.type:"";
      const cr=l.cross;
      if(st==="hub") return 100;
      if(st==="category") return 65;
      if(cr) return 55;
      if(st==="project") return 42;
      return 16;
    }})
    .strength(l=>{{
      const st=typeof l.source==="object"?l.source.type:"";
      if(st==="hub") return 1.0;
      if(st==="category") return 0.9;
      if(l.cross) return 0.7;
      if(st==="project") return 0.65;
      return 0.3;
    }}))
  .force("charge",d3.forceManyBody().strength(d=>{{
    if(d.type==="hub") return -4000;
    if(d.type==="category") return -900;
    if(d.type==="project") return -280;
    return -25;
  }}))
  .force("center",d3.forceCenter(W/2,H/2).strength(0.1))
  .force("x",d3.forceX(W/2).strength(0.05))
  .force("y",d3.forceY(H/2).strength(0.05))
  .force("collide",d3.forceCollide(d=>(d.size||4)+3).strength(0.7))
  .alphaDecay(0.010).velocityDecay(0.42);

// Defs: glow
const defs=svg.append("defs");
[["gh",14],["gc",7],["gp",4]].forEach(([id,blur])=>{{
  const f=defs.append("filter").attr("id",id);
  f.append("feGaussianBlur").attr("stdDeviation",blur).attr("result","b");
  const m=f.append("feMerge");
  m.append("feMergeNode").attr("in","b");
  m.append("feMergeNode").attr("in","SourceGraphic");
}});

// Kanter
const lsel=root.append("g").selectAll("line").data(LINKS).join("line")
  .attr("stroke",l=>{{
    const s=typeof l.source==="object"?l.source:{{type:"",color:""}};
    if(l.cross) return s.color?s.color+"99":"#555";
    if(s.type==="hub") return "#1e3a5f";
    if(s.type==="category") return (s.color||"#333")+"88";
    if(s.type==="project") return (s.color||"#333")+"55";
    return (s.color||"#222")+"33";
  }})
  .attr("stroke-width",l=>{{
    const s=typeof l.source==="object"?l.source:{{type:""}};
    if(l.cross) return 1.2;
    if(s.type==="hub") return 1.5;
    if(s.type==="category") return 1.1;
    if(s.type==="project") return 0.9;
    return 0.35;
  }})
  .attr("stroke-dasharray",l=>l.cross?"4,3":null)
  .attr("stroke-opacity",l=>{{
    const s=typeof l.source==="object"?l.source:{{type:""}};
    if(l.cross) return 0.7;
    if(s.type==="hub"||s.type==="category") return 0.85;
    if(s.type==="project") return 0.55;
    return 0.25;
  }});

// Noder
const nsel=root.append("g").selectAll("g").data(NODES).join("g")
  .style("cursor","pointer")
  .call(d3.drag()
    .on("start",(e,d)=>{{if(!e.active)sim.alphaTarget(.2).restart();d.fx=d.x;d.fy=d.y}})
    .on("drag",(e,d)=>{{d.fx=e.x;d.fy=e.y}})
    .on("end",(e,d)=>{{if(!e.active)sim.alphaTarget(0);if(!d._lock){{d.fx=null;d.fy=null}}}}));

nsel.append("circle")
  .attr("r",d=>d.size||5)
  .attr("fill",d=>d.color||"#444")
  .attr("fill-opacity",d=>d.type==="hub"?1:d.type==="category"?.9:d.type==="project"?.8:.6)
  .attr("stroke",d=>d.type==="hub"?"#fff":d.type==="category"||d.type==="project"?d.color:"none")
  .attr("stroke-width",d=>d.type==="hub"?2.5:d.type==="category"?1.5:d.type==="project"?1.5:0)
  .attr("stroke-opacity",d=>d.type==="hub"?.9:.5)
  .attr("filter",d=>d.type==="hub"?"url(#gh)":d.type==="category"?"url(#gc)":d.type==="project"?"url(#gp)":null);

nsel.append("text")
  .attr("class",d=>"lbl"+(d.type==="hub"?" hub":d.type==="category"?" cat":d.type==="project"?" proj":""))
  .attr("text-anchor","middle")
  .attr("dy",d=>-((d.size||5)+5))
  .text(d=>d.type==="hub"||d.type==="category"||d.type==="project"?d.label:"");

sim.on("tick",()=>{{
  lsel.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
      .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
  nsel.attr("transform",d=>`translate(${{d.x}},${{d.y}})`);
}});

// Panel
const panel=document.getElementById("panel");
nsel.on("click",(e,d)=>{{
  panel.innerHTML=`<strong>${{d.label}}</strong>`
    +`<div class="m">Typ: ${{d.type}}</div>`
    +(d.group?`<div class="m">Kategori: ${{d.group}}</div>`:"")
    +(d.proj?`<div class="m">Projekt: ${{d.proj}}</div>`:"")
    +(d.src?`<div class="m">Fil: ${{d.src}}</div>`:"");
  panel.style.opacity=1;
  e.stopPropagation();
}});
svg.on("click",()=>panel.style.opacity=0);
nsel.on("dblclick",(e,d)=>{{
  d._lock=!d._lock;
  if(d._lock){{d.fx=d.x;d.fy=d.y}}else{{d.fx=null;d.fy=null}}
}});

// Sök
document.getElementById("srch").addEventListener("input",function(){{
  const q=this.value.toLowerCase().trim();
  if(!q){{nsel.style("opacity",1);lsel.style("opacity",null);return}}
  const m=new Set(NODES.filter(n=>n.label.toLowerCase().includes(q)).map(n=>n.id));
  nsel.style("opacity",d=>m.has(d.id)?1:0.05);
  lsel.style("opacity",l=>{{
    const s=typeof l.source==="object"?l.source.id:l.source;
    const t=typeof l.target==="object"?l.target.id:l.target;
    return m.has(s)||m.has(t)?0.8:0.02;
  }});
}});

// Filter
document.addEventListener("click",e=>{{
  const p=e.target.closest(".pill"); if(!p) return;
  const g=p.dataset.g;
  if(g==="all"){{const on=[...document.querySelectorAll(".pill")].every(x=>x.classList.contains("on"));
    document.querySelectorAll(".pill").forEach(x=>x.classList.toggle("on",!on));}}
  else p.classList.toggle("on");
  const act=new Set([...document.querySelectorAll(".pill.on")].map(x=>x.dataset.g));
  const all=act.has("all");
  nsel.style("opacity",d=>d.type==="hub"?1:all||act.has(d.group)?1:0.04);
}});

window.addEventListener("resize",()=>{{
  sim.force("center",d3.forceCenter(window.innerWidth/2,window.innerHeight/2));
  sim.alpha(0.1).restart();
}});
</script>
</body>
</html>"""

out_html = OUT / "brain.html"
out_html.write_text(html, encoding="utf-8")
print(f"\n✅  {out_html}")
print(f"    VS Code Simple Browser: file://{out_html}")
