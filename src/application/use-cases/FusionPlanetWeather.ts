import { FusedPlanetWeather } from "../../domain/entities/FusedPlanetWeather";
import { SwapiService } from "../ports/SwapiService";
import { WeatherService } from "../ports/WeatherService";
import { FusedRepository } from "../ports/FusedRepository";
import { CacheService } from "../ports/CacheService";

export class FusionPlanetWeather {
  constructor(
    private readonly swapiService: SwapiService,
    private readonly weatherService: WeatherService,
    private readonly fusedRepository: FusedRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(): Promise<FusedPlanetWeather> {
    const planet = await this.swapiService.getRandomPlanet();
    console.log("planet", planet);
    const cached = await this.cacheService.get<FusedPlanetWeather>(planet.name);
    if (cached) return cached;

    console.log("Fusing planet weather: 1");
    const weather = await this.weatherService.getWeatherByCoordinates(
      planet.latitude,
      planet.longitude,
    );
    const fused = new FusedPlanetWeather(
      planet,
      weather,
      new Date().toISOString(),
    );
    await this.fusedRepository.save(fused);
    console.log("Fusing planet weather: 23");
    await this.cacheService.set(planet.name, fused);
    return fused;
  }
}
