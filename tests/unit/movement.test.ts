import { expect, it } from 'vitest';
import { stepTurning, stepWalking } from '../../src/core/movement';
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

it.each([[-1, true, false], [1, false, true]] as const)('turns in direction %s without moving', (sign, left, right) => {
  const world = createStraightValley();
  for (let i = 0; i < 60; i++) stepTurning(world, left, right);
  expect(world.player.heading).toBeCloseTo(sign > 0 ? Math.PI / 2 : 3 * Math.PI / 2);
  expect([world.player.x, world.player.z]).toEqual([15, 25]);
});

it('continues turning beyond a full revolution', () => {
  const world = createStraightValley();
  for (let i = 0; i < 300; i++) stepTurning(world, false, true);
  expect(world.player.heading).toBeCloseTo(Math.PI / 2);
});

it('opposing turn inputs cancel', () => {
  const world = createStraightValley();
  expect(stepTurning(world, true, true)).toBe(false);
  expect(world.player.heading).toBe(0);
});

it.each([true, false])('walks along heading with forward=%s', forward => {
  const world = createStraightValley(); world.player.heading = Math.PI / 2;
  for (let i = 0; i < 60; i++) stepWalking(world, forward, !forward);
  expect(world.player.x).toBeCloseTo(forward ? 18 : 12);
  expect(world.player.z).toBeCloseTo(25);
});

it.each([Math.PI / 2, 3 * Math.PI / 2])('stops at the side mountain at heading %s', heading => {
  const world = createStraightValley(); world.player.heading = heading;
  for (let i = 0; i < 200; i++) stepWalking(world, true, false);
  expect(world.player.x).toBeCloseTo(heading === Math.PI / 2 ? 19.65 : 10.35);
  expect(stepWalking(world, true, false)).toBe(false);
});

it('stops a diagonal move at first contact without sliding', () => {
  const world = createStraightValley(); world.player.heading = Math.PI / 4; world.player.x = 19.64;
  stepWalking(world, true, false);
  expect(world.player.x).toBeCloseTo(19.65);
  expect(world.player.z).toBeCloseTo(24.99);
  const stopped = { ...world.player };
  for (let i = 0; i < 60; i++) stepWalking(world, true, false);
  expect(world.player).toEqual(stopped);
});

it('walking south after turning stops at the rear wall', () => {
  const world = createStraightValley(); world.player.heading = Math.PI;
  for (let i = 0; i < 200; i++) stepWalking(world, true, false);
  expect(world.player.z).toBe(29.5);
});
