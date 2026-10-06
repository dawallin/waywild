import { expect, it } from 'vitest';
import { stepWalking } from '../../src/core/movement';
import { createStraightValley } from '../../src/scenarios/straightValley';

it('moves three meters north in sixty steps', () => {
  const world = createStraightValley();
  for (let i = 0; i < 60; i++) stepWalking(world, true, false);
  expect(world.player.z).toBeCloseTo(22);
  expect(world.player.x).toBe(15);
});

it('stays still when forward is released', () => {
  const world = createStraightValley(); stepWalking(world, false, false);
  expect(world.player.z).toBe(25);
});

it('stops the player radius at the visible end wall', () => {
  const world = createStraightValley();
  for (let i = 0; i < 1000; i++) stepWalking(world, true, false);
  expect(world.player.z).toBe(0.5);
  expect(stepWalking(world, true, false)).toBe(false);
});

it('moves three meters backward in sixty steps', () => {
  const world = createStraightValley();
  for (let i = 0; i < 60; i++) stepWalking(world, false, true);
  expect(world.player.z).toBeCloseTo(28);
});

it('stops at the rear wall', () => {
  const world = createStraightValley();
  for (let i = 0; i < 1000; i++) stepWalking(world, false, true);
  expect(world.player.z).toBe(29.5);
  expect(stepWalking(world, false, true)).toBe(false);
});

it('stays still when forward and backward are both held', () => {
  const world = createStraightValley();
  expect(stepWalking(world, true, true)).toBe(false);
  expect(world.player.z).toBe(25);
});
