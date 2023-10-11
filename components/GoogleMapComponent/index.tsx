import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  let map;

  const addMarker = (location) => {
    new window.google.maps.Marker({
      position: location,
      map: map,
    });
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 25.0329694, lng: 121.5654177 },
        zoom: 12,
      });

      // 註冊地圖點擊事件
      map.addListener('click', (event) => {
        addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
    });
  }, []);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default GoogleMapComponent;




