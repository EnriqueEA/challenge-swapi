import axios from "axios";
import { PlanetInfo } from "@/domain/entities/FusedPlanetWeather";
import { SwapiService } from "@/application/ports/SwapiService";
import { SwapiPlanet } from "./dto/SwapiResponse";
import { getRandomNumber } from "../uilts/getRandomNumber";

export class SwapiClient implements SwapiService {
  private readonly baseUrl = "https://swapi.py4e.com/api";
  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });
  }

  async getRandomPlanet(): Promise<PlanetInfo> {
    const randomPlanetId = this.generateRandomPlanetId();
    const response = await this.axiosInstance.get<SwapiPlanet>(
      `/planets/${randomPlanetId}/`,
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
      latitude: +getRandomNumber(-60, 60).toFixed(5),
      longitude: +getRandomNumber(-180, 180).toFixed(5),
    } as PlanetInfo;
  }

  generateRandomPlanetId(): number {
    return Math.floor(Math.random() * 60) + 1;
  }
}
