#!/bin/sh
# Uppdaterar AI Upscale Knowledge Graph Dashboard.
# Dubbelklicka denna fil — den skannar om alla projekt och bygger om index.html.
cd "$(dirname "$0")"
python3 uppdatera.py
echo ""
echo "Klart. Tryck Enter för att stänga fönstret..."
read dummy
