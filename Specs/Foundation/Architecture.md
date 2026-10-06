# Arkitektur

Status: accepterad riktning, 2026-10-06.

## Världens lager

1. **Topologi:** en 2D-karta eller graf bestämmer vilka områden som är sammanbundna.
2. **Terräng och hinder:** topologin formas till dalar, berg och andra naturliga eller byggda hinder.
3. **Spelare:** position, riktning och regler för fri gång i förstaperson.
4. **Presentation:** kartvy och förstapersonsvy visar samma modell.

```text
Karta + inställningar + seed när generering införs
                     ↓
                Världsmodell ← rörelsekommandon
                     ↓
                ┌────┴────┐
             2D-karta   3D-landskap
```

## Karta och framkomlighet

`o` betyder passage och `x` betyder blockerat område.

```text
Rak passage      Böjd passage
x o x            x x x
x o x            x o o
x o x            x o x
```

En ruta motsvarar ett område i världen. `x` anger framkomlighet, inte ett
bestämt utseende. Hinder kan gestaltas som berg, staket, tät vegetation
eller vatten. Varje hindertyp behöver en uttrycklig rörelseregel när den införs.
Enstaka träd kan vara lokala hinder även i ett i övrigt framkomligt område.

Topologin bestämmer förbindelserna. Terrängvariation får ändra formerna,
men ska bevara sammanhängande gångbara passager och inte öppna oavsiktliga
genvägar genom blockerade områden. En lösbar grundkarta är inte ensam ett
bevis för att den färdiga terrängen är gångbar.

Synliga hinder och kollisionsregler ska stämma överens. Framtida regler
för lutning, vatten och vegetation måste testas tillsammans med terrängen.

## Ansvarsgränser

- `src/core/`: karta, generering, terrängdata, hinder, spelarens tillstånd och rörelseregler.
- `src/runtime/`: Three.js, Canvas 2D, input, kamera och HTML-gränssnitt.
- `src/scenarios/`: små, namngivna världar för test och visuell granskning.
- `tests/unit/`, `tests/integration/`, `tests/e2e/`: verifiering på lämplig nivå.

Mappar och moduler skapas när de behövs. Core är vanlig TypeScript utan
grafik- eller webbläsarberoenden. Samma världstillstånd används av båda vyerna.
Rörelse ska beräknas i modellen med uttryckliga tidssteg; renderingsfrekvens
ska inte avgöra rörelsereglerna.

## Determinism och framtida omfattning

Samma seed, generatorversion och inställningar ska ge samma värld.
Genereringen får inte bero på oseedad slump eller i vilken ordning områden besöks.

Den första världen är liten och avgränsad. Fjärran berg och dimma kan senare
ge avståndskänsla utan att hela horisonten är spelbar. Oändlig värld,
chunkgränser, regenerering och LOD definieras separat innan de implementeras.
