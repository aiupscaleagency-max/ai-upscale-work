#!/bin/bash
# Uppdaterar Master Brain — kör efter nya leads, projekt eller sprints
cd "$(dirname "$0")/.."

echo "1/3 — Uppdaterar root-graf..."
graphify update .

echo "2/3 — Bygger om brain..."
cd _DASHBOARD && python3 build_brain.py

echo "3/3 — Öppnar brain..."
open brain-out/brain.html
