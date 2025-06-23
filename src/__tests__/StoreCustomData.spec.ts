import { StoreCustomData } from "@/application/use-cases/StoreCustomData";
import { FusedRepository } from "@/application/ports/FusedRepository";

describe("StoreCustomData", () => {
  const mockFusedRepository: FusedRepository = {
    save: jest.fn(),
    saveCustomData: jest.fn(),
    getAllFused: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe guardar datos personalizados", async () => {
    const fakeContent: Record<string, unknown> = {
      id: "1",
      value: "Value",
    };
    (mockFusedRepository.saveCustomData as jest.Mock).mockResolvedValue(
      undefined,
    );
    const useCase = new StoreCustomData(mockFusedRepository);
    const result = await useCase.execute(fakeContent);
    expect(mockFusedRepository.saveCustomData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        content: fakeContent,
        createdAt: expect.any(String),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        content: fakeContent,
        createdAt: expect.any(String),
      }),
    );
  });
});
