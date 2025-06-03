import { createContext, useContext } from 'react';
import type { Region } from '../types';

export const regionContext = createContext<{
  region: Region;
  setRegion: React.Dispatch<React.SetStateAction<Region>>;
}>({
  region: 'World',
  setRegion: () => {}
});

export function useRegion() {
  const context = useContext(regionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }

  return context;
}
