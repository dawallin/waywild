import { DEFAULT_SEED } from '../core/terrain';
import type { World } from '../core/world';

export function createStraightValley(seed = DEFAULT_SEED): World {
  return {
    cells: ['xox', 'xox', 'xox'],
    cellSize: 10,
    seed,
    player: { x: 15, z: 25, heading: 0, eyeHeight: 1.7 },
  };
}
