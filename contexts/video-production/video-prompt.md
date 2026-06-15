# Video-prompt — script + repurposing (återanvändbar)

> **Vad detta är:** En färdig prompt du klistrar in (Claude/Gemini) för att gå från idé → färdigt kortvideo-script + 1 video → många inlägg. Löser den tvärgående video-flaskhalsen.
> **Godkänd av rådet:** "content-repurposer" — ETT script in → många format ut. Tjänar ThyroidAI nu, säljbar B2B-modul sen.
> **Drar context:** [[brand-voice]] (får ej låta som AI) + kanal-reglerna nedan.

---

## CONFIG (byt per projekt)

```yaml
projekt: "ThyroidAI"
ämne: "<t.ex. Varför AI-sköldkörtelvård hjälper när vården inte räcker till>"
mål: "Få tittaren att testa ThyroidAI (valfritt pris/mån)"
kanaler: [Facebook, TikTok, DM]      # B2C ThyroidAI = ALDRIG LinkedIn
språk: "svenska"                      # ThyroidAI intl = engelska
format: "kortform 45–90 sek, talat rakt in i kameran (telefon räcker)"
ton: "varm, direkt, personlig, ingen AI-känsla, ingen medicinsk pompositet"
```

> Kanal-regel (hård): **ThyroidAI = FB + TikTok + DM, aldrig LinkedIn.** B2B (Byggflow/Infrea/AF-SIUS/AIOS) = LinkedIn. Se [[brand-voice]].

---

## PROMPTEN (klistra in, fyll CONFIG ovan)

```
Du är en short-form video-strateg för {{projekt}}. Skriv content om: {{ämne}}.
Mål: {{mål}}. Kanaler: {{kanaler}}. Språk: {{språk}}. Ton: {{ton}}. Format: {{format}}.

Det FÅR INTE låta som AI. Förbjudet: klyschor, "i dagens värld", "låt oss dyka in",
uppradade adjektiv, robotton. Korta meningar. En människa som pratar med en människa.

Leverera EXAKT detta, i ordning:

1) HOOK × 3 — tre olika första-meningar (0–3 sek) som stoppar scroll. Konkreta, inte clickbait.

2) SCRIPT — {{format}}, talspråk, ord för ord som det ska sägas. Struktur:
   hook → problemet tittaren känner → vad {{projekt}} gör → ett konkret exempel → CTA.
   Markera [paus] och [visa på skärmen: ...] där det hjälper.

3) SHOTLIST / REMOTION-scener — 4–7 scener: vad som visas + on-screen text per scen,
   så det går att spela in på telefon ELLER rendera i Remotion.

4) REPURPOSING — av samma material:
   - 3 Facebook-inlägg (olika vinklar, varje med egen hook + CTA till {{projekt}})
   - 3 TikTok-captions (korta, native, med 3–5 relevanta hashtags var)
   - 1 DM-opener att skicka till folk i relevanta grupper (mjuk, inte säljig)

5) CTA-VARIANTER — 3 olika avslut anpassade per kanal (aldrig LinkedIn för ThyroidAI).

Håll allt på {{språk}}. Ingen preamble — börja direkt med "1) HOOK".
```

---

## EFTER GENERERING (workflow)
1. Välj bästa hook → spela in på **telefon idag** (rådets #1: crap-but-shipped > perfect-but-queued).
2. Posta i {{kanaler}}. För ThyroidAI: 3 thyroid-FB-grupper + TikTok.
3. Spara transkriptet → mata in i samma prompt nästa gång för fler format.
4. Vill du ha det renderat snyggt: kör shotlisten genom `remotion`-skillen.

---

## ÅTERANVÄNDNING
Byt `CONFIG` → samma prompt funkar för CEO-with-ADHD, YouTube-4-Kids, Fluentic, eller B2B (då med LinkedIn-kanal). Det är därför den bor i `contexts/` och inte i ett enskilt projekt.
