# Kartval och böjd dal

Beställt 2026-10-07.

Två kartor väljs i en märkt väljare ovanför vyerna: Rak dal och Böjd dal.
Den böjda kartan är `xxx / xoo / xox`. Båda startar vid x=15, z=25 m,
riktning norr. Kartbyte släpper input, återställer spelaren och bygger om båda vyerna.
W/S och A/D fungerar som tidigare. Rutstorlek 10 m och spelarradie 0,35 m.

Kollision följer blockerade rutor med cirkulär spelarradie, inklusive hörn.
Rörelse stoppas vid första kontakt utan glidning. Världens alla ytterkanter
har 11 m höga bergväggar, 0,3 m tjocka och centrerade på yttergränsen.
Synlig insida och kollision använder samma väggmått. Kartvyn visar väggarnas insida.
Detta ersätter raka dalens låga ändväggar och specialiserade kollision.

Separata testmål:
- Gång genom böjens två delar tillåts.
- Blockerade rutor och hörn stoppar spelarens radie utan glidning.
- Varje ytterkant stoppar spelaren.
- Båda vyerna använder samma kart- och gränsdata.
- Val av karta återställer position/riktning och släpper input.
- Upprepade kartbyten fungerar med båda vyerna.
- Produktionsbygge och webbläsartester fungerar under /waywild/.

Visuell granskning kontrollerar höga väggar och begriplig böj.

## Landskapsvy 10×10

Beställt 2026-10-07. Ett tredje alternativ, Landskap 10×10, visar en
100×100 m värld. En enda gångbar ruta ligger på rad 6, kolumn 6 (index 5,5);
övriga rutor är blockerade. En jämn kartstorlek har ingen unik mittruta.
Spelaren startar mitt i denna ruta: x=55, z=55 m, riktning norr.
Seedkontroller och kartbyte fungerar som för övriga kartor.
Kartvyn skalar efter antal rader/kolumner. Kamerans räckvidd, dimma och
ljus täcker större världen så landskap längre bort kan granskas.

Separata testmål före implementation:
- Kartan har 10×10 rutor och exakt en gångbar ruta.
- Startpositionen är i gångbara rutans centrum.
- Spelaren stoppas vid alla fyra sidor av den enda gångbara rutan.
- Kartval visar samma stora karta och spelare i båda vyerna.
- Seedbyte fungerar på stora kartan och återställer startpositionen.
- Visuell granskning bedömer avstånd, dimma, bergsformer och prestanda.
