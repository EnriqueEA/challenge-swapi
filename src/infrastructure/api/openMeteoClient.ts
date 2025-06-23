import axios from "axios";
import {
  GeolocationResponse,
  WeatherForecastResponse,
} from "@/infrastructure/api/dto/WeatherResponse";
import { WeatherService } from "@/application/ports/WeatherService";
import { WeatherData } from "@/domain/entities/FusedPlanetWeather";

export class OpenMeteoClient implements WeatherService {
  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherData> {
    const requestForecast = axios.get<WeatherForecastResponse>(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude,
          longitude,
          current_weather: true,
        },
      },
    );

    const requestGeolocation = axios.get<GeolocationResponse>(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
        },
      },
    );
    const [responseForecast, responseGeolocation] = await Promise.all([
      requestForecast,
      requestGeolocation,
    ]);
    const weather = responseForecast.data.current_weather;
    const weatherUnits = responseForecast.data.current_weather_units;
    return {
      temperature: `${weather.temperature} ${weatherUnits.temperature}`,
      windSpeed: `${weather.windspeed} ${weatherUnits.windspeed}`,
      country: responseGeolocation.data.address?.country,
      displayName: responseGeolocation.data.display_name,
    };
  }
}
