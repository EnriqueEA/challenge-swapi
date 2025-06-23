import { FusedPlanetWeather } from "@/domain/entities/FusedPlanetWeather";
import { FusedRepository } from "../ports/FusedRepository";

export class GetFusionHistory {
  constructor(private readonly fusedRepository: FusedRepository) {}

  async execute(
    limit: number = 10,
    offset?: Record<string, unknown>,
  ): Promise<FusedPlanetWeather[]> {
    const items = await this.fusedRepository.getAllFused(limit, offset);
    return items.items.sort((a, b) => b.fusedAt.localeCompare(a.fusedAt));
  }
}
