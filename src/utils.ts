import { countries, byRegion } from './assets/countries.json';
import type { Region } from './types';

export function shuffleArray<T extends unknown[]>(arr: T): T {
  // Shuffle array using Fisher-Yates algorithm
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

type RandomCountryProps = {
  region: Region;
  range?: number;
};

export function getRandomCountries({ region, range = 1 }: RandomCountryProps) {
  if (range < 1) {
    throw new Error('Range must be a positive number');
  }

  return region === 'World'
    ? shuffleArray(countries).slice(0, range)
    : shuffleArray(byRegion[region]).slice(0, range);
}
