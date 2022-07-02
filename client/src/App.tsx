import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import Forecast from './components/Forecast';
//

type PositionalDataType = {
  lat?: number;
  lng?: number;
};

function App() {
  const [positionalData, setPositionalData] = useState<PositionalDataType>({
    lat: undefined,
    lng: undefined,
  });

  return (
    <div>
      <MapContainer setPositionalData={setPositionalData} />
      <Forecast lat={positionalData.lat} lng={positionalData.lng} />
    </div>
  );
}

export default App;
