import { WeatherData } from "@/domain/entities/FusedPlanetWeather";

export interface WeatherService {
  getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherData>;
}
