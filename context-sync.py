#!/usr/bin/env python3
"""
context-sync.py — Genererar AIOS_BRAIN.md
Konsoliderar all memory, projekt, agenter och regler till en enda fil
som är tillgänglig lokalt och via GitHub (mobil, annan dator, OpenClaw, Hermes).
Kör automatiskt av brain-watch.py vid varje ändring. Ingen extern deps.
"""
import os, re, subprocess
from pathlib import Path
from datetime import datetime

# === SÖKVÄGAR ===
ROOT         = Path.home() / "ai_upscale_work"
MEMORY_DIR   = Path.home() / ".claude/projects/-Users-mikaelluengojohansson-ai-upscale-work/memory"
VAULT        = ROOT / "Obsidian-Vaults/AI-Upscale-Brain"
OUTPUT       = ROOT / "AIOS_BRAIN.md"
TMP_OUTPUT   = ROOT / ".AIOS_BRAIN.tmp"

# Filer som ALDRIG får in i AIOS_BRAIN.md (känsliga uppgifter)
SKIP_MEMORY  = {"credentials_supabase.md", "MEMORY.md"}
SKIP_SUFFIX  = {".bak", ".bak-n8n"}

def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""

def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4:].lstrip("\n")
    return text

def section(title: str, content: str) -> str:
    bar = "─" * 60
    return f"\n## {title}\n{bar}\n\n{content.strip()}\n"

def read_memory_files() -> str:
    parts = []
    if not MEMORY_DIR.exists():
        return "_(memory-mapp saknas)_"
    files = sorted(MEMORY_DIR.glob("*.md"))
    for f in files:
        # Skippa känsliga och backup-filer
        if f.name in SKIP_MEMORY:
            continue
        if any(f.name.endswith(s) for s in SKIP_SUFFIX):
            continue
        content = strip_frontmatter(read(f))
        if content.strip():
            parts.append(f"### [{f.stem}]\n{content.strip()}")
    return "\n\n".join(parts) if parts else "_(inga memory-filer)_"

def read_agents_registry() -> str:
    # Finns i vault 03-agents/ OCH i ai_upscale_work/
    paths = [
        VAULT / "03-agents/AGENTS_REGISTRY.md",
        ROOT / "AGENTS_REGISTRY.md",
    ]
    for p in paths:
        c = read(p)
        if c.strip():
            return c
    return "_(AGENTS_REGISTRY saknas)_"

def read_projects_registry() -> str:
    p = ROOT / "PROJECTS_REGISTRY.md"
    c = read(p)
    if c.strip():
        return c
    # Fallback: vault 04-projects/
    p2 = VAULT / "04-projects/PROJECTS_REGISTRY.md"
    c2 = read(p2)
    return c2 if c2.strip() else "_(PROJECTS_REGISTRY saknas)_"

def read_claude_identity() -> str:
    # Ta de viktigaste delarna av CLAUDE.md (identitet, drivers, nordstjärna)
    claude_md = Path.home() / ".claude/CLAUDE.md"
    text = read(claude_md)
    if not text:
        return "_(CLAUDE.md saknas)_"
    # Ta allt fram till "Kodregler" — innehåller identitet, drivers, principer, roller
    cut = text.find("## Kodregler")
    if cut > 0:
        return text[:cut].strip()
    return text[:3000].strip()

def git_commit_push():
    try:
        subprocess.run(["git", "-C", str(ROOT), "add", "AIOS_BRAIN.md"], check=True, capture_output=True)
        result = subprocess.run(
            ["git", "-C", str(ROOT), "commit", "-m",
             f"[auto] AIOS_BRAIN sync {datetime.now().strftime('%Y-%m-%d %H:%M')}"],
            capture_output=True, text=True
        )
        if result.returncode not in (0, 1):  # 1 = nothing to commit
            print(f"[sync] git commit: {result.stderr.strip()}", flush=True)
            return
        if "nothing to commit" not in result.stdout:
            push = subprocess.run(
                ["git", "-C", str(ROOT), "push", "origin", "main"],
                capture_output=True, text=True, timeout=30
            )
            if push.returncode == 0:
                print("[sync] GitHub push OK", flush=True)
            else:
                print(f"[sync] push FEL: {push.stderr.strip()}", flush=True)
    except Exception as e:
        print(f"[sync] git-fel: {e}", flush=True)

def generate():
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")

    header = f"""# AIOS_BRAIN — Mikael Luengo / AI Upscale Agency
> **Auto-genererad:** {ts}
> **Källa:** `context-sync.py` — ändra ALDRIG manuellt, ändringarna skrivs över
> **Tillgänglig:** Lokalt · GitHub (aiupscaleagency-max/ai-upscale-work) · Mobil · OpenClaw · Hermes

---
"""

    brain = header
    brain += section("IDENTITET, DRIVERS & NORDSTJÄRNA", read_claude_identity())
    brain += section("AKTIVA PROJEKT (PROJECTS_REGISTRY)", read_projects_registry())
    brain += section("MINNEN & KONTEXT (Memory)", read_memory_files())
    brain += section("AGENTER & SKILLS (AGENTS_REGISTRY)", read_agents_registry())

    # Atomisk skrivning: skriv till .tmp → rename (ingen risk för halv-fil)
    TMP_OUTPUT.write_text(brain, encoding="utf-8")
    TMP_OUTPUT.rename(OUTPUT)

    size_kb = OUTPUT.stat().st_size // 1024
    print(f"[sync] AIOS_BRAIN.md genererad ({size_kb} KB, {ts})", flush=True)

    git_commit_push()

if __name__ == "__main__":
    generate()
