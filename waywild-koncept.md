# Waywild

## Koncept

**Waywild** är ett procedurgenererat spel/landskapsprojekt där en
matematisk seed skapar en hel värld.

Grundidén är att kombinera känslan från äldre procedurgenererade
landskapsprogram från 1990-talet med en dold labyrintstruktur.
Resultatet ska inte se ut som en traditionell labyrint. Labyrinten ska i
stället döljas i ett naturligt landskap med berg, dalar, vatten, skog
och andra objekt.

Namnet **Waywild** syftar på:

-   **Way** -- vägen genom världen och den underliggande labyrinten.
-   **Wild** -- naturen och det procedurgenererade landskapet.

Möjlig tagline:

> **Every world has a way.**

## Inspiration och egen identitet

Idén har viss konceptuell inspiration från projekt som Shan Shui, där
matematik används för att skapa landskap, samt äldre program som
VistaPro/Bryce som kunde skapa färgade procedurgenererade landskap.

Waywild ska dock ha en tydligt egen riktning:

-   Inte kinesisk tuschestetik.
-   Inte ett sidscrollande generativt konstverk.
-   Ett navigerbart landskap.
-   En faktisk spelstruktur under landskapet.
-   Seed-baserad och deterministisk värld.
-   Naturen fungerar samtidigt som den visuella representationen av
    labyrinten.

## Grundprincip: labyrinten under landskapet

Först genereras en enkel labyrint eller graf. Den är billig att beräkna
och kan konstrueras så att det alltid finns en lösning mellan start och
mål.

Labyrinten används sedan som underlag för terrängen:

-   Gångar → dalar, pass och framkomliga områden.
-   Väggar → berg, åsar och andra naturliga hinder.
-   Återvändsgränder → exempelvis sjöar, grottor eller utsiktsplatser.
-   Korsningar → öppnare dalar eller naturliga vägval.
-   Genvägar → broar, bergspass eller tunnlar.

Spelaren behöver alltså inte uppfatta att världen är en labyrint.

## Från labyrint till naturlig terräng

En möjlig metod är att skapa ett distance field från labyrintens
tillåtna vägar.

Princip:

``` text
nära passage     → låg terräng
längre från väg  → högre terräng
mycket långt bort → berg/ås
```

Sedan läggs olika typer av noise ovanpå för att ta bort det geometriska
labyrintutseendet.

Förenklat:

``` text
height(x,z) =
    mazeDistance(x,z) * mountainScale
    + largeNoise(x,z,seed) * terrainVariation
    + detailNoise(x,z,seed) * roughness
```

Det kan skapa naturligt formade dalgångar med berg på sidorna samtidigt
som den ursprungliga labyrintens navigerbara struktur bevaras.

## Seed-baserad värld

Världen behöver inte lagras i sin helhet. En seed tillsammans med
koordinater kan bestämma vad som finns på varje plats.

Exempel:

``` text
height(x,z,seed) → markhöjd
water(x,z,seed)  → vatten
biome(x,z,seed)  → skog, äng, berg etc.
tree(x,z,seed)   → träd eller inget träd
fruit(x,z,seed)  → frukt/bär eller inget
```

Samma seed och koordinat ska alltid ge samma resultat.

Det innebär exempelvis att frågan:

``` text
Finns ett fruktträd vid (1832,742)?
```

kan räknas fram när det behövs. Trädet behöver inte finnas lagrat
permanent.

## Deterministisk objektplacering

Hashfunktioner kan användas för att placera objekt reproducerbart.

Exempel:

``` text
if treeHash(x,z,seed) < 0.03:
    skapa träd

if fruitHash(x,z,seed) < 0.002:
    skapa fruktträd
```

Samma princip kan användas för exempelvis:

-   Träd
-   Buskar
-   Frukt och bär
-   Stenar
-   Ruiner
-   Grottor
-   Broar
-   Djur
-   Samlarobjekt
-   Speciella platser

## Vatten och biomer

Vatten kan skapas utifrån terrängens höjd och en vattennivå.

``` text
if height < waterLevel:
    water
```

Biomer kan bestämmas av flera matematiska fält:

``` text
biome = f(
    height,
    moisture,
    temperature,
    slope,
    seed
)
```

Det möjliggör exempelvis:

-   Sjöar
-   Floder
-   Ängar
-   Lövskog
-   Barrskog
-   Berg
-   Klippor
-   Snöområden

## Oändlig eller mycket stor värld

Världen kan delas upp i chunks.

Telefonen genererar bara området runt spelaren. När spelaren lämnar ett
område kan dess geometri tas bort ur minnet.

När spelaren återvänder genereras området igen från samma seed och blir
identiskt.

Princip:

``` text
seed + chunk coordinate
        ↓
generate chunk
        ↓
terrain + vegetation + objects
```

Det gör att världen i princip kan vara mycket stor eller oändlig utan
att all världsinformation måste sparas.

## Rendering och prestanda

Waywild bör kunna byggas för relativt begränsad hårdvara.

Ett rimligt första mål är att spelet ska fungera bra på **iPhone 13**,
gärna även äldre modeller.

Möjliga tekniker:

-   WebGL/Three.js för en webbaserad prototyp.
-   Heightmaps för terräng.
-   Chunk-baserad rendering.
-   LOD (Level of Detail) för avlägsna berg.
-   Instancing för stora mängder träd.
-   Enkel shader för vatten.
-   Dimma för atmosfär och kortare render distance.
-   Procedurgenererade eller små återanvändbara texturer.

Det behövs inte:

-   Ray tracing.
-   Avancerad fysiksimulering.
-   AI-generering av landskapet.
-   Fullständig lagring av världen.
-   Extremt detaljerad geometri.

En stiliserad 2.5D-/3D-estetik kan dessutom göra begränsad geometri till
en del av spelets visuella identitet.

## Central arkitektur

Det är viktigt att separera **världsmodellen** från **renderingen**.

``` text
SEED
 │
 ├── Maze / world topology
 │
 ├── Height field
 │
 ├── Water
 │
 ├── Biomes
 │
 ├── Vegetation
 │
 └── Objects
       │
       ▼
   WORLD MODEL
       │
       ▼
    RENDERER
```

Då kan samma matematiska värld senare visualiseras på olika sätt,
exempelvis:

-   3D
-   Low-poly
-   Pixelart
-   Karta ovanifrån
-   SVG
-   Mobilversion
-   Webbversion

## Kärnan i Waywild

Waywild kan sammanfattas som:

> **En seed-baserad procedurgenererad naturvärld där landskapet döljer
> en matematisk labyrint.**

Spelaren ser berg, dalar, vatten och skogar.

Under ytan finns en strukturerad och lösbar väg genom världen.

**Every world has a way.**
