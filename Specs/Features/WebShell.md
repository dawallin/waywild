# Webbskal och utvecklingsgrund

Status: implementation beställd 2026-10-06.

Första steget etablerar Vite, TypeScript, lokal körning och GitHub Pages-workflow.
Webbskalet visar två namngivna paneler: karta till vänster och förstaperson till höger.
Panelerna är platshållare; detta steg inkluderar inte terräng, kamera eller rörelse.

## Acceptanskriterier

- Appen kan köras med `npm run dev` och byggas till `dist/`.
- Båda panelerna visas även på smal skärm.
- Produktionsbygget laddar JavaScript och CSS under `/waywild/`.
- Webbläsartester testar panelerna separat och upptäcker laddningsfel.
- CI verifierar före Pages-deployment från `main`; pull requests verifieras utan deployment.

Three.js och Vitest installeras när grafik respektive modelltester införs.
`test:fast` är tills vidare typkontroll; `test:all` lägger till webbläsartester.
Inga tomma unit- eller integrationstestsviter införs.
