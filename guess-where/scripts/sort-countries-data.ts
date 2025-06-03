import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import countries, { type Country } from 'world-countries';

type CountryData =
  | {
      id: string;
      name: Country['name']['common'];
      capital: string;
      latlng: { lat: number; lng: number };
    }
  | Partial<Country>;

type Data = {
  total: number;
  countries: CountryData[];
  capitals: Country['capital'];
  byRegion: Record<Country['region'], CountryData[]>;
  bySubregion: Record<Country['subregion'], CountryData[]>;
};

const _data: Data = {
  total: countries.length,
  countries: [],
  capitals: [],
  byRegion: {},
  bySubregion: {}
};

countries.forEach(function (country) {
  country.capital.forEach((c) => {
    // get all capitals
    _data.capitals.push(c);

    // group by countries
    _data.countries.push({
      id: Buffer.from(country.name.common + c).toString('base64'),
      name: country.name.common,
      latlng: {
        lat: country.latlng[0],
        lng: country.latlng[1]
      },
      capital: c
    });

    // group by regions
    _data.byRegion[country.region] = _data.byRegion[country.region] || [];
    _data.byRegion[country.region].push({
      id: Buffer.from(country.name.common + c).toString('base64'),
      name: country.name.common,
      latlng: {
        lat: country.latlng[0],
        lng: country.latlng[1]
      },
      capital: c
    });

    // group by sub regions
    _data.bySubregion[country.subregion] =
      _data.bySubregion[country.subregion] || [];
    _data.bySubregion[country.subregion].push({
      id: Buffer.from(country.name.common + c).toString('base64'),
      name: country.name.common,
      latlng: {
        lat: country.latlng[0],
        lng: country.latlng[1]
      },
      capital: c
    });
  });
});

// __dirname in esm
const __dirname = new URL('.', import.meta.url).pathname;
const filePath = path.join(__dirname, '../src/assets/countries.json');
fs.writeFileSync(filePath, JSON.stringify(_data, null, 2), 'utf-8');
console.log('Countries data written to', filePath);
