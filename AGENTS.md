# Arbetsregler för Waywild

## Arbetsflöde

Diskutera → definiera → utveckla → verifiera → publicera.

- Läs `Specs/README.md` och relevanta specifikationer före ändringar.
- Implementera först när användaren har bett om implementation av det definierade steget.
- Att dokumentera ett beslut innebär inte att implementation eller publicering är beställd.
- Arbeta i små steg med tydliga acceptanskriterier och tester av en sak i taget.
- Uppdatera specifikationer när ett överenskommet beteende ändras.
- Börja med en agent; håll arkitektur och implementation enkla.
- Redovisa vad som ändrats, vad som verifierats och vad som återstår.

## Arkitektur

- `src/core/` äger världens data, framkomlighet och spelarens rörelseregler.
- Core får inte bero på Three.js, DOM eller webbläsarens klocka.
- Världsgenerering ska vara deterministisk för samma seed, inställningar och generatorversion.
- `src/runtime/` äger grafik, input, kamera och gränssnitt.
- 2D- och 3D-vyer ska läsa samma världsmodell och spelarposition.
- Använd inte rendering eller animation för att avgöra om en rörelse är tillåten.

## Verifiering och publicering

Följ `Specs/Foundation/DevelopmentLoop.md`. Kör relevanta tester lokalt
innan ett steg publiceras. CI ska verifiera innan GitHub Pages uppdateras.
Publicera byggda `dist/`, med resurssökvägar som fungerar under `/waywild/`.

Vid konflikt gäller aktuell användarinstruktion först, därefter relevanta
Foundation-specifikationer, Feature-specifikationer och denna fil.
