# Seedbaserade berg runt fasta passager

Första implementationssteget beställt 2026-10-07: förfina bergen runt Rak dal
 och Böjd dal med deterministisk terräng. Grafgenerering följer senare.

## Beteende och avgränsning

Ett heltalsseed (0–4294967295), standard 1, styr bergens form. Fältet Seed
 och knappen Skapa landskap finns vid kartvalet. Knapparna −/+ ändrar
 seedfältets giltiga värde med ett och tillämpar det direkt. De inaktiveras
 vid min-/maxgräns eller ogiltigt fältvärde. Tillämpat seed bygger om
 båda vyerna och återställer spelaren/input; kartbyte behåller tillämpat seed.
 Samma karta, seed, inställningar och generatorversion ger samma terräng.

Höjd varierar kontinuerligt över bergsrutor med stora ryggar och mindre
 brusvariationer i världens koordinater. Höjdfält, lutning och ytklass beräknas
 i core. Grafik väljer färger för gräs, sten och högt belägen sten från dessa data.
 Bergens trianglar samplas med högst 0,5 m mellanrum.

Generatorversion 3: klippkanten mot passagen är 1 m hög. Höjden blandas
 mjukt över 6 m från närmaste passage till seedets terränghöjd, även runt
 böjens hörn. Höjd, lutning och rendering använder samma formade höjdfält.

Passagerna är plana och har befintlig bredd. Bergens synliga klippkant
 sammanfaller med blockerad rutgräns. Spelarradie och kollision följer kartan;
 topologin skyddas mot både avstängda passager och nya genvägar. Bergsrutor
 delar höjdfält utan sömmar vid gemensamma kanter. Världens 11 m höga
 ytterväggar kvarstår. Ljus och skuggor hjälper att läsa terrängens form.

Det första steget har klippkanter vid passagen. Gångbara mjuka sluttningar,
 lutningsbaserad rörelse, sjöar, träd, hus och genererade grafer kräver egna
 beteenden och testmål. De ligger kvar i den långsiktiga riktningen.

## Separata testmål före kodändringar

- Identiskt seed och generatorversion ger identiska höjdprover.
- Olika seed ger skilda höjdprover.
- Prover är oberoende av besöks-/beräkningsordning.
- Höjdfält är sammanhängande vid bergsrutornas gemensamma kanter.
- Båda kartornas alla passager förblir plana och sammanhängande.
- Klippkanten är 1 m hög vid kollisionsgränsen för olika seed.
- Terrängen kan stiga eller sjunka från kanten och når seedets terränghöjd 6 m bort.
- Sänkor under vägens nivå syns och täcks inte av en markplatta.
- Det formade höjdfältet är sammanhängande över gemensamma bergskanter.
- Lutning ger korrekt ytklass på kontrollerade prover.
- Seedbyte bygger om landskapet och återställer spelaren.
- Kartbyte behåller tillämpat seed.
- Ogiltigt seed tillämpas inte.
- Plus/minus ändrar seed med ett och bygger om landskapet direkt.
- Plus/minus kan inte passera seedintervallets gränser.
- Rörelse och kollision fungerar efter seedbyte.
- Visuell granskning från ögonhöjd: varierade ryggar, begriplig klippkant,
  samspel mellan ljus och material samt inga synliga rutsömmar.

## Höjder och sänkor

Beställt 2026-10-07. Seedet kan skapa terräng både över och under vägens
 nivå (höjd 0). Kanten är fortfarande 1 m hög precis vid passagen; bakom
 kanten blandas höjden mjukt över 6 m till ett höjdfält mellan −8 och 16 m.
 Renderingen lägger plan mark bara i passageceller, så sänkor förblir synliga.
 `x` visar blockerat område i kartans teckenförklaring. Kollision följer samma
 rutgräns även när området utanför kanten är lägre. Sjöar införs separat.

Testmål: positiva och negativa höjder för kontrollerade seed, gradvis fall
 från kanten, bibehållen kanthöjd/plana passager och kollision runt sänkor.
