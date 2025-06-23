import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GetFusionHistory } from "@/application/use-cases/GetFusionHistory";
import { FusedPlanetWeatherRepository } from "./FusedPlanetWeatherRepository";

const historyUseCase = new GetFusionHistory(new FusedPlanetWeatherRepository());

export const historialHandler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const data = await historyUseCase.execute();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in historialHandler:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
