import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function MapContainer() {
  const mapStyles = {
    height: '100vh',
    width: '100%',
  };

  const defaultCenter = {
    lat: 41.3851,
    lng: 2.1734,
  };

  const handleClick = (e: google.maps.MapMouseEvent) => {
    console.log({ lat: e.latLng?.lat(), lng: e.latLng?.lng() });
  };

  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap
        mapContainerStyle={mapStyles}
        onClick={handleClick}
        zoom={13}
        center={defaultCenter}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      />
    </LoadScript>
  );
}

export default MapContainer;
