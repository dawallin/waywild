import { createStraightValley } from './straightValley';

export function createBentValley(seed?: number) {
  return { ...createStraightValley(seed), cells: ['xxx', 'xoo', 'xox'] };
}
