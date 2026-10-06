# Arbetsflöde och tester

Status: accepterad, 2026-10-06.

## Ett steg i taget

1. **Diskutera:** klargör upplevelse, regler och öppna frågor.
2. **Definiera:** dokumentera ett litet steg med omfattning och acceptanskriterier.
3. **Utveckla:** implementera det överenskomna steget när implementation beställts.
4. **Verifiera:** kör avgränsade tester och granska den synliga upplevelsen.
5. **Publicera:** publicera det färdiga steget enligt överenskommelse; CI verifierar före deployment.

Dokumentera skillnaden mellan vision, accepterat beteende och framtida förslag.
Ändra inte omfattning eller teknikval tyst under implementationen.

## Tester av en sak i taget

- Unit-tester bevisar en regel i modellen, exempelvis att en blockerad kant stoppar rörelse.
- Integrationstester bevisar samspel, exempelvis att kartan och terrängens framkomlighet överensstämmer.
- Webbläsartester bevisar en användarhandling, exempelvis att input flyttar spelaren och uppdaterar båda vyerna.

Varje test ska ha ett tydligt påstående, en liten kontrollerad värld och
reproducerbara indata. Dela upp olika beteenden i olika tester även om de
använder samma scenario. Välj den billigaste testnivån som bevisar beteendet;
varje ändring behöver inte ett test på samtliga nivåer.

Små scenarier ska gå att öppna för visuell granskning. Automatiska
tillståndstester bevisar inte ensamma att terrängen ser naturlig ut eller
att förstapersonsrörelsen känns bra. Sådana egenskaper granskas visuellt
och på faktisk målhårdvara när de blir aktuella.

## Planerade kommandon

När projektet scaffoldas ska samma kommandon användas lokalt och i CI:

- `npm run dev`: lokal utveckling.
- `npm run typecheck`: TypeScript-kontroll.
- `npm run test:unit`: modellens regler.
- `npm run test:integration`: samspel mellan moduler.
- `npm run test:behavior`: Playwright.
- `npm run test:fast`: typkontroll, unit- och integrationstester.
- `npm run test:all`: hela verifieringen inklusive webbläsartester.
- `npm run build`: produktionsbyggnad till `dist/`.

Webbskalet implementerar dev, preview, build, typecheck och behavior-tester.
`test:fast` kör tills vidare typkontroll och `test:all` även behavior-tester.
Unit- och integrationskommandon införs när motsvarande modelltester finns. Inför bara testsuiter som har
verkliga tester; justera kommandokedjan uttryckligen när nästa testnivå tillkommer.

Verifiera det berörda beteendet först. Inför publicering ska den aktuella
hela verifieringen och produktionsbygget lyckas. Kontrollera även att den
publicerade appen och dess resurser laddas under rätt Pages-sökväg.
