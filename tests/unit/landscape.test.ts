import { expect, it } from 'vitest';
import { createLandscape } from '../../src/scenarios/landscape';
import { cellAt, worldBounds } from '../../src/core/world';
import { stepWalking } from '../../src/core/movement';

it('has ten by ten cells and exactly one central passage', () => {
  const world = createLandscape();
  expect(world.cells).toHaveLength(10);
  expect(world.cells.every(row => row.length === 10)).toBe(true);
  expect(world.cells.join('').split('').filter(cell => cell === 'o')).toHaveLength(1);
  expect(world.cells[5][5]).toBe('o');
  expect(worldBounds(world)).toEqual({ width:100, depth:100 });
});
it('starts at the center of the only passage', () => {
  const world = createLandscape(42);
  expect(world.player).toMatchObject({ x:55, z:55, heading:0 });
  expect(cellAt(world, world.player.x, world.player.z)).toBe('o');
  expect(world.seed).toBe(42);
});
it.each([[0,'z',50.35],[Math.PI,'z',59.65],[Math.PI/2,'x',59.65],[3*Math.PI/2,'x',50.35]] as const)(
  'stops at the central cell boundary for heading %s', (heading,axis,boundary) => {
    const world = createLandscape(); world.player.heading = heading;
    for (let i=0;i<200;i++) stepWalking(world,true,false);
    expect(world.player[axis]).toBeCloseTo(boundary);
    expect(stepWalking(world,true,false)).toBe(false);
  });
