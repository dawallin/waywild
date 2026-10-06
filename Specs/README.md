# Specifikationer

Beslut dokumenterade 2026-10-06.

## Struktur

- `Foundation/`: gemensam arkitektur, plattform och arbetsflöde.
- `Features/`: avgränsade beteenden med acceptanskriterier och testmål.

Varje funktionsspecifikation beskriver omfattning, beteende, tester och
öppna frågor. Öppna frågor ska lösas innan den berörda delen implementeras.
Förslag blir beslut när de har accepterats i diskussionen med användaren.

## Accepterade specifikationer

- [Architecture](Foundation/Architecture.md)
- [Platform](Foundation/Platform.md)
- [DevelopmentLoop](Foundation/DevelopmentLoop.md)
- [WebShell](Features/WebShell.md)
- [SplitViewStraightValley](Features/SplitViewStraightValley.md)
- [MapSelection](Features/MapSelection.md)
- [SeededMountains](Features/SeededMountains.md)

## Ordning för första utvecklingsstegen

1. Webbskal, testverktyg och GitHub Pages-flöde.
2. Fast rak 3×3-karta, delad vy och fri gång.
3. Böjd dalgång som ett eget scenario och en egen specifikation.
4. Terrängvariation med skyddad framkomlighet.
5. Seed-baserad generering och fler typer av hinder.

Det första funktionssteget använder en fast karta. Seed-baserad generering,
chunks och en stor värld tillhör senare steg och behöver egna specifikationer.
