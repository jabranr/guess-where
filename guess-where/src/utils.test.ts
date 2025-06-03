import { describe, it, expect, vi } from 'vitest';
import { shuffleArray, getRandomCountries } from './utils';
import type { RandomCountry, Region } from './types';
import { countries, byRegion } from './assets/countries.json';

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

describe('getRandomCountries', () => {
  vi.mock('./assets/countries.json', () => ({
    countries: [
      {
        name: 'Country1',
        latlng: {
          lat: 123,
          lng: 456
        },
        capital: 'Capital1'
      },
      {
        name: 'Country2',
        latlng: {
          lat: 1234,
          lng: 4567
        },
        capital: 'Capital2'
      },
      {
        name: 'Country3',
        latlng: {
          lat: 1230,
          lng: 4560
        },
        capital: 'Capital3'
      }
    ],
    byRegion: {
      Europe: [
        {
          name: 'Country4',
          latlng: {
            lat: 1233,
            lng: 4566
          },
          capital: 'Capital4'
        },
        {
          name: 'Country5',
          latlng: {
            lat: 123442,
            lng: 456723
          },
          capital: 'Capital5'
        }
      ],
      Asia: [
        {
          name: 'Country6',
          latlng: {
            lat: 121233,
            lng: 456123
          },
          capital: 'Capital6'
        },
        {
          name: 'Country7',
          latlng: {
            lat: 1231234,
            lng: 451367
          },
          capital: 'Capital7'
        }
      ]
    }
  }));

  it('should return a random result from the "World" region', () => {
    const region: Region = 'World';
    const result = getRandomCountries({ region });

    result.forEach((country: RandomCountry) => {
      expect(countries).toContainEqual(country);
    });

    expect(result.length).toBe(1);
  });

  it('should return a random result from a specific region', () => {
    const region: Region = 'Europe';
    const result = getRandomCountries({ region });

    result.forEach((country: RandomCountry) => {
      expect(byRegion[region]).toContainEqual(country);
    });

    expect(result.length).toBe(1);
  });

  it('should return result with a valid range', () => {
    const region: Region = 'World';
    const result = getRandomCountries({ region, range: 2 });
    result.forEach((country: RandomCountry) => {
      expect(countries).toContainEqual(country);
    });

    expect(result.length).toBe(2);
  });

  it('should return result with an invalid range', () => {
    const region: Region = 'World';
    const result = getRandomCountries({ region, range: countries.length + 1 });
    expect(result.length).toBe(countries.length);
  });

  it('should only accept positive numbers for range', () => {
    const region: Region = 'World';
    expect(() => getRandomCountries({ region, range: -1 })).toThrow(
      'Range must be a positive number'
    );
  });
});
