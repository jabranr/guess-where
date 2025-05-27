import { countries, byRegion } from '../assets/countries.json';
import type { Region } from '../types';

export default function useRandomCountry({ region }: { region: Region }) {
  // const done = [];

  const randomCountry =
    region === 'World'
      ? countries[Math.floor(Math.random() * countries.length)]
      : byRegion[region][Math.floor(Math.random() * byRegion[region].length)];

  // if (done.indexOf(country) === -1) {
  //   done.push(country);
  return randomCountry;
  // }

  // return useRandomCountry({ region });
}
