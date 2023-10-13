import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [locations, setLocations] = useState(Array(3).fill({ name: '', description: '' }));
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [line, setLine] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });
    loader.load().then(() => {
      const initMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 25.0329694, lng: 121.5654177 },
        zoom: 12,
      });
      setMap(initMap);
    });
  }, []);

  const addMarker = (event) => {
    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    const marker = new window.google.maps.Marker({
      position: newPoint,
      map: map,
    });

    setMarkers((prevMarkers) => [...prevMarkers, marker]);

    if (prevMarkers.length >= 1) {
      drawLine([...prevMarkers, marker]);
    }
  };

  const drawLine = (markerArray) => {
    if (line) {
      line.setMap(null);
    }

    const newLine = new window.google.maps.Polyline({
      path: markerArray.map((marker) => marker.getPosition()),
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    newLine.setMap(map);
    setLine(newLine);
  };

  const handleCancel = () => {
    markers.forEach((marker) => marker.setMap(null));
    if (line) {
      line.setMap(null);
    }
    setMarkers([]);
    setLocations(Array(3).fill({ name: '', description: '' }));
    setRouteName('');
    setRouteDescription('');
  };

  useEffect(() => {
    if (map && markers.length < 3) {
      map.addListener('click', addMarker);
    }
    return () => {
      if (map) {
        window.google.maps.event.clearListeners(map, 'click');
      }
    };
  }, [map, markers]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '80vh', width: '100%' }} />
      {markers.length < 3 && (
        <div>
          {Array.from({ length: markers.length }, (_, index) => (
            <div key={index}>
              <h4>{`地點 ${index + 1}`}</h4>
              <input
                type="text"
                placeholder="輸入地點名稱"
                required
                value={locations[index].name}
                onChange={(e) => {
                  const newLocations = [...locations];
                  newLocations[index].name = e.target.value;
                  setLocations(newLocations);
                }}
              />
              <input
                type="text"
                placeholder="輸入地點描述"
                value={locations[index].description}
                onChange={(e) => {
                  const newLocations = [...locations];
                  newLocations[index].description = e.target.value;
                  setLocations(newLocations);
                }}
              />
            </div>
          ))}
        </div>
      )}
      {markers.length === 3 && (
        <div>
          <h3>請輸入路線資訊</h3>
          <input
            type="text"
            placeholder="輸入路線名稱"
            required
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
          <input
            type="text"
            placeholder="輸入路線描述"
            value={routeDescription}
            onChange={(e) => setRouteDescription(e.target.value)}
          />
          <input type="file" />
          <button onClick={handleCancel}>取消路線</button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
