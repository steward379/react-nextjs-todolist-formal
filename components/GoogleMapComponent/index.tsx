import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [line, setLine] = useState(null);

  // 初始化 Google 地圖
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

  // 添加地圖上的標記
  const addMarker = (event) => {
    if (!isDrawingMode || markers.length >= 3) return;

    const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    const marker = new window.google.maps.Marker({
      position: newPoint,
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

  // 在標記之間畫線
  const drawLine = (markerArray) => {
    if (line) {
      line.setMap(null);
    }
    const newLine = new window.google.maps.Polyline({
      path: markerArray.map(marker => marker.getPosition()),
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    newLine.setMap(map);
    setLine(newLine);
  };

  // 處理「完成」按鈕的點擊事件
  const handleFinish = () => {
    // 在這裡將 locations 儲存到資料庫
    console.log("Locations saved:", locations);
    setIsDrawingMode(false);
    setMarkers([]);
    if (line) {
      line.setMap(null);
    }
    setLine(null);
    setLocations([]);
  };

  useEffect(() => {
    if (map) {
      map.addListener('click', addMarker);
    }
  }, [map, isDrawingMode, markers]);

  return (
    <div>
      <button onClick={() => setIsDrawingMode(true)}>新增路線</button>
      <div ref={mapRef} style={{ height: '80vh', width: '100%' }} />
      {markers.length === 3 && (
        <div>
          <h3>請輸入地點和路線資訊</h3>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <h4>{`地點 ${index + 1}`}</h4>
              <input type="text" placeholder="輸入地點名稱" onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index] = { ...newLocations[index], name: e.target.value };
                setLocations(newLocations);
              }} />
              <input type="text" placeholder="輸入地點描述" onChange={(e) => {
                const newLocations = [...locations];
                newLocations[index] = { ...newLocations[index], description: e.target.value };
                setLocations(newLocations);
              }} />
            </div>
          ))}
          <button onClick={handleFinish}>路線完成</button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapComponent;
