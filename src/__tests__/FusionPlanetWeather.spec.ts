import { FusionPlanetWeather } from "@/application/use-cases/FusionPlanetWeather";
import {
  PlanetInfo,
  WeatherData,
  FusedPlanetWeather,
} from "@/domain/entities/FusedPlanetWeather";
import { FusedRepository } from "@/application/ports/FusedRepository";
import { CacheService } from "@/application/ports/CacheService";

type SwapiServiceMock = { getRandomPlanet: jest.Mock<Promise<PlanetInfo>, []> };
type WeatherServiceMock = {
  getWeatherByCoordinates: jest.Mock<Promise<WeatherData>, [number, number]>;
};

describe("FusionPlanetWeather", () => {
  const mockSwapiService: SwapiServiceMock = {
    getRandomPlanet: jest.fn<Promise<PlanetInfo>, []>(),
  };
  const mockWeatherService: WeatherServiceMock = {
    getWeatherByCoordinates: jest.fn<Promise<WeatherData>, [number, number]>(),
  };
  const mockFusedRepository: FusedRepository = {
    save: jest.fn<Promise<void>, [FusedPlanetWeather]>(),
    saveCustomData: jest.fn(),
    getAllFused: jest.fn(),
  };
  const mockCacheService: CacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe devolver el resultado cacheado si existe", async () => {
    const fakePlanet: PlanetInfo = {
      name: "Tatooine",
      url: "url",
      rotationPeriod: "23",
      orbitalPeriod: "304",
      diameter: "10465",
      climate: "arid",
      gravity: "1 standard",
      terrain: "desert",
      surfaceWater: "1",
      latitude: 10,
      longitude: 20,
    };
    const fakeWeather: WeatherData = {
      temperature: "30 °C",
      windSpeed: "10 kph",
      country: "Peru",
      region: "Lima",
      city: "Lima",
      condition: "Sunny",
      humidity: "20%",
    };
    const fused = new FusedPlanetWeather(
      fakePlanet,
      fakeWeather,
      new Date().toISOString(),
    );
    mockSwapiService.getRandomPlanet.mockResolvedValue(fakePlanet);
    (mockCacheService.get as jest.Mock).mockResolvedValue(fused);

    const useCase = new FusionPlanetWeather(
      mockSwapiService,
      mockWeatherService,
      mockFusedRepository,
      mockCacheService,
    );
    const result = await useCase.execute();
    expect(result).toBe(fused);
    expect(mockCacheService.get).toHaveBeenCalledWith("Tatooine");
    expect(mockWeatherService.getWeatherByCoordinates).not.toHaveBeenCalled();
    expect(mockFusedRepository.save).not.toHaveBeenCalled();
    expect(mockCacheService.set).not.toHaveBeenCalled();
  });

  it("debe obtener datos, guardar y cachear si no hay cache", async () => {
    const fakePlanet: PlanetInfo = {
      name: "Tatooine",
      url: "url",
      rotationPeriod: "23",
      orbitalPeriod: "304",
      diameter: "10465",
      climate: "arid",
      gravity: "1 standard",
      terrain: "desert",
      surfaceWater: "1",
      latitude: 10,
      longitude: 20,
    };
    const fakeWeather: WeatherData = {
      temperature: "30 °C",
      windSpeed: "10 kph",
      country: "Peru",
      region: "Lima",
      city: "Lima",
      condition: "Sunny",
      humidity: "20%",
    };
    mockSwapiService.getRandomPlanet.mockResolvedValue(fakePlanet);
    (mockCacheService.get as jest.Mock).mockResolvedValue(null);
    mockWeatherService.getWeatherByCoordinates.mockResolvedValue(fakeWeather);
    (mockFusedRepository.save as jest.Mock).mockResolvedValue(undefined);
    (mockCacheService.set as jest.Mock).mockResolvedValue(undefined);

    const useCase = new FusionPlanetWeather(
      mockSwapiService,
      mockWeatherService,
      mockFusedRepository,
      mockCacheService,
    );
    const result = await useCase.execute();
    expect(result.planet).toEqual(fakePlanet);
    expect(result.weather).toEqual(fakeWeather);
    expect(mockCacheService.get).toHaveBeenCalledWith("Tatooine");
    expect(mockWeatherService.getWeatherByCoordinates).toHaveBeenCalledWith(
      10,
      20,
    );
    expect(mockFusedRepository.save).toHaveBeenCalled();
    expect(mockCacheService.set).toHaveBeenCalledWith(
      "Tatooine",
      expect.any(FusedPlanetWeather),
    );
  });
});
