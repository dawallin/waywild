import type { World } from './world';

export const WALK_SPEED = 3;
export const PLAYER_RADIUS = 0.35;
export const END_WALL_HALF_DEPTH = 0.15;
export const STEP_SECONDS = 1 / 60;

// Straight valley slice: the player faces north; turning is not yet enabled.
export function stepWalking(world: World, forward: boolean, backward: boolean): boolean {
  const direction = Number(forward) - Number(backward);
  if (direction === 0) return false;
  const previous = world.player.z;
  const margin = PLAYER_RADIUS + END_WALL_HALF_DEPTH;
  const depth = world.cells.length * world.cellSize;
  world.player.z = Math.min(depth - margin, Math.max(margin, previous - direction * WALK_SPEED * STEP_SECONDS));
  return world.player.z !== previous;
}
