import { byRegion } from './assets/countries.json';
import type useRandomCountry from './hooks/use-random-country';

export type Region = 'World' | keyof typeof byRegion;
export type RandomCountry = ReturnType<typeof useRandomCountry>;
