import { PlanetInfo } from "../../domain/entities/FusedPlanetWeather";

export interface SwapiService {
  getRandomPlanet(): Promise<PlanetInfo>;
}
