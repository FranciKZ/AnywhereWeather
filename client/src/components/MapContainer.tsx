import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

type MapContainerProps = {
  setPositionalData: (positionalData: { lat?: number; lng?: number }) => void;
};

function MapContainer({ setPositionalData }: MapContainerProps) {
  const defaultCenter = {
    lat: 39.9611,
    lng: -82.9987,
  };

  const handleClick = (e: google.maps.MapMouseEvent) => {
    setPositionalData({ lat: e.latLng?.lat(), lng: e.latLng?.lng() });
  };

  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap
        onClick={handleClick}
        mapContainerStyle={{
          position: 'absolute',
          height: '100vh',
          width: '100%',
        }}
        zoom={13}
        center={defaultCenter}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          clickableIcons: false,
        }}
      />
    </LoadScript>
  );
}

export default React.memo(MapContainer);
