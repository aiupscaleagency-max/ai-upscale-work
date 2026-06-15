#!/usr/bin/env python3
"""
brain-watch.py — Vault-watcher
Kör brain-graph.py automatiskt när en .md-fil ändras i Obsidian vault.
Inga externa beroenden. Kör i bakgrunden.
Starta: python3 brain-watch.py &
Stoppa: kill $(cat brain-watch.pid)
"""
import os, time, subprocess, signal, sys
from pathlib import Path

VAULT       = Path.home() / "ai_upscale_work/Obsidian-Vaults/AI-Upscale-Brain"
GENERATOR   = Path.home() / "ai_upscale_work/brain-graph.py"
SKIP        = {"99-graphify-dump", ".obsidian", ".trash"}
PID_FILE    = Path.home() / "ai_upscale_work/brain-watch.pid"
POLL_SECS   = 5

def md_signature():
    sig = 0
    for md in VAULT.rglob("*.md"):
        if any(s in md.parts for s in SKIP):
            continue
        try:
            sig += int(md.stat().st_mtime * 1000)
        except Exception:
            pass
    return sig

def regenerate():
    print(f"[watch] Vault ändrad — genererar brain-graph.html ...", flush=True)
    result = subprocess.run(
        ["python3", str(GENERATOR)],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"[watch] Klar. {result.stdout.strip()}", flush=True)
    else:
        print(f"[watch] FEL: {result.stderr.strip()}", flush=True)

def cleanup(sig=None, frame=None):
    PID_FILE.unlink(missing_ok=True)
    print("\n[watch] Stoppad.", flush=True)
    sys.exit(0)

signal.signal(signal.SIGTERM, cleanup)
signal.signal(signal.SIGINT, cleanup)

PID_FILE.write_text(str(os.getpid()))
print(f"[watch] Startar. PID={os.getpid()} · Pollar var {POLL_SECS}s", flush=True)
print(f"[watch] Vault: {VAULT}", flush=True)
print(f"[watch] Stoppa: kill $(cat brain-watch.pid)", flush=True)

last = md_signature()
while True:
    time.sleep(POLL_SECS)
    current = md_signature()
    if current != last:
        last = current
        regenerate()
