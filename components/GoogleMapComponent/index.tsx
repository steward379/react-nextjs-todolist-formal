import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';



const GoogleMapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const loader = new Loader({
      apiKey, 
      version: "weekly",
    });

    loader.load().then(() => {
      new window.google.maps.Map(mapRef.current, {
        center: { lat: 25.0329694, lng: 121.5654177 },
        zoom: 12,
      });
    });
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default GoogleMapComponent;




