#!/usr/bin/env python3
"""
brain-watch.py — Vault + Memory-watcher
Kör brain-graph.py + context-sync.py automatiskt när en .md-fil ändras.
Pushar AIOS_BRAIN.md till GitHub så det är tillgängligt från mobil/Hermes/OpenClaw.
Inga externa beroenden. Kör i bakgrunden.
Starta: python3 brain-watch.py &
Stoppa: kill $(cat brain-watch.pid)
"""
import os, time, subprocess, signal, sys
from pathlib import Path

ROOT        = Path.home() / "ai_upscale_work"
VAULT       = ROOT / "Obsidian-Vaults/AI-Upscale-Brain"
GENERATOR   = ROOT / "brain-graph.py"
CONTEXT     = ROOT / "context-sync.py"
SKIP        = {"99-graphify-dump", ".obsidian", ".trash", "08-memory-backup"}
PID_FILE    = ROOT / "brain-watch.pid"
POLL_SECS   = 5

# macOS missar ibland symlink-ändringar — bevaka Claude memory direkt som backup
EXTRA_DIRS = [
    Path.home() / ".claude/projects/-Users-mikaelluengojohansson-ai-upscale-work/memory",
]

def md_signature():
    sig = 0
    seen = set()
    for base in [VAULT] + EXTRA_DIRS:
        for md in base.rglob("*.md"):
            real = md.resolve()
            if real in seen:
                continue
            seen.add(real)
            if any(s in md.parts for s in SKIP):
                continue
            try:
                sig += int(md.stat().st_mtime * 1000)
            except Exception:
                pass
    return sig

def regenerate():
    print("[watch] Ändring detekterad — uppdaterar brain + context ...", flush=True)

    # Steg 1: Memory Galaxy (brain-graph.html)
    r1 = subprocess.run(["python3", str(GENERATOR)], capture_output=True, text=True)
    if r1.returncode == 0:
        print(f"[watch] brain-graph OK", flush=True)
    else:
        print(f"[watch] brain-graph FEL: {r1.stderr.strip()}", flush=True)

    # Steg 2: AIOS_BRAIN.md + GitHub push
    r2 = subprocess.run(["python3", str(CONTEXT)], capture_output=True, text=True)
    if r2.returncode == 0:
        print(f"[watch] context-sync OK: {r2.stdout.strip()}", flush=True)
    else:
        print(f"[watch] context-sync FEL: {r2.stderr.strip()}", flush=True)

def cleanup(sig=None, frame=None):
    PID_FILE.unlink(missing_ok=True)
    print("\n[watch] Stoppad.", flush=True)
    sys.exit(0)

signal.signal(signal.SIGTERM, cleanup)
signal.signal(signal.SIGINT, cleanup)

PID_FILE.write_text(str(os.getpid()))
print(f"[watch] Startar. PID={os.getpid()} · Pollar var {POLL_SECS}s", flush=True)
print(f"[watch] Vault: {VAULT}", flush=True)
print(f"[watch] Extra: {[str(d) for d in EXTRA_DIRS]}", flush=True)
print(f"[watch] Stoppa: kill $(cat brain-watch.pid)", flush=True)

last = md_signature()
while True:
    time.sleep(POLL_SECS)
    current = md_signature()
    if current != last:
        last = current
        regenerate()
