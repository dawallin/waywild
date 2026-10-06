import { expect, it } from 'vitest';
import { canOccupy, stepWalking, PLAYER_RADIUS } from '../../src/core/movement';
import { createBentValley } from '../../src/scenarios/bentValley';

it('walks north then east through the bend', () => {
  const world = createBentValley();
  for (let i = 0; i < 200; i++) stepWalking(world, true, false);
  expect(world.player.z).toBeCloseTo(15);
  world.player.heading = Math.PI / 2;
  for (let i = 0; i < 200; i++) stepWalking(world, true, false);
  expect(world.player.x).toBeCloseTo(25);
});

it('stops at the blocked northern row', () => {
  const world = createBentValley();
  for (let i = 0; i < 400; i++) stepWalking(world, true, false);
  expect(world.player.z).toBeCloseTo(10.35);
});

it('reserves the circular player radius around the inner corner', () => {
  const world = createBentValley();
  expect(canOccupy(world, 19.8, 19.8)).toBe(false);
  expect(canOccupy(world, 19.7, 19.7)).toBe(true);
});

it('stops diagonal movement at the rounded inner corner', () => {
  const world = createBentValley();
  world.player.x = 19.5; world.player.z = 19.5; world.player.heading = 3 * Math.PI / 4;
  for (let i = 0; i < 30; i++) stepWalking(world, true, false);
  expect(Math.hypot(world.player.x - 20, world.player.z - 20)).toBeCloseTo(PLAYER_RADIUS);
  expect(stepWalking(world, true, false)).toBe(false);
});

it.each([
  [15, 15, 0, 'z', .5], [15, 15, Math.PI, 'z', 29.5],
  [15, 15, Math.PI / 2, 'x', 29.5], [15, 15, 3 * Math.PI / 2, 'x', .5],
] as const)('stops at each world edge with heading %s/%s/%s', (x, z, heading, axis, boundary) => {
  const world = createBentValley(); world.cells = ['ooo', 'ooo', 'ooo'];
  Object.assign(world.player, { x, z, heading });
  for (let i = 0; i < 500; i++) stepWalking(world, true, false);
  expect(world.player[axis]).toBeCloseTo(boundary);
  expect(stepWalking(world, true, false)).toBe(false);
});
