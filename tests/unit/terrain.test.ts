import { canOccupy } from '../../src/core/movement';
import { expect, it } from 'vitest';
import { mountainHeight, mountainSample, surfaceFor, shapedMountainHeight, shapedMountainSample } from '../../src/core/terrain';
import { terrainHeight } from '../../src/core/world';
import { createStraightValley } from '../../src/scenarios/straightValley';
import { createBentValley } from '../../src/scenarios/bentValley';

const points = [[0, 0], [5, 5], [10, 10], [20, 15], [30, 30]];
it('reproduces the same terrain for the same seed', () => {
  expect(points.map(([x,z]) => mountainSample(42,x,z))).toEqual(points.map(([x,z]) => mountainSample(42,x,z)));
});
it('different seeds change the height field', () => {
  expect(points.map(([x,z]) => mountainHeight(42,x,z))).not.toEqual(points.map(([x,z]) => mountainHeight(43,x,z)));
});
it('sampling order does not affect terrain', () => {
  const initial = points.map(([x,z]) => mountainHeight(42,x,z));
  const reverse = [...points].reverse().map(([x,z]) => mountainHeight(42,x,z)).reverse();
  expect(reverse).toEqual(initial);
});
it('shares a continuous field across mountain cell boundaries', () => {
  for (const seed of [0, 1, 42, 4294967295]) {
    expect(mountainHeight(seed, 10 - 1e-7, 5)).toBeCloseTo(mountainHeight(seed, 10 + 1e-7, 5), 5);
    expect(mountainHeight(seed, 5, 10 - 1e-7)).toBeCloseTo(mountainHeight(seed, 5, 10 + 1e-7), 5);
  }
});
it.each([createStraightValley, createBentValley])('preserves flat passages for each scenario', create => {
  for (const seed of [0, 1, 42, 4294967295]) {
    const world = create(seed);
    world.cells.forEach((row,z) => [...row].forEach((cell,x) => {
      if (cell === 'o') expect(terrainHeight(world, x*10+5, z*10+5)).toBe(0);
    }));
  }
});
it('keeps mountains raised at the passage boundary for all selected seeds', () => {
  for (const seed of [0, 1, 42, 4294967295]) {
    const world = createStraightValley(seed);
    for (let z = 0; z < 30; z++) {
      expect(terrainHeight(world, 10 - 1e-7, z)).toBeCloseTo(1);
      expect(terrainHeight(world, 20, z)).toBeCloseTo(1);
    }
  }
});
it('steep terrain is classified as rock', () => { expect(surfaceFor(8, .8)).toBe('rock'); });
it('gentle low terrain is classified as grass', () => { expect(surfaceFor(8, .2)).toBe('grass'); });
it('gentle high terrain is classified as high rock', () => { expect(surfaceFor(12, .2)).toBe('highRock'); });


it.each([createStraightValley, createBentValley])('makes passage-facing cliffs one meter high', create => {
  const world = create(42);
  expect(shapedMountainHeight(world, 10, 25)).toBe(1);
  expect(shapedMountainHeight(world, 20, 25)).toBe(1);
  if (world.cells[0] === 'xxx') {
    expect(shapedMountainHeight(world, 15, 10)).toBe(1);
    expect(shapedMountainHeight(world, 25, 20)).toBe(1);
  }
});
it('blends from the cliff to the seeded terrain field', () => {
  const world = createStraightValley(42);
  expect(shapedMountainHeight(world, 10, 15)).toBe(1);
  expect(shapedMountainHeight(world, 4, 15)).toBe(mountainHeight(world.seed, 4, 15));
});
it('shaped terrain is continuous across adjoining mountain cells', () => {
  const world = createBentValley(42);
  expect(shapedMountainSample(world, 10 - 1e-7, 5).height).toBeCloseTo(shapedMountainSample(world, 10 + 1e-7, 5).height, 5);
});

it('generates both raised terrain and depressions below road level', () => {
  const heights = Array.from({ length: 64 }, (_, seed) => mountainHeight(seed, 4, 15));
  expect(Math.min(...heights)).toBeLessThan(0);
  expect(Math.max(...heights)).toBeGreaterThan(1);
});
it('can slope down behind the one-meter edge', () => {
  const seed = Array.from({ length: 64 }, (_, seed) => seed).find(seed => mountainHeight(seed, 4, 15) < 0)!;
  expect(seed).toBeDefined();
  const world = createStraightValley(seed);
  expect(shapedMountainHeight(world, 10, 15)).toBe(1);
  expect(shapedMountainHeight(world, 9, 15)).toBeLessThan(1);
  expect(shapedMountainHeight(world, 4, 15)).toBeLessThan(0);
});
it('depressions do not open a shortcut through blocked terrain', () => {
  const seed = Array.from({ length: 64 }, (_, seed) => seed).find(seed => mountainHeight(seed, 4, 15) < 0)!;
  const world = createStraightValley(seed);
  expect(canOccupy(world, 9, 15)).toBe(false);
  expect(canOccupy(world, 10.36, 15)).toBe(true);
});
