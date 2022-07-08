import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  Radio,
  RadioGroup,
  Box,
  Flex,
} from '@chakra-ui/react';
import WeatherInfo from '../models/weatherInfo';
import PositionalDataType from '../models/positionalData';

type TemperatureUnit = 'fahrenheit' | 'celsius' | 'kelvin';

type ForecastProps = {
  lat?: number;
  lng?: number;
  setPositionalData: (positionalData: PositionalDataType) => void;
};

async function getForecast(
  lat?: number,
  lng?: number
): Promise<WeatherInfo | undefined> {
  if (lat && lng) {
    const result = await fetch(`/api/weather?latitude=${lat}&longitude=${lng}`);
    return result.json();
  }
  return undefined;
}

function convertUnits(toUnit: TemperatureUnit, value?: number) {
  if (value) {
    if (toUnit === 'fahrenheit') {
      return (value * 1.8 - 459.67).toFixed(0);
    }
    if (toUnit === 'kelvin') {
      return value;
    }
    return (value - 273.15).toFixed(0);
  }
  return undefined;
}

function Forecast({ lat, lng, setPositionalData }: ForecastProps) {
  const [result, setResult] = useState<WeatherInfo | undefined>(undefined);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('fahrenheit');

  useEffect(() => {
    getForecast(lat, lng).then((json) => setResult(json));
  }, [lat, lng]);

  const handleRadioChange = (value: string) => {
    setTempUnit(value as TemperatureUnit);
  };

  return (
    <Drawer
      isOpen={!!lat && !!lng}
      onClose={() => setPositionalData({ lat: undefined, lng: undefined })}
      size="sm"
      isFullHeight={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody opacity={0.8}>
          <DrawerHeader>
            Weather at {lat?.toFixed(4)}, {lng?.toFixed(4)}
          </DrawerHeader>
          <RadioGroup onChange={handleRadioChange} value={tempUnit}>
            <Stack direction="row">
              <Radio value="celsius">Celsius</Radio>
              <Radio value="fahrenheit">Fahrenheit</Radio>
              <Radio value="kelvin">Kelvin</Radio>
            </Stack>
          </RadioGroup>
          <Flex align="center" justify="center">
            <Box
              p={5}
              mt={5}
              border="1px"
              borderColor="gray.500"
              borderRadius={2}
            >
              <p>
                {result?.weather[0].main} - {result?.weather[0].description}
              </p>
              <ul>
                <li>
                  Current Temp: {convertUnits(tempUnit, result?.main.temp)}
                </li>
                <li>
                  Feels Like: {convertUnits(tempUnit, result?.main.feels_like)}
                </li>
                <li>Low of: {convertUnits(tempUnit, result?.main.temp_min)}</li>
                <li>
                  High of: {convertUnits(tempUnit, result?.main.temp_max)}
                </li>
              </ul>
            </Box>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default Forecast;
