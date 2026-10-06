import { BOUNDARY_WALL_THICKNESS, worldBounds, type World } from './world';

export const WALK_SPEED = 3;
export const TURN_SPEED = Math.PI / 2;
export const PLAYER_RADIUS = 0.35;
export const END_WALL_HALF_DEPTH = BOUNDARY_WALL_THICKNESS / 2;
export const STEP_SECONDS = 1 / 60;

export function stepTurning(world: World, left: boolean, right: boolean): boolean {
  const direction = Number(right) - Number(left);
  if (direction === 0) return false;
  const fullTurn = Math.PI * 2;
  world.player.heading = ((world.player.heading + direction * TURN_SPEED * STEP_SECONDS) % fullTurn + fullTurn) % fullTurn;
  return true;
}


export function canOccupy(world: World, x: number, z: number): boolean {
  const { width, depth } = worldBounds(world);
  const margin = PLAYER_RADIUS + END_WALL_HALF_DEPTH;
  if (x < margin || z < margin || x > width - margin || z > depth - margin) return false;
  for (let row = 0; row < world.cells.length; row++) {
    for (let col = 0; col < world.cells[row].length; col++) {
      if (world.cells[row][col] === 'o') continue;
      const nearX = Math.max(col * world.cellSize, Math.min((col + 1) * world.cellSize, x));
      const nearZ = Math.max(row * world.cellSize, Math.min((row + 1) * world.cellSize, z));
      if (Math.hypot(x - nearX, z - nearZ) < PLAYER_RADIUS) return false;
    }
  }
  return true;
}

// Check the entire swept circle, including a grazing pass across a corner.
function pathIsClear(world: World, x: number, z: number, dx: number, dz: number): boolean {
  if (!canOccupy(world, x + dx, z + dz)) return false;
  for (let row = 0; row < world.cells.length; row++) for (let col = 0; col < world.cells[row].length; col++) {
    if (world.cells[row][col] === 'o') continue;
    const minX = col * world.cellSize, maxX = minX + world.cellSize;
    const minZ = row * world.cellSize, maxZ = minZ + world.cellSize;
    let enter = 0, leave = 1;
    for (const [start, delta, min, max] of [[x, dx, minX, maxX], [z, dz, minZ, maxZ]]) {
      if (Math.abs(delta) < 1e-15) { if (start < min || start > max) leave = -1; }
      else {
        const a = (min - start) / delta, b = (max - start) / delta;
        enter = Math.max(enter, Math.min(a, b)); leave = Math.min(leave, Math.max(a, b));
      }
    }
    if (enter <= leave) return false;
    const lengthSquared = dx * dx + dz * dz;
    for (const cx of [minX, maxX]) for (const cz of [minZ, maxZ]) {
      const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((cx - x) * dx + (cz - z) * dz) / lengthSquared));
      if (Math.hypot(x + t * dx - cx, z + t * dz - cz) < PLAYER_RADIUS) return false;
    }
  }
  return true;
}

export function stepWalking(world: World, forward: boolean, backward: boolean): boolean {
  const direction = Number(forward) - Number(backward);
  if (direction === 0) return false;
  const distance = direction * WALK_SPEED * STEP_SECONDS;
  const dx = Math.sin(world.player.heading) * distance;
  const dz = -Math.cos(world.player.heading) * distance;
  const { width, depth } = worldBounds(world);
  const margin = PLAYER_RADIUS + END_WALL_HALF_DEPTH;
  let fraction = 1;
  if (dx > 1e-12) fraction = Math.min(fraction, (width - margin - world.player.x) / dx);
  if (dx < -1e-12) fraction = Math.min(fraction, (margin - world.player.x) / dx);
  if (dz > 1e-12) fraction = Math.min(fraction, (depth - margin - world.player.z) / dz);
  if (dz < -1e-12) fraction = Math.min(fraction, (margin - world.player.z) / dz);
  fraction = Math.max(0, fraction);
  const allowed = (t: number) => pathIsClear(world, world.player.x, world.player.z, dx * t, dz * t);
  if (!allowed(fraction)) {
    let low = 0, high = fraction;
    for (let i = 0; i < 40; i++) {
      const middle = (low + high) / 2;
      if (allowed(middle)) low = middle; else high = middle;
    }
    fraction = low;
  }
  if (fraction < 1e-8) return false;
  world.player.x += dx * fraction;
  world.player.z += dz * fraction;
  return true;
}
