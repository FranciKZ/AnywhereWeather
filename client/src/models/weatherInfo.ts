export type BaseWeatherInfo = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type MainWeatherInfo = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
};

export type Coordinate = {
  lat: number;
  lon: number;
};

export default interface WeatherInfo {
  coord: Coordinate;
  weather: BaseWeatherInfo[];
  base: string;
  main: MainWeatherInfo;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
}
