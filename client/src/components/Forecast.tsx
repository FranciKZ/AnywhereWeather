import React, { useEffect, useState } from 'react';
import WeatherInfo from '../models/weatherInfo';

type TemperatureUnit = 'fahrenheit' | 'celsius';

type ForecastProps = {
  lat?: number;
  lng?: number;
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
    return value - 273.15;
  }
  return undefined;
}

function Forecast({ lat, lng }: ForecastProps) {
  const [result, setResult] = useState<WeatherInfo | undefined>(undefined);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('fahrenheit');

  useEffect(() => {
    getForecast(lat, lng).then((json) => setResult(json));
  }, [lat, lng]);

  return (
    <div
      style={{
        height: '100vh',
        width: !lat || !lng || !result ? '0vh' : '40vh',
        visibility: !lat || !lng || !result ? 'hidden' : 'visible',
        position: 'relative',
        background: 'rgba(255,250,250, 0.8)',
        display: 'grid',
      }}
    >
      <h3 style={{ fontSize: '1.5rem', margin: '0 auto' }}>
        Weather at {lat?.toFixed(4)}, {lng?.toFixed(4)}
      </h3>
      <p>
        {result?.weather[0].main} - {result?.weather[0].description}
      </p>
      <ul>
        <li>Current Temp: {convertUnits(tempUnit, result?.main.temp)}</li>
        <li>Feels Like: {convertUnits(tempUnit, result?.main.feels_like)}</li>
        <li>Low of: {convertUnits(tempUnit, result?.main.temp_min)}</li>
        <li>High of: {convertUnits(tempUnit, result?.main.temp_max)}</li>
      </ul>
      <button type="button" onClick={() => setResult(undefined)}>
        close
      </button>
    </div>
  );
}

export default Forecast;
