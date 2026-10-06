import { shapedMountainHeight } from './terrain';

export interface World {
  cells: readonly string[];
  cellSize: number;
  seed: number;
  player: { x: number; z: number; heading: number; eyeHeight: number };
}

export function cellAt(world: World, x: number, z: number): string | undefined {
  if (x < 0 || z < 0) return undefined;
  return world.cells[Math.floor(z / world.cellSize)]?.[Math.floor(x / world.cellSize)];
}

export function terrainHeight(world: World, x: number, z: number): number {
  if (cellAt(world, x, z) !== 'x') return 0;
  return shapedMountainHeight(world, x, z);
}

export const BOUNDARY_WALL_THICKNESS = 0.3;
export const BOUNDARY_WALL_HEIGHT = 11;

export function worldBounds(world: World) {
  return { width: world.cells[0].length * world.cellSize, depth: world.cells.length * world.cellSize };
}
