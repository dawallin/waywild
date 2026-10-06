import type { World } from '../core/world';

export function createStraightValley(): World {
  return {
    cells: ['xox', 'xox', 'xox'],
    cellSize: 10,
    player: { x: 15, z: 25, heading: 0, eyeHeight: 1.7 },
  };
}
