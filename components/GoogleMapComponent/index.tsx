import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  let map;
  const [currentMarker, setCurrentMarker] = useState(null);

  const addMarker = (location) => {
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
    });
    setCurrentMarker(marker);
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

      map.addListener('click', (event) => {
        addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
    });
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: '80vh', width: '100%' }} />
      {currentMarker && (
        <div>
          <h3>新增地點</h3>
          <form>
            <label>
              名稱:
              <input type="text" name="name" />
            </label>
            <label>
              描述:
              <input type="text" name="description" />
            </label>
            <input type="submit" value="完成" />
          </form>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;