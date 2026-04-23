import { getMaxArea } from '@/lib/getMaxArea.js';

describe('getMaxArea', () => {
  it('returns [2, 1] for 2x2 with horizontal then vertical at center', () => {
    expect(getMaxArea(2, 2, [false, true], [1, 1])).toEqual([2, 1]);
  });

  it('accepts 0/1 flags like booleans', () => {
    expect(getMaxArea(2, 2, [0, 1], [1, 1])).toEqual([2, 1]);
  });

  it('matches 4x4 example: horizontal at 3 then vertical at 1', () => {
    expect(getMaxArea(4, 4, [0, 1], [3, 1])).toEqual([12, 9]);
  });

  it('ignores duplicate cuts and keeps prior max area', () => {
    expect(getMaxArea(2, 2, [0, 0], [1, 1])).toEqual([2, 2]);
  });
});
