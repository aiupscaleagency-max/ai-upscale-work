---
name: image-via-imagen
description: Genererar bilder via Google Imagen 3 API. Aktiveras när Mike säger "skapa bild av X", "generera bild", "rendera bild", "make image", eller liknande. Sparar PNG till disk och returnerar path. Använder GOOGLE_AI_API_KEY från environment.
---

# Image via Imagen 3 (Google AI Studio)

## När aktiveras
- "skapa bild av..."
- "generera bild..."
- "rendera bild..."
- "make image of..."
- "behöver en bild för..."

## Hur skill:en jobbar

1. **Tolka prompten:** Plocka ut visuell beskrivning. Lägg till stilbeskrivning om Mike inte angett en (default: "professional, cinematic, high detail").
2. **Anropa Imagen 3 API:**
   ```bash
   curl -s "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GOOGLE_AI_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{
       "instances": [{"prompt": "DIN_PROMPT_HÄR"}],
       "parameters": {"sampleCount": 1, "aspectRatio": "16:9"}
     }'
   ```
3. **Decode base64-respons** → spara som `/data/content/images/[timestamp]-[slug].png`
4. **Returnera till Mike:** sökväg + ev. skicka via Telegram som attachment

## Aspect ratios
- `1:1` — fyrkant, social
- `16:9` — wide, video/YouTube thumbnails
- `9:16` — portrait, Instagram/TikTok
- `4:3` — klassisk
- `3:4` — porträtt

## Default-stilar Mike föredrar
- **CEO with ADHD-kursen:** professional, soft lighting, modern minimalist, warm tones
- **ThyroidAI:** medical infographic, clean, trustworthy, vit/blå färgpalett
- **YouTube 4 Kids:** colorful cartoon, friendly, child-safe, no scary elements
- **AIOS landing:** futuristic tech, dark mode, neon accents, professional

## Output-format
```
✅ Bild genererad
📁 /data/content/images/2026-05-24-lobster-office.png
🎨 Style: professional cinematic
📐 Aspect: 16:9
```

## Rate-limits
- Gratis tier: ~10 bilder/min, 100/dag
- Vid rate-limit: vänta 60s, retry. Om fortsatt block, säg till Mike.

## Fel-hantering
- 400 → fixa prompten (för otydlig?)
- 429 → rate limit, vänta
- 403 → API-key fel, larma Mike
