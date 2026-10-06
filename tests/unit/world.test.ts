import { describe, expect, it } from 'vitest';
import { cellAt, terrainHeight } from '../../src/core/world';
import { createStraightValley } from '../../src/scenarios/straightValley';

describe('straight valley', () => {
  it('starts the player inside the passage', () => { const w=createStraightValley(); expect(cellAt(w,w.player.x,w.player.z)).toBe('o'); });
  it('keeps the passage flat', () => { const w=createStraightValley(); for(let z=0;z<30;z++) expect(terrainHeight(w,15,z)).toBe(0); });
  it('gives blocked cells finite terrain heights', () => { expect(Number.isFinite(terrainHeight(createStraightValley(),5,5))).toBe(true); });
  it('has no cells outside the map', () => { expect(cellAt(createStraightValley(),-1,5)).toBeUndefined(); expect(cellAt(createStraightValley(),15,30)).toBeUndefined(); });
});
