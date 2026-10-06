import './style.css';
import { mountWalkingInput } from './runtime/walkingInput';
import { createBentValley } from './scenarios/bentValley';
import { createStraightValley } from './scenarios/straightValley';
import { mountMap } from './runtime/mapView';
import { mountWorld } from './runtime/worldView';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App container is missing');
app.innerHTML = `
  <header><p class="eyebrow">Every world has a way.</p><h1>Waywild</h1><p>10 meter per ruta</p><label for="map-choice">Karta </label><select id="map-choice"><option value="straight">Rak dal</option><option value="bent">Böjd dal</option></select></header>
  <main aria-label="Världsvyer">
    <section aria-labelledby="map-title"><h2 id="map-title">Karta</h2><canvas id="map" aria-label="3×3-karta med spelarens riktning"></canvas><p class="legend">x Berg · o Passage · ▲ Du</p></section>
    <section aria-labelledby="world-title"><h2 id="world-title">Förstaperson</h2><canvas id="world" aria-label="Dalgång sedd i förstaperson"></canvas><p id="status" class="legend">Ögonhöjd 1,7 m · A/D vrider blicken</p></section>
  </main>
  <footer>W framåt · S bakåt · A vänster · D höger · 3 m/s · Släpp för att stanna</footer>
`;

const choice = document.querySelector<HTMLSelectElement>('#map-choice')!;
let disposeScenario = () => {};
function loadScenario() {
  disposeScenario();
  const world = choice.value === 'bent' ? createBentValley() : createStraightValley();
  const mapView = mountMap(document.querySelector<HTMLCanvasElement>('#map')!, world);
  let worldView: ReturnType<typeof mountWorld> | undefined;
  try {
    worldView = mountWorld(document.querySelector<HTMLCanvasElement>('#world')!, world);
    document.querySelector('#status')!.textContent = 'Ögonhöjd 1,7 m · A/D vrider blicken';
  } catch (error) {
    document.querySelector('#status')!.textContent = '3D-vyn kunde inte startas. Din webbläsare behöver stöd för WebGL 2.';
    console.error(error);
  }
  const disposeInput = worldView ? mountWalkingInput(world, () => { mapView.draw(); worldView?.draw(); }) : () => {};
  disposeScenario = () => { disposeInput(); mapView.dispose(); worldView?.dispose(); };
}
choice.addEventListener('change', loadScenario);
loadScenario();
if (import.meta.hot) import.meta.hot.dispose(() => { choice.removeEventListener('change', loadScenario); disposeScenario(); });
