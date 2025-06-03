import { useState } from 'react';
import countriesData from '../assets/countries.json';

export function useRegions() {
  const [selectedRegion, setSelectedRegion] = useState('World');
  const regions = ['World', ...Object.keys(countriesData.byRegion)];

  function selectRegion(region: string) {
    setSelectedRegion(region);
  }

  return { regions, selectedRegion, selectRegion };
}
