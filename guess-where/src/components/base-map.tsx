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

export default function BaseMap({ level }: { level: Level }) {
  const { mapRef, map, isMapLoaded } = useGoogleMaps({
    apiKey: 'AIzaSyCc6A42_pUh_OjrulrREQ5Zu5aWirNrPZ4',
    mapOptions: {
      zoom: 2,
      backgroundColor: '#f1f1f1',
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      keyboardShortcuts: false,
      scrollwheel: false,
      draggable: false
    }
  });

  useEffect(() => {
    if (isMapLoaded) {
      map.setOptions({ styles: mapStyles[level] });
    }
  }, [isMapLoaded, level, map]);

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
