interface Country {
  name: {
    common: string;
  };
  latlng: number[];
  capital: string;
  region: string;
  subregion: string;
}

interface CountryInfo {
  name: string;
  latlng: google.maps.LatLng;
  capital: string;
}

interface AppData {
  total: number;
  countries: CountryInfo[];
  capitals: string[];
  byRegion: { [key: string]: CountryInfo[] };
  bySubregion: { [key: string]: CountryInfo[] };
}

interface Quiz {
  done: CountryInfo[];
  correct: number;
  answer: string;
  region: string;
}

interface App {
  fbscopes: string;
  iOS: boolean;
  android: boolean;
  init: () => void;
}

interface AppInternal {
  map?: google.maps.Map;
  canvas?: HTMLElement;
  geocoder?: google.maps.Geocoder;
  modes?: { [key: string]: any };
  data?: AppData;
  quiz?: Quiz;
}
