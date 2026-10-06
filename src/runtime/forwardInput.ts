import { stepForward, STEP_SECONDS } from '../core/movement';
import type { World } from '../core/world';

export function mountForwardInput(world: World, redraw: () => void): () => void {
  let pressed = false, previous: number | undefined, accumulator = 0, frame = 0;
  const reset = () => { pressed = false; previous = undefined; accumulator = 0; };
  const keydown = (event: KeyboardEvent) => {
    if (event.code !== 'KeyW' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName))) return;
    event.preventDefault(); pressed = true;
  };
  const keyup = (event: KeyboardEvent) => { if (event.code === 'KeyW') pressed = false; };
  const tick = (now: number) => {
    if (previous !== undefined) accumulator += Math.min((now - previous) / 1000, 0.1);
    previous = now;
    let changed = false;
    while (accumulator >= STEP_SECONDS) {
      changed = stepForward(world, pressed) || changed;
      accumulator -= STEP_SECONDS;
    }
    if (changed) redraw();
    frame = requestAnimationFrame(tick);
  };
  window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup);
  window.addEventListener('blur', reset); document.addEventListener('visibilitychange', reset);
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame); window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup);
    window.removeEventListener('blur', reset); document.removeEventListener('visibilitychange', reset);
  };
}
