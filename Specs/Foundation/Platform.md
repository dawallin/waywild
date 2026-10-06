# Teknik och publicering

Status: accepterad för första implementationsfasen, 2026-10-06.

## Teknikval

| Del | Verktyg | Ansvar |
| --- | --- | --- |
| Språk | TypeScript | Modell, runtime och tester |
| Utveckling och bygge | Vite | Lokal server och statisk produktionsbyggnad |
| 3D | Three.js med WebGLRenderer | Terräng, ljus, dimma och förstapersonskamera |
| 2D | Canvas 2D | Karta och spelarens position/riktning |
| Gränssnitt | HTML och CSS | Paneler och kontroller |
| Logiktester | Vitest | Unit- och integrationstester |
| Webbläsartester | Playwright | Input, start och synkronisering |
| Hosting | GitHub Pages | Statiska filer byggda i `dist/` |

Första versionen använder egna enkla rörelse- och kollisionsregler.
Spelaren representeras som en cirkel i markplanet, med en kamera i ögonhöjd.
React och en fysikmotor ingår inte i första fasen. Beroendeversioner och
en stödd Node LTS-version väljs och låses vid scaffolding, med samma Node-version lokalt och i CI.

All världsgenerering körs i besökarens webbläsare. Den första appen behöver
ingen backend. iPhone 13 är ett prestandamål från konceptet, inte ännu
verifierad kompatibilitet eller ett fastställt prestandakrav.

## GitHub Pages

Repository: `https://github.com/dawallin/waywild`.

För projektets standardhosting används Vite-bas `/waywild/`.
Förväntad standardadress är `https://dawallin.github.io/waywild/`.
Den verkliga Pages-adressen och eventuell ärvd egen domän kontrolleras vid installation.
Alla resurssökvägar måste respektera den konfigurerade basen.

Välj **GitHub Actions** som publiceringskälla i repoets Pages-inställningar.
Workflow under `.github/workflows/` ska:

1. Starta vid push till `main`, samt tillåta manuell körning.
2. Hämta koden och installera låsta beroenden med `npm ci`.
3. Installera webbläsare för de Playwright-tester som används.
4. Köra projektets verifiering.
5. Köra produktionsbygget.
6. Ladda upp `dist/` som Pages-artifact.
7. Deploya först efter lyckad verifiering och byggnad.

Deployment använder GitHub Actions inbyggda token och Pages-behörigheter.
En personlig PAT ska inte läggas i appen eller behövas för Pages-workflow.
Repoåtkomst för lokala Git-operationer hanteras separat av Git-credentials.

Testscenarier kan väljas med query-parametrar så att direktlänkar fungerar
på statisk hosting utan serverbaserad routing.

## Referenser

- [Three.js: skapa en scen](https://threejs.org/manual/pages/creating-a-scene.html)
- [Vite: statisk deployment och GitHub Pages](https://vite.dev/guide/static-deploy.html)
- [Vitest](https://vitest.dev/guide/)
- [Playwright](https://playwright.dev/docs/intro)

Arbetsflödet utgår också från den lokala referensen `../pearls`, särskilt
dess `Specs/Foundation/DevelopmentLoop.md`, `vite.config.ts` och
`.github/workflows/deploy-pages.yml`. Waywild har egna grafik- och spelregler.
