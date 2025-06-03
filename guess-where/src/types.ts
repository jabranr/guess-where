import { countries, byRegion } from './assets/countries.json';

export type Region = 'World' | keyof typeof byRegion;
export type RandomCountry = (typeof countries)[number];
