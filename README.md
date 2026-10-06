# Waywild

En seed-baserad naturvärld där landskapet döljer en matematisk labyrint.
Spelaren utforskar världen i förstaperson med fri gång.

Första webbskalet är implementerat. Karta och förstapersonsvy är ännu platshållare.

## Dokument

- [Ursprungligt koncept](waywild-koncept.md)
- [Specifikationer och beslut](Specs/README.md)
- [Arkitektur](Specs/Foundation/Architecture.md)
- [Teknik och publicering](Specs/Foundation/Platform.md)
- [Arbetsflöde och tester](Specs/Foundation/DevelopmentLoop.md)
- [Första experimentet: delad vy och rak dal](Specs/Features/SplitViewStraightValley.md)

Konceptet beskriver visionen och möjliga framtida funktioner. Accepterade
specifikationer definierar vad vi faktiskt ska bygga i respektive steg.

## Köra lokalt

Använd Node 24 (`nvm use` om du använder nvm).

```bash
npm ci
npm run dev
```

Öppna adressen som Vite skriver ut, normalt http://127.0.0.1:5173/.

## Verifiering

```bash
npx playwright install chromium
npm run test:all
npm run build
```

Kontrollera också Pages-sökvägen:

```bash
GITHUB_PAGES=true npm run test:all
```

`npm run preview` visar det senaste produktionsbygget lokalt.
`test:fast` kör tills vidare typkontroll. Modelltester tillkommer med modellen.

## Publicering

Välj GitHub Actions under repoets Settings → Pages. Workflow verifierar
och publicerar `dist/` vid push till `main`. Pull requests verifieras också,
men publiceras inte. Förväntad projektväg är `/waywild/`.
