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
  country: string;
  region: string;
  city: string;
  condition: string;
  humidity: string;
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
    return `El planeta ${this.planet.name} (climate de ${this.planet.climate} y terreno de ${this.planet.terrain}) con un período de rotación de ${this.planet.rotationPeriod} y diámetro de ${this.planet.diameter}, presenta condiciones atmosféricas similares a ${this.weather.city}, ${this.weather.region}, ${this.weather.country}, donde actualmente se registra ${this.weather.condition} con una temperatura de ${this.weather.temperature}, humedad del ${this.weather.humidity} y vientos de ${this.weather.windSpeed}.`;
  }
}
