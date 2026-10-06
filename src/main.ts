import './style.css';
import { DEFAULT_SEED } from './core/terrain';
import { mountWalkingInput } from './runtime/walkingInput';
import { createLandscape } from './scenarios/landscape';
import { createBentValley } from './scenarios/bentValley';
import { createStraightValley } from './scenarios/straightValley';
import { mountMap } from './runtime/mapView';
import { mountWorld } from './runtime/worldView';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App container is missing');
app.innerHTML = `
  <header><p class="eyebrow">Every world has a way.</p><h1>Waywild</h1><p>10 meter per ruta</p><label for="map-choice">Karta </label><select id="map-choice"><option value="straight">Rak dal</option><option value="bent">Böjd dal</option><option value="landscape">Landskap 10×10</option></select>
    <form id="terrain-form"><label for="terrain-seed">Seed </label><button id="seed-decrease" type="button" aria-label="Minska seed">−</button><input id="terrain-seed" type="number" min="0" max="4294967295" step="1" required value="${DEFAULT_SEED}"><button id="seed-increase" type="button" aria-label="Öka seed">+</button><button type="submit">Skapa landskap</button></form></header>
  <main aria-label="Världsvyer">
    <section aria-labelledby="map-title"><h2 id="map-title">Karta</h2><canvas id="map" aria-label="Karta med spelarens riktning"></canvas><p class="legend">x Blockerat · o Passage · ▲ Du</p></section>
    <section aria-labelledby="world-title"><h2 id="world-title">Förstaperson</h2><canvas id="world" aria-label="Landskap sett i förstaperson"></canvas><p id="status" class="legend">Ögonhöjd 1,7 m · A/D vrider blicken</p></section>
  </main>
  <footer>W framåt · S bakåt · A vänster · D höger · 3 m/s · Släpp för att stanna</footer>
`;

const choice = document.querySelector<HTMLSelectElement>('#map-choice')!;
const seedForm = document.querySelector<HTMLFormElement>('#terrain-form')!;
const seedInput = document.querySelector<HTMLInputElement>('#terrain-seed')!;
const decreaseSeed = document.querySelector<HTMLButtonElement>('#seed-decrease')!;
const increaseSeed = document.querySelector<HTMLButtonElement>('#seed-increase')!;
let appliedSeed = DEFAULT_SEED;
function updateSeedButtons() {
  const seed = seedInput.valueAsNumber;
  const valid = seedInput.validity.valid && Number.isInteger(seed);
  decreaseSeed.disabled = !valid || seed <= 0;
  increaseSeed.disabled = !valid || seed >= 4294967295;
}
function changeSeed(delta: number) {
  if (!seedForm.reportValidity()) return;
  const seed = seedInput.valueAsNumber + delta;
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) return;
  seedInput.value = String(seed);
  appliedSeed = seed;
  updateSeedButtons();
  loadScenario();
}
const decrease = () => changeSeed(-1);
const increase = () => changeSeed(1);
let disposeScenario = () => {};
function loadScenario() {
  disposeScenario();
  const world = choice.value === 'landscape' ? createLandscape(appliedSeed)
    : choice.value === 'bent' ? createBentValley(appliedSeed) : createStraightValley(appliedSeed);
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
function applySeed(event: SubmitEvent) {
  event.preventDefault();
  if (!seedForm.reportValidity()) return;
  const value = seedInput.valueAsNumber;
  if (!Number.isInteger(value) || value < 0 || value > 4294967295) return;
  appliedSeed = value;
  updateSeedButtons();
  loadScenario();
}
seedInput.addEventListener('input', updateSeedButtons);
decreaseSeed.addEventListener('click', decrease);
increaseSeed.addEventListener('click', increase);
updateSeedButtons();
seedForm.addEventListener('submit', applySeed);
choice.addEventListener('change', loadScenario);
loadScenario();
if (import.meta.hot) import.meta.hot.dispose(() => { seedInput.removeEventListener('input', updateSeedButtons); decreaseSeed.removeEventListener('click', decrease); increaseSeed.removeEventListener('click', increase); seedForm.removeEventListener('submit', applySeed); choice.removeEventListener('change', loadScenario); disposeScenario(); });
