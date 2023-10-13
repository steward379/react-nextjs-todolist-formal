import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // 初始化地圖
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

  // 添加標記的函數
  const addMarker = (event) => {
    if (!isDrawingMode) return;

    const marker = new window.google.maps.Marker({
      position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      map: map,
    });

    setMarkers(prevMarkers => {
      const updatedMarkers = [...prevMarkers, marker];
      if (updatedMarkers.length >= 2) {
        drawLine(updatedMarkers);
      }
      return updatedMarkers;
    });

    setIsDrawingMode(false);
  };

  // 畫線的函數
  const drawLine = (markerArray) => {
    if (markerArray.length < 2) return;

    const line = new window.google.maps.Polyline({
      path: markerArray.map(marker => marker.getPosition()),
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    line.setMap(map);
  };

  // 監聽地圖和繪圖模式
  useEffect(() => {
    if (map) {
      map.addListener('click', addMarker);
    }
  }, [map, isDrawingMode]);

  return (
    <div>
      <button onClick={() => setIsDrawingMode(true)}>新增路線</button>
      <div ref={mapRef} style={{ height: '80vh', width: '100%' }} />
    </div>
  );
};

export default GoogleMapComponent;
