# Delad vy och rak dalgång

Status: accepterad omfattning, 2026-10-06. Detaljer nedan återstår före implementation.

## Syfte

Visa hur en enkel 2D-karta blir en värld som kan utforskas i förstaperson.
Bevisa att karta, synligt landskap och rörelseregler beskriver samma värld.

## Omfattning

- En fast 3×3-karta med rak passage.
- Kartvy till vänster och förstapersonsvy till höger.
- Gemensam spelarposition och riktning, synlig i båda vyerna.
- Fri gång utan hopp.
- Enkel terräng med berg längs passagens sidor.
- Rörelse som stoppas av hinder och världens yttre gräns.
- Ett scenario som kan öppnas direkt för test och granskning.

Seed-generering, brus, böjd dal, vatten, staket, träd, chunks, fjärrlandskap
och mål/progression ingår i senare steg.

## Grundkarta

```text
x o x
x o x
x o x
```

`o` är framkomligt område och `x` är blockerat. I detta scenario gestaltas
de blockerade områdena som berg. Passagen har plats för spelarens radie.
Synlig bergsgräns ska motsvara den gräns där spelaren stoppas.

## Beteende

Spelaren startar i passagen, vänd längs dalen. Förstapersonskameran följer
spelarens position och riktning. Kartan visar samma position och en
riktningsmarkör. Båda vyerna uppdateras vid gång och vridning.

Spelaren kan gå fritt inom passagen. Försök att gå genom berg eller lämna
kartan tillåts inte. Världens ändar ska ha synligt motsvarande avgränsningar.

## Acceptanskriterier

1. Båda vyerna syns samtidigt med kartan till vänster.
2. Kartvyn visar den angivna 3×3-kartan och spelarens position/riktning.
3. Förstapersonsvyn visar en sammanhängande dal med berg längs sidorna.
4. Gång genom dalen uppdaterar modell, kartmarkör och kamera konsekvent.
5. Vridning uppdaterar kartmarkörens riktning och kamerans riktning konsekvent.
6. Spelaren kan inte passera bergsgränsen eller världens yttre gräns.
7. Scenariot fungerar både lokalt och under GitHub Pages basväg.

## Separata testmål

- Modellen tolkar `o` som passage.
- Modellen tolkar `x` som blockerat.
- En rörelse längs dalen tillåts.
- En rörelse mot sidans hinder stoppas med hänsyn till spelarens radie.
- En rörelse utanför världen stoppas.
- Kartans och terrängens hindergränser överensstämmer.
- Webbläsarens gånginput uppdaterar båda vyerna från samma spelarposition.
- Webbläsarens vridinput uppdaterar båda vyerna från samma riktning.
- Appens produktionsresurser fungerar med `/waywild/` som basväg.

Visuell granskning bekräftar begriplig karta, synliga gränser och användbar förstapersonsvy.

## Detaljer att bestämma före implementation

- Rutstorlek, spelarens radie, ögonhöjd och gånghastighet.
- Exakt startposition och riktning.
- Desktopinput för gång och blick, samt om första steget inkluderar touchkontroller.
- Bergens första geometri och avgränsning vid dalens ändar.
- Panelernas proportioner och beteende på smala mobilskärmar.
- Namn och query-parameter för scenariot.

Dessa detaljer kan lösas i nästa implementationsdiskussion. Mobilprestanda
är ett långsiktigt mål; första stegets testade enheter och input ska anges uttryckligen.
