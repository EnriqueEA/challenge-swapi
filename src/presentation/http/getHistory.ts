import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { FusedPlanetWeatherRepository } from "@/infrastructure/db/FusedPlanetWeatherRepository";
import { GetFusionHistory } from "@/application/use-cases/GetFusionHistory";

const useCase = new GetFusionHistory(new FusedPlanetWeatherRepository());

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const data = await useCase.execute();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in history:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
