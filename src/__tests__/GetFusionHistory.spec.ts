import { GetFusionHistory } from "@/application/use-cases/GetFusionHistory";
import { FusedRepository } from "@/application/ports/FusedRepository";
import { FusedPlanetWeather } from "@/domain/entities/FusedPlanetWeather";

describe("GetFusionHistory", () => {
  const mockFusedRepository: FusedRepository = {
    save: jest.fn(),
    saveCustomData: jest.fn(),
    getAllFused: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe devolver el historial de fusiones", async () => {
    const fakeHistory: FusedPlanetWeather[] = [
      new FusedPlanetWeather(
        {
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
        },
        {
          temperature: "30 °C",
          windSpeed: "10 kph",
          country: "Peru",
          region: "Lima",
          city: "Lima",
          condition: "Sunny",
          humidity: "20%",
        },
        new Date().toISOString(),
      ),
    ];
    (mockFusedRepository.getAllFused as jest.Mock).mockResolvedValue({
      items: fakeHistory,
      hasMore: false,
    });
    const useCase = new GetFusionHistory(mockFusedRepository);
    const result = await useCase.execute();
    expect(result).toEqual(fakeHistory);
    expect(mockFusedRepository.getAllFused).toHaveBeenCalled();
  });
});
