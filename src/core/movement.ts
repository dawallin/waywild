import type { World } from './world';

export const WALK_SPEED = 3;
export const TURN_SPEED = Math.PI / 2;
export const PLAYER_RADIUS = 0.35;
export const END_WALL_HALF_DEPTH = 0.15;
export const STEP_SECONDS = 1 / 60;

export function stepTurning(world: World, left: boolean, right: boolean): boolean {
  const direction = Number(right) - Number(left);
  if (direction === 0) return false;
  const fullTurn = Math.PI * 2;
  world.player.heading = ((world.player.heading + direction * TURN_SPEED * STEP_SECONDS) % fullTurn + fullTurn) % fullTurn;
  return true;
}

// This collision slice describes only the straight valley's rectangular passage.
export function stepWalking(world: World, forward: boolean, backward: boolean): boolean {
  const direction = Number(forward) - Number(backward);
  if (direction === 0) return false;
  const distance = direction * WALK_SPEED * STEP_SECONDS;
  const dx = Math.sin(world.player.heading) * distance;
  const dz = -Math.cos(world.player.heading) * distance;
  const margin = PLAYER_RADIUS + END_WALL_HALF_DEPTH;
  const minX = world.cellSize + PLAYER_RADIUS;
  const maxX = 2 * world.cellSize - PLAYER_RADIUS;
  const minZ = margin;
  const maxZ = world.cells.length * world.cellSize - margin;
  let fraction = 1;
  if (dx > 1e-12) fraction = Math.min(fraction, (maxX - world.player.x) / dx);
  if (dx < -1e-12) fraction = Math.min(fraction, (minX - world.player.x) / dx);
  if (dz > 1e-12) fraction = Math.min(fraction, (maxZ - world.player.z) / dz);
  if (dz < -1e-12) fraction = Math.min(fraction, (minZ - world.player.z) / dz);
  fraction = Math.max(0, fraction);
  const previousX = world.player.x, previousZ = world.player.z;
  world.player.x = Math.max(minX, Math.min(maxX, previousX + dx * fraction));
  world.player.z = Math.max(minZ, Math.min(maxZ, previousZ + dz * fraction));
  return world.player.x !== previousX || world.player.z !== previousZ;
}
