import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import countries, { type Country } from 'world-countries';
import { Client } from '@googlemaps/google-maps-services-js';
import { setTimeout } from 'node:timers/promises';

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

const client = new Client({});
const promises: Promise<void>[] = [];

countries.forEach(function (country, i) {
  country.capital.forEach((c) => {
    // get all capitals
    _data.capitals.push(c);

    // for every i === 10, add a delay to avoid hitting the API rate limit
    if (i % 10 === 0) {
      console.log(
        `Processing country ${i + 1} of ${countries.length}: ${country.name.common}`
      );
      setTimeout(200);
    }

    // get latlng from gmaps geocoder
    const promise = client
      .geocode({
        params: {
          key: String(process.env.GOOGLE_MAPS_API_KEY),
          address: `${c}, ${country.name.common}`
        }
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Geocode API error: ${response.status}`);
        }

        const result = response.data.results[0];
        const lat = result.geometry.location.lat;
        const lng = result.geometry.location.lng;

        const id = Buffer.from(country.name.common + c).toString('base64');

        // group by countries
        _data.countries.push({
          id,
          name: country.name.common,
          latlng: { lat, lng },
          capital: c
        });

        // group by regions
        _data.byRegion[country.region] = _data.byRegion[country.region] || [];
        _data.byRegion[country.region].push({
          id,
          name: country.name.common,
          latlng: { lat, lng },
          capital: c
        });

        // group by sub regions
        _data.bySubregion[country.subregion] =
          _data.bySubregion[country.subregion] || [];
        _data.bySubregion[country.subregion].push({
          id,
          name: country.name.common,
          latlng: { lat, lng },
          capital: c
        });
      })
      .catch((error) => {
        console.error('Error fetching geocode data:', {
          code: error.code,
          message: error.message,
          country: country.name.common,
          capital: c
        });

        if (error.code === 'ERR_BAD_REQUEST') {
          process.exit(1);
        }
      })
      .finally(() => {
        console.log(`Processed country: ${country.name.common}, capital: ${c}`);
      });

    promises.push(promise);
  });
});

// Wait for all promises to resolve before writing the file
Promise.all(promises)
  .then(() => {
    _data.total = _data.countries.length;
    const __dirname = new URL('.', import.meta.url).pathname;
    const filePath = path.join(__dirname, '../src/assets/countries.json');
    fs.writeFileSync(filePath, JSON.stringify(_data, null, 2), 'utf-8');
    console.log('Countries data written to', filePath);
  })
  .catch((error) => {
    console.error('Error processing countries:', error);
  });
