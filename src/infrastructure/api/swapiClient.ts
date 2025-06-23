import axios from "axios";
import { PlanetInfo } from "@/domain/entities/FusedPlanetWeather";
import { SwapiService } from "@/application/ports/SwapiService";
import { SwapiPlanet } from "./dto/SwapiResponse";

export class SwapiClient implements SwapiService {
  async getRandomPlanet(): Promise<PlanetInfo> {
    const randomPlanetId = this.generateRandomPlanetId();
    const response = await axios.get<SwapiPlanet>(
      `https://swapi.py4e.com/api/planets/${randomPlanetId}/`,
    );
    const planet = response.data;
    return {
      name: planet.name,
      url: planet.url,
      rotationPeriod: planet.rotation_period,
      orbitalPeriod: planet.orbital_period,
      diameter: planet.diameter,
      climate: planet.climate,
      gravity: planet.gravity,
      terrain: planet.terrain,
      surfaceWater: planet.surface_water,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
    } as PlanetInfo;
  }

  generateRandomPlanetId(): number {
    return Math.floor(Math.random() * 60) + 1;
  }
}
