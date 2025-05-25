import { useEffect } from 'react';
import useGoogleMaps from 'use-gmaps';
import Regions from './components/regions';
import Guesses from './components/guesses';

export default function App() {
  const { mapRef, map, isMapLoaded, currentCenter } = useGoogleMaps({
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

  // useEffect(() => {
  //   if (mapRef.current) {
  //     new google.maps.Map(mapRef.current, {
  //       center: new google.maps.LatLng(45.436, 4.876),
  //       zoom: 2,
  //       backgroundColor: '#f1f1f1',
  //       disableDefaultUI: true,
  //       disableDoubleClickZoom: true,
  //       keyboardShortcuts: false,
  //       scrollwheel: false,
  //       draggable: false
  //     });
  //   }
  // }, []);

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
    <div>
      <div className="w-[100vw] h-[100vh]" id="mapCanvas" ref={mapRef} />
      <aside className="absolute top-0 left-0 m-4 bg-white p-4 rounded-lg shadow-md w-full max-w-[300px] [&>*+*]:mt-4 [&>*+*]:pt-2 [&>*+*]:border-t-2 [&>*+*]:border-gray-200">
        <Guesses />
        <Regions />
      </aside>
    </div>
  );
}
