import { createStraightValley } from './straightValley';

export function createBentValley() {
  return { ...createStraightValley(), cells: ['xxx', 'xoo', 'xox'] };
}
