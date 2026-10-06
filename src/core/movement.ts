import type { World } from './world';

export const WALK_SPEED = 3;
export const PLAYER_RADIUS = 0.35;
export const END_WALL_HALF_DEPTH = 0.15;
export const STEP_SECONDS = 1 / 60;

// First slice: forward along the straight valley, whose heading is north.
export function stepForward(world: World, pressed: boolean): boolean {
  if (!pressed) return false;
  const previous = world.player.z;
  world.player.z = Math.max(PLAYER_RADIUS + END_WALL_HALF_DEPTH, previous - WALK_SPEED * STEP_SECONDS);
  return world.player.z !== previous;
}
