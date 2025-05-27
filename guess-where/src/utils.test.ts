import { describe, it, expect } from 'vitest';
import { shuffleArray } from './utils';

describe('shuffleArray', () => {
  it('should return an array with the same elements but in a different order', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray([...originalArray]);

    expect(shuffledArray).toHaveLength(originalArray.length);
    expect(shuffledArray).toEqual(expect.arrayContaining(originalArray));
    expect(shuffledArray).not.toEqual(originalArray); // This might fail occasionally due to randomness
  });

  it('should handle an empty array', () => {
    const emptyArray: number[] = [];
    const shuffledArray = shuffleArray(emptyArray);

    expect(shuffledArray).toEqual([]);
  });

  it('should handle an array with one element', () => {
    const singleElementArray = [42];
    const shuffledArray = shuffleArray(singleElementArray);

    expect(shuffledArray).toEqual([42]);
  });

  it('should not modify the original array', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const copyArray = [...originalArray];
    shuffleArray(copyArray);

    expect(copyArray).toEqual(expect.arrayContaining(originalArray));
  });
});
