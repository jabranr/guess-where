import { useEffect } from 'react';
import useGoogleMaps from 'use-gmaps';
import type { Level } from './levels';

import proMapStyles from '../assets/modes/pro.json';
import advanceMapStyles from '../assets/modes/advance.json';
import easyMapStyles from '../assets/modes/easy.json';

const mapStyles = {
  pro: proMapStyles,
  advance: advanceMapStyles,
  easy: easyMapStyles
};

const device = {
  iOS: new RegExp(/iP(od|ad|hone)/).test(navigator.userAgent),
  android: new RegExp(/(Android)/).test(navigator.userAgent)
};

export default function BaseMap({
  level,
  onSetup
}: {
  level: Level;
  onSetup?: (map?: google.maps.Map) => void;
}) {
  const { mapRef, map, isMapLoaded } = useGoogleMaps({
    apiKey: String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
    mapOptions: {
      center: { lat: 45.436, lng: 4.876 },
      zoom: device.iOS || device.android ? 10 : 12,
      backgroundColor: '#f1f1f1',
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      keyboardShortcuts: false,
      scrollwheel: false,
      gestureHandling: 'none',
      styles: mapStyles[level]
    }
  });

  useEffect(() => {
    if (isMapLoaded) {
      map.setOptions({
        styles: mapStyles[level]
      });
    }
  }, [isMapLoaded, level, map]);

  useEffect(() => {
    if (isMapLoaded && onSetup) {
      onSetup(map);
    }
  }, [isMapLoaded, map, onSetup]);

  useEffect(() => {
    if (isMapLoaded) {
      if (device.iOS || device.android) {
        map.panBy(0, -100);
      } else {
        map.panBy(-100, 0);
      }
    }
  }, [isMapLoaded, map]);

  useEffect(() => {
    function handleResize() {
      google.maps.event.trigger(map, 'resize');
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return (
    <div
      className={`w-[100vw] h-[100vh] ${isMapLoaded ? '' : 'opacity-50'}`}
      id="mapCanvas"
      ref={mapRef}
    />
  );
}
