import { createStraightValley } from './straightValley';
import type { World } from '../core/world';

export function createLandscape(seed?: number): World {
  const world = createStraightValley(seed);
  return {
    ...world,
    cells: Array.from({ length: 10 }, (_, row) => row === 5 ? 'xxxxxoxxxx' : 'xxxxxxxxxx'),
    player: { ...world.player, x: 55, z: 55 },
  };
}
