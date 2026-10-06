import { expect, it } from 'vitest';
import { stepForward } from '../../src/core/movement';
import { createStraightValley } from '../../src/scenarios/straightValley';

it('moves three meters north in sixty steps', () => {
  const world = createStraightValley();
  for (let i = 0; i < 60; i++) stepForward(world, true);
  expect(world.player.z).toBeCloseTo(22);
  expect(world.player.x).toBe(15);
});

it('stays still when forward is released', () => {
  const world = createStraightValley(); stepForward(world, false);
  expect(world.player.z).toBe(25);
});

it('stops the player radius at the visible end wall', () => {
  const world = createStraightValley();
  for (let i = 0; i < 1000; i++) stepForward(world, true);
  expect(world.player.z).toBe(0.5);
  expect(stepForward(world, true)).toBe(false);
});
