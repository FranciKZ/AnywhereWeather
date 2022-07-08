import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import MapContainer from './components/MapContainer';
import Forecast from './components/Forecast';
import PositionalDataType from './models/positionalData';

function App() {
  const [positionalData, setPositionalData] = useState<PositionalDataType>({
    lat: undefined,
    lng: undefined,
  });

  return (
    <ChakraProvider>
      <div>
        <MapContainer setPositionalData={setPositionalData} />
        <Forecast
          lat={positionalData.lat}
          lng={positionalData.lng}
          setPositionalData={setPositionalData}
        />
      </div>
    </ChakraProvider>
  );
}

export default App;
