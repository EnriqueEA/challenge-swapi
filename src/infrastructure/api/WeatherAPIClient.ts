import axios, { AxiosInstance } from "axios";
import { WeatherService } from "@/application/ports/WeatherService";
import { WeatherData } from "@/domain/entities/FusedPlanetWeather";
import { CurrentWeatherResponse } from "./dto/WeatherResponse";

export class WeatherAPIClient implements WeatherService {
  private readonly baseUrl = "http://api.weatherapi.com/v1";
  private readonly apiKey: string;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || "YOUR_API_KEY_HERE";
    this.axiosInstance = this.createAxiosInstance();
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    // Request interceptor to add API key
    instance.interceptors.request.use(
      (config) => {
        config.params = {
          ...config.params,
          key: this.apiKey,
        };
        return config;
      },
      (error) => Promise.reject(error),
    );

    return instance;
  }

  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherData> {
    const response = await this.axiosInstance.get<CurrentWeatherResponse>(
      `/current.json`,
      {
        params: {
          q: `${latitude},${longitude}`,
        },
      },
    );

    const weather = response.data.current;
    return {
      temperature: `${weather.temp_c} °C`,
      windSpeed: `${weather.wind_kph} kph`,
      condition: weather.condition.text,
      region: response.data.location?.region,
      humidity: `${weather.humidity}%`,
      country: response.data.location?.country,
      city: response.data.location?.name,
    };
  }
}
