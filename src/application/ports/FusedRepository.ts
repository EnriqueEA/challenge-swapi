import { CustomData } from "@/domain/entities/CustomData";
import { FusedPlanetWeather } from "@/domain/entities/FusedPlanetWeather";

export interface FusedRepository {
  save(fusedPlanetWeather: FusedPlanetWeather): Promise<void>;
  saveCustomData(item: CustomData): Promise<void>;
  getAllFused(
    limit?: number,
    startKey?: Record<string, unknown>,
  ): Promise<{
    items: FusedPlanetWeather[];
    lastEvaluatedKey?: Record<string, unknown>;
    hasMore: boolean;
  }>;
}
