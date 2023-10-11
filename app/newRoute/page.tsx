"use client";

import GoogleMapComponent from '../../components/GoogleMapComponent';

const NewRoutePage = () => {
  const handleAddRoute = () => {
    console.log('新增路線');
  };

  return (
    <div>
      <button onClick={handleAddRoute}>新增路線</button>
      <GoogleMapComponent />
    </div>
  );
};

export default NewRoutePage;