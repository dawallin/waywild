import type { World } from './world';

export const TERRAIN_GENERATOR_VERSION = 3;
export const DEFAULT_SEED = 1;
export const TERRAIN_SAMPLE_SPACING = 0.5;

function lattice(seed: number, x: number, z: number): number {
  let value = (seed ^ Math.imul(x, 374761393) ^ Math.imul(z, 668265263)) >>> 0;
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function noise(seed: number, x: number, z: number): number {
  const ix = Math.floor(x), iz = Math.floor(z);
  const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const tx = ease(x - ix), tz = ease(z - iz);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  return mix(mix(lattice(seed, ix, iz), lattice(seed, ix + 1, iz), tx),
    mix(lattice(seed, ix, iz + 1), lattice(seed, ix + 1, iz + 1), tx), tz);
}

// A shared field in world coordinates avoids repeating one mountain per cell.
export function mountainHeight(seed: number, x: number, z: number): number {
  const broad = noise(seed, x / 18 + 7.3, z / 18 - 4.7);
  const ridge = 1 - Math.abs(2 * noise(seed ^ 0x9e3779b9, x / 9, z / 9) - 1);
  const detail = noise(seed ^ 0x85ebca6b, x / 2.5, z / 2.5);
  return -8 + 18 * broad + 5 * ridge + detail;
}

export type TerrainSurface = 'grass' | 'rock' | 'highRock';

export function surfaceFor(height: number, slope: number): TerrainSurface {
  if (slope > 0.7) return 'rock';
  return height > 11 ? 'highRock' : 'grass';
}

export function mountainSample(seed: number, x: number, z: number) {
  const height = mountainHeight(seed, x, z);
  const offset = 0.25;
  const dx = (mountainHeight(seed, x + offset, z) - mountainHeight(seed, x - offset, z)) / (2 * offset);
  const dz = (mountainHeight(seed, x, z + offset) - mountainHeight(seed, x, z - offset)) / (2 * offset);
  const slope = Math.hypot(dx, dz);
  return { height, slope, surface: surfaceFor(height, slope) };
}

export const PASSAGE_CLIFF_HEIGHT = 1;
export const MOUNTAIN_TRANSITION_WIDTH = 6;

// Distance to the union of passage cells also shapes the inside of a bend.
export function shapedMountainHeight(world: World, x: number, z: number): number {
  let distance = Infinity;
  world.cells.forEach((row, iz) => [...row].forEach((cell, ix) => {
    if (cell !== 'o') return;
    const nearX = Math.max(ix * world.cellSize, Math.min((ix + 1) * world.cellSize, x));
    const nearZ = Math.max(iz * world.cellSize, Math.min((iz + 1) * world.cellSize, z));
    distance = Math.min(distance, Math.hypot(x - nearX, z - nearZ));
  }));
  const t = Math.min(1, distance / MOUNTAIN_TRANSITION_WIDTH);
  const blend = t * t * (3 - 2 * t);
  return PASSAGE_CLIFF_HEIGHT + (mountainHeight(world.seed, x, z) - PASSAGE_CLIFF_HEIGHT) * blend;
}

export function shapedMountainSample(world: World, x: number, z: number) {
  const height = shapedMountainHeight(world, x, z), offset = 0.25;
  const dx = (shapedMountainHeight(world, x + offset, z) - shapedMountainHeight(world, x - offset, z)) / (2 * offset);
  const dz = (shapedMountainHeight(world, x, z + offset) - shapedMountainHeight(world, x, z - offset)) / (2 * offset);
  const slope = Math.hypot(dx, dz);
  return { height, slope, surface: surfaceFor(height, slope) };
}
