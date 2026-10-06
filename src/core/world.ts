export interface World {
  cells: readonly string[];
  cellSize: number;
  player: { x: number; z: number; heading: number; eyeHeight: number };
}

export function cellAt(world: World, x: number, z: number): string | undefined {
  if (x < 0 || z < 0) return undefined;
  return world.cells[Math.floor(z / world.cellSize)]?.[Math.floor(x / world.cellSize)];
}

export function terrainHeight(world: World, x: number, z: number): number {
  if (cellAt(world, x, z) !== 'x') return 0;
  const localX = (x % world.cellSize) / world.cellSize;
  const localZ = (z % world.cellSize) / world.cellSize;
  return 3 + 8 * Math.sin(Math.PI * localX) * Math.sin(Math.PI * localZ);
}

export const BOUNDARY_WALL_THICKNESS = 0.3;
export const BOUNDARY_WALL_HEIGHT = 11;

export function worldBounds(world: World) {
  return { width: world.cells[0].length * world.cellSize, depth: world.cells.length * world.cellSize };
}
