# Delad vy och rak dalgång

Status: framåt- och bakåtgång implementerade. Vridning beställd 2026-10-07.

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

## Delsteg: visa världen

Beställt 2026-10-06. Statisk spelare; gång och input implementeras i nästa delsteg.
Rutstorlek 10 m, ögonhöjd 1,7 m. Start x=15 m, z=25 m; riktning norr (-z).
Kartans x växer åt höger och z nedåt. Berg är enkla facetterade höjdfält
med branta kanter; dalens ändar avgränsas av låga bergväggar.
Panelerna har lika bredd och ligger bredvid varandra även på smala skärmar.
Scenariot är tills vidare standardvyn på appens rotadress.
Gånghastighet 3 m/s, WASD och piltangenter är accepterade för nästa delsteg.
Touchkontroller införs senare. Radie och kollisionsdetaljer bestäms inför gångsteget.

## Delsteg: framåt

Beställt 2026-10-06. Håll W för gång rakt norrut; släpp för att stanna.
Hastighet 3 m/s, fasta modellsteg 1/60 sekund. Spelarradie 0,35 m.
Ändväggen är 0,3 m tjock, centrerad på z=0; spelarcentrum stannar på z=0,5 m.
Ingen vridning, bakåtgång eller sidogång ingår. Funktionen är avgränsad till
rak dal och riktning norr. Generell hinderkollision införs med fri gång.
Båda vyerna ritas om från modellens position. Fokusförlust eller dold sida
släpper input; långa frameuppehåll ska inte skapa stora hopp.
Tester bevisar hastighet, släppt input, stopp vid väggen och synkroniserade vyer.

## Delsteg: bakåtgång

Beställt 2026-10-06. S ger bakåtgång i 3 m/s, W ger framåtgång.
W och S samtidigt ger stillastående. Spelarcentrum stoppas på z=29,5 m
vid den bakre ändväggen, med samma radie och väggtjocklek som framåt.
Vridning och sidogång återstår. Unit-tester och separata webbläsartester
bevisar bakåtgång, ändvägg och motstridig input.

## Delsteg: vridning och riktad gång

Beställt 2026-10-07. A vrider vänster och D höger kontinuerligt, 90°/s.
Riktningen kan passera norr och fortsätta obegränsat runt; lagras inom [0, 2π).
A+D ger ingen vridning. Släppt tangent stoppar vridningen. Ingen sidogång.
W/S följer aktuell riktning i 3 m/s; W+S ger ingen gång men tillåter vridning.
Vid samtidig gång och vridning vrids spelaren först i varje fast modellsteg.
Vridning på plats är tillåten även intill hinder. Fokusförlust/dold sida släpper alla tangenter.

Kollision avgränsas här till den raka dalens rektangulära passage.
Spelarcentrum hålls mellan x=10,35 och 19,65 samt z=0,5 och 29,5 m.
Vid sned rörelse kapas hela rörelsen vid första kontakt med en gräns;
ingen glidning längs hinder. Generell kollision för andra kartor definieras senare.

Separata testmål före implementation:
- A och D vrider åt var sitt håll med 90°/s utan att flytta positionen.
- Vridning passerar ett helt varv och normaliserar riktningen.
- A+D ger oförändrad riktning.
- W och S följer riktningen; W+S står still även efter vridning.
- Vänster respektive höger sidoberg stoppar spelarradien.
- Sned kollision stoppar vid kontakt utan glidning; ändväggar fungerar efter vridning.
- Webbläsaren visar samma riktning i båda vyerna vid A respektive D.
- Släpp/fokusförlust stoppar vridning; samtidig gång/vridning följer riktningen.
- Visuell granskning bedömer vridhastighet och kamerans samspel med kartmarkören.

Aktuella kartval, ytterväggar och generell rutkollision definieras i [MapSelection](MapSelection.md).
