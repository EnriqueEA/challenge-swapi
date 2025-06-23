export interface PlanetInfo {
  name: string;
  url: string;
  rotationPeriod: string;
  orbitalPeriod: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surfaceWater: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature: string;
  windSpeed: string;
  country?: string;
  displayName?: string;
}

export class FusedPlanetWeather {
  public readonly description: string;

  constructor(
    public readonly planet: PlanetInfo,
    public readonly weather: WeatherData,
    public readonly fusedAt: string,
  ) {
    this.description = this.generateDescription();
  }

  private generateDescription(): string {
    const earthLocation = this.weather.country
      ? `${this.weather.displayName || "una ubicación"}, ${this.weather.country}`
      : this.weather.displayName || "una ubicación en la Tierra";

    return `El planeta ${this.planet.name} en las coordenadas ${this.planet.latitude}°N, ${this.planet.longitude}°E, con un clima ${this.planet.climate}, terreno ${this.planet.terrain}, tiene como equivalencia en el planeta Tierra los datos meteorológicos de ${earthLocation}, donde actualmente la temperatura es de ${this.weather.temperature} y la velocidad del viento es de ${this.weather.windSpeed}.`;
  }
}
